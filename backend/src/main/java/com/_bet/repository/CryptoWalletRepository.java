package com._bet.repository;

import com._bet.entity.user.CryptoWallet;
import com._bet.entity.user.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CryptoWalletRepository extends JpaRepository<CryptoWallet, Long> {
    
    /**
     * Encuentra todos los wallets de un usuario específico
     */
    List<CryptoWallet> findByUsuario(Usuario usuario);
    
    /**
     * Encuentra todos los wallets de un usuario por su ID
     */
    List<CryptoWallet> findByUsuarioId(Long usuarioId);
    
    /**
     * Encuentra todos los wallets activos de un usuario
     */
    List<CryptoWallet> findByUsuarioAndActivoTrue(Usuario usuario);
    
    /**
     * Encuentra todos los wallets activos de un usuario por su ID
     */
    List<CryptoWallet> findByUsuarioIdAndActivoTrue(Long usuarioId);
    
    /**
     * Encuentra un wallet específico por usuario y tipo de crypto
     */
    Optional<CryptoWallet> findByUsuarioAndTipoCrypto(Usuario usuario, CryptoWallet.TipoCrypto tipoCrypto);
    
    /**
     * Encuentra un wallet específico por usuario ID y tipo de crypto
     */
    Optional<CryptoWallet> findByUsuarioIdAndTipoCrypto(Long usuarioId, CryptoWallet.TipoCrypto tipoCrypto);
    
    /**
     * Encuentra un wallet por su dirección
     */
    Optional<CryptoWallet> findByAddress(String address);
    
    /**
     * Verifica si existe un wallet con una dirección específica
     */
    boolean existsByAddress(String address);
    
    /**
     * Encuentra todos los wallets de un tipo de crypto específico
     */
    List<CryptoWallet> findByTipoCrypto(CryptoWallet.TipoCrypto tipoCrypto);
    
    /**
     * Encuentra todos los wallets activos de un tipo de crypto específico
     */
    List<CryptoWallet> findByTipoCryptoAndActivoTrue(CryptoWallet.TipoCrypto tipoCrypto);
    
    /**
     * Cuenta el número de wallets activos de un usuario
     */
    @Query("SELECT COUNT(w) FROM CryptoWallet w WHERE w.usuario = :usuario AND w.activo = true")
    Long countActiveWalletsByUsuario(@Param("usuario") Usuario usuario);
    
    /**
     * Obtiene el total de transacciones de todos los wallets de un usuario
     */
    @Query("SELECT SUM(w.numeroTransacciones) FROM CryptoWallet w WHERE w.usuario = :usuario AND w.activo = true")
    Long getTotalTransaccionesByUsuario(@Param("usuario") Usuario usuario);
    
    /**
     * Obtiene todos los wallets ordenados por fecha de última transacción
     */
    @Query("SELECT w FROM CryptoWallet w WHERE w.usuario = :usuario ORDER BY w.ultimaTransaccion DESC NULLS LAST")
    List<CryptoWallet> findByUsuarioOrderByUltimaTransaccionDesc(@Param("usuario") Usuario usuario);
    
    /**
     * Encuentra wallets con balance mayor a cero
     */
    @Query("SELECT w FROM CryptoWallet w WHERE w.usuario = :usuario AND w.balanceActual > 0 AND w.activo = true")
    List<CryptoWallet> findWalletsWithBalance(@Param("usuario") Usuario usuario);
}
