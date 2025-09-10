package com._bet.dto.thesportsdb.v2;

import lombok.Data;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO para la respuesta de eventos en vivo de TheSportsDB API v2
 */
@Data
public class TheSportsDbV2LiveEventsResponseDto {

    @JsonProperty("livescore")
    @JsonAlias("livescore")
    private List<TheSportsDbV2LiveEventDto> events;
}
