package com._bet.dto.thesportsdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO para recibir datos de eventos desde TheSportsDB API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheSportDbEventDto {
    
    @JsonProperty("idEvent")
    private String idEvent;
    
    @JsonProperty("strEvent")
    private String strEvent;
    
    @JsonProperty("strEventAlternate")
    private String strEventAlternate;
    
    @JsonProperty("strFilename")
    private String strFilename;
    
    @JsonProperty("strSport")
    private String strSport;
    
    @JsonProperty("idLeague")
    private String idLeague;
    
    @JsonProperty("strLeague")
    private String strLeague;
    
    @JsonProperty("strSeason")
    private String strSeason;
    
    @JsonProperty("strDescriptionEN")
    private String strDescriptionEN;
    
    @JsonProperty("strHomeTeam")
    private String strHomeTeam;
    
    @JsonProperty("strAwayTeam")
    private String strAwayTeam;
    
    @JsonProperty("intHomeScore")
    private String intHomeScore;
    
    @JsonProperty("intAwayScore")
    private String intAwayScore;
    
    @JsonProperty("intRound")
    private String intRound;
    
    @JsonProperty("intSpectators")
    private String intSpectators;
    
    @JsonProperty("strHomeGoalDetails")
    private String strHomeGoalDetails;
    
    @JsonProperty("strHomeRedCards")
    private String strHomeRedCards;
    
    @JsonProperty("strHomeYellowCards")
    private String strHomeYellowCards;
    
    @JsonProperty("strHomeLineupGoalkeeper")
    private String strHomeLineupGoalkeeper;
    
    @JsonProperty("strHomeLineupDefense")
    private String strHomeLineupDefense;
    
    @JsonProperty("strHomeLineupMidfield")
    private String strHomeLineupMidfield;
    
    @JsonProperty("strHomeLineupForward")
    private String strHomeLineupForward;
    
    @JsonProperty("strHomeLineupSubstitutes")
    private String strHomeLineupSubstitutes;
    
    @JsonProperty("strHomeFormation")
    private String strHomeFormation;
    
    @JsonProperty("strAwayRedCards")
    private String strAwayRedCards;
    
    @JsonProperty("strAwayYellowCards")
    private String strAwayYellowCards;
    
    @JsonProperty("strAwayGoalDetails")
    private String strAwayGoalDetails;
    
    @JsonProperty("strAwayLineupGoalkeeper")
    private String strAwayLineupGoalkeeper;
    
    @JsonProperty("strAwayLineupDefense")
    private String strAwayLineupDefense;
    
    @JsonProperty("strAwayLineupMidfield")
    private String strAwayLineupMidfield;
    
    @JsonProperty("strAwayLineupForward")
    private String strAwayLineupForward;
    
    @JsonProperty("strAwayLineupSubstitutes")
    private String strAwayLineupSubstitutes;
    
    @JsonProperty("strAwayFormation")
    private String strAwayFormation;
    
    @JsonProperty("intHomeShots")
    private String intHomeShots;
    
    @JsonProperty("intAwayShots")
    private String intAwayShots;
    
    @JsonProperty("dateEvent")
    private String dateEvent;
    
    @JsonProperty("dateEventLocal")
    private String dateEventLocal;
    
    @JsonProperty("strDate")
    private String strDate;
    
    @JsonProperty("strTime")
    private String strTime;
    
    @JsonProperty("strTimeLocal")
    private String strTimeLocal;
    
    @JsonProperty("strTVStation")
    private String strTVStation;
    
    @JsonProperty("idHomeTeam")
    private String idHomeTeam;
    
    @JsonProperty("idAwayTeam")
    private String idAwayTeam;
    
    @JsonProperty("strResult")
    private String strResult;
    
    @JsonProperty("strVenue")
    private String strVenue;
    
    @JsonProperty("strCountry")
    private String strCountry;
    
    @JsonProperty("strCity")
    private String strCity;
    
    @JsonProperty("strPoster")
    private String strPoster;
    
    @JsonProperty("strFanart")
    private String strFanart;
    
    @JsonProperty("strThumb")
    private String strThumb;
    
    @JsonProperty("strBanner")
    private String strBanner;
    
    @JsonProperty("strMap")
    private String strMap;
    
    @JsonProperty("strTweet1")
    private String strTweet1;
    
    @JsonProperty("strTweet2")
    private String strTweet2;
    
    @JsonProperty("strTweet3")
    private String strTweet3;
    
    @JsonProperty("strVideo")
    private String strVideo;
    
    @JsonProperty("strStatus")
    private String strStatus;
    
    @JsonProperty("strPostponed")
    private String strPostponed;
    
    @JsonProperty("strLocked")
    private String strLocked;
}