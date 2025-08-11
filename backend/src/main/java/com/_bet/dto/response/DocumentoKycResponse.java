package com._bet.dto.response;

import com._bet.entity.DocumentoKyc;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DocumentoKycResponse {
    
    private Long id;
    private Long usuarioId;
    private String usernameUsuario;
    private DocumentoKyc.TipoDocumento tipoDocumento;
    private String tipoDocumentoDescripcion;
    private String nombreArchivo;
    private String tipoMime;
    private Long tamañoArchivo;
    private DocumentoKyc.EstadoDocumento estado;
    private String estadoDescripcion;
    private String motivoRechazo;
    private String observaciones;
    private LocalDateTime fechaSubida;
    private LocalDateTime fechaRevision;
    private Integer version;
    private Boolean activo;
    
    // ========== CAMPOS CALCULADOS ==========
    
    private String urlDescarga;
    private Boolean puedeResubir;
    private Long diasPendiente;
}
