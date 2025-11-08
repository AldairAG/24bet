package com._bet.dto.response;

import java.util.List;

import com._bet.entity.apuestas.Parlay.EstadoParlay;
import com._bet.entity.apuestas.Parlay.ResultadoFinalParlay;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParlayHistorialResponse {
    private Long id;
    private Double montoApostado;
    private ResultadoFinalParlay resultado;
    private String fechaApuesta;
    private Double momioTotal;
    private EstadoParlay estado;
    private List<ApuestaHistorialResponse> apuestas;
}
