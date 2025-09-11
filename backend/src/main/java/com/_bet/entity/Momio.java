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
 * Entidad para manejar momios/cuotas de los eventos deportivos
 */
@Entity
@Table(name = "momios", indexes = {
    @Index(name = "idx_momio_evento", columnList = "evento_deportivo_id"),
    @Index(name = "idx_momio_tipo", columnList = "tipoApuesta"),
    @Index(name = "idx_momio_activo", columnList = "activo"),
    @Index(name = "idx_momio_fecha", columnList = "fechaCreacion")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"eventoDeportivo"})
@EqualsAndHashCode(exclude = {"eventoDeportivo"})
public class Momio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Tipo de apuesta para este momio
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_apuesta", nullable = false)
    private TipoApuesta tipoApuesta;

    /**
     * Resultado al que aplica este momio
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "resultado", nullable = false)
    private ResultadoMomio resultado;

    /**
     * Valor del momio
     */
    @NotNull(message = "El valor del momio es obligatorio")
    @DecimalMin(value = "1.00", message = "El momio debe ser mayor o igual a 1")
    @Column(name = "valor", nullable = false, precision = 8, scale = 3)
    private BigDecimal valor;

    /**
     * Probabilidad implícita (calculada automáticamente)
     */
    @Column(name = "probabilidad_implicita", precision = 8, scale = 5)
    private BigDecimal probabilidadImplicita;

    /**
     * Margen de la casa (para cálculos internos)
     */
    @Builder.Default
    @Column(name = "margen_casa", precision = 8, scale = 5)
    private BigDecimal margenCasa = new BigDecimal("0.05"); // 5% por defecto

    /**
     * Fuente del momio (calculado, manual, etc.)
     */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "fuente")
    private FuenteMomio fuente = FuenteMomio.CALCULADO;

    /**
     * Límite máximo de apuesta para este momio
     */
    @Column(name = "limite_maximo", precision = 15, scale = 2)
    private BigDecimal limiteMaximo;

    /**
     * Número de apuestas realizadas con este momio
     */
    @Builder.Default
    @Column(name = "numero_apuestas")
    private Integer numeroApuestas = 0;

    /**
     * Monto total apostado con este momio
     */
    @Builder.Default
    @Column(name = "monto_total_apostado", precision = 15, scale = 2)
    private BigDecimal montoTotalApostado = BigDecimal.ZERO;

    /**
     * Indica si el momio está activo para apuestas
     */
    @Builder.Default
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    /**
     * Fecha de última actualización del valor
     */
    @Column(name = "fecha_ultima_actualizacion")
    private LocalDateTime fechaUltimaActualizacion;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;

    /**
     * Relación con EventoDeportivo
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_deportivo_id", nullable = false)
    @NotNull(message = "El evento deportivo es obligatorio")
    private EventoDeportivo eventoDeportivo;

    // Enums
    public enum TipoApuesta {
        GANADOR_PARTIDO,
        OVER_UNDER,
        HANDICAP,
        RESULTADO_EXACTO,
        PRIMER_TIEMPO,
        AMBOS_ANOTAN
    }

    public enum ResultadoMomio {
        LOCAL,
        VISITANTE,
        EMPATE,
        OVER,
        UNDER,
        SI,
        NO
    }

    public enum FuenteMomio {
        CALCULADO,
        MANUAL,
        API_EXTERNA,
        AJUSTADO
    }
}
