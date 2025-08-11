package com._bet.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RegistroRequest {
    
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;
    
    private String nombre;
    
    private String apellido;

    @Size(max = 5, message = "La lada no puede tener más de 5 caracteres")
    private String ladaTelefono;

    @Size(min = 7, max = 10, message = "El número de teléfono debe tener entre 7 y 10 dígitos")
    private String numeroTelefono;
    
    private LocalDateTime fechaNacimiento;
}
