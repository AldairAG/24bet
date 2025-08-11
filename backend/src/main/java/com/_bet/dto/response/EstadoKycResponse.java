package com._bet.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class EstadoKycResponse {
    
    private Long usuarioId;
    private String username;
    private Boolean kycCompleto;
    private Integer documentosAprobados;
    private Integer documentosPendientes;
    private Integer documentosDenegados;
    private List<DocumentoKycResponse> documentos;
    
    // ========== ESTADO POR TIPO DE DOCUMENTO ==========
    
    private EstadoDocumentoTipo ine;
    private EstadoDocumentoTipo comprobanteDomicilio;
    
    @Data
    public static class EstadoDocumentoTipo {
        private Boolean tieneDocumento;
        private DocumentoKycResponse ultimoDocumento;
        private Boolean aprobado;
        private Boolean pendiente;
        private Boolean denegado;
    }
}
