package com._bet.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    /**
     * Constructores
     */
    public Deporte() {}

    public Deporte(String sportsDbId, String nombre, String nombreIngles) {
        this.sportsDbId = sportsDbId;
        this.nombre = nombre;
        this.nombreIngles = nombreIngles;
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

    public String getNombreIngles() {
        return nombreIngles;
    }

    public void setNombreIngles(String nombreIngles) {
        this.nombreIngles = nombreIngles;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getThumbUrl() {
        return thumbUrl;
    }

    public void setThumbUrl(String thumbUrl) {
        this.thumbUrl = thumbUrl;
    }

    public String getFormato() {
        return formato;
    }

    public void setFormato(String formato) {
        this.formato = formato;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
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

    public List<Liga> getLigas() {
        return ligas;
    }

    public void setLigas(List<Liga> ligas) {
        this.ligas = ligas;
    }

    @Override
    public String toString() {
        return "Deporte{" +
                "id=" + id +
                ", sportsDbId='" + sportsDbId + '\'' +
                ", nombre='" + nombre + '\'' +
                ", nombreIngles='" + nombreIngles + '\'' +
                ", activo=" + activo +
                '}';
    }
}
