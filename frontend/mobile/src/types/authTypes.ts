import { DocumentoKyc, InformacionPersonal } from "./kycTypes";

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
  user: Usuario;
}

export interface Usuario {
  id: number;

  username: string;

  email: string;

  nombre: string;

  apellido: string;

  ladaTelefono: string;

  numeroTelefono: string;

  fechaNacimiento: Date;

  activo: boolean;

  fechaCreacion: string;

  fechaActualizacion: string;

  rol: string;

  saldoUsd: number;

  informacionPersonal: InformacionPersonal;

  documentosKyc: DocumentoKyc[];
}


export interface UsuarioResponse {
  id: number;
  username: string;
  email: string;
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
