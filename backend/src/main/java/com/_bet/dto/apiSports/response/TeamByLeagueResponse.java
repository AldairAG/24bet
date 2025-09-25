package com._bet.dto.apiSports.response;

import com._bet.dto.apiSports.entidades.Team;
import com._bet.dto.apiSports.entidades.Venue;

import lombok.Data;

@Data
public class TeamByLeagueResponse {
    private Team team;
    private Venue venue;
}
