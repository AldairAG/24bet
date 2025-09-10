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
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"liga", "equipoLocal", "equipoVisitante"})
@EqualsAndHashCode(exclude = {"liga", "equipoLocal", "equipoVisitante"})
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
    @Builder.Default
    @Column(name = "es_postemporada")
    private Boolean esPostemporada = false;

    /**
     * Indica si el evento está en vivo actualmente
     */
    @Builder.Default
    @Column(name = "en_vivo")
    private Boolean enVivo = false;

    /**
     * Indica si el evento está activo/disponible
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
}
