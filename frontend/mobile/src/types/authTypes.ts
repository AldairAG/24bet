export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegistroRequest {
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  ladaTelefono: string;
  numeroTelefono: string;
  fechaNacimiento: string; // ISO date string, e.g., 'YYYY-MM-DD'

  // Agrega otros campos requeridos por el backend
}

export interface JwtResponse {
  token: string;
  type: string;
  // Agrega otros campos si el backend los retorna
}

export interface UsuarioResponse {
  id: number;
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  ladaTelefono: string;
  numeroTelefono: string;
  fechaNacimiento: string;
  
  // Agrega otros campos según la respuesta del backend
}

export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
}
