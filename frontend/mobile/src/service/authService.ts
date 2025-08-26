import { api } from './apiBase';
import {
  LoginRequest,
  RegistroRequest,
  JwtResponse,
  UsuarioResponse,
  ApiResponseWrapper
} from '../types/authTypes';

export const authService = {
  registro: async (registroRequest: RegistroRequest): Promise<ApiResponseWrapper<UsuarioResponse>> => {
    return await api.post<UsuarioResponse>('/24bet/auth/registro', registroRequest);
  },

  login: async (loginRequest: LoginRequest): Promise<ApiResponseWrapper<JwtResponse>> => {
    return await api.post<JwtResponse>('/24bet/auth/login', loginRequest);
  }
};
