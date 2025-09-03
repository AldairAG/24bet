package com._bet.dto.response;

import com._bet.entity.Usuario;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    
    private String token;
    
    private String type = "Bearer";
    
    private Long id;
    
    private String username;
    
    private String email;
    
    private String role;

    private Usuario user;

    public JwtResponse(String token, Long id, String username, String email, String role, Usuario user) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.user = user;
    }
}
