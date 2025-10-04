package com._bet.service.evento;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._bet.dto.apiSports.entidades.Fixture;
import com._bet.dto.apiSports.entidades.Fixture.Status;
import com._bet.dto.apiSports.entidades.Odds.Bet;
import com._bet.dto.apiSports.entidades.Odds.Value;
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
        public List<EventoDeportivoResponse> obtenerEventosPorLiga(String nombreLiga) {
                List<EventoDeportivo> eventos = eventoDeportivoRepository.findByLigaNombreAndLigaActivaTrue(nombreLiga);
                List<EventoDeportivoResponse> eventoResponses = new ArrayList<>();

                for (EventoDeportivo eventoDeportivo : eventos) {
                        Status status = Status.builder()
                                        .longStatus(eventoDeportivo.getEstado().getLargo())
                                        .shortStatus(eventoDeportivo.getEstado().getCorto())
                                        .build();

                        Fixture fixture = Fixture.builder()
                                        .id(eventoDeportivo.getApiSportsId())
                                        .date(eventoDeportivo.getFechaEvento().toString())
                                        .status(status)
                                        .build();

                        EventoDeportivoResponse eventoResponse = EventoDeportivoResponse.builder()
                                        .fixture(fixture)
                                        .nombreEvento(eventoDeportivo.getNombre())
                                        .build();

                        eventoResponses.add(eventoResponse);
                }

                return eventoResponses;

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

                EventoDeportivoResponse response = new EventoDeportivoResponse();
                response.setNombreEvento(evento.getNombre());
                response.setFixture(fixture);
                response.setBets(oddsList);

                return response;
        }
}
