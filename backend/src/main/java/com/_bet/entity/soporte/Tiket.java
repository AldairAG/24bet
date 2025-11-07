package com._bet.entity.soporte;

import java.time.LocalDateTime;
import java.util.List;

import com._bet.entity.user.Usuario;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Entity
@Data
@Builder
public class Tiket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipoProblema;
    private String descripcion;
    private estadoTiket estado;
    private String asunto;
    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "tiket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Comentario> comentarios;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @NotNull(message = "El usuario es obligatorio")
    private Usuario usuario;

    public enum estadoTiket {
        CREADO,
        EN_PROGRESO,
        CERRADO
    }

}
