import { api } from './apiBase';
import { ApiResponseWrapper, UsuarioResponse } from '../types/authTypes';

// Tipos específicos para el servicio de usuario
export interface CambiarPasswordRequest {
  passwordAnterior: string;
  passwordNuevo: string;
}

export interface EditarPerfilRequest {
  nombre: string;
  apellido: string;
  ladaTelefono: string;
  numeroTelefono: string;
}

export interface EditarUsuarioAdminRequest {
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  ladaTelefono: string;
  numeroTelefono: string;
  fechaNacimiento: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const usuarioService = {
  // Obtener perfil del usuario actual
  obtenerPerfilActual: async (): Promise<ApiResponseWrapper<UsuarioResponse>> => {
    return await api.get<UsuarioResponse>('/24bet/usuarios/me');
  },

  // Editar perfil del usuario actual
  editarPerfil: async (datos: EditarPerfilRequest): Promise<ApiResponseWrapper<UsuarioResponse>> => {
    return await api.put<UsuarioResponse>('/24bet/usuarios/me', datos);
  },

  // Cambiar contraseña
  cambiarPassword: async (datos: CambiarPasswordRequest): Promise<ApiResponseWrapper<UsuarioResponse>> => {
    return await api.put<UsuarioResponse>('/24bet/usuarios/cambiar-password', datos);
  },

  // Eliminar cuenta del usuario actual
  eliminarCuentaActual: async (): Promise<ApiResponseWrapper<void>> => {
    return await api.delete<void>('/24bet/usuarios/me');
  },

  // Métodos para administradores
  admin: {
    // Listar todos los usuarios (paginado)
    listarUsuarios: async (page = 0, size = 10): Promise<ApiResponseWrapper<PageResponse<UsuarioResponse>>> => {
      return await api.get<PageResponse<UsuarioResponse>>(`/24bet/usuarios?page=${page}&size=${size}`);
    },

    // Obtener usuario por ID
    obtenerUsuarioPorId: async (id: number): Promise<ApiResponseWrapper<UsuarioResponse>> => {
      return await api.get<UsuarioResponse>(`/24bet/usuarios/${id}`);
    },

    // Editar usuario por ID
    editarUsuario: async (id: number, datos: EditarUsuarioAdminRequest): Promise<ApiResponseWrapper<UsuarioResponse>> => {
      return await api.put<UsuarioResponse>(`/24bet/usuarios/${id}`, datos);
    },

    // Eliminar usuario por ID
    eliminarUsuario: async (id: number): Promise<ApiResponseWrapper<void>> => {
      return await api.delete<void>(`/24bet/usuarios/${id}`);
    },

    // Buscar usuarios por username
    buscarPorUsername: async (username: string): Promise<ApiResponseWrapper<UsuarioResponse[]>> => {
      return await api.get<UsuarioResponse[]>(`/24bet/usuarios/buscar?username=${encodeURIComponent(username)}`);
    },
  },
};
