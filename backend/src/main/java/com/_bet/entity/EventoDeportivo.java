package com._bet.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad JPA para manejar información de eventos deportivos desde TheSportsDB API
 * Adaptada para v1 y v2 de la API
 */
@Entity
@Table(name = "eventos_deportivos", indexes = {
    @Index(name = "idx_evento_sports_db_id", columnList = "sportsDbId"),
    @Index(name = "idx_evento_fecha", columnList = "fechaEvento"),
    @Index(name = "idx_evento_estado", columnList = "estado"),
    @Index(name = "idx_evento_liga_id", columnList = "liga_id"),
    @Index(name = "idx_evento_equipos", columnList = "equipoLocal_id, equipoVisitante_id")
})
public class EventoDeportivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID del evento en TheSportsDB API
     */
    @Column(name = "sports_db_id", unique = true)
    private String sportsDbId;

    /**
     * Nombre/título del evento
     */
    @NotBlank(message = "El nombre del evento es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    @Column(name = "nombre", nullable = false)
    private String nombre;

    /**
     * Descripción del evento
     */
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    /**
     * Fecha y hora del evento
     */
    @Column(name = "fecha_evento")
    private LocalDateTime fechaEvento;

    /**
     * Temporada del evento
     */
    @Column(name = "temporada")
    private String temporada;

    /**
     * Round/jornada del evento
     */
    @Column(name = "jornada")
    private String jornada;

    /**
     * Semana del evento
     */
    @Column(name = "semana")
    private Integer semana;

    /**
     * Estado del evento (ej: "Not Started", "Match Finished", "Live")
     */
    @Column(name = "estado")
    private String estado;

    /**
     * Resultado del equipo local
     */
    @Column(name = "resultado_local")
    private Integer resultadoLocal;

    /**
     * Resultado del equipo visitante
     */
    @Column(name = "resultado_visitante")
    private Integer resultadoVisitante;

    /**
     * Resultado en tiempo medio - equipo local
     */
    @Column(name = "resultado_medio_local")
    private Integer resultadoMedioLocal;

    /**
     * Resultado en tiempo medio - equipo visitante
     */
    @Column(name = "resultado_medio_visitante")
    private Integer resultadoMedioVisitante;

    /**
     * Espectadores que asistieron
     */
    @Column(name = "espectadores")
    private Integer espectadores;

    /**
     * Tiempo del partido (ej: "90'", "FT")
     */
    @Column(name = "tiempo_partido")
    private String tiempoPartido;

    /**
     * URL del thumb del evento
     */
    @Column(name = "thumb_url")
    private String thumbUrl;

    /**
     * URL del banner del evento
     */
    @Column(name = "banner_url")
    private String bannerUrl;

    /**
     * URL del video del evento
     */
    @Column(name = "video_url")
    private String videoUrl;

    /**
     * Ubicación donde se realiza el evento
     */
    @Column(name = "ubicacion")
    private String ubicacion;

    /**
     * País donde se realiza el evento
     */
    @Column(name = "pais")
    private String pais;

    /**
     * Ciudad donde se realiza el evento
     */
    @Column(name = "ciudad")
    private String ciudad;

    /**
     * Latitud de la ubicación
     */
    @Column(name = "latitud", precision = 10, scale = 8)
    private BigDecimal latitud;

    /**
     * Longitud de la ubicación
     */
    @Column(name = "longitud", precision = 11, scale = 8)
    private BigDecimal longitud;

    /**
     * Indica si es un evento postemporada
     */
    @Column(name = "es_postemporada")
    private Boolean esPostemporada = false;

    /**
     * Indica si el evento está activo/disponible
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
     * Relación muchos a uno con Equipo (equipo local)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipoLocal_id")
    private Equipo equipoLocal;

    /**
     * Relación muchos a uno con Equipo (equipo visitante)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipoVisitante_id")
    private Equipo equipoVisitante;

    /**
     * Constructores
     */
    public EventoDeportivo() {}

    public EventoDeportivo(String sportsDbId, String nombre, Liga liga, LocalDateTime fechaEvento) {
        this.sportsDbId = sportsDbId;
        this.nombre = nombre;
        this.liga = liga;
        this.fechaEvento = fechaEvento;
        this.activo = true;
        this.esPostemporada = false;
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaEvento() {
        return fechaEvento;
    }

    public void setFechaEvento(LocalDateTime fechaEvento) {
        this.fechaEvento = fechaEvento;
    }

    public String getTemporada() {
        return temporada;
    }

    public void setTemporada(String temporada) {
        this.temporada = temporada;
    }

    public String getJornada() {
        return jornada;
    }

    public void setJornada(String jornada) {
        this.jornada = jornada;
    }

    public Integer getSemana() {
        return semana;
    }

    public void setSemana(Integer semana) {
        this.semana = semana;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getResultadoLocal() {
        return resultadoLocal;
    }

    public void setResultadoLocal(Integer resultadoLocal) {
        this.resultadoLocal = resultadoLocal;
    }

    public Integer getResultadoVisitante() {
        return resultadoVisitante;
    }

    public void setResultadoVisitante(Integer resultadoVisitante) {
        this.resultadoVisitante = resultadoVisitante;
    }

    public Integer getResultadoMedioLocal() {
        return resultadoMedioLocal;
    }

    public void setResultadoMedioLocal(Integer resultadoMedioLocal) {
        this.resultadoMedioLocal = resultadoMedioLocal;
    }

    public Integer getResultadoMedioVisitante() {
        return resultadoMedioVisitante;
    }

    public void setResultadoMedioVisitante(Integer resultadoMedioVisitante) {
        this.resultadoMedioVisitante = resultadoMedioVisitante;
    }

    public Integer getEspectadores() {
        return espectadores;
    }

    public void setEspectadores(Integer espectadores) {
        this.espectadores = espectadores;
    }

    public String getTiempoPartido() {
        return tiempoPartido;
    }

    public void setTiempoPartido(String tiempoPartido) {
        this.tiempoPartido = tiempoPartido;
    }

    public String getThumbUrl() {
        return thumbUrl;
    }

    public void setThumbUrl(String thumbUrl) {
        this.thumbUrl = thumbUrl;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
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

    public BigDecimal getLatitud() {
        return latitud;
    }

    public void setLatitud(BigDecimal latitud) {
        this.latitud = latitud;
    }

    public BigDecimal getLongitud() {
        return longitud;
    }

    public void setLongitud(BigDecimal longitud) {
        this.longitud = longitud;
    }

    public Boolean getEsPostemporada() {
        return esPostemporada;
    }

    public void setEsPostemporada(Boolean esPostemporada) {
        this.esPostemporada = esPostemporada;
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

    public Equipo getEquipoLocal() {
        return equipoLocal;
    }

    public void setEquipoLocal(Equipo equipoLocal) {
        this.equipoLocal = equipoLocal;
    }

    public Equipo getEquipoVisitante() {
        return equipoVisitante;
    }

    public void setEquipoVisitante(Equipo equipoVisitante) {
        this.equipoVisitante = equipoVisitante;
    }

    @Override
    public String toString() {
        return "EventoDeportivo{" +
                "id=" + id +
                ", sportsDbId='" + sportsDbId + '\'' +
                ", nombre='" + nombre + '\'' +
                ", fechaEvento=" + fechaEvento +
                ", estado='" + estado + '\'' +
                ", resultadoLocal=" + resultadoLocal +
                ", resultadoVisitante=" + resultadoVisitante +
                ", activo=" + activo +
                '}';
    }
}
