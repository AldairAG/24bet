package com._bet.dto.thesportsdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO para recibir datos de ligas desde TheSportsDB API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheSportDbLeagueDto {
    
    @JsonProperty("idLeague")
    private String idLeague;
    
    @JsonProperty("strLeague")
    private String strLeague;
    
    @JsonProperty("strLeagueAlternate")
    private String strLeagueAlternate;
    
    @JsonProperty("strDivision")
    private String strDivision;
    
    @JsonProperty("idSport")
    private String idSport;
    
    @JsonProperty("strSport")
    private String strSport;
    
    @JsonProperty("strCountry")
    private String strCountry;
    
    @JsonProperty("strDescriptionEN")
    private String strDescriptionEN;
    
    @JsonProperty("strDescriptionES")
    private String strDescriptionES;
    
    @JsonProperty("strGender")
    private String strGender;
    
    @JsonProperty("strWebsite")
    private String strWebsite;
    
    @JsonProperty("strFacebook")
    private String strFacebook;
    
    @JsonProperty("strTwitter")
    private String strTwitter;
    
    @JsonProperty("strYoutube")
    private String strYoutube;
    
    @JsonProperty("strRSS")
    private String strRSS;
    
    @JsonProperty("strBadge")
    private String strBadge;
    
    @JsonProperty("strLogo")
    private String strLogo;
    
    @JsonProperty("strPoster")
    private String strPoster;
    
    @JsonProperty("strTrophy")
    private String strTrophy;
    
    @JsonProperty("strBanner")
    private String strBanner;
    
    @JsonProperty("intFormedYear")
    private String intFormedYear;
    
    @JsonProperty("strCurrentSeason")
    private String strCurrentSeason;
}