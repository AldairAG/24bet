package com._bet.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad JPA para manejar información de ligas/competiciones desde TheSportsDB API
 * Adaptada para v1 y v2 de la API
 */
@Entity
@Table(name = "ligas", indexes = {
    @Index(name = "idx_liga_sports_db_id", columnList = "sportsDbId"),
    @Index(name = "idx_liga_nombre", columnList = "nombre"),
    @Index(name = "idx_liga_deporte_id", columnList = "deporte_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"equipos", "eventos", "deporte"})
@EqualsAndHashCode(exclude = {"equipos", "eventos", "deporte"})
public class Liga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID de la liga en TheSportsDB API
     */
    @Column(name = "sports_db_id", unique = true)
    private String sportsDbId;

    /**
     * Nombre de la liga
     */
    @NotBlank(message = "El nombre de la liga es obligatorio")
    @Size(max = 150, message = "El nombre no puede exceder 150 caracteres")
    @Column(name = "nombre", nullable = false)
    private String nombre;

    /**
     * Nombre alternativo de la liga
     */
    @Column(name = "nombre_alternativo")
    private String nombreAlternativo;

    /**
     * Descripción de la liga
     */
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    /**
     * País de la liga
     */
    @Column(name = "pais")
    private String pais;

    /**
     * URL del logo de la liga
     */
    @Column(name = "logo_url")
    private String logoUrl;

    /**
     * URL del badge de la liga
     */
    @Column(name = "badge_url")
    private String badgeUrl;

    /**
     * URL del banner de la liga
     */
    @Column(name = "banner_url")
    private String bannerUrl;

    /**
     * URL del poster de la liga
     */
    @Column(name = "poster_url")
    private String posterUrl;

    /**
     * URL del trophy de la liga
     */
    @Column(name = "trophy_url")
    private String trophyUrl;

    /**
     * Año de fundación de la liga
     */
    @Column(name = "ano_fundacion")
    private Integer anoFundacion;

    /**
     * Temporada actual
     */
    @Column(name = "temporada_actual")
    private String temporadaActual;

    /**
     * Sitio web oficial de la liga
     */
    @Column(name = "sitio_web")
    private String sitioWeb;

    /**
     * Facebook oficial
     */
    @Column(name = "facebook")
    private String facebook;

    /**
     * Twitter oficial
     */
    @Column(name = "twitter")
    private String twitter;

    /**
     * YouTube oficial
     */
    @Column(name = "youtube")
    private String youtube;

    /**
     * RSS feed
     */
    @Column(name = "rss")
    private String rss;

    /**
     * Género de la liga (ej: "All", "Male", "Female")
     */
    @Column(name = "genero")
    private String genero;

    /**
     * Indica si la liga está activa/disponible
     */
    @Builder.Default
    @Column(name = "activa", nullable = false)
    private Boolean activa = true;

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
     * Relación muchos a uno con Deporte
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deporte_id", nullable = false)
    @NotNull(message = "El deporte es obligatorio")
    private Deporte deporte;

    /**
     * Relación uno a muchos con Equipo
     */
    @OneToMany(mappedBy = "liga", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Equipo> equipos;

    /**
     * Relación uno a muchos con EventoDeportivo
     */
    @OneToMany(mappedBy = "liga", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EventoDeportivo> eventos;
}
