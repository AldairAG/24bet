package com._bet.dto.response;

import java.math.BigDecimal;

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
    private String fechaNacimiento;
    private BigDecimal saldoUsd;
    private String fechaCreacion;
    
    // ========== INFORMACIÓN PERSONAL ==========
    
    private InformacionPersonalResponse informacionPersonal;
}
