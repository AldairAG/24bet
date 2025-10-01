package com._bet.entity.eventoEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Valor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String valor;
    private Double odd;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "momio_id", nullable = false)
    private Momio momio;

    private LocalDateTime fechaActualizacion;
}
