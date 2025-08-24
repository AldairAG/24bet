package com._bet.dto.request;

import com._bet.entity.Usuario;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class EditarUsuarioAdminRequest {
    
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;
    
    private String nombre;
    
    private String apellido;
    
    @Size(max = 5, message = "La lada no puede tener más de 5 caracteres")
    private String ladaTelefono;
    
    @Size(min = 7, max = 10, message = "El número de teléfono debe tener entre 7 y 10 dígitos")
    private String numeroTelefono;
    
    private Date fechaNacimiento;
    
    private Boolean activo;
    
    private Usuario.Rol rol;
    
    // ========== INFORMACIÓN PERSONAL ==========
    
    @Valid
    private InformacionPersonalRequest informacionPersonal;
}
