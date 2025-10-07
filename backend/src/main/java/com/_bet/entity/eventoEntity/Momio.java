package com._bet.entity.eventoEntity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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
import java.util.List;

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
@ToString(exclude = { "eventoDeportivo" })
@EqualsAndHashCode(exclude = { "eventoDeportivo" })
public class Momio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Tipo de apuesta (por ejemplo, "Resultado", "Más/Menos", "Hándicap", etc.)
     */
    @NotNull(message = "El tipo de apuesta es obligatorio")
    @Column(name = "tipo_apuesta", nullable = false, length = 100)
    private String tipoApuesta;

    /**
     * Valores disponibles para este momio (por ejemplo, "1", "X", "2" para
     * resultados)
     */
    @OneToMany(mappedBy = "momio", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private List<Valor> valores;

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
    @JoinColumn(name = "evento_deportivo_id")
    private EventoDeportivo eventoDeportivo;
}
