package com._bet.service.theSportsDb;

import com._bet.dto.thesportsdb.*;
import com._bet.dto.response.SyncStatsDto;
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
    private final CountryRepository countryRepository;

    @Value("${thesportsdb.api.base-url-v1}")
    private String baseUrl;

    @Value("${thesportsdb.api.key:3}")
    private String apiKey;

    // Rate limiting variables
    private volatile int requestCount = 0;
    private volatile long lastResetTime = System.currentTimeMillis();
    private static final int MAX_REQUESTS_PER_MINUTE = 100;
    private static final long RATE_LIMIT_WINDOW_MS = 60000; // 1 minuto
    private static final long RATE_LIMIT_WAIT_MS = 65000; // 65 segundos para estar seguros

    // Formatters para fechas
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Verifica y maneja el rate limiting antes de hacer una petición HTTP
     */
    private synchronized void checkRateLimit() {
        long currentTime = System.currentTimeMillis();
        
        // Resetear contador si ha pasado más de un minuto
        if (currentTime - lastResetTime >= RATE_LIMIT_WINDOW_MS) {
            requestCount = 0;
            lastResetTime = currentTime;
        }
        
        // Si hemos alcanzado el límite, esperar
        if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
            long timeToWait = RATE_LIMIT_WAIT_MS - (currentTime - lastResetTime);
            if (timeToWait > 0) {
                log.warn("Rate limit alcanzado. Esperando {} ms antes de continuar", timeToWait);
                try {
                    Thread.sleep(timeToWait);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Interrupción durante espera de rate limit", e);
                }
                // Resetear después de esperar
                requestCount = 0;
                lastResetTime = System.currentTimeMillis();
            }
        }
        
        // Incrementar contador de requests
        requestCount++;
    }

    /**
     * Wrapper para hacer peticiones HTTP con control de rate limiting
     */
    private <T> T makeHttpRequest(String url, Class<T> responseType) {
        checkRateLimit();
        log.debug("Haciendo petición HTTP (#{}) a: {}", requestCount, url);
        return restTemplate.getForObject(url, responseType);
    }

    /**
     * Obtiene información del estado actual del rate limiting
     */
    public String obtenerEstadoRateLimit() {
        long tiempoTranscurrido = System.currentTimeMillis() - lastResetTime;
        long tiempoRestante = RATE_LIMIT_WINDOW_MS - tiempoTranscurrido;
        
        return String.format("Rate Limit Status - Requests: %d/%d, Tiempo hasta reset: %d ms", 
                requestCount, MAX_REQUESTS_PER_MINUTE, Math.max(0, tiempoRestante));
    }

    /**
     * Resetea manualmente el contador de rate limiting (usar con precaución)
     */
    public synchronized void resetearRateLimit() {
        requestCount = 0;
        lastResetTime = System.currentTimeMillis();
        log.info("Rate limit reseteado manualmente");
    }

    /**
     * Sincronización completa de todos los deportes
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarDeportes() {
        log.info("Iniciando sincronización de deportes desde TheSportsDB");
        
        try {
            String url = baseUrl + "/" + apiKey + "/all_sports.php";
            TheSportDbSportsResponseDto response = makeHttpRequest(url, TheSportDbSportsResponseDto.class);
            
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

    @Transactional
    public void sincronizarPaises() {
        log.info("Iniciando sincronización de países desde TheSportsDB");
        
        try {
            String url = baseUrl + "/" + apiKey + "/all_countries.php";
            TheSportDbCountriesResponseDto response = makeHttpRequest(url, TheSportDbCountriesResponseDto.class);
            
            if (response != null && response.getCountries() != null) {
                for (TheSportDbCountryDto countryDto : response.getCountries()) {
                    procesarPais(countryDto);
                }
                log.info("Sincronización de países completada. Procesados: {}", response.getCountries().size());
            }
        } catch (Exception e) {
            log.error("Error al sincronizar países: {}", e.getMessage(), e);
        }
    }

    /**
     * Procesa un país individual
     */
    @Transactional
    public void procesarPais(TheSportDbCountryDto countryDto) {
        try {
            Optional<Country> existente = countryRepository.findByName(countryDto.getNameEn());
            
            Country country = existente.orElse(new Country());
            country.setName(countryDto.getNameEn());
            country.setNameEs(countryDto.getNameEs());
            country.setNameFr(countryDto.getNameFr());
            country.setNameDe(countryDto.getNameDe());
            country.setFlagUrl(countryDto.getFlagUrl32());
            country.setActivo(true);
            
            countryRepository.save(country);
            log.debug("País procesado: {}", country.getName());
        } catch (Exception e) {
            log.error("Error al procesar país {}: {}", countryDto.getNameEn(), e.getMessage());
        }
    }    /**
     * Sincroniza ligas por deporte
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarLigasPorDeporte(String deporteId) {
        log.info("Iniciando sincronización de ligas para deporte ID: {}", deporteId);
        
        try {
            String url = baseUrl + "/" + apiKey + "/search_all_leagues.php?s=" + deporteId;
            TheSportDbLeaguesResponseDto response = makeHttpRequest(url, TheSportDbLeaguesResponseDto.class);
            
            if (response != null && response.getLeagues() != null) {
                List<TheSportDbLeagueDto> ligasDto = response.getLeagues();
                procesarLigasEnLotesOptimizado(ligasDto, 20); // Procesar en lotes optimizado
                
                log.info("Sincronización de ligas completada para deporte {}. Procesadas: {}", 
                        deporteId, ligasDto.size());
            }
        } catch (Exception e) {
            log.error("Error al sincronizar ligas para deporte {}: {}", deporteId, e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Sincroniza ligas por deporte y país con manejo de lotes
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarLigasPorDeporteYPais(String deporteId, String paisNombre) {
        log.info("Iniciando sincronización de ligas para deporte ID: {} y país: {}", deporteId, paisNombre);
        
        try {
            String url = baseUrl + "/" + apiKey + "/search_all_leagues.php?s=" + deporteId + "&c=" + paisNombre;
            TheSportDbLeaguesResponseDto response = makeHttpRequest(url, TheSportDbLeaguesResponseDto.class);
            
            if (response != null && response.getLeagues() != null) {
                List<TheSportDbLeagueDto> ligasDto = response.getLeagues();
                procesarLigasEnLotesOptimizado(ligasDto, 20); // Procesar en lotes optimizado
                
                log.info("Sincronización de ligas completada para deporte {} y país {}. Procesadas: {}", 
                        deporteId, paisNombre, ligasDto.size());
            }
        } catch (Exception e) {
            log.error("Error al sincronizar ligas para deporte {} y país {}: {}", 
                    deporteId, paisNombre, e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Procesa ligas en lotes para evitar perder datos en caso de errores
     */
    @Transactional
    public void procesarLigasEnLotes(List<TheSportDbLeagueDto> ligasDto, int tamanoLote) {
        int totalLigas = ligasDto.size();
        int ligasProcesadas = 0;
        
        for (int i = 0; i < totalLigas; i += tamanoLote) {
            int finLote = Math.min(i + tamanoLote, totalLigas);
            List<TheSportDbLeagueDto> lote = ligasDto.subList(i, finLote);
            
            try {
                // Procesar cada liga en el lote
                for (TheSportDbLeagueDto leagueDto : lote) {
                    procesarLiga(leagueDto);
                    ligasProcesadas++;
                }
                
                // Forzar el commit de la transacción para este lote
                ligaRepository.flush();
                
                log.debug("Lote procesado: {}/{} ligas guardadas en BD", 
                        ligasProcesadas, totalLigas);
                        
            } catch (Exception e) {
                log.error("Error procesando lote de ligas ({}-{}): {}", 
                        i, finLote - 1, e.getMessage());
                // Continuar con el siguiente lote
            }
        }
        
        log.info("Procesamiento de ligas completado: {}/{} ligas guardadas", 
                ligasProcesadas, totalLigas);
    }

    /**
     * Procesa ligas en lotes optimizado, saltando las que ya existen y están actualizadas
     */
    @Transactional
    public void procesarLigasEnLotesOptimizado(List<TheSportDbLeagueDto> ligasDto, int tamanoLote) {
        if (ligasDto == null || ligasDto.isEmpty()) {
            return;
        }
        
        log.info("Iniciando procesamiento optimizado de {} ligas en lotes de {}", 
                 ligasDto.size(), tamanoLote);
        
        int totalProcesadas = 0;
        int totalOmitidas = 0;
        
        for (int i = 0; i < ligasDto.size(); i += tamanoLote) {
            int fin = Math.min(i + tamanoLote, ligasDto.size());
            List<TheSportDbLeagueDto> lote = ligasDto.subList(i, fin);
            
            try {
                int procesadasEnLote = 0;
                int omitidasEnLote = 0;
                
                for (TheSportDbLeagueDto ligaDto : lote) {
                    // Verificación rápida si la liga ya existe y está actualizada
                    Optional<Liga> existente = ligaRepository.findBySportsDbId(ligaDto.getIdLeague());
                    
                    if (existente.isPresent() && 
                        Boolean.TRUE.equals(existente.get().getActiva()) && 
                        estaLigaActualizada(existente.get(), ligaDto)) {
                        omitidasEnLote++;
                        continue; // Saltar esta liga
                    }
                    
                    procesarLiga(ligaDto);
                    procesadasEnLote++;
                }
                
                // Forzar escritura a BD del lote
                ligaRepository.flush();
                
                totalProcesadas += procesadasEnLote;
                totalOmitidas += omitidasEnLote;
                
                log.info("Lote {}/{} completado - Procesadas: {}, Omitidas: {}, Total procesadas: {}, Total omitidas: {}", 
                         (i / tamanoLote) + 1, 
                         (ligasDto.size() + tamanoLote - 1) / tamanoLote,
                         procesadasEnLote, 
                         omitidasEnLote,
                         totalProcesadas, 
                         totalOmitidas);
                
            } catch (Exception e) {
                log.error("Error al procesar lote de ligas {}-{}: {}", i, fin - 1, e.getMessage(), e);
            }
        }
        
        log.info("Procesamiento optimizado completado - Total procesadas: {}, Total omitidas: {}", 
                 totalProcesadas, totalOmitidas);
    }

    /**
     * Sincroniza todas las ligas por deporte usando países disponibles con manejo de rate limiting
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarTodasLigasPorDeporte(String deporteId) {
        log.info("Iniciando sincronización completa de ligas para deporte ID: {}", deporteId);
        
        int ligasProcesadas = 0;
        int totalPaises = 0;
        
        try {
            // Primero sincronizar todas las ligas del deporte sin filtro de país
            sincronizarLigasPorDeporte(deporteId).join();
            
            // Luego sincronizar por países específicos para asegurar completitud
            List<Country> paisesActivos = countryRepository.findByActivoTrue();
            totalPaises = paisesActivos.size();
            
            log.info("Sincronizando ligas para {} países en deporte {}", totalPaises, deporteId);
            
            int paisesEnLote = 0;
            final int TAMAÑO_LOTE = 10; // Procesar 10 países antes de guardar progreso
            
            for (int i = 0; i < paisesActivos.size(); i++) {
                Country pais = paisesActivos.get(i);
                
                try {
                    log.debug("Procesando país {}/{}: {}", i + 1, totalPaises, pais.getName());
                    
                    // Usar el nombre en inglés del país para la consulta
                    sincronizarLigasPorDeporteYPais(deporteId, pais.getName()).join();
                    paisesEnLote++;
                    ligasProcesadas++;
                    
                    // Guardar progreso cada cierto número de países
                    if (paisesEnLote >= TAMAÑO_LOTE || i == paisesActivos.size() - 1) {
                        log.info("Progreso: {}/{} países procesados para deporte {}", 
                                i + 1, totalPaises, deporteId);
                        paisesEnLote = 0;
                        
                        // Pausa adicional después de cada lote para evitar sobrecarga
                        if (i < paisesActivos.size() - 1) {
                            Thread.sleep(1000);
                        }
                    }
                    
                } catch (Exception e) {
                    log.warn("Error procesando país {} para deporte {}: {}", 
                            pais.getName(), deporteId, e.getMessage());
                    // Continúar con el siguiente país en caso de error
                }
            }
            
            log.info("Sincronización completa de ligas completada para deporte: {}. " +
                    "Total países procesados: {}", deporteId, ligasProcesadas);
                    
        } catch (Exception e) {
            log.error("Error en la sincronización completa de ligas para deporte {}: {}. " +
                    "Países procesados hasta el error: {}/{}", 
                    deporteId, e.getMessage(), ligasProcesadas, totalPaises, e);
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
            
            // Si la liga ya existe y está activa, verificar si necesita actualización
            if (existente.isPresent()) {
                Liga ligaExistente = existente.get();
                
                // Verificar si la liga necesita actualización comparando datos clave
                if (Boolean.TRUE.equals(ligaExistente.getActiva()) && 
                    estaLigaActualizada(ligaExistente, leagueDto)) {
                    log.debug("Liga {} ya existe y está actualizada, omitiendo procesamiento", 
                             leagueDto.getStrLeague());
                    return; // Termina aquí para ahorrar recursos
                }
            }
            
            // Buscar deporte por nombre en inglés en lugar de por ID
            Optional<Deporte> deporte = Optional.empty();
            if (leagueDto.getStrSport() != null && !leagueDto.getStrSport().trim().isEmpty()) {
                deporte = deporteRepository.findByNombreIngles(leagueDto.getStrSport().trim());
            }
            
            if (deporte.isEmpty()) {
                log.warn("Deporte no encontrado para liga {}: {} (nombre: {})", 
                        leagueDto.getStrLeague(), leagueDto.getIdSport(), leagueDto.getStrSport());
                return;
            }
            
            Liga liga = existente.orElse(new Liga());
            liga.setSportsDbId(leagueDto.getIdLeague());
            liga.setNombre(leagueDto.getStrLeague());
            liga.setNombreAlternativo(leagueDto.getStrLeagueAlternate());
            liga.setDescripcion(leagueDto.getStrDescriptionES() != null ? 
                              leagueDto.getStrDescriptionES() : leagueDto.getStrDescriptionEN());
            
            // Buscar y asignar país
            if (leagueDto.getStrCountry() != null && !leagueDto.getStrCountry().trim().isEmpty()) {
                Optional<Country> pais = countryRepository.findByAnyName(leagueDto.getStrCountry().trim());
                if (pais.isPresent()) {
                    liga.setPais(pais.get());
                } else {
                    // Crear nuevo país si no existe
                    Country nuevoPais = Country.builder()
                            .name(leagueDto.getStrCountry().trim())
                            .activo(true)
                            .build();
                    nuevoPais = countryRepository.save(nuevoPais);
                    liga.setPais(nuevoPais);
                    log.debug("Nuevo país creado: {}", nuevoPais.getName());
                }
                // Mantener también el campo legacy para compatibilidad
                liga.setPaisNombre(leagueDto.getStrCountry());
            }
            
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
            
            boolean esNuevaLiga = existente.isEmpty();
            ligaRepository.save(liga);
            
            if (esNuevaLiga) {
                log.debug("Nueva liga creada: {} ({})", liga.getNombre(), liga.getSportsDbId());
            } else {
                log.debug("Liga actualizada: {} ({})", liga.getNombre(), liga.getSportsDbId());
            }
            
        } catch (Exception e) {
            log.error("Error al procesar liga {}: {}", leagueDto.getStrLeague(), e.getMessage());
        }
    }

    /**
     * Sincroniza equipos por liga con manejo de lotes
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarEquiposPorLiga(String ligaId) {
        log.info("Iniciando sincronización de equipos para liga ID: {}", ligaId);
        
        try {
            String url = baseUrl + "/" + apiKey + "/search_all_teams.php?l=" + ligaId;
            TheSportDbTeamsResponseDto response = makeHttpRequest(url, TheSportDbTeamsResponseDto.class);
            
            if (response != null && response.getTeams() != null) {
                List<TheSportDbTeamDto> equiposDto = response.getTeams();
                procesarEquiposEnLotes(equiposDto, 15); // Procesar en lotes de 15
                
                log.info("Sincronización de equipos completada para liga {}. Procesados: {}", 
                        ligaId, equiposDto.size());
            }
        } catch (Exception e) {
            log.error("Error al sincronizar equipos para liga {}: {}", ligaId, e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Procesa equipos en lotes para evitar perder datos en caso de errores
     */
    @Transactional
    public void procesarEquiposEnLotes(List<TheSportDbTeamDto> equiposDto, int tamanoLote) {
        int totalEquipos = equiposDto.size();
        int equiposProcesados = 0;
        
        for (int i = 0; i < totalEquipos; i += tamanoLote) {
            int finLote = Math.min(i + tamanoLote, totalEquipos);
            List<TheSportDbTeamDto> lote = equiposDto.subList(i, finLote);
            
            try {
                // Procesar cada equipo en el lote
                for (TheSportDbTeamDto teamDto : lote) {
                    procesarEquipo(teamDto);
                    equiposProcesados++;
                }
                
                // Forzar el commit de la transacción para este lote
                equipoRepository.flush();
                
                log.debug("Lote de equipos procesado: {}/{} equipos guardados en BD", 
                        equiposProcesados, totalEquipos);
                        
            } catch (Exception e) {
                log.error("Error procesando lote de equipos ({}-{}): {}", 
                        i, finLote - 1, e.getMessage());
                // Continuar con el siguiente lote
            }
        }
        
        log.info("Procesamiento de equipos completado: {}/{} equipos guardados", 
                equiposProcesados, totalEquipos);
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
            TheSportDbEventsResponseDto response = makeHttpRequest(url, TheSportDbEventsResponseDto.class);
            
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
            TheSportDbEventsResponseDto response = makeHttpRequest(url, TheSportDbEventsResponseDto.class);
            
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
            // 1. Sincronizar países primero
            sincronizarPaises();
            Thread.sleep(1000);
            
            // 2. Sincronizar deportes
            sincronizarDeportes().join();
            
            // 3. Sincronizar ligas para cada deporte usando países
            List<Deporte> deportes = deporteRepository.findByActivoTrue();
            for (Deporte deporte : deportes) {
                sincronizarTodasLigasPorDeporte(deporte.getNombreIngles()).join();
                Thread.sleep(1000); // Pausa más larga entre deportes
            }
            
            // 4. Sincronizar equipos para cada liga activa
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
     * Sincronización completa inicial (deportes, ligas y equipos) con manejo de rate limiting
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizacionCompleta() {
        Boolean sincronizarPaisesBoolean=false;
        Boolean sincronizarDeportesBoolean=false;
        log.info("Iniciando sincronización completa de TheSportsDB");
        
        long tiempoInicio = System.currentTimeMillis();
        int deportesProcesados = 0;
        int ligasProcesadas = 0;
        
        try {
            // 1. Sincronizar países
            if (sincronizarPaisesBoolean) {
                log.info("Fase 1/4: Sincronizando países...");
                sincronizarPaises();
                Thread.sleep(1000);
            }
            
            // 2. Sincronizar deportes
            if (sincronizarDeportesBoolean) {
                log.info("Fase 2/4: Sincronizando deportes...");
                sincronizarDeportes().join();
            }

            // 3. Sincronizar ligas para cada deporte con asociación por país
            List<Deporte> deportes = deporteRepository.findByActivoTrue();
            log.info("Fase 3/4: Sincronizando ligas para {} deportes...", deportes.size());
            
            for (int i = 0; i < deportes.size(); i++) {
                Deporte deporte = deportes.get(i);
                log.info("Procesando deporte {}/{}: {}", i + 1, deportes.size(), deporte.getNombreIngles());
                
                try {
                    sincronizarTodasLigasPorDeporte(deporte.getNombreIngles()).join();
                    deportesProcesados++;
                    
                    log.info("Deporte completado {}/{}: {}", i + 1, deportes.size(), deporte.getNombreIngles());
                    Thread.sleep(2000); // Pausa mayor entre deportes para evitar rate limiting
                    
                } catch (Exception e) {
                    log.error("Error sincronizando ligas para deporte {}: {}", 
                            deporte.getNombreIngles(), e.getMessage());
                    // Continuar con el siguiente deporte
                }
            }
            
            // 4. Sincronizar equipos para cada liga
            List<Liga> ligas = ligaRepository.findByActivaTrue();
            log.info("Fase 4/4: Sincronizando equipos para {} ligas...", ligas.size());
            
            for (int i = 0; i < ligas.size(); i++) {
                Liga liga = ligas.get(i);
                
                try {
                    if (i % 50 == 0) { // Log cada 50 ligas
                        log.info("Progreso equipos: {}/{} ligas procesadas", i, ligas.size());
                    }
                    
                    sincronizarEquiposPorLiga(liga.getSportsDbId()).join();
                    ligasProcesadas++;
                    Thread.sleep(500); // Pausa entre llamadas
                    
                } catch (Exception e) {
                    log.warn("Error sincronizando equipos para liga {}: {}", 
                            liga.getNombre(), e.getMessage());
                    // Continuar con la siguiente liga
                }
            }
            
            long tiempoTotal = System.currentTimeMillis() - tiempoInicio;
            log.info("Sincronización completa finalizada en {} ms. Deportes: {}/{}, Ligas: {}/{}",
                    tiempoTotal, deportesProcesados, deportes.size(), ligasProcesadas, ligas.size());
                    
        } catch (Exception e) {
            long tiempoTotal = System.currentTimeMillis() - tiempoInicio;
            log.error("Error en la sincronización completa después de {} ms. " +
                    "Deportes procesados: {}, Ligas procesadas: {}: {}", 
                    tiempoTotal, deportesProcesados, ligasProcesadas, e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Obtiene estadísticas generales de la base de datos
     */
    public SyncStatsDto obtenerEstadisticasSincronizacion() {
        return SyncStatsDto.builder()
                .totalPaises(countryRepository.count())
                .paisesActivos(countryRepository.findByActivoTrue().size())
                .totalDeportes(deporteRepository.count())
                .deportesActivos(deporteRepository.findByActivoTrue().size())
                .totalLigas(ligaRepository.count())
                .ligasActivas(ligaRepository.findByActivaTrue().size())
                .totalEquipos(equipoRepository.count())
                .equiposActivos(equipoRepository.findByActivoTrue().size())
                .totalEventos(eventoDeportivoRepository.count())
                .eventosActivos(eventoDeportivoRepository.findByActivoTrue().size())
                .build();
    }

    /**
     * Busca equipos por texto en nombre
     */
    public List<Equipo> buscarEquiposPorNombre(String nombre) {
        return equipoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    /**
     * Busca eventos deportivos por rango de fechas
     */
    public List<EventoDeportivo> buscarEventosPorFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return eventoDeportivoRepository.findEventosEnRangoFechas(fechaInicio, fechaFin);
    }

    /**
     * Obtiene eventos próximos (próximas 72 horas)
     */
    public List<EventoDeportivo> obtenerEventosProximos() {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime en72Horas = ahora.plusHours(72);
        return eventoDeportivoRepository.findEventosEnRangoFechas(ahora, en72Horas);
    }

    /**
     * Obtiene eventos de hoy
     */
    public List<EventoDeportivo> obtenerEventosDeHoy() {
        LocalDateTime inicioDelDia = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime finDelDia = inicioDelDia.plusDays(1).minusSeconds(1);
        return eventoDeportivoRepository.findEventosEnRangoFechas(inicioDelDia, finDelDia);
    }

    /**
     * Sincroniza eventos de una liga específica para los próximos días
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarEventosProximosCompleto() {
        log.info("Iniciando sincronización completa de eventos próximos");
        
        try {
            List<Liga> ligasActivas = ligaRepository.findByActivaTrue();
            
            for (Liga liga : ligasActivas) {
                // Sincronizar eventos próximos
                sincronizarEventosProximosPorLiga(liga.getSportsDbId()).join();
                
                // Sincronizar eventos de la temporada actual
                String temporadaActual = String.valueOf(LocalDateTime.now().getYear());
                sincronizarEventosPorLiga(liga.getSportsDbId(), temporadaActual).join();
                
                // Pausa para no sobrecargar la API
                Thread.sleep(1000);
            }
            
            log.info("Sincronización completa de eventos próximos finalizada");
        } catch (Exception e) {
            log.error("Error en la sincronización completa de eventos próximos: {}", e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Método para verificar el estado de la API
     */
    public boolean verificarEstadoApi() {
        try {
            String url = baseUrl + "/" + apiKey + "/all_sports.php";
            TheSportDbSportsResponseDto response = makeHttpRequest(url, TheSportDbSportsResponseDto.class);
            return response != null && response.getSports() != null && !response.getSports().isEmpty();
        } catch (Exception e) {
            log.error("Error al verificar el estado de la API: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Sincroniza eventos por fecha específica
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarEventosPorFecha(String ligaId, LocalDateTime fecha) {
        log.info("Sincronizando eventos para liga {} en fecha {}", ligaId, fecha);
        
        try {
            String fechaFormateada = fecha.format(DATE_FORMATTER);
            String url = baseUrl + "/" + apiKey + "/eventsday.php?d=" + fechaFormateada + "&l=" + ligaId;
            
            TheSportDbEventsResponseDto response = makeHttpRequest(url, TheSportDbEventsResponseDto.class);
            
            if (response != null && response.getEvents() != null) {
                for (TheSportDbEventDto eventDto : response.getEvents()) {
                    procesarEvento(eventDto);
                }
                log.info("Sincronización de eventos completada para liga {} fecha {}. Procesados: {}", 
                        ligaId, fechaFormateada, response.getEvents().size());
            }
        } catch (Exception e) {
            log.error("Error al sincronizar eventos para liga {} fecha {}: {}", 
                    ligaId, fecha, e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Sincroniza eventos de la última semana para todas las ligas activas
     */
    @Async
    @Transactional
    public CompletableFuture<Void> sincronizarEventosUltimaSemana() {
        log.info("Iniciando sincronización de eventos de la última semana");
        
        try {
            List<Liga> ligasActivas = ligaRepository.findByActivaTrue();
            LocalDateTime hoy = LocalDateTime.now();
            
            for (Liga liga : ligasActivas) {
                // Sincronizar eventos de los últimos 7 días
                for (int i = 0; i < 7; i++) {
                    LocalDateTime fecha = hoy.minusDays(i);
                    sincronizarEventosPorFecha(liga.getSportsDbId(), fecha).join();
                    Thread.sleep(500); // Pausa entre llamadas
                }
                
                // Pausa más larga entre ligas
                Thread.sleep(1000);
            }
            
            log.info("Sincronización de eventos de la última semana completada");
        } catch (Exception e) {
            log.error("Error en la sincronización de eventos de la última semana: {}", e.getMessage(), e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Método para obtener información de un evento específico por ID
     */
    public EventoDeportivo obtenerEventoPorSportsDbId(String sportsDbId) {
        return eventoDeportivoRepository.findBySportsDbId(sportsDbId).orElse(null);
    }

    /**
     * Método para obtener equipos de una liga específica
     */
    public List<Equipo> obtenerEquiposPorLiga(Long ligaId) {
        return ligaRepository.findById(ligaId)
                .map(liga -> equipoRepository.findByLigaAndActivoTrue(liga))
                .orElse(List.of());
    }

    /**
     * Método para obtener eventos de un equipo específico
     */
    public List<EventoDeportivo> obtenerEventosPorEquipo(Long equipoId) {
        return equipoRepository.findById(equipoId)
                .map(equipo -> eventoDeportivoRepository.findByEquipo(equipo))
                .orElse(List.of());
    }

    /**
     * Limpieza avanzada de datos obsoletos
     */
    @Transactional
    public void limpiezaAvanzadaDatos() {
        log.info("Iniciando limpieza avanzada de datos obsoletos");
        
        try {
            LocalDateTime fechaLimite = LocalDateTime.now().minusYears(3);
            
            // Desactivar eventos muy antiguos
            List<EventoDeportivo> eventosAntiguos = eventoDeportivoRepository.findEventosPasados(fechaLimite);
            int eventosDesactivados = 0;
            
            for (EventoDeportivo evento : eventosAntiguos) {
                if (evento.getFechaEvento() != null && evento.getFechaEvento().isBefore(fechaLimite)) {
                    evento.setActivo(false);
                    eventosDesactivados++;
                    
                    if (eventosDesactivados % 100 == 0) {
                        eventoDeportivoRepository.saveAll(eventosAntiguos.subList(
                            Math.max(0, eventosDesactivados - 100), eventosDesactivados));
                        log.debug("Procesados {} eventos en limpieza", eventosDesactivados);
                    }
                }
            }
            
            if (eventosDesactivados > 0) {
                eventoDeportivoRepository.saveAll(eventosAntiguos);
            }
            
            log.info("Limpieza avanzada completada. Eventos desactivados: {}", eventosDesactivados);
        } catch (Exception e) {
            log.error("Error en la limpieza avanzada de datos: {}", e.getMessage(), e);
        }
    }

    /**
     * Obtiene ligas por país
     */
    public List<Liga> obtenerLigasPorPais(Long paisId) {
        return countryRepository.findById(paisId)
                .map(pais -> ligaRepository.findByPaisAndActivaTrue(pais))
                .orElse(List.of());
    }

    /**
     * Obtiene ligas por deporte y país
     */
    public List<Liga> obtenerLigasPorDeporteYPais(Long deporteId, Long paisId) {
        Optional<Deporte> deporte = deporteRepository.findById(deporteId);
        Optional<Country> pais = countryRepository.findById(paisId);
        
        if (deporte.isPresent() && pais.isPresent()) {
            return ligaRepository.findByDeporteAndPaisAndActivaTrue(deporte.get(), pais.get());
        }
        return List.of();
    }

    /**
     * Busca países por nombre
     */
    public List<Country> buscarPaisesPorNombre(String nombre) {
        return countryRepository.findByNombreContaining(nombre);
    }

    /**
     * Verifica si una liga ya está actualizada comparando datos clave
     */
    private boolean estaLigaActualizada(Liga ligaExistente, TheSportDbLeagueDto leagueDto) {
        // Comparar campos clave para determinar si necesita actualización
        return Objects.equals(ligaExistente.getNombre(), leagueDto.getStrLeague()) &&
               Objects.equals(ligaExistente.getNombreAlternativo(), leagueDto.getStrLeagueAlternate()) &&
               Objects.equals(ligaExistente.getLogoUrl(), leagueDto.getStrLogo()) &&
               Objects.equals(ligaExistente.getBadgeUrl(), leagueDto.getStrBadge()) &&
               Objects.equals(ligaExistente.getSitioWeb(), leagueDto.getStrWebsite()) &&
               Objects.equals(ligaExistente.getPaisNombre(), leagueDto.getStrCountry()) &&
               ligaExistente.getDeporte() != null &&
               Objects.equals(ligaExistente.getDeporte().getNombreIngles(), leagueDto.getStrSport());
    }
}
