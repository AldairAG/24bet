package com._bet.service.kyc;

import com._bet.dto.request.RevisionDocumentoRequest;
import com._bet.dto.request.SubirDocumentoRequest;
import com._bet.dto.response.DocumentoKycResponse;
import com._bet.dto.response.EstadoKycResponse;
import com._bet.entity.user.DocumentoKyc;
import com._bet.entity.user.Usuario;
import com._bet.repository.DocumentoKycRepository;
import com._bet.repository.UsuarioRepository;
import com._bet.service.file.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentoKycServiceImpl implements DocumentoKycService {
    
    private final DocumentoKycRepository documentoKycRepository;
    private final UsuarioRepository usuarioRepository;
    private final FileStorageService fileStorageService;
    
    @Override
    @Transactional
    public DocumentoKycResponse subirDocumento(Long usuarioId, SubirDocumentoRequest request, String ipUsuario) {
        // Validar usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Validar archivo
        if (request.getArchivo() == null || request.getArchivo().isEmpty()) {
            throw new RuntimeException("El archivo es obligatorio");
        }
        
        // Validar extensión
        if (!fileStorageService.esExtensionValidaKyc(request.getArchivo())) {
            throw new RuntimeException("Tipo de archivo no válido. Solo se permiten: JPG, JPEG, PNG, PDF, BMP, TIFF");
        }
        
        // Validar tamaño
        if (!fileStorageService.esTamañoValidoKyc(request.getArchivo())) {
            throw new RuntimeException("El archivo es demasiado grande. Tamaño máximo: 10MB");
        }
        
        // Desactivar documento anterior del mismo tipo si existe
        documentoKycRepository.findByUsuarioIdAndTipoDocumentoAndActivoTrue(usuarioId, request.getTipoDocumento())
                .ifPresent(documentoExistente -> {
                    documentoExistente.setActivo(false);
                    documentoKycRepository.save(documentoExistente);
                    log.info("Documento anterior desactivado: {}", documentoExistente.getId());
                });
        
        try {
            // Generar nombre personalizado para el archivo
            String nombrePersonalizado = String.format("kyc_%s_%s_%d", 
                usuario.getUsername(), 
                request.getTipoDocumento().getCodigo(),
                usuarioId);
            
            // Almacenar archivo
            String rutaArchivo = fileStorageService.almacenarArchivo(
                request.getArchivo(), 
                "kyc", 
                nombrePersonalizado
            );
            
            // Crear entidad documento
            DocumentoKyc documento = new DocumentoKyc();
            documento.setUsuario(usuario);
            documento.setTipoDocumento(request.getTipoDocumento());
            documento.setNombreArchivo(request.getArchivo().getOriginalFilename());
            documento.setRutaArchivo(rutaArchivo);
            documento.setTipoMime(request.getArchivo().getContentType());
            documento.setTamañoArchivo(request.getArchivo().getSize());
            documento.setEstado(DocumentoKyc.EstadoDocumento.PENDIENTE);
            documento.setObservaciones(request.getObservaciones());
            
            DocumentoKyc documentoGuardado = documentoKycRepository.save(documento);
            log.info("Documento KYC subido exitosamente: {}", documentoGuardado.getId());
            
            return convertirADocumentoResponse(documentoGuardado);
            
        } catch (Exception e) {
            log.error("Error al subir documento KYC para usuario {}: {}", usuarioId, e.getMessage(), e);
            throw new RuntimeException("Error al procesar el documento: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<DocumentoKycResponse> obtenerDocumentosUsuario(Long usuarioId) {
        List<DocumentoKyc> documentos = documentoKycRepository.findByUsuarioIdAndActivoTrueOrderByFechaSubidaDesc(usuarioId);
        return documentos.stream()
                .map(this::convertirADocumentoResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public EstadoKycResponse obtenerEstadoKyc(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        List<DocumentoKyc> documentos = documentoKycRepository.findByUsuarioIdAndActivoTrueOrderByFechaSubidaDesc(usuarioId);
        
        EstadoKycResponse response = new EstadoKycResponse();
        response.setUsuarioId(usuarioId);
        response.setUsername(usuario.getUsername());
        response.setKycCompleto(documentoKycRepository.tieneKycCompleto(usuarioId));
        
        // Contar documentos por estado
        response.setDocumentosAprobados((int) documentos.stream()
                .filter(d -> d.getEstado() == DocumentoKyc.EstadoDocumento.APROBADO).count());
        response.setDocumentosPendientes((int) documentos.stream()
                .filter(d -> d.getEstado() == DocumentoKyc.EstadoDocumento.PENDIENTE).count());
        response.setDocumentosDenegados((int) documentos.stream()
                .filter(d -> d.getEstado() == DocumentoKyc.EstadoDocumento.DENEGADO).count());
        
        response.setDocumentos(documentos.stream()
                .map(this::convertirADocumentoResponse)
                .collect(Collectors.toList()));
        
        // Estado por tipo de documento
        response.setIne(crearEstadoDocumentoTipo(documentos, DocumentoKyc.TipoDocumento.INE));
        response.setComprobanteDomicilio(crearEstadoDocumentoTipo(documentos, DocumentoKyc.TipoDocumento.COMPROBANTE_DOMICILIO));
        
        return response;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<DocumentoKycResponse> obtenerDocumentosPendientes(Pageable pageable) {
        return documentoKycRepository.findDocumentosPendientes(pageable)
                .map(this::convertirADocumentoResponse);
    }
    
    @Override
    @Transactional
    public DocumentoKycResponse revisarDocumento(Long documentoId, RevisionDocumentoRequest request, Long adminId) {
        DocumentoKyc documento = documentoKycRepository.findById(documentoId)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));
        
        if (documento.getEstado() != DocumentoKyc.EstadoDocumento.PENDIENTE) {
            throw new RuntimeException("Solo se pueden revisar documentos pendientes");
        }
        
        if (request.getAprobado()) {
            documento.aprobar(adminId, request.getObservaciones());
            log.info("Documento {} aprobado por admin {}", documentoId, adminId);
        } else {
            if (request.getMotivoRechazo() == null || request.getMotivoRechazo().trim().isEmpty()) {
                throw new RuntimeException("El motivo de rechazo es obligatorio");
            }
            documento.denegar(adminId, request.getMotivoRechazo(), request.getObservaciones());
            log.info("Documento {} denegado por admin {}: {}", documentoId, adminId, request.getMotivoRechazo());
        }
        
        DocumentoKyc documentoActualizado = documentoKycRepository.save(documento);
        return convertirADocumentoResponse(documentoActualizado);
    }
    
    @Override
    @Transactional(readOnly = true)
    public DocumentoKycResponse obtenerDocumentoPorId(Long documentoId) {
        DocumentoKyc documento = documentoKycRepository.findById(documentoId)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));
        return convertirADocumentoResponse(documento);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Resource descargarDocumento(Long documentoId, Long usuarioSolicitante, boolean esAdmin) {
        DocumentoKyc documento = documentoKycRepository.findById(documentoId)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));
        
        // Verificar permisos
        if (!esAdmin && !documento.getUsuario().getId().equals(usuarioSolicitante)) {
            throw new RuntimeException("No tiene permisos para acceder a este documento");
        }
        
        try {
            Path rutaArchivo = fileStorageService.obtenerRutaCompleta(documento.getRutaArchivo());
            Resource resource = new UrlResource(rutaArchivo.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("El archivo no existe o no es legible");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error al acceder al archivo", e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean tieneKycCompleto(Long usuarioId) {
        return documentoKycRepository.tieneKycCompleto(usuarioId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<DocumentoKycResponse> obtenerDocumentosPorEstado(DocumentoKyc.EstadoDocumento estado, Pageable pageable) {
        return documentoKycRepository.findByEstadoAndActivoTrueOrderByFechaSubidaDesc(estado, pageable)
                .map(this::convertirADocumentoResponse);
    }
    
    @Override
    @Transactional
    public void eliminarDocumento(Long documentoId, Long usuarioId) {
        DocumentoKyc documento = documentoKycRepository.findById(documentoId)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));
        
        if (!documento.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("No tiene permisos para eliminar este documento");
        }
        
        documento.setActivo(false);
        documentoKycRepository.save(documento);
        log.info("Documento {} eliminado lógicamente por usuario {}", documentoId, usuarioId);
    }
    
    // ========== MÉTODOS AUXILIARES ==========
    
    private DocumentoKycResponse convertirADocumentoResponse(DocumentoKyc documento) {
        DocumentoKycResponse response = new DocumentoKycResponse();
        response.setId(documento.getId());
        response.setUsuarioId(documento.getUsuario().getId());
        response.setUsernameUsuario(documento.getUsuario().getUsername());
        response.setTipoDocumento(documento.getTipoDocumento());
        response.setTipoDocumentoDescripcion(documento.getTipoDocumento().getDescripcion());
        response.setNombreArchivo(documento.getNombreArchivo());
        response.setTipoMime(documento.getTipoMime());
        response.setTamañoArchivo(documento.getTamañoArchivo());
        response.setEstado(documento.getEstado());
        response.setEstadoDescripcion(documento.getEstado().getDescripcion());
        response.setMotivoRechazo(documento.getMotivoRechazo());
        response.setObservaciones(documento.getObservaciones());
        response.setFechaSubida(documento.getFechaSubida());
        response.setFechaRevision(documento.getFechaRevision());
        response.setVersion(documento.getVersion());
        response.setActivo(documento.getActivo());
        
        // Campos calculados
        response.setUrlDescarga("/24bet/kyc/documentos/" + documento.getId() + "/descargar");
        response.setPuedeResubir(documento.getEstado() == DocumentoKyc.EstadoDocumento.DENEGADO);
        
        if (documento.getEstado() == DocumentoKyc.EstadoDocumento.PENDIENTE) {
            response.setDiasPendiente(ChronoUnit.DAYS.between(documento.getFechaSubida(), LocalDateTime.now()));
        }
        
        return response;
    }
    
    private EstadoKycResponse.EstadoDocumentoTipo crearEstadoDocumentoTipo(
            List<DocumentoKyc> documentos, DocumentoKyc.TipoDocumento tipoDocumento) {
        
        EstadoKycResponse.EstadoDocumentoTipo estado = new EstadoKycResponse.EstadoDocumentoTipo();
        
        DocumentoKyc ultimoDocumento = documentos.stream()
                .filter(d -> d.getTipoDocumento() == tipoDocumento)
                .findFirst()
                .orElse(null);
        
        estado.setTieneDocumento(ultimoDocumento != null);
        
        if (ultimoDocumento != null) {
            estado.setUltimoDocumento(convertirADocumentoResponse(ultimoDocumento));
            estado.setAprobado(ultimoDocumento.getEstado() == DocumentoKyc.EstadoDocumento.APROBADO);
            estado.setPendiente(ultimoDocumento.getEstado() == DocumentoKyc.EstadoDocumento.PENDIENTE);
            estado.setDenegado(ultimoDocumento.getEstado() == DocumentoKyc.EstadoDocumento.DENEGADO);
        } else {
            estado.setAprobado(false);
            estado.setPendiente(false);
            estado.setDenegado(false);
        }
        
        return estado;
    }
}
