package com._bet.dto.thesportsdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO para recibir datos de equipos desde TheSportsDB API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheSportDbTeamDto {
    
    @JsonProperty("idTeam")
    private String idTeam;
    
    @JsonProperty("strTeam")
    private String strTeam;
    
    @JsonProperty("strTeamShort")
    private String strTeamShort;
    
    @JsonProperty("strAlternate")
    private String strAlternate;
    
    @JsonProperty("intFormedYear")
    private String intFormedYear;
    
    @JsonProperty("strSport")
    private String strSport;
    
    @JsonProperty("strLeague")
    private String strLeague;
    
    @JsonProperty("idLeague")
    private String idLeague;
    
    @JsonProperty("strDivision")
    private String strDivision;
    
    @JsonProperty("strManager")
    private String strManager;
    
    @JsonProperty("strStadium")
    private String strStadium;
    
    @JsonProperty("strKeywords")
    private String strKeywords;
    
    @JsonProperty("strRSS")
    private String strRSS;
    
    @JsonProperty("strStadiumThumb")
    private String strStadiumThumb;
    
    @JsonProperty("strStadiumDescription")
    private String strStadiumDescription;
    
    @JsonProperty("strStadiumLocation")
    private String strStadiumLocation;
    
    @JsonProperty("intStadiumCapacity")
    private String intStadiumCapacity;
    
    @JsonProperty("strWebsite")
    private String strWebsite;
    
    @JsonProperty("strFacebook")
    private String strFacebook;
    
    @JsonProperty("strTwitter")
    private String strTwitter;
    
    @JsonProperty("strInstagram")
    private String strInstagram;
    
    @JsonProperty("strYoutube")
    private String strYoutube;
    
    @JsonProperty("strDescriptionEN")
    private String strDescriptionEN;
    
    @JsonProperty("strDescriptionES")
    private String strDescriptionES;
    
    @JsonProperty("strGender")
    private String strGender;
    
    @JsonProperty("strCountry")
    private String strCountry;
    
    @JsonProperty("strTeamBadge")
    private String strTeamBadge;
    
    @JsonProperty("strTeamJersey")
    private String strTeamJersey;
    
    @JsonProperty("strTeamLogo")
    private String strTeamLogo;
    
    @JsonProperty("strTeamFanart1")
    private String strTeamFanart1;
    
    @JsonProperty("strTeamFanart2")
    private String strTeamFanart2;
    
    @JsonProperty("strTeamFanart3")
    private String strTeamFanart3;
    
    @JsonProperty("strTeamFanart4")
    private String strTeamFanart4;
    
    @JsonProperty("strTeamBanner")
    private String strTeamBanner;
    
    @JsonProperty("strColour1")
    private String strColour1;
    
    @JsonProperty("strColour2")
    private String strColour2;
    
    @JsonProperty("strColour3")
    private String strColour3;
}
