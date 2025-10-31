package com._bet.dto.response;

import com._bet.entity.apuestas.Parlay.EstadoParlay;
import com._bet.entity.apuestas.Parlay.ResultadoFinalParlay;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParlayResponse {

    /**
     * ID del parlay
     */
    private Long id;

    /**
     * Monto total apostado
     */
    private Double montoTotal;

    /**
     * Momio total del parlay
     */
    private BigDecimal momioTotal;

    /**
     * Ganancia potencial
     */
    private BigDecimal gananciaPotencial;

    /**
     * Ganancia real (si ya se liquidó)
     */
    private BigDecimal gananciaReal;

    /**
     * Número total de apuestas
     */
    private Integer numeroApuestas;

    /**
     * Apuestas ganadas
     */
    private Integer apuestasGanadas;

    /**
     * Apuestas perdidas
     */
    private Integer apuestasPerdidas;

    /**
     * Apuestas pendientes
     */
    private Integer apuestasPendientes;

    /**
     * Estado del parlay
     */
    private EstadoParlay estado;

    /**
     * Resultado final
     */
    private ResultadoFinalParlay resultadoFinal;

    /**
     * Fecha de creación
     */
    private LocalDateTime fechaCreacion;

    /**
     * Fecha de liquidación
     */
    private LocalDateTime fechaLiquidacion;

    /**
     * Observaciones
     */
    private String observaciones;

    /**
     * ID del usuario
     */
    private Long usuarioId;

    /**
     * Lista de apuestas del parlay
     */
    private List<ApuestaParlayResponse> apuestas;

    /**
     * Clase interna para las apuestas del parlay
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApuestaParlayResponse {
        
        /**
         * ID de la apuesta
         */
        private Long id;

        /**
         * ID del evento
         */
        private Long eventoId;

        /**
         * Nombre del evento
         */
        private String nombreEvento;

        /**
         * Tipo de apuesta
         */
        private String tipoApuesta;

        /**
         * Descripción de la opción
         */
        private String descripcion;

        /**
         * Momio de la apuesta
         */
        private Double momio;

        /**
         * Estado de la apuesta
         */
        private String estado;

        /**
         * Resultado de la apuesta
         */
        private String resultado;

        /**
         * Fecha de creación
         */
        private LocalDateTime fechaCreacion;
    }
}
