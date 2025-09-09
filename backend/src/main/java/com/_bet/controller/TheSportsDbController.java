package com._bet.controller;

import com._bet.service.TheSportsDbService;
import com._bet.service.SyncStatusService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Controlador para gestión manual de sincronización con TheSportsDB
 */
@RestController
@RequestMapping("/api/admin/thesportsdb")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class TheSportsDbController {

    private final TheSportsDbService theSportsDbService;
    private final SyncStatusService syncStatusService;

    /**
     * Ejecuta sincronización completa de todos los datos
     */
    @PostMapping("/sync/complete")
    public ResponseEntity<String> sincronizacionCompleta() {
        log.info("Iniciando sincronización completa manual");
        
        CompletableFuture.runAsync(() -> {
            try {
                theSportsDbService.sincronizacionCompleta().join();
            } catch (Exception e) {
                log.error("Error en sincronización completa: {}", e.getMessage(), e);
            }
        });
        
        return ResponseEntity.ok("Sincronización completa iniciada en segundo plano");
    }

    /**
     * Sincroniza solo deportes
     */
    @PostMapping("/sync/sports")
    public ResponseEntity<String> sincronizarDeportes() {
        log.info("Iniciando sincronización de deportes manual");
        
        CompletableFuture.runAsync(() -> {
            try {
                theSportsDbService.sincronizarDeportes().join();
            } catch (Exception e) {
                log.error("Error en sincronización de deportes: {}", e.getMessage(), e);
            }
        });
        
        return ResponseEntity.ok("Sincronización de deportes iniciada");
    }

    /**
     * Sincroniza ligas por deporte
     */
    @PostMapping("/sync/leagues/{sportName}")
    public ResponseEntity<String> sincronizarLigasPorDeporte(@PathVariable String sportName) {
        log.info("Iniciando sincronización de ligas para deporte: {}", sportName);
        
        CompletableFuture.runAsync(() -> {
            try {
                theSportsDbService.sincronizarLigasPorDeporte(sportName).join();
            } catch (Exception e) {
                log.error("Error en sincronización de ligas: {}", e.getMessage(), e);
            }
        });
        
        return ResponseEntity.ok("Sincronización de ligas iniciada para deporte: " + sportName);
    }

    /**
     * Sincroniza equipos por liga
     */
    @PostMapping("/sync/teams/{leagueId}")
    public ResponseEntity<String> sincronizarEquiposPorLiga(@PathVariable String leagueId) {
        log.info("Iniciando sincronización de equipos para liga: {}", leagueId);
        
        CompletableFuture.runAsync(() -> {
            try {
                theSportsDbService.sincronizarEquiposPorLiga(leagueId).join();
            } catch (Exception e) {
                log.error("Error en sincronización de equipos: {}", e.getMessage(), e);
            }
        });
        
        return ResponseEntity.ok("Sincronización de equipos iniciada para liga: " + leagueId);
    }

    /**
     * Sincroniza eventos por liga y temporada
     */
    @PostMapping("/sync/events/{leagueId}/{season}")
    public ResponseEntity<String> sincronizarEventos(@PathVariable String leagueId, @PathVariable String season) {
        log.info("Iniciando sincronización de eventos para liga: {} temporada: {}", leagueId, season);
        
        CompletableFuture.runAsync(() -> {
            try {
                theSportsDbService.sincronizarEventosPorLiga(leagueId, season).join();
            } catch (Exception e) {
                log.error("Error en sincronización de eventos: {}", e.getMessage(), e);
            }
        });
        
        return ResponseEntity.ok("Sincronización de eventos iniciada para liga: " + leagueId + " temporada: " + season);
    }

    /**
     * Sincroniza eventos próximos por liga
     */
    @PostMapping("/sync/events/upcoming/{leagueId}")
    public ResponseEntity<String> sincronizarEventosProximos(@PathVariable String leagueId) {
        log.info("Iniciando sincronización de eventos próximos para liga: {}", leagueId);
        
        CompletableFuture.runAsync(() -> {
            try {
                theSportsDbService.sincronizarEventosProximosPorLiga(leagueId).join();
            } catch (Exception e) {
                log.error("Error en sincronización de eventos próximos: {}", e.getMessage(), e);
            }
        });
        
        return ResponseEntity.ok("Sincronización de eventos próximos iniciada para liga: " + leagueId);
    }

    /**
     * Ejecuta la sincronización automática manualmente
     */
    @PostMapping("/sync/auto")
    public ResponseEntity<String> ejecutarSincronizacionAutomatica() {
        log.info("Ejecutando sincronización automática manual");
        
        CompletableFuture.runAsync(() -> {
            try {
                theSportsDbService.sincronizacionEventosAutomatica();
            } catch (Exception e) {
                log.error("Error en sincronización automática: {}", e.getMessage(), e);
            }
        });
        
        return ResponseEntity.ok("Sincronización automática ejecutada");
    }

    // === ENDPOINTS DE MONITOREO ===

    /**
     * Obtiene estadísticas generales de sincronización
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        return ResponseEntity.ok(syncStatusService.obtenerEstadisticasSincronizacion());
    }

    /**
     * Obtiene deportes con estadísticas
     */
    @GetMapping("/sports/stats")
    public ResponseEntity<List<Map<String, Object>>> obtenerDeportesConEstadisticas() {
        return ResponseEntity.ok(syncStatusService.obtenerDeportesConEstadisticas());
    }

    /**
     * Obtiene ligas con estadísticas
     */
    @GetMapping("/leagues/stats")
    public ResponseEntity<List<Map<String, Object>>> obtenerLigasConEstadisticas() {
        return ResponseEntity.ok(syncStatusService.obtenerLigasConEstadisticas());
    }

    /**
     * Limpia datos antiguos
     */
    @PostMapping("/maintenance/cleanup")
    public ResponseEntity<Map<String, Object>> limpiarDatosAntiguos() {
        log.info("Iniciando limpieza de datos antiguos");
        return ResponseEntity.ok(syncStatusService.limpiarDatosAntiguos());
    }

    /**
     * Reactiva datos relevantes
     */
    @PostMapping("/maintenance/reactivate")
    public ResponseEntity<Map<String, Integer>> reactivarDatos() {
        log.info("Iniciando reactivación de datos");
        return ResponseEntity.ok(syncStatusService.reactivarDatos());
    }
}
