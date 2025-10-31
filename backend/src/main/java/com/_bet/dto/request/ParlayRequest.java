package com._bet.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
    private Double montoTotal;

    /**
     * Lista de apuestas que componen el parlay
     */
    @NotEmpty(message = "Debe incluir al menos una apuesta")
    @Valid
    private List<ApuestaParlay> apuestas;

    /**
     * Observaciones opcionales
     */
    private String observaciones;

    /**
     * Clase interna para representar cada apuesta del parlay
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApuestaParlay {
        
        /**
         * ID del evento
         */
        @NotNull(message = "El ID del evento es obligatorio")
        @Min(value = 1, message = "El ID del evento debe ser mayor a 0")
        private Long eventoId;

        /**
         * ID de la opción de apuesta (value)
         */
        @NotNull(message = "El ID de la opción es obligatorio")
        @Min(value = 1, message = "El ID de la opción debe ser mayor a 0")
        private Long opcionId;

        /**
         * Tipo de apuesta (ej: "Match Winner", "Over/Under", etc.)
         */
        @NotNull(message = "El tipo de apuesta es obligatorio")
        private String tipoApuesta;

        /**
         * Descripción de la opción seleccionada
         */
        @NotNull(message = "La descripción es obligatoria")
        private String descripcion;

        /**
         * Momio de la apuesta
         */
        @NotNull(message = "El momio es obligatorio")
        @DecimalMin(value = "1.0", message = "El momio debe ser al menos 1.0")
        private Double momio;

        /**
         * Nombre del evento (para referencia)
         */
        private String nombreEvento;
    }
}
