package com._bet.dto.apiSports.response;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Response<T> {
    @JsonProperty("get")
    private String get;
    private int results;
    private Paging paging;

    @JsonProperty("response")
    private List<T> response;

    public static class Paging {
        private int current;
        private int total;

        public Paging() {
        }

        public int getCurrent() {
            return current;
        }

        public void setCurrent(int current) {
            this.current = current;
        }

        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
        }
    }
}
