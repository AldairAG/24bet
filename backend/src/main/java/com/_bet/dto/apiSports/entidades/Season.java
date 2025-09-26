package com._bet.dto.apiSports.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Season {
    @JsonProperty("year")
    private int year;
    @JsonProperty("start")
    private String start;
    @JsonProperty("end")
    private String end;
    @JsonProperty("current")
    private boolean current;
}
