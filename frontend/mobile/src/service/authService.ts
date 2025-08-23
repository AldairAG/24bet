import axios from 'axios';
import {
  LoginRequest,
  RegistroRequest,
  JwtResponse,
  UsuarioResponse,
  ApiResponseWrapper
} from '../types/authTypes';

const API_URL = 'http://localhost:8080/24bet/auth'; // Cambia la URL si es necesario

export const authService = {
  registro: async (registroRequest: RegistroRequest): Promise<ApiResponseWrapper<UsuarioResponse>> => {
    const response = await axios.post<ApiResponseWrapper<UsuarioResponse>>(
      `${API_URL}/registro`,
      registroRequest
    );
    return response.data;
  },

  login: async (loginRequest: LoginRequest): Promise<ApiResponseWrapper<JwtResponse>> => {
    const response = await axios.post<ApiResponseWrapper<JwtResponse>>(
      `${API_URL}/login`,
      loginRequest
    );
    return response.data;
  }
};
