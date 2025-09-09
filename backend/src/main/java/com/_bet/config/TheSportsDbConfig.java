package com._bet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuración para TheSportsDB Service
 */
@Configuration
public class TheSportsDbConfig {

    /**
     * Bean para RestTemplate usado en las llamadas a la API
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
