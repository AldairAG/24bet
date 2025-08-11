package com._bet.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "documentos_kyc")
@Data
public class DocumentoKyc {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // ========== RELACIÓN CON USUARIO ==========
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @NotNull(message = "El usuario es obligatorio")
    private Usuario usuario;
    
    // ========== INFORMACIÓN DEL DOCUMENTO ==========
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false)
    @NotNull(message = "El tipo de documento es obligatorio")
    private TipoDocumento tipoDocumento;
    
    @Column(name = "nombre_archivo", nullable = false)
    @NotBlank(message = "El nombre del archivo es obligatorio")
    private String nombreArchivo;
    
    @Column(name = "ruta_archivo", nullable = false)
    @NotBlank(message = "La ruta del archivo es obligatoria")
    private String rutaArchivo;
    
    @Column(name = "tipo_mime")
    private String tipoMime;
    
    @Column(name = "tamaño_archivo")
    private Long tamañoArchivo;
    
    // ========== ESTADO Y VERIFICACIÓN ==========
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    @NotNull(message = "El estado es obligatorio")
    private EstadoDocumento estado = EstadoDocumento.PENDIENTE;
    
    @Column(name = "motivo_rechazo", columnDefinition = "TEXT")
    private String motivoRechazo;
    
    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
    
    // ========== INFORMACIÓN DE AUDITORÍA ==========
    
    @Column(name = "fecha_subida", nullable = false)
    private LocalDateTime fechaSubida;
    
    @Column(name = "fecha_revision")
    private LocalDateTime fechaRevision;
    
    // ========== METADATOS ==========
    
    @Column(name = "version")
    private Integer version = 1;
    
    @Column(name = "activo")
    private Boolean activo = true;
    
    // ========== ENUMS ==========
    
    public enum TipoDocumento {
        INE("INE", "Credencial de Elector"),
        COMPROBANTE_DOMICILIO("COMPROBANTE_DOMICILIO", "Comprobante de Domicilio");
        
        private final String codigo;
        private final String descripcion;
        
        TipoDocumento(String codigo, String descripcion) {
            this.codigo = codigo;
            this.descripcion = descripcion;
        }
        
        public String getCodigo() {
            return codigo;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
    
    public enum EstadoDocumento {
        PENDIENTE("Pendiente de revisión"),
        APROBADO("Aprobado"),
        DENEGADO("Denegado"),
        RESUBMITIR("Requiere reenvío");
        
        private final String descripcion;
        
        EstadoDocumento(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
    
    // ========== MÉTODOS DE CICLO DE VIDA ==========
    
    @PrePersist
    protected void onCreate() {
        this.fechaSubida = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoDocumento.PENDIENTE;
        }
        if (this.version == null) {
            this.version = 1;
        }
        if (this.activo == null) {
            this.activo = true;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        if (this.estado == EstadoDocumento.APROBADO || this.estado == EstadoDocumento.DENEGADO) {
            this.fechaRevision = LocalDateTime.now();
        }
    }
    
    // ========== MÉTODOS AUXILIARES ==========
    
    /**
     * Verifica si el documento está aprobado
     */
    public boolean isAprobado() {
        return EstadoDocumento.APROBADO.equals(this.estado);
    }
    
    /**
     * Verifica si el documento está denegado
     */
    public boolean isDenegado() {
        return EstadoDocumento.DENEGADO.equals(this.estado);
    }
    
    /**
     * Verifica si el documento está pendiente
     */
    public boolean isPendiente() {
        return EstadoDocumento.PENDIENTE.equals(this.estado);
    }
    
    /**
     * Marca el documento como aprobado
     */
    public void aprobar(Long adminId, String observaciones) {
        this.estado = EstadoDocumento.APROBADO;
        this.observaciones = observaciones;
        this.motivoRechazo = null;
        this.fechaRevision = LocalDateTime.now();
    }
    
    /**
     * Marca el documento como denegado
     */
    public void denegar(Long adminId, String motivoRechazo, String observaciones) {
        this.estado = EstadoDocumento.DENEGADO;
        this.motivoRechazo = motivoRechazo;
        this.observaciones = observaciones;
        this.fechaRevision = LocalDateTime.now();
    }
    
    /**
     * Obtiene la extensión del archivo
     */
    public String getExtensionArchivo() {
        if (nombreArchivo != null && nombreArchivo.contains(".")) {
            return nombreArchivo.substring(nombreArchivo.lastIndexOf("."));
        }
        return "";
    }
}
