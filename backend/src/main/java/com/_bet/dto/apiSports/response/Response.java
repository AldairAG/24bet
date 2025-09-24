package com._bet.dto.apiSports.response;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class Response<T> {
    private String get;
    private Map<String, String> parameters;
    private List<String> errors;
    private int results;
    private Paging paging;
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
