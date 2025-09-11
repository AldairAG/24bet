package com._bet.dto.thesportsdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TheSportDbCountryDto {

    @JsonProperty("flag_url_32")
    private String flagUrl32;

    @JsonProperty("name_en")
    private String nameEn;
    
    @JsonProperty("name_es")
    private String nameEs;
    
    @JsonProperty("name_de")
    private String nameDe;
    
    @JsonProperty("name_fr")
    private String nameFr;
    
    @JsonProperty("name_it")
    private String nameIt;
    
    @JsonProperty("name_cn")
    private String nameCn;
    
    @JsonProperty("name_jp")
    private String nameJp;
    
    @JsonProperty("name_ru")
    private String nameRu;
    
    @JsonProperty("name_pt")
    private String namePt;
}
