package com._bet.entity.eventoEntity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
public class Estado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String largo;
    private String corto;
    private Integer elapsed;
    private Integer extra;

    @OneToOne(mappedBy = "estado")
    private EventoDeportivo evento;

}
