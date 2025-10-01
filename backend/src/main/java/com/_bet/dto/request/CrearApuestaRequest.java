package com._bet.dto.request;

import lombok.Data;

@Data
public class CrearApuestaRequest {
    private Long id;
    private Long eventoId;
    private Double monto;
    private Double odd;
    private String tipoApuesta;
}
