package com._bet.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import lombok.RequiredArgsConstructor;

import java.time.Duration;

/**
 * Configuración para TheSportsDB Service con timeouts optimizados para v1 y v2
 */
@Configuration
@RequiredArgsConstructor
public class TheSportsDbConfig {

    private final TheSportsDbV2Properties properties;

    /**
     * Bean para RestTemplate usado en las llamadas a la API
     * Configurado con timeouts específicos de las propiedades
     */
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .connectTimeout(Duration.ofMillis(properties.getTimeout().getConnect()))
            .readTimeout(Duration.ofMillis(properties.getTimeout().getRead()))
            .build();
    }
}
