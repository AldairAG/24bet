package com._bet.service.user;

import com._bet.dto.request.CambiarPasswordRequest;
import com._bet.dto.request.EditarPerfilRequest;
import com._bet.dto.request.EditarUsuarioAdminRequest;
import com._bet.dto.request.RegistroRequest;
import com._bet.dto.response.UsuarioResponse;
import com._bet.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

public interface UsuarioService extends UserDetailsService {
    
    // ========== MÉTODOS DE REGISTRO Y BÚSQUEDA ==========
    
    /**
     * Registra un nuevo usuario
     * @param registroRequest Datos del usuario a registrar
     * @return UsuarioResponse con los datos del usuario creado
     * @throws RuntimeException si el usuario o email ya existen
     */
    UsuarioResponse registrarUsuario(RegistroRequest registroRequest);
    
    /**
     * Busca un usuario por username o email
     * @param identifier Username o email del usuario
     * @return Optional con el usuario si existe
     */
    Optional<Usuario> buscarPorUsernameOEmail(String identifier);
    
    /**
     * Busca un usuario por ID
     * @param id ID del usuario
     * @return Optional con el usuario si existe
     */
    Optional<Usuario> buscarPorId(Long id);
    
    // ========== MÉTODOS CRUD ==========
    
    /**
     * Obtiene todos los usuarios con paginación
     * @param pageable Información de paginación
     * @return Page con los usuarios
     */
    Page<UsuarioResponse> obtenerTodosLosUsuarios(Pageable pageable);
    
    /**
     * Obtiene un usuario por su ID
     * @param id ID del usuario
     * @return UsuarioResponse con los datos del usuario
     * @throws RuntimeException si el usuario no existe
     */
    UsuarioResponse obtenerUsuarioPorId(Long id);
    
    // ========== MÉTODOS DE EDICIÓN PARA USUARIOS ==========
    
    /**
     * Permite a un usuario editar su propio perfil (campos limitados)
     * @param userId ID del usuario
     * @param request Datos a actualizar
     * @return UsuarioResponse con los datos actualizados
     * @throws RuntimeException si el usuario no existe o el email ya está en uso
     */
    UsuarioResponse editarPerfil(Long userId, EditarPerfilRequest request);
    
    /**
     * Permite a un usuario cambiar su propia contraseña
     * @param userId ID del usuario
     * @param request Datos del cambio de contraseña
     * @throws RuntimeException si la contraseña actual es incorrecta o las nuevas no coinciden
     */
    void cambiarPassword(Long userId, CambiarPasswordRequest request);
    
    // ========== MÉTODOS DE EDICIÓN PARA ADMINISTRADORES ==========
    
    /**
     * Permite a un administrador editar cualquier usuario (todos los campos)
     * @param userId ID del usuario a editar
     * @param request Datos a actualizar
     * @return UsuarioResponse con los datos actualizados
     * @throws RuntimeException si el usuario no existe o hay conflictos de datos únicos
     */
    UsuarioResponse editarUsuarioComoAdmin(Long userId, EditarUsuarioAdminRequest request);
    
    /**
     * Desactiva un usuario
     * @param userId ID del usuario
     * @throws RuntimeException si el usuario no existe
     */
    void desactivarUsuario(Long userId);
    
    /**
     * Activa un usuario
     * @param userId ID del usuario
     * @throws RuntimeException si el usuario no existe
     */
    void activarUsuario(Long userId);
    
    /**
     * Elimina un usuario del sistema
     * @param userId ID del usuario
     * @throws RuntimeException si el usuario no existe
     */
    void eliminarUsuario(Long userId);
}
