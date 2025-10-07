package com._bet.dto.apiSports.response;

import java.util.List;

import com._bet.dto.apiSports.entidades.Country;
import com._bet.dto.apiSports.entidades.League;
import com._bet.dto.apiSports.entidades.Season;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class LeagueBySeasonResponse {
    @JsonAlias("league")
    private League league;
    @JsonAlias("country")
    private Country country;
    @JsonAlias("seasons")
    private List<Season> seasons;
}
