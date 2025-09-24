package com._bet.dto.apiSports.entidades;

import lombok.Data;

@Data
public class Team {
    private int id;
    private String name;
    private String code;
    private String country;
    private int founded;
    private boolean national;
    private String logo;
    private Boolean winner;
}
