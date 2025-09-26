package com._bet.service.apiSport;

import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com._bet.dto.apiSports.entidades.Fixture;
import com._bet.dto.apiSports.entidades.Season;
import com._bet.dto.apiSports.response.EventsByLeagueResponse;
import com._bet.dto.apiSports.response.LeagueBySeasonResponse;
import com._bet.dto.apiSports.response.Response;
import com._bet.dto.apiSports.response.TeamByLeagueResponse;
import com._bet.entity.datosMaestros.Deporte;
import com._bet.entity.datosMaestros.Equipo;
import com._bet.entity.datosMaestros.Liga;
import com._bet.entity.eventoEntity.EventoDeportivo;
import com._bet.repository.CountryRepository;
import com._bet.repository.DeporteRepository;
import com._bet.repository.EquipoRepository;
import com._bet.repository.EventoDeportivoRepository;
import com._bet.repository.LigaRepository;

import org.springframework.http.HttpMethod;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApiSportService {

    private final String API_KEY = "50a0c0944d32698112f06a42b3b3248e";
    private final String currentDate = java.time.LocalDate.now().toString();
    private final RestTemplate restTemplate;
    private final CountryRepository countryRepository;
    private final LigaRepository ligaRepository;
    private final EquipoRepository equipoRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;
    private final DeporteRepository deporteRepository;

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
    public void getLeaguesBySeason() {
        int season = java.time.Year.now().getValue();
        String url = "https://v3.football.api-sports.io/leagues?season=" + season + "&current=true";
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

        saveLeagues(response.getResponse());

    }

    private void saveLeagues(List<LeagueBySeasonResponse> leagues) {
        leagues.forEach(league -> {

            if (ligaRepository.existsByApiSportsId(league.getLeague().getId())) {
                return;
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
        });
    }

    /*
     * Metodo para obtener equipos por liga
     */
    @Async
    @Transactional
    public void getTeamsByLeague() {
        int season = java.time.Year.now().getValue();
        List<Liga> activeLeagues = ligaRepository.findByActivaTrue();

        for (Liga league : activeLeagues) {
            Integer leagueId = league.getApiSportsId();

            String url = "https://v3.football.api-sports.io/teams?league=" + leagueId + "&season=" + season;
            Response<TeamByLeagueResponse> response = getFromSportApi(url,
                    new ParameterizedTypeReference<Response<TeamByLeagueResponse>>() {
                    });

            saveTeams(response, leagueId); // Implementa este método para guardar los equipos y estadios

        }
    }

    private void saveTeams(Response<TeamByLeagueResponse> response, int leagueId) {
        response.getResponse().forEach(teamByLeague -> {
            if (equipoRepository.existsByApiSportsId(teamByLeague.getTeam().getId())) {
                return;
            }

            if (!ligaRepository.existsByApiSportsId(leagueId)) {
                return;
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
        });
    }

    public void sincronizarDatosMaestros() {
        //getLeaguesBySeason();
        //getTeamsByLeague();
    }

    /**
     * Metodo para obtener eventos por temporada
     */
    @Async
    @Transactional
    public void getEventsBySeason() {
        int season = java.time.Year.now().getValue();
        List<Liga> activeLeagues = ligaRepository.findByActivaTrue();

        for (Liga league : activeLeagues) {
            Integer leagueId = league.getApiSportsId();

            String url = "https://v3.football.api-sports.io/fixtures?league=" + leagueId + "&season=" + season
                    + "&next=15";
            Response<Fixture> response = getFromSportApi(url,
                    new ParameterizedTypeReference<Response<Fixture>>() {
                    });

            saveEvents(response); // Implementa este método para guardar los eventos

        }
    }

    private void saveEvents(Response<Fixture> response) {
        response.getResponse().forEach(fixture -> {
            OffsetDateTime odt = OffsetDateTime.parse(fixture.getDate());
            LocalDateTime fechaLocal = odt.atZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();

                EventoDeportivo newEvent = EventoDeportivo.builder()
                        .apiSportsId(fixture.getId())
                        .fechaEvento(fechaLocal)
                        .build();

                // Verificar y asignar liga
                Liga liga = ligaRepository.findByApiSportsId(fixture.getLeague().getId()).orElse(null);
                newEvent.setLiga(liga);

                // Verificar y asignar equipo local
                Equipo equipoLocal = equipoRepository.findByApiSportsId(fixture.getTeams().getHome().getId())
                        .orElse(null);
                newEvent.setEquipoLocal(equipoLocal);

                // Verificar y asignar equipo visitante
                Equipo equipoVisitante = equipoRepository.findByApiSportsId(fixture.getTeams().getAway().getId())
                        .orElse(null);
                newEvent.setEquipoVisitante(equipoVisitante);

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
            eventByLeague.getFixtures().forEach(fixture -> {
                EventoDeportivo existingEvent = eventoDeportivoRepository
                        .findByApiSportsId(fixture.getId());

                if (existingEvent != null) {
                    // Actualiza las odds del evento existente
                    // existingEvent.setOdds(fixture.getOdds());
                    eventoDeportivoRepository.save(existingEvent);
                }
            });
        });
    }
}
