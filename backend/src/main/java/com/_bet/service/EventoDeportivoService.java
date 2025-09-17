package com._bet.service;

import com._bet.dto.*;
import com._bet.entity.EventoDeportivo;
import com._bet.entity.Momio;
import com._bet.repository.EventoDeportivoRepository;
import com._bet.repository.MomioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para manejar eventos deportivos con sus momios
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EventoDeportivoService {

    private final EventoDeportivoRepository eventoRepository;
    private final MomioRepository momioRepository;

    /**
     * Obtiene todos los eventos deportivos activos con sus momios
     */
    public Page<EventoDeportivoConMomiosDto> obtenerEventosConMomios(Pageable pageable) {
        log.info("Obteniendo eventos deportivos con momios - Página: {}", pageable.getPageNumber());
        
        Page<EventoDeportivo> eventos = eventoRepository.findAll(pageable);
        List<EventoDeportivoConMomiosDto> eventosDto = eventos.getContent()
            .stream()
            .map(this::convertirAEventoConMomiosDto)
            .collect(Collectors.toList());
        
        return new PageImpl<>(eventosDto, pageable, eventos.getTotalElements());
    }

    /**
     * Obtiene eventos en vivo con momios actualizados
     */
    public List<EventoDeportivoConMomiosDto> obtenerEventosEnVivo() {
        log.info("Obteniendo eventos en vivo con momios");
        
        List<EventoDeportivo> eventosEnVivo = eventoRepository.findEventosEnVivoParaApuestas();
        
        return eventosEnVivo.stream()
            .map(this::convertirAEventoConMomiosDto)
            .collect(Collectors.toList());
    }

    /**
     * Obtiene eventos próximos (próximas 24 horas) con momios
     */
    public List<EventoDeportivoConMomiosDto> obtenerEventosProximos() {
        log.info("Obteniendo eventos próximos con momios");
        
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime limite = ahora.plusHours(24);
        
        List<EventoDeportivo> eventosProximos = eventoRepository.findEventosProximosParaApuestas(ahora, limite);
        
        return eventosProximos.stream()
            .map(this::convertirAEventoConMomiosDto)
            .collect(Collectors.toList());
    }

    /**
     * Obtiene un evento específico por ID con sus momios
     */
    public EventoDeportivoConMomiosDto obtenerEventoPorId(Long id) {
        log.info("Obteniendo evento por ID: {}", id);
        
        EventoDeportivo evento = eventoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + id));
        
        return convertirAEventoConMomiosDto(evento);
    }

    /**
     * Obtiene eventos por rango de fechas con momios
     */
    public List<EventoDeportivoConMomiosDto> obtenerEventosPorRangoFechas(
            LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        log.info("Obteniendo eventos por rango de fechas: {} - {}", fechaInicio, fechaFin);
        
        List<EventoDeportivo> eventos = eventoRepository.findEventosEnRangoFechas(fechaInicio, fechaFin);
        
        return eventos.stream()
            .map(this::convertirAEventoConMomiosDto)
            .collect(Collectors.toList());
    }

    /**
     * Obtiene eventos por liga con momios
     */
    public List<EventoDeportivoConMomiosDto> obtenerEventosPorLiga(String ligaSportsDbId) {
        log.info("Obteniendo eventos por liga: {}", ligaSportsDbId);
        
        List<EventoDeportivo> eventos = eventoRepository.findByLigaSportsDbId(ligaSportsDbId);
        
        return eventos.stream()
            .map(this::convertirAEventoConMomiosDto)
            .collect(Collectors.toList());
    }

    /**
     * Obtiene momios de un evento específico
     */
    public List<MomioDto> obtenerMomiosDeEvento(Long eventoId) {
        log.info("Obteniendo momios para evento: {}", eventoId);
        
        EventoDeportivo evento = eventoRepository.findById(eventoId)
            .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + eventoId));
        
        List<Momio> momios = momioRepository.findByEventoDeportivoAndActivoTrue(evento);
        
        return momios.stream()
            .map(this::convertirAMomioDto)
            .collect(Collectors.toList());
    }

    /**
     * Convierte una entidad EventoDeportivo a DTO con momios
     */
    private EventoDeportivoConMomiosDto convertirAEventoConMomiosDto(EventoDeportivo evento) {
        // Obtener momios del evento
        List<Momio> momios = momioRepository.findByEventoDeportivoAndActivoTrue(evento);
        List<MomioDto> momiosDto = momios.stream()
            .map(this::convertirAMomioDto)
            .collect(Collectors.toList());

        // Convertir liga a DTO si existe
        LigaDto ligaDto = null;
        if (evento.getLiga() != null) {
            ligaDto = LigaDto.builder()
                .id(evento.getLiga().getId())
                .sportsDbId(evento.getLiga().getSportsDbId())
                .nombre(evento.getLiga().getNombre())
                .pais(evento.getLiga().getPais().getName())
                .logoUrl(evento.getLiga().getLogoUrl())
                .build();
        }

        // Convertir equipo local a DTO si existe
        EquipoDto equipoLocalDto = null;
        if (evento.getEquipoLocal() != null) {
            equipoLocalDto = convertirAEquipoDto(evento.getEquipoLocal());
        }

        // Convertir equipo visitante a DTO si existe
        EquipoDto equipoVisitanteDto = null;
        if (evento.getEquipoVisitante() != null) {
            equipoVisitanteDto = convertirAEquipoDto(evento.getEquipoVisitante());
        }

        return EventoDeportivoConMomiosDto.builder()
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
            .liga(ligaDto)
            .equipoLocal(equipoLocalDto)
            .equipoVisitante(equipoVisitanteDto)
            .momios(momiosDto)
            .build();
    }

    /**
     * Convierte una entidad Momio a DTO
     */
    private MomioDto convertirAMomioDto(Momio momio) {
        return MomioDto.builder()
            .id(momio.getId())
            .tipoApuesta(momio.getTipoApuesta().name())
            .resultado(momio.getResultado().name())
            .valor(momio.getValor())
            .activo(momio.getActivo())
            .fuente(momio.getFuente().name())
            .fechaCreacion(momio.getFechaCreacion())
            .fechaActualizacion(momio.getFechaActualizacion())
            .eventoDeportivoId(momio.getEventoDeportivo().getId())
            .build();
    }

    /**
     * Convierte una entidad Equipo a DTO
     */
    private EquipoDto convertirAEquipoDto(com._bet.entity.Equipo equipo) {
        return EquipoDto.builder()
            .id(equipo.getId())
            .sportsDbId(equipo.getSportsDbId())
            .nombre(equipo.getNombre())
            .nombreCorto(equipo.getNombreCorto())
            .pais(equipo.getPais())
            .ciudad(equipo.getCiudad())
            .estadio(equipo.getEstadio())
            .ubicacionEstadio(equipo.getUbicacionEstadio())
            .descripcion(equipo.getDescripcion())
            .sitioWeb(equipo.getSitioWeb())
            .facebook(equipo.getFacebook())
            .twitter(equipo.getTwitter())
            .instagram(equipo.getInstagram())
            .youtube(equipo.getYoutube())
            .logoUrl(equipo.getLogoUrl())
            .bannerUrl(equipo.getBannerUrl())
            .jerseyUrl(equipo.getJerseyUrl())
            .anoFundacion(equipo.getAnoFundacion())
            .activo(equipo.getActivo())
            .build();
    }
}