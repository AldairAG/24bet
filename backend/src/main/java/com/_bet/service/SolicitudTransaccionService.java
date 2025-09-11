package com._bet.service;

import com._bet.entity.*;
import com._bet.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio para gestionar solicitudes de depósito y retiro con aprobación
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SolicitudTransaccionService {

    private final SolicitudDepositoRepository solicitudDepositoRepository;
    private final SolicitudRetiroRepository solicitudRetiroRepository;
    private final UsuarioRepository usuarioRepository;

    @Value("${transactions.deposit.minimum:1.00}")
    private BigDecimal depositoMinimo = BigDecimal.valueOf(1.00);

    @Value("${transactions.withdrawal.minimum:10.00}")
    private BigDecimal retiroMinimo = BigDecimal.valueOf(10.00);

    @Value("${transactions.withdrawal.commission:0.05}")
    private BigDecimal comisionRetiro = BigDecimal.valueOf(0.05); // 5%

    @Value("${transactions.withdrawal.verification.threshold:1000.00}")
    private BigDecimal montoVerificacion = BigDecimal.valueOf(1000.00);

    // ============ SOLICITUDES DE DEPÓSITO ============

    /**
     * Crea una nueva solicitud de depósito
     */
    @Transactional
    public SolicitudDeposito crearSolicitudDeposito(Long usuarioId, SolicitudDepositoDto dto) {
        log.info("Creando solicitud de depósito para usuario {} por monto {}", usuarioId, dto.getMonto());

        // Validaciones
        if (dto.getMonto().compareTo(depositoMinimo) < 0) {
            throw new RuntimeException("El monto mínimo de depósito es " + depositoMinimo);
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Crear solicitud de depósito
        SolicitudDeposito solicitud = SolicitudDeposito.builder()
            .usuario(usuario)
            .monto(dto.getMonto())
            .metodoPago(dto.getMetodoPago())
            .comprobantePago(dto.getComprobantePago())
            .referenciaTransaccion(dto.getReferenciaTransaccion())
            .observacionesUsuario(dto.getObservaciones())
            .tipoCrypto(dto.getTipoCrypto())
            .direccionWallet(dto.getDireccionWallet())
            .hashTransaccion(dto.getHashTransaccion())
            .estado(SolicitudDeposito.EstadoSolicitud.PENDIENTE)
            .build();

        solicitud = solicitudDepositoRepository.save(solicitud);
        
        log.info("Solicitud de depósito creada con ID: {} para usuario: {}", solicitud.getId(), usuarioId);
        return solicitud;
    }

    /**
     * Aprueba una solicitud de depósito y transfiere fondos
     */
    @Transactional
    public SolicitudDeposito aprobarSolicitudDeposito(Long solicitudId, Long adminId, String observaciones) {
        log.info("Aprobando solicitud de depósito: {} por admin: {}", solicitudId, adminId);

        SolicitudDeposito solicitud = solicitudDepositoRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud de depósito no encontrada"));

        if (solicitud.getEstado() != SolicitudDeposito.EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("La solicitud ya fue procesada");
        }

        Usuario admin = usuarioRepository.findById(adminId)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        Usuario usuario = solicitud.getUsuario();

        // Actualizar solicitud
        solicitud.setEstado(SolicitudDeposito.EstadoSolicitud.APROBADA);
        solicitud.setAprobadoPor(admin);
        solicitud.setObservacionesAdmin(observaciones);
        solicitud.setFechaProcesamiento(LocalDateTime.now());

        // Transferir fondos al usuario
        BigDecimal saldoAnterior = usuario.getSaldoUsd();
        BigDecimal nuevoSaldo = saldoAnterior.add(solicitud.getMonto());
        usuario.setSaldoUsd(nuevoSaldo);
        usuarioRepository.save(usuario);

        // Marcar como completada
        solicitud.setEstado(SolicitudDeposito.EstadoSolicitud.COMPLETADA);
        solicitud = solicitudDepositoRepository.save(solicitud);

        log.info("Solicitud de depósito {} aprobada. Saldo usuario actualizado de {} a {}", 
            solicitudId, saldoAnterior, nuevoSaldo);

        return solicitud;
    }

    /**
     * Rechaza una solicitud de depósito
     */
    @Transactional
    public SolicitudDeposito rechazarSolicitudDeposito(Long solicitudId, Long adminId, String motivo) {
        log.info("Rechazando solicitud de depósito: {} por admin: {}", solicitudId, adminId);

        SolicitudDeposito solicitud = solicitudDepositoRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud de depósito no encontrada"));

        if (solicitud.getEstado() != SolicitudDeposito.EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("La solicitud ya fue procesada");
        }

        Usuario admin = usuarioRepository.findById(adminId)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        solicitud.setEstado(SolicitudDeposito.EstadoSolicitud.RECHAZADA);
        solicitud.setAprobadoPor(admin);
        solicitud.setObservacionesAdmin(motivo);
        solicitud.setFechaProcesamiento(LocalDateTime.now());

        solicitud = solicitudDepositoRepository.save(solicitud);
        
        log.info("Solicitud de depósito {} rechazada por: {}", solicitudId, motivo);
        return solicitud;
    }

    // ============ SOLICITUDES DE RETIRO ============

    /**
     * Crea una nueva solicitud de retiro
     */
    @Transactional
    public SolicitudRetiro crearSolicitudRetiro(Long usuarioId, SolicitudRetiroDto dto) {
        log.info("Creando solicitud de retiro para usuario {} por monto {}", usuarioId, dto.getMonto());

        // Validaciones
        if (dto.getMonto().compareTo(retiroMinimo) < 0) {
            throw new RuntimeException("El monto mínimo de retiro es " + retiroMinimo);
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar saldo suficiente
        if (usuario.getSaldoUsd().compareTo(dto.getMonto()) < 0) {
            throw new RuntimeException("Saldo insuficiente para el retiro");
        }

        // Calcular comisión y monto neto
        BigDecimal comision = dto.getMonto().multiply(comisionRetiro);
        BigDecimal montoNeto = dto.getMonto().subtract(comision);

        // Bloquear fondos del usuario
        BigDecimal nuevoSaldo = usuario.getSaldoUsd().subtract(dto.getMonto());
        usuario.setSaldoUsd(nuevoSaldo);
        usuarioRepository.save(usuario);

        // Crear solicitud de retiro
        SolicitudRetiro solicitud = SolicitudRetiro.builder()
            .usuario(usuario)
            .monto(dto.getMonto())
            .metodoRetiro(dto.getMetodoRetiro())
            .cuentaDestino(dto.getCuentaDestino())
            .banco(dto.getBanco())
            .numeroCuenta(dto.getNumeroCuenta())
            .titularCuenta(dto.getTitularCuenta())
            .direccionWallet(dto.getDireccionWallet())
            .tipoCrypto(dto.getTipoCrypto())
            .observacionesUsuario(dto.getObservaciones())
            .comision(comision)
            .montoNeto(montoNeto)
            .estado(SolicitudRetiro.EstadoSolicitud.PENDIENTE)
            .build();

        solicitud = solicitudRetiroRepository.save(solicitud);
        
        log.info("Solicitud de retiro creada con ID: {} para usuario: {}. Fondos bloqueados.", 
            solicitud.getId(), usuarioId);
        return solicitud;
    }

    /**
     * Aprueba una solicitud de retiro
     */
    @Transactional
    public SolicitudRetiro aprobarSolicitudRetiro(Long solicitudId, Long adminId, String observaciones, String referenciaTransaccion) {
        log.info("Aprobando solicitud de retiro: {} por admin: {}", solicitudId, adminId);

        SolicitudRetiro solicitud = solicitudRetiroRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud de retiro no encontrada"));

        if (solicitud.getEstado() != SolicitudRetiro.EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("La solicitud ya fue procesada");
        }

        Usuario admin = usuarioRepository.findById(adminId)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        // Actualizar solicitud
        solicitud.setEstado(SolicitudRetiro.EstadoSolicitud.APROBADA);
        solicitud.setAprobadoPor(admin);
        solicitud.setObservacionesAdmin(observaciones);
        solicitud.setReferenciaTransaccion(referenciaTransaccion);
        solicitud.setFechaProcesamiento(LocalDateTime.now());

        // Marcar como completada (los fondos ya fueron descontados al crear la solicitud)
        solicitud.setEstado(SolicitudRetiro.EstadoSolicitud.COMPLETADA);
        solicitud = solicitudRetiroRepository.save(solicitud);

        log.info("Solicitud de retiro {} aprobada y completada", solicitudId);
        return solicitud;
    }

    /**
     * Rechaza una solicitud de retiro y devuelve fondos
     */
    @Transactional
    public SolicitudRetiro rechazarSolicitudRetiro(Long solicitudId, Long adminId, String motivo) {
        log.info("Rechazando solicitud de retiro: {} por admin: {}", solicitudId, adminId);

        SolicitudRetiro solicitud = solicitudRetiroRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud de retiro no encontrada"));

        if (solicitud.getEstado() != SolicitudRetiro.EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("La solicitud ya fue procesada");
        }

        Usuario admin = usuarioRepository.findById(adminId)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        Usuario usuario = solicitud.getUsuario();

        // Devolver fondos al usuario
        BigDecimal nuevoSaldo = usuario.getSaldoUsd().add(solicitud.getMonto());
        usuario.setSaldoUsd(nuevoSaldo);
        usuarioRepository.save(usuario);

        solicitud.setEstado(SolicitudRetiro.EstadoSolicitud.RECHAZADA);
        solicitud.setAprobadoPor(admin);
        solicitud.setObservacionesAdmin(motivo);
        solicitud.setFechaProcesamiento(LocalDateTime.now());

        solicitud = solicitudRetiroRepository.save(solicitud);
        
        log.info("Solicitud de retiro {} rechazada. Fondos devueltos al usuario", solicitudId);
        return solicitud;
    }

    // ============ CONSULTAS ============

    /**
     * Obtiene solicitudes de depósito por usuario
     */
    public Page<SolicitudDeposito> obtenerSolicitudesDepositoPorUsuario(Long usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return solicitudDepositoRepository.findByUsuarioOrderByFechaSolicitudDesc(usuario, pageable);
    }

    /**
     * Obtiene solicitudes de retiro por usuario
     */
    public Page<SolicitudRetiro> obtenerSolicitudesRetiroPorUsuario(Long usuarioId, Pageable pageable) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return solicitudRetiroRepository.findByUsuarioOrderByFechaSolicitudDesc(usuario, pageable);
    }

    /**
     * Obtiene solicitudes de depósito pendientes
     */
    public List<SolicitudDeposito> obtenerSolicitudesDepositoPendientes() {
        return solicitudDepositoRepository.findByEstadoOrderByFechaSolicitudAsc(SolicitudDeposito.EstadoSolicitud.PENDIENTE);
    }

    /**
     * Obtiene solicitudes de retiro pendientes
     */
    public List<SolicitudRetiro> obtenerSolicitudesRetiroPendientes() {
        return solicitudRetiroRepository.findByEstadoOrderByFechaSolicitudAsc(SolicitudRetiro.EstadoSolicitud.PENDIENTE);
    }

    /**
     * Obtiene estadísticas de transacciones
     */
    public EstadisticasTransaccionesDto obtenerEstadisticas() {
        long depositosPendientes = solicitudDepositoRepository.countByEstado(SolicitudDeposito.EstadoSolicitud.PENDIENTE);
        long retirosPendientes = solicitudRetiroRepository.countByEstado(SolicitudRetiro.EstadoSolicitud.PENDIENTE);
        
        LocalDateTime hoy = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime manana = hoy.plusDays(1);
        
        BigDecimal depositosHoy = solicitudDepositoRepository.sumMontoCompletadoByFecha(hoy, manana);
        BigDecimal retirosHoy = solicitudRetiroRepository.sumMontoCompletadoByFecha(hoy, manana);
        
        if (depositosHoy == null) depositosHoy = BigDecimal.ZERO;
        if (retirosHoy == null) retirosHoy = BigDecimal.ZERO;

        return new EstadisticasTransaccionesDto(
            depositosPendientes,
            retirosPendientes,
            depositosHoy,
            retirosHoy
        );
    }

    // ============ DTOs ============

    public static class SolicitudDepositoDto {
        private BigDecimal monto;
        private SolicitudDeposito.MetodoPago metodoPago;
        private String comprobantePago;
        private String referenciaTransaccion;
        private String observaciones;
        private SolicitudDeposito.TipoCrypto tipoCrypto;
        private String direccionWallet;
        private String hashTransaccion;

        // Getters y setters
        public BigDecimal getMonto() { return monto; }
        public void setMonto(BigDecimal monto) { this.monto = monto; }
        public SolicitudDeposito.MetodoPago getMetodoPago() { return metodoPago; }
        public void setMetodoPago(SolicitudDeposito.MetodoPago metodoPago) { this.metodoPago = metodoPago; }
        public String getComprobantePago() { return comprobantePago; }
        public void setComprobantePago(String comprobantePago) { this.comprobantePago = comprobantePago; }
        public String getReferenciaTransaccion() { return referenciaTransaccion; }
        public void setReferenciaTransaccion(String referenciaTransaccion) { this.referenciaTransaccion = referenciaTransaccion; }
        public String getObservaciones() { return observaciones; }
        public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
        public SolicitudDeposito.TipoCrypto getTipoCrypto() { return tipoCrypto; }
        public void setTipoCrypto(SolicitudDeposito.TipoCrypto tipoCrypto) { this.tipoCrypto = tipoCrypto; }
        public String getDireccionWallet() { return direccionWallet; }
        public void setDireccionWallet(String direccionWallet) { this.direccionWallet = direccionWallet; }
        public String getHashTransaccion() { return hashTransaccion; }
        public void setHashTransaccion(String hashTransaccion) { this.hashTransaccion = hashTransaccion; }
    }

    public static class SolicitudRetiroDto {
        private BigDecimal monto;
        private SolicitudRetiro.MetodoRetiro metodoRetiro;
        private String cuentaDestino;
        private String banco;
        private String numeroCuenta;
        private String titularCuenta;
        private String direccionWallet;
        private SolicitudRetiro.TipoCrypto tipoCrypto;
        private String observaciones;

        // Getters y setters
        public BigDecimal getMonto() { return monto; }
        public void setMonto(BigDecimal monto) { this.monto = monto; }
        public SolicitudRetiro.MetodoRetiro getMetodoRetiro() { return metodoRetiro; }
        public void setMetodoRetiro(SolicitudRetiro.MetodoRetiro metodoRetiro) { this.metodoRetiro = metodoRetiro; }
        public String getCuentaDestino() { return cuentaDestino; }
        public void setCuentaDestino(String cuentaDestino) { this.cuentaDestino = cuentaDestino; }
        public String getBanco() { return banco; }
        public void setBanco(String banco) { this.banco = banco; }
        public String getNumeroCuenta() { return numeroCuenta; }
        public void setNumeroCuenta(String numeroCuenta) { this.numeroCuenta = numeroCuenta; }
        public String getTitularCuenta() { return titularCuenta; }
        public void setTitularCuenta(String titularCuenta) { this.titularCuenta = titularCuenta; }
        public String getDireccionWallet() { return direccionWallet; }
        public void setDireccionWallet(String direccionWallet) { this.direccionWallet = direccionWallet; }
        public SolicitudRetiro.TipoCrypto getTipoCrypto() { return tipoCrypto; }
        public void setTipoCrypto(SolicitudRetiro.TipoCrypto tipoCrypto) { this.tipoCrypto = tipoCrypto; }
        public String getObservaciones() { return observaciones; }
        public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    }

    public static class EstadisticasTransaccionesDto {
        private final long depositosPendientes;
        private final long retirosPendientes;
        private final BigDecimal depositosHoy;
        private final BigDecimal retirosHoy;

        public EstadisticasTransaccionesDto(long depositosPendientes, long retirosPendientes, 
                                          BigDecimal depositosHoy, BigDecimal retirosHoy) {
            this.depositosPendientes = depositosPendientes;
            this.retirosPendientes = retirosPendientes;
            this.depositosHoy = depositosHoy;
            this.retirosHoy = retirosHoy;
        }

        public long getDepositosPendientes() { return depositosPendientes; }
        public long getRetirosPendientes() { return retirosPendientes; }
        public BigDecimal getDepositosHoy() { return depositosHoy; }
        public BigDecimal getRetirosHoy() { return retirosHoy; }
    }

    // ========== MÉTODOS ADICIONALES PARA USUARIOS ==========

    @Transactional(readOnly = true)
    public List<SolicitudDeposito> obtenerDepositosPorUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return solicitudDepositoRepository.findByUsuarioOrderByFechaSolicitudDesc(usuario);
    }

    @Transactional(readOnly = true)
    public List<SolicitudRetiro> obtenerRetirosPorUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return solicitudRetiroRepository.findByUsuarioOrderByFechaSolicitudDesc(usuario);
    }

    @Transactional(readOnly = true)
    public SolicitudDeposito obtenerDepositoPorId(Long solicitudId) {
        return solicitudDepositoRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud de depósito no encontrada"));
    }

    @Transactional(readOnly = true)
    public SolicitudRetiro obtenerRetiroPorId(Long solicitudId) {
        return solicitudRetiroRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud de retiro no encontrada"));
    }

    @Transactional
    public SolicitudDeposito cancelarSolicitudDeposito(Long solicitudId, Long usuarioId) {
        SolicitudDeposito solicitud = solicitudDepositoRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud de depósito no encontrada"));

        if (!solicitud.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("No tiene permisos para cancelar esta solicitud");
        }

        if (solicitud.getEstado() != SolicitudDeposito.EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("Solo se pueden cancelar solicitudes pendientes");
        }

        solicitud.setEstado(SolicitudDeposito.EstadoSolicitud.CANCELADA);
        solicitud.setFechaProcesamiento(LocalDateTime.now());

        log.info("Solicitud de depósito {} cancelada por el usuario {}", solicitudId, usuarioId);
        return solicitudDepositoRepository.save(solicitud);
    }

    @Transactional
    public SolicitudRetiro cancelarSolicitudRetiro(Long solicitudId, Long usuarioId) {
        SolicitudRetiro solicitud = solicitudRetiroRepository.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud de retiro no encontrada"));

        if (!solicitud.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("No tiene permisos para cancelar esta solicitud");
        }

        if (solicitud.getEstado() != SolicitudRetiro.EstadoSolicitud.PENDIENTE) {
            throw new RuntimeException("Solo se pueden cancelar solicitudes pendientes");
        }

        // Liberar los fondos bloqueados
        Usuario usuario = solicitud.getUsuario();
        usuario.setSaldoUsd(usuario.getSaldoUsd().add(solicitud.getMonto()));
        usuarioRepository.save(usuario);

        solicitud.setEstado(SolicitudRetiro.EstadoSolicitud.CANCELADA);
        solicitud.setFechaProcesamiento(LocalDateTime.now());

        log.info("Solicitud de retiro {} cancelada por el usuario {}. Fondos liberados.", solicitudId, usuarioId);
        return solicitudRetiroRepository.save(solicitud);
    }
}
