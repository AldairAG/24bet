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
    
    @Column(name = "primer_nombre", length = 50)
    @Size(max = 50, message = "El primer nombre no puede exceder 50 caracteres")
    private String primerNombre;
    
    @Column(name = "segundo_nombre", length = 50)
    @Size(max = 50, message = "El segundo nombre no puede exceder 50 caracteres")
    private String segundoNombre;
    
    @Column(name = "apellido_paterno", length = 50)
    @Size(max = 50, message = "El apellido paterno no puede exceder 50 caracteres")
    private String apellidoPaterno;
    
    @Column(name = "apellido_materno", length = 50)
    @Size(max = 50, message = "El apellido materno no puede exceder 50 caracteres")
    private String apellidoMaterno;
    
    @Column(name = "fecha_nacimiento")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate fechaNacimiento;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "genero", length = 20)
    private Genero genero;
    
    // ========== INFORMACIÓN DE CONTACTO ==========
    
    @Column(name = "telefono", length = 15)
    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "El teléfono solo puede contener números y caracteres válidos")
    private String telefono;
    
    @Column(name = "telefono_movil", length = 15)
    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "El teléfono móvil solo puede contener números y caracteres válidos")
    private String telefonoMovil;
    
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
    
    @Column(name = "curp", length = 18, unique = true)
    @Pattern(regexp = "^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}[0-1][0-9][0-3][0-9][HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}[A-Z0-9]{1}[0-9]{1}$", 
             message = "La CURP no tiene un formato válido")
    private String curp;
    
    // ========== INFORMACIÓN ADICIONAL ==========
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_civil", length = 20)
    private EstadoCivil estadoCivil;
    
    @Column(name = "ocupacion", length = 100)
    @Size(max = 100, message = "La ocupación no puede exceder 100 caracteres")
    private String ocupacion;
    
    @Column(name = "nacionalidad", length = 50)
    @Size(max = 50, message = "La nacionalidad no puede exceder 50 caracteres")
    private String nacionalidad;
    
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
    
    public enum EstadoCivil {
        SOLTERO,
        CASADO,
        DIVORCIADO,
        VIUDO,
        UNION_LIBRE,
        SEPARADO,
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
     * Obtiene el nombre completo del usuario
     * @return String con el nombre completo
     */
    public String getNombreCompleto() {
        StringBuilder nombreCompleto = new StringBuilder();
        
        if (primerNombre != null) {
            nombreCompleto.append(primerNombre);
        }
        
        if (segundoNombre != null && !segundoNombre.isEmpty()) {
            nombreCompleto.append(" ").append(segundoNombre);
        }
        
        if (apellidoPaterno != null) {
            nombreCompleto.append(" ").append(apellidoPaterno);
        }
        
        if (apellidoMaterno != null) {
            nombreCompleto.append(" ").append(apellidoMaterno);
        }
        
        return nombreCompleto.toString().trim();
    }
    
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
