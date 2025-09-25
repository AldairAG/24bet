package com._bet.dto.apiSports.entidades;

import lombok.Data;

@Data
public class Fixture {
    private int id;
    private String referee;
    private String timezone;
    private String date;
    private long timestamp;

    private Periods periods;
    private Venue venue;
    private Status status;
    private Teams teams;
    private Score score;
    private Goals goals;
    private League league;

    @Data
    public static class Periods {
        private int first;
        private int second;
    }

    @Data
    public static class Status {
        private String longStatus;
        private String shortStatus;
        private String elapsed;
        private String extra;
    }

    @Data
    public static class Teams {
        private Team home;
        private Team away;
    }

    @Data
    public static class Goals {
        private Integer home;
        private Integer away;
    }
    
    @Data
    public static class Score {
        private Goals halftime;
        private Goals fulltime;
        private Goals extratime;
        private Goals penalty;
    }
}
