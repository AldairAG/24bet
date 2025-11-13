package com._bet.service.evento;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com._bet.dto.apiSports.entidades.Fixture;
import com._bet.dto.apiSports.entidades.League;
import com._bet.dto.apiSports.entidades.Team;
import com._bet.dto.apiSports.entidades.Fixture.Status;
import com._bet.dto.apiSports.entidades.Odds.Bet;
import com._bet.dto.apiSports.entidades.Odds.Value;
import com._bet.dto.apiSports.response.EventsByLeagueResponse.Goals;
import com._bet.dto.apiSports.response.EventsByLeagueResponse.Score;
import com._bet.dto.apiSports.response.EventsByLeagueResponse.Teams;
import com._bet.dto.response.EventoConOddsResponse;
import com._bet.dto.response.EventoDeportivoResponse;
import com._bet.entity.eventoEntity.EventoDeportivo;
import com._bet.repository.EventoDeportivoRepository;

@Service
public class EventoService {

        @Autowired
        private EventoDeportivoRepository eventoDeportivoRepository;

        /**
         * Obtener eventos por nombre de liga
         * 
         * @param nombreLiga Nombre de la liga
         * @return Lista de eventos deportivos
         */
        public List<EventoConOddsResponse> obtenerEventosPorLigaPorLigaNombreYPais(String paisLiga, String nombreLiga) {
                List<EventoDeportivo> eventos = eventoDeportivoRepository
                                .findByLigaNombreAndLigaPaisNombreAndLigaActivaTrue(nombreLiga, paisLiga);

                return eventos.stream()
                                .map(this::convertirEventoEnVivoResponses)
                                .collect(Collectors.toList());
        }

        public EventoDeportivoResponse findEventoByNombre(String nombreEvento) {
                EventoDeportivo eventoDeportivo = eventoDeportivoRepository.findByNombre(nombreEvento);

                return convertirEventoAResponse(eventoDeportivo);
        }

        private EventoDeportivoResponse convertirEventoAResponse(EventoDeportivo evento) {
                if (evento == null)
                        return null;

                Fixture fixture = Fixture.builder()
                                .id(evento.getApiSportsId())
                                .date(evento.getFechaEvento().toString())
                                .status(Fixture.Status.builder()
                                                .longStatus(evento.getEstado().getLargo())
                                                .shortStatus(evento.getEstado().getCorto())
                                                .build())
                                .build();

                List<Bet> oddsList = evento.getOdds().stream()
                                .<Bet>map(momio -> {
                                        List<Value> values = momio.getValores().stream()
                                                        .map(valor -> Value.builder()
                                                                        .id(valor.getId())
                                                                        .value(valor.getValor())
                                                                        .odd(valor.getOdd())
                                                                        .build())
                                                        .collect(Collectors.toList());

                                        Bet bet = Bet.builder()
                                                        .id(Integer.parseInt(momio.getId().toString()))
                                                        .name(momio.getTipoApuesta())
                                                        .values(values)
                                                        .build();

                                        return bet;

                                })
                                .collect(Collectors.toList());

                Teams teams = Teams.builder()
                                .home(Team.builder()
                                                .id(evento.getEquipoLocal().getId().intValue())
                                                .name(evento.getEquipoLocal().getNombre())
                                                .code(evento.getEquipoLocal().getCode())
                                                .country(evento.getEquipoLocal().getPais())
                                                .logo(evento.getEquipoLocal().getLogoUrl())
                                                .build())
                                .away(Team.builder()
                                                .id(evento.getEquipoVisitante().getId().intValue())
                                                .name(evento.getEquipoVisitante().getNombre())
                                                .code(evento.getEquipoVisitante().getCode())
                                                .country(evento.getEquipoVisitante().getPais())
                                                .logo(evento.getEquipoVisitante().getLogoUrl())
                                                .build())
                                .build();

                EventoDeportivoResponse response = new EventoDeportivoResponse();
                response.setNombreEvento(evento.getNombre());
                response.setFixture(fixture);
                response.setBets(oddsList);
                response.setTeams(teams);

                return response;
        }

        public List<EventoConOddsResponse> obtenerEventosEnVivoPorDeporte(String nombreDeporte) {
                List<EventoDeportivo> eventos = eventoDeportivoRepository
                                .findByLigaDeporteNombreAndEnVivoTrue(nombreDeporte);

                return eventos.stream()
                                .map(this::convertirEventoEnVivoResponses)
                                .collect(Collectors.toList());
        }

