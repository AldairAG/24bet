package com._bet.controller;

import com._bet.controller.AuthController.ApiResponseWrapper;
import com._bet.dto.response.EventoDeportivoResponse;
import com._bet.dto.response.LigaPorDeporteResponse;
import com._bet.service.EventoDeportivoService;

import com._bet.helpers.EventoDeportivoMapper;
import com._bet.entity.EventoDeportivo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para gestionar eventos deportivos
 * Proporciona endpoints para obtener eventos en vivo y próximos
 */
@RestController
@RequestMapping("/24bet/eventos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EventoDeportivoController {

    private final EventoDeportivoService eventoDeportivoService;
    private final EventoDeportivoMapper eventoDeportivoMapper;

    /**
     * Obtiene todos los eventos en vivo
     * GET /api/eventos/en-vivo
     */
    @GetMapping("/en-vivo")
    public ResponseEntity<ApiResponseWrapper<List<EventoDeportivoResponse>>> getEventosEnVivo() {
        try {
            log.info("Obteniendo eventos en vivo");

            List<EventoDeportivo> eventosEnVivo = eventoDeportivoService.getEventosEnVivo();
            List<EventoDeportivoResponse> response = eventoDeportivoMapper.toResponseList(eventosEnVivo);

            log.info("Se encontraron {} eventos en vivo", response.size());
            return ResponseEntity.ok(new ApiResponseWrapper<List<EventoDeportivoResponse>>(false, null, response));
        } catch (Exception e) {
            log.error("Error al obtener eventos en vivo", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Obtiene eventos próximos (próximas 24 horas por defecto)
     * GET /api/eventos/proximos
     */
    @GetMapping("/proximos")
    public ResponseEntity<List<EventoDeportivoResponse>> getEventosProximos() {
        log.info("Obteniendo eventos próximos");

        List<EventoDeportivo> eventosProximos = eventoDeportivoService.getEventosProximos();
        List<EventoDeportivoResponse> response = eventoDeportivoMapper.toResponseList(eventosProximos);

        log.info("Se encontraron {} eventos próximos", response.size());
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene eventos próximos en un rango de horas específico
     * GET /api/eventos/proximos/{horas}
     */
    @GetMapping("/proximos/{horas}")
    public ResponseEntity<List<EventoDeportivoResponse>> getEventosProximos(
            @PathVariable int horas) {
        log.info("Obteniendo eventos próximos en las próximas {} horas", horas);

        if (horas <= 0 || horas > 168) { // Máximo 7 días (168 horas)
            return ResponseEntity.badRequest().build();
        }

        List<EventoDeportivo> eventosProximos = eventoDeportivoService.getEventosProximos(horas);
        List<EventoDeportivoResponse> response = eventoDeportivoMapper.toResponseList(eventosProximos);

        log.info("Se encontraron {} eventos próximos en {} horas", response.size(), horas);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene eventos en vivo con apuestas disponibles
     * GET /api/eventos/en-vivo/con-apuestas
     */
    @GetMapping("/en-vivo/con-apuestas")
    public ResponseEntity<List<EventoDeportivoResponse>> getEventosEnVivoConApuestas() {
        log.info("Obteniendo eventos en vivo con apuestas disponibles");

        List<EventoDeportivo> eventosEnVivo = eventoDeportivoService.getEventosEnVivoConApuestas();
        List<EventoDeportivoResponse> response = eventoDeportivoMapper.toResponseList(eventosEnVivo);

        log.info("Se encontraron {} eventos en vivo con apuestas", response.size());
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene eventos próximos con apuestas disponibles
     * GET /api/eventos/proximos/con-apuestas
     */
    @GetMapping("/proximos/con-apuestas")
    public ResponseEntity<List<EventoDeportivoResponse>> getEventosProximosConApuestas() {
        log.info("Obteniendo eventos próximos con apuestas disponibles");

        List<EventoDeportivo> eventosProximos = eventoDeportivoService.getEventosProximosConApuestas();
        List<EventoDeportivoResponse> response = eventoDeportivoMapper.toResponseList(eventosProximos);

        log.info("Se encontraron {} eventos próximos con apuestas", response.size());
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene un evento específico por su ID
     * GET /api/eventos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<EventoDeportivoResponse> getEventoById(@PathVariable Long id) {
        log.info("Obteniendo evento con ID: {}", id);

        Optional<EventoDeportivo> eventoOpt = eventoDeportivoService.getEventoById(id);

        if (eventoOpt.isPresent()) {
            EventoDeportivoResponse response = eventoDeportivoMapper.toResponse(eventoOpt.get());
            return ResponseEntity.ok(response);
        } else {
            log.warn("Evento no encontrado con ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtiene un evento por su SportsDB ID
     * GET /api/eventos/sports-db/{sportsDbId}
     */
    @GetMapping("/sports-db/{sportsDbId}")
    public ResponseEntity<EventoDeportivoResponse> getEventoBySportsDbId(@PathVariable String sportsDbId) {
        log.info("Obteniendo evento con SportsDB ID: {}", sportsDbId);

        Optional<EventoDeportivo> eventoOpt = eventoDeportivoService.getEventoBySportsDbId(sportsDbId);

        if (eventoOpt.isPresent()) {
            EventoDeportivoResponse response = eventoDeportivoMapper.toResponse(eventoOpt.get());
            return ResponseEntity.ok(response);
        } else {
            log.warn("Evento no encontrado con SportsDB ID: {}", sportsDbId);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtiene eventos por liga
     * GET /api/eventos/liga/{ligaSportsDbId}
     */
    @GetMapping("/liga/{ligaSportsDbId}")
    public ResponseEntity<List<EventoDeportivoResponse>> getEventosByLiga(
            @PathVariable String ligaSportsDbId) {
        log.info("Obteniendo eventos para liga con SportsDB ID: {}", ligaSportsDbId);

        List<EventoDeportivo> eventos = eventoDeportivoService.getEventosByLigaSportsDbId(ligaSportsDbId);
        List<EventoDeportivoResponse> response = eventoDeportivoMapper.toResponseList(eventos);

        log.info("Se encontraron {} eventos para la liga", response.size());
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene eventos por estado específico
     * GET /api/eventos/estado/{estado}
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<EventoDeportivoResponse>> getEventosByEstado(@PathVariable String estado) {
        log.info("Obteniendo eventos con estado: {}", estado);

        List<EventoDeportivo> eventos = eventoDeportivoService.getEventosByEstado(estado);
        List<EventoDeportivoResponse> response = eventoDeportivoMapper.toResponseList(eventos);

        log.info("Se encontraron {} eventos con estado {}", response.size(), estado);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene todos los eventos futuros
     * GET /api/eventos/futuros
     */
    @GetMapping("/futuros")
    public ResponseEntity<ApiResponseWrapper<List<EventoDeportivoResponse>>> getEventosFuturos() {
        log.info("Obteniendo todos los eventos futuros");

        List<EventoDeportivo> eventosFuturos = eventoDeportivoService.getEventosFuturos();
        List<EventoDeportivoResponse> response = eventoDeportivoMapper.toResponseList(eventosFuturos);

        log.info("Se encontraron {} eventos futuros", response.size());
        return ResponseEntity.ok(new ApiResponseWrapper<List<EventoDeportivoResponse>>(false, null, response));
    }

    /**
     * Obtiene todos los eventos pasados
     * GET /api/eventos/pasados
     */
    @GetMapping("/pasados")
    public ResponseEntity<List<EventoDeportivoResponse>> getEventosPasados() {
        log.info("Obteniendo eventos pasados");

        List<EventoDeportivo> eventosPasados = eventoDeportivoService.getEventosPasados();
        List<EventoDeportivoResponse> response = eventoDeportivoMapper.toResponseList(eventosPasados);

        log.info("Se encontraron {} eventos pasados", response.size());
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene todos los eventos activos
     * GET /api/eventos/activos
     */
    @GetMapping("/activos")
    public ResponseEntity<List<EventoDeportivoResponse>> getEventosActivos() {
        log.info("Obteniendo todos los eventos activos");

        List<EventoDeportivo> eventosActivos = eventoDeportivoService.getEventosActivos();
        List<EventoDeportivoResponse> response = eventoDeportivoMapper.toResponseList(eventosActivos);

        log.info("Se encontraron {} eventos activos", response.size());
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene las ligas por deporte con información del país y bandera
     * GET /api/eventos/ligas/{deporte}
     */
    @GetMapping("/ligas/{deporte}")
    public ResponseEntity<ApiResponseWrapper<List<LigaPorDeporteResponse>>> getLigasPorDeporte(
            @PathVariable String deporte) {
        log.info("Obteniendo ligas para el deporte: {}", deporte);

        try {
            List<LigaPorDeporteResponse> ligas = eventoDeportivoService.getLigasPorDeporte(deporte);
            log.info("Se encontraron {} ligas para el deporte {}", ligas.size(), deporte);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "", ligas));
        } catch (Exception e) {
            log.error("Error al obtener ligas por deporte {}: {}", deporte, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Proximos eventos por liga hasta 5 días por nombre de liga
     */
    @GetMapping("/proximos/ligas/{ligaNombre}")
    public ResponseEntity<ApiResponseWrapper<List<EventoDeportivoResponse>>> getEventosProximosPorLiga(
            @PathVariable String ligaNombre) {
        try {
            log.info("Obteniendo eventos próximos para la liga con nombre: {}", ligaNombre);

            List<EventoDeportivoResponse> eventosProximos = eventoDeportivoService.getEventosProximosPorLigaByName(ligaNombre);

            log.info("Se encontraron {} eventos próximos para la liga", eventosProximos.size());
            return ResponseEntity.ok(new ApiResponseWrapper(true, "Eventos próximos obtenidos exitosamente", eventosProximos));
        } catch (Exception e) {
            log.error("Error al obtener eventos próximos para la liga {}: {}", ligaNombre, e.getMessage());
            return ResponseEntity.status(500)
                    .body(new ApiResponseWrapper(false, "Error al obtener eventos próximos", null));
        }
    }
}