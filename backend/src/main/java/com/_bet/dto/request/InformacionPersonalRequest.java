package com._bet.dto.request;

import com._bet.entity.InformacionPersonal;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InformacionPersonalRequest {
    
    // ========== INFORMACIÓN BÁSICA ==========
    
    @Size(max = 50, message = "El primer nombre no puede exceder 50 caracteres")
    private String primerNombre;
    
    @Size(max = 50, message = "El segundo nombre no puede exceder 50 caracteres")
    private String segundoNombre;
    
    @Size(max = 50, message = "El apellido paterno no puede exceder 50 caracteres")
    private String apellidoPaterno;
    
    @Size(max = 50, message = "El apellido materno no puede exceder 50 caracteres")
    private String apellidoMaterno;
    
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate fechaNacimiento;
    
    private InformacionPersonal.Genero genero;
    
    // ========== INFORMACIÓN DE CONTACTO ==========
    
    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "El teléfono solo puede contener números y caracteres válidos")
    private String telefono;
    
    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "El teléfono móvil solo puede contener números y caracteres válidos")
    private String telefonoMovil;
    
    // ========== DIRECCIÓN ==========
    
    @Size(max = 100, message = "La calle no puede exceder 100 caracteres")
    private String calle;
    
    @Size(max = 10, message = "El número exterior no puede exceder 10 caracteres")
    private String numeroExterior;
    
    @Size(max = 10, message = "El número interior no puede exceder 10 caracteres")
    private String numeroInterior;
    
    @Size(max = 100, message = "La colonia no puede exceder 100 caracteres")
    private String colonia;
    
    @Pattern(regexp = "^[0-9]{5}$", message = "El código postal debe tener 5 dígitos")
    private String codigoPostal;
    
    @Size(max = 100, message = "La ciudad no puede exceder 100 caracteres")
    private String ciudad;
    
    @Size(max = 100, message = "El estado no puede exceder 100 caracteres")
    private String estado;
    
    @Size(max = 100, message = "El país no puede exceder 100 caracteres")
    private String pais;
    
    // ========== INFORMACIÓN FISCAL ==========
    
    @Pattern(regexp = "^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$", message = "El RFC no tiene un formato válido")
    private String rfc;
    
    @Pattern(regexp = "^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}[0-1][0-9][0-3][0-9][HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}[A-Z0-9]{1}[0-9]{1}$", 
             message = "La CURP no tiene un formato válido")
    private String curp;
    
    // ========== INFORMACIÓN ADICIONAL ==========
    
    
    @Size(max = 100, message = "La ocupación no puede exceder 100 caracteres")
    private String ocupacion;
    
    @Size(max = 50, message = "La nacionalidad no puede exceder 50 caracteres")
    private String nacionalidad;
}
