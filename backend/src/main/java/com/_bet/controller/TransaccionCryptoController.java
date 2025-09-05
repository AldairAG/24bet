package com._bet.controller;

import com._bet.dto.TransaccionCryptoDto;
import com._bet.service.TransaccionCryptoService;
import com._bet.service.CryptoConversionService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/24bet/transacciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransaccionCryptoController {
    
    private final TransaccionCryptoService transaccionService;
    private final CryptoConversionService conversionService;
    
    /**
     * Crea una nueva solicitud de transacción (depósito o retiro)
     */
    @PostMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TransaccionCryptoDto> crearSolicitudTransaccion(
            @PathVariable Long usuarioId,
            @Valid @RequestBody TransaccionCryptoDto.CreateTransaccionDto createDto) {
        
        try {
            // Verificar que el usuario solo pueda crear transacciones para sí mismo (excepto admin)
            if (!esAdminOPropietario(usuarioId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            TransaccionCryptoDto transaccionDto = transaccionService.crearSolicitudTransaccion(usuarioId, createDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(transaccionDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Procesa una transacción (aprobar o rechazar) - Solo admins
     */
    @PutMapping("/{transaccionId}/procesar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TransaccionCryptoDto> procesarTransaccion(
            @PathVariable Long transaccionId,
            @Valid @RequestBody TransaccionCryptoDto.ProcesarTransaccionDto procesarDto) {
        
        try {
            Long adminId = obtenerUsuarioIdActual();
            TransaccionCryptoDto transaccionDto = transaccionService.procesarTransaccion(
                transaccionId, procesarDto, adminId
            );
            return ResponseEntity.ok(transaccionDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Cancela una transacción pendiente
     */
    @PatchMapping("/{transaccionId}/cancelar")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> cancelarTransaccion(@PathVariable Long transaccionId) {
        try {
            Long usuarioId = obtenerUsuarioIdActual();
            transaccionService.cancelarTransaccion(transaccionId, usuarioId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtiene todas las transacciones de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<TransaccionCryptoDto>> getTransaccionesByUsuario(@PathVariable Long usuarioId) {
        if (!esAdminOPropietario(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<TransaccionCryptoDto> transacciones = transaccionService.getTransaccionesByUsuario(usuarioId);
        return ResponseEntity.ok(transacciones);
    }
    
    /**
     * Obtiene las transacciones de un usuario paginadas
     */
    @GetMapping("/usuario/{usuarioId}/paginadas")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<TransaccionCryptoDto>> getTransaccionesByUsuarioPaginadas(
            @PathVariable Long usuarioId,
            Pageable pageable) {
        
        if (!esAdminOPropietario(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Page<TransaccionCryptoDto> transacciones = transaccionService.getTransaccionesByUsuario(usuarioId, pageable);
        return ResponseEntity.ok(transacciones);
    }
    
    /**
     * Obtiene las últimas transacciones de un usuario
     */
    @GetMapping("/usuario/{usuarioId}/ultimas")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<TransaccionCryptoDto>> getUltimasTransacciones(
            @PathVariable Long usuarioId,
            @RequestParam(defaultValue = "10") int limite) {
        
        if (!esAdminOPropietario(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<TransaccionCryptoDto> transacciones = transaccionService.getUltimasTransacciones(usuarioId, limite);
        return ResponseEntity.ok(transacciones);
    }
    
    /**
     * Obtiene el resumen de transacciones de un usuario
     */
    @GetMapping("/usuario/{usuarioId}/resumen")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<TransaccionCryptoDto.TransaccionSummaryDto>> getResumenTransacciones(@PathVariable Long usuarioId) {
        if (!esAdminOPropietario(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<TransaccionCryptoDto.TransaccionSummaryDto> resumen = transaccionService.getResumenTransacciones(usuarioId);
        return ResponseEntity.ok(resumen);
    }
    
    /**
     * Obtiene estadísticas de transacciones de un usuario
     */
    @GetMapping("/usuario/{usuarioId}/estadisticas")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TransaccionCryptoDto.EstadisticasTransaccionDto> getEstadisticasUsuario(@PathVariable Long usuarioId) {
        if (!esAdminOPropietario(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        TransaccionCryptoDto.EstadisticasTransaccionDto estadisticas = transaccionService.getEstadisticasUsuario(usuarioId);
        return ResponseEntity.ok(estadisticas);
    }
    
    /**
     * Obtiene una transacción específica por ID
     */
    @GetMapping("/{transaccionId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TransaccionCryptoDto> getTransaccionById(@PathVariable Long transaccionId) {
        try {
            TransaccionCryptoDto transaccion = transaccionService.getTransaccionById(transaccionId);
            
            // Verificar que el usuario solo puede ver sus propias transacciones (excepto admin)
            if (!esAdminOPropietario(transaccion.getUsuarioId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            return ResponseEntity.ok(transaccion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtiene todas las transacciones pendientes (solo admin)
     */
    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransaccionCryptoDto>> getTransaccionesPendientes() {
        List<TransaccionCryptoDto> pendientes = transaccionService.getTransaccionesPendientes();
        return ResponseEntity.ok(pendientes);
    }
    
    /**
     * Obtiene las transacciones pendientes paginadas (solo admin)
     */
    @GetMapping("/pendientes/paginadas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<TransaccionCryptoDto>> getTransaccionesPendientesPaginadas(Pageable pageable) {
        Page<TransaccionCryptoDto> pendientes = transaccionService.getTransaccionesPendientes(pageable);
        return ResponseEntity.ok(pendientes);
    }
    
    /**
     * Obtiene transacciones filtradas (solo admin)
     */
    @PostMapping("/filtrar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransaccionCryptoDto>> getTransaccionesFiltradas(
            @RequestBody TransaccionCryptoDto.FiltroTransaccionDto filtro) {
        
        List<TransaccionCryptoDto> transacciones = transaccionService.getTransaccionesFiltradas(filtro);
        return ResponseEntity.ok(transacciones);
    }
    
    /**
     * Recalcula las tasas de conversión para transacciones pendientes (solo admin)
     */
    @PatchMapping("/recalcular-tasas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> recalcularTasasConversion() {
        try {
            transaccionService.recalcularTasasConversionPendientes();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ========== ENDPOINTS DE CONVERSIÓN ==========
    
    /**
     * Obtiene la tasa de conversión actual de una criptomoneda a USD
     */
    @GetMapping("/conversion/tasa/{tipoCrypto}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TasaConversionResponse> getTasaConversion(@PathVariable String tipoCrypto) {
        try {
            var tipo = com._bet.entity.CryptoWallet.TipoCrypto.valueOf(tipoCrypto.toUpperCase());
            BigDecimal tasa = conversionService.getTasaConversion(tipo);
            return ResponseEntity.ok(new TasaConversionResponse(tipo, tasa));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Convierte una cantidad de crypto a USD
     */
    @PostMapping("/conversion/crypto-a-usd")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ConversionResponse> convertirCryptoAUsd(@RequestBody ConversionRequest request) {
        try {
            BigDecimal cantidadUsd = conversionService.convertirCryptoAUsd(request.getCantidad(), request.getTipoCrypto());
            BigDecimal tasa = conversionService.getTasaConversion(request.getTipoCrypto());
            
            return ResponseEntity.ok(new ConversionResponse(
                request.getCantidad(), request.getTipoCrypto(), cantidadUsd, tasa
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Convierte una cantidad de USD a crypto
     */
    @PostMapping("/conversion/usd-a-crypto")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ConversionResponse> convertirUsdACrypto(@RequestBody ConversionRequest request) {
        try {
            BigDecimal cantidadCrypto = conversionService.convertirUsdACrypto(request.getCantidad(), request.getTipoCrypto());
            BigDecimal tasa = conversionService.getTasaConversion(request.getTipoCrypto());
            
            return ResponseEntity.ok(new ConversionResponse(
                cantidadCrypto, request.getTipoCrypto(), request.getCantidad(), tasa
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ========== MÉTODOS AUXILIARES ==========
    
    private boolean esAdminOPropietario(Long usuarioId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Verificar si es admin
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return true;
        }
        
        // Verificar si es el propietario
        Long usuarioActualId = obtenerUsuarioIdActual();
        return usuarioActualId != null && usuarioActualId.equals(usuarioId);
    }
    
    private Long obtenerUsuarioIdActual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            // Aquí necesitarías implementar la lógica para obtener el ID del usuario autenticado
            // desde el UserDetails o el token JWT
            return 1L; // Placeholder - implementar según tu sistema de auth
        }
        return null;
    }
    
    // ========== CLASES AUXILIARES ==========
    
    public static class TasaConversionResponse {
        private final com._bet.entity.CryptoWallet.TipoCrypto tipoCrypto;
        private final BigDecimal tasa;
        
        public TasaConversionResponse(com._bet.entity.CryptoWallet.TipoCrypto tipoCrypto, BigDecimal tasa) {
            this.tipoCrypto = tipoCrypto;
            this.tasa = tasa;
        }
        
        public com._bet.entity.CryptoWallet.TipoCrypto getTipoCrypto() { return tipoCrypto; }
        public BigDecimal getTasa() { return tasa; }
    }
    
    public static class ConversionRequest {
        private BigDecimal cantidad;
        private com._bet.entity.CryptoWallet.TipoCrypto tipoCrypto;
        
        public BigDecimal getCantidad() { return cantidad; }
        public void setCantidad(BigDecimal cantidad) { this.cantidad = cantidad; }
        public com._bet.entity.CryptoWallet.TipoCrypto getTipoCrypto() { return tipoCrypto; }
        public void setTipoCrypto(com._bet.entity.CryptoWallet.TipoCrypto tipoCrypto) { this.tipoCrypto = tipoCrypto; }
    }
    
    public static class ConversionResponse {
        private final BigDecimal cantidadCrypto;
        private final com._bet.entity.CryptoWallet.TipoCrypto tipoCrypto;
        private final BigDecimal cantidadUsd;
        private final BigDecimal tasaConversion;
        
        public ConversionResponse(BigDecimal cantidadCrypto, com._bet.entity.CryptoWallet.TipoCrypto tipoCrypto, 
                                BigDecimal cantidadUsd, BigDecimal tasaConversion) {
            this.cantidadCrypto = cantidadCrypto;
            this.tipoCrypto = tipoCrypto;
            this.cantidadUsd = cantidadUsd;
            this.tasaConversion = tasaConversion;
        }
        
        public BigDecimal getCantidadCrypto() { return cantidadCrypto; }
        public com._bet.entity.CryptoWallet.TipoCrypto getTipoCrypto() { return tipoCrypto; }
        public BigDecimal getCantidadUsd() { return cantidadUsd; }
        public BigDecimal getTasaConversion() { return tasaConversion; }
    }
}
