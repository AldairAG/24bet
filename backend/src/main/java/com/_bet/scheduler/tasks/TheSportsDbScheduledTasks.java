package com._bet.scheduler.tasks;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com._bet.service.theSportsDb.TheSportsDbService;
import com._bet.service.TheSportsDbV2Service;

/**
 * Tareas programadas para sincronización con TheSportsDB
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TheSportsDbScheduledTasks {

    private final TheSportsDbService theSportsDbService;
    private final TheSportsDbV2Service theSportsDbV2Service;

    /**
     * Sincronización automática cada 6 horas
     * Se ejecuta cada 6 horas (21600000 milisegundos)
     */
    @Scheduled(fixedRate = 21600000, zone = "America/Mexico_City")
    @Async("theSportsDbTaskExecutor")
    public void sincronizacionEventosAutomatica() {
        log.info("🔄 Iniciando sincronización automática de eventos deportivos");
        
        try {
            theSportsDbService.sincronizacionEventosAutomatica();
            log.info("✅ Sincronización automática de eventos completada exitosamente");
        } catch (Exception e) {
            log.error("❌ Error en la sincronización automática de eventos: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronización de datos maestros (deportes, ligas, equipos) - cada 24 horas
     */
    @Scheduled(cron = "0 0 2 * * *", zone = "America/Mexico_City") // Todos los días a las 2:00 AM
    @Async("theSportsDbTaskExecutor")
    public void sincronizacionDatosMaestros() {
        log.info("🔄 Iniciando sincronización diaria de datos maestros (deportes, ligas, equipos)");
        
        try {
            theSportsDbService.sincronizacionDatosMaestros();
            log.info("✅ Sincronización de datos maestros completada exitosamente");
        } catch (Exception e) {
            log.error("❌ Error en la sincronización de datos maestros: {}", e.getMessage(), e);
        }
    }

    /**
     * Limpieza de datos antiguos - cada domingo a las 3:00 AM
     */
    @Scheduled(cron = "0 0 3 * * SUN", zone = "America/Mexico_City")
    @Async("theSportsDbTaskExecutor")
    public void limpiezaSemanal() {
        log.info("🧹 Iniciando limpieza semanal de datos antiguos");
        
        try {
            theSportsDbService.limpiarDatosAntiguos();
            log.info("✅ Limpieza semanal completada exitosamente");
        } catch (Exception e) {
            log.error("❌ Error en la limpieza semanal: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronización inicial al arrancar la aplicación (opcional)
     * Solo se ejecuta si no hay datos en la base de datos
     */
    @EventListener(ApplicationReadyEvent.class)
    @Async("theSportsDbTaskExecutor")
    public void sincronizacionInicialAlArranque() {
        log.info("🚀 Verificando si es necesaria una sincronización inicial...");
        
        try {
            boolean necesitaSincronizacion = theSportsDbService.necesitaSincronizacionInicial();
            
            if (necesitaSincronizacion) {
                log.info("🔄 Iniciando sincronización inicial al arranque de la aplicación");
                theSportsDbService.sincronizacionInicialCompleta();
                log.info("✅ Sincronización inicial completada exitosamente");
            } else {
                log.info("ℹ️ No es necesaria la sincronización inicial - datos ya presentes");
            }
        } catch (Exception e) {
            log.error("❌ Error en la sincronización inicial: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronización de eventos en vivo - cada 5 minutos durante horas de juego
     * Solo ejecuta durante horarios típicos de eventos deportivos
     */
    @Scheduled(fixedRate = 300000) // 5 minutos
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
            theSportsDbV2Service.sincronizarEventosEnVivo();
        } catch (Exception e) {
            log.error("❌ Error en la sincronización de eventos en vivo V2: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronización intensiva de eventos en vivo cada 2 minutos durante horarios prime
     * Se ejecuta cada 2 minutos durante horarios de alta actividad deportiva
     */
    @Scheduled(fixedRate = 120000) // 2 minutos  
    @Async("theSportsDbTaskExecutor")
    public void sincronizacionEventosEnVivoIntenisva() {
        // Solo ejecutar durante horarios prime de eventos deportivos (6 PM a 11 PM)
        java.time.LocalTime ahora = java.time.LocalTime.now();
        if (ahora.isBefore(java.time.LocalTime.of(18, 0)) || 
            ahora.isAfter(java.time.LocalTime.of(23, 0))) {
            return; // Solo durante horarios prime
        }

        log.debug("🔴🔴 Sincronización intensiva de eventos en vivo (API v2)...");
        
        try {
            theSportsDbV2Service.sincronizarEventosEnVivo();
        } catch (Exception e) {
            log.error("❌ Error en la sincronización intensiva de eventos en vivo: {}", e.getMessage(), e);
        }
    }

    /**
     * Verificación de eventos en vivo cada 30 segundos durante finales de semana
     * Solo sábados y domingos durante horarios deportivos
     */
    @Scheduled(fixedRate = 30000) // 30 segundos
    @Async("theSportsDbTaskExecutor") 
    public void sincronizacionEventosFinDeSemana() {
        // Solo ejecutar en fin de semana
        java.time.DayOfWeek diaDeLaSemana = java.time.LocalDate.now().getDayOfWeek();
        if (diaDeLaSemana != java.time.DayOfWeek.SATURDAY && 
            diaDeLaSemana != java.time.DayOfWeek.SUNDAY) {
            return; // Solo fin de semana
        }

        // Solo ejecutar durante horarios deportivos
        java.time.LocalTime ahora = java.time.LocalTime.now();
        if (ahora.isBefore(java.time.LocalTime.of(10, 0)) || 
            ahora.isAfter(java.time.LocalTime.of(23, 0))) {
            return; // Solo durante horarios deportivos del fin de semana
        }

        log.debug("🏈⚽ Sincronización de fin de semana (API v2) cada 30s...");
        
        try {
            theSportsDbV2Service.sincronizarEventosEnVivo();
        } catch (Exception e) {
            log.error("❌ Error en la sincronización de fin de semana: {}", e.getMessage(), e);
        }
    }
}
