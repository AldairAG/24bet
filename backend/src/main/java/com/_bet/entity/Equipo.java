package com._bet.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    /**
     * Constructores
     */
    public Equipo() {}

    public Equipo(String sportsDbId, String nombre, Liga liga) {
        this.sportsDbId = sportsDbId;
        this.nombre = nombre;
        this.liga = liga;
        this.activo = true;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSportsDbId() {
        return sportsDbId;
    }

    public void setSportsDbId(String sportsDbId) {
        this.sportsDbId = sportsDbId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNombreCorto() {
        return nombreCorto;
    }

    public void setNombreCorto(String nombreCorto) {
        this.nombreCorto = nombreCorto;
    }

    public String getNombreAlternativo() {
        return nombreAlternativo;
    }

    public void setNombreAlternativo(String nombreAlternativo) {
        this.nombreAlternativo = nombreAlternativo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public Integer getAnoFundacion() {
        return anoFundacion;
    }

    public void setAnoFundacion(Integer anoFundacion) {
        this.anoFundacion = anoFundacion;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getBadgeUrl() {
        return badgeUrl;
    }

    public void setBadgeUrl(String badgeUrl) {
        this.badgeUrl = badgeUrl;
    }

    public String getJerseyUrl() {
        return jerseyUrl;
    }

    public void setJerseyUrl(String jerseyUrl) {
        this.jerseyUrl = jerseyUrl;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public String getFanartUrl() {
        return fanartUrl;
    }

    public void setFanartUrl(String fanartUrl) {
        this.fanartUrl = fanartUrl;
    }

    public String getEstadio() {
        return estadio;
    }

    public void setEstadio(String estadio) {
        this.estadio = estadio;
    }

    public Integer getCapacidadEstadio() {
        return capacidadEstadio;
    }

    public void setCapacidadEstadio(Integer capacidadEstadio) {
        this.capacidadEstadio = capacidadEstadio;
    }

    public String getUbicacionEstadio() {
        return ubicacionEstadio;
    }

    public void setUbicacionEstadio(String ubicacionEstadio) {
        this.ubicacionEstadio = ubicacionEstadio;
    }

    public String getSitioWeb() {
        return sitioWeb;
    }

    public void setSitioWeb(String sitioWeb) {
        this.sitioWeb = sitioWeb;
    }

    public String getFacebook() {
        return facebook;
    }

    public void setFacebook(String facebook) {
        this.facebook = facebook;
    }

    public String getTwitter() {
        return twitter;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public String getYoutube() {
        return youtube;
    }

    public void setYoutube(String youtube) {
        this.youtube = youtube;
    }

    public String getRss() {
        return rss;
    }

    public void setRss(String rss) {
        this.rss = rss;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getColores() {
        return colores;
    }

    public void setColores(String colores) {
        this.colores = colores;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public Liga getLiga() {
        return liga;
    }

    public void setLiga(Liga liga) {
        this.liga = liga;
    }

    public List<EventoDeportivo> getEventosComoLocal() {
        return eventosComoLocal;
    }

    public void setEventosComoLocal(List<EventoDeportivo> eventosComoLocal) {
        this.eventosComoLocal = eventosComoLocal;
    }

    public List<EventoDeportivo> getEventosComoVisitante() {
        return eventosComoVisitante;
    }

    public void setEventosComoVisitante(List<EventoDeportivo> eventosComoVisitante) {
        this.eventosComoVisitante = eventosComoVisitante;
    }

    @Override
    public String toString() {
        return "Equipo{" +
                "id=" + id +
                ", sportsDbId='" + sportsDbId + '\'' +
                ", nombre='" + nombre + '\'' +
                ", nombreCorto='" + nombreCorto + '\'' +
                ", pais='" + pais + '\'' +
                ", ciudad='" + ciudad + '\'' +
                ", activo=" + activo +
                '}';
    }
}
