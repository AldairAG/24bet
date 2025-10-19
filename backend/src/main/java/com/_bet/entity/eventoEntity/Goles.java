package com._bet.entity.eventoEntity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
public class Goles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer visitantes;
    private Integer locales;

    @Embedded
    private FullTime fulltime;
    
    @Embedded
    private ExtraTime extratime;
    
    @Embedded
    private Penalty penalty;
    
    @Embeddable
    @Data
    public static class FullTime {
        @Column(name = "fulltime_visitantes")
        private Integer visitantes;
        @Column(name = "fulltime_locales")
        private Integer locales;
    }
    
    @Embeddable
    @Data
    public static class ExtraTime {
        @Column(name = "extratime_visitantes")
        private Integer visitantes;
        @Column(name = "extratime_locales")
        private Integer locales;
    }
    
    @Embeddable
    @Data
    public static class Penalty {
        @Column(name = "penalty_visitantes")
        private Integer visitantes;
        @Column(name = "penalty_locales")
        private Integer locales;
    }

    @OneToOne(mappedBy = "goles")
    private EventoDeportivo evento;
}
