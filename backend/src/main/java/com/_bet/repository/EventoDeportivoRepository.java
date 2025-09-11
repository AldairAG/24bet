package com._bet.repository;

import com._bet.entity.EventoDeportivo;
import com._bet.entity.Liga;
import com._bet.entity.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad EventoDeportivo
 */
@Repository
public interface EventoDeportivoRepository extends JpaRepository<EventoDeportivo, Long> {
    
    /**
     * Busca un evento por su ID en TheSportsDB
     */
    Optional<EventoDeportivo> findBySportsDbId(String sportsDbId);
    
    /**
     * Busca eventos por liga
     */
    List<EventoDeportivo> findByLiga(Liga liga);
    
    /**
     * Busca eventos activos por liga
     */
    List<EventoDeportivo> findByLigaAndActivoTrue(Liga liga);
    
    /**
     * Busca eventos por equipo local
     */
    List<EventoDeportivo> findByEquipoLocal(Equipo equipoLocal);
    
    /**
     * Busca eventos por equipo visitante
     */
    List<EventoDeportivo> findByEquipoVisitante(Equipo equipoVisitante);
    
    /**
     * Busca eventos por cualquier equipo (local o visitante)
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.equipoLocal = :equipo OR e.equipoVisitante = :equipo")
    List<EventoDeportivo> findByEquipo(@Param("equipo") Equipo equipo);
    
    /**
     * Busca eventos por estado
     */
    List<EventoDeportivo> findByEstado(String estado);
    
    /**
     * Busca eventos en vivo
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.estado IN ('Live', 'Match Finished') AND e.activo = true")
    List<EventoDeportivo> findEventosEnVivo();
    
    /**
     * Busca eventos futuros
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.fechaEvento > :fecha AND e.activo = true ORDER BY e.fechaEvento ASC")
    List<EventoDeportivo> findEventosFuturos(@Param("fecha") LocalDateTime fecha);
    
    /**
     * Busca eventos pasados
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.fechaEvento < :fecha AND e.activo = true ORDER BY e.fechaEvento DESC")
    List<EventoDeportivo> findEventosPasados(@Param("fecha") LocalDateTime fecha);
    
    /**
     * Busca eventos en un rango de fechas
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.fechaEvento BETWEEN :fechaInicio AND :fechaFin AND e.activo = true ORDER BY e.fechaEvento ASC")
    List<EventoDeportivo> findEventosEnRangoFechas(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);
    
    /**
     * Busca eventos por temporada
     */
    List<EventoDeportivo> findByTemporada(String temporada);
    
    /**
     * Busca eventos activos
     */
    List<EventoDeportivo> findByActivoTrue();
    
    /**
     * Verifica si existe un evento con el ID de TheSportsDB
     */
    boolean existsBySportsDbId(String sportsDbId);
    
    /**
     * Busca eventos por ID de liga en TheSportsDB
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.liga.sportsDbId = :ligaSportsDbId")
    List<EventoDeportivo> findByLigaSportsDbId(@Param("ligaSportsDbId") String ligaSportsDbId);
    
    /**
     * Busca eventos para actualizar (últimos 7 días hacia atrás y próximos 30 días)
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.fechaEvento BETWEEN :fechaInicio AND :fechaFin AND e.activo = true")
    List<EventoDeportivo> findEventosParaActualizar(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);
    
    /**
     * Busca eventos sin momios para el cálculo automático de odds
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.id NOT IN (SELECT DISTINCT m.eventoDeportivo.id FROM Momio m) AND e.fechaEvento > :fecha AND e.activo = true")
    List<EventoDeportivo> findEventosSinMomios(@Param("fecha") LocalDateTime fecha);
    
    /**
     * Busca eventos por rango de fechas y estados específicos
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.fechaEvento BETWEEN :fechaInicio AND :fechaFin AND e.estado IN :estados AND e.activo = true")
    List<EventoDeportivo> findByFechaEventoBetweenAndEstadoInAndActivoTrue(
        @Param("fechaInicio") LocalDateTime fechaInicio, 
        @Param("fechaFin") LocalDateTime fechaFin, 
        @Param("estados") List<String> estados
    );
    
    /**
     * Busca eventos próximos para apuestas (próximas 24 horas)
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.fechaEvento BETWEEN :ahora AND :fechaLimite AND e.estado = 'Not Started' AND e.activo = true ORDER BY e.fechaEvento ASC")
    List<EventoDeportivo> findEventosProximosParaApuestas(@Param("ahora") LocalDateTime ahora, @Param("fechaLimite") LocalDateTime fechaLimite);
    
    /**
     * Busca eventos en vivo para apuestas
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.estado IN ('1H', '2H', 'HT', 'Live') AND e.activo = true ORDER BY e.fechaEvento ASC")
    List<EventoDeportivo> findEventosEnVivoParaApuestas();
}
