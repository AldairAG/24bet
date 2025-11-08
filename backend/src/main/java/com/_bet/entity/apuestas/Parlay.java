package com._bet.entity.apuestas;

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

import com._bet.entity.user.Usuario;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad para manejar parlays (apuestas múltiples)
 */
@Entity
@Table(name = "parlays", indexes = {
    @Index(name = "idx_parlay_usuario", columnList = "usuario_id"),
    @Index(name = "idx_parlay_estado", columnList = "estado"),
    @Index(name = "idx_parlay_fecha", columnList = "fechaCreacion")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"usuario", "apuestas"})
@EqualsAndHashCode(exclude = {"usuario", "apuestas"})
public class Parlay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Monto total apostado en el parlay
     */
    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    @Column(name = "monto_total", nullable = false)
    private Double montoTotal;

    /**
     * Momio total del parlay (multiplicación de todos los momios)
     */
    @Column(name = "momio_total", precision = 10, scale = 3)
    private BigDecimal momioTotal;

    /**
     * Ganancia potencial total
     */
    @Column(name = "ganancia_potencial", precision = 15, scale = 2)
    private BigDecimal gananciaPotencial;

    /**
     * Ganancia real (si ganó)
     */
    @Column(name = "ganancia_real", precision = 15, scale = 2)
    private BigDecimal gananciaReal;

    /**
     * Número total de apuestas en el parlay
     */
    @Column(name = "numero_apuestas")
    private Integer numeroApuestas;

    /**
     * Número de apuestas ganadas
     */
    @Builder.Default
    @Column(name = "apuestas_ganadas")
    private Integer apuestasGanadas = 0;

    /**
     * Número de apuestas perdidas
     */
    @Builder.Default
    @Column(name = "apuestas_perdidas")
    private Integer apuestasPerdidas = 0;

    /**
     * Número de apuestas pendientes
     */
    @Column(name = "apuestas_pendientes")
    private Integer apuestasPendientes;

    /**
     * Estado del parlay
     */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "estado", nullable = false)
    private EstadoParlay estado = EstadoParlay.ACTIVO;

    /**
     * Resultado final del parlay
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "resultado_final")
    private ResultadoFinalParlay resultadoFinal;

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
     * Indica si está activo
     */
    @Builder.Default
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

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
     * Lista de apuestas que componen el parlay
     */
    @OneToMany(mappedBy = "parlay", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private List<Apuesta> apuestas;

    // Enums
    public enum EstadoParlay {
        ACTIVO,
        LIQUIDADO,
        CANCELADO,
        PENDIENTE
    }

    public enum ResultadoFinalParlay {
        GANADO,
        PERDIDO,
        CANCELADO,
        PENDIENTE
    }
}
