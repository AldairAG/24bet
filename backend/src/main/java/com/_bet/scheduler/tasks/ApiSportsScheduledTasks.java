package com._bet.scheduler.tasks;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com._bet.service.apiSport.ApiSportService;

/**
 * Tareas programadas para sincronización con TheSportsDB
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ApiSportsScheduledTasks {

    private final ApiSportService apiSportService;

    /**
     * Sincroniza los eventos diarios se ejecuta una vez al dia a las 6:00 PM
     */
    //@Scheduled(fixedRate = 21600000, zone = "America/Mexico_City")
    @Scheduled(cron = "0 0 18 * * *", zone = "America/Mexico_City")
    @Async("theSportsDbTaskExecutor")
    public void sincronizacionEventosAutomatica() {
        log.info("🔄 Sincronización automática de eventos diarios");

        try {
            for (String deporte : ApiSportService.URLS_POR_DEPORTE.keySet()) {
                java.util.Calendar calendar = java.util.Calendar.getInstance();
                calendar.add(java.util.Calendar.DAY_OF_YEAR, 7);
                apiSportService.obtenerEventosByDate(calendar.getTime(), deporte);
            }
            log.info("✅ Sincronización automática completada exitosamente");
        } catch (Exception e) {
            log.error("❌ Error en la sincronización automática: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronización de datos maestros (deportes, ligas, equipos) - cada 24 horas
     */
    // @Scheduled(cron = "0 0 2 * * *", zone = "America/Mexico_City") // Todos los
    // días a las 2:00 AM
    @Scheduled(fixedRate = 86400000, zone = "America/Mexico_City") // Cada 24 horas
    @Async("theSportsDbTaskExecutor")
    public void sincronizacionDatosMaestros() {
        log.info("🔄 Iniciando sincronización diaria de datos maestros (deportes, ligas, equipos)");

        try {
            apiSportService.sincronizarDatosMaestros();
            log.info("✅ Sincronización de datos maestros completada exitosamente");
        } catch (Exception e) {
            log.error("❌ Error en la sincronización de datos maestros: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronización de eventos en vivo - cada 5 minutos durante horas de juego
     * Solo ejecuta durante horarios típicos de eventos deportivos
     */
    //@Scheduled(fixedRate = 120000) // 2 minutos
    @Async("theSportsDbTaskExecutor")
    public void sincronizacionEventosEnVivo() {
        // Solo ejecutar durante horarios de eventos deportivos (8 AM a 12 AM)
        java.time.LocalTime ahora = java.time.LocalTime.now();
        if (ahora.isBefore(java.time.LocalTime.of(8, 0)) ||
                ahora.isAfter(java.time.LocalTime.of(23, 59))) {
            return; // No ejecutar durante la madrugada
        }

        log.debug("🔴 Verificando eventos en vivo con API v2...");

        try {
            //theSportsDbV2Service.sincronizarEventosEnVivo();
        } catch (Exception e) {
            log.error("❌ Error en la sincronización de eventos en vivo V2: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronización de eventos en vivo y cuotas de apuestas cada 2 minutos
     */
    @Scheduled(fixedRate = 120000) // 2 minutos
    public void sincronizacionEventosEnVivoYCuotas() {

        try {
            //      apiSportService.obtenerEventosEnVivo();
        } catch (Exception e) {
            log.error("❌ Error en la sincronización de eventos en vivo y cuotas de apuestas: {}", e.getMessage(), e);
        }
    }

}
