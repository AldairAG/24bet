package com._bet.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "informacion_personal")
@Data
public class InformacionPersonal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // ========== INFORMACIÓN BÁSICA ==========
    
    @Enumerated(EnumType.STRING)
    @Column(name = "genero", length = 20)
    private Genero genero;
    
    // ========== DIRECCIÓN ==========
    
    @Column(name = "calle", length = 100)
    @Size(max = 100, message = "La calle no puede exceder 100 caracteres")
    private String calle;
    
    @Column(name = "numero_exterior", length = 10)
    @Size(max = 10, message = "El número exterior no puede exceder 10 caracteres")
    private String numeroExterior;
    
    @Column(name = "numero_interior", length = 10)
    @Size(max = 10, message = "El número interior no puede exceder 10 caracteres")
    private String numeroInterior;
    
    @Column(name = "colonia", length = 100)
    @Size(max = 100, message = "La colonia no puede exceder 100 caracteres")
    private String colonia;
    
    @Column(name = "codigo_postal", length = 10)
    @Pattern(regexp = "^[0-9]{5}$", message = "El código postal debe tener 5 dígitos")
    private String codigoPostal;
    
    @Column(name = "ciudad", length = 100)
    @Size(max = 100, message = "La ciudad no puede exceder 100 caracteres")
    private String ciudad;
    
    @Column(name = "estado", length = 100)
    @Size(max = 100, message = "El estado no puede exceder 100 caracteres")
    private String estado;
    
    @Column(name = "pais", length = 100)
    @Size(max = 100, message = "El país no puede exceder 100 caracteres")
    private String pais;
    
    // ========== INFORMACIÓN FISCAL ==========
    
    @Column(name = "rfc", length = 13, unique = true)
    @Pattern(regexp = "^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$", message = "El RFC no tiene un formato válido")
    private String rfc;
    
    // ========== INFORMACIÓN ADICIONAL ==========
    
    @Column(name = "ocupacion", length = 100)
    @Size(max = 100, message = "La ocupación no puede exceder 100 caracteres")
    private String ocupacion;
    
    // ========== METADATOS ==========
    
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    // ========== RELACIÓN CON USUARIO ==========
    
    @OneToOne(mappedBy = "informacionPersonal")
    private Usuario usuario;
    
    // ========== ENUMS ==========
    
    public enum Genero {
        MASCULINO,
        FEMENINO,
        OTRO,
        NO_ESPECIFICADO
    }
    // ========== MÉTODOS DE CICLO DE VIDA ==========
    
    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
    
    // ========== MÉTODOS AUXILIARES ==========
    
    /**
     * Obtiene la dirección completa
     * @return String con la dirección completa
     */
    public String getDireccionCompleta() {
        StringBuilder direccion = new StringBuilder();
        
        if (calle != null) {
            direccion.append(calle);
        }
        
        if (numeroExterior != null) {
            direccion.append(" ").append(numeroExterior);
        }
        
        if (numeroInterior != null && !numeroInterior.isEmpty()) {
            direccion.append(" Int. ").append(numeroInterior);
        }
        
        if (colonia != null) {
            direccion.append(", ").append(colonia);
        }
        
        if (codigoPostal != null) {
            direccion.append(", CP ").append(codigoPostal);
        }
        
        if (ciudad != null) {
            direccion.append(", ").append(ciudad);
        }
        
        if (estado != null) {
            direccion.append(", ").append(estado);
        }
        
        if (pais != null) {
            direccion.append(", ").append(pais);
        }
        
        return direccion.toString().trim();
    }
}
