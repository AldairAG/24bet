package com._bet.dto.apiSports.response;

import com._bet.dto.apiSports.entidades.Fixture;
import com._bet.dto.apiSports.entidades.League;
import com._bet.dto.apiSports.entidades.Team;
import com._bet.dto.apiSports.entidades.Venue;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class EventsByLeagueResponse {
    @JsonProperty("fixture")
    private Fixture fixture;
    @JsonProperty("periods")
    private Periods periods;
    @JsonProperty("venue")
    private Venue venue;
    @JsonProperty("status")
    private Status status;
    @JsonProperty("teams")
    private Teams teams;
    @JsonProperty("score")
    private Score score;
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
    public static class Status {
        @JsonProperty("long")
        private String longStatus;
        @JsonProperty("short")
        private String shortStatus;
        @JsonProperty("elapsed")
        private String elapsed;
        @JsonProperty("extra")
        private String extra;
    }

    @Data
    public static class Teams {
        @JsonProperty("home")
        private Team home;
        @JsonProperty("away")
        private Team away;
    }

    @Data
    public static class Goals {
        @JsonProperty("home")
        private Integer home;
        @JsonProperty("away")
        private Integer away;
    }

    @Data
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
