package com._bet.dto.request;

import com._bet.entity.DocumentoKyc;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class SubirDocumentoRequest {
    
    @NotNull(message = "El tipo de documento es obligatorio")
    private DocumentoKyc.TipoDocumento tipoDocumento;
    
    @NotNull(message = "El archivo es obligatorio")
    private MultipartFile archivo;
    
    private String observaciones;
}
