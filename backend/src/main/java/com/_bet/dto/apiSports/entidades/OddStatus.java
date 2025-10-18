package com._bet.dto.apiSports.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class OddStatus {
    @JsonProperty("stopped")
    private String stopped;
    @JsonProperty("blocked")
    private String blocked;
    @JsonProperty("finished")
    private String finished;
}
