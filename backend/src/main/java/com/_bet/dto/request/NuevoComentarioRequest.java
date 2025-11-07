package com._bet.dto.request;

import lombok.Data;

@Data
public class NuevoComentarioRequest {
    private String contenido;
    private String autor;
    private Long tiketId;
}
