package com._bet.dto.response;

import java.time.LocalDateTime;

import com._bet.entity.apuestas.Apuesta.EstadoApuesta;

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
    private String resultadoApostado;
    private EstadoApuesta estadoApuesta;
    private Double momio;
}
