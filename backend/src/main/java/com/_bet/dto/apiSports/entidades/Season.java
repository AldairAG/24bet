package com._bet.dto.apiSports.entidades;

import lombok.Data;

@Data
public class Season {
    private int year;
    private String start;
    private String end;
    private boolean current;
}
