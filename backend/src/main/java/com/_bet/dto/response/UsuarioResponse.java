package com._bet.dto.response;

import lombok.Data;

@Data
public class UsuarioResponse {
    
    private Long id;
    private String username;
    private String email;
    private String nombre;
    private String apellido;
    private String ladaTelefono;
    private String numeroTelefono;
    private String rol;
    private Boolean activo;
    
    // ========== INFORMACIÓN PERSONAL ==========
    
    private InformacionPersonalResponse informacionPersonal;
}
