package com._bet.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para transferencia de datos de momios/cuotas
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MomioDto {
    
    private Long id;
    private String tipoApuesta; // WIN_HOME, WIN_AWAY, DRAW, OVER, UNDER, etc.
    private String resultado; // HOME, AWAY, DRAW, OVER, UNDER, etc.
    private BigDecimal valor;
    private String descripcion;
    private Boolean activo;
    private String fuente; // CALCULADO, MANUAL, API_EXTERNA
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private LocalDateTime fechaVencimiento;
    
    // Solo ID del evento para evitar referencias circulares
    private Long eventoDeportivoId;
}