package com._bet.controller;

import com._bet.entity.datosMaestros.Deporte;
import com._bet.entity.datosMaestros.Liga;
import com._bet.entity.eventoEntity.EventoDeportivo;
import com._bet.repository.DeporteRepository;
import com._bet.repository.LigaRepository;
import com._bet.repository.EventoDeportivoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    private EventoDeportivoRepository eventoDeportivoRepository;
    
    /**
     * Obtiene todas las ligas de un deporte por nombre
     * @param nombreDeporte Nombre del deporte
     * @return Lista de ligas del deporte
     */
    @GetMapping("/ligas-por-deporte/{nombreDeporte}")
    public ResponseEntity<?> getLigasPorDeporte(@PathVariable String nombreDeporte) {
        try {
            // Buscar el deporte por nombre (ignorando mayúsculas/minúsculas)
            Optional<Deporte> deporteOpt = deporteRepository.findByNombre(nombreDeporte);
            
            if (deporteOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Deporte '" + nombreDeporte + "' no encontrado");
            }
            
            Deporte deporte = deporteOpt.get();
            
            // Obtener todas las ligas activas del deporte
            List<Liga> ligas = ligaRepository.findByDeporteAndActivaTrue(deporte);
            
            if (ligas.isEmpty()) {
                return ResponseEntity.ok("No se encontraron ligas activas para el deporte: " + nombreDeporte);
            }
            
            return ResponseEntity.ok(ligas);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor: " + e.getMessage());
        }
    }
    
    /**
     * Obtiene todos los eventos de una liga por nombre
     * @param nombreLiga Nombre de la liga
     * @return Lista de eventos de la liga
     */
    @GetMapping("/eventos-por-liga/{nombreLiga}")
    public ResponseEntity<?> getEventosPorLiga(@PathVariable String nombreLiga) {
        try {
            // Buscar la liga por nombre (ignorando mayúsculas/minúsculas)
            Optional<Liga> ligaOpt = ligaRepository.findByNombreIgnoreCase(nombreLiga);
            
            if (ligaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Liga '" + nombreLiga + "' no encontrada");
            }
            
            Liga liga = ligaOpt.get();
            
            // Obtener todos los eventos de la liga
            List<EventoDeportivo> eventos = eventoDeportivoRepository.findByLiga(liga);
            
            if (eventos.isEmpty()) {
                return ResponseEntity.ok("No se encontraron eventos para la liga: " + nombreLiga);
            }
            
            return ResponseEntity.ok(eventos);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor: " + e.getMessage());
        }
    }
    
    /**
     * Obtiene un evento específico por nombre
     * @param nombreEvento Nombre del evento
     * @return Evento encontrado
     */
    @GetMapping("/evento-por-nombre/{nombreEvento}")
    public ResponseEntity<?> getEventoPorNombre(@PathVariable String nombreEvento) {
        try {
            // Buscar eventos que contengan el nombre proporcionado (búsqueda parcial)
            List<EventoDeportivo> eventos = eventoDeportivoRepository.findByNombreEventoContainingIgnoreCase(nombreEvento);
            
            if (eventos.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontraron eventos que contengan: '" + nombreEvento + "'");
            }
            
            // Si solo hay un resultado, devolver el evento directamente
            if (eventos.size() == 1) {
                return ResponseEntity.ok(eventos.get(0));
            }
            
            // Si hay múltiples resultados, devolver todos
            return ResponseEntity.ok(eventos);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor: " + e.getMessage());
        }
    }

}
