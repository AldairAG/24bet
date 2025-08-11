package com._bet.controller;

import com._bet.dto.request.InformacionPersonalRequest;
import com._bet.dto.response.InformacionPersonalResponse;
import com._bet.service.user.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/24bet/informacion-personal")
@RequiredArgsConstructor
@Tag(name = "Información Personal", description = "Gestión de información personal de usuarios")
public class InformacionPersonalController {

    private final UsuarioService usuarioService;

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    @Operation(summary = "Obtener información personal de un usuario")
    public ResponseEntity<InformacionPersonalResponse> obtenerInformacionPersonal(
            @PathVariable Long userId,
            Authentication authentication) {
        
        var usuarioResponse = usuarioService.obtenerUsuarioPorId(userId);
        return ResponseEntity.ok(usuarioResponse.getInformacionPersonal());
    }

    @GetMapping("/mi-informacion")
    @Operation(summary = "Obtener mi información personal")
    public ResponseEntity<InformacionPersonalResponse> obtenerMiInformacionPersonal(
            Authentication authentication) {
        
        Long userId = Long.parseLong(authentication.getName());
        var usuarioResponse = usuarioService.obtenerUsuarioPorId(userId);
        return ResponseEntity.ok(usuarioResponse.getInformacionPersonal());
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    @Operation(summary = "Actualizar información personal de un usuario")
    public ResponseEntity<InformacionPersonalResponse> actualizarInformacionPersonal(
            @PathVariable Long userId,
            @Valid @RequestBody InformacionPersonalRequest request,
            Authentication authentication) {
        
        // Para usuarios normales, usar editarPerfil
        // Para admin, usar editarUsuarioComoAdmin (simplificado aquí)
        var editarPerfilRequest = new com._bet.dto.request.EditarPerfilRequest();
        editarPerfilRequest.setInformacionPersonal(request);
        
        var usuarioResponse = usuarioService.editarPerfil(userId, editarPerfilRequest);
        return ResponseEntity.ok(usuarioResponse.getInformacionPersonal());
    }

    @PutMapping("/mi-informacion")
    @Operation(summary = "Actualizar mi información personal")
    public ResponseEntity<InformacionPersonalResponse> actualizarMiInformacionPersonal(
            @Valid @RequestBody InformacionPersonalRequest request,
            Authentication authentication) {
        
        Long userId = Long.parseLong(authentication.getName());
        
        var editarPerfilRequest = new com._bet.dto.request.EditarPerfilRequest();
        editarPerfilRequest.setInformacionPersonal(request);
        
        var usuarioResponse = usuarioService.editarPerfil(userId, editarPerfilRequest);
        return ResponseEntity.ok(usuarioResponse.getInformacionPersonal());
    }
}
