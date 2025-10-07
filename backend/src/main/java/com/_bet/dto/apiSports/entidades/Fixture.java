package com._bet.dto.apiSports.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Fixture {
    @JsonProperty("id")
    private int id;
    @JsonProperty("referee")
    private String referee;
    @JsonProperty("timezone")
    private String timezone;
    @JsonProperty("date")
    private String date;
    @JsonProperty("timestamp")
    private long timestamp;
    @JsonProperty("status")
    private Status status;

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

}
