package com._bet.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RevisionDocumentoRequest {
    
    @NotNull(message = "La decisión es obligatoria")
    private Boolean aprobado;
    
    private String observaciones;
    
    // Solo requerido si aprobado = false
    private String motivoRechazo;
}
