package com._bet.dto.apiSports.response;

import com._bet.dto.apiSports.entidades.Team;
import com._bet.dto.apiSports.entidades.Venue;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TeamByLeagueResponse {
    @JsonProperty("team")
    private Team team;
    @JsonProperty("venue")
    private Venue venue;
}
