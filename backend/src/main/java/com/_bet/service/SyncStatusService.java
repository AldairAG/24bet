package com._bet.service;

import com._bet.entity.*;
import com._bet.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar y monitorear las sincronizaciones de TheSportsDB
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SyncStatusService {

    private final DeporteRepository deporteRepository;
    private final LigaRepository ligaRepository;
    private final EquipoRepository equipoRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;

    /**
     * Obtiene estadísticas generales de sincronización
     */
    @Transactional(readOnly = true)
    public Map<String, Object> obtenerEstadisticasSincronizacion() {
        long totalDeportes = deporteRepository.count();
        long deportesActivos = deporteRepository.findByActivoTrue().size();
        
        long totalLigas = ligaRepository.count();
        long ligasActivas = ligaRepository.findByActivaTrue().size();
        
        long totalEquipos = equipoRepository.count();
        long equiposActivos = equipoRepository.findByActivoTrue().size();
        
        long totalEventos = eventoDeportivoRepository.count();
        long eventosActivos = eventoDeportivoRepository.findByActivoTrue().size();
        
        // Eventos por estado
        List<EventoDeportivo> eventos = eventoDeportivoRepository.findByActivoTrue();
        Map<String, Long> eventosPorEstado = eventos.stream()
            .collect(Collectors.groupingBy(
                evento -> evento.getEstado() != null ? evento.getEstado() : "Sin estado",
                Collectors.counting()
            ));
        
        // Eventos próximos (próximos 7 días)
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime enUnaSemana = ahora.plusDays(7);
        long eventosProximos = eventoDeportivoRepository
            .findEventosEnRangoFechas(ahora, enUnaSemana).size();
        
        // Eventos pasados recientes (últimos 7 días)
        LocalDateTime haceUnaSemana = ahora.minusDays(7);
        long eventosRecientes = eventoDeportivoRepository
            .findEventosEnRangoFechas(haceUnaSemana, ahora).size();

        return Map.of(
            "deportes", Map.of(
                "total", totalDeportes,
                "activos", deportesActivos
            ),
            "ligas", Map.of(
                "total", totalLigas,
                "activas", ligasActivas
            ),
            "equipos", Map.of(
                "total", totalEquipos,
                "activos", equiposActivos
            ),
            "eventos", Map.of(
                "total", totalEventos,
                "activos", eventosActivos,
                "proximos", eventosProximos,
                "recientes", eventosRecientes,
                "porEstado", eventosPorEstado
            ),
            "ultimaActualizacion", LocalDateTime.now()
        );
    }

    /**
     * Obtiene deportes con sus estadísticas
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> obtenerDeportesConEstadisticas() {
        List<Deporte> deportes = deporteRepository.findByActivoTrue();
        
        return deportes.stream().map(deporte -> {
            long totalLigas = ligaRepository.findByDeporte(deporte).size();
            long ligasActivas = ligaRepository.findByDeporteAndActivaTrue(deporte).size();
            
            // Contar equipos del deporte
            long totalEquipos = ligaRepository.findByDeporte(deporte).stream()
                .mapToLong(liga -> equipoRepository.findByLiga(liga).size())
                .sum();
            
            // Contar eventos del deporte
            long totalEventos = ligaRepository.findByDeporte(deporte).stream()
                .mapToLong(liga -> eventoDeportivoRepository.findByLiga(liga).size())
                .sum();
            
            return Map.<String, Object>of(
                "id", deporte.getId(),
                "sportsDbId", deporte.getSportsDbId(),
                "nombre", deporte.getNombre(),
                "nombreIngles", deporte.getNombreIngles(),
                "formato", deporte.getFormato(),
                "activo", deporte.getActivo(),
                "estadisticas", Map.of(
                    "totalLigas", totalLigas,
                    "ligasActivas", ligasActivas,
                    "totalEquipos", totalEquipos,
                    "totalEventos", totalEventos
                ),
                "fechaActualizacion", deporte.getFechaActualizacion()
            );
        }).collect(Collectors.toList());
    }

    /**
     * Obtiene ligas con sus estadísticas
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> obtenerLigasConEstadisticas() {
        List<Liga> ligas = ligaRepository.findByActivaTrue();
        
        return ligas.stream().map(liga -> {
            long totalEquipos = equipoRepository.findByLiga(liga).size();
            long equiposActivos = equipoRepository.findByLigaAndActivoTrue(liga).size();
            
            long totalEventos = eventoDeportivoRepository.findByLiga(liga).size();
            long eventosActivos = eventoDeportivoRepository.findByLigaAndActivoTrue(liga).size();
            
            return Map.<String, Object>of(
                "id", liga.getId(),
                "sportsDbId", liga.getSportsDbId(),
                "nombre", liga.getNombre(),
                "pais", liga.getPais(),
                "temporadaActual", liga.getTemporadaActual(),
                "activa", liga.getActiva(),
                "deporte", Map.of(
                    "id", liga.getDeporte().getId(),
                    "nombre", liga.getDeporte().getNombre()
                ),
                "estadisticas", Map.of(
                    "totalEquipos", totalEquipos,
                    "equiposActivos", equiposActivos,
                    "totalEventos", totalEventos,
                    "eventosActivos", eventosActivos
                ),
                "fechaActualizacion", liga.getFechaActualizacion()
            );
        }).collect(Collectors.toList());
    }

    /**
     * Limpia datos antiguos
     */
    @Transactional
    public Map<String, Integer> limpiarDatosAntiguos() {
        log.info("Iniciando limpieza de datos antiguos");
        
        // Desactivar eventos antiguos (más de 1 año)
        LocalDateTime fechaLimite = LocalDateTime.now().minusYears(1);
        List<EventoDeportivo> eventosAntiguos = eventoDeportivoRepository.findEventosPasados(fechaLimite);
        
        int eventosDesactivados = 0;
        for (EventoDeportivo evento : eventosAntiguos) {
            if (evento.getFechaEvento().isBefore(fechaLimite)) {
                evento.setActivo(false);
                eventosDesactivados++;
            }
        }
        
        if (eventosDesactivados > 0) {
            eventoDeportivoRepository.saveAll(eventosAntiguos);
        }
        
        log.info("Limpieza completada. Eventos desactivados: {}", eventosDesactivados);
        
        return Map.of(
            "eventosDesactivados", eventosDesactivados,
            "fechaLimite", fechaLimite.toString()
        );
    }

    /**
     * Reactivar datos por criterios
     */
    @Transactional
    public Map<String, Integer> reactivarDatos() {
        log.info("Iniciando reactivación de datos relevantes");
        
        int deportesReactivados = 0;
        int ligasReactivadas = 0;
        int equiposReactivados = 0;
        int eventosReactivados = 0;
        
        // Reactivar deportes que tienen ligas activas
        List<Deporte> deportesInactivos = deporteRepository.findAll().stream()
            .filter(d -> !d.getActivo())
            .collect(Collectors.toList());
        
        for (Deporte deporte : deportesInactivos) {
            boolean tieneligas = ligaRepository.findByDeporte(deporte).stream()
                .anyMatch(Liga::getActiva);
            if (tieneligas) {
                deporte.setActivo(true);
                deportesReactivados++;
            }
        }
        
        if (deportesReactivados > 0) {
            deporteRepository.saveAll(deportesInactivos);
        }
        
        // Reactivar eventos próximos
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime enUnMes = ahora.plusMonths(1);
        List<EventoDeportivo> eventosProximos = eventoDeportivoRepository.findAll().stream()
            .filter(e -> !e.getActivo() && 
                        e.getFechaEvento() != null && 
                        e.getFechaEvento().isAfter(ahora) && 
                        e.getFechaEvento().isBefore(enUnMes))
            .collect(Collectors.toList());
        
        for (EventoDeportivo evento : eventosProximos) {
            evento.setActivo(true);
            eventosReactivados++;
        }
        
        if (eventosReactivados > 0) {
            eventoDeportivoRepository.saveAll(eventosProximos);
        }
        
        log.info("Reactivación completada. Deportes: {}, Ligas: {}, Equipos: {}, Eventos: {}", 
                deportesReactivados, ligasReactivadas, equiposReactivados, eventosReactivados);
        
        return Map.of(
            "deportesReactivados", deportesReactivados,
            "ligasReactivadas", ligasReactivadas,
            "equiposReactivados", equiposReactivados,
            "eventosReactivados", eventosReactivados
        );
    }
}
