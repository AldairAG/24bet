package com._bet.dto.thesportsdb.v2;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO para eventos en vivo de TheSportsDB API v2
 * Incluye información en tiempo real y estadísticas del evento
 */
@Data
public class TheSportsDbV2LiveEventDto {

    @JsonProperty("idEvent")
    private String idEvent;

    @JsonProperty("idSoccerXML")
    private String idSoccerXML;

    @JsonProperty("idAPIfootball")
    private String idAPIfootball;

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

    @JsonProperty("strOfficial")
    private String strOfficial;

    @JsonProperty("strTimestamp")
    private String strTimestamp;

    @JsonProperty("dateEvent")
    private String dateEvent;

    @JsonProperty("dateEventLocal")
    private String dateEventLocal;

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

    @JsonProperty("strSquare")
    private String strSquare;

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

    // Campos específicos de la API v2 para eventos en vivo
    @JsonProperty("strProgress")
    private String strProgress;

    @JsonProperty("intLive")
    private String intLive;

    @JsonProperty("strCurrentPeriod")
    private String strCurrentPeriod;

    @JsonProperty("strElapsedTime")
    private String strElapsedTime;

    @JsonProperty("strHomeGoalDetails")
    private String strHomeGoalDetails;

    @JsonProperty("strAwayGoalDetails")
    private String strAwayGoalDetails;

    @JsonProperty("strHomeRedCards")
    private String strHomeRedCards;

    @JsonProperty("strAwayRedCards")
    private String strAwayRedCards;

    @JsonProperty("strHomeYellowCards")
    private String strHomeYellowCards;

    @JsonProperty("strAwayYellowCards")
    private String strAwayYellowCards;

    @JsonProperty("strHomeLineupGoalkeeper")
    private String strHomeLineupGoalkeeper;

    @JsonProperty("strAwayLineupGoalkeeper")
    private String strAwayLineupGoalkeeper;

    @JsonProperty("strHomeLineupDefense")
    private String strHomeLineupDefense;

    @JsonProperty("strAwayLineupDefense")
    private String strAwayLineupDefense;

    @JsonProperty("strHomeLineupMidfield")
    private String strHomeLineupMidfield;

    @JsonProperty("strAwayLineupMidfield")
    private String strAwayLineupMidfield;

    @JsonProperty("strHomeLineupForward")
    private String strHomeLineupForward;

    @JsonProperty("strAwayLineupForward")
    private String strAwayLineupForward;

    @JsonProperty("strHomeLineupSubstitutes")
    private String strHomeLineupSubstitutes;

    @JsonProperty("strAwayLineupSubstitutes")
    private String strAwayLineupSubstitutes;

    @JsonProperty("strHomeFormation")
    private String strHomeFormation;

    @JsonProperty("strAwayFormation")
    private String strAwayFormation;

    @JsonProperty("intHomeShots")
    private String intHomeShots;

    @JsonProperty("intAwayShots")
    private String intAwayShots;

    @JsonProperty("intHomeShotsOnTarget")
    private String intHomeShotsOnTarget;

    @JsonProperty("intAwayShotsOnTarget")
    private String intAwayShotsOnTarget;

    @JsonProperty("intHomeCorners")
    private String intHomeCorners;

    @JsonProperty("intAwayCorners")
    private String intAwayCorners;

    @JsonProperty("intHomeFouls")
    private String intHomeFouls;

    @JsonProperty("intAwayFouls")
    private String intAwayFouls;

    @JsonProperty("intHomeOffsides")
    private String intHomeOffsides;

    @JsonProperty("intAwayOffsides")
    private String intAwayOffsides;

    @JsonProperty("intHomePossession")
    private String intHomePossession;

    @JsonProperty("intAwayPossession")
    private String intAwayPossession;

    // Helper methods para conversiones
    public boolean isLive() {
        return "1".equals(intLive);
    }

    public boolean isPostponed() {
        return "yes".equalsIgnoreCase(strPostponed);
    }

    public Integer getHomeScoreAsInt() {
        try {
            return intHomeScore != null && !intHomeScore.isEmpty() ? Integer.parseInt(intHomeScore) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public Integer getAwayScoreAsInt() {
        try {
            return intAwayScore != null && !intAwayScore.isEmpty() ? Integer.parseInt(intAwayScore) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public LocalDateTime getEventDateTime() {
        try {
            if (dateEvent != null && strTime != null) {
                String dateTimeStr = dateEvent + " " + strTime;
                return LocalDateTime.parse(dateTimeStr.replace(" ", "T"));
            }
        } catch (Exception e) {
            // Log error if needed
        }
        return null;
    }
}
