import { api } from './apiBase';
import type { ApiResponseWrapper, Usuario, UsuarioResponse } from '../types/authTypes';
import type { EditUserProfile, EditarUsuarioAdminRequest, PageResponse } from '../types/userTypes';

// Tipos específicos para el servicio de usuario
export interface CambiarPasswordRequest {
  passwordAnterior: string;
  passwordNuevo: string;
}

export const usuarioService = {
  // Obtener perfil del usuario actual
  obtenerPerfilActual: async (): Promise<ApiResponseWrapper<UsuarioResponse>> => {
    // En backend existe /24bet/usuarios/mi-perfil
    return await api.get<UsuarioResponse>('/usuarios/mi-perfil');
  },

  // Editar perfil del usuario actual
  editarPerfil: async (datos: EditUserProfile, id: number): Promise<ApiResponseWrapper<Usuario>> => {
    return await api.put<Usuario>(`/usuarios/${id}/perfil`, datos);
  },

  // Cambiar contraseña
  // Nota: El backend expone PATCH /usuarios/{id}/cambiar-password
  // Manteneremos PUT solo si el backend lo acepta; ideal sería usar PATCH con el id del usuario autenticado
  cambiarPassword: async (datos: CambiarPasswordRequest): Promise<ApiResponseWrapper<UsuarioResponse>> => {
    // Requiere el id; si se necesita, ajustar firma para recibir id
    return await api.put<UsuarioResponse>('/usuarios/cambiar-password', datos);
  },

  // Eliminar cuenta del usuario actual
  eliminarCuentaActual: async (): Promise<ApiResponseWrapper<void>> => {
    return await api.delete<void>('/24bet/usuarios/me');
  },

  // Métodos para administradores
  admin: {
    // Listar todos los usuarios (paginado)
    listarUsuarios: async (page = 0, size = 10): Promise<ApiResponseWrapper<PageResponse<UsuarioResponse>>> => {
      return await api.get<PageResponse<UsuarioResponse>>(`/usuarios?page=${page}&size=${size}`);
    },

    // Obtener usuario por ID
    obtenerUsuarioPorId: async (id: number): Promise<ApiResponseWrapper<UsuarioResponse>> => {
      return await api.get<UsuarioResponse>(`/usuarios/${id}`);
    },

    // Editar usuario por ID
    editarUsuario: async (id: number, datos: EditarUsuarioAdminRequest): Promise<ApiResponseWrapper<UsuarioResponse>> => {
      return await api.put<UsuarioResponse>(`/usuarios/${id}`, datos);
    },

    // Editar usuario como ADMIN (endpoint oficial)
    editarUsuarioComoAdmin: async (id: number, datos: EditarUsuarioAdminRequest): Promise<ApiResponseWrapper<UsuarioResponse>> => {
      return await api.put<UsuarioResponse>(`/usuarios/${id}/admin`, datos);
    },

    // Eliminar usuario por ID
    eliminarUsuario: async (id: number): Promise<ApiResponseWrapper<void>> => {
      return await api.delete<void>(`/usuarios/${id}`);
    },

    // Buscar usuarios por username
    buscarPorUsername: async (username: string): Promise<ApiResponseWrapper<UsuarioResponse[]>> => {
      return await api.get<UsuarioResponse[]>(`/usuarios/buscar?username=${encodeURIComponent(username)}`);
    },

    // Desactivar usuario por ID (ADMIN)
    desactivarUsuario: async (id: number): Promise<ApiResponseWrapper<void>> => {
      return await api.patch<void>(`/usuarios/${id}/desactivar`, {});
    },

    // Activar usuario por ID (ADMIN)
    activarUsuario: async (id: number): Promise<ApiResponseWrapper<void>> => {
      return await api.patch<void>(`/usuarios/${id}/activar`, {});
    },
  },
};
