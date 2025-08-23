package com._bet.controller;

import com._bet.controller.AuthController.ApiResponseWrapper;
import com._bet.dto.request.CambiarPasswordRequest;
import com._bet.dto.request.EditarPerfilRequest;
import com._bet.dto.request.EditarUsuarioAdminRequest;
import com._bet.dto.response.UsuarioResponse;
import com._bet.entity.Usuario;
import com._bet.service.user.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/24bet/usuarios")
@RequiredArgsConstructor
@Tag(name = "Gestión de Usuarios", description = "CRUD para la gestión de usuarios")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    // ========== ENDPOINTS PARA ADMINISTRADORES ==========
    //https://web.postman.co/workspace/My-Workspace~b4d7d548-256b-4458-83c1-7d3a47f9a191/collection/39804580-a8686f31-e866-43ae-900e-4ec4ddd6936f?action=share&source=copy-link&creator=39804580
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos los usuarios", description = "Solo disponible para administradores")
    public ResponseEntity<ApiResponseWrapper<Page<UsuarioResponse>>> listarUsuarios(Pageable pageable) {
        try {
            Page<UsuarioResponse> usuarios = usuarioService.obtenerTodosLosUsuarios(pageable);
            return ResponseEntity.ok(new ApiResponseWrapper<>(
                    true, 
                    "Usuarios obtenidos exitosamente", 
                    usuarios
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponseWrapper<>(false, "Error al obtener usuarios", null));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and #id == authentication.principal.id)")
    @Operation(summary = "Obtener usuario por ID", description = "Admin puede ver cualquier usuario, usuarios solo pueden ver su propio perfil")
    public ResponseEntity<ApiResponseWrapper<UsuarioResponse>> obtenerUsuarioPorId(@PathVariable Long id) {
        try {
            UsuarioResponse usuario = usuarioService.obtenerUsuarioPorId(id);
            return ResponseEntity.ok(new ApiResponseWrapper<>(
                    true, 
                    "Usuario obtenido exitosamente", 
                    usuario
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponseWrapper<>(false, "Error al obtener usuario", null));
        }
    }

    @PutMapping("/{id}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Editar usuario como administrador", description = "Solo administradores pueden editar todos los campos")
    public ResponseEntity<ApiResponseWrapper<UsuarioResponse>> editarUsuarioComoAdmin(
            @PathVariable Long id,
            @Valid @RequestBody EditarUsuarioAdminRequest request) {
        try {
            UsuarioResponse usuario = usuarioService.editarUsuarioComoAdmin(id, request);
            return ResponseEntity.ok(new ApiResponseWrapper<>(
                    true, 
                    "Usuario actualizado exitosamente por administrador", 
                    usuario
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                    .body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponseWrapper<>(false, "Error al actualizar usuario", null));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar usuario", description = "Solo administradores pueden eliminar usuarios")
    public ResponseEntity<ApiResponseWrapper<Object>> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok(new ApiResponseWrapper<>(
                    true, 
                    "Usuario eliminado exitosamente", 
                    null
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponseWrapper<>(false, "Error al eliminar usuario", null));
        }
    }

    @PatchMapping("/{id}/activar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activar usuario", description = "Solo administradores pueden activar usuarios")
    public ResponseEntity<ApiResponseWrapper<Object>> activarUsuario(@PathVariable Long id) {
        try {
            usuarioService.activarUsuario(id);
            return ResponseEntity.ok(new ApiResponseWrapper<>(
                    true, 
                    "Usuario activado exitosamente", 
                    null
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponseWrapper<>(false, "Error al activar usuario", null));
        }
    }

    @PatchMapping("/{id}/desactivar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Desactivar usuario", description = "Solo administradores pueden desactivar usuarios")
    public ResponseEntity<ApiResponseWrapper<Object>> desactivarUsuario(@PathVariable Long id) {
        try {
            usuarioService.desactivarUsuario(id);
            return ResponseEntity.ok(new ApiResponseWrapper<>(
                    true, 
                    "Usuario desactivado exitosamente", 
                    null
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponseWrapper<>(false, "Error al desactivar usuario", null));
        }
    }

    // ========== ENDPOINTS PARA USUARIOS (AUTO-EDICIÓN) ==========

    @PutMapping("/{id}/perfil")
    @PreAuthorize("#id == authentication.principal.id")
    @Operation(summary = "Editar perfil propio", description = "Los usuarios solo pueden editar su propio perfil")
    public ResponseEntity<ApiResponseWrapper<UsuarioResponse>> editarPerfilPropio(
            @PathVariable Long id,
            @Valid @RequestBody EditarPerfilRequest request) {
        try {
            UsuarioResponse usuario = usuarioService.editarPerfil(id, request);
            return ResponseEntity.ok(new ApiResponseWrapper<>(
                    true, 
                    "Perfil actualizado exitosamente", 
                    usuario
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                    .body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponseWrapper<>(false, "Error al actualizar perfil", null));
        }
    }

    @PatchMapping("/{id}/cambiar-password")
    @PreAuthorize("#id == authentication.principal.id")
    @Operation(summary = "Cambiar contraseña propia", description = "Los usuarios solo pueden cambiar su propia contraseña")
    public ResponseEntity<ApiResponseWrapper<Object>> cambiarPassword(
            @PathVariable Long id,
            @Valid @RequestBody CambiarPasswordRequest request) {
        try {
            usuarioService.cambiarPassword(id, request);
            return ResponseEntity.ok(new ApiResponseWrapper<>(
                    true, 
                    "Contraseña cambiada exitosamente", 
                    null
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                    .body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponseWrapper<>(false, "Error al cambiar contraseña", null));
        }
    }

    // ========== ENDPOINT MIXTO ==========

    @GetMapping("/mi-perfil")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Obtener mi perfil", description = "Cualquier usuario autenticado puede ver su propio perfil")
    public ResponseEntity<ApiResponseWrapper<UsuarioResponse>> obtenerMiPerfil() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Usuario usuario = (Usuario) authentication.getPrincipal();
            UsuarioResponse usuarioResponse = usuarioService.obtenerUsuarioPorId(usuario.getId());
            
            return ResponseEntity.ok(new ApiResponseWrapper<>(
                    true, 
                    "Perfil obtenido exitosamente", 
                    usuarioResponse
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponseWrapper<>(false, "Error al obtener perfil", null));
        }
    }
}
