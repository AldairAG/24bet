package com._bet.repository;

import com._bet.entity.eventoEntity.EventoDeportivo;
import com._bet.entity.eventoEntity.Momio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Momio
 */
@Repository
public interface MomioRepository extends JpaRepository<Momio, Long> {
    
    /**
     * Busca momios activos de un evento específico
     */
    List<Momio> findByEventoDeportivoAndActivoTrue(EventoDeportivo evento);
    
    /**
     * Busca momios con alta demanda (muchas apuestas)
     */
    @Query("SELECT m FROM Momio m WHERE m.numeroApuestas > :minApuestas AND m.activo = true ORDER BY m.numeroApuestas DESC")
    List<Momio> findMomiosAltaDemanda(@Param("minApuestas") Integer minApuestas);
    
    /**
     * Busca momios activos con paginación ordenados por fecha de creación
     */
    org.springframework.data.domain.Page<Momio> findByActivoTrueOrderByFechaCreacionDesc(org.springframework.data.domain.Pageable pageable);

    /**
     * Busca momios activos de un evento específico ordenados por tipo de apuesta
     */
    List<Momio> findByEventoDeportivoAndActivoTrueOrderByTipoApuesta(EventoDeportivo eventoDeportivo);

    /**
     * Cuenta total de momios activos
     */
    long countByActivoTrue();

    /**
     * Cuenta eventos distintos con momios activos
     */
    @Query("SELECT COUNT(DISTINCT m.eventoDeportivo) FROM Momio m WHERE m.activo = true")
    long countDistinctEventosByActivoTrue();

}
