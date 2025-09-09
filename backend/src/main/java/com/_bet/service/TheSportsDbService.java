package com._bet.service;

import com._bet.dto.thesportsdb.*;
import com._bet.entity.*;
import com._bet.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

/**
 * Servicio para integración con TheSportsDB API v1 y v2
 * Maneja la sincronización de deportes, ligas, equipos y eventos deportivos
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TheSportsDbService {

    private final RestTemplate restTemplate;
    private final DeporteRepository deporteRepository;
    private final LigaRepository ligaRepository;
    private final EquipoRepository equipoRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;

    @Value("${thesportsdb.api.base-url:https://www.thesportsdb.com/api/v1/json}")
    private String baseUrl;

    @Value("${thesportsdb.api.key:3}")
    private String apiKey;

    // Formatters para fechas
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Sincronización completa de todos los deportes
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarDeportes() {
        log.info("Iniciando sincronización de deportes desde TheSportsDB");
        
        try {
            String url = baseUrl + "/" + apiKey + "/all_sports.php";
            TheSportDbSportsResponseDto response = restTemplate.getForObject(url, TheSportDbSportsResponseDto.class);
            
            if (response != null && response.getSports() != null) {
                for (TheSportDbSportDto sportDto : response.getSports()) {
                    procesarDeporte(sportDto);
                }
                log.info("Sincronización de deportes completada. Procesados: {}", response.getSports().size());
            }
        } catch (Exception e) {
            log.error("Error al sincronizar deportes: {}", e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Procesa un deporte individual
     */
    @Transactional
    public void procesarDeporte(TheSportDbSportDto sportDto) {
        try {
            Optional<Deporte> existente = deporteRepository.findBySportsDbId(sportDto.getIdSport());
            
            Deporte deporte = existente.orElse(new Deporte());
            deporte.setSportsDbId(sportDto.getIdSport());
            deporte.setNombre(sportDto.getStrSport());
            deporte.setNombreIngles(sportDto.getStrSport());
            deporte.setDescripcion(sportDto.getStrSportDescription());
            deporte.setThumbUrl(sportDto.getStrSportThumb());
            deporte.setImagenUrl(sportDto.getStrSportIconGreen());
            deporte.setFormato(sportDto.getStrFormat());
            deporte.setActivo(true);
            
            deporteRepository.save(deporte);
            log.debug("Deporte procesado: {}", deporte.getNombre());
        } catch (Exception e) {
            log.error("Error al procesar deporte {}: {}", sportDto.getStrSport(), e.getMessage());
        }
    }

    /**
     * Sincroniza ligas por deporte
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarLigasPorDeporte(String deporteId) {
        log.info("Iniciando sincronización de ligas para deporte ID: {}", deporteId);
        
        try {
            String url = baseUrl + "/" + apiKey + "/search_all_leagues.php?s=" + deporteId;
            TheSportDbLeaguesResponseDto response = restTemplate.getForObject(url, TheSportDbLeaguesResponseDto.class);
            
            if (response != null && response.getLeagues() != null) {
                for (TheSportDbLeagueDto leagueDto : response.getLeagues()) {
                    procesarLiga(leagueDto);
                }
                log.info("Sincronización de ligas completada para deporte {}. Procesadas: {}", 
                        deporteId, response.getLeagues().size());
            }
        } catch (Exception e) {
            log.error("Error al sincronizar ligas para deporte {}: {}", deporteId, e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Procesa una liga individual
     */
    @Transactional
    public void procesarLiga(TheSportDbLeagueDto leagueDto) {
        try {
            Optional<Liga> existente = ligaRepository.findBySportsDbId(leagueDto.getIdLeague());
            Optional<Deporte> deporte = deporteRepository.findBySportsDbId(leagueDto.getIdSport());
            
            if (deporte.isEmpty()) {
                log.warn("Deporte no encontrado para liga {}: {}", leagueDto.getStrLeague(), leagueDto.getIdSport());
                return;
            }
            
            Liga liga = existente.orElse(new Liga());
            liga.setSportsDbId(leagueDto.getIdLeague());
            liga.setNombre(leagueDto.getStrLeague());
            liga.setNombreAlternativo(leagueDto.getStrLeagueAlternate());
            liga.setDescripcion(leagueDto.getStrDescriptionES() != null ? 
                              leagueDto.getStrDescriptionES() : leagueDto.getStrDescriptionEN());
            liga.setPais(leagueDto.getStrCountry());
            liga.setLogoUrl(leagueDto.getStrLogo());
            liga.setBadgeUrl(leagueDto.getStrBadge());
            liga.setBannerUrl(leagueDto.getStrBanner());
            liga.setPosterUrl(leagueDto.getStrPoster());
            liga.setTrophyUrl(leagueDto.getStrTrophy());
            liga.setSitioWeb(leagueDto.getStrWebsite());
            liga.setFacebook(leagueDto.getStrFacebook());
            liga.setTwitter(leagueDto.getStrTwitter());
            liga.setYoutube(leagueDto.getStrYoutube());
            liga.setRss(leagueDto.getStrRSS());
            liga.setGenero(leagueDto.getStrGender());
            liga.setTemporadaActual(leagueDto.getStrCurrentSeason());
            liga.setDeporte(deporte.get());
            liga.setActiva(true);
            
            // Procesar año de fundación
            if (leagueDto.getIntFormedYear() != null && !leagueDto.getIntFormedYear().isEmpty()) {
                try {
                    liga.setAnoFundacion(Integer.parseInt(leagueDto.getIntFormedYear()));
                } catch (NumberFormatException e) {
                    log.warn("Error al convertir año de fundación para liga {}: {}", 
                            leagueDto.getStrLeague(), leagueDto.getIntFormedYear());
                }
            }
            
            ligaRepository.save(liga);
            log.debug("Liga procesada: {}", liga.getNombre());
        } catch (Exception e) {
            log.error("Error al procesar liga {}: {}", leagueDto.getStrLeague(), e.getMessage());
        }
    }

    /**
     * Sincroniza equipos por liga
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarEquiposPorLiga(String ligaId) {
        log.info("Iniciando sincronización de equipos para liga ID: {}", ligaId);
        
        try {
            String url = baseUrl + "/" + apiKey + "/search_all_teams.php?l=" + ligaId;
            TheSportDbTeamsResponseDto response = restTemplate.getForObject(url, TheSportDbTeamsResponseDto.class);
            
            if (response != null && response.getTeams() != null) {
                for (TheSportDbTeamDto teamDto : response.getTeams()) {
                    procesarEquipo(teamDto);
                }
                log.info("Sincronización de equipos completada para liga {}. Procesados: {}", 
                        ligaId, response.getTeams().size());
            }
        } catch (Exception e) {
            log.error("Error al sincronizar equipos para liga {}: {}", ligaId, e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Procesa un equipo individual
     */
    @Transactional
    public void procesarEquipo(TheSportDbTeamDto teamDto) {
        try {
            Optional<Equipo> existente = equipoRepository.findBySportsDbId(teamDto.getIdTeam());
            Optional<Liga> liga = ligaRepository.findBySportsDbId(teamDto.getIdLeague());
            
            if (liga.isEmpty()) {
                log.warn("Liga no encontrada para equipo {}: {}", teamDto.getStrTeam(), teamDto.getIdLeague());
                return;
            }
            
            Equipo equipo = existente.orElse(new Equipo());
            equipo.setSportsDbId(teamDto.getIdTeam());
            equipo.setNombre(teamDto.getStrTeam());
            equipo.setNombreCorto(teamDto.getStrTeamShort());
            equipo.setNombreAlternativo(teamDto.getStrAlternate());
            equipo.setDescripcion(teamDto.getStrDescriptionES() != null ? 
                                teamDto.getStrDescriptionES() : teamDto.getStrDescriptionEN());
            equipo.setPais(teamDto.getStrCountry());
            equipo.setEstadio(teamDto.getStrStadium());
            equipo.setUbicacionEstadio(teamDto.getStrStadiumLocation());
            equipo.setLogoUrl(teamDto.getStrTeamLogo());
            equipo.setBadgeUrl(teamDto.getStrTeamBadge());
            equipo.setJerseyUrl(teamDto.getStrTeamJersey());
            equipo.setBannerUrl(teamDto.getStrTeamBanner());
            equipo.setFanartUrl(teamDto.getStrTeamFanart1());
            equipo.setSitioWeb(teamDto.getStrWebsite());
            equipo.setFacebook(teamDto.getStrFacebook());
            equipo.setTwitter(teamDto.getStrTwitter());
            equipo.setInstagram(teamDto.getStrInstagram());
            equipo.setYoutube(teamDto.getStrYoutube());
            equipo.setRss(teamDto.getStrRSS());
            equipo.setGenero(teamDto.getStrGender());
            equipo.setLiga(liga.get());
            equipo.setActivo(true);
            
            // Procesar año de fundación
            if (teamDto.getIntFormedYear() != null && !teamDto.getIntFormedYear().isEmpty()) {
                try {
                    equipo.setAnoFundacion(Integer.parseInt(teamDto.getIntFormedYear()));
                } catch (NumberFormatException e) {
                    log.warn("Error al convertir año de fundación para equipo {}: {}", 
                            teamDto.getStrTeam(), teamDto.getIntFormedYear());
                }
            }
            
            // Procesar capacidad del estadio
            if (teamDto.getIntStadiumCapacity() != null && !teamDto.getIntStadiumCapacity().isEmpty()) {
                try {
                    equipo.setCapacidadEstadio(Integer.parseInt(teamDto.getIntStadiumCapacity()));
                } catch (NumberFormatException e) {
                    log.warn("Error al convertir capacidad del estadio para equipo {}: {}", 
                            teamDto.getStrTeam(), teamDto.getIntStadiumCapacity());
                }
            }
            
            // Procesar colores
            String colores = String.format("#%s,#%s,#%s", 
                    Objects.toString(teamDto.getStrColour1(), ""),
                    Objects.toString(teamDto.getStrColour2(), ""),
                    Objects.toString(teamDto.getStrColour3(), ""));
            equipo.setColores(colores);
            
            equipoRepository.save(equipo);
            log.debug("Equipo procesado: {}", equipo.getNombre());
        } catch (Exception e) {
            log.error("Error al procesar equipo {}: {}", teamDto.getStrTeam(), e.getMessage());
        }
    }

    /**
     * Sincroniza eventos por liga y temporada
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarEventosPorLiga(String ligaId, String temporada) {
        log.info("Iniciando sincronización de eventos para liga ID: {} temporada: {}", ligaId, temporada);
        
        try {
            String url = baseUrl + "/" + apiKey + "/eventsseason.php?id=" + ligaId + "&s=" + temporada;
            TheSportDbEventsResponseDto response = restTemplate.getForObject(url, TheSportDbEventsResponseDto.class);
            
            if (response != null && response.getEvents() != null) {
                for (TheSportDbEventDto eventDto : response.getEvents()) {
                    procesarEvento(eventDto);
                }
                log.info("Sincronización de eventos completada para liga {} temporada {}. Procesados: {}", 
                        ligaId, temporada, response.getEvents().size());
            }
        } catch (Exception e) {
            log.error("Error al sincronizar eventos para liga {} temporada {}: {}", 
                    ligaId, temporada, e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Sincroniza eventos próximos por liga
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarEventosProximosPorLiga(String ligaId) {
        log.info("Iniciando sincronización de eventos próximos para liga ID: {}", ligaId);
        
        try {
            String url = baseUrl + "/" + apiKey + "/eventsnextleague.php?id=" + ligaId;
            TheSportDbEventsResponseDto response = restTemplate.getForObject(url, TheSportDbEventsResponseDto.class);
            
            if (response != null && response.getEvents() != null) {
                for (TheSportDbEventDto eventDto : response.getEvents()) {
                    procesarEvento(eventDto);
                }
                log.info("Sincronización de eventos próximos completada para liga {}. Procesados: {}", 
                        ligaId, response.getEvents().size());
            }
        } catch (Exception e) {
            log.error("Error al sincronizar eventos próximos para liga {}: {}", ligaId, e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Procesa un evento individual
     */
    @Transactional
    public void procesarEvento(TheSportDbEventDto eventDto) {
        try {
            Optional<EventoDeportivo> existente = eventoDeportivoRepository.findBySportsDbId(eventDto.getIdEvent());
            Optional<Liga> liga = ligaRepository.findBySportsDbId(eventDto.getIdLeague());
            
            if (liga.isEmpty()) {
                log.warn("Liga no encontrada para evento {}: {}", eventDto.getStrEvent(), eventDto.getIdLeague());
                return;
            }
            
            EventoDeportivo evento = existente.orElse(new EventoDeportivo());
            evento.setSportsDbId(eventDto.getIdEvent());
            evento.setNombre(eventDto.getStrEvent());
            evento.setDescripcion(eventDto.getStrDescriptionEN());
            evento.setTemporada(eventDto.getStrSeason());
            evento.setJornada(eventDto.getIntRound());
            evento.setEstado(eventDto.getStrStatus());
            evento.setUbicacion(eventDto.getStrVenue());
            evento.setPais(eventDto.getStrCountry());
            evento.setCiudad(eventDto.getStrCity());
            evento.setThumbUrl(eventDto.getStrThumb());
            evento.setBannerUrl(eventDto.getStrBanner());
            evento.setVideoUrl(eventDto.getStrVideo());
            evento.setLiga(liga.get());
            evento.setActivo(true);
            
            // Procesar fecha del evento
            if (eventDto.getDateEvent() != null && eventDto.getStrTime() != null) {
                try {
                    String fechaHora = eventDto.getDateEvent() + " " + eventDto.getStrTime();
                    evento.setFechaEvento(LocalDateTime.parse(fechaHora, DATETIME_FORMATTER));
                } catch (DateTimeParseException e) {
                    try {
                        // Intentar solo con la fecha
                        evento.setFechaEvento(LocalDateTime.parse(eventDto.getDateEvent() + " 00:00:00", DATETIME_FORMATTER));
                    } catch (DateTimeParseException ex) {
                        log.warn("Error al parsear fecha para evento {}: {} {}", 
                                eventDto.getStrEvent(), eventDto.getDateEvent(), eventDto.getStrTime());
                    }
                }
            }
            
            // Procesar equipos
            if (eventDto.getIdHomeTeam() != null) {
                equipoRepository.findBySportsDbId(eventDto.getIdHomeTeam())
                    .ifPresent(evento::setEquipoLocal);
            }
            
            if (eventDto.getIdAwayTeam() != null) {
                equipoRepository.findBySportsDbId(eventDto.getIdAwayTeam())
                    .ifPresent(evento::setEquipoVisitante);
            }
            
            // Procesar resultados
            if (eventDto.getIntHomeScore() != null && !eventDto.getIntHomeScore().isEmpty()) {
                try {
                    evento.setResultadoLocal(Integer.parseInt(eventDto.getIntHomeScore()));
                } catch (NumberFormatException e) {
                    log.warn("Error al convertir resultado local para evento {}: {}", 
                            eventDto.getStrEvent(), eventDto.getIntHomeScore());
                }
            }
            
            if (eventDto.getIntAwayScore() != null && !eventDto.getIntAwayScore().isEmpty()) {
                try {
                    evento.setResultadoVisitante(Integer.parseInt(eventDto.getIntAwayScore()));
                } catch (NumberFormatException e) {
                    log.warn("Error al convertir resultado visitante para evento {}: {}", 
                            eventDto.getStrEvent(), eventDto.getIntAwayScore());
                }
            }
            
            // Procesar espectadores
            if (eventDto.getIntSpectators() != null && !eventDto.getIntSpectators().isEmpty()) {
                try {
                    evento.setEspectadores(Integer.parseInt(eventDto.getIntSpectators()));
                } catch (NumberFormatException e) {
                    log.warn("Error al convertir espectadores para evento {}: {}", 
                            eventDto.getStrEvent(), eventDto.getIntSpectators());
                }
            }
            
            eventoDeportivoRepository.save(evento);
            log.debug("Evento procesado: {}", evento.getNombre());
        } catch (Exception e) {
            log.error("Error al procesar evento {}: {}", eventDto.getStrEvent(), e.getMessage());
        }
    }

    /**
     * Sincronización automática de eventos deportivos
     * Llamado desde el scheduler
     */
    public void sincronizacionEventosAutomatica() {
        log.info("Iniciando sincronización automática de eventos deportivos");
        
        try {
            // Sincronizar eventos de ligas activas
            List<Liga> ligasActivas = ligaRepository.findByActivaTrue();
            String temporadaActual = String.valueOf(LocalDateTime.now().getYear());
            
            for (Liga liga : ligasActivas) {
                // Sincronizar eventos próximos
                sincronizarEventosProximosPorLiga(liga.getSportsDbId());
                
                // Sincronizar eventos de la temporada actual
                sincronizarEventosPorLiga(liga.getSportsDbId(), temporadaActual);
                
                // Pequeña pausa para no sobrecargar la API
                Thread.sleep(1000);
            }
            
            log.info("Sincronización automática completada");
        } catch (Exception e) {
            log.error("Error en la sincronización automática: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronización de datos maestros (deportes, ligas, equipos)
     */
    public void sincronizacionDatosMaestros() {
        log.info("Iniciando sincronización de datos maestros");
        
        try {
            // 1. Sincronizar deportes
            sincronizarDeportes().join();
            
            // 2. Sincronizar ligas para cada deporte
            List<Deporte> deportes = deporteRepository.findByActivoTrue();
            for (Deporte deporte : deportes) {
                sincronizarLigasPorDeporte(deporte.getNombreIngles()).join();
                Thread.sleep(500); // Pausa entre llamadas
            }
            
            // 3. Sincronizar equipos para cada liga activa
            List<Liga> ligas = ligaRepository.findByActivaTrue();
            for (Liga liga : ligas) {
                sincronizarEquiposPorLiga(liga.getSportsDbId()).join();
                Thread.sleep(500); // Pausa entre llamadas
            }
            
            log.info("Sincronización de datos maestros completada");
        } catch (Exception e) {
            log.error("Error en la sincronización de datos maestros: {}", e.getMessage(), e);
        }
    }

    /**
     * Verifica si es necesaria una sincronización inicial
     */
    public boolean necesitaSincronizacionInicial() {
        long deportes = deporteRepository.count();
        long ligas = ligaRepository.count();
        long equipos = equipoRepository.count();
        
        // Si hay menos de 5 deportes, consideramos que necesita sincronización inicial
        return deportes < 5 || ligas < 10 || equipos < 50;
    }

    /**
     * Sincronización inicial completa para aplicación nueva
     */
    public void sincronizacionInicialCompleta() {
        log.info("Iniciando sincronización inicial completa");
        
        try {
            sincronizacionCompleta().join();
            log.info("Sincronización inicial completa finalizada");
        } catch (Exception e) {
            log.error("Error en la sincronización inicial completa: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronizar eventos que están actualmente en vivo
     */
    public void sincronizarEventosEnVivo() {
        try {
            // Obtener eventos que deberían estar en vivo (últimas 3 horas)
            LocalDateTime hace3Horas = LocalDateTime.now().minusHours(3);
            LocalDateTime ahora = LocalDateTime.now();
            
            List<EventoDeportivo> eventosActivos = eventoDeportivoRepository
                .findEventosEnRangoFechas(hace3Horas, ahora);
            
            if (!eventosActivos.isEmpty()) {
                log.debug("Actualizando {} eventos potencialmente en vivo", eventosActivos.size());
                
                // Agrupar eventos por liga para optimizar las llamadas a la API
                var eventosPorLiga = eventosActivos.stream()
                    .collect(java.util.stream.Collectors.groupingBy(
                        evento -> evento.getLiga().getSportsDbId()
                    ));
                
                for (String ligaId : eventosPorLiga.keySet()) {
                    // Sincronizar eventos próximos de la liga (incluye eventos en vivo)
                    sincronizarEventosProximosPorLiga(ligaId);
                    Thread.sleep(2000); // Pausa más larga para eventos en vivo
                }
            }
        } catch (Exception e) {
            log.error("Error en la sincronización de eventos en vivo: {}", e.getMessage(), e);
        }
    }

    /**
     * Limpia datos antiguos del sistema
     */
    public void limpiarDatosAntiguos() {
        log.info("Iniciando limpieza de datos antiguos");
        
        try {
            // Desactivar eventos antiguos (más de 2 años)
            LocalDateTime fechaLimite = LocalDateTime.now().minusYears(2);
            List<EventoDeportivo> eventosAntiguos = eventoDeportivoRepository.findEventosPasados(fechaLimite);
            
            int eventosDesactivados = 0;
            for (EventoDeportivo evento : eventosAntiguos) {
                if (evento.getFechaEvento() != null && evento.getFechaEvento().isBefore(fechaLimite)) {
                    evento.setActivo(false);
                    eventosDesactivados++;
                }
            }
            
            if (eventosDesactivados > 0) {
                eventoDeportivoRepository.saveAll(eventosAntiguos);
            }
            
            log.info("Limpieza completada. Eventos desactivados: {}", eventosDesactivados);
        } catch (Exception e) {
            log.error("Error en la limpieza de datos antiguos: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincronización completa inicial (deportes, ligas y equipos)
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizacionCompleta() {
        log.info("Iniciando sincronización completa de TheSportsDB");
        
        try {
            // 1. Sincronizar deportes
            sincronizarDeportes().join();
            
            // 2. Sincronizar ligas para cada deporte
            List<Deporte> deportes = deporteRepository.findByActivoTrue();
            for (Deporte deporte : deportes) {
                sincronizarLigasPorDeporte(deporte.getNombreIngles()).join();
                Thread.sleep(500); // Pausa entre llamadas
            }
            
            // 3. Sincronizar equipos para cada liga
            List<Liga> ligas = ligaRepository.findByActivaTrue();
            for (Liga liga : ligas) {
                sincronizarEquiposPorLiga(liga.getSportsDbId()).join();
                Thread.sleep(500); // Pausa entre llamadas
            }
            
            log.info("Sincronización completa finalizada");
        } catch (Exception e) {
            log.error("Error en la sincronización completa: {}", e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }
}
