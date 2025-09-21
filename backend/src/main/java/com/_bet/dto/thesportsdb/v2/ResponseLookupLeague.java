package com._bet.dto.thesportsdb.v2;

import java.util.List;

import com._bet.dto.thesportsdb.TheSportDbLeagueDto;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ResponseLookupLeague {
    
    @JsonProperty("lookup")
    private List<TheSportDbLeagueDto> league;

}
