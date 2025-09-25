package com._bet.service.apiSport;

import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com._bet.dto.apiSports.response.LeagueBySeasonResponse;
import com._bet.dto.apiSports.response.Response;
import com._bet.dto.apiSports.response.TeamByLeagueResponse;
import com._bet.entity.Equipo;
import com._bet.entity.Liga;
import com._bet.repository.CountryRepository;
import com._bet.repository.EquipoRepository;
import com._bet.repository.LigaRepository;

import org.springframework.http.HttpMethod;

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApiSportService {

    private final String API_KEY = "50a0c0944d32698112f06a42b3b3248e";
    private final RestTemplate restTemplate;
    private final CountryRepository countryRepository;
    private final LigaRepository ligaRepository;
    private final EquipoRepository equipoRepository;

    /**
     * Metodo get base para consumir la API de ApiSport
     * 
     * @return Response<LeagueBySeasonResponse>
     */
    public <T> Response<T> getFromSportApi(String url) {

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
                new ParameterizedTypeReference<Response<T>>() {
                });

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
        String currentDate = java.time.LocalDate.now().toString();
        String url = "https://v3.football.api-sports.io/leagues?season=" + season;
        Response<LeagueBySeasonResponse> response = getFromSportApi(url);

        Response<LeagueBySeasonResponse> filteredResponse = new Response<>();
        filteredResponse.setResponse(
                response.getResponse().stream()
                        .filter(leagueBySeason -> {
                            String endDate = leagueBySeason.getSeason().getEnd();
                            return currentDate.compareTo(endDate) <= 0;
                        })
                        .collect(java.util.stream.Collectors.toList()));

        response = filteredResponse;

        saveLeagues(response.getResponse());

    }

    private void saveLeagues(List<LeagueBySeasonResponse> leagues) {
        leagues.forEach(league -> {
            Liga newLiga = Liga.builder()
                    .apiSportsId(league.getLeague().getId())
                    .nombre(league.getLeague().getName())
                    .paisNombre(league.getCountry().getName())
                    .logoUrl(league.getLeague().getLogo())
                    .temporada(league.getSeason().getYear())
                    .activa(true)
                    .build();

            com._bet.entity.Country country = countryRepository.findByName(league.getCountry().getName())
                    .orElseGet(() -> {
                        com._bet.entity.Country newCountry = com._bet.entity.Country.builder()
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
            Response<TeamByLeagueResponse> response = getFromSportApi(url);

            saveTeams(response); // Implementa este método para guardar los equipos y estadios

        }
    }

    private void saveTeams(Response<TeamByLeagueResponse> response) {
        response.getResponse().forEach(teamByLeague -> {
            Equipo newTeam = Equipo.builder()
                    .apiSportsId(teamByLeague.getTeam().getId())
                    .nombre(teamByLeague.getTeam().getName())
                    .logoUrl(teamByLeague.getTeam().getLogo())
                    .code(teamByLeague.getTeam().getCode())
                    .build();

            equipoRepository.save(newTeam);
        });
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

            String url = "https://v3.football.api-sports.io/events?league=" + leagueId + "&season=" + season;
            Response<EventByLeagueResponse> response = getFromSportApi(url);

            saveEvents(response); // Implementa este método para guardar los eventos

        }
    }


}
