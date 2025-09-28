package com._bet.repository;

import com._bet.entity.datosMaestros.Equipo;
import com._bet.entity.datosMaestros.Liga;
import com._bet.entity.eventoEntity.EventoDeportivo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad EventoDeportivo
 */
@Repository
public interface EventoDeportivoRepository extends JpaRepository<EventoDeportivo, Long> {
    
    
    /**
     * Busca eventos por liga
     */
    List<EventoDeportivo> findByLiga(Liga liga);
    
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
     * Buscar evento por su ID en API Sports
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE e.apiSportsId = :apiSportsId")
    EventoDeportivo findByApiSportsId(@Param("apiSportsId") int apiSportsId);

    /**
     * Verifica si un evento existe por su ID en API Sports
     */
    boolean existsByApiSportsId(int apiSportsId);

    /**
     * Busca eventos por nombre del evento (case insensitive, búsqueda parcial)
     */
    @Query("SELECT e FROM EventoDeportivo e WHERE UPPER(e.nombre) LIKE UPPER(CONCAT('%', :nombre, '%'))")
    List<EventoDeportivo> findByNombreEventoContainingIgnoreCase(@Param("nombre") String nombre);

    /**
     * Buscar eventos activos por nombre de liga
     * 
     * @param nombreLiga Nombre de la liga
     * @return Lista de eventos deportivos
     */
    List<EventoDeportivo> findByLigaNombreAndLigaActivaTrue(String nombreLiga);

    /**
     * Buscar evento por nombre
     */
    EventoDeportivo findByNombre(String nombre);

}
