package com._bet.dto.apiSports.response;

import java.util.List;

import com._bet.dto.apiSports.entidades.Fixture;

import lombok.Data;

@Data
public class EventsByLeagueResponse {
    private List<Fixture> fixtures;
}
