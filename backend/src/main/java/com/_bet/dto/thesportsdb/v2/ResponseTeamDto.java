package com._bet.dto.thesportsdb.v2;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ResponseTeamDto {
    
    @JsonProperty("idTeam")
    private String idTeam;
    
    @JsonProperty("strTeam")
    private String strTeam;
    
    @JsonProperty("strTeamShort")
    private String strTeamShort;
    
    @JsonProperty("strColour1")
    private String strColour1;
    
    @JsonProperty("strColour2")
    private String strColour2;
    
    @JsonProperty("strColour3")
    private String strColour3;
    
    @JsonProperty("idLeague")
    private String idLeague;
    
    @JsonProperty("strLeague")
    private String strLeague;
    
    @JsonProperty("strBadge")
    private String strBadge;
    
    @JsonProperty("strLogo")
    private String strLogo;
    
    @JsonProperty("strBanner")
    private String strBanner;
    
    @JsonProperty("strFanart1")
    private String strFanart1;
    
    @JsonProperty("strEquipment")
    private String strEquipment;
    
    @JsonProperty("strCountry")
    private String strCountry;
}
