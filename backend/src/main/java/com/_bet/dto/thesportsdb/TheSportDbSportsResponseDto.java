package com._bet.dto.thesportsdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * DTO wrapper para respuestas de deportes desde TheSportsDB API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheSportDbSportsResponseDto {
    
    @JsonProperty("sports")
    private List<TheSportDbSportDto> sports;
}