        private EventoConOddsResponse convertirEventoEnVivoResponses(EventoDeportivo evento) {

                Fixture fixture = Fixture.builder()
                                .id(evento.getApiSportsId())
                                .date(evento.getFechaEvento().toString())
                                .status(Fixture.Status.builder()
                                                .longStatus(evento.getEstado().getLargo())
                                                .shortStatus(evento.getEstado().getCorto())
                                                .build())
                                .build();

                League league = League.builder()
                                .id(evento.getLiga().getApiSportsId())
                                .name(evento.getLiga().getNombre())
                                .logo(evento.getLiga().getLogoUrl())
                                .country(evento.getLiga().getPais().getName())
                                .build();

                Goals goals = Goals.builder()
                                .home(evento.getGoles().getLocales())
                                .away(evento.getGoles().getVisitantes())
                                .build();

                Score score = Score.builder()
                                .halftime(goals)
                                .fulltime(goals)
                                .extratime(goals)
                                .penalty(goals)
                                .build();

                Team homeTeam = Team.builder()
                                .id(evento.getEquipoLocal().getId().intValue())
                                .name(evento.getEquipoLocal().getNombre())
                                .code(evento.getEquipoLocal().getCode())
                                .country(evento.getEquipoLocal().getPais())
                                .logo(evento.getEquipoLocal().getLogoUrl())
                                .build();

                Team awayTeam = Team.builder()
                                .id(evento.getEquipoVisitante().getId().intValue())
                                .name(evento.getEquipoVisitante().getNombre())
                                .code(evento.getEquipoVisitante().getCode())
                                .country(evento.getEquipoVisitante().getPais())
                                .logo(evento.getEquipoVisitante().getLogoUrl())
                                .build();

                Teams teams = Teams.builder()
                                .home(homeTeam)
                                .away(awayTeam)
                                .build();

                List<Bet> odds = evento.getOdds().stream()
                                .filter(momio -> "Match Winner".equals(momio.getTipoApuesta()))
                                .<Bet>map(momio -> {
                                        List<Value> values = momio.getValores().stream()
                                                        .map(valor -> Value.builder()
                                                                        .id(valor.getId())
                                                                        .value(valor.getValor())
                                                                        .odd(valor.getOdd())
                                                                        .build())
                                                        .collect(Collectors.toList());

                                        Bet bet = Bet.builder()
                                                        .id(Integer.parseInt(momio.getId().toString()))
                                                        .name(momio.getTipoApuesta())
                                                        .values(values)
                                                        .build();

                                        return bet;

                                }).toList();

                EventoConOddsResponse response = new EventoConOddsResponse();
                response.setFixture(fixture);
                response.setLeague(league);
                response.setGoals(goals);
                response.setScore(score);
                response.setTeams(teams);
                response.setOdds(odds);
                response.setSport(evento.getLiga().getDeporte().getNombre());

                return response;
        }

        public List<EventoConOddsResponse> obtenerEventosMasProximosPorDeporte(String nombreDeporte) {
                List<EventoDeportivo> eventos = eventoDeportivoRepository
                                .findByLigaDeporteNombreAndFechaEventoBetweenOrEnVivoTrue(
                                                nombreDeporte,
                                                LocalDateTime.now(),
                                                LocalDateTime.now().plusDays(3));

                return eventos.stream()
                                .map(this::convertirEventoEnVivoResponses)
                                .collect(Collectors.toList());
        }

        /**
         * Metodo para quitar el estado de en vivo de los eventos que ya no lo estan
         */
        @Transactional
        public void quitarEstadoEnVivoDeEventos() {
                List<EventoDeportivo> eventosEnVivo = eventoDeportivoRepository.findByEnVivoTrue();

                for (EventoDeportivo evento : eventosEnVivo) {

                        if (evento.getEstado().getCorto().equalsIgnoreCase("FT")) {
                                evento.setEnVivo(false);
                                eventoDeportivoRepository.save(evento);
                        }
                }
        }


        /*
         * Metodo para borrar eventos antiguos (mas de 15 dias)
         */
        @Transactional
        public void borrarEventosAntiguos() {
                LocalDateTime fechaLimite = LocalDateTime.now().minusDays(15);
                List<EventoDeportivo> eventosAntiguos = eventoDeportivoRepository
                                .findByFechaEventoBefore(fechaLimite);

                eventoDeportivoRepository.deleteAll(eventosAntiguos);
        }
}
