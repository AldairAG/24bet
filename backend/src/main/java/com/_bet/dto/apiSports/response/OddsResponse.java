package com._bet.dto.apiSports.response;

import java.util.List;

import com._bet.dto.apiSports.entidades.Fixture;
import com._bet.dto.apiSports.entidades.League;
import com._bet.dto.apiSports.entidades.Odds;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class OddsResponse {
    @JsonProperty("league")
    League league;
    @JsonProperty("fixture")
    Fixture fixture;
    @JsonProperty("update")
    String update;
    @JsonProperty("bookmakers")
    List<Odds> bookmakers;
}
