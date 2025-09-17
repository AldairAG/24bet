package com._bet.service;

import com._bet.controller.WebSocketEventoController;
import com._bet.dto.EventoDeportivoConMomiosDto;
import com._bet.dto.MomioDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Servicio para manejar notificaciones en tiempo real
 * Centraliza el envío de actualizaciones a través de WebSocket
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificacionTiempoRealService {

    private final WebSocketEventoController webSocketController;

    /**
     * Notifica cuando se actualiza un evento deportivo
     */
    public void notificarActualizacionEvento(Long eventoId) {
        log.info("Notificando actualización del evento: {}", eventoId);
        try {
            webSocketController.enviarActualizacionEvento(eventoId);
        } catch (Exception e) {
            log.error("Error al notificar actualización del evento {}: ", eventoId, e);
        }
    }

    /**
     * Notifica cuando se actualiza un momio
     */
    public void notificarActualizacionMomio(Long eventoId, MomioDto momio) {
        log.info("Notificando actualización de momio {} para evento: {}", momio.getId(), eventoId);
        try {
            webSocketController.enviarActualizacionMomio(eventoId, momio);
        } catch (Exception e) {
            log.error("Error al notificar actualización de momio: ", e);
        }
    }

    /**
     * Notifica cuando un evento nuevo entra en vivo
     */
    public void notificarNuevoEventoEnVivo(EventoDeportivoConMomiosDto evento) {
        log.info("Notificando nuevo evento en vivo: {}", evento.getNombre());
        try {
            webSocketController.enviarNuevoEventoEnVivo(evento);
        } catch (Exception e) {
            log.error("Error al notificar nuevo evento en vivo: ", e);
        }
    }

    /**
     * Notifica cambios críticos en momios (cambios significativos)
     */
    public void notificarCambioCriticoMomio(Long eventoId, MomioDto momioAnterior, MomioDto momioNuevo) {
        // Solo notificar si hay un cambio significativo (por ejemplo, más del 10%)
        if (momioAnterior != null && momioNuevo != null) {
            double cambio = Math.abs(momioNuevo.getValor().doubleValue() - momioAnterior.getValor().doubleValue());
            double porcentajeCambio = (cambio / momioAnterior.getValor().doubleValue()) * 100;
            
            if (porcentajeCambio >= 10.0) {
                log.info("Cambio crítico en momio {} del evento {}: {}% de cambio", 
                    momioNuevo.getId(), eventoId, String.format("%.2f", porcentajeCambio));
                notificarActualizacionMomio(eventoId, momioNuevo);
            }
        }
    }
}