package com._bet.dto.thesportsdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO para recibir datos de deportes desde TheSportsDB API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheSportDbSportDto {
    
    @JsonProperty("idSport")
    private String idSport;
    
    @JsonProperty("strSport")
    private String strSport;
    
    @JsonProperty("strFormat")
    private String strFormat;
    
    @JsonProperty("strSportThumb")
    private String strSportThumb;
    
    @JsonProperty("strSportIconGreen")
    private String strSportIconGreen;
    
    @JsonProperty("strSportDescription")
    private String strSportDescription;
}
