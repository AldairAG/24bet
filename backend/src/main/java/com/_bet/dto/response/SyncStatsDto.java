package com._bet.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SyncStatsDto {
    
    private long totalPaises;
    private long paisesActivos;
    
    private long totalDeportes;
    private long deportesActivos;
    
    private long totalLigas;
    private long ligasActivas;
    
    private long totalEquipos;
    private long equiposActivos;
    
    private long totalEventos;
    private long eventosActivos;
    
    private String ultimaSincronizacion;
    private String estadoApi;
}
