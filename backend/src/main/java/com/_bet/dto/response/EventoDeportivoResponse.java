package com._bet.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para evento deportivo
 * Contiene información básica del evento para consumo del frontend
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventoDeportivoResponse {
    
    private Long id;
    private String sportsDbId;
    private String nombre;
    private String descripcion;
    private LocalDateTime fechaEvento;
    private String temporada;
    private String jornada;
    private Integer semana;
    private String estado;
    private Integer resultadoLocal;
    private Integer resultadoVisitante;
    private Integer resultadoMedioLocal;
    private Integer resultadoMedioVisitante;
    private Integer espectadores;
    private String tiempoPartido;
    private String thumbUrl;
    private String bannerUrl;
    private String videoUrl;
    private String ubicacion;
    private String pais;
    private String ciudad;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private Boolean esPostemporada;
    private Boolean enVivo;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    
    // Información de la liga
    private LigaBasicaResponse liga;
    
    // Información de los equipos
    private EquipoBasicoResponse equipoLocal;
    private EquipoBasicoResponse equipoVisitante;
    
    /**
     * DTO básico para liga
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LigaBasicaResponse {
        private Long id;
        private String sportsDbId;
        private String nombre;
        private String nombreAlternativo;
        private String deporte;
        private String pais;
        private String logoUrl;
        private String badgeUrl;
        private Boolean activa;
    }
    
    /**
     * DTO básico para equipo
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EquipoBasicoResponse {
        private Long id;
        private String sportsDbId;
        private String nombre;
        private String nombreCorto;
        private String nombreAlternativo;
        private String pais;
        private String ciudad;
        private String logoUrl;
        private String jerseyUrl;
        private String estadio;
        private Boolean activo;
    }
}