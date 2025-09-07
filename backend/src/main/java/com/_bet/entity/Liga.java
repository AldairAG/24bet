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
 * Entidad JPA para manejar información de ligas/competiciones desde TheSportsDB API
 * Adaptada para v1 y v2 de la API
 */
@Entity
@Table(name = "ligas", indexes = {
    @Index(name = "idx_liga_sports_db_id", columnList = "sportsDbId"),
    @Index(name = "idx_liga_nombre", columnList = "nombre"),
    @Index(name = "idx_liga_deporte_id", columnList = "deporte_id")
})
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

    /**
     * Constructores
     */
    public Liga() {}

    public Liga(String sportsDbId, String nombre, Deporte deporte) {
        this.sportsDbId = sportsDbId;
        this.nombre = nombre;
        this.deporte = deporte;
        this.activa = true;
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

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getTrophyUrl() {
        return trophyUrl;
    }

    public void setTrophyUrl(String trophyUrl) {
        this.trophyUrl = trophyUrl;
    }

    public Integer getAnoFundacion() {
        return anoFundacion;
    }

    public void setAnoFundacion(Integer anoFundacion) {
        this.anoFundacion = anoFundacion;
    }

    public String getTemporadaActual() {
        return temporadaActual;
    }

    public void setTemporadaActual(String temporadaActual) {
        this.temporadaActual = temporadaActual;
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

    public Boolean getActiva() {
        return activa;
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
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

    public Deporte getDeporte() {
        return deporte;
    }

    public void setDeporte(Deporte deporte) {
        this.deporte = deporte;
    }

    public List<Equipo> getEquipos() {
        return equipos;
    }

    public void setEquipos(List<Equipo> equipos) {
        this.equipos = equipos;
    }

    public List<EventoDeportivo> getEventos() {
        return eventos;
    }

    public void setEventos(List<EventoDeportivo> eventos) {
        this.eventos = eventos;
    }

    @Override
    public String toString() {
        return "Liga{" +
                "id=" + id +
                ", sportsDbId='" + sportsDbId + '\'' +
                ", nombre='" + nombre + '\'' +
                ", pais='" + pais + '\'' +
                ", activa=" + activa +
                '}';
    }
}
