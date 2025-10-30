package com._bet.controller;

import com._bet.entity.transacciones.SolicitudDeposito;
import com._bet.entity.transacciones.SolicitudRetiro;
import com._bet.entity.user.Usuario;
import com._bet.service.Transaccion.SolicitudTransaccionService;
import com._bet.service.user.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controlador para que los usuarios gestionen sus propias solicitudes de transacciones
 */
@RestController
@RequestMapping("/24bet/usuario/solicitudes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UsuarioSolicitudesController {

    private final SolicitudTransaccionService solicitudTransaccionService;
    private final UsuarioService usuarioService;

    // ========== CONSULTAS DE SOLICITUDES ==========

    /**
     * Obtiene todas las solicitudes de depósito del usuario
     */
    @GetMapping("/depositos")
    public ResponseEntity<List<SolicitudDeposito>> obtenerMisDepositos(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            Usuario usuario = usuarioService.buscarPorUsernameOEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            List<SolicitudDeposito> solicitudes = solicitudTransaccionService.obtenerDepositosPorUsuario(usuario.getId());
            return ResponseEntity.ok(solicitudes);
        } catch (RuntimeException e) {
            log.error("Error obteniendo depósitos del usuario: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtiene todas las solicitudes de retiro del usuario
     */
    @GetMapping("/retiros")
    public ResponseEntity<List<SolicitudRetiro>> obtenerMisRetiros(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            Usuario usuario = usuarioService.buscarPorUsernameOEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            List<SolicitudRetiro> solicitudes = solicitudTransaccionService.obtenerRetirosPorUsuario(usuario.getId());
            return ResponseEntity.ok(solicitudes);
        } catch (RuntimeException e) {
            log.error("Error obteniendo retiros del usuario: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtiene una solicitud de depósito específica
     */
    @GetMapping("/depositos/{solicitudId}")
    public ResponseEntity<SolicitudDeposito> obtenerDeposito(
            @PathVariable Long solicitudId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            Usuario usuario = usuarioService.buscarPorUsernameOEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            SolicitudDeposito solicitud = solicitudTransaccionService.obtenerDepositoPorId(solicitudId);
            
            // Verificar que la solicitud pertenece al usuario
            if (!solicitud.getUsuario().getId().equals(usuario.getId())) {
                return ResponseEntity.status(403).build();
            }
            
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException e) {
            log.error("Error obteniendo depósito {}: {}", solicitudId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtiene una solicitud de retiro específica
     */
    @GetMapping("/retiros/{solicitudId}")
    public ResponseEntity<SolicitudRetiro> obtenerRetiro(
            @PathVariable Long solicitudId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            Usuario usuario = usuarioService.buscarPorUsernameOEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            SolicitudRetiro solicitud = solicitudTransaccionService.obtenerRetiroPorId(solicitudId);
            
            // Verificar que la solicitud pertenece al usuario
            if (!solicitud.getUsuario().getId().equals(usuario.getId())) {
                return ResponseEntity.status(403).build();
            }
            
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException e) {
            log.error("Error obteniendo retiro {}: {}", solicitudId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // ========== CANCELACIÓN DE SOLICITUDES ==========

    /**
     * Cancela una solicitud de depósito pendiente
     */
    @PostMapping("/depositos/{solicitudId}/cancelar")
    public ResponseEntity<SolicitudDeposito> cancelarDeposito(
            @PathVariable Long solicitudId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            Usuario usuario = usuarioService.buscarPorUsernameOEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            SolicitudDeposito solicitud = solicitudTransaccionService.cancelarSolicitudDeposito(solicitudId, usuario.getId());
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException e) {
            log.error("Error cancelando depósito {}: {}", solicitudId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cancela una solicitud de retiro pendiente
     */
    @PostMapping("/retiros/{solicitudId}/cancelar")
    public ResponseEntity<SolicitudRetiro> cancelarRetiro(
            @PathVariable Long solicitudId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            Usuario usuario = usuarioService.buscarPorUsernameOEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            SolicitudRetiro solicitud = solicitudTransaccionService.cancelarSolicitudRetiro(solicitudId, usuario.getId());
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException e) {
            log.error("Error cancelando retiro {}: {}", solicitudId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // ========== ESTADÍSTICAS DEL USUARIO ==========

    /**
     * Obtiene el resumen de transacciones del usuario
     */
    @GetMapping("/resumen")
    public ResponseEntity<ResumenTransaccionesDto> obtenerResumenTransacciones(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            Usuario usuario = usuarioService.buscarPorUsernameOEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            List<SolicitudDeposito> depositos = solicitudTransaccionService.obtenerDepositosPorUsuario(usuario.getId());
            List<SolicitudRetiro> retiros = solicitudTransaccionService.obtenerRetirosPorUsuario(usuario.getId());
            
            // Calcular estadísticas
            long depositosPendientes = depositos.stream()
                .filter(d -> d.getEstado() == SolicitudDeposito.EstadoSolicitud.PENDIENTE)
                .count();
            
            long retirosPendientes = retiros.stream()
                .filter(r -> r.getEstado() == SolicitudRetiro.EstadoSolicitud.PENDIENTE)
                .count();
            
            BigDecimal totalDepositado = depositos.stream()
                .filter(d -> d.getEstado() == SolicitudDeposito.EstadoSolicitud.COMPLETADA)
                .map(SolicitudDeposito::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal totalRetirado = retiros.stream()
                .filter(r -> r.getEstado() == SolicitudRetiro.EstadoSolicitud.COMPLETADA)
                .map(SolicitudRetiro::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Calcular saldo bloqueado (retiros pendientes)
            BigDecimal saldoBloqueado = retiros.stream()
                .filter(r -> r.getEstado() == SolicitudRetiro.EstadoSolicitud.PENDIENTE)
                .map(SolicitudRetiro::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            ResumenTransaccionesDto resumen = new ResumenTransaccionesDto(
                depositosPendientes,
                retirosPendientes,
                totalDepositado,
                totalRetirado,
                usuario.getSaldoUsd(),
                saldoBloqueado,
                retiros,
                depositos
            );
            
            return ResponseEntity.ok(resumen);
        } catch (RuntimeException e) {
            log.error("Error obteniendo resumen de transacciones: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // ========== DTO ==========

    public static class ResumenTransaccionesDto {
        private final long depositosPendientes;
        private final long retirosPendientes;
        private final BigDecimal totalDepositado;
        private final BigDecimal totalRetirado;
        private final BigDecimal saldoDisponible;
        private final BigDecimal saldoBloqueado;
        private final List<SolicitudRetiro> retiros;
        private final List<SolicitudDeposito> depositos;

        public ResumenTransaccionesDto(long depositosPendientes, long retirosPendientes,
                                     BigDecimal totalDepositado, BigDecimal totalRetirado,
                                     BigDecimal saldoDisponible, BigDecimal saldoBloqueado,
                                     List<SolicitudRetiro> retiros, List<SolicitudDeposito> depositos) {
            this.depositosPendientes = depositosPendientes;
            this.retirosPendientes = retirosPendientes;
            this.totalDepositado = totalDepositado;
            this.totalRetirado = totalRetirado;
            this.saldoDisponible = saldoDisponible;
            this.saldoBloqueado = saldoBloqueado;
            this.retiros = retiros;
            this.depositos = depositos;
        }

        public long getDepositosPendientes() { return depositosPendientes; }
        public long getRetirosPendientes() { return retirosPendientes; }
        public BigDecimal getTotalDepositado() { return totalDepositado; }
        public BigDecimal getTotalRetirado() { return totalRetirado; }
        public BigDecimal getSaldoDisponible() { return saldoDisponible; }
        public BigDecimal getSaldoBloqueado() { return saldoBloqueado; }
        public List<SolicitudRetiro> getRetiros() { return retiros; }
        public List<SolicitudDeposito> getDepositos() { return depositos; }
    }
}
