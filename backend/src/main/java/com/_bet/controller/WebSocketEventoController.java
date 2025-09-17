package com._bet.controller;

import com._bet.dto.EventoDeportivoConMomiosDto;
import com._bet.dto.MomioDto;
import com._bet.service.EventoDeportivoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Controller WebSocket para actualizaciones en tiempo real de eventos deportivos y momios
 */
@Controller
@RequiredArgsConstructor
@Slf4j
@EnableScheduling
public class WebSocketEventoController {

    private final SimpMessagingTemplate messagingTemplate;
    private final EventoDeportivoService eventoDeportivoService;

    /**
     * Maneja peticiones de suscripción a actualizaciones de momios
     */
    @MessageMapping("/suscribir-momios")
    @SendTo("/topic/momios-actualizados")
    public Map<String, Object> suscribirActualizacionesMomios() {
        log.info("Cliente suscrito a actualizaciones de momios");
        
        return Map.of(
            "tipo", "SUSCRIPCION_CONFIRMADA",
            "mensaje", "Suscripción a momios confirmada",
            "timestamp", LocalDateTime.now()
        );
    }

    /**
     * Maneja peticiones de suscripción a eventos en vivo
     */
    @MessageMapping("/suscribir-eventos-vivo")
    @SendTo("/topic/eventos-vivo")
    public Map<String, Object> suscribirEventosEnVivo() {
        log.info("Cliente suscrito a eventos en vivo");
        
        return Map.of(
            "tipo", "SUSCRIPCION_CONFIRMADA",
            "mensaje", "Suscripción a eventos en vivo confirmada",
            "timestamp", LocalDateTime.now()
        );
    }

    /**
     * Envía actualizaciones periódicas de momios (cada 30 segundos)
     */
    @Scheduled(fixedRate = 30000) // 30 segundos
    public void enviarActualizacionesMomios() {
        try {
            // Obtener eventos en vivo con momios actualizados
            List<EventoDeportivoConMomiosDto> eventosEnVivo = eventoDeportivoService.obtenerEventosEnVivo();
            
            if (!eventosEnVivo.isEmpty()) {
                Map<String, Object> actualizacion = Map.of(
                    "tipo", "MOMIOS_ACTUALIZADOS",
                    "eventos", eventosEnVivo,
                    "timestamp", LocalDateTime.now(),
                    "totalEventos", eventosEnVivo.size()
                );

                // Enviar a todos los clientes suscritos
                messagingTemplate.convertAndSend("/topic/momios-actualizados", actualizacion);
                log.debug("Enviadas actualizaciones de momios para {} eventos", eventosEnVivo.size());
            }
            
        } catch (Exception e) {
            log.error("Error al enviar actualizaciones de momios: ", e);
        }
    }

    /**
     * Envía actualizaciones de eventos próximos (cada 2 minutos)
     */
    @Scheduled(fixedRate = 120000) // 2 minutos
    public void enviarEventosProximos() {
        try {
            List<EventoDeportivoConMomiosDto> eventosProximos = eventoDeportivoService.obtenerEventosProximos();
            
            Map<String, Object> actualizacion = Map.of(
                "tipo", "EVENTOS_PROXIMOS",
                "eventos", eventosProximos,
                "timestamp", LocalDateTime.now(),
                "totalEventos", eventosProximos.size()
            );

            messagingTemplate.convertAndSend("/topic/eventos-proximos", actualizacion);
            log.debug("Enviados {} eventos próximos", eventosProximos.size());
            
        } catch (Exception e) {
            log.error("Error al enviar eventos próximos: ", e);
        }
    }

    /**
     * Envía actualizaciones de un evento específico
     */
    public void enviarActualizacionEvento(Long eventoId) {
        try {
            EventoDeportivoConMomiosDto evento = eventoDeportivoService.obtenerEventoPorId(eventoId);
            
            Map<String, Object> actualizacion = Map.of(
                "tipo", "EVENTO_ACTUALIZADO",
                "evento", evento,
                "eventoId", eventoId,
                "timestamp", LocalDateTime.now()
            );

            // Enviar a canal específico del evento
            messagingTemplate.convertAndSend("/topic/evento/" + eventoId, actualizacion);
            
            // También enviar al canal general de momios si el evento está en vivo
            if (evento.getEnVivo() != null && evento.getEnVivo()) {
                messagingTemplate.convertAndSend("/topic/momios-actualizados", actualizacion);
            }
            
            log.debug("Enviada actualización del evento {}", eventoId);
            
        } catch (Exception e) {
            log.error("Error al enviar actualización del evento {}: ", eventoId, e);
        }
    }

    /**
     * Envía actualización cuando cambia un momio específico
     */
    public void enviarActualizacionMomio(Long eventoId, MomioDto momio) {
        try {
            Map<String, Object> actualizacion = Map.of(
                "tipo", "MOMIO_ACTUALIZADO",
                "eventoId", eventoId,
                "momio", momio,
                "timestamp", LocalDateTime.now()
            );

            // Enviar a canales específicos
            messagingTemplate.convertAndSend("/topic/evento/" + eventoId + "/momios", actualizacion);
            messagingTemplate.convertAndSend("/topic/momios-actualizados", actualizacion);
            
            log.debug("Enviada actualización del momio {} para evento {}", momio.getId(), eventoId);
            
        } catch (Exception e) {
            log.error("Error al enviar actualización de momio: ", e);
        }
    }

    /**
     * Envía notificación cuando comienza un nuevo evento en vivo
     */
    public void enviarNuevoEventoEnVivo(EventoDeportivoConMomiosDto evento) {
        try {
            Map<String, Object> notificacion = Map.of(
                "tipo", "NUEVO_EVENTO_VIVO",
                "evento", evento,
                "mensaje", "¡Nuevo evento en vivo disponible para apostar!",
                "timestamp", LocalDateTime.now()
            );

            messagingTemplate.convertAndSend("/topic/eventos-vivo", notificacion);
            messagingTemplate.convertAndSend("/topic/notificaciones", notificacion);
            
            log.info("Enviada notificación de nuevo evento en vivo: {}", evento.getNombre());
            
        } catch (Exception e) {
            log.error("Error al enviar notificación de nuevo evento en vivo: ", e);
        }
    }

    /**
     * Envía estadísticas en tiempo real (cada 5 minutos)
     */
    @Scheduled(fixedRate = 300000) // 5 minutos
    public void enviarEstadisticasEnTiempoReal() {
        try {
            List<EventoDeportivoConMomiosDto> eventosEnVivo = eventoDeportivoService.obtenerEventosEnVivo();
            List<EventoDeportivoConMomiosDto> eventosProximos = eventoDeportivoService.obtenerEventosProximos();
            
            Map<String, Object> estadisticas = Map.of(
                "tipo", "ESTADISTICAS_TIEMPO_REAL",
                "eventosEnVivo", eventosEnVivo.size(),
                "eventosProximos", eventosProximos.size(),
                "totalEventosActivos", eventosEnVivo.size() + eventosProximos.size(),
                "timestamp", LocalDateTime.now()
            );

            messagingTemplate.convertAndSend("/topic/estadisticas", estadisticas);
            log.debug("Enviadas estadísticas en tiempo real");
            
        } catch (Exception e) {
            log.error("Error al enviar estadísticas en tiempo real: ", e);
        }
    }
}