package com._bet.controller;

import com._bet.controller.AuthController.ApiResponseWrapper;
import com._bet.dto.response.EventoDeportivoResponse;
import com._bet.entity.datosMaestros.Deporte;
import com._bet.entity.datosMaestros.Liga;
import com._bet.repository.DeporteRepository;
import com._bet.repository.LigaRepository;
import com._bet.service.evento.EventoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Controller para manejar endpoints relacionados con eventos deportivos
 */
@RestController
@RequestMapping("/24bet/eventos")
@CrossOrigin(origins = "*")
public class EventosController {
    
    @Autowired
    private DeporteRepository deporteRepository;
    
    @Autowired
    private LigaRepository ligaRepository;
    
    @Autowired    
    private EventoService eventoService;

    /**
     * Obtiene todas las ligas de un deporte por nombre
     * @param nombreDeporte Nombre del deporte
     * @return Lista de ligas del deporte
     */
    @GetMapping("/ligas-por-deporte/{nombreDeporte}")
    public ResponseEntity<ApiResponseWrapper<List<Liga>>> getLigasPorDeporte(@PathVariable String nombreDeporte) {
        try {
            // Buscar el deporte por nombre (ignorando mayúsculas/minúsculas)
            Optional<Deporte> deporteOpt = deporteRepository.findByNombre(nombreDeporte);
            
            if (deporteOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponseWrapper<>(false, "Deporte '" + nombreDeporte + "' no encontrado", null)
                );
            }
            
            Deporte deporte = deporteOpt.get();
            
            // Obtener todas las ligas activas del deporte
            List<Liga> ligas = ligaRepository.findByDeporteAndActivaTrue(deporte);
            
            if (ligas.isEmpty()) {
                return ResponseEntity.ok(new ApiResponseWrapper<>(true, "No se encontraron ligas activas para el deporte: " + nombreDeporte, null));
            }

            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Ligas obtenidas exitosamente", ligas));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseWrapper<>(false, "Error interno del servidor: " + e.getMessage(), null));
        }
    }
    
    /**
     * Obtiene todos los eventos de una liga por nombre
     * @param nombreLiga Nombre de la liga
     * @return Lista de eventos de la liga
     */
    @GetMapping("/eventos-por-liga/{nombreLiga}")
    public ResponseEntity<ApiResponseWrapper<List<EventoDeportivoResponse>>> getEventosPorLiga(@PathVariable String nombreLiga) {
        try {
            // Buscar la liga por nombre (ignorando mayúsculas/minúsculas)
            List<EventoDeportivoResponse> eventoResponses = eventoService.obtenerEventosPorLiga(nombreLiga);

            ApiResponseWrapper<List<EventoDeportivoResponse>> responseWrapper = new ApiResponseWrapper<>(true, "Eventos obtenidos exitosamente", eventoResponses);

            return ResponseEntity.ok(responseWrapper);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseWrapper<>(false, "Error interno del servidor: " + e.getMessage(), null));
        }
    }
    
    /**
     * Obtiene un evento específico por nombre
     * @param nombreEvento Nombre del evento
     * @return Evento encontrado
     */
    @GetMapping("/evento-por-nombre/{nombreEvento}")
    public ResponseEntity<ApiResponseWrapper<EventoDeportivoResponse>> getEventoPorNombre(@PathVariable String nombreEvento) {
        try {
            EventoDeportivoResponse evento = eventoService.findEventoByNombre(nombreEvento);
            
            if (evento == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseWrapper<>(false, "Evento: '" + nombreEvento + "' no encontrado", null));
            }

            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Evento encontrado exitosamente", evento));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseWrapper<>(false, "Error interno del servidor: " + e.getMessage(), null));
        }
    }

    /**
     * Obtiene todos los eventos en vivo de un deporte por nombre
     * @param nombreDeporte Nombre del deporte
     * @return Lista de eventos del deporte
     */
    @GetMapping("/eventos-en-vivo-por-deporte/{nombreDeporte}")
    public ResponseEntity<ApiResponseWrapper<List<EventoDeportivoResponse>>> getEventosEnVivo
    (@PathVariable String nombreDeporte) {
        try {
            
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Eventos obtenidos exitosamente", new ArrayList<>()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseWrapper<>(false, "Error interno del servidor: " + e.getMessage(), null));
        }
    }

    /**
     * Obtiene todos los eventos mas proximos de un deporte por nombre
     * @param nombreDeporte Nombre del deporte
     * @return Lista de eventos del deporte
     */
    @GetMapping("/eventos-mas-proximos-por-deporte/{nombreDeporte}")
    public ResponseEntity<ApiResponseWrapper<List<EventoDeportivoResponse>>> getEventosMasProximosPorDeporte
    (@PathVariable String nombreDeporte) {
        try {
            
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Eventos obtenidos exitosamente", new ArrayList<>()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseWrapper<>(false, "Error interno del servidor: " + e.getMessage(), null));
        }
    }

}
