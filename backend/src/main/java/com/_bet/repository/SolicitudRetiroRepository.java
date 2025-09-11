package com._bet.repository;

import com._bet.entity.SolicitudRetiro;
import com._bet.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para gestionar solicitudes de retiro
 */
@Repository
public interface SolicitudRetiroRepository extends JpaRepository<SolicitudRetiro, Long> {

    /**
     * Busca solicitudes por usuario
     */
    List<SolicitudRetiro> findByUsuarioOrderByFechaSolicitudDesc(Usuario usuario);

    /**
     * Busca solicitudes por usuario con paginación
     */
    Page<SolicitudRetiro> findByUsuarioOrderByFechaSolicitudDesc(Usuario usuario, Pageable pageable);

    /**
     * Busca solicitudes por estado
     */
    List<SolicitudRetiro> findByEstadoOrderByFechaSolicitudAsc(SolicitudRetiro.EstadoSolicitud estado);

    /**
     * Busca solicitudes por usuario y estado
     */
    List<SolicitudRetiro> findByUsuarioAndEstadoOrderByFechaSolicitudDesc(Usuario usuario, SolicitudRetiro.EstadoSolicitud estado);

    /**
     * Busca solicitudes por rango de fechas
     */
    List<SolicitudRetiro> findByFechaSolicitudBetweenOrderByFechaSolicitudDesc(LocalDateTime inicio, LocalDateTime fin);

    /**
     * Busca solicitudes por método de retiro
     */
    List<SolicitudRetiro> findByMetodoRetiroOrderByFechaSolicitudDesc(SolicitudRetiro.MetodoRetiro metodoRetiro);

    /**
     * Cuenta solicitudes por estado
     */
    long countByEstado(SolicitudRetiro.EstadoSolicitud estado);

    /**
     * Cuenta solicitudes pendientes
     */
    @Query("SELECT COUNT(s) FROM SolicitudRetiro s WHERE s.estado = 'PENDIENTE'")
    long countSolicitudesPendientes();

    /**
     * Suma total retirado por usuario
     */
    @Query("SELECT COALESCE(SUM(s.monto), 0) FROM SolicitudRetiro s WHERE s.usuario = :usuario AND s.estado = 'COMPLETADA'")
    BigDecimal sumMontoCompletadoByUsuario(@Param("usuario") Usuario usuario);

    /**
     * Suma total retirado en un rango de fechas
     */
    @Query("SELECT COALESCE(SUM(s.monto), 0) FROM SolicitudRetiro s WHERE s.fechaProcesamiento BETWEEN :inicio AND :fin AND s.estado = 'COMPLETADA'")
    BigDecimal sumMontoCompletadoByFecha(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    /**
     * Busca solicitudes por referencia de transacción
     */
    List<SolicitudRetiro> findByReferenciaTransaccion(String referencia);

    /**
     * Busca solicitudes por hash de transacción
     */
    List<SolicitudRetiro> findByHashTransaccion(String hash);

    /**
     * Busca solicitudes recientes de un usuario (últimas 24 horas)
     */
    @Query("SELECT s FROM SolicitudRetiro s WHERE s.usuario = :usuario AND s.fechaSolicitud >= :fecha")
    List<SolicitudRetiro> findSolicitudesRecientesByUsuario(@Param("usuario") Usuario usuario, @Param("fecha") LocalDateTime fecha);

    /**
     * Busca solicitudes por monto mínimo
     */
    List<SolicitudRetiro> findByMontoGreaterThanEqualOrderByFechaSolicitudDesc(BigDecimal montoMinimo);

    /**
     * Obtiene estadísticas de retiros por usuario
     */
    @Query("SELECT COUNT(s) as total, COALESCE(SUM(s.monto), 0) as monto FROM SolicitudRetiro s WHERE s.usuario = :usuario AND s.estado = 'COMPLETADA'")
    Object[] getEstadisticasRetirosByUsuario(@Param("usuario") Usuario usuario);

    /**
     * Suma total de comisiones cobradas
     */
    @Query("SELECT COALESCE(SUM(s.comision), 0) FROM SolicitudRetiro s WHERE s.estado = 'COMPLETADA'")
    BigDecimal sumTotalComisiones();

    /**
     * Busca solicitudes que requieren verificación adicional
     */
    @Query("SELECT s FROM SolicitudRetiro s WHERE s.monto >= :montoMinimo AND s.estado = 'PENDIENTE'")
    List<SolicitudRetiro> findSolicitudesQueRequierenVerificacion(@Param("montoMinimo") BigDecimal montoMinimo);

    /**
     * Suma retiros completados en un rango de fechas
     */
    @Query("SELECT COALESCE(SUM(s.monto), 0) FROM SolicitudRetiro s WHERE s.estado = :estado AND s.fechaProcesamiento BETWEEN :fechaInicio AND :fechaFin")
    BigDecimal sumMontoByEstadoAndFechaBetween(
        @Param("estado") SolicitudRetiro.EstadoSolicitud estado,
        @Param("fechaInicio") LocalDateTime fechaInicio,
        @Param("fechaFin") LocalDateTime fechaFin
    );
}
