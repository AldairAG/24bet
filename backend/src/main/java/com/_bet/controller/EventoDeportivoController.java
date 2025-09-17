package com._bet.controller;

import com._bet.dto.EventoDeportivoConMomiosDto;
import com._bet.dto.MomioDto;
import com._bet.service.EventoDeportivoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Controller REST para manejar eventos deportivos con momios en tiempo real
 * Diseñado para aplicaciones de casino y apuestas deportivas
 */
@RestController
@RequestMapping("/24bet/eventos-deportivos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
@Tag(name = "Eventos Deportivos", description = "API para gestionar eventos deportivos con momios en tiempo real")
public class EventoDeportivoController {

    private final EventoDeportivoService eventoDeportivoService;

    /**
     * Obtiene todos los eventos deportivos con momios (paginado)
     */
    @GetMapping
    @Operation(summary = "Obtener todos los eventos deportivos con momios", 
               description = "Retorna una lista paginada de eventos deportivos activos con sus momios correspondientes")
    public ResponseEntity<ApiResponse<Page<EventoDeportivoConMomiosDto>>> obtenerEventosConMomios(
            @PageableDefault(size = 20) Pageable pageable) {
        
        log.info("GET /api/eventos-deportivos - Página: {}, Tamaño: {}", pageable.getPageNumber(), pageable.getPageSize());
        
        try {
            Page<EventoDeportivoConMomiosDto> eventos = eventoDeportivoService.obtenerEventosConMomios(pageable);
            
            return ResponseEntity.ok(ApiResponse.<Page<EventoDeportivoConMomiosDto>>builder()
                .success(true)
                .message("Eventos obtenidos exitosamente")
                .data(eventos)
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            log.error("Error al obtener eventos deportivos: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<Page<EventoDeportivoConMomiosDto>>builder()
                .success(false)
                .message("Error al obtener eventos deportivos: " + e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
        }
    }

    /**
     * Obtiene eventos deportivos en vivo con momios actualizados
     */
    @GetMapping("/en-vivo")
    @Operation(summary = "Obtener eventos deportivos en vivo", 
               description = "Retorna eventos que están siendo jugados actualmente con momios en tiempo real")
    public ResponseEntity<ApiResponse<List<EventoDeportivoConMomiosDto>>> obtenerEventosEnVivo() {
        
        log.info("GET /api/eventos-deportivos/en-vivo");
        
        try {
            List<EventoDeportivoConMomiosDto> eventosEnVivo = eventoDeportivoService.obtenerEventosEnVivo();
            
            return ResponseEntity.ok(ApiResponse.<List<EventoDeportivoConMomiosDto>>builder()
                .success(true)
                .message("Eventos en vivo obtenidos exitosamente")
                .data(eventosEnVivo)
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            log.error("Error al obtener eventos en vivo: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<List<EventoDeportivoConMomiosDto>>builder()
                .success(false)
                .message("Error al obtener eventos en vivo: " + e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
        }
    }

    /**
     * Obtiene eventos deportivos próximos (próximas 24 horas)
     */
    @GetMapping("/proximos")
    @Operation(summary = "Obtener eventos deportivos próximos", 
               description = "Retorna eventos que se realizarán en las próximas 24 horas con momios disponibles para apostar")
    public ResponseEntity<ApiResponse<List<EventoDeportivoConMomiosDto>>> obtenerEventosProximos() {
        
        log.info("GET /api/eventos-deportivos/proximos");
        
        try {
            List<EventoDeportivoConMomiosDto> eventosProximos = eventoDeportivoService.obtenerEventosProximos();
            
            return ResponseEntity.ok(ApiResponse.<List<EventoDeportivoConMomiosDto>>builder()
                .success(true)
                .message("Eventos próximos obtenidos exitosamente")
                .data(eventosProximos)
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            log.error("Error al obtener eventos próximos: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<List<EventoDeportivoConMomiosDto>>builder()
                .success(false)
                .message("Error al obtener eventos próximos: " + e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
        }
    }

    /**
     * Obtiene un evento deportivo específico por ID con sus momios
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener evento deportivo por ID", 
               description = "Retorna un evento deportivo específico con todos sus momios disponibles")
    public ResponseEntity<ApiResponse<EventoDeportivoConMomiosDto>> obtenerEventoPorId(
            @Parameter(description = "ID del evento deportivo") @PathVariable Long id) {
        
        log.info("GET /api/eventos-deportivos/{}", id);
        
        try {
            EventoDeportivoConMomiosDto evento = eventoDeportivoService.obtenerEventoPorId(id);
            
            return ResponseEntity.ok(ApiResponse.<EventoDeportivoConMomiosDto>builder()
                .success(true)
                .message("Evento obtenido exitosamente")
                .data(evento)
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            log.error("Error al obtener evento por ID {}: ", id, e);
            return ResponseEntity.badRequest().body(ApiResponse.<EventoDeportivoConMomiosDto>builder()
                .success(false)
                .message("Error al obtener evento: " + e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
        }
    }

    /**
     * Obtiene momios de un evento específico
     */
    @GetMapping("/{id}/momios")
    @Operation(summary = "Obtener momios de un evento", 
               description = "Retorna todos los momios disponibles para un evento deportivo específico")
    public ResponseEntity<ApiResponse<List<MomioDto>>> obtenerMomiosDeEvento(
            @Parameter(description = "ID del evento deportivo") @PathVariable Long id) {
        
        log.info("GET /api/eventos-deportivos/{}/momios", id);
        
        try {
            List<MomioDto> momios = eventoDeportivoService.obtenerMomiosDeEvento(id);
            
            return ResponseEntity.ok(ApiResponse.<List<MomioDto>>builder()
                .success(true)
                .message("Momios obtenidos exitosamente")
                .data(momios)
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            log.error("Error al obtener momios del evento {}: ", id, e);
            return ResponseEntity.badRequest().body(ApiResponse.<List<MomioDto>>builder()
                .success(false)
                .message("Error al obtener momios: " + e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
        }
    }

    /**
     * Obtiene eventos deportivos por rango de fechas
     */
    @GetMapping("/por-fechas")
    @Operation(summary = "Obtener eventos por rango de fechas", 
               description = "Retorna eventos deportivos en un rango de fechas específico")
    public ResponseEntity<ApiResponse<List<EventoDeportivoConMomiosDto>>> obtenerEventosPorRangoFechas(
            @Parameter(description = "Fecha de inicio (formato: yyyy-MM-dd'T'HH:mm:ss)") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @Parameter(description = "Fecha de fin (formato: yyyy-MM-dd'T'HH:mm:ss)") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        
        log.info("GET /api/eventos-deportivos/por-fechas - Desde: {} hasta: {}", fechaInicio, fechaFin);
        
        try {
            List<EventoDeportivoConMomiosDto> eventos = eventoDeportivoService.obtenerEventosPorRangoFechas(fechaInicio, fechaFin);
            
            return ResponseEntity.ok(ApiResponse.<List<EventoDeportivoConMomiosDto>>builder()
                .success(true)
                .message("Eventos obtenidos exitosamente")
                .data(eventos)
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            log.error("Error al obtener eventos por rango de fechas: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<List<EventoDeportivoConMomiosDto>>builder()
                .success(false)
                .message("Error al obtener eventos: " + e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
        }
    }

    /**
     * Obtiene eventos deportivos por liga
     */
    @GetMapping("/por-liga/{ligaSportsDbId}")
    @Operation(summary = "Obtener eventos por liga", 
               description = "Retorna eventos deportivos de una liga específica")
    public ResponseEntity<ApiResponse<List<EventoDeportivoConMomiosDto>>> obtenerEventosPorLiga(
            @Parameter(description = "ID de la liga en TheSportsDB") @PathVariable String ligaSportsDbId) {
        
        log.info("GET /api/eventos-deportivos/por-liga/{}", ligaSportsDbId);
        
        try {
            List<EventoDeportivoConMomiosDto> eventos = eventoDeportivoService.obtenerEventosPorLiga(ligaSportsDbId);
            
            return ResponseEntity.ok(ApiResponse.<List<EventoDeportivoConMomiosDto>>builder()
                .success(true)
                .message("Eventos de la liga obtenidos exitosamente")
                .data(eventos)
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            log.error("Error al obtener eventos por liga {}: ", ligaSportsDbId, e);
            return ResponseEntity.badRequest().body(ApiResponse.<List<EventoDeportivoConMomiosDto>>builder()
                .success(false)
                .message("Error al obtener eventos de la liga: " + e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
        }
    }

    /**
     * Endpoint para obtener estadísticas generales de eventos
     */
    @GetMapping("/estadisticas")
    @Operation(summary = "Obtener estadísticas de eventos", 
               description = "Retorna estadísticas generales sobre eventos deportivos y momios")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerEstadisticasEventos() {
        
        log.info("GET /api/eventos-deportivos/estadisticas");
        
        try {
            // Aquí podrías agregar lógica para calcular estadísticas
            Map<String, Object> estadisticas = Map.of(
                "mensaje", "Endpoint de estadísticas - implementar según necesidades",
                "timestamp", LocalDateTime.now()
            );
            
            return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Estadísticas obtenidas exitosamente")
                .data(estadisticas)
                .timestamp(LocalDateTime.now())
                .build());
                
        } catch (Exception e) {
            log.error("Error al obtener estadísticas: ", e);
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                .success(false)
                .message("Error al obtener estadísticas: " + e.getMessage())
                .timestamp(LocalDateTime.now())
                .build());
        }
    }

    /**
     * Clase para respuesta estándar de la API
     */
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;
        private LocalDateTime timestamp;

        // Constructor, getters y builder
        public static <T> ApiResponseBuilder<T> builder() {
            return new ApiResponseBuilder<>();
        }

        public static class ApiResponseBuilder<T> {
            private boolean success;
            private String message;
            private T data;
            private LocalDateTime timestamp;

            public ApiResponseBuilder<T> success(boolean success) {
                this.success = success;
                return this;
            }

            public ApiResponseBuilder<T> message(String message) {
                this.message = message;
                return this;
            }

            public ApiResponseBuilder<T> data(T data) {
                this.data = data;
                return this;
            }

            public ApiResponseBuilder<T> timestamp(LocalDateTime timestamp) {
                this.timestamp = timestamp;
                return this;
            }

            public ApiResponse<T> build() {
                ApiResponse<T> response = new ApiResponse<>();
                response.success = this.success;
                response.message = this.message;
                response.data = this.data;
                response.timestamp = this.timestamp;
                return response;
            }
        }

        // Getters
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public T getData() { return data; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
}