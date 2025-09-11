package com._bet.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad para manejar apuestas individuales
 */
@Entity
@Table(name = "apuestas", indexes = {
    @Index(name = "idx_apuesta_usuario", columnList = "usuario_id"),
    @Index(name = "idx_apuesta_evento", columnList = "evento_deportivo_id"),
    @Index(name = "idx_apuesta_estado", columnList = "estado"),
    @Index(name = "idx_apuesta_fecha", columnList = "fechaCreacion")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"usuario", "eventoDeportivo", "parlay"})
@EqualsAndHashCode(exclude = {"usuario", "eventoDeportivo", "parlay"})
public class Apuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Tipo de apuesta
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_apuesta", nullable = false)
    private TipoApuesta tipoApuesta;

    /**
     * Resultado apostado
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "resultado_apostado", nullable = false)
    private ResultadoApuesta resultadoApostado;

    /**
     * Monto apostado
     */
    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    @Column(name = "monto", nullable = false, precision = 15, scale = 2)
    private BigDecimal monto;

    /**
     * Momio al momento de la apuesta
     */
    @NotNull(message = "El momio es obligatorio")
    @DecimalMin(value = "1.00", message = "El momio debe ser mayor o igual a 1")
    @Column(name = "momio", nullable = false, precision = 8, scale = 3)
    private BigDecimal momio;

    /**
     * Ganancia potencial
     */
    @Column(name = "ganancia_potencial", precision = 15, scale = 2)
    private BigDecimal gananciaPotencial;

    /**
     * Ganancia real (si ganó)
     */
    @Column(name = "ganancia_real", precision = 15, scale = 2)
    private BigDecimal gananciaReal;

    /**
     * Estado de la apuesta
     */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "estado", nullable = false)
    private EstadoApuesta estado = EstadoApuesta.ACTIVA;

    /**
     * Resultado final de la apuesta
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "resultado_final")
    private ResultadoFinal resultadoFinal;

    /**
     * Fecha de liquidación
     */
    @Column(name = "fecha_liquidacion")
    private LocalDateTime fechaLiquidacion;

    /**
     * Observaciones
     */
    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    /**
     * Indica si está activa
     */
    @Builder.Default
    @Column(name = "activa", nullable = false)
    private Boolean activa = true;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;

    /**
     * Relación con Usuario
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @NotNull(message = "El usuario es obligatorio")
    private Usuario usuario;

    /**
     * Relación con EventoDeportivo
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_deportivo_id", nullable = false)
    @NotNull(message = "El evento deportivo es obligatorio")
    private EventoDeportivo eventoDeportivo;

    /**
     * Relación con Parlay (si es parte de uno)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parlay_id")
    private Parlay parlay;

    // Enums
    public enum TipoApuesta {
        GANADOR_PARTIDO,
        OVER_UNDER,
        HANDICAP,
        RESULTADO_EXACTO,
        PRIMER_TIEMPO,
        AMBOS_ANOTAN
    }

    public enum ResultadoApuesta {
        LOCAL,
        VISITANTE,
        EMPATE,
        OVER,
        UNDER,
        SI,
        NO
    }

    public enum EstadoApuesta {
        ACTIVA,
        LIQUIDADA,
        CANCELADA,
        PENDIENTE
    }

    public enum ResultadoFinal {
        GANADA,
        PERDIDA,
        EMPATE_PUSH,
        CANCELADA
    }
}
