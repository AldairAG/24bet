package com._bet.dto.apiSports.entidades;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Odds {
    @JsonProperty("id")
    private int id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("bets")
    private List<Bet> bets;

    @Data
    @Builder
    public static class Bet {
        @JsonProperty("id")
        private int id;
        @JsonProperty("name")
        private String name;
        @JsonProperty("values")
        private List<Value> values;
    }

    @Data
    @Builder
    public static class Value {
        @JsonProperty("value")
        private String value;
        @JsonProperty("odd")
        private double odd;
    }
}
