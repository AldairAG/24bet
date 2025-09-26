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

}
