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

    private Integer visitantes = 0;
    private Integer locales = 0;

    @Embedded
    private FullTime fulltime = new FullTime();
    
    @Embedded
    private ExtraTime extratime = new ExtraTime();
    
    @Embedded
    private Penalty penalty = new Penalty();
    
    @Embeddable
    @Data
    @NoArgsConstructor
    public static class FullTime {
        @Column(name = "fulltime_visitantes")
        private Integer visitantes = 0;
        @Column(name = "fulltime_locales")
        private Integer locales = 0;
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    public static class ExtraTime {
        @Column(name = "extratime_visitantes")
        private Integer visitantes = 0;
        @Column(name = "extratime_locales")
        private Integer locales = 0;
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    public static class Penalty {
        @Column(name = "penalty_visitantes")
        private Integer visitantes = 0;
        @Column(name = "penalty_locales")
        private Integer locales = 0;
    }

    @OneToOne(mappedBy = "goles")
    private EventoDeportivo evento;
    
    /**
     * Método que se ejecuta después de cargar la entidad desde la base de datos
     * Inicializa los objetos embebidos si son null
     */
    @PostLoad
    @PostPersist
    private void initializeEmbeddedObjects() {
        if (this.fulltime == null) {
            this.fulltime = new FullTime();
        }
        if (this.extratime == null) {
            this.extratime = new ExtraTime();
        }
        if (this.penalty == null) {
            this.penalty = new Penalty();
        }
        
        // Asegurar que los valores nunca sean null
        if (this.visitantes == null) {
            this.visitantes = 0;
        }
        if (this.locales == null) {
            this.locales = 0;
        }
    }
}
