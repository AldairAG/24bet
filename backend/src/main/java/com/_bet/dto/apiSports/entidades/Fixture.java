package com._bet.dto.apiSports.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
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
    @Builder
    public static class Status {
        @JsonProperty("long")
        private String longStatus;
        @JsonProperty("short")
        private String shortStatus;
        @JsonProperty("elapsed")
        private int elapsed;
        @JsonProperty("extra")
        private int extra;
    }

}
