package com._bet.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para transferencia de datos de eventos deportivos con momios
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventoDeportivoConMomiosDto {
    
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
    private LigaDto liga;
    
    // Información de equipos
    private EquipoDto equipoLocal;
    private EquipoDto equipoVisitante;
    
    // Lista de momios disponibles para este evento
    private java.util.List<MomioDto> momios;
}