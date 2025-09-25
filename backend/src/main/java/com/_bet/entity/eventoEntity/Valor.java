package com._bet.entity.eventoEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;


@Data
public class Valor {
    private String valor;
    private BigDecimal odd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "momio_id", nullable = false)
    private Momio momio;

    private LocalDateTime fechaActualizacion;
}
