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
 * Entidad para solicitudes de depósito que requieren aprobación
 */
@Entity
@Table(name = "solicitudes_deposito", indexes = {
    @Index(name = "idx_solicitud_deposito_usuario", columnList = "usuario_id"),
    @Index(name = "idx_solicitud_deposito_estado", columnList = "estado"),
    @Index(name = "idx_solicitud_deposito_fecha", columnList = "fecha_solicitud")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"usuario", "aprobadoPor"})
@EqualsAndHashCode(exclude = {"usuario", "aprobadoPor"})
public class SolicitudDeposito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Usuario que solicita el depósito
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @NotNull(message = "El usuario es obligatorio")
    private Usuario usuario;

    /**
     * Monto a depositar
     */
    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    @Column(name = "monto", nullable = false, precision = 15, scale = 2)
    private BigDecimal monto;

    /**
     * Método de pago utilizado
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false)
    private MetodoPago metodoPago;

    /**
     * Estado de la solicitud
     */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "estado", nullable = false)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;

    /**
     * Comprobante de pago (URL o referencia)
     */
    @Column(name = "comprobante_pago")
    private String comprobantePago;

    /**
     * Referencia de transacción
     */
    @Column(name = "referencia_transaccion")
    private String referenciaTransaccion;

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

    /**
     * Hash de transacción (para cryptomonedas)
     */
    @Column(name = "hash_transaccion")
    private String hashTransaccion;

    /**
     * Tipo de criptomoneda (si aplica)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_crypto")
    private TipoCrypto tipoCrypto;

    /**
     * Dirección de la wallet (si aplica)
     */
    @Column(name = "direccion_wallet")
    private String direccionWallet;

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

    public enum MetodoPago {
        TRANSFERENCIA_BANCARIA,
        BITCOIN,
        ETHEREUM,
        USDT,
        USDC,
        TARJETA_CREDITO,
        TARJETA_DEBITO,
        TRANSFERENCIA_CRYPTO,
        PAYPAL,
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
