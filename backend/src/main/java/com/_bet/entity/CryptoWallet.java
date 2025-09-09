package com._bet.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "crypto_wallets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoWallet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false)
    @NotBlank(message = "El nombre del wallet es obligatorio")
    @Size(max = 100, message = "El nombre del wallet no puede exceder 100 caracteres")
    private String nombre;
    
    @Column(name = "address", nullable = false, unique = true)
    @NotBlank(message = "La dirección del wallet es obligatoria")
    @Size(max = 255, message = "La dirección del wallet no puede exceder 255 caracteres")
    private String address;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_crypto", nullable = false)
    @NotNull(message = "El tipo de criptomoneda es obligatorio")
    private TipoCrypto tipoCrypto;
    
    @Column(name = "numero_transacciones", nullable = false)
    @PositiveOrZero(message = "El número de transacciones no puede ser negativo")
    private Long numeroTransacciones = 0L;
    
    @Column(name = "total_retirado", precision = 19, scale = 8, nullable = false)
    @PositiveOrZero(message = "El total retirado no puede ser negativo")
    private BigDecimal totalRetirado = BigDecimal.ZERO;
    
    @Column(name = "balance_actual", precision = 19, scale = 8, nullable = false)
    @PositiveOrZero(message = "El balance actual no puede ser negativo")
    private BigDecimal balanceActual = BigDecimal.ZERO;
    
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
    
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;
    
    @Column(name = "ultima_transaccion")
    private LocalDateTime ultimaTransaccion;
    
    // ========== RELACIÓN CON USUARIO ==========
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @NotNull(message = "El usuario es obligatorio")
    @JsonBackReference
    private Usuario usuario;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
    
    // ========== MÉTODOS DE UTILIDAD ==========
    
    /**
     * Incrementa el número de transacciones en 1
     */
    public void incrementarTransacciones() {
        this.numeroTransacciones++;
        this.ultimaTransaccion = LocalDateTime.now();
    }
    
    /**
     * Suma una cantidad al total retirado
     * @param cantidad cantidad a sumar
     */
    public void sumarRetirado(BigDecimal cantidad) {
        if (cantidad != null && cantidad.compareTo(BigDecimal.ZERO) > 0) {
            this.totalRetirado = this.totalRetirado.add(cantidad);
        }
    }
    
    /**
     * Actualiza el balance actual del wallet
     * @param nuevoBalance nuevo balance
     */
    public void actualizarBalance(BigDecimal nuevoBalance) {
        if (nuevoBalance != null && nuevoBalance.compareTo(BigDecimal.ZERO) >= 0) {
            this.balanceActual = nuevoBalance;
        }
    }
    
    /**
     * Verifica si el wallet está activo y tiene balance suficiente para una transacción
     * @param cantidad cantidad a verificar
     * @return true si puede realizar la transacción
     */
    public boolean puedeRetirar(BigDecimal cantidad) {
        return this.activo && 
               cantidad != null && 
               cantidad.compareTo(BigDecimal.ZERO) > 0 &&
               this.balanceActual.compareTo(cantidad) >= 0;
    }
    
    // ========== ENUM TIPO CRYPTO ==========
    
    public enum TipoCrypto {
        BITCOIN("BTC", "Bitcoin"),
        ETHEREUM("ETH", "Ethereum"),
        LITECOIN("LTC", "Litecoin"),
        RIPPLE("XRP", "Ripple"),
        CARDANO("ADA", "Cardano"),
        POLKADOT("DOT", "Polkadot"),
        CHAINLINK("LINK", "Chainlink"),
        BITCOIN_CASH("BCH", "Bitcoin Cash"),
        STELLAR("XLM", "Stellar"),
        DOGECOIN("DOGE", "Dogecoin"),
        POLYGON("MATIC", "Polygon"),
        SOLANA("SOL", "Solana"),
        AVALANCHE("AVAX", "Avalanche"),
        TRON("TRX", "Tron"),
        BINANCE_COIN("BNB", "Binance Coin"),
        USDT("USDT", "Tether"),
        USDC("USDC", "USD Coin"),
        BUSD("BUSD", "Binance USD");
        
        private final String simbolo;
        private final String nombreCompleto;
        
        TipoCrypto(String simbolo, String nombreCompleto) {
            this.simbolo = simbolo;
            this.nombreCompleto = nombreCompleto;
        }
        
        public String getSimbol() {
            return simbolo;
        }
        
        public String getNombreCompleto() {
            return nombreCompleto;
        }
    }
}
