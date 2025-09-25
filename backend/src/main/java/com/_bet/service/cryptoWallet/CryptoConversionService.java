package com._bet.service.cryptoWallet;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com._bet.entity.user.CryptoWallet;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CryptoConversionService {
    
    // RestTemplate para futuras llamadas a APIs externas
    // private final RestTemplate restTemplate = new RestTemplate();
    
    // Cache simple para las tasas de conversión (en producción usar Redis)
    private final Map<CryptoWallet.TipoCrypto, CacheTasa> cacheConversiones = new HashMap<>();
    private static final long CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos
    
    // Tasas fijas como fallback en caso de falla de API
    private static final Map<CryptoWallet.TipoCrypto, BigDecimal> TASAS_FALLBACK;
    
    static {
        Map<CryptoWallet.TipoCrypto, BigDecimal> tasas = new HashMap<>();
        tasas.put(CryptoWallet.TipoCrypto.BITCOIN, new BigDecimal("43000.00"));
        tasas.put(CryptoWallet.TipoCrypto.ETHEREUM, new BigDecimal("2400.00"));
        tasas.put(CryptoWallet.TipoCrypto.LITECOIN, new BigDecimal("70.00"));
        tasas.put(CryptoWallet.TipoCrypto.RIPPLE, new BigDecimal("0.60"));
        tasas.put(CryptoWallet.TipoCrypto.CARDANO, new BigDecimal("0.35"));
        tasas.put(CryptoWallet.TipoCrypto.POLKADOT, new BigDecimal("5.20"));
        tasas.put(CryptoWallet.TipoCrypto.CHAINLINK, new BigDecimal("14.50"));
        tasas.put(CryptoWallet.TipoCrypto.BITCOIN_CASH, new BigDecimal("200.00"));
        tasas.put(CryptoWallet.TipoCrypto.STELLAR, new BigDecimal("0.12"));
        tasas.put(CryptoWallet.TipoCrypto.DOGECOIN, new BigDecimal("0.08"));
        tasas.put(CryptoWallet.TipoCrypto.POLYGON, new BigDecimal("0.90"));
        tasas.put(CryptoWallet.TipoCrypto.SOLANA, new BigDecimal("20.00"));
        tasas.put(CryptoWallet.TipoCrypto.AVALANCHE, new BigDecimal("25.00"));
        tasas.put(CryptoWallet.TipoCrypto.TRON, new BigDecimal("0.10"));
        tasas.put(CryptoWallet.TipoCrypto.BINANCE_COIN, new BigDecimal("310.00"));
        tasas.put(CryptoWallet.TipoCrypto.USDT, new BigDecimal("1.00"));
        tasas.put(CryptoWallet.TipoCrypto.USDC, new BigDecimal("1.00"));
        tasas.put(CryptoWallet.TipoCrypto.BUSD, new BigDecimal("1.00"));
        TASAS_FALLBACK = Map.copyOf(tasas);
    }
    
    /**
     * Obtiene la tasa de conversión actual de una criptomoneda a USD
     */
    public BigDecimal getTasaConversion(CryptoWallet.TipoCrypto tipoCrypto) {
        try {
            // Verificar cache
            CacheTasa tasaCache = cacheConversiones.get(tipoCrypto);
            if (tasaCache != null && !tasaCache.estaExpirada()) {
                log.debug("Usando tasa desde cache para {}: {}", tipoCrypto, tasaCache.getTasa());
                return tasaCache.getTasa();
            }
            
            // Obtener tasa desde API externa
            BigDecimal tasaApi = obtenerTasaDesdeAPI(tipoCrypto);
            if (tasaApi != null) {
                // Guardar en cache
                cacheConversiones.put(tipoCrypto, new CacheTasa(tasaApi));
                log.info("Tasa obtenida desde API para {}: {}", tipoCrypto, tasaApi);
                return tasaApi;
            }
            
            // Fallback a tasa fija
            BigDecimal tasaFallback = TASAS_FALLBACK.get(tipoCrypto);
            log.warn("Usando tasa fallback para {}: {}", tipoCrypto, tasaFallback);
            return tasaFallback != null ? tasaFallback : BigDecimal.ONE;
            
        } catch (Exception e) {
            log.error("Error al obtener tasa de conversión para {}: {}", tipoCrypto, e.getMessage());
            
            // En caso de error, usar tasa fallback
            BigDecimal tasaFallback = TASAS_FALLBACK.get(tipoCrypto);
            return tasaFallback != null ? tasaFallback : BigDecimal.ONE;
        }
    }
    
    /**
     * Convierte una cantidad de crypto a USD
     */
    public BigDecimal convertirCryptoAUsd(BigDecimal cantidadCrypto, CryptoWallet.TipoCrypto tipoCrypto) {
        if (cantidadCrypto == null || cantidadCrypto.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal tasaConversion = getTasaConversion(tipoCrypto);
        return cantidadCrypto.multiply(tasaConversion).setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * Convierte una cantidad de USD a crypto
     */
    public BigDecimal convertirUsdACrypto(BigDecimal cantidadUsd, CryptoWallet.TipoCrypto tipoCrypto) {
        if (cantidadUsd == null || cantidadUsd.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal tasaConversion = getTasaConversion(tipoCrypto);
        if (tasaConversion.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return cantidadUsd.divide(tasaConversion, 8, RoundingMode.HALF_UP);
    }
    
    /**
     * Obtiene múltiples tasas de conversión
     */
    public Map<CryptoWallet.TipoCrypto, BigDecimal> getTasasConversion(CryptoWallet.TipoCrypto... tipos) {
        Map<CryptoWallet.TipoCrypto, BigDecimal> tasas = new HashMap<>();
        
        for (CryptoWallet.TipoCrypto tipo : tipos) {
            tasas.put(tipo, getTasaConversion(tipo));
        }
        
        return tasas;
    }
    
    /**
     * Limpia el cache de conversiones
     */
    public void limpiarCache() {
        cacheConversiones.clear();
        log.info("Cache de tasas de conversión limpiado");
    }
    
    /**
     * Obtiene tasa desde API externa (implementación básica)
     * En producción, usar APIs como CoinGecko, CoinMarketCap, etc.
     */
    private BigDecimal obtenerTasaDesdeAPI(CryptoWallet.TipoCrypto tipoCrypto) {
        try {
            // Aquí implementarías la llamada a la API externa
            // Por ejemplo, usando CoinGecko API:
            // String url = String.format("https://api.coingecko.com/api/v3/simple/price?ids=%s&vs_currencies=usd", 
            //                          mapearSimboloACoinGeckoId(tipoCrypto));
            
            // Implementación simulada - en producción hacer la llamada real
            log.debug("Simulando llamada a API para {}", tipoCrypto);
            
            // Por ahora retornamos null para usar fallback
            return null;
            
        } catch (Exception e) {
            log.error("Error al obtener tasa desde API para {}: {}", tipoCrypto, e.getMessage());
            return null;
        }
    }
    
    /**
     * Mapea el símbolo crypto al ID de CoinGecko
     * (Comentado temporalmente - se usará cuando se implemente la API real)
     */
    /*
    private String mapearSimboloACoinGeckoId(CryptoWallet.TipoCrypto tipoCrypto) {
        return switch (tipoCrypto) {
            case BITCOIN -> "bitcoin";
            case ETHEREUM -> "ethereum";
            case LITECOIN -> "litecoin";
            case RIPPLE -> "ripple";
            case CARDANO -> "cardano";
            case POLKADOT -> "polkadot";
            case CHAINLINK -> "chainlink";
            case BITCOIN_CASH -> "bitcoin-cash";
            case STELLAR -> "stellar";
            case DOGECOIN -> "dogecoin";
            case POLYGON -> "matic-network";
            case SOLANA -> "solana";
            case AVALANCHE -> "avalanche-2";
            case TRON -> "tron";
            case BINANCE_COIN -> "binancecoin";
            case USDT -> "tether";
            case USDC -> "usd-coin";
            case BUSD -> "binance-usd";
        };
    }
    */
    
    /**
     * Valida si una tasa de conversión es razonable
     */
    public boolean esTasaRazonable(BigDecimal tasa, CryptoWallet.TipoCrypto tipoCrypto) {
        if (tasa == null || tasa.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        
        BigDecimal tasaFallback = TASAS_FALLBACK.get(tipoCrypto);
        if (tasaFallback == null) {
            return true; // No hay referencia, aceptar
        }
        
        // La tasa debe estar dentro del 50% de la tasa fallback
        BigDecimal margenSuperior = tasaFallback.multiply(new BigDecimal("1.5"));
        BigDecimal margenInferior = tasaFallback.multiply(new BigDecimal("0.5"));
        
        return tasa.compareTo(margenInferior) >= 0 && tasa.compareTo(margenSuperior) <= 0;
    }
    
    // ========== CLASE AUXILIAR PARA CACHE ==========
    
    private static class CacheTasa {
        private final BigDecimal tasa;
        private final long timestamp;
        
        public CacheTasa(BigDecimal tasa) {
            this.tasa = tasa;
            this.timestamp = System.currentTimeMillis();
        }
        
        public BigDecimal getTasa() {
            return tasa;
        }
        
        public boolean estaExpirada() {
            return System.currentTimeMillis() - timestamp > CACHE_DURATION_MS;
        }
    }
}
