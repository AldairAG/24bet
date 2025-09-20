package com._bet.dto.thesportsdb.v2;

import java.util.List;

import com._bet.dto.thesportsdb.TheSportDbLeagueDto;
import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;

@Data
public class AllLeaguesResponse {

    @JsonAlias("all")
    private List<TheSportDbLeagueDto> leagues;

}
