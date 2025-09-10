package com._bet.service;

import com._bet.config.TheSportsDbV2Properties;
import com._bet.dto.thesportsdb.v2.TheSportsDbV2LiveEventDto;
import com._bet.dto.thesportsdb.v2.TheSportsDbV2LiveEventsResponseDto;
import com._bet.entity.EventoDeportivo;
import com._bet.entity.Liga;
import com._bet.entity.Equipo;
import com._bet.repository.EventoDeportivoRepository;
import com._bet.repository.LigaRepository;
import com._bet.repository.EquipoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para TheSportsDB API v2 con autenticación por header
 * Especializado en eventos en vivo y actualizaciones en tiempo real
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TheSportsDbV2Service {

    private final TheSportsDbV2Properties properties;
    private final RestTemplate restTemplate;
    private final EventoDeportivoRepository eventoDeportivoRepository;
    private final LigaRepository ligaRepository;
    private final EquipoRepository equipoRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Obtiene eventos en vivo usando la API v2 con autenticación por header
     */
    public TheSportsDbV2LiveEventsResponseDto obtenerEventosEnVivo() {
        log.info("Obteniendo eventos en vivo desde TheSportsDB API v2");

        try {
            String url = properties.getV2().getBaseUrl() + "/livescore.php";
            
            HttpHeaders headers = crearHeadersConAutenticacion();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<TheSportsDbV2LiveEventsResponseDto> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                TheSportsDbV2LiveEventsResponseDto.class
            );

            TheSportsDbV2LiveEventsResponseDto resultado = response.getBody();
            if (resultado != null && resultado.getEvents() != null) {
                log.info("Obtenidos {} eventos en vivo", resultado.getEvents().size());
                return resultado;
            }

            log.warn("No se obtuvieron eventos en vivo de la API");
            return new TheSportsDbV2LiveEventsResponseDto();

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                log.error("Error de autenticación en API v2. Verificar API key: {}", e.getMessage());
            } else {
                log.error("Error HTTP al obtener eventos en vivo: {} - {}", e.getStatusCode(), e.getMessage());
            }
            throw new RuntimeException("Error al acceder a eventos en vivo", e);
        } catch (ResourceAccessException e) {
            log.error("Error de timeout al obtener eventos en vivo: {}", e.getMessage());
            throw new RuntimeException("Timeout al acceder a la API", e);
        } catch (Exception e) {
            log.error("Error inesperado al obtener eventos en vivo", e);
            throw new RuntimeException("Error inesperado en la API", e);
        }
    }

    /**
     * Obtiene eventos en vivo por liga específica
     */
    public TheSportsDbV2LiveEventsResponseDto obtenerEventosEnVivoPorLiga(String idLiga) {
        log.info("Obteniendo eventos en vivo para liga: {}", idLiga);

        try {
            String url = properties.getV2().getBaseUrl() + "/livescore.php?l=" + idLiga;
            
            HttpHeaders headers = crearHeadersConAutenticacion();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<TheSportsDbV2LiveEventsResponseDto> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                TheSportsDbV2LiveEventsResponseDto.class
            );

            TheSportsDbV2LiveEventsResponseDto resultado = response.getBody();
            if (resultado != null && resultado.getEvents() != null) {
                log.info("Obtenidos {} eventos en vivo para liga {}", resultado.getEvents().size(), idLiga);
                return resultado;
            }

            log.warn("No se obtuvieron eventos en vivo para la liga: {}", idLiga);
            return new TheSportsDbV2LiveEventsResponseDto();

        } catch (Exception e) {
            log.error("Error al obtener eventos en vivo por liga {}: {}", idLiga, e.getMessage());
            throw new RuntimeException("Error al obtener eventos por liga", e);
        }
    }

    /**
     * Sincroniza eventos en vivo con la base de datos
     */
    public void sincronizarEventosEnVivo() {
        log.info("Iniciando sincronización de eventos en vivo");

        try {
            TheSportsDbV2LiveEventsResponseDto eventosEnVivo = obtenerEventosEnVivo();
            
            if (eventosEnVivo.getEvents() != null && !eventosEnVivo.getEvents().isEmpty()) {
                for (TheSportsDbV2LiveEventDto eventoDto : eventosEnVivo.getEvents()) {
                    try {
                        procesarEventoEnVivo(eventoDto);
                    } catch (Exception e) {
                        log.error("Error al procesar evento en vivo {}: {}", eventoDto.getIdEvent(), e.getMessage());
                    }
                }
                log.info("Sincronización de eventos en vivo completada");
            } else {
                log.info("No hay eventos en vivo para sincronizar");
            }

        } catch (Exception e) {
            log.error("Error en la sincronización de eventos en vivo", e);
        }
    }

    /**
     * Procesa un evento individual en vivo y actualiza la base de datos
     */
    private void procesarEventoEnVivo(TheSportsDbV2LiveEventDto eventoDto) {
        if (eventoDto.getIdEvent() == null || eventoDto.getIdEvent().trim().isEmpty()) {
            log.warn("Evento sin ID válido, omitiendo");
            return;
        }

        Optional<EventoDeportivo> eventoExistente = eventoDeportivoRepository.findBySportsDbId(eventoDto.getIdEvent());
        
        if (eventoExistente.isPresent()) {
            // Actualizar evento existente con datos en vivo
            actualizarEventoConDatosEnVivo(eventoExistente.get(), eventoDto);
        } else {
            // Crear nuevo evento si no existe
            crearEventoDesdeEventoEnVivo(eventoDto);
        }
    }

    /**
     * Actualiza un evento existente con datos en tiempo real
     */
    private void actualizarEventoConDatosEnVivo(EventoDeportivo evento, TheSportsDbV2LiveEventDto eventoDto) {
        boolean actualizado = false;

        // Actualizar marcador
        Integer marcadorLocal = eventoDto.getHomeScoreAsInt();
        Integer marcadorVisitante = eventoDto.getAwayScoreAsInt();
        
        if (marcadorLocal != null && !marcadorLocal.equals(evento.getResultadoLocal())) {
            evento.setResultadoLocal(marcadorLocal);
            actualizado = true;
        }
        
        if (marcadorVisitante != null && !marcadorVisitante.equals(evento.getResultadoVisitante())) {
            evento.setResultadoVisitante(marcadorVisitante);
            actualizado = true;
        }

        // Actualizar estado del evento
        if (eventoDto.getStrStatus() != null && !eventoDto.getStrStatus().equals(evento.getEstado())) {
            evento.setEstado(eventoDto.getStrStatus());
            actualizado = true;
        }

        // Actualizar información en vivo
        if (eventoDto.isLive() && !Boolean.TRUE.equals(evento.getEnVivo())) {
            evento.setEnVivo(true);
            actualizado = true;
        } else if (!eventoDto.isLive() && Boolean.TRUE.equals(evento.getEnVivo())) {
            evento.setEnVivo(false);
            actualizado = true;
        }

        // Actualizar tiempo transcurrido
        if (eventoDto.getStrElapsedTime() != null) {
            // Aquí podrías agregar un campo para tiempo transcurrido si lo necesitas
            actualizado = true;
        }

        if (actualizado) {
            evento.setFechaActualizacion(LocalDateTime.now());
            eventoDeportivoRepository.save(evento);
            log.debug("Evento {} actualizado con datos en vivo", evento.getSportsDbId());
        }
    }

    /**
     * Crea un nuevo evento desde datos en vivo
     */
    private void crearEventoDesdeEventoEnVivo(TheSportsDbV2LiveEventDto eventoDto) {
        try {
            EventoDeportivo evento = EventoDeportivo.builder()
                .sportsDbId(eventoDto.getIdEvent())
                .nombre(eventoDto.getStrEvent())
                .fechaEvento(eventoDto.getEventDateTime())
                .resultadoLocal(eventoDto.getHomeScoreAsInt())
                .resultadoVisitante(eventoDto.getAwayScoreAsInt())
                .estado(eventoDto.getStrStatus())
                .enVivo(eventoDto.isLive())
                .temporada(eventoDto.getStrSeason())
                .esPostemporada(false)
                .activo(true)
                .fechaCreacion(LocalDateTime.now())
                .fechaActualizacion(LocalDateTime.now())
                .build();

            // Buscar y asignar liga
            if (eventoDto.getIdLeague() != null) {
                ligaRepository.findBySportsDbId(eventoDto.getIdLeague())
                    .ifPresent(evento::setLiga);
            }

            // Buscar y asignar equipos
            if (eventoDto.getIdHomeTeam() != null) {
                equipoRepository.findBySportsDbId(eventoDto.getIdHomeTeam())
                    .ifPresent(evento::setEquipoLocal);
            }

            if (eventoDto.getIdAwayTeam() != null) {
                equipoRepository.findBySportsDbId(eventoDto.getIdAwayTeam())
                    .ifPresent(evento::setEquipoVisitante);
            }

            eventoDeportivoRepository.save(evento);
            log.debug("Nuevo evento en vivo creado: {}", evento.getSportsDbId());

        } catch (Exception e) {
            log.error("Error al crear evento desde datos en vivo {}: {}", eventoDto.getIdEvent(), e.getMessage());
        }
    }

    /**
     * Crea headers con autenticación para API v2
     */
    private HttpHeaders crearHeadersConAutenticacion() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String apiKey = properties.getV2().getKey();
        String headerName = properties.getV2().getHeaderName();
        
        if (apiKey != null && !apiKey.trim().isEmpty() && 
            headerName != null && !headerName.trim().isEmpty()) {
            headers.set(headerName, apiKey);
        } else {
            log.warn("API key o header name no configurados para API v2");
        }
        
        return headers;
    }

    /**
     * Obtiene estadísticas en tiempo real de un evento específico
     */
    public TheSportsDbV2LiveEventDto obtenerEstadisticasEnVivo(String idEvento) {
        log.info("Obteniendo estadísticas en vivo para evento: {}", idEvento);

        try {
            String url = properties.getV2().getBaseUrl() + "/lookupevent.php?id=" + idEvento;
            
            HttpHeaders headers = crearHeadersConAutenticacion();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<TheSportsDbV2LiveEventsResponseDto> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                TheSportsDbV2LiveEventsResponseDto.class
            );

            TheSportsDbV2LiveEventsResponseDto resultado = response.getBody();
            if (resultado != null && resultado.getEvents() != null && !resultado.getEvents().isEmpty()) {
                return resultado.getEvents().get(0);
            }

            log.warn("No se encontraron estadísticas para el evento: {}", idEvento);
            return null;

        } catch (Exception e) {
            log.error("Error al obtener estadísticas en vivo para evento {}: {}", idEvento, e.getMessage());
            return null;
        }
    }

    /**
     * Utility method para parsear enteros de forma segura
     */
    private Integer parseIntegerSafely(String value) {
        try {
            return value != null && !value.trim().isEmpty() ? Integer.parseInt(value.trim()) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
