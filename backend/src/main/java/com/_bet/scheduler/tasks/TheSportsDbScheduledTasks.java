package com._bet.scheduler.tasks;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


/**
 * Tareas programadas para sincronización con TheSportsDB
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TheSportsDbScheduledTasks {


    /**
     * Sincronización automática cada 6 horas (OPTIMIZADA)
     * Se ejecuta cada 6 horas y solo sincroniza eventos próximos de los siguientes
     * 7 días
     * Esta versión optimizada mejora el rendimiento significativamente
     */
    @Scheduled(fixedRate = 21600000, zone = "America/Mexico_City")
    @Async("theSportsDbTaskExecutor")
    public void sincronizacionEventosAutomatica() {
        log.info("🔄 Iniciando sincronización automática OPTIMIZADA de eventos próximos 7 días");

        try {
            // Usar la versión optimizada que solo sincroniza eventos próximos
            //theSportsDbV2Service.sincronizarEventosProximosDias().join();
            log.info("✅ Sincronización automática OPTIMIZADA completada exitosamente");
        } catch (Exception e) {
            log.error("❌ Error en la sincronización automática optimizada: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronización de datos maestros (deportes, ligas, equipos) - cada 24 horas
     */
    //@Scheduled(cron = "0 0 2 * * *", zone = "America/Mexico_City") // Todos los días a las 2:00 AM
    @Scheduled(fixedRate = 86400000, zone = "America/Mexico_City") // Cada 24 horas
    @Async("theSportsDbTaskExecutor")
    public void sincronizacionDatosMaestros() {
        log.info("🔄 Iniciando sincronización diaria de datos maestros (deportes, ligas, equipos)");

        try {
            //theSportsDbV2Service.sincronizacionDatosMaestros();
            log.info("✅ Sincronización de datos maestros completada exitosamente");
        } catch (Exception e) {
            log.error("❌ Error en la sincronización de datos maestros: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronización de eventos en vivo - cada 5 minutos durante horas de juego
     * Solo ejecuta durante horarios típicos de eventos deportivos
     */
    @Scheduled(fixedRate = 120000) // 2 minutos
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

}
