package com._bet.dto.response;

import com._bet.entity.InformacionPersonal;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InformacionPersonalResponse {
    
    private Long id;
    
    // ========== INFORMACIÓN BÁSICA ==========
    
    private String primerNombre;
    private String segundoNombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private LocalDate fechaNacimiento;
    private InformacionPersonal.Genero genero;
    
    // ========== INFORMACIÓN DE CONTACTO ==========
    
    private String telefono;
    private String telefonoMovil;
    
    // ========== DIRECCIÓN ==========
    
    private String calle;
    private String numeroExterior;
    private String numeroInterior;
    private String colonia;
    private String codigoPostal;
    private String ciudad;
    private String estado;
    private String pais;
    
    // ========== INFORMACIÓN FISCAL ==========
    
    private String rfc;
    private String curp;
    
    // ========== INFORMACIÓN ADICIONAL ==========
    
    private String ocupacion;
    private String nacionalidad;
    
    // ========== METADATOS ==========
    
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    
    // ========== CAMPOS CALCULADOS ==========
    
    private String nombreCompleto;
    private String direccionCompleta;
}
