package com._bet.dto.apiSports.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Team {
    @JsonProperty("id")
    private int id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("code")
    private String code;
    @JsonProperty("country")
    private String country;
    @JsonProperty("founded")
    private int founded;
    @JsonProperty("national")
    private boolean national;
    @JsonProperty("logo")
    private String logo;
    @JsonProperty("winner")
    private Boolean winner;
}
