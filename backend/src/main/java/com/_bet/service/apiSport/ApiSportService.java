package com._bet.service.apiSport;

import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com._bet.dto.apiSports.entidades.Season;
import com._bet.dto.apiSports.entidades.Odds.Bet;
import com._bet.dto.apiSports.entidades.Odds.Value;
import com._bet.dto.apiSports.response.EventsByLeagueResponse;
import com._bet.dto.apiSports.response.LeagueBySeasonResponse;
import com._bet.dto.apiSports.response.OddsResponse;
import com._bet.dto.apiSports.response.Response;
import com._bet.dto.apiSports.response.TeamByLeagueResponse;
import com._bet.entity.datosMaestros.Deporte;
import com._bet.entity.datosMaestros.Equipo;
import com._bet.entity.datosMaestros.Liga;
import com._bet.entity.eventoEntity.Estado;
import com._bet.entity.eventoEntity.EventoDeportivo;
import com._bet.entity.eventoEntity.Goles;
import com._bet.entity.eventoEntity.Momio;
import com._bet.entity.eventoEntity.Score;
import com._bet.entity.eventoEntity.Valor;
import com._bet.repository.CountryRepository;
import com._bet.repository.DeporteRepository;
import com._bet.repository.EquipoRepository;
import com._bet.repository.EventoDeportivoRepository;
import com._bet.repository.LigaRepository;
import com._bet.repository.MomioRepository;

import org.springframework.http.HttpMethod;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.core.ParameterizedTypeReference;

