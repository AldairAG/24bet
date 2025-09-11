package com._bet.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad para solicitudes de retiro que requieren aprobación
 */
@Entity
@Table(name = "solicitudes_retiro", indexes = {
    @Index(name = "idx_solicitud_retiro_usuario", columnList = "usuario_id"),
    @Index(name = "idx_solicitud_retiro_estado", columnList = "estado"),
    @Index(name = "idx_solicitud_retiro_fecha", columnList = "fecha_solicitud")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"usuario", "aprobadoPor"})
@EqualsAndHashCode(exclude = {"usuario", "aprobadoPor"})
public class SolicitudRetiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Usuario que solicita el retiro
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @NotNull(message = "El usuario es obligatorio")
    private Usuario usuario;

    /**
     * Monto a retirar
     */
    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    @Column(name = "monto", nullable = false, precision = 15, scale = 2)
    private BigDecimal monto;

    /**
     * Método de retiro
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_retiro", nullable = false)
    private MetodoRetiro metodoRetiro;

    /**
     * Estado de la solicitud
     */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "estado", nullable = false)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;

    /**
     * Información de la cuenta de destino
     */
    @Column(name = "cuenta_destino", columnDefinition = "TEXT")
    private String cuentaDestino;

    /**
     * Banco o institución financiera
     */
    @Column(name = "banco")
    private String banco;

    /**
     * Número de cuenta
     */
    @Column(name = "numero_cuenta")
    private String numeroCuenta;

    /**
     * Nombre del titular de la cuenta
     */
    @Column(name = "titular_cuenta")
    private String titularCuenta;

    /**
     * Dirección de wallet crypto (si aplica)
     */
    @Column(name = "direccion_wallet")
    private String direccionWallet;

    /**
     * Tipo de criptomoneda (si aplica)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_crypto")
    private TipoCrypto tipoCrypto;

    /**
     * Observaciones del usuario
     */
    @Column(name = "observaciones_usuario", columnDefinition = "TEXT")
    private String observacionesUsuario;

    /**
     * Observaciones del administrador
     */
    @Column(name = "observaciones_admin", columnDefinition = "TEXT")
    private String observacionesAdmin;

    /**
     * Referencia de transacción
     */
    @Column(name = "referencia_transaccion")
    private String referenciaTransaccion;

    /**
     * Hash de transacción (para cryptomonedas)
     */
    @Column(name = "hash_transaccion")
    private String hashTransaccion;

    /**
     * Comisión aplicada
     */
    @Builder.Default
    @Column(name = "comision", precision = 15, scale = 2)
    private BigDecimal comision = BigDecimal.ZERO;

    /**
     * Monto neto a recibir (después de comisiones)
     */
    @Column(name = "monto_neto", precision = 15, scale = 2)
    private BigDecimal montoNeto;

    /**
     * Fecha de la solicitud
     */
    @CreationTimestamp
    @Column(name = "fecha_solicitud", nullable = false, updatable = false)
    private LocalDateTime fechaSolicitud;

    /**
     * Fecha de aprobación/rechazo
     */
    @Column(name = "fecha_procesamiento")
    private LocalDateTime fechaProcesamiento;

    /**
     * Administrador que procesó la solicitud
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprobado_por")
    private Usuario aprobadoPor;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;

    // Enums
    public enum EstadoSolicitud {
        PENDIENTE,
        APROBADA,
        RECHAZADA,
        PROCESANDO,
        COMPLETADA,
        CANCELADA
    }

    public enum MetodoRetiro {
        TRANSFERENCIA_BANCARIA,
        BITCOIN,
        ETHEREUM,
        USDT,
        USDC,
        PAYPAL,
        TRANSFERENCIA_CRYPTO,
        OTRO
    }

    public enum TipoCrypto {
        BITCOIN,
        ETHEREUM,
        USDT,
        USDC,
        LITECOIN,
        BINANCE_COIN
    }
}
