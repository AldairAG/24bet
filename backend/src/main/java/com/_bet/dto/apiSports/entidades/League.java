package com._bet.dto.apiSports.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class League {
    @JsonProperty("id")
    private int id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("type")
    private String type;
    @JsonProperty("logo")
    private String logo;

}
