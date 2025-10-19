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
    /* @JsonProperty("teams")
    Teams teams; */
    @JsonProperty("update")
    String update;
    @JsonProperty("status")
    OddStatus status;
    @JsonProperty("odds")
    List<OddsLive> odds;

    @Data
    public static class OddsLive {
        @JsonProperty("id")
        private int id;
        @JsonProperty("name")
        private String name;
        @JsonProperty("values")
        private List<OddValue> bets;
    }

    @Data
    public static class OddValue {
        @JsonProperty("value")
        String value;
        @JsonProperty("odd")
        String odd;
        @JsonProperty("handicap")
        String handicap;
        @JsonProperty("main")
        String main;
        @JsonProperty("suspended")
        Boolean suspended;
    }
}
