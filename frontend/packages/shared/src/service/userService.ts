/**
 * User Service para 24bet
 * Maneja operaciones CRUD de usuarios
 */

import { BaseApiService, API_ENDPOINTS } from './apiService';
import {
  UsuarioResponse,
  EditarPerfilRequest,
  EditarUsuarioAdminRequest,
  CambiarPasswordRequest,
} from '../types/authTypes';
import {
  ApiResponse,
  Page,
  PageRequest,
} from '../types/apiTypes';

export class UserService extends BaseApiService {

  // ========== OPERACIONES PARA USUARIOS ==========

  /**
   * Obtener perfil del usuario autenticado
   */
  async getMyProfile(): Promise<UsuarioResponse> {
    const response = await this.get<ApiResponse<UsuarioResponse>>(
      API_ENDPOINTS.USUARIOS.PERFIL
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Error al obtener el perfil');
    }
  }

  /**
   * Editar perfil del usuario autenticado
   */
  async updateMyProfile(profileData: EditarPerfilRequest): Promise<UsuarioResponse> {
    const response = await this.put<EditarPerfilRequest, ApiResponse<UsuarioResponse>>(
      API_ENDPOINTS.USUARIOS.PERFIL,
      profileData
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Error al actualizar el perfil');
    }
  }

  /**
   * Cambiar contraseña del usuario autenticado
   */
  async changePassword(passwordData: CambiarPasswordRequest): Promise<void> {
    const response = await this.put<CambiarPasswordRequest, ApiResponse<void>>(
      API_ENDPOINTS.USUARIOS.CAMBIAR_PASSWORD,
      passwordData
    );

    if (!response.success) {
      throw new Error(response.message || 'Error al cambiar la contraseña');
    }
  }

  // ========== OPERACIONES PARA ADMIN ==========

  /**
   * Listar todos los usuarios (solo admin)
   */
  async getAllUsers(pageRequest?: PageRequest): Promise<Page<UsuarioResponse>> {
    let endpoint = API_ENDPOINTS.USUARIOS.BASE;

    if (pageRequest) {
      const params = new URLSearchParams();
      if (pageRequest.page !== undefined) params.append('page', pageRequest.page.toString());
      if (pageRequest.size !== undefined) params.append('size', pageRequest.size.toString());
      if (pageRequest.sort) params.append('sort', pageRequest.sort);
      endpoint += `?${params.toString()}`;
    }

    const response = await this.get<ApiResponse<Page<UsuarioResponse>>>(endpoint);

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Error al obtener usuarios');
    }
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(id: number): Promise<UsuarioResponse> {
    const response = await this.get<ApiResponse<UsuarioResponse>>(
      API_ENDPOINTS.USUARIOS.BY_ID(id)
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Error al obtener el usuario');
    }
  }

  /**
   * Editar usuario como administrador
   */
  async updateUserAsAdmin(id: number, userData: EditarUsuarioAdminRequest): Promise<UsuarioResponse> {
    const response = await this.put<EditarUsuarioAdminRequest, ApiResponse<UsuarioResponse>>(
      API_ENDPOINTS.USUARIOS.ADMIN_EDIT(id),
      userData
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Error al actualizar el usuario');
    }
  }

  /**
   * Eliminar usuario (solo admin)
   */
  async deleteUser(id: number): Promise<void> {
    const response = await this.delete<ApiResponse<void>>(
      API_ENDPOINTS.USUARIOS.BY_ID(id)
    );

    if (!response.success) {
      throw new Error(response.message || 'Error al eliminar el usuario');
    }
  }

  // ========== UTILIDADES ==========

  /**
   * Buscar usuarios por criterio
   */
  async searchUsers(
    query: string,
    pageRequest?: PageRequest
  ): Promise<Page<UsuarioResponse>> {
    let endpoint = `${API_ENDPOINTS.USUARIOS.BASE}/search?q=${encodeURIComponent(query)}`;

    if (pageRequest) {
      if (pageRequest.page !== undefined) endpoint += `&page=${pageRequest.page}`;
      if (pageRequest.size !== undefined) endpoint += `&size=${pageRequest.size}`;
      if (pageRequest.sort) endpoint += `&sort=${pageRequest.sort}`;
    }

    const response = await this.get<ApiResponse<Page<UsuarioResponse>>>(endpoint);

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Error en la búsqueda');
    }
  }

  /**
   * Obtener estadísticas de usuarios (solo admin)
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    kycCompletedUsers: number;
  }> {
    const response = await this.get<ApiResponse<any>>(`${API_ENDPOINTS.USUARIOS.BASE}/stats`);

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Error al obtener estadísticas');
    }
  }
}

// Instancia singleton
export const userService = new UserService();
