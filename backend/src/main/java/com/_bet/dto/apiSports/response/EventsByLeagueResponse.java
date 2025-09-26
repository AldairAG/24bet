package com._bet.dto.apiSports.response;

import java.util.List;

import com._bet.dto.apiSports.entidades.Fixture;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class EventsByLeagueResponse {
    @JsonProperty("response")
    private List<Fixture> fixtures;
}
