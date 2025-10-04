package com._bet.repository;

import com._bet.entity.eventoEntity.EventoDeportivo;
import com._bet.entity.eventoEntity.Momio;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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
     * Busca momios activos con paginación ordenados por fecha de creación
     */
    Page<Momio> findByActivoTrueOrderByFechaCreacionDesc(Pageable pageable);

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
