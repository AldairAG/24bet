package com._bet.controller;

import com._bet.dto.CryptoWalletDto;
import com._bet.entity.CryptoWallet;
import com._bet.service.cryptoWallet.CryptoWalletService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/24bet/crypto-wallets")
@CrossOrigin(origins = "*")
public class CryptoWalletController {
    
    @Autowired
    private CryptoWalletService cryptoWalletService;

    /**
     * Crea un nuevo wallet crypto para un usuario
     */
    @PostMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CryptoWalletDto> createWallet(
            @PathVariable Long usuarioId,
            @Valid @RequestBody CryptoWalletDto.CreateCryptoWalletDto createDto) {
        
        try {
            CryptoWalletDto walletDto = cryptoWalletService.createWallet(usuarioId, createDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(walletDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtiene todos los wallets de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<CryptoWalletDto>> getWalletsByUsuario(@PathVariable Long usuarioId) {
        List<CryptoWalletDto> wallets = cryptoWalletService.getWalletsByUsuario(usuarioId);
        return ResponseEntity.ok(wallets);
    }
    
    /**
     * Obtiene todos los wallets activos de un usuario
     */
    @GetMapping("/usuario/{usuarioId}/activos")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<CryptoWalletDto>> getActiveWalletsByUsuario(@PathVariable Long usuarioId) {
        List<CryptoWalletDto> wallets = cryptoWalletService.getActiveWalletsByUsuario(usuarioId);
        return ResponseEntity.ok(wallets);
    }
    
    /**
     * Obtiene un resumen de los wallets de un usuario
     */
    @GetMapping("/usuario/{usuarioId}/resumen")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<CryptoWalletDto.CryptoWalletSummaryDto>> getWalletsSummary(@PathVariable Long usuarioId) {
        List<CryptoWalletDto.CryptoWalletSummaryDto> summary = cryptoWalletService.getWalletsSummary(usuarioId);
        return ResponseEntity.ok(summary);
    }
    
    /**
     * Obtiene estadísticas de wallets de un usuario
     */
    @GetMapping("/usuario/{usuarioId}/estadisticas")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CryptoWalletService.WalletStatsDto> getWalletStats(@PathVariable Long usuarioId) {
        CryptoWalletService.WalletStatsDto stats = cryptoWalletService.getWalletStats(usuarioId);
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Obtiene un wallet específico por ID
     */
    @GetMapping("/{walletId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CryptoWalletDto> getWalletById(@PathVariable Long walletId) {
        try {
            CryptoWalletDto wallet = cryptoWalletService.getWalletById(walletId);
            return ResponseEntity.ok(wallet);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtiene un wallet por usuario y tipo de crypto
     */
    @GetMapping("/usuario/{usuarioId}/tipo/{tipoCrypto}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CryptoWalletDto> getWalletByUsuarioAndTipo(
            @PathVariable Long usuarioId,
            @PathVariable CryptoWallet.TipoCrypto tipoCrypto) {
        
        Optional<CryptoWalletDto> wallet = cryptoWalletService.getWalletByUsuarioAndTipo(usuarioId, tipoCrypto);
        return wallet.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Actualiza un wallet
     */
    @PutMapping("/{walletId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CryptoWalletDto> updateWallet(
            @PathVariable Long walletId,
            @Valid @RequestBody CryptoWalletDto.UpdateCryptoWalletDto updateDto) {
        
        try {
            CryptoWalletDto updatedWallet = cryptoWalletService.updateWallet(walletId, updateDto);
            return ResponseEntity.ok(updatedWallet);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Actualiza el balance de un wallet
     */
    @PatchMapping("/{walletId}/balance")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CryptoWalletDto> updateBalance(
            @PathVariable Long walletId,
            @RequestBody BalanceUpdateRequest request) {
        
        try {
            CryptoWalletDto updatedWallet = cryptoWalletService.updateBalance(walletId, request.getNuevoBalance());
            return ResponseEntity.ok(updatedWallet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Procesa un depósito en un wallet
     */
    @PostMapping("/{walletId}/deposito")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CryptoWalletDto> processDeposit(
            @PathVariable Long walletId,
            @RequestBody TransactionRequest request) {
        
        try {
            CryptoWalletDto updatedWallet = cryptoWalletService.processDeposit(walletId, request.getCantidad());
            return ResponseEntity.ok(updatedWallet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Procesa un retiro de un wallet
     */
    @PostMapping("/{walletId}/retiro")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CryptoWalletDto> processWithdrawal(
            @PathVariable Long walletId,
            @RequestBody TransactionRequest request) {
        
        try {
            CryptoWalletDto updatedWallet = cryptoWalletService.processWithdrawal(walletId, request.getCantidad());
            return ResponseEntity.ok(updatedWallet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Desactiva un wallet
     */
    @PatchMapping("/{walletId}/desactivar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivateWallet(@PathVariable Long walletId) {
        try {
            cryptoWalletService.deactivateWallet(walletId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Activa un wallet
     */
    @PatchMapping("/{walletId}/activar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> activateWallet(@PathVariable Long walletId) {
        try {
            cryptoWalletService.activateWallet(walletId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtiene todos los tipos de criptomonedas disponibles
     */
    @GetMapping("/tipos-crypto")
    public ResponseEntity<CryptoWallet.TipoCrypto[]> getTiposCrypto() {
        return ResponseEntity.ok(CryptoWallet.TipoCrypto.values());
    }
    
    // ========== CLASES AUXILIARES ==========
    
    public static class BalanceUpdateRequest {
        private BigDecimal nuevoBalance;
        
        public BigDecimal getNuevoBalance() {
            return nuevoBalance;
        }
        
        public void setNuevoBalance(BigDecimal nuevoBalance) {
            this.nuevoBalance = nuevoBalance;
        }
    }
    
    public static class TransactionRequest {
        private BigDecimal cantidad;
        
        public BigDecimal getCantidad() {
            return cantidad;
        }
        
        public void setCantidad(BigDecimal cantidad) {
            this.cantidad = cantidad;
        }
    }
}
