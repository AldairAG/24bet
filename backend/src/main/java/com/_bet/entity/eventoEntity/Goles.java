package com._bet.entity.eventoEntity;

import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
public class Goles {
    private Integer visitantes;
    private Integer locales;

    /**
     * Evento asociado a estos goles
     */
    @OneToOne(mappedBy = "goles")
    private EventoDeportivo evento;
}
