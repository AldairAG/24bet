package com._bet.dto.thesportsdb.v2;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ResponseTeamsByLeague {

    @JsonProperty("list")
    private List<ResponseTeamDto> teams;
    
    
}
