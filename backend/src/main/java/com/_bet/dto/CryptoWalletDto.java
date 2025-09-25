package com._bet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com._bet.entity.user.CryptoWallet;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoWalletDto {
    
    private Long id;
    
    @NotBlank(message = "El nombre del wallet es obligatorio")
    @Size(max = 100, message = "El nombre del wallet no puede exceder 100 caracteres")
    private String nombre;
    
    @NotBlank(message = "La dirección del wallet es obligatoria")
    @Size(max = 255, message = "La dirección del wallet no puede exceder 255 caracteres")
    private String address;
    
    @NotNull(message = "El tipo de criptomoneda es obligatorio")
    private CryptoWallet.TipoCrypto tipoCrypto;
    
    @PositiveOrZero(message = "El número de transacciones no puede ser negativo")
    private Long numeroTransacciones;
    
    @PositiveOrZero(message = "El total retirado no puede ser negativo")
    private BigDecimal totalRetirado;
    
    @PositiveOrZero(message = "El balance actual no puede ser negativo")
    private BigDecimal balanceActual;
    
    private Boolean activo;
    
    private LocalDateTime fechaCreacion;
    
    private LocalDateTime fechaActualizacion;
    
    private LocalDateTime ultimaTransaccion;
    
    private Long usuarioId;
    
    // ========== MÉTODOS DE CONVERSIÓN ==========
    
    /**
     * Convierte una entidad CryptoWallet a DTO
     */
    public static CryptoWalletDto fromEntity(CryptoWallet wallet) {
        if (wallet == null) {
            return null;
        }
        
        CryptoWalletDto dto = new CryptoWalletDto();
        dto.setId(wallet.getId());
        dto.setNombre(wallet.getNombre());
        dto.setAddress(wallet.getAddress());
        dto.setTipoCrypto(wallet.getTipoCrypto());
        dto.setNumeroTransacciones(wallet.getNumeroTransacciones());
        dto.setTotalRetirado(wallet.getTotalRetirado());
        dto.setBalanceActual(wallet.getBalanceActual());
        dto.setActivo(wallet.getActivo());
        dto.setFechaCreacion(wallet.getFechaCreacion());
        dto.setFechaActualizacion(wallet.getFechaActualizacion());
        dto.setUltimaTransaccion(wallet.getUltimaTransaccion());
        
        if (wallet.getUsuario() != null) {
            dto.setUsuarioId(wallet.getUsuario().getId());
        }
        
        return dto;
    }
    
    /**
     * Convierte el DTO a entidad CryptoWallet (sin usuario)
     */
    public CryptoWallet toEntity() {
        CryptoWallet wallet = new CryptoWallet();
        wallet.setId(this.id);
        wallet.setNombre(this.nombre);
        wallet.setAddress(this.address);
        wallet.setTipoCrypto(this.tipoCrypto);
        wallet.setNumeroTransacciones(this.numeroTransacciones != null ? this.numeroTransacciones : 0L);
        wallet.setTotalRetirado(this.totalRetirado != null ? this.totalRetirado : BigDecimal.ZERO);
        wallet.setBalanceActual(this.balanceActual != null ? this.balanceActual : BigDecimal.ZERO);
        wallet.setActivo(this.activo != null ? this.activo : true);
        wallet.setFechaCreacion(this.fechaCreacion);
        wallet.setFechaActualizacion(this.fechaActualizacion);
        wallet.setUltimaTransaccion(this.ultimaTransaccion);
        
        return wallet;
    }
    
    // ========== DTO PARA CREACIÓN ==========
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateCryptoWalletDto {
        
        @NotBlank(message = "El nombre del wallet es obligatorio")
        @Size(max = 100, message = "El nombre del wallet no puede exceder 100 caracteres")
        private String nombre;
        
        @NotBlank(message = "La dirección del wallet es obligatoria")
        @Size(max = 255, message = "La dirección del wallet no puede exceder 255 caracteres")
        private String address;
        
        @NotNull(message = "El tipo de criptomoneda es obligatorio")
        private CryptoWallet.TipoCrypto tipoCrypto;
        
        @PositiveOrZero(message = "El balance inicial no puede ser negativo")
        private BigDecimal balanceInicial = BigDecimal.ZERO;
    }
    
    // ========== DTO PARA ACTUALIZACIÓN ==========
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateCryptoWalletDto {
        
        @Size(max = 100, message = "El nombre del wallet no puede exceder 100 caracteres")
        private String nombre;
        
        @PositiveOrZero(message = "El balance actual no puede ser negativo")
        private BigDecimal balanceActual;
        
        private Boolean activo;
    }
    
    // ========== DTO PARA RESUMEN ==========
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CryptoWalletSummaryDto {
        
        private Long id;
        private String nombre;
        private CryptoWallet.TipoCrypto tipoCrypto;
        private String simboloCrypto;
        private String nombreCompletoCrypto;
        private BigDecimal balanceActual;
        private Long numeroTransacciones;
        private Boolean activo;
        private LocalDateTime ultimaTransaccion;
        
        public static CryptoWalletSummaryDto fromEntity(CryptoWallet wallet) {
            if (wallet == null) {
                return null;
            }
            
            CryptoWalletSummaryDto summary = new CryptoWalletSummaryDto();
            summary.setId(wallet.getId());
            summary.setNombre(wallet.getNombre());
            summary.setTipoCrypto(wallet.getTipoCrypto());
            summary.setSimboloCrypto(wallet.getTipoCrypto().getSimbol());
            summary.setNombreCompletoCrypto(wallet.getTipoCrypto().getNombreCompleto());
            summary.setBalanceActual(wallet.getBalanceActual());
            summary.setNumeroTransacciones(wallet.getNumeroTransacciones());
            summary.setActivo(wallet.getActivo());
            summary.setUltimaTransaccion(wallet.getUltimaTransaccion());
            
            return summary;
        }
    }
}
