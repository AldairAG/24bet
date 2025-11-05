package com._bet.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com._bet.entity.apuestas.Apuesta.EstadoApuesta;
import com._bet.entity.apuestas.Apuesta.ResultadoApuesta;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApuestaHistorialResponse {
    private String tipoApuesta;
    private Double montoApostado;
    private Boolean resultado;
    private LocalDateTime fechaApuesta;
    private String nombreEvento;
    private String resultadoEvento;
    private ResultadoApuesta resultadoApostado;
    private EstadoApuesta estadoApuesta;
    private Double momio;
}
