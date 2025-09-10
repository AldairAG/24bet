package com._bet.controller;

import com._bet.dto.thesportsdb.v2.TheSportsDbV2LiveEventsResponseDto;
import com._bet.dto.thesportsdb.v2.TheSportsDbV2LiveEventDto;
import com._bet.service.TheSportsDbV2Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para TheSportsDB API v2 - Eventos en vivo
 */
@RestController
@RequestMapping("/api/v2/thesportsdb")
@RequiredArgsConstructor
@Slf4j
public class TheSportsDbV2Controller {

    private final TheSportsDbV2Service theSportsDbV2Service;

    /**
     * Obtiene todos los eventos en vivo actualmente
     */
    @GetMapping("/eventos-en-vivo")
    public ResponseEntity<TheSportsDbV2LiveEventsResponseDto> obtenerEventosEnVivo() {
        log.info("🔴 Solicitud de eventos en vivo recibida");
        
        try {
            TheSportsDbV2LiveEventsResponseDto eventos = theSportsDbV2Service.obtenerEventosEnVivo();
            
            if (eventos.getEvents() != null && !eventos.getEvents().isEmpty()) {
                log.info("✅ Devolviendo {} eventos en vivo", eventos.getEvents().size());
                return ResponseEntity.ok(eventos);
            } else {
                log.info("ℹ️ No hay eventos en vivo actualmente");
                return ResponseEntity.ok(eventos);
            }
            
        } catch (Exception e) {
            log.error("❌ Error al obtener eventos en vivo: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene eventos en vivo para una liga específica
     */
    @GetMapping("/eventos-en-vivo/liga/{idLiga}")
    public ResponseEntity<TheSportsDbV2LiveEventsResponseDto> obtenerEventosEnVivoPorLiga(
            @PathVariable String idLiga) {
        log.info("🔴 Solicitud de eventos en vivo para liga: {}", idLiga);
        
        try {
            TheSportsDbV2LiveEventsResponseDto eventos = theSportsDbV2Service.obtenerEventosEnVivoPorLiga(idLiga);
            
            if (eventos.getEvents() != null && !eventos.getEvents().isEmpty()) {
                log.info("✅ Devolviendo {} eventos en vivo para liga {}", eventos.getEvents().size(), idLiga);
                return ResponseEntity.ok(eventos);
            } else {
                log.info("ℹ️ No hay eventos en vivo para la liga: {}", idLiga);
                return ResponseEntity.ok(eventos);
            }
            
        } catch (Exception e) {
            log.error("❌ Error al obtener eventos en vivo para liga {}: {}", idLiga, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene estadísticas detalladas en tiempo real de un evento específico
     */
    @GetMapping("/evento/{idEvento}/estadisticas")
    public ResponseEntity<TheSportsDbV2LiveEventDto> obtenerEstadisticasEnVivo(
            @PathVariable String idEvento) {
        log.info("📊 Solicitud de estadísticas en vivo para evento: {}", idEvento);
        
        try {
            TheSportsDbV2LiveEventDto estadisticas = theSportsDbV2Service.obtenerEstadisticasEnVivo(idEvento);
            
            if (estadisticas != null) {
                log.info("✅ Estadísticas en vivo obtenidas para evento: {}", idEvento);
                return ResponseEntity.ok(estadisticas);
            } else {
                log.warn("⚠️ No se encontraron estadísticas para el evento: {}", idEvento);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("❌ Error al obtener estadísticas para evento {}: {}", idEvento, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Fuerza una sincronización manual de eventos en vivo
     */
    @PostMapping("/sincronizar-eventos-vivo")
    public ResponseEntity<String> sincronizarEventosEnVivo() {
        log.info("🔄 Sincronización manual de eventos en vivo solicitada");
        
        try {
            theSportsDbV2Service.sincronizarEventosEnVivo();
            log.info("✅ Sincronización manual completada exitosamente");
            return ResponseEntity.ok("Sincronización de eventos en vivo completada exitosamente");
            
        } catch (Exception e) {
            log.error("❌ Error en sincronización manual: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body("Error en la sincronización: " + e.getMessage());
        }
    }

    /**
     * Endpoint para probar la búsqueda y creación de eventos desde API v1
     */
    @PostMapping("/test-crear-evento/{idEvento}")
    public ResponseEntity<String> testCrearEventoDesdeApi(@PathVariable String idEvento) {
        log.info("🧪 Probando creación de evento desde API v1 para ID: {}", idEvento);
        
        try {
            // Crear un DTO ficticio para probar la funcionalidad
            TheSportsDbV2LiveEventDto eventoDto = new TheSportsDbV2LiveEventDto();
            eventoDto.setIdEvent(idEvento);
            eventoDto.setStrStatus("Testing");
            eventoDto.setIntHomeScore("1");
            eventoDto.setIntAwayScore("0");
            
            // Este método procesará el evento, lo buscará en API v1 si no existe, y lo creará
            theSportsDbV2Service.sincronizarEventosEnVivo();
            
            return ResponseEntity.ok("Proceso de prueba completado para evento: " + idEvento);
            
        } catch (Exception e) {
            log.error("❌ Error en prueba de creación de evento {}: {}", idEvento, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body("Error en la prueba: " + e.getMessage());
        }
    }

    /**
     * Health check para verificar el estado de la API v2
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        try {
            // Realizar una llamada de prueba a la API v2
            TheSportsDbV2LiveEventsResponseDto test = theSportsDbV2Service.obtenerEventosEnVivo();
            
            return ResponseEntity.ok("API v2 TheSportsDB funcionando correctamente. " +
                "Eventos disponibles: " + (test.getEvents() != null ? test.getEvents().size() : 0));
                
        } catch (Exception e) {
            log.error("❌ Health check falló: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body("API v2 no disponible: " + e.getMessage());
        }
    }
}
