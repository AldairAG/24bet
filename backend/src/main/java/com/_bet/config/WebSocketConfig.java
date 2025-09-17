package com._bet.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Configuración de WebSocket para actualizaciones en tiempo real
 * Usado para enviar actualizaciones de momios y eventos deportivos
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Habilita un broker de memoria simple que llevará mensajes de vuelta al cliente
        // en destinos prefijados con "/topic" y "/queue"
        config.enableSimpleBroker("/topic", "/queue");
        
        // Los mensajes cuyo destino comience con "/app" serán enrutados a métodos 
        // anotados con @MessageMapping en controllers
        config.setApplicationDestinationPrefixes("/app");
        
        // Configuración específica para usuarios individuales
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Registra el endpoint "/ws" que los clientes utilizarán para conectarse al servidor WebSocket
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*") // En producción, especifica dominios exactos
                .withSockJS(); // Habilita el fallback SockJS
        
        // Endpoint específico para momios en tiempo real
        registry.addEndpoint("/ws-momios")
                .setAllowedOrigins("*")
                .withSockJS();
    }
}