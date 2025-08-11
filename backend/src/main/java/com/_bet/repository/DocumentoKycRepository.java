package com._bet.repository;

import com._bet.entity.DocumentoKyc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentoKycRepository extends JpaRepository<DocumentoKyc, Long> {
    
    /**
     * Encuentra todos los documentos de un usuario
     */
    List<DocumentoKyc> findByUsuarioIdAndActivoTrueOrderByFechaSubidaDesc(Long usuarioId);
    
    /**
     * Encuentra un documento específico por usuario y tipo
     */
    Optional<DocumentoKyc> findByUsuarioIdAndTipoDocumentoAndActivoTrue(Long usuarioId, DocumentoKyc.TipoDocumento tipoDocumento);
    
    /**
     * Encuentra documentos por estado
     */
    Page<DocumentoKyc> findByEstadoAndActivoTrueOrderByFechaSubidaDesc(DocumentoKyc.EstadoDocumento estado, Pageable pageable);
    
    /**
     * Encuentra documentos pendientes de revisión
     */
    @Query("SELECT d FROM DocumentoKyc d WHERE d.estado = 'PENDIENTE' AND d.activo = true ORDER BY d.fechaSubida ASC")
    Page<DocumentoKyc> findDocumentosPendientes(Pageable pageable);
    
    /**
     * Cuenta documentos por estado para un usuario
     */
    long countByUsuarioIdAndEstadoAndActivoTrue(Long usuarioId, DocumentoKyc.EstadoDocumento estado);
    
    /**
     * Verifica si un usuario tiene documentos aprobados por tipo
     */
    @Query("SELECT COUNT(d) > 0 FROM DocumentoKyc d WHERE d.usuario.id = :usuarioId AND d.tipoDocumento = :tipoDocumento AND d.estado = 'APROBADO' AND d.activo = true")
    boolean tieneDocumentoAprobado(@Param("usuarioId") Long usuarioId, @Param("tipoDocumento") DocumentoKyc.TipoDocumento tipoDocumento);
    
    /**
     * Obtiene el último documento subido por usuario y tipo
     */
    Optional<DocumentoKyc> findTopByUsuarioIdAndTipoDocumentoAndActivoTrueOrderByFechaSubidaDesc(Long usuarioId, DocumentoKyc.TipoDocumento tipoDocumento);
    
    /**
     * Encuentra documentos por rango de fechas
     */
    @Query("SELECT d FROM DocumentoKyc d WHERE d.fechaSubida BETWEEN :fechaInicio AND :fechaFin AND d.activo = true ORDER BY d.fechaSubida DESC")
    List<DocumentoKyc> findByRangoFechas(@Param("fechaInicio") java.time.LocalDateTime fechaInicio, @Param("fechaFin") java.time.LocalDateTime fechaFin);
    
    /**
     * Verifica si un usuario tiene todos los documentos KYC aprobados
     */
    @Query("SELECT CASE WHEN COUNT(DISTINCT d.tipoDocumento) = 2 THEN true ELSE false END " +
           "FROM DocumentoKyc d WHERE d.usuario.id = :usuarioId AND d.estado = 'APROBADO' AND d.activo = true")
    boolean tieneKycCompleto(@Param("usuarioId") Long usuarioId);
}
