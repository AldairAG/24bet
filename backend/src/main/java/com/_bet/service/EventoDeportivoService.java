package com._bet.service;

import com._bet.entity.EventoDeportivo;
import com._bet.entity.Liga;
import com._bet.entity.Equipo;
import com._bet.dto.response.EventoDeportivoResponse;
import com._bet.dto.response.LigaPorDeporteResponse;
import com._bet.repository.EventoDeportivoRepository;
import com._bet.repository.LigaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar eventos deportivos
 * Proporciona funcionalidades para obtener eventos en vivo y próximos
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class EventoDeportivoService {

    private final EventoDeportivoRepository eventoDeportivoRepository;
    private final LigaRepository ligaRepository;

    /**
     * Obtiene todos los eventos en vivo
     * Un evento está en vivo si su estado indica que está siendo jugado actualmente
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosEnVivo() {
        log.debug("Obteniendo eventos en vivo");
        return eventoDeportivoRepository.findEventosEnVivoParaApuestas();
    }

    /**
     * Obtiene eventos próximos (que aún no han comenzado)
     * Por defecto obtiene eventos de las próximas 24 horas
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosProximos() {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime fechaLimite = ahora.plusHours(24);
        log.debug("Obteniendo eventos próximos desde {} hasta {}", ahora, fechaLimite);
        return eventoDeportivoRepository.findEventosProximosParaApuestas(ahora, fechaLimite);
    }

    /**
     * Obtiene eventos próximos en un rango de tiempo específico
     * 
     * @param horas Número de horas hacia el futuro
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosProximos(int horas) {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime fechaLimite = ahora.plusHours(horas);
        log.debug("Obteniendo eventos próximos en las próximas {} horas", horas);
        return eventoDeportivoRepository.findEventosProximosParaApuestas(ahora, fechaLimite);
    }

    /**
     * Obtiene eventos por liga específica
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosByLiga(Liga liga) {
        log.debug("Obteniendo eventos para la liga: {}", liga.getNombre());
        return eventoDeportivoRepository.findByLigaAndActivoTrue(liga);
    }

    /**
     * Obtiene eventos donde participa un equipo específico
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosByEquipo(Equipo equipo) {
        log.debug("Obteniendo eventos para el equipo: {}", equipo.getNombre());
        return eventoDeportivoRepository.findByEquipo(equipo);
    }

    /**
     * Obtiene un evento por su ID
     */
    @Transactional(readOnly = true)
    public Optional<EventoDeportivo> getEventoById(Long id) {
        log.debug("Obteniendo evento con ID: {}", id);
        return eventoDeportivoRepository.findById(id);
    }

    /**
     * Obtiene un evento por su ID de TheSportsDB
     */
    @Transactional(readOnly = true)
    public Optional<EventoDeportivo> getEventoBySportsDbId(String sportsDbId) {
        log.debug("Obteniendo evento con SportsDB ID: {}", sportsDbId);
        return eventoDeportivoRepository.findBySportsDbId(sportsDbId);
    }

    /**
     * Obtiene eventos en un rango de fechas específico
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosEnRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        log.debug("Obteniendo eventos entre {} y {}", fechaInicio, fechaFin);
        return eventoDeportivoRepository.findEventosEnRangoFechas(fechaInicio, fechaFin);
    }

    /**
     * Obtiene eventos por estado específico
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosByEstado(String estado) {
        log.debug("Obteniendo eventos con estado: {}", estado);
        return eventoDeportivoRepository.findByEstado(estado);
    }

    /**
     * Obtiene eventos futuros (sin límite de tiempo)
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosFuturos() {
        LocalDateTime ahora = LocalDateTime.now();
        log.debug("Obteniendo todos los eventos futuros desde {}", ahora);
        return eventoDeportivoRepository.findEventosFuturos(ahora);
    }

    /**
     * Obtiene eventos pasados
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosPasados() {
        LocalDateTime ahora = LocalDateTime.now();
        log.debug("Obteniendo eventos pasados hasta {}", ahora);
        return eventoDeportivoRepository.findEventosPasados(ahora);
    }

    /**
     * Verifica si un evento existe por su SportsDB ID
     */
    @Transactional(readOnly = true)
    public boolean existeEventoBySportsDbId(String sportsDbId) {
        return eventoDeportivoRepository.existsBySportsDbId(sportsDbId);
    }

    /**
     * Obtiene eventos de una liga por su SportsDB ID
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosByLigaSportsDbId(String ligaSportsDbId) {
        log.debug("Obteniendo eventos para liga con SportsDB ID: {}", ligaSportsDbId);
        return eventoDeportivoRepository.findByLigaSportsDbId(ligaSportsDbId);
    }

    /**
     * Obtiene eventos en vivo con información de apuestas disponibles
     * Excluye eventos que no tienen momios asociados
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosEnVivoConApuestas() {
        log.debug("Obteniendo eventos en vivo con apuestas disponibles");
        List<EventoDeportivo> eventosEnVivo = getEventosEnVivo();

        // Filtrar eventos que tengan momios disponibles
        // Esta lógica se puede expandir según las reglas de negocio
        return eventosEnVivo;
    }

    /**
     * Obtiene eventos próximos con información de apuestas disponibles
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosProximosConApuestas() {
        log.debug("Obteniendo eventos próximos con apuestas disponibles");
        List<EventoDeportivo> eventosProximos = getEventosProximos();

        // Filtrar eventos que tengan momios disponibles
        // Esta lógica se puede expandir según las reglas de negocio
        return eventosProximos;
    }

    /**
     * Actualiza el estado de un evento
     */
    public EventoDeportivo actualizarEstadoEvento(Long eventoId, String nuevoEstado) {
        log.info("Actualizando estado del evento {} a {}", eventoId, nuevoEstado);

        Optional<EventoDeportivo> eventoOpt = eventoDeportivoRepository.findById(eventoId);
        if (eventoOpt.isPresent()) {
            EventoDeportivo evento = eventoOpt.get();
            evento.setEstado(nuevoEstado);

            // Si el estado indica que está en vivo, actualizar el campo enVivo
            boolean enVivo = nuevoEstado != null &&
                    (nuevoEstado.equals("Live") ||
                            nuevoEstado.equals("1H") ||
                            nuevoEstado.equals("2H") ||
                            nuevoEstado.equals("HT"));
            evento.setEnVivo(enVivo);

            return eventoDeportivoRepository.save(evento);
        } else {
            throw new RuntimeException("Evento no encontrado con ID: " + eventoId);
        }
    }

    /**
     * Desactiva un evento
     */
    public void desactivarEvento(Long eventoId) {
        log.info("Desactivando evento con ID: {}", eventoId);

        Optional<EventoDeportivo> eventoOpt = eventoDeportivoRepository.findById(eventoId);
        if (eventoOpt.isPresent()) {
            EventoDeportivo evento = eventoOpt.get();
            evento.setActivo(false);
            eventoDeportivoRepository.save(evento);
        } else {
            throw new RuntimeException("Evento no encontrado con ID: " + eventoId);
        }
    }

    /**
     * Obtiene todos los eventos activos
     */
    @Transactional(readOnly = true)
    public List<EventoDeportivo> getEventosActivos() {
        log.debug("Obteniendo todos los eventos activos");
        return eventoDeportivoRepository.findByActivoTrue();
    }

    /**
     * Obtiene las ligas por deporte con información del país y bandera
     */
    @Transactional(readOnly = true)
    public List<LigaPorDeporteResponse> getLigasPorDeporte(String deporte) {
        log.debug("Obteniendo ligas para el deporte: {}", deporte);

        List<Liga> ligas = ligaRepository.findByDeporteNombreIgnoreCaseAndActivaTrue(deporte);

        return ligas.stream()
                .map(liga -> LigaPorDeporteResponse.builder()
                        .id(liga.getId())
                        .nombreLiga(liga.getNombre())
                        .pais(liga.getPais() != null ? liga.getPais().getName()
                                : (liga.getPaisNombre() != null ? liga.getPaisNombre() : ""))
                        .banderaPais(liga.getPais() != null ? liga.getPais().getFlagUrl() : "")
                        .deporte(liga.getDeporte().getNombre())
                        .activa(liga.getActiva())
                        .build())
                .collect(Collectors.toList());
    }

    public List<EventoDeportivoResponse> getEventosProximosPorLigaByName(String ligaNombre) {
        log.debug("Obteniendo eventos próximos para la liga: {}", ligaNombre);
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime fechaLimite = ahora.plusDays(7);
        List<EventoDeportivo> eventos = eventoDeportivoRepository.findEventosProximosByLigaNombre(ligaNombre, ahora, fechaLimite);
        
        return eventos.stream()
                .map(evento -> EventoDeportivoResponse.builder()
                        .id(evento.getId())
                        .sportsDbId(evento.getSportsDbId())
                        .fechaEvento(evento.getFechaEvento())
                        .estado(evento.getEstado())
                        .enVivo(evento.getEnVivo())
                        .strEquipoLocal(evento.getEquipoLocal().getNombre())
                        .strEquipoVisitante(evento.getEquipoVisitante().getNombre())
                        .ubicacion(evento.getUbicacion())
                        .pais(ligaNombre)
                        .urlBadgeEquipoLocal(evento.getEquipoLocal().getBadgeUrl())
                        .urlBadgeEquipoVisitante(evento.getEquipoVisitante().getBadgeUrl())
                        .build())
                .collect(Collectors.toList());
    }
}