import { api } from './apiBase';
import {
  LoginRequest,
  RegistroRequest,
  JwtResponse,
  UsuarioResponse,
  ApiResponseWrapper
} from '../types/authTypes';

const BASE_URL = '/auth';

export const authService = {
  registro: async (registroRequest: RegistroRequest): Promise<ApiResponseWrapper<UsuarioResponse>> => {
    const response = await api.post<UsuarioResponse>(`${BASE_URL}/registro`, registroRequest);
    return response;
  },

  login: async (loginRequest: LoginRequest): Promise<ApiResponseWrapper<JwtResponse>> => {
    return await api.post<JwtResponse>(`${BASE_URL}/login`, loginRequest);
  }
};
