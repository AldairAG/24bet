package com._bet.dto.apiSports.response;

import java.util.List;

import com._bet.dto.apiSports.entidades.Fixture;
import com._bet.dto.apiSports.entidades.League;
import com._bet.dto.apiSports.entidades.OddStatus;
import com._bet.dto.apiSports.entidades.Odds;
import com._bet.dto.apiSports.response.EventsByLeagueResponse.Teams;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class OddsLiveResponse {
    @JsonProperty("fixture")
    Fixture fixture;
    @JsonProperty("league")
    League league;
    @JsonProperty("teams")
    Teams teams;
    @JsonProperty("update")
    String update;
    @JsonProperty("status")
    OddStatus status;
    @JsonProperty("odds")
    List<Odds> odds;
}
"id": 33,
                    "name": "Asian Handicap",
                    "values": [
                        {
                            "value": "Home",
                            "odd": "1.9",
                            "handicap": "0",
                            "main": null,
                            "suspended": true
                        },