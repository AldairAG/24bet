package com._bet.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de respuesta para ligas filtradas por deporte
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LigaPorDeporteResponse {

    /**
     * ID único de la liga
     */
    private Long id;

    /**
     * Nombre de la liga
     */
    private String nombreLiga;

    /**
     * País donde se juega la liga (como string)
     */
    private String pais;

    /**
     * URL de la bandera del país
     */
    private String banderaPais;

    /**
     * Nombre del deporte
     */
    private String deporte;

    /**
     * Si la liga está activa
     */
    private Boolean activa;
}