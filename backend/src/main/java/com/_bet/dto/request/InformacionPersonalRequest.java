package com._bet.dto.request;

import com._bet.entity.InformacionPersonal;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InformacionPersonalRequest {
    
    private InformacionPersonal.Genero genero;
    
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
    
    // ========== INFORMACIÓN ADICIONAL ==========
    
    
    @Size(max = 100, message = "La ocupación no puede exceder 100 caracteres")
    private String ocupacion;
    
}
