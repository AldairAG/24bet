package com._bet.controller;

import com._bet.controller.AuthController.ApiResponseWrapper;
import com._bet.dto.CryptoWalletDto;
import com._bet.entity.CryptoWallet;
import com._bet.entity.SolicitudDeposito;
import com._bet.entity.SolicitudRetiro;
import com._bet.service.Transaccion.SolicitudTransaccionService;
import com._bet.service.cryptoWallet.CryptoWalletService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Autowired
    private SolicitudTransaccionService solicitudTransaccionService;

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
    public ResponseEntity<ApiResponseWrapper<List<CryptoWalletDto>>> getWalletsByUsuario(@PathVariable Long usuarioId) {
        List<CryptoWalletDto> wallets = cryptoWalletService.getWalletsByUsuario(usuarioId);
        return ResponseEntity.ok(new ApiResponseWrapper<>(true,"Wallets obtenidas correctamente",wallets));
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
     * Crea una solicitud de depósito que requiere aprobación
     */
    @PostMapping("/usuario/{usuarioId}/solicitud-deposito")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<SolicitudDepositoResponse> crearSolicitudDeposito(
            @PathVariable Long usuarioId,
            @RequestBody SolicitudTransaccionService.SolicitudDepositoDto request) {
        
        try {
            SolicitudDeposito solicitud = solicitudTransaccionService.crearSolicitudDeposito(usuarioId, request);
            SolicitudDepositoResponse response = new SolicitudDepositoResponse(
                "Solicitud de depósito creada exitosamente. Pendiente de aprobación.", 
                solicitud.getId(),
                solicitud.getMonto(),
                solicitud.getEstado().toString()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Crea una solicitud de retiro que requiere aprobación
     */
    @PostMapping("/usuario/{usuarioId}/solicitud-retiro")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<SolicitudRetiroResponse> crearSolicitudRetiro(
            @PathVariable Long usuarioId,
            @RequestBody SolicitudTransaccionService.SolicitudRetiroDto request) {
        
        try {
            SolicitudRetiro solicitud = solicitudTransaccionService.crearSolicitudRetiro(usuarioId, request);
            SolicitudRetiroResponse response = new SolicitudRetiroResponse(
                "Solicitud de retiro creada exitosamente. Fondos bloqueados. Pendiente de aprobación.", 
                solicitud.getId(),
                solicitud.getMonto(),
                solicitud.getMontoNeto(),
                solicitud.getComision(),
                solicitud.getEstado().toString()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtiene solicitudes de depósito del usuario
     */
    @GetMapping("/usuario/{usuarioId}/solicitudes-deposito")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<SolicitudDeposito>> obtenerSolicitudesDeposito(
            @PathVariable Long usuarioId, Pageable pageable) {
        
        try {
            Page<SolicitudDeposito> solicitudes = solicitudTransaccionService.obtenerSolicitudesDepositoPorUsuario(usuarioId, pageable);
            return ResponseEntity.ok(solicitudes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtiene solicitudes de retiro del usuario
     */
    @GetMapping("/usuario/{usuarioId}/solicitudes-retiro")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<SolicitudRetiro>> obtenerSolicitudesRetiro(
            @PathVariable Long usuarioId, Pageable pageable) {
        
        try {
            Page<SolicitudRetiro> solicitudes = solicitudTransaccionService.obtenerSolicitudesRetiroPorUsuario(usuarioId, pageable);
            return ResponseEntity.ok(solicitudes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtiene el saldo actual del usuario
     */
    @GetMapping("/usuario/{usuarioId}/saldo")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<SaldoResponse> getSaldoUsuario(@PathVariable Long usuarioId) {
        try {
            BigDecimal saldo = cryptoWalletService.getSaldoUsuario(usuarioId);
            SaldoResponse response = new SaldoResponse(saldo);
            return ResponseEntity.ok(response);
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
    
    public static class DepositoResponse {
        private String mensaje;
        private BigDecimal cantidadDepositada;
        private BigDecimal saldoActual;
        
        public DepositoResponse(String mensaje, BigDecimal cantidadDepositada, BigDecimal saldoActual) {
            this.mensaje = mensaje;
            this.cantidadDepositada = cantidadDepositada;
            this.saldoActual = saldoActual;
        }
        
        public String getMensaje() {
            return mensaje;
        }
        
        public void setMensaje(String mensaje) {
            this.mensaje = mensaje;
        }
        
        public BigDecimal getCantidadDepositada() {
            return cantidadDepositada;
        }
        
        public void setCantidadDepositada(BigDecimal cantidadDepositada) {
            this.cantidadDepositada = cantidadDepositada;
        }
        
        public BigDecimal getSaldoActual() {
            return saldoActual;
        }
        
        public void setSaldoActual(BigDecimal saldoActual) {
            this.saldoActual = saldoActual;
        }
    }
    
    public static class RetiroResponse {
        private String mensaje;
        private BigDecimal cantidadRetirada;
        private BigDecimal saldoActual;
        
        public RetiroResponse(String mensaje, BigDecimal cantidadRetirada, BigDecimal saldoActual) {
            this.mensaje = mensaje;
            this.cantidadRetirada = cantidadRetirada;
            this.saldoActual = saldoActual;
        }
        
        public String getMensaje() {
            return mensaje;
        }
        
        public void setMensaje(String mensaje) {
            this.mensaje = mensaje;
        }
        
        public BigDecimal getCantidadRetirada() {
            return cantidadRetirada;
        }
        
        public void setCantidadRetirada(BigDecimal cantidadRetirada) {
            this.cantidadRetirada = cantidadRetirada;
        }
        
        public BigDecimal getSaldoActual() {
            return saldoActual;
        }
        
        public void setSaldoActual(BigDecimal saldoActual) {
            this.saldoActual = saldoActual;
        }
    }
    
    public static class SaldoResponse {
        private BigDecimal saldoUsd;
        
        public SaldoResponse(BigDecimal saldoUsd) {
            this.saldoUsd = saldoUsd;
        }
        
        public BigDecimal getSaldoUsd() {
            return saldoUsd;
        }
        
        public void setSaldoUsd(BigDecimal saldoUsd) {
            this.saldoUsd = saldoUsd;
        }
    }

    public static class SolicitudDepositoResponse {
        private String mensaje;
        private Long solicitudId;
        private BigDecimal monto;
        private String estado;
        
        public SolicitudDepositoResponse(String mensaje, Long solicitudId, BigDecimal monto, String estado) {
            this.mensaje = mensaje;
            this.solicitudId = solicitudId;
            this.monto = monto;
            this.estado = estado;
        }
        
        public String getMensaje() { return mensaje; }
        public void setMensaje(String mensaje) { this.mensaje = mensaje; }
        public Long getSolicitudId() { return solicitudId; }
        public void setSolicitudId(Long solicitudId) { this.solicitudId = solicitudId; }
        public BigDecimal getMonto() { return monto; }
        public void setMonto(BigDecimal monto) { this.monto = monto; }
        public String getEstado() { return estado; }
        public void setEstado(String estado) { this.estado = estado; }
    }

    public static class SolicitudRetiroResponse {
        private String mensaje;
        private Long solicitudId;
        private BigDecimal monto;
        private BigDecimal montoNeto;
        private BigDecimal comision;
        private String estado;
        
        public SolicitudRetiroResponse(String mensaje, Long solicitudId, BigDecimal monto, 
                                     BigDecimal montoNeto, BigDecimal comision, String estado) {
            this.mensaje = mensaje;
            this.solicitudId = solicitudId;
            this.monto = monto;
            this.montoNeto = montoNeto;
            this.comision = comision;
            this.estado = estado;
        }
        
        public String getMensaje() { return mensaje; }
        public void setMensaje(String mensaje) { this.mensaje = mensaje; }
        public Long getSolicitudId() { return solicitudId; }
        public void setSolicitudId(Long solicitudId) { this.solicitudId = solicitudId; }
        public BigDecimal getMonto() { return monto; }
        public void setMonto(BigDecimal monto) { this.monto = monto; }
        public BigDecimal getMontoNeto() { return montoNeto; }
        public void setMontoNeto(BigDecimal montoNeto) { this.montoNeto = montoNeto; }
        public BigDecimal getComision() { return comision; }
        public void setComision(BigDecimal comision) { this.comision = comision; }
        public String getEstado() { return estado; }
        public void setEstado(String estado) { this.estado = estado; }
    }
}
