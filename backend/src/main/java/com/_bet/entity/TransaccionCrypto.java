package com._bet.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacciones_crypto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransaccionCrypto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_transaccion", nullable = false)
    @NotNull(message = "El tipo de transacción es obligatorio")
    private TipoTransaccion tipoTransaccion;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    @NotNull(message = "El estado es obligatorio")
    private EstadoTransaccion estado = EstadoTransaccion.PENDIENTE;
    
    @Column(name = "cantidad_crypto", precision = 19, scale = 8, nullable = false)
    @Positive(message = "La cantidad crypto debe ser positiva")
    private BigDecimal cantidadCrypto;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_crypto", nullable = false)
    @NotNull(message = "El tipo de criptomoneda es obligatorio")
    private CryptoWallet.TipoCrypto tipoCrypto;
    
    @Column(name = "tasa_conversion_usd", precision = 19, scale = 8, nullable = false)
    @Positive(message = "La tasa de conversión debe ser positiva")
    private BigDecimal tasaConversionUsd;
    
    @Column(name = "cantidad_usd", precision = 19, scale = 2, nullable = false)
    @Positive(message = "La cantidad USD debe ser positiva")
    private BigDecimal cantidadUsd;
    
    @Column(name = "hash_transaccion")
    @Size(max = 255, message = "El hash de transacción no puede exceder 255 caracteres")
    private String hashTransaccion;
    
    @Column(name = "direccion_wallet", nullable = false)
    @NotBlank(message = "La dirección del wallet es obligatoria")
    @Size(max = 255, message = "La dirección del wallet no puede exceder 255 caracteres")
    private String direccionWallet;
    
    @Column(name = "observaciones", length = 1000)
    @Size(max = 1000, message = "Las observaciones no pueden exceder 1000 caracteres")
    private String observaciones;
    
    @Column(name = "motivo_rechazo", length = 500)
    @Size(max = 500, message = "El motivo de rechazo no puede exceder 500 caracteres")
    private String motivoRechazo;
    
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;
    
    @Column(name = "fecha_procesamiento")
    private LocalDateTime fechaProcesamiento;
    
    @Column(name = "fecha_completado")
    private LocalDateTime fechaCompletado;
    
    // ========== RELACIONES ==========
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @NotNull(message = "El usuario es obligatorio")
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id")
    private CryptoWallet wallet;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "procesado_por_id")
    private Usuario procesadoPor;
    
    // ========== MÉTODOS DE CICLO DE VIDA ==========
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
        
        // Calcular cantidad USD si no está establecida
        if (cantidadUsd == null && cantidadCrypto != null && tasaConversionUsd != null) {
            cantidadUsd = cantidadCrypto.multiply(tasaConversionUsd);
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
    
    // ========== MÉTODOS DE UTILIDAD ==========
    
    /**
     * Marca la transacción como procesada
     */
    public void marcarComoProcesada(Usuario admin) {
        this.estado = EstadoTransaccion.PROCESANDO;
        this.procesadoPor = admin;
        this.fechaProcesamiento = LocalDateTime.now();
    }
    
    /**
     * Aprueba la transacción
     */
    public void aprobar(Usuario admin, String hashTransaccion) {
        this.estado = EstadoTransaccion.APROBADO;
        this.procesadoPor = admin;
        this.hashTransaccion = hashTransaccion;
        this.fechaCompletado = LocalDateTime.now();
    }
    
    /**
     * Rechaza la transacción
     */
    public void rechazar(Usuario admin, String motivo) {
        this.estado = EstadoTransaccion.RECHAZADO;
        this.procesadoPor = admin;
        this.motivoRechazo = motivo;
        this.fechaCompletado = LocalDateTime.now();
    }
    
    /**
     * Cancela la transacción
     */
    public void cancelar(String motivo) {
        this.estado = EstadoTransaccion.CANCELADO;
        this.motivoRechazo = motivo;
        this.fechaCompletado = LocalDateTime.now();
    }
    
    /**
     * Verifica si la transacción puede ser procesada
     */
    public boolean puedeSerProcesada() {
        return this.estado == EstadoTransaccion.PENDIENTE;
    }
    
    /**
     * Verifica si la transacción está completada (aprobada o rechazada)
     */
    public boolean estaCompletada() {
        return this.estado == EstadoTransaccion.APROBADO || 
               this.estado == EstadoTransaccion.RECHAZADO ||
               this.estado == EstadoTransaccion.CANCELADO;
    }
    
    /**
     * Verifica si es una transacción de depósito
     */
    public boolean esDeposito() {
        return this.tipoTransaccion == TipoTransaccion.DEPOSITO;
    }
    
    /**
     * Verifica si es una transacción de retiro
     */
    public boolean esRetiro() {
        return this.tipoTransaccion == TipoTransaccion.RETIRO;
    }
    
    // ========== ENUMS ==========
    
    public enum TipoTransaccion {
        DEPOSITO("Depósito"),
        RETIRO("Retiro");
        
        private final String descripcion;
        
        TipoTransaccion(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
    
    public enum EstadoTransaccion {
        PENDIENTE("Pendiente de revisión"),
        PROCESANDO("En proceso de revisión"),
        APROBADO("Aprobado y procesado"),
        RECHAZADO("Rechazado"),
        CANCELADO("Cancelado por el usuario");
        
        private final String descripcion;
        
        EstadoTransaccion(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
}
