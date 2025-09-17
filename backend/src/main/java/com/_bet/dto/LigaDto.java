package com._bet.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * DTO para transferencia de datos de liga
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LigaDto {
    
    private Long id;
    private String sportsDbId;
    private String nombre;
    private String nombreCorto;
    private String nombreAlterno;
    private String pais;
    private String logoUrl;
    private String trofeoUrl;
    private String bannerUrl;
    private String badgeUrl;
    private String descripcion;
    private Boolean activo;
}