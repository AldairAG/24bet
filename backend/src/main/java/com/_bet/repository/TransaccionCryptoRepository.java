package com._bet.repository;

import com._bet.entity.TransaccionCrypto;
import com._bet.entity.Usuario;
import com._bet.entity.CryptoWallet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransaccionCryptoRepository extends JpaRepository<TransaccionCrypto, Long> {
    
    /**
     * Encuentra todas las transacciones de un usuario
     */
    List<TransaccionCrypto> findByUsuario(Usuario usuario);
    
    /**
     * Encuentra todas las transacciones de un usuario por ID
     */
    List<TransaccionCrypto> findByUsuarioId(Long usuarioId);
    
    /**
     * Encuentra todas las transacciones de un usuario paginadas
     */
    Page<TransaccionCrypto> findByUsuario(Usuario usuario, Pageable pageable);
    
    /**
     * Encuentra todas las transacciones de un usuario por ID paginadas
     */
    Page<TransaccionCrypto> findByUsuarioId(Long usuarioId, Pageable pageable);
    
    /**
     * Encuentra transacciones por estado
     */
    List<TransaccionCrypto> findByEstado(TransaccionCrypto.EstadoTransaccion estado);
    
    /**
     * Encuentra transacciones por estado paginadas
     */
    Page<TransaccionCrypto> findByEstado(TransaccionCrypto.EstadoTransaccion estado, Pageable pageable);
    
    /**
     * Encuentra transacciones por tipo
     */
    List<TransaccionCrypto> findByTipoTransaccion(TransaccionCrypto.TipoTransaccion tipoTransaccion);
    
    /**
     * Encuentra transacciones por usuario y estado
     */
    List<TransaccionCrypto> findByUsuarioAndEstado(Usuario usuario, TransaccionCrypto.EstadoTransaccion estado);
    
    /**
     * Encuentra transacciones por usuario ID y estado
     */
    List<TransaccionCrypto> findByUsuarioIdAndEstado(Long usuarioId, TransaccionCrypto.EstadoTransaccion estado);
    
    /**
     * Encuentra transacciones por usuario y tipo
     */
    List<TransaccionCrypto> findByUsuarioAndTipoTransaccion(Usuario usuario, TransaccionCrypto.TipoTransaccion tipoTransaccion);
    
    /**
     * Encuentra transacciones por usuario ID y tipo
     */
    List<TransaccionCrypto> findByUsuarioIdAndTipoTransaccion(Long usuarioId, TransaccionCrypto.TipoTransaccion tipoTransaccion);
    
    /**
     * Encuentra transacciones por usuario, tipo y estado
     */
    List<TransaccionCrypto> findByUsuarioAndTipoTransaccionAndEstado(Usuario usuario, TransaccionCrypto.TipoTransaccion tipoTransaccion, TransaccionCrypto.EstadoTransaccion estado);
    
    /**
     * Encuentra transacciones por wallet
     */
    List<TransaccionCrypto> findByWallet(CryptoWallet wallet);
    
    /**
     * Encuentra transacciones por wallet ID
     */
    List<TransaccionCrypto> findByWalletId(Long walletId);
    
    /**
     * Encuentra transacciones por hash de transacción
     */
    Optional<TransaccionCrypto> findByHashTransaccion(String hashTransaccion);
    
    /**
     * Encuentra transacciones pendientes
     */
    @Query("SELECT t FROM TransaccionCrypto t WHERE t.estado = 'PENDIENTE' ORDER BY t.fechaCreacion ASC")
    List<TransaccionCrypto> findTransaccionesPendientes();
    
    /**
     * Encuentra transacciones pendientes paginadas
     */
    @Query("SELECT t FROM TransaccionCrypto t WHERE t.estado = 'PENDIENTE' ORDER BY t.fechaCreacion ASC")
    Page<TransaccionCrypto> findTransaccionesPendientes(Pageable pageable);
    
    /**
     * Encuentra transacciones en un rango de fechas
     */
    @Query("SELECT t FROM TransaccionCrypto t WHERE t.fechaCreacion BETWEEN :fechaInicio AND :fechaFin ORDER BY t.fechaCreacion DESC")
    List<TransaccionCrypto> findByFechaCreacionBetween(
        @Param("fechaInicio") LocalDateTime fechaInicio, 
        @Param("fechaFin") LocalDateTime fechaFin
    );
    
    /**
     * Encuentra transacciones por usuario en un rango de fechas
     */
    @Query("SELECT t FROM TransaccionCrypto t WHERE t.usuario = :usuario AND t.fechaCreacion BETWEEN :fechaInicio AND :fechaFin ORDER BY t.fechaCreacion DESC")
    List<TransaccionCrypto> findByUsuarioAndFechaCreacionBetween(
        @Param("usuario") Usuario usuario,
        @Param("fechaInicio") LocalDateTime fechaInicio, 
        @Param("fechaFin") LocalDateTime fechaFin
    );
    
    /**
     * Cuenta transacciones pendientes
     */
    @Query("SELECT COUNT(t) FROM TransaccionCrypto t WHERE t.estado = 'PENDIENTE'")
    Long countTransaccionesPendientes();
    
    /**
     * Cuenta transacciones de un usuario por estado
     */
    @Query("SELECT COUNT(t) FROM TransaccionCrypto t WHERE t.usuario = :usuario AND t.estado = :estado")
    Long countByUsuarioAndEstado(@Param("usuario") Usuario usuario, @Param("estado") TransaccionCrypto.EstadoTransaccion estado);
    
    /**
     * Suma total de depósitos aprobados de un usuario
     */
    @Query("SELECT COALESCE(SUM(t.cantidadUsd), 0) FROM TransaccionCrypto t WHERE t.usuario = :usuario AND t.tipoTransaccion = 'DEPOSITO' AND t.estado = 'APROBADO'")
    BigDecimal sumDepositosAprobadosByUsuario(@Param("usuario") Usuario usuario);
    
    /**
     * Suma total de retiros aprobados de un usuario
     */
    @Query("SELECT COALESCE(SUM(t.cantidadUsd), 0) FROM TransaccionCrypto t WHERE t.usuario = :usuario AND t.tipoTransaccion = 'RETIRO' AND t.estado = 'APROBADO'")
    BigDecimal sumRetirosAprobadosByUsuario(@Param("usuario") Usuario usuario);
    
    /**
     * Encuentra las últimas transacciones de un usuario
     */
    @Query("SELECT t FROM TransaccionCrypto t WHERE t.usuario = :usuario ORDER BY t.fechaCreacion DESC")
    List<TransaccionCrypto> findUltimasTransaccionesByUsuario(@Param("usuario") Usuario usuario, Pageable pageable);
    
    /**
     * Encuentra transacciones por tipo de crypto
     */
    List<TransaccionCrypto> findByTipoCrypto(CryptoWallet.TipoCrypto tipoCrypto);
    
    /**
     * Encuentra transacciones procesadas por un admin
     */
    List<TransaccionCrypto> findByProcesadoPor(Usuario admin);
    
    /**
     * Estadísticas de transacciones por estado
     */
    @Query("SELECT t.estado, COUNT(t) FROM TransaccionCrypto t GROUP BY t.estado")
    List<Object[]> getEstadisticasPorEstado();
    
    /**
     * Estadísticas de transacciones por tipo
     */
    @Query("SELECT t.tipoTransaccion, COUNT(t) FROM TransaccionCrypto t GROUP BY t.tipoTransaccion")
    List<Object[]> getEstadisticasPorTipo();
    
    /**
     * Estadísticas de transacciones por tipo de crypto
     */
    @Query("SELECT t.tipoCrypto, COUNT(t) FROM TransaccionCrypto t GROUP BY t.tipoCrypto")
    List<Object[]> getEstadisticasPorTipoCrypto();
    
    /**
     * Volumen total de transacciones por mes
     */
    @Query("SELECT FUNCTION('MONTH', t.fechaCreacion), FUNCTION('YEAR', t.fechaCreacion), SUM(t.cantidadUsd) " +
           "FROM TransaccionCrypto t WHERE t.estado = 'APROBADO' " +
           "GROUP BY FUNCTION('YEAR', t.fechaCreacion), FUNCTION('MONTH', t.fechaCreacion) " +
           "ORDER BY FUNCTION('YEAR', t.fechaCreacion) DESC, FUNCTION('MONTH', t.fechaCreacion) DESC")
    List<Object[]> getVolumenMensual();
}
