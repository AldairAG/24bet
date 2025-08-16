/**
 * Auth Service para 24bet
 * Maneja autenticación, registro y gestión de tokens
 */

import { BaseApiService, API_ENDPOINTS } from './apiService';
import {
  LoginRequest,
  RegistroRequest,
  JwtResponse,
  UsuarioResponse,
} from '../types/authTypes';

import { ApiResponse } from '../types/apiTypes';

export class AuthService extends BaseApiService {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginRequest): Promise<JwtResponse> {
    const response = await this.post<LoginRequest, ApiResponse<JwtResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      false // No requiere auth
    );

    if (response.success && response.data) {
      // Guardar token automáticamente
      this.setToken(response.data.token);
      return response.data;
    } else {
      throw new Error(response.message || 'Error en el login');
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async register(userData: RegistroRequest): Promise<UsuarioResponse> {
    const response = await this.post<RegistroRequest, ApiResponse<UsuarioResponse>>(
      API_ENDPOINTS.AUTH.REGISTRO,
      userData,
      false // No requiere auth
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Error en el registro');
    }
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.clearToken();
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('24bet_token');
    if (!token) return false;

    try {
      // Verificar si el token no ha expirado
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  /**
   * Obtener información del usuario desde el token
   */
  getUserFromToken(): { id: number; username: string; email: string; role: string } | null {
    const token = localStorage.getItem('24bet_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId || payload.sub,
        username: payload.username,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  }
}

// Instancia singleton
export const authService = new AuthService();
