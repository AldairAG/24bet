package com._bet.entity.datosMaestros;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad JPA para manejar información de deportes desde TheSportsDB API
 * Adaptada para v1 y v2 de la API
 */
@Entity
@Table(name = "deportes", indexes = {
    @Index(name = "idx_deporte_sports_db_id", columnList = "sportsDbId"),
    @Index(name = "idx_deporte_nombre", columnList = "nombre")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "ligas")
@EqualsAndHashCode(exclude = "ligas")
public class Deporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID del deporte en TheSportsDB API
     */
    @Column(name = "sports_db_id", unique = true)
    private String sportsDbId;

    /**
     * Nombre del deporte
     */
    @NotBlank(message = "El nombre del deporte es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    @Column(name = "nombre", nullable = false)
    private String nombre;

    /**
     * Nombre del deporte en inglés (original de la API)
     */
    @Column(name = "nombre_ingles")
    private String nombreIngles;

    /**
     * Descripción del deporte
     */
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    /**
     * URL de la imagen/logo del deporte
     */
    @Column(name = "imagen_url")
    private String imagenUrl;

    /**
     * URL del thumb/miniatura del deporte
     */
    @Column(name = "thumb_url")
    private String thumbUrl;

    /**
     * Formato del deporte (ej: "TeamSport", "Individual")
     */
    @Column(name = "formato")
    private String formato;

    /**
     * Género del deporte (ej: "All", "Male", "Female")
     */
    @Column(name = "genero")
    private String genero;

    /**
     * Indica si el deporte está activo/disponible
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
    @OneToMany(mappedBy = "deporte", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Liga> ligas;
}
