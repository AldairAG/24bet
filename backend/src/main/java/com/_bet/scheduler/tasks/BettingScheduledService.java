package com._bet.scheduler.tasks;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com._bet.service.apuesta.MomioCalculatorService;

/**
 * Servicio para tareas programadas relacionadas con el sistema de apuestas
 */
@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "betting.scheduled.enabled", havingValue = "true", matchIfMissing = true)
public class BettingScheduledService {

    private final MomioCalculatorService momioCalculatorService;

    /**
     * Calcula momios para eventos sin momios cada 30 minutos
     */
    //@Scheduled(fixedRate = 1800000) // 30 minutos
    public void calcularMomiosEventosSinMomios() {
        log.info("Iniciando tarea programada: cálculo de momios para eventos sin momios");
        
        try {
            momioCalculatorService.calcularMomiosParaEventosSinMomios();
            log.info("Tarea programada completada: cálculo de momios para eventos sin momios");
        } catch (Exception e) {
            log.error("Error en tarea programada de cálculo de momios: {}", e.getMessage(), e);
        }
    }

    /**
     * Actualiza momios para eventos próximos cada 15 minutos
     */
    //@Scheduled(fixedRate = 900000) // 15 minutos
    public void actualizarMomiosEventosProximos() {
        log.info("Iniciando tarea programada: actualización de momios para eventos próximos");
        
        try {
            momioCalculatorService.actualizarMomiosEventosProximos();
            log.info("Tarea programada completada: actualización de momios para eventos próximos");
        } catch (Exception e) {
            log.error("Error en tarea programada de actualización de momios: {}", e.getMessage(), e);
        }
    }

    /**
     * Limpieza de momios inactivos cada día a las 2:00 AM
     */
    //@Scheduled(cron = "0 0 2 * * *")
    public void limpiezaMomiosInactivos() {
        log.info("Iniciando tarea programada: limpieza de momios inactivos");
        
        try {
            // TODO: Implementar limpieza de momios inactivos/obsoletos
            log.info("Tarea programada completada: limpieza de momios inactivos");
        } catch (Exception e) {
            log.error("Error en tarea programada de limpieza: {}", e.getMessage(), e);
        }
    }

    /**
     * Reporte diario de estadísticas cada día a las 6:00 AM
     */
    //@Scheduled(cron = "0 0 6 * * *")
    public void reporteEstadisticasDiario() {
        log.info("Iniciando tarea programada: reporte de estadísticas diario");
        
        try {
            // TODO: Implementar generación de reportes estadísticos
            log.info("Tarea programada completada: reporte de estadísticas diario");
        } catch (Exception e) {
            log.error("Error en tarea programada de reportes: {}", e.getMessage(), e);
        }
    }
}
