package com._bet.dto.apiSports.response;

import com._bet.dto.apiSports.entidades.Country;
import com._bet.dto.apiSports.entidades.League;
import com._bet.dto.apiSports.entidades.Season;

import lombok.Data;

@Data
public class LeagueBySeasonResponse {
    private League league;
    private Country country;
    private Season season;
}
