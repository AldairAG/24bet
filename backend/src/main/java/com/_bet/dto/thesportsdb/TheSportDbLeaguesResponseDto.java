package com._bet.dto.thesportsdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * DTO wrapper para respuestas de ligas desde TheSportsDB API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheSportDbLeaguesResponseDto {
    
    @JsonProperty("countries")
    private List<TheSportDbLeagueDto> leagues;
}
