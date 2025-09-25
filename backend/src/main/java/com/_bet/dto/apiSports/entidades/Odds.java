package com._bet.dto.apiSports.entidades;

import java.util.List;

import lombok.Data;

@Data
public class Odds {
    private int id;
    private String name;
    private List<Bet> bets;

    @Data
    private static class Bet {
        private int id;
        private String name;
        private List<Value> values;
    }

    @Data
    private static class Value {
        private String value;
        private double odd;
    }
}
