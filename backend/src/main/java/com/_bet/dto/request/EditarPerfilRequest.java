package com._bet.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class EditarPerfilRequest {
    
    @Email(message = "El email debe tener un formato válido")
    private String email;
    
    private String nombre;
    
    private String apellido;
    
    @Size(max = 5, message = "La lada no puede tener más de 5 caracteres")
    private String ladaTelefono;
    
    @Size(min = 7, max = 10, message = "El número de teléfono debe tener entre 7 y 10 dígitos")
    private String numeroTelefono;
    
    private Date fechaNacimiento;
    
    // ========== INFORMACIÓN PERSONAL ==========
    
    @Valid
    private InformacionPersonalRequest informacionPersonal;
}
