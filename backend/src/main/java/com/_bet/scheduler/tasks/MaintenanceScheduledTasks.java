package com._bet.scheduler.tasks;

import com._bet.service.SyncStatusService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Tareas programadas de mantenimiento general del sistema
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MaintenanceScheduledTasks {

    private final SyncStatusService syncStatusService;

    /**
     * Limpieza y mantenimiento semanal del sistema
     * Se ejecuta todos los domingos a las 4:00 AM
     */
    @Scheduled(cron = "0 0 4 * * SUN", zone = "America/Mexico_City")
    @Async("asyncTaskExecutor")
    public void mantenimientoSemanal() {
        log.info("🧹 Iniciando mantenimiento semanal del sistema");
        
        try {
            // Limpieza de datos antiguos
            var resultadoLimpieza = syncStatusService.limpiarDatosAntiguos();
            log.info("✅ Limpieza completada: {}", resultadoLimpieza);
            
            // Reactivación de datos relevantes
            var resultadoReactivacion = syncStatusService.reactivarDatos();
            log.info("✅ Reactivación completada: {}", resultadoReactivacion);
            
            log.info("✅ Mantenimiento semanal completado exitosamente");
        } catch (Exception e) {
            log.error("❌ Error en el mantenimiento semanal: {}", e.getMessage(), e);
        }
    }

    /**
     * Reporte de estadísticas diario
     * Se ejecuta todos los días a las 8:00 AM
     */
    @Scheduled(cron = "0 0 8 * * *", zone = "America/Mexico_City")
    @Async("asyncTaskExecutor")
    @SuppressWarnings("unchecked")
    public void reporteDiario() {
        log.info("📊 Generando reporte diario de estadísticas");
        
        try {
            var estadisticas = syncStatusService.obtenerEstadisticasSincronizacion();
            
            log.info("📈 Estadísticas del sistema:");
            
            var deportes = (java.util.Map<String, Object>) estadisticas.get("deportes");
            var ligas = (java.util.Map<String, Object>) estadisticas.get("ligas");
            var equipos = (java.util.Map<String, Object>) estadisticas.get("equipos");
            var eventos = (java.util.Map<String, Object>) estadisticas.get("eventos");
            
            log.info("   - Deportes activos: {}", deportes.get("activos"));
            log.info("   - Ligas activas: {}", ligas.get("activas"));
            log.info("   - Equipos activos: {}", equipos.get("activos"));
            log.info("   - Eventos activos: {}", eventos.get("activos"));
            log.info("   - Eventos próximos: {}", eventos.get("proximos"));
            
        } catch (Exception e) {
            log.error("❌ Error en el reporte diario: {}", e.getMessage(), e);
        }
    }
}
