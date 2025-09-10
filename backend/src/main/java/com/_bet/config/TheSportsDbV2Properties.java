package com._bet.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de propiedades para TheSportsDB API v1 y v2
 * Soporta autenticación por header para v2 y configuración completa de timeouts
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "thesportsdb.api")
public class TheSportsDbV2Properties {

    /**
     * Configuración para API v1 (datos básicos - gratis)
     */
    private V1Config v1 = new V1Config();

    /**
     * Configuración para API v2 (datos en vivo - requiere autenticación)
     */
    private V2Config v2 = new V2Config();

    /**
     * Configuración de timeouts
     */
    private TimeoutConfig timeout = new TimeoutConfig();

    /**
     * Configuración de reintentos
     */
    private RetryConfig retry = new RetryConfig();

    /**
     * Configuración de caché
     */
    private CacheConfig cache = new CacheConfig();

    /**
     * Configuración de rate limiting
     */
    private RateLimitConfig rateLimit = new RateLimitConfig();

    @Data
    public static class V1Config {
        private String baseUrl = "https://www.thesportsdb.com/api/v1/json";
        private String key = "3";
    }

    @Data
    public static class V2Config {
        private String baseUrl = "https://www.thesportsdb.com/api/v2/json";
        private String key;
        private String headerName = "X-API-KEY";
    }

    @Data
    public static class TimeoutConfig {
        private int connect = 10000; // 10 seconds
        private int read = 30000;    // 30 seconds
    }

    @Data
    public static class RetryConfig {
        private int maxAttempts = 3;
        private long delay = 1000; // 1 second
    }

    @Data
    public static class CacheConfig {
        private boolean enabled = true;
        private int ttl = 3600; // 1 hour in seconds
    }

    @Data
    public static class RateLimitConfig {
        private int requestsPerMinute = 60;
    }
}
