package com._bet.repository;

import com._bet.entity.apuestas.Parlay;
import com._bet.entity.user.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repositorio para la entidad Parlay
 */
@Repository
public interface ParlayRepository extends JpaRepository<Parlay, Long> {
    
    /**
     * Busca parlays activos de un usuario
     */
    List<Parlay> findByUsuarioAndActivoTrue(Usuario usuario);
    
    /**
     * Busca parlays por estado y activos
     */
    List<Parlay> findByEstadoAndActivoTrue(Parlay.EstadoParlay estado);
    
    /**
     * Calcula el monto total en parlays activos de un usuario
     */
    @Query("SELECT COALESCE(SUM(p.montoTotal), 0) FROM Parlay p WHERE p.usuario = :usuario AND p.estado = 'ACTIVO'")
    BigDecimal findMontoTotalParlaysByUsuario(@Param("usuario") Usuario usuario);
    
    /**
     * Busca parlays de un usuario por estado
     */
    List<Parlay> findByUsuarioAndEstadoAndActivoTrue(Usuario usuario, Parlay.EstadoParlay estado);
    
    /**
     * Busca parlays pendientes de liquidación
     */
    @Query("SELECT DISTINCT p FROM Parlay p JOIN p.apuestas a WHERE a.eventoDeportivo.estado IN ('Match Finished', 'FINALIZADO') AND p.estado = 'ACTIVO'")
    List<Parlay> findParlaysPendientesLiquidacion();
    
    /**
     * Calcula ganancias totales en parlays de un usuario
     */
    @Query("SELECT COALESCE(SUM(p.gananciaReal), 0) FROM Parlay p WHERE p.usuario = :usuario AND p.resultadoFinal = 'GANADO'")
    BigDecimal findGananciasTotalesParlaysByUsuario(@Param("usuario") Usuario usuario);
    
    /**
     * Cuenta parlays ganados de un usuario
     */
    @Query("SELECT COUNT(p) FROM Parlay p WHERE p.usuario = :usuario AND p.resultadoFinal = 'GANADO'")
    Long countParlaysGanadosByUsuario(@Param("usuario") Usuario usuario);
    
    /**
     * Cuenta parlays perdidos de un usuario
     */
    @Query("SELECT COUNT(p) FROM Parlay p WHERE p.usuario = :usuario AND p.resultadoFinal = 'PERDIDO'")
    Long countParlaysPerdidosByUsuario(@Param("usuario") Usuario usuario);

    /**
     * Busca parlays de un usuario ordenados por fecha de creación
     */
    List<Parlay> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
}
