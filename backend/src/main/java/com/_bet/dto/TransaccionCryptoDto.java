package com._bet.dto;

import com._bet.entity.TransaccionCrypto;
import com._bet.entity.CryptoWallet;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransaccionCryptoDto {
    
    private Long id;
    
    @NotNull(message = "El tipo de transacción es obligatorio")
    private TransaccionCrypto.TipoTransaccion tipoTransaccion;
    
    private TransaccionCrypto.EstadoTransaccion estado;
    
    @Positive(message = "La cantidad crypto debe ser positiva")
    private BigDecimal cantidadCrypto;
    
    @NotNull(message = "El tipo de criptomoneda es obligatorio")
    private CryptoWallet.TipoCrypto tipoCrypto;
    
    @Positive(message = "La tasa de conversión debe ser positiva")
    private BigDecimal tasaConversionUsd;
    
    @Positive(message = "La cantidad USD debe ser positiva")
    private BigDecimal cantidadUsd;
    
    private String hashTransaccion;
    
    @NotBlank(message = "La dirección del wallet es obligatoria")
    @Size(max = 255, message = "La dirección del wallet no puede exceder 255 caracteres")
    private String direccionWallet;
    
    @Size(max = 1000, message = "Las observaciones no pueden exceder 1000 caracteres")
    private String observaciones;
    
    @Size(max = 500, message = "El motivo de rechazo no puede exceder 500 caracteres")
    private String motivoRechazo;
    
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private LocalDateTime fechaProcesamiento;
    private LocalDateTime fechaCompletado;
    
    private Long usuarioId;
    private String usuarioUsername;
    private Long walletId;
    private Long procesadoPorId;
    private String procesadoPorUsername;
    
    // ========== MÉTODOS DE CONVERSIÓN ==========
    
    /**
     * Convierte una entidad TransaccionCrypto a DTO
     */
    public static TransaccionCryptoDto fromEntity(TransaccionCrypto transaccion) {
        if (transaccion == null) {
            return null;
        }
        
        TransaccionCryptoDto dto = new TransaccionCryptoDto();
        dto.setId(transaccion.getId());
        dto.setTipoTransaccion(transaccion.getTipoTransaccion());
        dto.setEstado(transaccion.getEstado());
        dto.setCantidadCrypto(transaccion.getCantidadCrypto());
        dto.setTipoCrypto(transaccion.getTipoCrypto());
        dto.setTasaConversionUsd(transaccion.getTasaConversionUsd());
        dto.setCantidadUsd(transaccion.getCantidadUsd());
        dto.setHashTransaccion(transaccion.getHashTransaccion());
        dto.setDireccionWallet(transaccion.getDireccionWallet());
        dto.setObservaciones(transaccion.getObservaciones());
        dto.setMotivoRechazo(transaccion.getMotivoRechazo());
        dto.setFechaCreacion(transaccion.getFechaCreacion());
        dto.setFechaActualizacion(transaccion.getFechaActualizacion());
        dto.setFechaProcesamiento(transaccion.getFechaProcesamiento());
        dto.setFechaCompletado(transaccion.getFechaCompletado());
        
        if (transaccion.getUsuario() != null) {
            dto.setUsuarioId(transaccion.getUsuario().getId());
            dto.setUsuarioUsername(transaccion.getUsuario().getUsername());
        }
        
        if (transaccion.getWallet() != null) {
            dto.setWalletId(transaccion.getWallet().getId());
        }
        
        if (transaccion.getProcesadoPor() != null) {
            dto.setProcesadoPorId(transaccion.getProcesadoPor().getId());
            dto.setProcesadoPorUsername(transaccion.getProcesadoPor().getUsername());
        }
        
        return dto;
    }
    
    /**
     * Convierte el DTO a entidad TransaccionCrypto (sin relaciones)
     */
    public TransaccionCrypto toEntity() {
        TransaccionCrypto transaccion = new TransaccionCrypto();
        transaccion.setId(this.id);
        transaccion.setTipoTransaccion(this.tipoTransaccion);
        transaccion.setEstado(this.estado != null ? this.estado : TransaccionCrypto.EstadoTransaccion.PENDIENTE);
        transaccion.setCantidadCrypto(this.cantidadCrypto);
        transaccion.setTipoCrypto(this.tipoCrypto);
        transaccion.setTasaConversionUsd(this.tasaConversionUsd);
        transaccion.setCantidadUsd(this.cantidadUsd);
        transaccion.setHashTransaccion(this.hashTransaccion);
        transaccion.setDireccionWallet(this.direccionWallet);
        transaccion.setObservaciones(this.observaciones);
        transaccion.setMotivoRechazo(this.motivoRechazo);
        transaccion.setFechaCreacion(this.fechaCreacion);
        transaccion.setFechaActualizacion(this.fechaActualizacion);
        transaccion.setFechaProcesamiento(this.fechaProcesamiento);
        transaccion.setFechaCompletado(this.fechaCompletado);
        
        return transaccion;
    }
    
    // ========== DTO PARA CREACIÓN ==========
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateTransaccionDto {
        
        @NotNull(message = "El tipo de transacción es obligatorio")
        private TransaccionCrypto.TipoTransaccion tipoTransaccion;
        
        @Positive(message = "La cantidad crypto debe ser positiva")
        private BigDecimal cantidadCrypto;
        
        @NotNull(message = "El tipo de criptomoneda es obligatorio")
        private CryptoWallet.TipoCrypto tipoCrypto;
        
        @NotBlank(message = "La dirección del wallet es obligatoria")
        @Size(max = 255, message = "La dirección del wallet no puede exceder 255 caracteres")
        private String direccionWallet;
        
        @Size(max = 1000, message = "Las observaciones no pueden exceder 1000 caracteres")
        private String observaciones;
        
        private Long walletId; // Opcional, para asociar con un wallet existente
    }
    
    // ========== DTO PARA PROCESAMIENTO ==========
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProcesarTransaccionDto {
        
        @NotNull(message = "La decisión es obligatoria")
        private DecisionTransaccion decision;
        
        @Size(max = 500, message = "El motivo no puede exceder 500 caracteres")
        private String motivo;
        
        @Size(max = 255, message = "El hash de transacción no puede exceder 255 caracteres")
        private String hashTransaccion;
        
        public enum DecisionTransaccion {
            APROBAR, RECHAZAR
        }
    }
    
    // ========== DTO PARA RESUMEN ==========
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransaccionSummaryDto {
        
        private Long id;
        private TransaccionCrypto.TipoTransaccion tipoTransaccion;
        private TransaccionCrypto.EstadoTransaccion estado;
        private BigDecimal cantidadCrypto;
        private CryptoWallet.TipoCrypto tipoCrypto;
        private String simboloCrypto;
        private BigDecimal cantidadUsd;
        private LocalDateTime fechaCreacion;
        private LocalDateTime fechaCompletado;
        private String usuarioUsername;
        
        public static TransaccionSummaryDto fromEntity(TransaccionCrypto transaccion) {
            if (transaccion == null) {
                return null;
            }
            
            TransaccionSummaryDto summary = new TransaccionSummaryDto();
            summary.setId(transaccion.getId());
            summary.setTipoTransaccion(transaccion.getTipoTransaccion());
            summary.setEstado(transaccion.getEstado());
            summary.setCantidadCrypto(transaccion.getCantidadCrypto());
            summary.setTipoCrypto(transaccion.getTipoCrypto());
            summary.setSimboloCrypto(transaccion.getTipoCrypto().getSimbol());
            summary.setCantidadUsd(transaccion.getCantidadUsd());
            summary.setFechaCreacion(transaccion.getFechaCreacion());
            summary.setFechaCompletado(transaccion.getFechaCompletado());
            
            if (transaccion.getUsuario() != null) {
                summary.setUsuarioUsername(transaccion.getUsuario().getUsername());
            }
            
            return summary;
        }
    }
    
    // ========== DTO PARA ESTADÍSTICAS ==========
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EstadisticasTransaccionDto {
        
        private Long totalTransacciones;
        private Long transaccionesPendientes;
        private Long transaccionesAprobadas;
        private Long transaccionesRechazadas;
        private BigDecimal totalDepositosUsd;
        private BigDecimal totalRetirosUsd;
        private BigDecimal volumenTotalUsd;
    }
    
    // ========== DTO PARA FILTROS ==========
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FiltroTransaccionDto {
        
        private TransaccionCrypto.TipoTransaccion tipoTransaccion;
        private TransaccionCrypto.EstadoTransaccion estado;
        private CryptoWallet.TipoCrypto tipoCrypto;
        private LocalDateTime fechaInicio;
        private LocalDateTime fechaFin;
        private Long usuarioId;
        private String usuarioUsername;
    }
}
