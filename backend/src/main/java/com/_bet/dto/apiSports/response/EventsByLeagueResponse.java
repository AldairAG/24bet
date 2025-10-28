package com._bet.dto.apiSports.response;

import com._bet.dto.apiSports.entidades.Fixture;
import com._bet.dto.apiSports.entidades.League;
import com._bet.dto.apiSports.entidades.Team;
import com._bet.dto.apiSports.entidades.Venue;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Data;

@Data
public class EventsByLeagueResponse {
    @JsonProperty("fixture")
    private Fixture fixture;
    @JsonProperty("periods")
    private Periods periods;
    @JsonProperty("venue")
    private Venue venue;
    @JsonProperty("score")
    private Score score;
    @JsonProperty("teams")
    private Teams teams;
    @JsonProperty("goals")
    private Goals goals;
    @JsonProperty("league")
    private League league;

    @Data
    public static class Periods {
        @JsonProperty("first")
        private int first;
        @JsonProperty("second")
        private int second;
    }

    @Data
    @Builder
    public static class Teams {
        @JsonProperty("home")
        private Team home;
        @JsonProperty("away")
        private Team away;
    }

    @Data
    @Builder
    public static class Goals {
        @JsonProperty("home")
        private Integer home;
        @JsonProperty("away")
        private Integer away;
    }

    @Data
    @Builder
    public static class Score {
        @JsonProperty("halftime")
        private Goals halftime;
        @JsonProperty("fulltime")
        private Goals fulltime;
        @JsonProperty("extratime")
        private Goals extratime;
        @JsonProperty("penalty")
        private Goals penalty;
    }
}
