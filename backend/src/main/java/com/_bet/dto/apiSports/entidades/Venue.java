package com._bet.dto.apiSports.entidades;

import lombok.Data;

@Data
public class Venue {
    private int id;
    private String name;
    private String address;
    private String city;
    private int capacity;
    private String surface;
    private String image;
}
