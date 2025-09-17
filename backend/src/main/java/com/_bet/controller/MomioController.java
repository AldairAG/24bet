package com._bet.controller;

import com._bet.entity.Momio;
import com._bet.entity.EventoDeportivo;
import com._bet.repository.MomioRepository;
import com._bet.repository.EventoDeportivoRepository;
import com._bet.service.MomioCalculatorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controlador REST para gestionar momios (odds)
 */
@RestController
@RequestMapping("/24bet/momios")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class MomioController {

    private final MomioRepository momioRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;
    private final MomioCalculatorService momioCalculatorService;

    /**
     * Obtiene todos los momios con paginación
     */
    @GetMapping
    public ResponseEntity<Page<Momio>> obtenerMomios(Pageable pageable) {
        log.info("Obteniendo momios con paginación: {}", pageable);
        Page<Momio> momios = momioRepository.findByActivoTrueOrderByFechaCreacionDesc(pageable);
        return ResponseEntity.ok(momios);
    }

    /**
     * Obtiene momios por evento deportivo
     */
    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<Momio>> obtenerMomiosPorEvento(@PathVariable Long eventoId) {
        log.info("Obteniendo momios para evento: {}", eventoId);
        
        EventoDeportivo evento = eventoDeportivoRepository.findById(eventoId)
            .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
            
        List<Momio> momios = momioRepository.findByEventoDeportivoAndActivoTrueOrderByTipoApuesta(evento);
        return ResponseEntity.ok(momios);
    }

    /**
     * Obtiene momios por tipo de apuesta y evento
     */
    @GetMapping("/evento/{eventoId}/tipo/{tipoApuesta}")
    public ResponseEntity<List<Momio>> obtenerMomiosPorEventoYTipo(
            @PathVariable Long eventoId,
            @PathVariable Momio.TipoApuesta tipoApuesta) {
        log.info("Obteniendo momios para evento {} y tipo {}", eventoId, tipoApuesta);
        
        EventoDeportivo evento = eventoDeportivoRepository.findById(eventoId)
            .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
            
        List<Momio> momios = momioRepository.findByEventoDeportivoAndTipoApuestaAndActivoTrue(evento, tipoApuesta);
        return ResponseEntity.ok(momios);
    }

    /**
     * Obtiene eventos disponibles para apostar (con momios)
     */
    @GetMapping("/eventos-disponibles")
    public ResponseEntity<List<EventoDeportivo>> obtenerEventosDisponibles() {
        log.info("Obteniendo eventos disponibles para apostar");
        
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime limite = ahora.plusDays(7); // Próximos 7 días
        
        List<EventoDeportivo> eventos = eventoDeportivoRepository
            .findByFechaEventoBetweenAndEstadoInAndActivoTrue(
                ahora, 
                limite, 
                List.of("Not Started", "1H", "2H", "HT")
            );
            
        return ResponseEntity.ok(eventos);
    }

    /**
     * Obtiene eventos próximos para apostar (próximas 24 horas)
     */
    @GetMapping("/eventos-proximos")
    public ResponseEntity<List<EventoDeportivo>> obtenerEventosProximos() {
        log.info("Obteniendo eventos próximos para apostar");
        
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime limite = ahora.plusHours(24);
        
        List<EventoDeportivo> eventos = eventoDeportivoRepository
            .findEventosProximosParaApuestas(ahora, limite);
            
        return ResponseEntity.ok(eventos);
    }

    /**
     * Obtiene eventos en vivo disponibles para apostar
     */
    @GetMapping("/eventos-en-vivo")
    public ResponseEntity<List<EventoDeportivo>> obtenerEventosEnVivo() {
        log.info("Obteniendo eventos en vivo para apostar");
        
        List<EventoDeportivo> eventos = eventoDeportivoRepository.findEventosEnVivoParaApuestas();
        return ResponseEntity.ok(eventos);
    }

    /**
     * Recalcula momios para eventos sin momios
     */
    @PostMapping("/calcular-momios")
    public ResponseEntity<String> calcularMomios() {
        log.info("Iniciando cálculo de momios para eventos sin momios");
        
        try {
            momioCalculatorService.calcularMomiosParaEventosSinMomios();
            return ResponseEntity.ok("Cálculo de momios completado exitosamente");
        } catch (Exception e) {
            log.error("Error calculando momios: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body("Error calculando momios: " + e.getMessage());
        }
    }

    /**
     * Actualiza momios para eventos próximos
     */
    @PostMapping("/actualizar-momios")
    public ResponseEntity<String> actualizarMomios() {
        log.info("Iniciando actualización de momios para eventos próximos");
        
        try {
            momioCalculatorService.actualizarMomiosEventosProximos();
            return ResponseEntity.ok("Actualización de momios completada exitosamente");
        } catch (Exception e) {
            log.error("Error actualizando momios: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body("Error actualizando momios: " + e.getMessage());
        }
    }

    /**
     * Calcula momios para un evento específico
     */
    @PostMapping("/calcular/{eventoId}")
    public ResponseEntity<String> calcularMomiosEvento(@PathVariable Long eventoId) {
        log.info("Calculando momios para evento: {}", eventoId);
        
        try {
            EventoDeportivo evento = eventoDeportivoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
                
            momioCalculatorService.calcularMomiosParaEvento(evento);
            return ResponseEntity.ok("Momios calculados exitosamente para el evento");
        } catch (Exception e) {
            log.error("Error calculando momios para evento {}: {}", eventoId, e.getMessage());
            return ResponseEntity.internalServerError()
                .body("Error calculando momios: " + e.getMessage());
        }
    }

    /**
     * Obtiene un momio específico por ID
     */
    @GetMapping("/{momioId}")
    public ResponseEntity<Momio> obtenerMomio(@PathVariable Long momioId) {
        log.info("Obteniendo momio: {}", momioId);
        
        Momio momio = momioRepository.findById(momioId)
            .orElseThrow(() -> new RuntimeException("Momio no encontrado"));
            
        return ResponseEntity.ok(momio);
    }

    /**
     * Obtiene estadísticas de momios
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<EstadisticasMomiosDto> obtenerEstadisticas() {
        log.info("Obteniendo estadísticas de momios");
        
        long totalMomios = momioRepository.countByActivoTrue();
        long totalEventosConMomios = momioRepository.countDistinctEventosByActivoTrue();
        long momiosCalculados = momioRepository.countByFuenteAndActivoTrue(Momio.FuenteMomio.CALCULADO);
        long momiosManuales = momioRepository.countByFuenteAndActivoTrue(Momio.FuenteMomio.MANUAL);
        
        EstadisticasMomiosDto estadisticas = new EstadisticasMomiosDto(
            totalMomios,
            totalEventosConMomios,
            momiosCalculados,
            momiosManuales
        );
        
        return ResponseEntity.ok(estadisticas);
    }

    /**
     * DTO para estadísticas de momios
     */
    public static class EstadisticasMomiosDto {
        private final long totalMomios;
        private final long totalEventosConMomios;
        private final long momiosCalculados;
        private final long momiosManuales;

        public EstadisticasMomiosDto(long totalMomios, long totalEventosConMomios, 
                                    long momiosCalculados, long momiosManuales) {
            this.totalMomios = totalMomios;
            this.totalEventosConMomios = totalEventosConMomios;
            this.momiosCalculados = momiosCalculados;
            this.momiosManuales = momiosManuales;
        }

        public long getTotalMomios() { return totalMomios; }
        public long getTotalEventosConMomios() { return totalEventosConMomios; }
        public long getMomiosCalculados() { return momiosCalculados; }
        public long getMomiosManuales() { return momiosManuales; }
    }
}
