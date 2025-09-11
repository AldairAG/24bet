import { api } from './apiBase';
import type {
  LoginRequest,
  RegistroRequest,
  JwtResponse,
  UsuarioResponse,
  ApiResponseWrapper
} from '../types/authTypes';

const BASE_URL = '/auth';

export const authService = {
  registro: async (registroRequest: RegistroRequest): Promise<ApiResponseWrapper<UsuarioResponse>> => {
    console.log('🚀 AuthService.registro llamado con:', registroRequest);
    try {
      const response = await api.post<UsuarioResponse>(`${BASE_URL}/registro`, registroRequest);
      console.log('✅ AuthService.registro respuesta:', response);
      return response;
    } catch (error) {
      console.error('❌ AuthService.registro error:', error);
      throw error;
    }
  },

  login: async (loginRequest: LoginRequest): Promise<ApiResponseWrapper<JwtResponse>> => {
    return await api.post<JwtResponse>(`${BASE_URL}/login`, loginRequest);
  }
};
