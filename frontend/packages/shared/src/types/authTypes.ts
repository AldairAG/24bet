import { Genero } from './personalInfoTypes';

// ========== AUTHENTICATION TYPES ==========

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  username: string;
  email: string;
  password: string;
  nombre?: string;
  apellido?: string;
  ladaTelefono?: string;
  numeroTelefono?: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

// ========== USER TYPES ==========

export type UserRole = 'USER' | 'ADMIN';

export interface UsuarioResponse {
  id: number;
  username: string;
  email: string;
  nombre?: string;
  apellido?: string;
  ladaTelefono?: string;
  numeroTelefono?: string;
  rol: UserRole;
  activo: boolean;
  informacionPersonal?: InformacionPersonalResponse;
}

// ========== USER MANAGEMENT REQUESTS ==========

export interface CambiarPasswordRequest {
  passwordActual: string;
  passwordNueva: string;
}

export interface EditarPerfilRequest {
  nombre?: string;
  apellido?: string;
  ladaTelefono?: string;
  numeroTelefono?: string;
  informacionPersonal?: InformacionPersonalRequest;
}

export interface EditarUsuarioAdminRequest {
  username?: string;
  email?: string;
  nombre?: string;
  apellido?: string;
  ladaTelefono?: string;
  numeroTelefono?: string;
  rol?: UserRole;
  activo?: boolean;
  informacionPersonal?: InformacionPersonalRequest;
}

// ========== PERSONAL INFORMATION TYPES ==========

export interface InformacionPersonalRequest {
  primerNombre?: string;
  segundoNombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string; // ISO date string
  genero?: Genero;
  telefono?: string;
  telefonoMovil?: string;
  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string;
  colonia?: string;
  codigoPostal?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  rfc?: string;
  curp?: string;
  ingresosMensuales?: number;
  lugarTrabajo?: string;
  puestoTrabajo?: string;
  nombreContactoEmergencia?: string;
  telefonoContactoEmergencia?: string;
  relacionContactoEmergencia?: string;
}

export interface InformacionPersonalResponse extends InformacionPersonalRequest {
  id: number;
  fechaActualizacion?: string; // ISO date string
}

// ========== AUTH STATE ==========

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: UsuarioResponse | null;
  loading: boolean;
  error: string | null;
}

// ========== USER STATE ==========

export interface UserState {
  currentUser: UsuarioResponse | null;
  users: UsuarioResponse[];
  usersPage: {
    content: UsuarioResponse[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  } | null;
  loading: boolean;
  error: string | null;
}
