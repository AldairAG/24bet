package com._bet.entity.eventoEntity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com._bet.entity.datosMaestros.Equipo;
import com._bet.entity.datosMaestros.Liga;

import java.time.LocalDateTime;

/**
 * Entidad JPA para manejar información de eventos deportivos desde TheSportsDB API
 * Adaptada para v1 y v2 de la API
 */
@Entity
@Table(name = "eventos_deportivos", indexes = {
    @Index(name = "idx_evento_apisports_id", columnList = "api_sports_id"),
    @Index(name = "idx_evento_fecha", columnList = "fechaEvento"),
    @Index(name = "idx_evento_liga_id", columnList = "liga_id"),
    @Index(name = "idx_evento_equipos", columnList = "equipoLocal_id, equipoVisitante_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"liga", "equipoLocal", "equipoVisitante"})
public class EventoDeportivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID del evento en ApiSports
     */
    @Column(name = "api_sports_id", unique = true)
    private Integer apiSportsId;

    /**
     * Nombre/título del evento
     */
    @NotBlank(message = "El nombre del evento es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    @Column(name = "nombre", nullable = false)
    private String nombre;

    /**
     * Nombre corto del evento
     */
    @Size(max = 100, message = "El nombre corto no puede exceder 100 caracteres")
    @Column(name = "nombre_corto")
    private String nombreCorto;

    /**
     * Fecha y hora del evento
     */
    @Column(name = "fecha_evento")
    private LocalDateTime fechaEvento;

    /**
     * Tiempo del partido (ej: "90'", "FT")
     */
    @Column(name = "tiempo_partido")
    private String tiempoPartido;

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
     * Estado del evento
     */
    @OneToOne( cascade = CascadeType.PERSIST)
    @JoinColumn(name = "estado_id")
    private Estado estado;

    /**
     * Goles del evento
     */
    @OneToOne( cascade = CascadeType.PERSIST)
    @JoinColumn(name = "goles_id")
    private Goles goles;

    /*
     * Puntuaciones del evento
     */
    @OneToOne( cascade = CascadeType.PERSIST)
    @JoinColumn(name = "puntuaciones_id")
    private Score puntuaciones;

}
