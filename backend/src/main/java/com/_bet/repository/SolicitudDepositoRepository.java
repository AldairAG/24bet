package com._bet.repository;

import com._bet.entity.SolicitudDeposito;
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
 * Repositorio para gestionar solicitudes de depósito
 */
@Repository
public interface SolicitudDepositoRepository extends JpaRepository<SolicitudDeposito, Long> {

    /**
     * Busca solicitudes por usuario
     */
    List<SolicitudDeposito> findByUsuarioOrderByFechaSolicitudDesc(Usuario usuario);

    /**
     * Busca solicitudes por usuario con paginación
     */
    Page<SolicitudDeposito> findByUsuarioOrderByFechaSolicitudDesc(Usuario usuario, Pageable pageable);

    /**
     * Busca solicitudes por estado
     */
    List<SolicitudDeposito> findByEstadoOrderByFechaSolicitudAsc(SolicitudDeposito.EstadoSolicitud estado);

    /**
     * Busca solicitudes por usuario y estado
     */
    List<SolicitudDeposito> findByUsuarioAndEstadoOrderByFechaSolicitudDesc(Usuario usuario, SolicitudDeposito.EstadoSolicitud estado);

    /**
     * Busca solicitudes por rango de fechas
     */
    List<SolicitudDeposito> findByFechaSolicitudBetweenOrderByFechaSolicitudDesc(LocalDateTime inicio, LocalDateTime fin);

    /**
     * Busca solicitudes por método de pago
     */
    List<SolicitudDeposito> findByMetodoPagoOrderByFechaSolicitudDesc(SolicitudDeposito.MetodoPago metodoPago);

    /**
     * Cuenta solicitudes por estado
     */
    long countByEstado(SolicitudDeposito.EstadoSolicitud estado);

    /**
     * Cuenta solicitudes pendientes
     */
    @Query("SELECT COUNT(s) FROM SolicitudDeposito s WHERE s.estado = 'PENDIENTE'")
    long countSolicitudesPendientes();

    /**
     * Suma total depositado por usuario
     */
    @Query("SELECT COALESCE(SUM(s.monto), 0) FROM SolicitudDeposito s WHERE s.usuario = :usuario AND s.estado = 'COMPLETADA'")
    BigDecimal sumMontoCompletadoByUsuario(@Param("usuario") Usuario usuario);

    /**
     * Suma total depositado en un rango de fechas
     */
    @Query("SELECT COALESCE(SUM(s.monto), 0) FROM SolicitudDeposito s WHERE s.fechaProcesamiento BETWEEN :inicio AND :fin AND s.estado = 'COMPLETADA'")
    BigDecimal sumMontoCompletadoByFecha(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    /**
     * Busca solicitudes por referencia de transacción
     */
    List<SolicitudDeposito> findByReferenciaTransaccion(String referencia);

    /**
     * Busca solicitudes por hash de transacción
     */
    List<SolicitudDeposito> findByHashTransaccion(String hash);

    /**
     * Busca solicitudes recientes de un usuario (últimas 24 horas)
     */
    @Query("SELECT s FROM SolicitudDeposito s WHERE s.usuario = :usuario AND s.fechaSolicitud >= :fecha")
    List<SolicitudDeposito> findSolicitudesRecientesByUsuario(@Param("usuario") Usuario usuario, @Param("fecha") LocalDateTime fecha);

    /**
     * Busca solicitudes por monto mínimo
     */
    List<SolicitudDeposito> findByMontoGreaterThanEqualOrderByFechaSolicitudDesc(BigDecimal montoMinimo);

    /**
     * Obtiene estadísticas de depósitos por usuario
     */
    @Query("SELECT COUNT(s) as total, COALESCE(SUM(s.monto), 0) as monto FROM SolicitudDeposito s WHERE s.usuario = :usuario AND s.estado = 'COMPLETADA'")
    Object[] getEstadisticasDepositosByUsuario(@Param("usuario") Usuario usuario);

    /**
     * Suma depósitos completados en un rango de fechas
     */
    @Query("SELECT COALESCE(SUM(s.monto), 0) FROM SolicitudDeposito s WHERE s.estado = :estado AND s.fechaProcesamiento BETWEEN :fechaInicio AND :fechaFin")
    BigDecimal sumMontoByEstadoAndFechaBetween(
        @Param("estado") SolicitudDeposito.EstadoSolicitud estado,
        @Param("fechaInicio") LocalDateTime fechaInicio,
        @Param("fechaFin") LocalDateTime fechaFin
    );
}
