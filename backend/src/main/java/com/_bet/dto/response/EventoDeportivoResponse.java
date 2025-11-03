package com._bet.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

import com._bet.dto.apiSports.entidades.Fixture;
import com._bet.dto.apiSports.entidades.Odds.Bet;
import com._bet.dto.apiSports.response.EventsByLeagueResponse.Teams;

/**
 * DTO de respuesta para evento deportivo
 * Contiene información básica del evento para consumo del frontend
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventoDeportivoResponse {
    
    private Fixture fixture; 

    private List<Bet> bets;

    private String nombreEvento;

    private Teams teams;

}