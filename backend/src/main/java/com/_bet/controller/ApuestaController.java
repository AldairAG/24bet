package com._bet.controller;

import com._bet.entity.Apuesta;
import com._bet.entity.Parlay;
import com._bet.entity.Usuario;
import com._bet.entity.Momio;
import com._bet.repository.ApuestaRepository;
import com._bet.repository.ParlayRepository;
import com._bet.repository.UsuarioRepository;
import com._bet.repository.MomioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Controlador REST para gestionar apuestas
 */
@RestController
@RequestMapping("/api/apuestas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ApuestaController {

    private final ApuestaRepository apuestaRepository;
    private final ParlayRepository parlayRepository;
    private final UsuarioRepository usuarioRepository;
    private final MomioRepository momioRepository;

    /**
     * Obtiene el historial de apuestas de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<Apuesta>> obtenerHistorialApuestas(
            @PathVariable Long usuarioId,
            Pageable pageable) {
        log.info("Obteniendo historial de apuestas para usuario: {}", usuarioId);
        
        Page<Apuesta> apuestas = apuestaRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId, pageable);
        return ResponseEntity.ok(apuestas);
    }

    /**
     * Obtiene apuestas activas de un usuario
     */
    @GetMapping("/usuario/{usuarioId}/activas")
    public ResponseEntity<List<Apuesta>> obtenerApuestasActivas(@PathVariable Long usuarioId) {
        log.info("Obteniendo apuestas activas para usuario: {}", usuarioId);
        
        List<Apuesta> apuestas = apuestaRepository.findByUsuarioIdAndEstado(usuarioId, Apuesta.EstadoApuesta.ACTIVA);
        return ResponseEntity.ok(apuestas);
    }

    /**
     * Obtiene una apuesta específica
     */
    @GetMapping("/{apuestaId}")
    public ResponseEntity<Apuesta> obtenerApuesta(@PathVariable Long apuestaId) {
        log.info("Obteniendo apuesta: {}", apuestaId);
        
        Apuesta apuesta = apuestaRepository.findById(apuestaId)
            .orElseThrow(() -> new RuntimeException("Apuesta no encontrada"));
            
        return ResponseEntity.ok(apuesta);
    }

    /**
     * Crea una apuesta simple
     */
    @PostMapping("/crear")
    public ResponseEntity<Apuesta> crearApuesta(@RequestBody CrearApuestaDto dto) {
        log.info("Creando apuesta para usuario {} en momio {} por monto {}", 
            dto.getUsuarioId(), dto.getMomioId(), dto.getMonto());

        try {
            // Validaciones básicas
            if (dto.getMonto().compareTo(BigDecimal.valueOf(1.00)) < 0) {
                throw new RuntimeException("El monto mínimo de apuesta es $1.00");
            }
            if (dto.getMonto().compareTo(BigDecimal.valueOf(10000.00)) > 0) {
                throw new RuntimeException("El monto máximo de apuesta es $10,000.00");
            }

            Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Momio momio = momioRepository.findById(dto.getMomioId())
                .orElseThrow(() -> new RuntimeException("Momio no encontrado"));

            // Validar saldo del usuario
            if (usuario.getSaldoUsd().compareTo(dto.getMonto()) < 0) {
                throw new RuntimeException("Saldo insuficiente para realizar la apuesta");
            }

            // Validar que el evento no haya comenzado
            if (momio.getEventoDeportivo().getFechaEvento().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("No se puede apostar en un evento que ya comenzó");
            }

            // Crear la apuesta
            Apuesta apuesta = new Apuesta();
            apuesta.setUsuario(usuario);
            apuesta.setEventoDeportivo(momio.getEventoDeportivo());
            apuesta.setTipoApuesta(dto.getTipoApuesta());
            apuesta.setMonto(dto.getMonto());
            apuesta.setMomio(momio.getValor());
            apuesta.setGananciaPotencial(dto.getMonto().multiply(momio.getValor()));
            apuesta.setEstado(Apuesta.EstadoApuesta.ACTIVA);
            apuesta.setObservaciones(momio.getResultado().toString());

            // Descontar saldo del usuario
            usuario.setSaldoUsd(usuario.getSaldoUsd().subtract(dto.getMonto()));
            usuarioRepository.save(usuario);

            // Guardar apuesta
            apuesta = apuestaRepository.save(apuesta);
            
            log.info("Apuesta creada exitosamente con ID: {}", apuesta.getId());
            return ResponseEntity.ok(apuesta);

        } catch (Exception e) {
            log.error("Error creando apuesta: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Obtiene estadísticas de apuestas de un usuario
     */
    @GetMapping("/usuario/{usuarioId}/estadisticas")
    public ResponseEntity<EstadisticasApuestasDto> obtenerEstadisticasUsuario(@PathVariable Long usuarioId) {
        log.info("Obteniendo estadísticas de apuestas para usuario: {}", usuarioId);

        List<Apuesta> apuestasLiquidadas = apuestaRepository.findByUsuarioIdAndEstado(usuarioId, Apuesta.EstadoApuesta.LIQUIDADA);
        
        long apuestasGanadas = apuestasLiquidadas.stream()
            .filter(apuesta -> apuesta.getResultadoFinal() == Apuesta.ResultadoFinal.GANADA)
            .count();
        
        long apuestasPerdidas = apuestasLiquidadas.stream()
            .filter(apuesta -> apuesta.getResultadoFinal() == Apuesta.ResultadoFinal.PERDIDA)
            .count();
        
        BigDecimal totalApostado = apuestasLiquidadas.stream()
            .map(Apuesta::getMonto)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalGanado = apuestasLiquidadas.stream()
            .filter(apuesta -> apuesta.getResultadoFinal() == Apuesta.ResultadoFinal.GANADA)
            .map(Apuesta::getGananciaPotencial)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        EstadisticasApuestasDto estadisticas = new EstadisticasApuestasDto(
            apuestasGanadas,
            apuestasPerdidas,
            totalApostado,
            totalGanado,
            apuestasLiquidadas.size()
        );

        return ResponseEntity.ok(estadisticas);
    }

    /**
     * Obtiene apuestas por evento
     */
    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<Apuesta>> obtenerApuestasPorEvento(@PathVariable Long eventoId) {
        log.info("Obteniendo apuestas para evento: {}", eventoId);
        
        List<Apuesta> apuestas = apuestaRepository.findByEventoDeportivoIdAndEstado(eventoId, Apuesta.EstadoApuesta.ACTIVA);
        return ResponseEntity.ok(apuestas);
    }

    /**
     * Obtiene estadísticas generales del sistema de apuestas
     */
    @GetMapping("/estadisticas/sistema")
    public ResponseEntity<EstadisticasSistemaDto> obtenerEstadisticasSistema() {
        log.info("Obteniendo estadísticas generales del sistema");

        long totalApuestas = apuestaRepository.count();
        long apuestasActivas = apuestaRepository.countByEstado(Apuesta.EstadoApuesta.ACTIVA);
        long apuestasLiquidadas = apuestaRepository.countByEstado(Apuesta.EstadoApuesta.LIQUIDADA);
        
        // Total apostado en las últimas 24 horas
        LocalDateTime hace24Horas = LocalDateTime.now().minusHours(24);
        BigDecimal totalApostado24h = apuestaRepository.sumMontoByFechaCreacionAfter(hace24Horas);
        if (totalApostado24h == null) totalApostado24h = BigDecimal.ZERO;

        EstadisticasSistemaDto estadisticas = new EstadisticasSistemaDto(
            totalApuestas,
            apuestasActivas,
            apuestasLiquidadas,
            totalApostado24h
        );

        return ResponseEntity.ok(estadisticas);
    }

    // DTOs para requests y responses

    public static class CrearApuestaDto {
        private Long usuarioId;
        private Long momioId;
        private BigDecimal monto;
        private Apuesta.TipoApuesta tipoApuesta;

        // Getters y setters
        public Long getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
        public Long getMomioId() { return momioId; }
        public void setMomioId(Long momioId) { this.momioId = momioId; }
        public BigDecimal getMonto() { return monto; }
        public void setMonto(BigDecimal monto) { this.monto = monto; }
        public Apuesta.TipoApuesta getTipoApuesta() { return tipoApuesta; }
        public void setTipoApuesta(Apuesta.TipoApuesta tipoApuesta) { this.tipoApuesta = tipoApuesta; }
    }

    public static class EstadisticasApuestasDto {
        private final long apuestasGanadas;
        private final long apuestasPerdidas;
        private final BigDecimal totalApostado;
        private final BigDecimal totalGanado;
        private final int totalApuestas;

        public EstadisticasApuestasDto(long apuestasGanadas, long apuestasPerdidas, 
                                     BigDecimal totalApostado, BigDecimal totalGanado, int totalApuestas) {
            this.apuestasGanadas = apuestasGanadas;
            this.apuestasPerdidas = apuestasPerdidas;
            this.totalApostado = totalApostado;
            this.totalGanado = totalGanado;
            this.totalApuestas = totalApuestas;
        }

        public long getApuestasGanadas() { return apuestasGanadas; }
        public long getApuestasPerdidas() { return apuestasPerdidas; }
        public BigDecimal getTotalApostado() { return totalApostado; }
        public BigDecimal getTotalGanado() { return totalGanado; }
        public int getTotalApuestas() { return totalApuestas; }
        
        public BigDecimal getPorcentajeExito() {
            if (totalApuestas == 0) return BigDecimal.ZERO;
            return BigDecimal.valueOf(apuestasGanadas)
                .divide(BigDecimal.valueOf(totalApuestas), 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        }
        
        public BigDecimal getGananciaNeta() {
            return totalGanado.subtract(totalApostado);
        }
    }

    public static class EstadisticasSistemaDto {
        private final long totalApuestas;
        private final long apuestasActivas;
        private final long apuestasLiquidadas;
        private final BigDecimal totalApostado24h;

        public EstadisticasSistemaDto(long totalApuestas, long apuestasActivas, 
                                     long apuestasLiquidadas, BigDecimal totalApostado24h) {
            this.totalApuestas = totalApuestas;
            this.apuestasActivas = apuestasActivas;
            this.apuestasLiquidadas = apuestasLiquidadas;
            this.totalApostado24h = totalApostado24h;
        }

        public long getTotalApuestas() { return totalApuestas; }
        public long getApuestasActivas() { return apuestasActivas; }
        public long getApuestasLiquidadas() { return apuestasLiquidadas; }
        public BigDecimal getTotalApostado24h() { return totalApostado24h; }
    }
}
