package com._bet.service.Transaccion;

import com._bet.dto.TransaccionCryptoDto;
import com._bet.entity.TransaccionCrypto;
import com._bet.entity.Usuario;
import com._bet.entity.CryptoWallet;
import com._bet.repository.TransaccionCryptoRepository;
import com._bet.repository.UsuarioRepository;
import com._bet.service.cryptoWallet.CryptoConversionService;
import com._bet.repository.CryptoWalletRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TransaccionCryptoService {
    
    private final TransaccionCryptoRepository transaccionRepository;
    private final UsuarioRepository usuarioRepository;
    private final CryptoWalletRepository cryptoWalletRepository;
    private final CryptoConversionService conversionService;
    
    /**
     * Crea una nueva solicitud de transacción (depósito o retiro)
     */
    public TransaccionCryptoDto crearSolicitudTransaccion(Long usuarioId, TransaccionCryptoDto.CreateTransaccionDto createDto) {
        // Verificar que el usuario existe
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Obtener la tasa de conversión actual
        BigDecimal tasaConversion = conversionService.getTasaConversion(createDto.getTipoCrypto());
        
        // Calcular la cantidad en USD
        BigDecimal cantidadUsd = conversionService.convertirCryptoAUsd(createDto.getCantidadCrypto(), createDto.getTipoCrypto());
        
        // Validaciones específicas por tipo de transacción
        if (createDto.getTipoTransaccion() == TransaccionCrypto.TipoTransaccion.RETIRO) {
            validarRetiro(usuario, cantidadUsd);
        }
        
        // Crear la transacción
        TransaccionCrypto transaccion = new TransaccionCrypto();
        transaccion.setTipoTransaccion(createDto.getTipoTransaccion());
        transaccion.setCantidadCrypto(createDto.getCantidadCrypto());
        transaccion.setTipoCrypto(createDto.getTipoCrypto());
        transaccion.setTasaConversionUsd(tasaConversion);
        transaccion.setCantidadUsd(cantidadUsd);
        transaccion.setDireccionWallet(createDto.getDireccionWallet());
        transaccion.setObservaciones(createDto.getObservaciones());
        transaccion.setUsuario(usuario);
        
        // Asociar wallet si se proporciona
        if (createDto.getWalletId() != null) {
            CryptoWallet wallet = cryptoWalletRepository.findById(createDto.getWalletId())
                .orElse(null);
            if (wallet != null && wallet.getUsuario().getId().equals(usuarioId)) {
                transaccion.setWallet(wallet);
            }
        }
        
        TransaccionCrypto savedTransaccion = transaccionRepository.save(transaccion);
        return TransaccionCryptoDto.fromEntity(savedTransaccion);
    }
    
    /**
     * Procesa una transacción (aprobar o rechazar) - Solo admins
     */
    public TransaccionCryptoDto procesarTransaccion(
            Long transaccionId, 
            TransaccionCryptoDto.ProcesarTransaccionDto procesarDto,
            Long adminId) {
        
        // Verificar que el admin existe
        Usuario admin = usuarioRepository.findById(adminId)
            .orElseThrow(() -> new RuntimeException("Admin no encontrado"));
        
        if (admin.getRol() != Usuario.Rol.ADMIN) {
            throw new RuntimeException("Solo los administradores pueden procesar transacciones");
        }
        
        // Obtener la transacción
        TransaccionCrypto transaccion = transaccionRepository.findById(transaccionId)
            .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
        
        if (!transaccion.puedeSerProcesada()) {
            throw new RuntimeException("La transacción no puede ser procesada en su estado actual");
        }
        
        // Procesar según la decisión
        if (procesarDto.getDecision() == TransaccionCryptoDto.ProcesarTransaccionDto.DecisionTransaccion.APROBAR) {
            aprobarTransaccion(transaccion, admin, procesarDto.getHashTransaccion());
        } else {
            rechazarTransaccion(transaccion, admin, procesarDto.getMotivo());
        }
        
        TransaccionCrypto updatedTransaccion = transaccionRepository.save(transaccion);
        return TransaccionCryptoDto.fromEntity(updatedTransaccion);
    }
    
    /**
     * Aprueba una transacción y actualiza el saldo del usuario
     */
    private void aprobarTransaccion(TransaccionCrypto transaccion, Usuario admin, String hashTransaccion) {
        transaccion.aprobar(admin, hashTransaccion);
        
        // Actualizar el saldo USD del usuario
        Usuario usuario = transaccion.getUsuario();
        BigDecimal nuevoSaldo;
        
        if (transaccion.esDeposito()) {
            // Sumar al saldo
            nuevoSaldo = usuario.getSaldoUsd().add(transaccion.getCantidadUsd());
        } else {
            // Restar del saldo (ya validamos que tiene suficiente)
            nuevoSaldo = usuario.getSaldoUsd().subtract(transaccion.getCantidadUsd());
        }
        
        usuario.setSaldoUsd(nuevoSaldo);
        usuarioRepository.save(usuario);
    }
    
    /**
     * Rechaza una transacción
     */
    private void rechazarTransaccion(TransaccionCrypto transaccion, Usuario admin, String motivo) {
        transaccion.rechazar(admin, motivo);
    }
    
    /**
     * Valida si un usuario puede realizar un retiro
     */
    private void validarRetiro(Usuario usuario, BigDecimal cantidadUsd) {
        if (usuario.getSaldoUsd().compareTo(cantidadUsd) < 0) {
            throw new RuntimeException("Saldo insuficiente para realizar el retiro");
        }
        
        // Verificar que no tenga retiros pendientes muy recientes
        List<TransaccionCrypto> retirosPendientes = transaccionRepository
            .findByUsuarioAndTipoTransaccionAndEstado(
                usuario, 
                TransaccionCrypto.TipoTransaccion.RETIRO, 
                TransaccionCrypto.EstadoTransaccion.PENDIENTE
            );
        
        if (retirosPendientes.size() >= 3) {
            throw new RuntimeException("Tiene demasiados retiros pendientes. Espere a que sean procesados.");
        }
    }
    
    /**
     * Cancela una transacción pendiente
     */
    public void cancelarTransaccion(Long transaccionId, Long usuarioId) {
        TransaccionCrypto transaccion = transaccionRepository.findById(transaccionId)
            .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
        
        if (!transaccion.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("No tiene permisos para cancelar esta transacción");
        }
        
        if (!transaccion.puedeSerProcesada()) {
            throw new RuntimeException("La transacción no puede ser cancelada en su estado actual");
        }
        
        transaccion.cancelar("Cancelado por el usuario");
        transaccionRepository.save(transaccion);
    }
    
    /**
     * Obtiene todas las transacciones de un usuario
     */
    @Transactional(readOnly = true)
    public List<TransaccionCryptoDto> getTransaccionesByUsuario(Long usuarioId) {
        return transaccionRepository.findByUsuarioId(usuarioId)
            .stream()
            .map(TransaccionCryptoDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene las transacciones de un usuario paginadas
     */
    @Transactional(readOnly = true)
    public Page<TransaccionCryptoDto> getTransaccionesByUsuario(Long usuarioId, Pageable pageable) {
        return transaccionRepository.findByUsuarioId(usuarioId, pageable)
            .map(TransaccionCryptoDto::fromEntity);
    }
    
    /**
     * Obtiene las transacciones pendientes para administradores
     */
    @Transactional(readOnly = true)
    public List<TransaccionCryptoDto> getTransaccionesPendientes() {
        return transaccionRepository.findTransaccionesPendientes()
            .stream()
            .map(TransaccionCryptoDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene las transacciones pendientes paginadas
     */
    @Transactional(readOnly = true)
    public Page<TransaccionCryptoDto> getTransaccionesPendientes(Pageable pageable) {
        return transaccionRepository.findTransaccionesPendientes(pageable)
            .map(TransaccionCryptoDto::fromEntity);
    }
    
    /**
     * Obtiene una transacción específica
     */
    @Transactional(readOnly = true)
    public TransaccionCryptoDto getTransaccionById(Long transaccionId) {
        TransaccionCrypto transaccion = transaccionRepository.findById(transaccionId)
            .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
        
        return TransaccionCryptoDto.fromEntity(transaccion);
    }
    
    /**
     * Obtiene el resumen de transacciones de un usuario
     */
    @Transactional(readOnly = true)
    public List<TransaccionCryptoDto.TransaccionSummaryDto> getResumenTransacciones(Long usuarioId) {
        return transaccionRepository.findByUsuarioId(usuarioId)
            .stream()
            .map(TransaccionCryptoDto.TransaccionSummaryDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene estadísticas de transacciones de un usuario
     */
    @Transactional(readOnly = true)
    public TransaccionCryptoDto.EstadisticasTransaccionDto getEstadisticasUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        List<TransaccionCrypto> transacciones = transaccionRepository.findByUsuario(usuario);
        
        long totalTransacciones = transacciones.size();
        long pendientes = transacciones.stream()
            .mapToLong(t -> t.getEstado() == TransaccionCrypto.EstadoTransaccion.PENDIENTE ? 1 : 0)
            .sum();
        long aprobadas = transacciones.stream()
            .mapToLong(t -> t.getEstado() == TransaccionCrypto.EstadoTransaccion.APROBADO ? 1 : 0)
            .sum();
        long rechazadas = transacciones.stream()
            .mapToLong(t -> t.getEstado() == TransaccionCrypto.EstadoTransaccion.RECHAZADO ? 1 : 0)
            .sum();
        
        BigDecimal totalDepositos = transaccionRepository.sumDepositosAprobadosByUsuario(usuario);
        BigDecimal totalRetiros = transaccionRepository.sumRetirosAprobadosByUsuario(usuario);
        BigDecimal volumenTotal = totalDepositos.add(totalRetiros);
        
        return new TransaccionCryptoDto.EstadisticasTransaccionDto(
            totalTransacciones, pendientes, aprobadas, rechazadas,
            totalDepositos, totalRetiros, volumenTotal
        );
    }
    
    /**
     * Obtiene transacciones filtradas
     */
    @Transactional(readOnly = true)
    public List<TransaccionCryptoDto> getTransaccionesFiltradas(TransaccionCryptoDto.FiltroTransaccionDto filtro) {
        // Implementación básica - en producción usar Specifications o Criteria API
        List<TransaccionCrypto> transacciones = transaccionRepository.findAll();
        
        return transacciones.stream()
            .filter(t -> filtro.getTipoTransaccion() == null || t.getTipoTransaccion() == filtro.getTipoTransaccion())
            .filter(t -> filtro.getEstado() == null || t.getEstado() == filtro.getEstado())
            .filter(t -> filtro.getTipoCrypto() == null || t.getTipoCrypto() == filtro.getTipoCrypto())
            .filter(t -> filtro.getUsuarioId() == null || t.getUsuario().getId().equals(filtro.getUsuarioId()))
            .filter(t -> filtro.getFechaInicio() == null || t.getFechaCreacion().isAfter(filtro.getFechaInicio()))
            .filter(t -> filtro.getFechaFin() == null || t.getFechaCreacion().isBefore(filtro.getFechaFin()))
            .map(TransaccionCryptoDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene las últimas transacciones de un usuario
     */
    @Transactional(readOnly = true)
    public List<TransaccionCryptoDto> getUltimasTransacciones(Long usuarioId, int limite) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return transaccionRepository.findUltimasTransaccionesByUsuario(
                usuario, 
                org.springframework.data.domain.PageRequest.of(0, limite)
            )
            .stream()
            .map(TransaccionCryptoDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Recalcula las tasas de conversión para transacciones pendientes
     */
    public void recalcularTasasConversionPendientes() {
        List<TransaccionCrypto> pendientes = transaccionRepository.findTransaccionesPendientes();
        
        for (TransaccionCrypto transaccion : pendientes) {
            BigDecimal nuevaTasa = conversionService.getTasaConversion(transaccion.getTipoCrypto());
            BigDecimal nuevaCantidadUsd = conversionService.convertirCryptoAUsd(
                transaccion.getCantidadCrypto(), 
                transaccion.getTipoCrypto()
            );
            
            transaccion.setTasaConversionUsd(nuevaTasa);
            transaccion.setCantidadUsd(nuevaCantidadUsd);
        }
        
        transaccionRepository.saveAll(pendientes);
    }
}
