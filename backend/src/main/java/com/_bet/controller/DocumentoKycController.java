package com._bet.controller;

import com._bet.dto.request.RevisionDocumentoRequest;
import com._bet.dto.request.SubirDocumentoRequest;
import com._bet.dto.response.DocumentoKycResponse;
import com._bet.dto.response.EstadoKycResponse;
import com._bet.entity.user.DocumentoKyc;
import com._bet.service.kyc.DocumentoKycService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/24bet/kyc")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "KYC - Documentos", description = "Gestión de documentos KYC (Know Your Customer)")
public class DocumentoKycController {
    
    private final DocumentoKycService documentoKycService;
    
    @PostMapping("/documentos")
    @Operation(summary = "Subir documento KYC", description = "Permite a un usuario subir documentos para verificación KYC")
    public ResponseEntity<DocumentoKycResponse> subirDocumento(
            @ModelAttribute @Valid SubirDocumentoRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        
        Long usuarioId = Long.parseLong(authentication.getName());
        String ipUsuario = obtenerIpCliente(httpRequest);
        
        DocumentoKycResponse response = documentoKycService.subirDocumento(usuarioId, request, ipUsuario);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/mi-estado")
    @Operation(summary = "Obtener mi estado de KYC", description = "Obtiene el estado completo de verificación KYC del usuario autenticado")
    public ResponseEntity<EstadoKycResponse> obtenerMiEstadoKyc(Authentication authentication) {
        Long usuarioId = Long.parseLong(authentication.getName());
        EstadoKycResponse response = documentoKycService.obtenerEstadoKyc(usuarioId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/mis-documentos")
    @Operation(summary = "Obtener mis documentos", description = "Obtiene todos los documentos KYC del usuario autenticado")
    public ResponseEntity<List<DocumentoKycResponse>> obtenerMisDocumentos(Authentication authentication) {
        Long usuarioId = Long.parseLong(authentication.getName());
        List<DocumentoKycResponse> documentos = documentoKycService.obtenerDocumentosUsuario(usuarioId);
        return ResponseEntity.ok(documentos);
    }
    
    @GetMapping("/documentos/{documentoId}")
    @PreAuthorize("hasRole('ADMIN') or @documentoKycService.obtenerDocumentoPorId(#documentoId).usuarioId == authentication.principal.id")
    @Operation(summary = "Obtener documento por ID", description = "Obtiene información de un documento específico")
    public ResponseEntity<DocumentoKycResponse> obtenerDocumento(
            @PathVariable Long documentoId) {
        DocumentoKycResponse response = documentoKycService.obtenerDocumentoPorId(documentoId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/documentos/{documentoId}/descargar")
    @PreAuthorize("hasRole('ADMIN') or @documentoKycService.obtenerDocumentoPorId(#documentoId).usuarioId == authentication.principal.id")
    @Operation(summary = "Descargar documento", description = "Descarga el archivo de un documento KYC")
    public ResponseEntity<Resource> descargarDocumento(
            @PathVariable Long documentoId,
            Authentication authentication) {
        
        Long usuarioSolicitante = Long.parseLong(authentication.getName());
        boolean esAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        Resource resource = documentoKycService.descargarDocumento(documentoId, usuarioSolicitante, esAdmin);
        DocumentoKycResponse documento = documentoKycService.obtenerDocumentoPorId(documentoId);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(documento.getTipoMime()))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=\"" + documento.getNombreArchivo() + "\"")
                .body(resource);
    }
    
    @DeleteMapping("/documentos/{documentoId}")
    @Operation(summary = "Eliminar documento", description = "Elimina lógicamente un documento del usuario")
    public ResponseEntity<Void> eliminarDocumento(
            @PathVariable Long documentoId,
            Authentication authentication) {
        
        Long usuarioId = Long.parseLong(authentication.getName());
        documentoKycService.eliminarDocumento(documentoId, usuarioId);
        return ResponseEntity.noContent().build();
    }
    
    // ========== ENDPOINTS PARA ADMINISTRADORES ==========
    
    @GetMapping("/admin/documentos/pendientes")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Obtener documentos pendientes", description = "Obtiene todos los documentos pendientes de revisión")
    public ResponseEntity<Page<DocumentoKycResponse>> obtenerDocumentosPendientes(Pageable pageable) {
        Page<DocumentoKycResponse> documentos = documentoKycService.obtenerDocumentosPendientes(pageable);
        return ResponseEntity.ok(documentos);
    }
    
    @GetMapping("/admin/documentos")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Obtener documentos por estado", description = "Obtiene documentos filtrados por estado")
    public ResponseEntity<Page<DocumentoKycResponse>> obtenerDocumentosPorEstado(
            @RequestParam DocumentoKyc.EstadoDocumento estado,
            Pageable pageable) {
        Page<DocumentoKycResponse> documentos = documentoKycService.obtenerDocumentosPorEstado(estado, pageable);
        return ResponseEntity.ok(documentos);
    }
    
    @GetMapping("/admin/usuarios/{usuarioId}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Obtener estado KYC de usuario", description = "Obtiene el estado KYC de cualquier usuario")
    public ResponseEntity<EstadoKycResponse> obtenerEstadoKycUsuario(
            @PathVariable Long usuarioId) {
        EstadoKycResponse response = documentoKycService.obtenerEstadoKyc(usuarioId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/admin/documentos/{documentoId}/revisar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Revisar documento", description = "Aprueba o deniega un documento KYC")
    public ResponseEntity<DocumentoKycResponse> revisarDocumento(
            @PathVariable Long documentoId,
            @Valid @RequestBody RevisionDocumentoRequest request,
            Authentication authentication) {
        
        Long adminId = Long.parseLong(authentication.getName());
        DocumentoKycResponse response = documentoKycService.revisarDocumento(documentoId, request, adminId);
        
        log.info("Documento {} {} por admin {}", 
                documentoId, 
                request.getAprobado() ? "aprobado" : "denegado", 
                adminId);
        
        return ResponseEntity.ok(response);
    }
    
    // ========== MÉTODOS AUXILIARES ==========
    
    private String obtenerIpCliente(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
