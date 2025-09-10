package com._bet.dto.thesportsdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class TheSportDbCountriesResponseDto {
    
    @JsonProperty("countries")
    private List<TheSportDbCountryDto> countries;
}
