package com._bet.service;

import com._bet.config.TheSportsDbV2Properties;
import com._bet.dto.thesportsdb.v2.AllLeaguesResponse;
import com._bet.dto.thesportsdb.v2.ProximosEventosDto;
import com._bet.dto.thesportsdb.v2.ResponseLookupLeague;
import com._bet.dto.thesportsdb.v2.ResponseTeamDto;
import com._bet.dto.thesportsdb.v2.ResponseTeamsByLeague;
import com._bet.dto.thesportsdb.v2.TheSportsDbV2LiveEventDto;
import com._bet.dto.thesportsdb.v2.TheSportsDbV2LiveEventsResponseDto;
import com._bet.dto.thesportsdb.TheSportDbEventDto;
import com._bet.dto.thesportsdb.TheSportDbLeagueDto;
import com._bet.entity.EventoDeportivo;
import com._bet.entity.Liga;
import com._bet.entity.Equipo;
import com._bet.entity.Deporte;
import com._bet.repository.EventoDeportivoRepository;
import com._bet.repository.LigaRepository;
import com._bet.repository.EquipoRepository;
import com._bet.repository.CountryRepository;
import com._bet.repository.DeporteRepository;
import com._bet.service.theSportsDb.TheSportsDbService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

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
    private final DeporteRepository deporteRepository;
    private final TheSportsDbService theSportsDbService;
    private final CountryRepository countryRepository;

    private static final List<String> whiteListDeportes = List.of("Soccer", "Motorsport", "Baseball", "Basketball",
            "American Football", "Ice Hockey", "Golf", "Tennis", "Australian Football", "ESports", "Table Tennis",
            "Badminton");

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Obtiene eventos en vivo usando la API v2 con autenticación por header
     */
    public TheSportsDbV2LiveEventsResponseDto obtenerEventosEnVivo() {
        log.info("Obteniendo eventos en vivo desde TheSportsDB API v2");

        try {
            String url = properties.getV2().getBaseUrl() + "/livescore/all";

            HttpHeaders headers = crearHeadersConAutenticacion();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<TheSportsDbV2LiveEventsResponseDto> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    TheSportsDbV2LiveEventsResponseDto.class);

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
     * Obtiene eventos próximos para una liga específica
     */
    @Async
    public CompletableFuture<ProximosEventosDto> sincronizarEventosProximosPorLiga(String idLiga) {
        log.info("Obteniendo eventos próximos para liga: {}", idLiga);

        try {
            String url = properties.getV2().getBaseUrl() + "/schedule/next/league/" + idLiga;

            HttpHeaders headers = crearHeadersConAutenticacion();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<ProximosEventosDto> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    ProximosEventosDto.class);

            ProximosEventosDto resultado = response.getBody();
            if (resultado != null && resultado.getEvents() != null) {
                log.info("Obtenidos {} eventos próximos para liga {}", resultado.getEvents().size(), idLiga);
                return CompletableFuture.completedFuture(resultado);
            }

            log.warn("No se obtuvieron eventos próximos para la liga: {}", idLiga);
            return CompletableFuture.completedFuture(new ProximosEventosDto());

        } catch (Exception e) {
            log.error("Error al obtener eventos próximos por liga {}: {}", idLiga, e.getMessage());
            return CompletableFuture.completedFuture(new ProximosEventosDto());
        }
    }

    /**
     * Sincronización de datos maestros (deportes, ligas, equipos)
     */
    public void sincronizacionDatosMaestros() {
        log.info("Iniciando sincronización de datos maestros");

        try {
            // 1. Sincronizar países primero
            // sincronizarPaises();
            Thread.sleep(1000);

            // 2. Sincronizar deportes
            // sincronizarDeportes().join();

            //obtenerLigasConDatosFaltantes().join();
            Thread.sleep(1000);

            //obtenerEquiposPorLigas();

            log.info("Sincronización de datos maestros completada");
        } catch (Exception e) {
            log.error("Error en la sincronización de datos maestros: {}", e.getMessage(), e);
        }
    }

    /**
     * Sincroniza eventos de los próximos días desde hoy para todas las ligas
     * activas
     * Esta es la función optimizada que solo obtiene eventos recientes y próximos
     * Limitado a 100 peticiones por minuto según límites de la API
     */
    @Async
    public CompletableFuture<Void> sincronizarEventosProximosDias() {
        log.info("Iniciando sincronización de eventos de los próximos días");

        try {
            List<Liga> ligasActivas = ligaRepository.findByActivaTrue();
            int totalEventosProcesados = 0;
            int peticionesRealizadas = 0;
            final int MAX_PETICIONES_POR_MINUTO = 100;
            final long TIEMPO_MINUTO_MS = 60000; // 60 segundos en milisegundos
            long inicioMinuto = System.currentTimeMillis();

            log.info("Procesando {} ligas activas con límite de {} peticiones por minuto",
                    ligasActivas.size(), MAX_PETICIONES_POR_MINUTO);

            for (Liga liga : ligasActivas) {
                try {
                    // Verificar si hemos alcanzado el límite de peticiones por minuto
                    long tiempoTranscurrido = System.currentTimeMillis() - inicioMinuto;

                    if (peticionesRealizadas >= MAX_PETICIONES_POR_MINUTO && tiempoTranscurrido < TIEMPO_MINUTO_MS) {
                        long tiempoEspera = TIEMPO_MINUTO_MS - tiempoTranscurrido;
                        log.info("Límite de {} peticiones por minuto alcanzado. Esperando {} ms antes de continuar...",
                                MAX_PETICIONES_POR_MINUTO, tiempoEspera);
                        Thread.sleep(tiempoEspera);

                        // Reiniciar contador y tiempo
                        peticionesRealizadas = 0;
                        inicioMinuto = System.currentTimeMillis();
                    }

                    // Obtener eventos próximos para la liga
                    ProximosEventosDto eventosProximos = sincronizarEventosProximosPorLiga(
                            liga.getSportsDbId()).join();

                    peticionesRealizadas++; // Incrementar contador de peticiones
                    log.debug("Petición {} de {} realizada para liga: {}",
                            peticionesRealizadas, MAX_PETICIONES_POR_MINUTO, liga.getNombre());

                    // Procesar y guardar los eventos obtenidos
                    if (eventosProximos != null && eventosProximos.getEvents() != null
                            && !eventosProximos.getEvents().isEmpty()) {

                        // Filtrar eventos por deportes en la whitelist
                        List<TheSportsDbV2LiveEventDto> eventosFiltrados = eventosProximos.getEvents().stream()
                                .filter(evento -> evento.getStrSport() != null &&
                                        whiteListDeportes.contains(evento.getStrSport().trim()))
                                .toList();

                        log.info("Eventos filtrados por whitelist para liga {}: {} de {} eventos totales",
                                liga.getNombre(), eventosFiltrados.size(), eventosProximos.getEvents().size());

                        // Procesar cada evento filtrado
                        for (TheSportsDbV2LiveEventDto eventoDto : eventosFiltrados) {
                            try {
                                procesarEventoEnVivo(eventoDto);
                                totalEventosProcesados++;
                            } catch (Exception e) {
                                log.error("Error al procesar evento próximo {} de liga {}: {}",
                                        eventoDto.getIdEvent(), liga.getNombre(), e.getMessage());
                            }
                        }

                        log.info("Procesados {} eventos próximos para liga: {} ({})",
                                eventosFiltrados.size(), liga.getNombre(), liga.getSportsDbId());
                    } else {
                        log.info("No se encontraron eventos próximos para liga: {} ({})",
                                liga.getNombre(), liga.getSportsDbId());
                    }

                    // Pausa mínima entre llamadas (600ms = 100 peticiones/minuto máximo)
                    Thread.sleep(600);

                } catch (Exception e) {
                    log.error("Error sincronizando eventos próximos días para liga {}: {}",
                            liga.getNombre(), e.getMessage(), e);
                }
            }

            log.info("Sincronización de eventos de los próximos días completada. " +
                    "Total eventos procesados: {}, Total peticiones realizadas: {}",
                    totalEventosProcesados, peticionesRealizadas);
        } catch (Exception e) {
            log.error("Error en la sincronización de eventos de los próximos días: {}", e.getMessage(), e);
        }

        return CompletableFuture.completedFuture(null);
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
                    TheSportsDbV2LiveEventsResponseDto.class);

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
     * Obtener ligas de la v2 con datos faltantes
     */
    @Async
    public CompletableFuture<List<TheSportDbLeagueDto>> obtenerLigasV2ConDatosFaltantes() {
        log.info("Obteniendo ligas de la v2 con datos faltantes");
        String url = properties.getV2().getBaseUrl() + "/all/leagues";

        try {
            HttpHeaders headers = crearHeadersConAutenticacion();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<AllLeaguesResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    AllLeaguesResponse.class);

            List<TheSportDbLeagueDto> ligasArray = response.getBody().getLeagues();
            if (ligasArray != null) {
                List<TheSportDbLeagueDto> ligas = ligasArray;
                log.info("Obtenidas {} ligas desde API v2", ligas.size());
                return CompletableFuture.completedFuture(ligas);
            } else {
                log.warn("No se obtuvieron ligas desde la API v2");
                return CompletableFuture.completedFuture(List.of());
            }

        } catch (Exception e) {
            log.error("Error al obtener ligas desde API v2: {}", e.getMessage());
            return CompletableFuture.completedFuture(List.of());
        }
    }

    /**
     * Obtener los equipos por liga
     */
    @Async
    @Transactional
    public CompletableFuture<Void> obtenerEquiposPorLigas() {
        log.info("Obteniendo equipos por ligas desde API v2");

        try {
            List<Liga> ligas = ligaRepository.findAll();
            int totalEquiposProcesados = 0;
            int peticionesRealizadas = 0;
            final int MAX_PETICIONES_POR_MINUTO = 100;
            final long TIEMPO_MINUTO_MS = 60000; // 60 segundos en milisegundos
            long inicioMinuto = System.currentTimeMillis();

            log.info("Procesando {} ligas con límite de {} peticiones por minuto",
                    ligas.size(), MAX_PETICIONES_POR_MINUTO);

            for (Liga liga : ligas) {
                try {
                    // Verificar si hemos alcanzado el límite de peticiones por minuto
                    long tiempoTranscurrido = System.currentTimeMillis() - inicioMinuto;

                    if (peticionesRealizadas >= MAX_PETICIONES_POR_MINUTO && tiempoTranscurrido < TIEMPO_MINUTO_MS) {
                        long tiempoEspera = TIEMPO_MINUTO_MS - tiempoTranscurrido;
                        log.info("Límite de {} peticiones por minuto alcanzado. Esperando {} ms antes de continuar...",
                                MAX_PETICIONES_POR_MINUTO, tiempoEspera);
                        Thread.sleep(tiempoEspera);

                        // Reiniciar contador y tiempo
                        peticionesRealizadas = 0;
                        inicioMinuto = System.currentTimeMillis();
                    }

                    String url = properties.getV2().getBaseUrl() + "/list/teams/" + liga.getSportsDbId();

                    HttpHeaders headers = crearHeadersConAutenticacion();
                    HttpEntity<String> entity = new HttpEntity<>(headers);

                    ResponseEntity<ResponseTeamsByLeague> response = restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            entity,
                            ResponseTeamsByLeague.class
                    );

                    peticionesRealizadas++; // Incrementar contador de peticiones
                    log.debug("Petición {} de {} realizada para liga: {}",
                            peticionesRealizadas, MAX_PETICIONES_POR_MINUTO, liga.getNombre());

                    List<ResponseTeamDto> equiposDto = response.getBody().getTeams();

                    for (ResponseTeamDto equipoDto : equiposDto) {
                        try {
                            Optional<Equipo> equipoExistente = equipoRepository
                                    .findBySportsDbId(equipoDto.getIdTeam());

                            if (equipoExistente.isEmpty()) {
                                // Equipo no existe, crear nuevo
                                Equipo nuevoEquipo = Equipo.builder()
                                        .sportsDbId(equipoDto.getIdTeam())
                                        .nombre(equipoDto.getStrTeam() != null ? equipoDto.getStrTeam().trim()
                                                : "Equipo " + equipoDto.getIdTeam())
                                        .nombreCorto(equipoDto.getStrTeamShort())
                                        .colores(equipoDto.getStrColour1())
                                        .liga(liga)
                                        .pais(equipoDto.getStrCountry())
                                        .logoUrl(equipoDto.getStrBadge())
                                        .bannerUrl(equipoDto.getStrBanner())
                                        .fanartUrl(equipoDto.getStrFanart1())
                                        .fechaCreacion(LocalDateTime.now())
                                        .fechaActualizacion(LocalDateTime.now())
                                        .build();

                                equipoRepository.save(nuevoEquipo);
                                totalEquiposProcesados++;
                                log.debug("Nuevo equipo creado: {} ({})", nuevoEquipo.getNombre(),
                                        nuevoEquipo.getSportsDbId());
                            }
                        } catch (Exception e) {
                            log.error("Error al procesar equipo {} de liga {}: {}",
                                    equipoDto.getIdTeam(), liga.getNombre(), e.getMessage());
                        }
                    }

                } catch (Exception e) {
                    log.error("Error obteniendo equipos para liga {}: {}", liga.getNombre(), e.getMessage());
                }
            }
            log.info(
                    "Obtención de equipos por ligas completada. Total equipos procesados: {}, Total peticiones realizadas: {}",
                    totalEquiposProcesados, peticionesRealizadas);
        } catch (Exception e) {
            log.error("Error al obtener equipos por ligas desde API v2: {}", e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Obtiene todas las ligas con datos faltantes con un deporte en string
     */
    @Async
    @Transactional
    public CompletableFuture<Void> obtenerLigasConDatosFaltantes() {
        log.info("Obteniendo ligas con datos faltantes desde API v2");

        try {
            List<TheSportDbLeagueDto> ligasV2 = obtenerLigasV2ConDatosFaltantes().join();

            // Filtrar ligas por deportes en la whitelist
            List<TheSportDbLeagueDto> ligasFiltradas = ligasV2.stream()
                    .filter(liga -> liga.getStrSport() != null &&
                            whiteListDeportes.contains(liga.getStrSport().trim()))
                    .toList();

            log.info("Ligas filtradas por whitelist: {} de {} ligas totales",
                    ligasFiltradas.size(), ligasV2.size());

            List<Liga> ligasActualizadas = completarDatosLigas(ligasFiltradas);
            log.info("Se actualizaron {} ligas con datos faltantes", ligasActualizadas.size());

        } catch (Exception e) {
            log.error("Error al obtener ligas con datos faltantes desde API v2: {}", e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }

    /**
     * Completa los datos de las ligas utilizando la API v2
     * Limitado a 100 peticiones por minuto según límites de la API
     * 
     * @return Lista de ligas con datos actualizados
     */
    private List<Liga> completarDatosLigas(List<TheSportDbLeagueDto> ligas) {
        int peticionesRealizadas = 0;
        final int MAX_PETICIONES_POR_MINUTO = 100;
        final long TIEMPO_MINUTO_MS = 60000; // 60 segundos en milisegundos
        long inicioMinuto = System.currentTimeMillis();
        List<Liga> ligasActualizadas = new ArrayList<>();

        log.info("Completando datos para {} ligas con límite de {} peticiones por minuto",
                ligas.size(), MAX_PETICIONES_POR_MINUTO);

        for (TheSportDbLeagueDto ligaDto : ligas) {
            if (ligaDto.getIdLeague() == null || ligaDto.getIdLeague().trim().isEmpty()) {
                continue; // Omitir ligas sin ID válido
            }

            try {
                // Verificar si hemos alcanzado el límite de peticiones por minuto
                long tiempoTranscurrido = System.currentTimeMillis() - inicioMinuto;

                if (peticionesRealizadas >= MAX_PETICIONES_POR_MINUTO && tiempoTranscurrido < TIEMPO_MINUTO_MS) {
                    long tiempoEspera = TIEMPO_MINUTO_MS - tiempoTranscurrido;
                    log.info(
                            "Límite de {} peticiones por minuto alcanzado completando datos de ligas. Esperando {} ms antes de continuar...",
                            MAX_PETICIONES_POR_MINUTO, tiempoEspera);
                    Thread.sleep(tiempoEspera);

                    // Reiniciar contador y tiempo
                    peticionesRealizadas = 0;
                    inicioMinuto = System.currentTimeMillis();
                }

                String url = properties.getV2().getBaseUrl() + "/lookup/league/" + ligaDto.getIdLeague();

                HttpHeaders headers = crearHeadersConAutenticacion();
                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<ResponseLookupLeague> response = restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        ResponseLookupLeague.class);

                peticionesRealizadas++; // Incrementar contador de peticiones
                log.debug("Petición {} de {} realizada para completar datos de liga: {}",
                        peticionesRealizadas, MAX_PETICIONES_POR_MINUTO, ligaDto.getIdLeague());

                List<TheSportDbLeagueDto> resultado = response.getBody().getLeague();
                if (resultado != null && !resultado.isEmpty()) {
                    TheSportDbLeagueDto ligaCompleta = resultado.get(0);

                    Optional<Liga> ligaExistente = ligaRepository.findBySportsDbId(ligaDto.getIdLeague());

                    if (ligaExistente.isEmpty()) {
                        // Liga no encontrada, crear nueva liga con los datos obtenidos
                        log.info("Liga no encontrada en BD, creando nueva liga: {}", ligaDto.getIdLeague());

                        // Buscar el deporte
                        Optional<Deporte> deporteExistente = deporteRepository
                                .findByNombreIngles(ligaCompleta.getStrSport());

                        if (deporteExistente.isPresent()) {
                            Liga nuevaLiga = Liga.builder()
                                    .sportsDbId(ligaDto.getIdLeague())
                                    .nombre(ligaCompleta.getStrLeague() != null ? ligaCompleta.getStrLeague().trim()
                                            : "Liga " + ligaDto.getIdLeague())
                                    .nombreAlternativo(ligaCompleta.getStrLeagueAlternate())
                                    .descripcion(ligaCompleta.getStrDescriptionEN())
                                    .paisNombre(ligaCompleta.getStrCountry())
                                    .deporte(deporteExistente.get())
                                    .activa(true)
                                    .fechaCreacion(LocalDateTime.now())
                                    .fechaActualizacion(LocalDateTime.now())
                                    .build();

                            // Buscar y asignar país si existe
                            if (ligaCompleta.getStrCountry() != null) {
                                countryRepository.findByName(ligaCompleta.getStrCountry())
                                        .ifPresent(nuevaLiga::setPais);
                            }

                            Liga ligaGuardada = ligaRepository.save(nuevaLiga);
                            ligasActualizadas.add(ligaGuardada);

                            log.debug("Nueva liga creada: {}", ligaGuardada.getSportsDbId());
                        } else {
                            log.warn("Deporte '{}' no encontrado para la liga {}, omitiendo",
                                    ligaCompleta.getStrSport(), ligaDto.getIdLeague());
                        }
                    } else {
                        // Liga existente, solo completar datos faltantes
                        Liga liga = ligaExistente.get();
                        boolean actualizado = false;

                        if (liga.getPaisNombre() == null || liga.getPaisNombre().trim().isEmpty()) {
                            liga.setPaisNombre(ligaCompleta.getStrCountry());
                            actualizado = true;

                            if (ligaCompleta.getStrCountry() != null) {
                                countryRepository.findByName(ligaCompleta.getStrCountry())
                                        .ifPresent(liga::setPais);
                            }
                        }

                        if (actualizado) {
                            liga.setFechaActualizacion(LocalDateTime.now());
                            Liga ligaActualizada = ligaRepository.save(liga);
                            ligasActualizadas.add(ligaActualizada);
                            log.debug("Datos completados para liga existente: {}", liga.getSportsDbId());
                        }
                    }
                } else {
                    log.warn("No se obtuvieron datos completos para liga: {}", ligaDto.getIdLeague());
                }

                // Pausa mínima entre llamadas (600ms = 100 peticiones/minuto máximo)
                Thread.sleep(600);

            } catch (Exception e) {
                log.error("Error al completar datos para liga {}: {}", ligaDto.getIdLeague(), e.getMessage());
            }
        }

        log.info("Completado el proceso de datos para ligas. Total peticiones realizadas: {}", peticionesRealizadas);
        return ligasActualizadas;
    }

    /**
     * Sincroniza eventos en vivo con la base de datos
     */
    public void sincronizarEventosEnVivo() {
        log.info("Iniciando sincronización de eventos en vivo");

        try {
            TheSportsDbV2LiveEventsResponseDto eventosEnVivo = obtenerEventosEnVivo();

            // Filtrar eventos por deportes en la whitelist
            if (eventosEnVivo.getEvents() != null) {
                List<TheSportsDbV2LiveEventDto> eventosFiltrados = eventosEnVivo.getEvents().stream()
                        .filter(evento -> evento.getStrSport() != null &&
                                whiteListDeportes.contains(evento.getStrSport().trim()))
                        .toList();

                log.info("Eventos filtrados por whitelist: {} de {} eventos totales",
                        eventosFiltrados.size(), eventosEnVivo.getEvents().size());

                eventosEnVivo.setEvents(eventosFiltrados);
            }

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
     * Sincroniza los proximos eventos de las ligas activas
     */
    public void sincronizarProximosEventos() {
        log.info("Iniciando sincronización de próximos eventos para ligas activas");

        try {
            List<Liga> ligasActivas = ligaRepository.findAll();

            for (Liga liga : ligasActivas) {
                try {
                    TheSportsDbV2LiveEventsResponseDto eventosProximos = obtenerEventosEnVivoPorLiga(
                            liga.getSportsDbId());

                    if (eventosProximos.getEvents() != null && !eventosProximos.getEvents().isEmpty()) {
                        for (TheSportsDbV2LiveEventDto eventoDto : eventosProximos.getEvents()) {
                            try {
                                procesarEventoEnVivo(eventoDto);
                            } catch (Exception e) {
                                log.error("Error al procesar próximo evento {}: {}", eventoDto.getIdEvent(),
                                        e.getMessage());
                            }
                        }
                        log.info("Sincronización de próximos eventos completada para liga {}", liga.getNombre());
                    } else {
                        log.info("No hay próximos eventos para la liga {}", liga.getNombre());
                    }

                    // Pausa entre llamadas para evitar rate limiting
                    Thread.sleep(500);

                } catch (Exception e) {
                    log.error("Error al sincronizar próximos eventos para liga {}: {}", liga.getNombre(),
                            e.getMessage());
                }
            }

        } catch (Exception e) {
            log.error("Error en la sincronización de próximos eventos", e);
        }
    }

    /**
     * Procesa un evento individual en vivo y actualiza la base de datos
     * Solo procesa el evento si el deporte existe en la base de datos
     */
    @Transactional
    private void procesarEventoEnVivo(TheSportsDbV2LiveEventDto eventoDto) {
        if (eventoDto.getIdEvent() == null || eventoDto.getIdEvent().trim().isEmpty()) {
            log.warn("Evento sin ID válido, omitiendo");
            return;
        }

        // Verificar que el deporte existe en la base de datos
        if (!validarDeporteExiste(eventoDto)) {
            log.warn("Deporte '{}' no encontrado en la base de datos. Omitiendo evento: {}",
                    eventoDto.getStrSport(), eventoDto.getIdEvent());
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
     * Si el evento no existe, obtiene los detalles completos desde la API v1
     */
    @Transactional
    private void crearEventoDesdeEventoEnVivo(TheSportsDbV2LiveEventDto eventoDto) {
        try {
            log.info("Evento no encontrado en BD, obteniendo detalles completos desde API v2 para evento: {}",
                    eventoDto.getIdEvent());

            // Obtener detalles completos del evento desde la API v2
            crearEventoBasicoDesdeV2(eventoDto);

        } catch (Exception e) {
            log.error("Error al crear evento desde datos en vivo {}: {}", eventoDto.getIdEvent(), e.getMessage());
        }
    }

    /**
     * Crea un evento básico con solo los datos disponibles en V2 (método de
     * fallback)
     */
    @Transactional
    private void crearEventoBasicoDesdeV2(TheSportsDbV2LiveEventDto eventoDto) {
        try {
            // Validar que existe el ID de liga
            if (eventoDto.getIdLeague() == null || eventoDto.getIdLeague().trim().isEmpty()) {
                log.warn("Evento {} sin ID de liga válido, omitiendo", eventoDto.getIdEvent());
                return;
            }

            // Crear nombre del evento con fallback si strEvent está vacío
            String nombreEvento = eventoDto.getStrEvent();
            if (nombreEvento == null || nombreEvento.trim().isEmpty()) {
                // Si no hay nombre específico, crear uno usando los equipos
                String equipoLocal = eventoDto.getStrHomeTeam();
                String equipoVisitante = eventoDto.getStrAwayTeam();
                if (equipoLocal != null && equipoVisitante != null) {
                    nombreEvento = equipoLocal + " vs " + equipoVisitante;
                } else {
                    nombreEvento = "Evento ID: " + eventoDto.getIdEvent();
                }
            }

            // Buscar la liga de forma segura
            Optional<Liga> ligaOpt = ligaRepository.findBySportsDbId(eventoDto.getIdLeague());
            if (ligaOpt.isEmpty()) {
                log.warn("Liga {} no encontrada en BD para evento {}. Omitiendo evento.",
                        eventoDto.getIdLeague(), eventoDto.getIdEvent());
                return;
            }

            Liga liga = ligaOpt.get();

            // Obtener nombre del país de forma segura evitando lazy loading
            String nombrePais = null;
            try {
                if (liga.getPais() != null) {
                    nombrePais = liga.getPais().getName();
                } else if (liga.getPaisNombre() != null) {
                    nombrePais = liga.getPaisNombre();
                }
            } catch (Exception e) {
                log.debug("Error accediendo al país de la liga {}: {}. Usando paisNombre como fallback.",
                        liga.getSportsDbId(), e.getMessage());
                nombrePais = liga.getPaisNombre();
            }

            EventoDeportivo evento = EventoDeportivo.builder()
                    .sportsDbId(eventoDto.getIdEvent())
                    .nombre(nombreEvento)
                    .liga(liga)
                    .pais(nombrePais)
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

            // Buscar y asignar equipos
            if (eventoDto.getIdHomeTeam() != null) {
                equipoRepository.findBySportsDbId(eventoDto.getIdHomeTeam())
                        .ifPresent(evento::setEquipoLocal);
            }

            if (eventoDto.getIdAwayTeam() != null) {
                equipoRepository.findBySportsDbId(eventoDto.getIdAwayTeam())
                        .ifPresent(evento::setEquipoVisitante);
            }

            // Validar campos obligatorios antes del guardado
            if (evento.getSportsDbId() == null || evento.getNombre() == null) {
                log.error("Evento con datos incompletos no puede ser guardado. SportsDbId: {}, Nombre: {}",
                        evento.getSportsDbId(), evento.getNombre());
                return;
            }

            try {
                EventoDeportivo eventoGuardado = eventoDeportivoRepository.saveAndFlush(evento);

                if (eventoGuardado != null && eventoGuardado.getId() != null) {
                    log.info("Nuevo evento básico en vivo creado exitosamente - ID: {}, SportsDbId: {}",
                            eventoGuardado.getId(), eventoGuardado.getSportsDbId());
                } else {
                    log.error("ERROR: El repositorio devolvió null o sin ID al guardar evento {}",
                            eventoDto.getIdEvent());
                }

            } catch (Exception saveException) {
                log.error("Excepción al guardar evento {} en base de datos: {}",
                        eventoDto.getIdEvent(), saveException.getMessage(), saveException);
                throw saveException; // Re-lanzar para que se maneje en niveles superiores
            }

        } catch (Exception e) {
            log.error("Error al crear evento básico desde V2 para evento {}: {}", eventoDto.getIdEvent(),
                    e.getMessage(), e);
            throw e; // Re-lanzar para manejo en niveles superiores
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
                    TheSportsDbV2LiveEventsResponseDto.class);

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

    /**
     * Valida que el deporte del evento existe en la base de datos
     * 
     * @param eventoDto El evento a validar
     * @return true si el deporte existe, false si no
     */
    private boolean validarDeporteExiste(TheSportsDbV2LiveEventDto eventoDto) {
        if (eventoDto.getStrSport() == null || eventoDto.getStrSport().trim().isEmpty()) {
            log.warn("Evento {} sin nombre de deporte, omitiendo", eventoDto.getIdEvent());
            return false;
        }

        String nombreDeporte = eventoDto.getStrSport().trim();

        // Buscar el deporte por nombre (case insensitive)
        Optional<Deporte> deporte = deporteRepository.findByNombreIgnoreCase(nombreDeporte);

        if (deporte.isPresent()) {
            log.debug("Deporte '{}' encontrado en BD para evento {}", nombreDeporte, eventoDto.getIdEvent());
            return true;
        }

        // Intentar buscar por nombre en inglés si no se encuentra
        Optional<Deporte> deporteIngles = deporteRepository.findByNombreInglesIgnoreCase(nombreDeporte);

        if (deporteIngles.isPresent()) {
            log.debug("Deporte '{}' encontrado en BD por nombre en inglés para evento {}", nombreDeporte,
                    eventoDto.getIdEvent());
            return true;
        }

        log.info(
                "Deporte '{}' no encontrado en la base de datos para evento {}. Deportes disponibles pueden consultarse en el log de debug.",
                nombreDeporte, eventoDto.getIdEvent());

        return false;
    }
}