import lombok.RequiredArgsConstructor;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class ApiSportService {

    private final String API_KEY = "50a0c0944d32698112f06a42b3b3248e";
    private final String currentDate = java.time.LocalDate.now().toString();
    private final RestTemplate restTemplate;
    private final CountryRepository countryRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;
    private final DeporteRepository deporteRepository;
    private final LigaRepository ligaRepository;
    private final EquipoRepository equipoRepository;
    private final MomioRepository momioRepository;

    public static final Map<String, String> URLS_POR_DEPORTE = Map.ofEntries(
            Map.entry("Soccer", "https://v3.football.api-sports.io"),
            Map.entry("Basketball", "https://v1.basketball.api-sports.io"),
            Map.entry("Baseball", "https://v1.baseball.api-sports.io"),
            Map.entry("Formula1", "https://v1.formula-1.api-sports.io"),
            Map.entry("Hockey", "https://v1.hockey.api-sports.io"),
            Map.entry("Mma", "https://v1.mma.api-sports.io"),
            Map.entry("NBA", "https://v2.nba.api-sports.io"),
            Map.entry("American_Football", "https://v1.american-football.api-sports.io"),
            Map.entry("Rugby", "https://v1.rugby.api-sports.io"),
            Map.entry("Volleyball", "https://v1.volleyball.api-sports.io"));
    /**
     * Metodo get base para consumir la API de ApiSport
     * 
     * @return Response<LeagueBySeasonResponse>
     */
    public <T> Response<T> getFromSportApi(String url, ParameterizedTypeReference<Response<T>> typeRef) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String headerName = "x-apisports-key";
        String apiKey = API_KEY;
        headers.set(headerName, apiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Response<T>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                typeRef);

        Response<T> resultado = response.getBody();
        return resultado;
    }

    /**
     * Metodo para obtener ligas, Pises,Equipos y eventos por temporada
     */
    @Async
    @Transactional
    public CompletableFuture<Integer> getLeaguesBySeason(String deporte) {
        String deporteKey = (deporte == null || deporte.isBlank()) ? "Soccer" : deporte;

        int season = java.time.Year.now().getValue()+1;
        String url = URLS_POR_DEPORTE.get(deporteKey) + "/leagues?season=" + season + "&current=true";
        Response<LeagueBySeasonResponse> response = getFromSportApi(
                url,
                new ParameterizedTypeReference<Response<LeagueBySeasonResponse>>() {
                });

        Response<LeagueBySeasonResponse> filteredResponse = new Response<LeagueBySeasonResponse>();

        filteredResponse.setResponse(
                response.getResponse().stream()
                        .filter(leagueBySeason -> {
                            List<Season> seasons = leagueBySeason.getSeasons();
                            if (seasons == null || seasons.isEmpty()) {
                                return false; // o true según tu lógica
                            }
                            String endDate = seasons.get(0).getEnd();
                            if (endDate == null) {
                                return false;
                            }
                            Boolean isActual = endDate.compareTo(currentDate) >= 0;
                            return isActual;
                        })
                        .collect(java.util.stream.Collectors.toList()));

        response = filteredResponse;

        int ligasGuardadas = saveLeagues(response.getResponse());
        
        return CompletableFuture.completedFuture(ligasGuardadas);
    }

    private int saveLeagues(List<LeagueBySeasonResponse> leagues) {
        int ligasGuardadas = 0;
        
        for (LeagueBySeasonResponse league : leagues) {
            if (ligaRepository.existsByApiSportsId(league.getLeague().getId())) {
                continue;
            }

            Deporte deporte = deporteRepository.findByNombre("Soccer")
                    .orElseThrow(() -> new RuntimeException(
                            "Deporte no encontrado: " + league.getLeague().getType()));

            Liga newLiga = Liga.builder()
                    .apiSportsId(league.getLeague().getId())
                    .nombre(league.getLeague().getName())
                    .paisNombre(league.getCountry().getName())
                    .logoUrl(league.getLeague().getLogo())
                    .temporada(league.getSeasons().get(0).getYear())
                    .activa(true)
                    .deporte(deporte)
                    .build();

            com._bet.entity.datosMaestros.Country country = countryRepository.findByName(league.getCountry().getName())
                    .orElseGet(() -> {
                        com._bet.entity.datosMaestros.Country newCountry = com._bet.entity.datosMaestros.Country
                                .builder()
                                .name(league.getCountry().getName())
                                .countryCode(league.getCountry().getCode())
                                .flagUrl(league.getCountry().getFlag())
                                .build();
                        return countryRepository.save(newCountry);
                    });

            newLiga.setPais(country);
            ligaRepository.save(newLiga);
            ligasGuardadas++;
        }
        
        return ligasGuardadas;
    }

    /*
     * Metodo para obtener equipos por liga
     */
    @Async
    @Transactional
    public CompletableFuture<Integer> getTeamsByLeague(String deporte) {
        String deporteKey = (deporte == null || deporte.isBlank()) ? "SOCCER" : deporte.toUpperCase();
        int season = java.time.Year.now().getValue();
        List<Liga> activeLeagues = ligaRepository.findByDeporteNombreAndActivaTrue(deporteKey);

        int totalEquiposGuardados = 0;
        
        for (Liga league : activeLeagues) {
            Integer leagueId = league.getApiSportsId();

            String url = URLS_POR_DEPORTE.get(deporteKey) + "/teams?league=" + leagueId + "&season=" + season;
            Response<TeamByLeagueResponse> response = getFromSportApi(url,
                    new ParameterizedTypeReference<Response<TeamByLeagueResponse>>() {
                    });

            totalEquiposGuardados += saveTeams(response, leagueId);

        }
        
        return CompletableFuture.completedFuture(totalEquiposGuardados);
    }

    private int saveTeams(Response<TeamByLeagueResponse> response, int leagueId) {
        int equiposGuardados = 0;
        
        for (TeamByLeagueResponse teamByLeague : response.getResponse()) {
            if (equipoRepository.existsByApiSportsId(teamByLeague.getTeam().getId())) {
                continue;
            }

            if (!ligaRepository.existsByApiSportsId(leagueId)) {
                continue;
            }

            Liga liga = ligaRepository.findByApiSportsId(leagueId)
                    .orElseThrow(() -> new RuntimeException("Liga no encontrada con ID: " + leagueId));

            Equipo newTeam = Equipo.builder()
                    .apiSportsId(teamByLeague.getTeam().getId())
                    .nombre(teamByLeague.getTeam().getName())
                    .logoUrl(teamByLeague.getTeam().getLogo())
                    .code(teamByLeague.getTeam().getCode())
                    .liga(liga)
                    .build();

            equipoRepository.save(newTeam);
            equiposGuardados++;
        }
        
        return equiposGuardados;
    }

    /**
     * Metodo para sincronizar datos maestros
     * 
     * @deprecated
     */
    public void sincronizarDatosMaestros() {
        // getLeaguesBySeason();
        // getTeamsByLeague();
        // Obtener eventos de los próximos 7 días a partir de mañana
        //LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);
        for (int i = 0; i < 7; i++) {
            //LocalDateTime targetDate = tomorrow.plusDays(i);
            //Date date = Date.from(targetDate.atZone(ZoneId.systemDefault()).toInstant());
            // obtenerEventosByDate(date);
        }
    }

    /**
     * Metodo para obtener eventos por temporada
     */
    @Async
    public void getEventsBySeason() {
        int season = java.time.Year.now().getValue();
        List<Liga> activeLeagues = ligaRepository.findByActivaTrue();

        for (Liga league : activeLeagues) {
            Integer leagueId = league.getApiSportsId();

            String url = "https://v3.football.api-sports.io/fixtures?league=" + leagueId + "&season=" + season
                    + "&next=15";
            Response<EventsByLeagueResponse> response = getFromSportApi(url,
                    new ParameterizedTypeReference<Response<EventsByLeagueResponse>>() {
                    });

            saveEvents(response); // Implementa este método para guardar los eventos

        }
    }

    @Transactional
    private void saveEvents(Response<EventsByLeagueResponse> response) {
        response.getResponse().forEach(eventByLeague -> {
            OffsetDateTime odt = OffsetDateTime.parse(eventByLeague.getFixture().getDate());
            LocalDateTime fechaLocal = odt.atZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();

            EventoDeportivo newEvent = EventoDeportivo.builder()
                    .apiSportsId(eventByLeague.getFixture().getId())
                    .fechaEvento(fechaLocal)
                    .build();

            // Verificar que existe la liga, si no existe continuar con el siguiente
            Liga liga = ligaRepository.findByApiSportsId(eventByLeague.getLeague().getId()).orElse(null);
            if (liga == null) {
                return; // Continuar con el siguiente evento
            }
            newEvent.setLiga(liga);

            // Verificar que existe el equipo local, si no existe continuar con el siguiente
            Equipo equipoLocal = equipoRepository.findByApiSportsId(eventByLeague.getTeams().getHome().getId())
                    .orElse(null);
            if (equipoLocal == null) {
                return; // Continuar con el siguiente evento
            }
            newEvent.setEquipoLocal(equipoLocal);

            // Verificar que existe el equipo visitante, si no existe continuar con el
            // siguiente
            Equipo equipoVisitante = equipoRepository.findByApiSportsId(eventByLeague.getTeams().getAway().getId())
                    .orElse(null);
            if (equipoVisitante == null) {
                return; // Continuar con el siguiente evento
            }
            newEvent.setEquipoVisitante(equipoVisitante);

            newEvent.setNombre(equipoLocal.getNombre() + " vs " + equipoVisitante.getNombre());

            newEvent.setNombreCorto(equipoVisitante.getCode() + " vs "
                    + equipoLocal.getCode());

            eventoDeportivoRepository.save(newEvent);
        });
    }

    /**
     * Metodo para actualizar las odds de los eventos deportivos
     */
    @Async
    @Transactional
    public void actualizarOddsByLeague() {
        int season = java.time.Year.now().getValue();
        List<Liga> activeLeagues = ligaRepository.findByActivaTrue();

        for (Liga league : activeLeagues) {
            Integer leagueId = league.getApiSportsId();

            String url = "https://v3.football.api-sports.io/odds?league=" + leagueId + "&season=" + season;
            Response<EventsByLeagueResponse> response = getFromSportApi(url,
                    new ParameterizedTypeReference<Response<EventsByLeagueResponse>>() {
                    });

            updateOdds(response);

        }
    }

    private void updateOdds(Response<EventsByLeagueResponse> response) {
        response.getResponse().forEach(eventByLeague -> {
            EventoDeportivo existingEvent = eventoDeportivoRepository
                    .findByApiSportsId(eventByLeague.getFixture().getId());

            if (existingEvent != null) {
                // Actualiza las odds del evento existente
                // existingEvent.setOdds(eventByLeague.getOdds());
                eventoDeportivoRepository.save(existingEvent);
            }
        });
    }

    /**
     * Metodo para obtener eventos de hoy que aun no suceden o estan en vivo
     */
    @Async
    public CompletableFuture<Integer> obtenerEventosByDate(Date date, String deporte) {
        String fechaActual = new java.text.SimpleDateFormat("yyyy-MM-dd").format(date);

        String url = URLS_POR_DEPORTE.get(deporte) + "/fixtures?season=2025&date=" + fechaActual
                + "&status=NS&timezone=America%2FMexico_City";
        Response<EventsByLeagueResponse> response = getFromSportApi(url,
                new ParameterizedTypeReference<Response<EventsByLeagueResponse>>() {
                });

        Response<OddsResponse> oddsResponse = null;
        List<OddsResponse> allOdds = new java.util.ArrayList<>();
        int page = 1;

        do {
            // if (page == 5) break; // Limitar a 2 páginas para evitar demasiadas
            // solicitudes
            String oddsUrl = "https://v3.football.api-sports.io/odds?date=" + fechaActual + "&page=" + page;
            oddsResponse = getFromSportApi(oddsUrl,
                    new ParameterizedTypeReference<Response<OddsResponse>>() {
                    });

            if (oddsResponse != null && oddsResponse.getResponse() != null) {
                // Filtrar para mantener solo el primer bookmaker de cada OddsResponse
                List<OddsResponse> filteredOdds = oddsResponse.getResponse().stream()
                        .map(odds -> {
                            if (odds.getBookmakers() != null && !odds.getBookmakers().isEmpty()) {
                                OddsResponse filteredOdds2 = new OddsResponse();
                                filteredOdds2.setFixture(odds.getFixture());
                                filteredOdds2.setLeague(odds.getLeague());
                                filteredOdds2.setBookmakers(java.util.Arrays.asList(odds.getBookmakers().get(0)));
                                return filteredOdds2;
                            }
                            return odds;
                        })
                        .collect(Collectors.toList());

                allOdds.addAll(filteredOdds);
                page++;
            }
        } while (oddsResponse != null && oddsResponse.getResponse() != null && !oddsResponse.getResponse().isEmpty());

        // Crear nueva response con todos los odds recopilados
        Response<OddsResponse> finalOddsResponse = new Response<>();
        finalOddsResponse.setResponse(allOdds);

        int eventosGuardados = procesarEventoOdds(finalOddsResponse, response);

        System.out.println("Eventos procesados para la fecha: " + fechaActual + " - Total guardados: " + eventosGuardados);

        return CompletableFuture.completedFuture(eventosGuardados);
    }

    @Transactional
    private int procesarEventoOdds(Response<OddsResponse> oddsResponse,
            Response<EventsByLeagueResponse> eventsResponse) {
        // Crear un Set con los IDs de fixtures que tienen odds
        Set<Integer> fixturesWithOdds = oddsResponse.getResponse().stream()
                .map(odds -> odds.getFixture().getId())
                .collect(Collectors.toSet());

        // Filtrar los eventos que tienen odds disponibles
        List<EventsByLeagueResponse> filteredEvents = eventsResponse.getResponse().stream()
                .filter(event -> fixturesWithOdds.contains(event.getFixture().getId()))
                .collect(Collectors.toList());

        int eventosGuardados = 0;
        
        // Procesar solo los eventos filtrados
        for (EventsByLeagueResponse eventByLeague : filteredEvents) {
            if (eventoDeportivoRepository.existsByApiSportsId(eventByLeague.getFixture().getId())) {
                continue; // Continuar con el siguiente evento
            }

            if (!ligaRepository.existsByApiSportsId(eventByLeague.getLeague().getId())) {
                continue; // Continuar con el siguiente evento
            }

            if (!equipoRepository.existsByApiSportsId(eventByLeague.getTeams().getHome().getId())) {
                continue; // Continuar con el siguiente evento
            }

            if (!equipoRepository.existsByApiSportsId(eventByLeague.getTeams().getAway().getId())) {
                continue; // Continuar con el siguiente evento
            }

            if (eventByLeague != null) {
                // Encontrar las odds correspondientes al evento actual
                OddsResponse matchingOdds = oddsResponse.getResponse().stream()
                        .filter(odds -> odds.getFixture().getId() == eventByLeague.getFixture().getId())
                        .findFirst()
                        .orElse(null);

                ConvertirAEventoDeportivo(eventByLeague, matchingOdds);
                eventosGuardados++;
            }
        }
        
        return eventosGuardados;
    }

    private EventoDeportivo ConvertirAEventoDeportivo(EventsByLeagueResponse eventByLeague, OddsResponse matchingOdds) {
        OffsetDateTime odt = OffsetDateTime.parse(eventByLeague.getFixture().getDate());
        LocalDateTime fechaLocal = odt.atZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();

        EventoDeportivo newEvent = EventoDeportivo.builder()
                .apiSportsId(eventByLeague.getFixture().getId())
                .fechaEvento(fechaLocal)
                .build();

        // Verificar que existe la liga, si no existe continuar con el siguiente
        Liga liga = ligaRepository.findByApiSportsId(eventByLeague.getLeague().getId()).orElse(null);

        newEvent.setLiga(liga);

        // Verificar que existe el equipo local, si no existe continuar con el siguiente
        Equipo equipoLocal = equipoRepository.findByApiSportsId(eventByLeague.getTeams().getHome().getId())
                .orElse(null);
        newEvent.setEquipoLocal(equipoLocal);

        Equipo equipoVisitante = equipoRepository.findByApiSportsId(eventByLeague.getTeams().getAway().getId())
                .orElse(null);
        newEvent.setEquipoVisitante(equipoVisitante);

        newEvent.setNombre(equipoLocal.getNombre() + " vs " + equipoVisitante.getNombre());

        newEvent.setNombreCorto(equipoVisitante.getCode() + " vs "
                + equipoLocal.getCode());

        newEvent.setGoles(new Goles());
        newEvent.setPuntuaciones(new Score());

        Estado estado = Estado.builder()
                .largo(eventByLeague.getFixture().getStatus().getLongStatus())
                .corto(eventByLeague.getFixture().getStatus().getShortStatus())
                .build();

        newEvent.setEstado(estado);
        eventoDeportivoRepository.save(newEvent);

        if (matchingOdds != null && matchingOdds.getBookmakers() != null && !matchingOdds.getBookmakers().isEmpty()) {
            List<Momio> momios = convertirOddsAMomios(matchingOdds.getBookmakers().get(0).getBets());
            momios.forEach(momio -> {
                momio.setEventoDeportivo(newEvent);
                momioRepository.save(momio);
            });
        }

        return newEvent;
    }

    private List<Momio> convertirOddsAMomios(List<Bet> bets) {
        List<Momio> momios = new ArrayList<>();

        for (Bet bet : bets) {
            Momio momio = new Momio();
            momio.setTipoApuesta(bet.getName());

            List<Valor> valores = new ArrayList<>();
            for (Value odd : bet.getValues()) {
                Valor valor = new Valor();
                valor.setValor(odd.getValue());
                valor.setOdd(odd.getOdd());
                valor.setMomio(momio);
                valores.add(valor);
            }
            momio.setValores(valores);
            momios.add(momio);
        }

        return momios;
    }

    /**
     * Metodo para obtener eventos en vivo por deporte y odds en vivo
     */
    @Async
    public void obtenerEventosEnVivo(String deporte) {
        String deporteKey = (deporte == null || deporte.isBlank()) ? "SOCCER" : deporte.toUpperCase();
        String baseUrl = URLS_POR_DEPORTE.get(deporteKey);
        if (baseUrl == null) {
            return;
        }

        String urlEventosEnVivo = baseUrl + "/fixtures?live=all";
        String urlOddsEnVivo = baseUrl + "/odds/live";

        Response<EventsByLeagueResponse> eventosResponse = getFromSportApi(urlEventosEnVivo,
                new ParameterizedTypeReference<Response<EventsByLeagueResponse>>() {
                });

        /*
         * Response<OddsLiveResponse> oddsEnVivoResponse =
         * getFromSportApi(urlOddsEnVivo,
         * new ParameterizedTypeReference<Response<OddsLiveResponse>>() {
         * });
         */

        eventosResponse.getResponse().forEach(eventoEnVivo -> {
            EventoDeportivo existingEvent = eventoDeportivoRepository
                    .findByApiSportsId(eventoEnVivo.getFixture().getId());

            if (existingEvent != null) {
                existingEvent.getEstado().setLargo(eventoEnVivo.getFixture().getStatus().getLongStatus());
                existingEvent.getEstado().setCorto(eventoEnVivo.getFixture().getStatus().getShortStatus());
                existingEvent.getEstado().setElapsed(eventoEnVivo.getFixture().getStatus().getElapsed());
                existingEvent.getEstado().setExtra(eventoEnVivo.getFixture().getStatus().getExtra());
                existingEvent.setFechaActualizacion(LocalDateTime.now());

                existingEvent.getGoles()
                        .setLocales(eventoEnVivo.getScore().getFulltime().getHome() != null
                                ? eventoEnVivo.getScore().getFulltime().getHome()
                                : 0);
                existingEvent.getGoles()
                        .setVisitantes(eventoEnVivo.getScore().getFulltime().getAway() != null
                                ? eventoEnVivo.getScore().getFulltime().getAway()
                                : 0);

                existingEvent.getGoles().getFulltime().setLocales(eventoEnVivo.getScore().getFulltime().getHome());
                existingEvent.getGoles().getFulltime().setVisitantes(eventoEnVivo.getScore().getFulltime().getAway());

                existingEvent.getGoles().getExtratime().setLocales(eventoEnVivo.getScore().getExtratime().getHome());
                existingEvent.getGoles().getExtratime().setVisitantes(eventoEnVivo.getScore().getExtratime().getAway());

                existingEvent.getGoles().getPenalty().setLocales(eventoEnVivo.getScore().getPenalty().getHome());
                existingEvent.getGoles().getPenalty().setVisitantes(eventoEnVivo.getScore().getPenalty().getAway());
            }
        });
    }
}
