package com._bet.service.auth;

import com._bet.dto.request.LoginRequest;
import com._bet.dto.request.RegistroRequest;
import com._bet.dto.response.JwtResponse;
import com._bet.dto.response.UsuarioResponse;

public interface AuthService {
    
    /**
     * Registra un nuevo usuario en el sistema
     * @param registroRequest Datos del usuario a registrar
     * @return UsuarioResponse con los datos del usuario registrado
     * @throws RuntimeException si el usuario ya existe o hay errores de validación
     */
    UsuarioResponse registrar(RegistroRequest registroRequest);
    
    /**
     * Autentica un usuario y genera un token JWT
     * @param loginRequest Credenciales del usuario (username/email y password)
     * @return JwtResponse con el token y datos del usuario
     * @throws RuntimeException si las credenciales son incorrectas
     */
    JwtResponse login(LoginRequest loginRequest);
}
