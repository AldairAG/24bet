package com._bet.dto.apiSports.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Country {
    @JsonProperty("name")
    private String name;
    @JsonProperty("code")
    private String code;
    @JsonProperty("flag")
    private String flag;

}
