package com._bet.service.cryptoWallet;

import com._bet.dto.CryptoWalletDto;
import com._bet.entity.CryptoWallet;
import com._bet.entity.Usuario;
import com._bet.repository.CryptoWalletRepository;
import com._bet.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CryptoWalletService {
    
    private final CryptoWalletRepository cryptoWalletRepository;
    private final UsuarioRepository usuarioRepository;
    
    /**
     * Crea un nuevo wallet crypto para un usuario
     */
    public CryptoWalletDto createWallet(Long usuarioId, CryptoWalletDto.CreateCryptoWalletDto createDto) {
        // Verificar que el usuario existe
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Verificar que no existe un wallet del mismo tipo para el usuario
        Optional<CryptoWallet> existingWallet = cryptoWalletRepository
            .findByUsuarioAndTipoCrypto(usuario, createDto.getTipoCrypto());
        
        if (existingWallet.isPresent()) {
            throw new RuntimeException("El usuario ya tiene un wallet de tipo " + createDto.getTipoCrypto());
        }
        
        // Verificar que la dirección no esté en uso
        if (cryptoWalletRepository.existsByAddress(createDto.getAddress())) {
            throw new RuntimeException("La dirección del wallet ya está en uso");
        }
        
        // Crear el nuevo wallet
        CryptoWallet wallet = new CryptoWallet();
        wallet.setNombre(createDto.getNombre());
        wallet.setAddress(createDto.getAddress());
        wallet.setTipoCrypto(createDto.getTipoCrypto());
        wallet.setBalanceActual(createDto.getBalanceInicial());
        wallet.setUsuario(usuario);
        
        CryptoWallet savedWallet = cryptoWalletRepository.save(wallet);
        return CryptoWalletDto.fromEntity(savedWallet);
    }
    
    /**
     * Obtiene todos los wallets de un usuario
     */
    @Transactional(readOnly = true)
    public List<CryptoWalletDto> getWalletsByUsuario(Long usuarioId) {
        return cryptoWalletRepository.findByUsuarioId(usuarioId)
            .stream()
            .map(CryptoWalletDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene todos los wallets activos de un usuario
     */
    @Transactional(readOnly = true)
    public List<CryptoWalletDto> getActiveWalletsByUsuario(Long usuarioId) {
        return cryptoWalletRepository.findByUsuarioIdAndActivoTrue(usuarioId)
            .stream()
            .map(CryptoWalletDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene un resumen de los wallets de un usuario
     */
    @Transactional(readOnly = true)
    public List<CryptoWalletDto.CryptoWalletSummaryDto> getWalletsSummary(Long usuarioId) {
        return cryptoWalletRepository.findByUsuarioIdAndActivoTrue(usuarioId)
            .stream()
            .map(CryptoWalletDto.CryptoWalletSummaryDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene un wallet específico por ID
     */
    @Transactional(readOnly = true)
    public CryptoWalletDto getWalletById(Long walletId) {
        CryptoWallet wallet = cryptoWalletRepository.findById(walletId)
            .orElseThrow(() -> new RuntimeException("Wallet no encontrado"));
        
        return CryptoWalletDto.fromEntity(wallet);
    }
    
    /**
     * Obtiene un wallet por usuario y tipo de crypto
     */
    @Transactional(readOnly = true)
    public Optional<CryptoWalletDto> getWalletByUsuarioAndTipo(Long usuarioId, CryptoWallet.TipoCrypto tipoCrypto) {
        return cryptoWalletRepository.findByUsuarioIdAndTipoCrypto(usuarioId, tipoCrypto)
            .map(CryptoWalletDto::fromEntity);
    }
    
    /**
     * Actualiza un wallet
     */
    public CryptoWalletDto updateWallet(Long walletId, CryptoWalletDto.UpdateCryptoWalletDto updateDto) {
        CryptoWallet wallet = cryptoWalletRepository.findById(walletId)
            .orElseThrow(() -> new RuntimeException("Wallet no encontrado"));
        
        if (updateDto.getNombre() != null) {
            wallet.setNombre(updateDto.getNombre());
        }
        
        if (updateDto.getBalanceActual() != null) {
            wallet.setBalanceActual(updateDto.getBalanceActual());
        }
        
        if (updateDto.getActivo() != null) {
            wallet.setActivo(updateDto.getActivo());
        }
        
        CryptoWallet updatedWallet = cryptoWalletRepository.save(wallet);
        return CryptoWalletDto.fromEntity(updatedWallet);
    }
    
    /**
     * Actualiza el balance de un wallet
     */
    public CryptoWalletDto updateBalance(Long walletId, BigDecimal nuevoBalance) {
        CryptoWallet wallet = cryptoWalletRepository.findById(walletId)
            .orElseThrow(() -> new RuntimeException("Wallet no encontrado"));
        
        wallet.actualizarBalance(nuevoBalance);
        wallet.incrementarTransacciones();
        
        CryptoWallet updatedWallet = cryptoWalletRepository.save(wallet);
        return CryptoWalletDto.fromEntity(updatedWallet);
    }
    
    /**
     * Procesa un retiro de un wallet
     */
    public CryptoWalletDto processWithdrawal(Long walletId, BigDecimal cantidad) {
        CryptoWallet wallet = cryptoWalletRepository.findById(walletId)
            .orElseThrow(() -> new RuntimeException("Wallet no encontrado"));
        
        if (!wallet.puedeRetirar(cantidad)) {
            throw new RuntimeException("No se puede procesar el retiro. Verifique el balance y que el wallet esté activo");
        }
        
        // Actualizar balance y estadísticas
        BigDecimal nuevoBalance = wallet.getBalanceActual().subtract(cantidad);
        //wallet.setBalanceActual(nuevoBalance);
        wallet.sumarRetirado(cantidad);
        wallet.incrementarTransacciones();
        
        CryptoWallet updatedWallet = cryptoWalletRepository.save(wallet);
        return CryptoWalletDto.fromEntity(updatedWallet);
    }
    
    /**
     * Procesa un depósito en un wallet
     */
    public CryptoWalletDto processDeposit(Long walletId, BigDecimal cantidad) {
        if (cantidad == null || cantidad.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("La cantidad del depósito debe ser mayor a cero");
        }
        
        CryptoWallet wallet = cryptoWalletRepository.findById(walletId)
            .orElseThrow(() -> new RuntimeException("Wallet no encontrado"));
        
        if (!wallet.getActivo()) {
            throw new RuntimeException("No se puede procesar el depósito en un wallet inactivo");
        }
        
        // Actualizar balance y estadísticas
        BigDecimal nuevoBalance = wallet.getBalanceActual().add(cantidad);
        wallet.setBalanceActual(nuevoBalance);
        wallet.incrementarTransacciones();
        
        CryptoWallet updatedWallet = cryptoWalletRepository.save(wallet);
        return CryptoWalletDto.fromEntity(updatedWallet);
    }
    
    /**
     * Desactiva un wallet
     */
    public void deactivateWallet(Long walletId) {
        CryptoWallet wallet = cryptoWalletRepository.findById(walletId)
            .orElseThrow(() -> new RuntimeException("Wallet no encontrado"));
        
        wallet.setActivo(false);
        cryptoWalletRepository.save(wallet);
    }
    
    /**
     * Activa un wallet
     */
    public void activateWallet(Long walletId) {
        CryptoWallet wallet = cryptoWalletRepository.findById(walletId)
            .orElseThrow(() -> new RuntimeException("Wallet no encontrado"));
        
        wallet.setActivo(true);
        cryptoWalletRepository.save(wallet);
    }
    
    /**
     * Obtiene estadísticas de wallets de un usuario
     */
    @Transactional(readOnly = true)
    public WalletStatsDto getWalletStats(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Long totalWallets = cryptoWalletRepository.countActiveWalletsByUsuario(usuario);
        Long totalTransacciones = cryptoWalletRepository.getTotalTransaccionesByUsuario(usuario);
        
        List<CryptoWallet> walletsWithBalance = cryptoWalletRepository.findWalletsWithBalance(usuario);
        BigDecimal balanceTotal = walletsWithBalance.stream()
            .map(CryptoWallet::getBalanceActual)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new WalletStatsDto(totalWallets, totalTransacciones, balanceTotal, walletsWithBalance.size());
    }
    
    /**
     * DTO para estadísticas de wallets
     */
    public static class WalletStatsDto {
        private final Long totalWallets;
        private final Long totalTransacciones;
        private final BigDecimal balanceTotal;
        private final Integer walletsConBalance;
        
        public WalletStatsDto(Long totalWallets, Long totalTransacciones, BigDecimal balanceTotal, Integer walletsConBalance) {
            this.totalWallets = totalWallets != null ? totalWallets : 0L;
            this.totalTransacciones = totalTransacciones != null ? totalTransacciones : 0L;
            this.balanceTotal = balanceTotal != null ? balanceTotal : BigDecimal.ZERO;
            this.walletsConBalance = walletsConBalance != null ? walletsConBalance : 0;
        }
        
        // Getters
        public Long getTotalWallets() { return totalWallets; }
        public Long getTotalTransacciones() { return totalTransacciones; }
        public BigDecimal getBalanceTotal() { return balanceTotal; }
        public Integer getWalletsConBalance() { return walletsConBalance; }
    }
}
