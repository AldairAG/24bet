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
 * Entidad JPA para manejar información de equipos desde TheSportsDB API
 * Adaptada para v1 y v2 de la API
 */
@Entity
@Table(name = "equipos", indexes = {
    @Index(name = "idx_equipo_sports_db_id", columnList = "sportsDbId"),
    @Index(name = "idx_equipo_nombre", columnList = "nombre"),
    @Index(name = "idx_equipo_liga_id", columnList = "liga_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"eventosComoLocal", "eventosComoVisitante", "liga"})
@EqualsAndHashCode(exclude = {"eventosComoLocal", "eventosComoVisitante", "liga"})
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID del equipo en TheSportsDB API
     */
    @Column(name = "sports_db_id", unique = true)
    private String sportsDbId;

    /**
     * Code del equipo
     */
    @Column(name = "code", length = 10)
    private String code;

    /**
     * ID del equipo en ApiSports API
     */
    @Column(name = "api_sports_id", unique = true)
    private int apiSportsId;

    /**
     * Nombre del equipo
     */
    @NotBlank(message = "El nombre del equipo es obligatorio")
    @Size(max = 150, message = "El nombre no puede exceder 150 caracteres")
    @Column(name = "nombre", nullable = false)
    private String nombre;

    /**
     * Nombre corto del equipo
     */
    @Column(name = "nombre_corto")
    private String nombreCorto;

    /**
     * Nombre alternativo del equipo
     */
    @Column(name = "nombre_alternativo")
    private String nombreAlternativo;

    /**
     * Descripción del equipo
     */
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    /**
     * País del equipo
     */
    @Column(name = "pais")
    private String pais;

    /**
     * Ciudad del equipo
     */
    @Column(name = "ciudad")
    private String ciudad;

    /**
     * Año de fundación del equipo
     */
    @Column(name = "ano_fundacion")
    private Integer anoFundacion;

    /**
     * URL del logo del equipo
     */
    @Column(name = "logo_url")
    private String logoUrl;

    /**
     * URL del badge del equipo
     */
    @Column(name = "badge_url")
    private String badgeUrl;

    /**
     * URL del jersey del equipo
     */
    @Column(name = "jersey_url")
    private String jerseyUrl;

    /**
     * URL del banner del equipo
     */
    @Column(name = "banner_url")
    private String bannerUrl;

    /**
     * URL del fanart del equipo
     */
    @Column(name = "fanart_url")
    private String fanartUrl;

    /**
     * Estadio del equipo
     */
    @Column(name = "estadio")
    private String estadio;

    /**
     * Capacidad del estadio
     */
    @Column(name = "capacidad_estadio")
    private Integer capacidadEstadio;

    /**
     * Ubicación del estadio
     */
    @Column(name = "ubicacion_estadio")
    private String ubicacionEstadio;

    /**
     * Sitio web oficial del equipo
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
     * Instagram oficial
     */
    @Column(name = "instagram")
    private String instagram;

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
     * Género del equipo (ej: "All", "Male", "Female")
     */
    @Column(name = "genero")
    private String genero;

    /**
     * Colores del equipo (formato JSON o string)
     */
    @Column(name = "colores")
    private String colores;

    /**
     * Indica si el equipo está activo/disponible
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
     * Relación muchos a uno con Liga
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "liga_id", nullable = false)
    @NotNull(message = "La liga es obligatoria")
    private Liga liga;

    /**
     * Relación uno a muchos con EventoDeportivo (como equipo local)
     */
    @OneToMany(mappedBy = "equipoLocal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EventoDeportivo> eventosComoLocal;

    /**
     * Relación uno a muchos con EventoDeportivo (como equipo visitante)
     */
    @OneToMany(mappedBy = "equipoVisitante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EventoDeportivo> eventosComoVisitante;
}
