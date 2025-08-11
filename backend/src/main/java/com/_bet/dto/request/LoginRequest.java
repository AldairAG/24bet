package com._bet.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    
    @NotBlank(message = "El nombre de usuario o email es obligatorio")
    private String username; // Puede ser username o email
    
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}
