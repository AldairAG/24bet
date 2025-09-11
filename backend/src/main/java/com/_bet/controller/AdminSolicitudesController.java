package com._bet.controller;

import com._bet.entity.SolicitudDeposito;
import com._bet.entity.SolicitudRetiro;
import com._bet.service.SolicitudTransaccionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para que los administradores gestionen solicitudes de depósito y retiro
 */
@RestController
@RequestMapping("/24bet/admin/solicitudes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSolicitudesController {

    private final SolicitudTransaccionService solicitudTransaccionService;

    // ========== SOLICITUDES DE DEPÓSITO ==========

    /**
     * Obtiene todas las solicitudes de depósito pendientes
     */
    @GetMapping("/depositos/pendientes")
    public ResponseEntity<List<SolicitudDeposito>> obtenerDepositosPendientes() {
        log.info("Obteniendo solicitudes de depósito pendientes");
        List<SolicitudDeposito> solicitudes = solicitudTransaccionService.obtenerSolicitudesDepositoPendientes();
        return ResponseEntity.ok(solicitudes);
    }

    /**
     * Aprueba una solicitud de depósito
     */
    @PostMapping("/depositos/{solicitudId}/aprobar")
    public ResponseEntity<SolicitudDeposito> aprobarDeposito(
            @PathVariable Long solicitudId,
            @RequestBody AprobarSolicitudDto dto) {
        
        try {
            log.info("Aprobando solicitud de depósito: {} por admin: {}", solicitudId, dto.getAdminId());
            SolicitudDeposito solicitud = solicitudTransaccionService.aprobarSolicitudDeposito(
                solicitudId, dto.getAdminId(), dto.getObservaciones());
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException e) {
            log.error("Error aprobando solicitud de depósito {}: {}", solicitudId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Rechaza una solicitud de depósito
     */
    @PostMapping("/depositos/{solicitudId}/rechazar")
    public ResponseEntity<SolicitudDeposito> rechazarDeposito(
            @PathVariable Long solicitudId,
            @RequestBody RechazarSolicitudDto dto) {
        
        try {
            log.info("Rechazando solicitud de depósito: {} por admin: {}", solicitudId, dto.getAdminId());
            SolicitudDeposito solicitud = solicitudTransaccionService.rechazarSolicitudDeposito(
                solicitudId, dto.getAdminId(), dto.getMotivo());
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException e) {
            log.error("Error rechazando solicitud de depósito {}: {}", solicitudId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // ========== SOLICITUDES DE RETIRO ==========

    /**
     * Obtiene todas las solicitudes de retiro pendientes
     */
    @GetMapping("/retiros/pendientes")
    public ResponseEntity<List<SolicitudRetiro>> obtenerRetirosPendientes() {
        log.info("Obteniendo solicitudes de retiro pendientes");
        List<SolicitudRetiro> solicitudes = solicitudTransaccionService.obtenerSolicitudesRetiroPendientes();
        return ResponseEntity.ok(solicitudes);
    }

    /**
     * Aprueba una solicitud de retiro
     */
    @PostMapping("/retiros/{solicitudId}/aprobar")
    public ResponseEntity<SolicitudRetiro> aprobarRetiro(
            @PathVariable Long solicitudId,
            @RequestBody AprobarRetiroDto dto) {
        
        try {
            log.info("Aprobando solicitud de retiro: {} por admin: {}", solicitudId, dto.getAdminId());
            SolicitudRetiro solicitud = solicitudTransaccionService.aprobarSolicitudRetiro(
                solicitudId, dto.getAdminId(), dto.getObservaciones(), dto.getReferenciaTransaccion());
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException e) {
            log.error("Error aprobando solicitud de retiro {}: {}", solicitudId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Rechaza una solicitud de retiro
     */
    @PostMapping("/retiros/{solicitudId}/rechazar")
    public ResponseEntity<SolicitudRetiro> rechazarRetiro(
            @PathVariable Long solicitudId,
            @RequestBody RechazarSolicitudDto dto) {
        
        try {
            log.info("Rechazando solicitud de retiro: {} por admin: {}", solicitudId, dto.getAdminId());
            SolicitudRetiro solicitud = solicitudTransaccionService.rechazarSolicitudRetiro(
                solicitudId, dto.getAdminId(), dto.getMotivo());
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException e) {
            log.error("Error rechazando solicitud de retiro {}: {}", solicitudId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // ========== ESTADÍSTICAS ==========

    /**
     * Obtiene estadísticas de transacciones
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<SolicitudTransaccionService.EstadisticasTransaccionesDto> obtenerEstadisticas() {
        log.info("Obteniendo estadísticas de transacciones");
        SolicitudTransaccionService.EstadisticasTransaccionesDto estadisticas = 
            solicitudTransaccionService.obtenerEstadisticas();
        return ResponseEntity.ok(estadisticas);
    }

    /**
     * Obtiene resumen del dashboard de administración
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardAdminDto> obtenerDashboard() {
        log.info("Obteniendo dashboard de administración");
        
        List<SolicitudDeposito> depositosPendientes = solicitudTransaccionService.obtenerSolicitudesDepositoPendientes();
        List<SolicitudRetiro> retirosPendientes = solicitudTransaccionService.obtenerSolicitudesRetiroPendientes();
        SolicitudTransaccionService.EstadisticasTransaccionesDto estadisticas = 
            solicitudTransaccionService.obtenerEstadisticas();

        DashboardAdminDto dashboard = new DashboardAdminDto(
            depositosPendientes.size(),
            retirosPendientes.size(),
            estadisticas.getDepositosHoy(),
            estadisticas.getRetirosHoy(),
            depositosPendientes,
            retirosPendientes
        );

        return ResponseEntity.ok(dashboard);
    }

    // ========== DTOs ==========

    public static class AprobarSolicitudDto {
        private Long adminId;
        private String observaciones;

        public Long getAdminId() { return adminId; }
        public void setAdminId(Long adminId) { this.adminId = adminId; }
        public String getObservaciones() { return observaciones; }
        public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    }

    public static class AprobarRetiroDto {
        private Long adminId;
        private String observaciones;
        private String referenciaTransaccion;

        public Long getAdminId() { return adminId; }
        public void setAdminId(Long adminId) { this.adminId = adminId; }
        public String getObservaciones() { return observaciones; }
        public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
        public String getReferenciaTransaccion() { return referenciaTransaccion; }
        public void setReferenciaTransaccion(String referenciaTransaccion) { this.referenciaTransaccion = referenciaTransaccion; }
    }

    public static class RechazarSolicitudDto {
        private Long adminId;
        private String motivo;

        public Long getAdminId() { return adminId; }
        public void setAdminId(Long adminId) { this.adminId = adminId; }
        public String getMotivo() { return motivo; }
        public void setMotivo(String motivo) { this.motivo = motivo; }
    }

    public static class DashboardAdminDto {
        private final int depositosPendientes;
        private final int retirosPendientes;
        private final java.math.BigDecimal depositosHoy;
        private final java.math.BigDecimal retirosHoy;
        private final List<SolicitudDeposito> ultimosDepositosPendientes;
        private final List<SolicitudRetiro> ultimosRetirosPendientes;

        public DashboardAdminDto(int depositosPendientes, int retirosPendientes,
                               java.math.BigDecimal depositosHoy, java.math.BigDecimal retirosHoy,
                               List<SolicitudDeposito> ultimosDepositosPendientes,
                               List<SolicitudRetiro> ultimosRetirosPendientes) {
            this.depositosPendientes = depositosPendientes;
            this.retirosPendientes = retirosPendientes;
            this.depositosHoy = depositosHoy;
            this.retirosHoy = retirosHoy;
            this.ultimosDepositosPendientes = ultimosDepositosPendientes;
            this.ultimosRetirosPendientes = ultimosRetirosPendientes;
        }

        public int getDepositosPendientes() { return depositosPendientes; }
        public int getRetirosPendientes() { return retirosPendientes; }
        public java.math.BigDecimal getDepositosHoy() { return depositosHoy; }
        public java.math.BigDecimal getRetirosHoy() { return retirosHoy; }
        public List<SolicitudDeposito> getUltimosDepositosPendientes() { return ultimosDepositosPendientes; }
        public List<SolicitudRetiro> getUltimosRetirosPendientes() { return ultimosRetirosPendientes; }
    }
}
