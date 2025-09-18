package com._bet.helpers;

import com._bet.entity.EventoDeportivo;
import com._bet.entity.Liga;
import com._bet.entity.Equipo;
import com._bet.dto.response.EventoDeportivoResponse;
import com._bet.dto.response.EventoDeportivoResponse.LigaBasicaResponse;
import com._bet.dto.response.EventoDeportivoResponse.EquipoBasicoResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entidades EventoDeportivo a DTOs
 */
@Component
public class EventoDeportivoMapper {

    /**
     * Convierte una entidad EventoDeportivo a EventoDeportivoResponse
     */
    public EventoDeportivoResponse toResponse(EventoDeportivo evento) {
        if (evento == null) {
            return null;
        }

        return EventoDeportivoResponse.builder()
                .id(evento.getId())
                .sportsDbId(evento.getSportsDbId())
                .nombre(evento.getNombre())
                .descripcion(evento.getDescripcion())
                .fechaEvento(evento.getFechaEvento())
                .temporada(evento.getTemporada())
                .jornada(evento.getJornada())
                .semana(evento.getSemana())
                .estado(evento.getEstado())
                .resultadoLocal(evento.getResultadoLocal())
                .resultadoVisitante(evento.getResultadoVisitante())
                .resultadoMedioLocal(evento.getResultadoMedioLocal())
                .resultadoMedioVisitante(evento.getResultadoMedioVisitante())
                .espectadores(evento.getEspectadores())
                .tiempoPartido(evento.getTiempoPartido())
                .thumbUrl(evento.getThumbUrl())
                .bannerUrl(evento.getBannerUrl())
                .videoUrl(evento.getVideoUrl())
                .ubicacion(evento.getUbicacion())
                .pais(evento.getPais())
                .ciudad(evento.getCiudad())
                .latitud(evento.getLatitud())
                .longitud(evento.getLongitud())
                .esPostemporada(evento.getEsPostemporada())
                .enVivo(evento.getEnVivo())
                .activo(evento.getActivo())
                .fechaCreacion(evento.getFechaCreacion())
                .fechaActualizacion(evento.getFechaActualizacion())
                .liga(toLigaBasicaResponse(evento.getLiga()))
                .equipoLocal(toEquipoBasicoResponse(evento.getEquipoLocal()))
                .equipoVisitante(toEquipoBasicoResponse(evento.getEquipoVisitante()))
                .build();
    }

    /**
     * Convierte una lista de EventoDeportivo a lista de EventoDeportivoResponse
     */
    public List<EventoDeportivoResponse> toResponseList(List<EventoDeportivo> eventos) {
        if (eventos == null) {
            return null;
        }
        
        return eventos.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convierte una entidad Liga a LigaBasicaResponse
     */
    private LigaBasicaResponse toLigaBasicaResponse(Liga liga) {
        if (liga == null) {
            return null;
        }

        return LigaBasicaResponse.builder()
                .id(liga.getId())
                .sportsDbId(liga.getSportsDbId())
                .nombre(liga.getNombre())
                .nombreAlternativo(liga.getNombreAlternativo())
                .deporte(liga.getDeporte().getNombreIngles())
                .pais(liga.getPais().getName())
                .logoUrl(liga.getLogoUrl())
                .badgeUrl(liga.getBadgeUrl())
                .activa(liga.getActiva())
                .build();
    }

    /**
     * Convierte una entidad Equipo a EquipoBasicoResponse
     */
    private EquipoBasicoResponse toEquipoBasicoResponse(Equipo equipo) {
        if (equipo == null) {
            return null;
        }

        return EquipoBasicoResponse.builder()
                .id(equipo.getId())
                .sportsDbId(equipo.getSportsDbId())
                .nombre(equipo.getNombre())
                .nombreCorto(equipo.getNombreCorto())
                .nombreAlternativo(equipo.getNombreAlternativo())
                .pais(equipo.getPais())
                .ciudad(equipo.getCiudad())
                .logoUrl(equipo.getLogoUrl())
                .jerseyUrl(equipo.getJerseyUrl())
                .estadio(equipo.getEstadio())
                .activo(equipo.getActivo())
                .build();
    }
}