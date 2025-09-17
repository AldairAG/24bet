package com._bet.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * DTO para transferencia de datos de equipo
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipoDto {
    
    private Long id;
    private String sportsDbId;
    private String nombre;
    private String nombreCorto;
    private String nombreAlterno;
    private String pais;
    private String ciudad;
    private String estadio;
    private String ubicacionEstadio;
    private String descripcion;
    private String sitioWeb;
    private String facebook;
    private String twitter;
    private String instagram;
    private String youtube;
    private String logoUrl;
    private String bannerUrl;
    private String jerseyUrl;
    private String fanart1Url;
    private String fanart2Url;
    private String fanart3Url;
    private String fanart4Url;
    private Integer anoFundacion;
    private Boolean activo;
}