package com._bet.repository;

import com._bet.entity.apuestas.Apuesta;
import com._bet.entity.eventoEntity.EventoDeportivo;
import com._bet.entity.user.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para la entidad Apuesta
 */
@Repository
public interface ApuestaRepository extends JpaRepository<Apuesta, Long> {
    
    /**
     * Busca apuestas activas de un usuario
     */
    List<Apuesta> findByUsuarioAndActivaTrue(Usuario usuario);
    
    /**
     * Busca apuestas activas de un evento específico
     */
    List<Apuesta> findByEventoDeportivoAndActivaTrue(EventoDeportivo evento);
    
    /**
     * Calcula el monto total apostado por un usuario en apuestas activas
     */
    @Query("SELECT COALESCE(SUM(a.monto), 0) FROM Apuesta a WHERE a.usuario = :usuario AND a.estado = 'ACTIVA'")
    BigDecimal findMontoTotalApostadoByUsuario(@Param("usuario") Usuario usuario);
    
    /**
     * Busca apuestas por rango de fechas del evento
     */
    @Query("SELECT a FROM Apuesta a WHERE a.eventoDeportivo.fechaEvento BETWEEN :inicio AND :fin")
    List<Apuesta> findByFechaEventoBetween(@Param("inicio") LocalDateTime inicio, 
                                          @Param("fin") LocalDateTime fin);
    
    /**
     * Busca apuestas por estado y activas
     */
    List<Apuesta> findByEstadoAndActivaTrue(Apuesta.EstadoApuesta estado);
    
    /**
     * Busca apuestas de un usuario por estado
     */
    List<Apuesta> findByUsuarioAndEstadoAndActivaTrue(Usuario usuario, Apuesta.EstadoApuesta estado);
    
    /**
     * Busca apuestas pendientes de liquidación
     */
    @Query("SELECT a FROM Apuesta a WHERE a.eventoDeportivo.estado IN ('Match Finished', 'FINALIZADO') AND a.estado = 'ACTIVA'")
    List<Apuesta> findApuestasPendientesLiquidacion();
    
    /**
     * Calcula ganancias totales de un usuario
     */
    @Query("SELECT COALESCE(SUM(a.gananciaReal), 0) FROM Apuesta a WHERE a.usuario = :usuario AND a.resultadoFinal = 'GANADA'")
    BigDecimal findGananciasTotalesByUsuario(@Param("usuario") Usuario usuario);
    
    /**
     * Cuenta apuestas ganadas de un usuario
     */
    @Query("SELECT COUNT(a) FROM Apuesta a WHERE a.usuario = :usuario AND a.resultadoFinal = 'GANADA'")
    Long countApuestasGanadasByUsuario(@Param("usuario") Usuario usuario);
    
    /**
     * Cuenta apuestas perdidas de un usuario
     */
    @Query("SELECT COUNT(a) FROM Apuesta a WHERE a.usuario = :usuario AND a.resultadoFinal = 'PERDIDA'")
    Long countApuestasPerdidasByUsuario(@Param("usuario") Usuario usuario);
    
    /**
     * Busca apuestas de un usuario ordenadas por fecha de creación
     */
    org.springframework.data.domain.Page<Apuesta> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Busca apuestas de un usuario por estado
     */
    List<Apuesta> findByUsuarioIdAndEstado(Long usuarioId, Apuesta.EstadoApuesta estado);
    
    /**
     * Busca apuestas por evento y estado
     */
    List<Apuesta> findByEventoDeportivoIdAndEstado(Long eventoId, Apuesta.EstadoApuesta estado);
    
    /**
     * Cuenta apuestas por estado
     */
    long countByEstado(Apuesta.EstadoApuesta estado);
    
    /**
     * Suma el monto total apostado después de una fecha
     */
    @Query("SELECT COALESCE(SUM(a.monto), 0) FROM Apuesta a WHERE a.fechaCreacion >= :fecha")
    BigDecimal sumMontoByFechaCreacionAfter(@Param("fecha") LocalDateTime fecha);
    
    /**
     * Busca apuestas de un parlay específico
     */
    List<Apuesta> findByParlayIdAndEstado(Long parlayId, Apuesta.EstadoApuesta estado);

    /**
     * Busca todas las apuestas de un usuario ordenadas por fecha (sin paginación)
     */
    List<Apuesta> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
}
