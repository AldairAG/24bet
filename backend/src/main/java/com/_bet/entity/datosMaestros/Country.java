package com._bet.entity.datosMaestros;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad JPA para manejar información de países
 */
@Entity
@Table(name = "countries", indexes = {
    @Index(name = "idx_country_name", columnList = "name"),
    @Index(name = "idx_country_code", columnList = "country_code")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"ligas"})
@EqualsAndHashCode(exclude = {"ligas"})
public class Country { 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Nombre del país en inglés
     */
    @NotBlank(message = "El nombre del país es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    @Column(name = "name", nullable = false)
    private String name;
    
    /**
     * Código del país (ISO 3166-1 alpha-2)
     */
    @Column(name = "country_code", length = 2)
    private String countryCode;
    
    
    /**
     * URL de la bandera del país
     */
    @Column(name = "flag_url")
    private String flagUrl;
    
    /**
     * Nombre del país en español
     */
    @Column(name = "name_es")
    private String nameEs;
    
    /**
     * Indica si el país está activo
     */
    @Builder.Default
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
    
    /**
     * Timestamp de creación del registro
     */
    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    /**
     * Timestamp de última actualización
     */
    @UpdateTimestamp
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;
    
    /**
     * Relación uno a muchos con Liga
     */
    @OneToMany(mappedBy = "pais", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Liga> ligas;
}
