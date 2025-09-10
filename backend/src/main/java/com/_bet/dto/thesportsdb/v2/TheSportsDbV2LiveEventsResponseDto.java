package com._bet.dto.thesportsdb.v2;

import lombok.Data;

import java.util.List;

/**
 * DTO para la respuesta de eventos en vivo de TheSportsDB API v2
 */
@Data
public class TheSportsDbV2LiveEventsResponseDto {
    private List<TheSportsDbV2LiveEventDto> events;
}
