package com._bet.dto.response;

import java.util.List;

import com._bet.dto.apiSports.entidades.Fixture;
import com._bet.dto.apiSports.entidades.League;
import com._bet.dto.apiSports.entidades.Odds.Bet;
import com._bet.dto.apiSports.response.EventsByLeagueResponse.Goals;
import com._bet.dto.apiSports.response.EventsByLeagueResponse.Score;
import com._bet.dto.apiSports.response.EventsByLeagueResponse.Teams;

import lombok.Data;

@Data
public class EventoConOddsResponse {
    private Fixture fixture;
    private League league;
    private Teams teams;
    private Goals goals;
    private Score score;
    private List<Bet> odds;

}