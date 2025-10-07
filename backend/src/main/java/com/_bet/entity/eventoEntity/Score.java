package com._bet.entity.eventoEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "scores")
@NoArgsConstructor
public class Score {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "halftime_home")
    private Integer halftimeHome;
    
    @Column(name = "halftime_away")
    private Integer halftimeAway;
    
    @Column(name = "fulltime_home")
    private Integer fulltimeHome;
    
    @Column(name = "fulltime_away")
    private Integer fulltimeAway;
    
    @Column(name = "extratime_home")
    private Integer extratimeHome;
    
    @Column(name = "extratime_away")
    private Integer extratimeAway;
    
    @Column(name = "penalty_home")
    private Integer penaltyHome;
    
    @Column(name = "penalty_away")
    private Integer penaltyAway;

    /*
     * Evento asociado a este marcador
     */
    @OneToOne(mappedBy = "puntuaciones")
    private EventoDeportivo evento;
    
}
