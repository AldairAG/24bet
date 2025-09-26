package com._bet.entity.eventoEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class Goles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer visitantes;
    private Integer locales;

    /**
     * Evento asociado a estos goles
     */
    @OneToOne(mappedBy = "goles")
    private EventoDeportivo evento;
}
