package com._bet.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParlayRequest {

    /**
     * Monto total apostado en el parlay
     */
    @NotNull(message = "El monto total es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private Double montoApostar;

    /**
     * Lista de apuestas que componen el parlay
     */
    @NotEmpty(message = "Debe incluir al menos una apuesta")
    @Valid
    private List<CrearApuestaRequest> apuestas;

}
