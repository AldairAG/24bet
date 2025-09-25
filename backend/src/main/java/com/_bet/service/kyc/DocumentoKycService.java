package com._bet.service.kyc;

import com._bet.dto.request.RevisionDocumentoRequest;
import com._bet.dto.request.SubirDocumentoRequest;
import com._bet.dto.response.DocumentoKycResponse;
import com._bet.dto.response.EstadoKycResponse;
import com._bet.entity.user.DocumentoKyc;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DocumentoKycService {
    
    /**
     * Sube un documento KYC para un usuario
     */
    DocumentoKycResponse subirDocumento(Long usuarioId, SubirDocumentoRequest request, String ipUsuario);
    
    /**
     * Obtiene todos los documentos de un usuario
     */
    List<DocumentoKycResponse> obtenerDocumentosUsuario(Long usuarioId);
    
    /**
     * Obtiene el estado completo de KYC de un usuario
     */
    EstadoKycResponse obtenerEstadoKyc(Long usuarioId);
    
    /**
     * Obtiene documentos pendientes de revisión (solo admin)
     */
    Page<DocumentoKycResponse> obtenerDocumentosPendientes(Pageable pageable);
    
    /**
     * Revisa un documento (aprobar o denegar) - Solo admin
     */
    DocumentoKycResponse revisarDocumento(Long documentoId, RevisionDocumentoRequest request, Long adminId);
    
    /**
     * Obtiene un documento por ID
     */
    DocumentoKycResponse obtenerDocumentoPorId(Long documentoId);
    
    /**
     * Descarga un archivo de documento
     */
    Resource descargarDocumento(Long documentoId, Long usuarioSolicitante, boolean esAdmin);
    
    /**
     * Verifica si un usuario tiene KYC completo
     */
    boolean tieneKycCompleto(Long usuarioId);
    
    /**
     * Obtiene documentos por estado
     */
    Page<DocumentoKycResponse> obtenerDocumentosPorEstado(DocumentoKyc.EstadoDocumento estado, Pageable pageable);
    
    /**
     * Elimina lógicamente un documento
     */
    void eliminarDocumento(Long documentoId, Long usuarioId);
}
