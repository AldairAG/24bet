// ========== INFORMACIÓN PERSONAL TYPES ==========

export type Genero = 'MASCULINO' | 'FEMENINO' | 'OTRO' | 'NO_ESPECIFICADO';
export type EstadoCivil = 'SOLTERO' | 'CASADO' | 'DIVORCIADO' | 'VIUDO' | 'UNION_LIBRE' | 'SEPARADO' | 'NO_ESPECIFICADO';

// ========== INFORMACIÓN PERSONAL REQUEST ==========
export interface InformacionPersonalRequest {
  // Información básica
  primerNombre?: string;
  segundoNombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string; // ISO date string
  genero?: Genero;
  
  // Información de contacto
  telefono?: string;
  telefonoMovil?: string;
  
  // Dirección
  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string;
  colonia?: string;
  codigoPostal?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  
  // Información fiscal
  rfc?: string;
  curp?: string;
  
  // Información adicional
  estadoCivil?: EstadoCivil;
  ocupacion?: string;
  nacionalidad?: string;
}

// ========== INFORMACIÓN PERSONAL RESPONSE ==========
export interface InformacionPersonalResponse {
  id: number;
  
  // Información básica
  primerNombre?: string;
  segundoNombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  fechaNacimiento?: string; // ISO date string
  genero?: Genero;
  
  // Información de contacto
  telefono?: string;
  telefonoMovil?: string;
  
  // Dirección
  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string;
  colonia?: string;
  codigoPostal?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  
  // Información fiscal
  rfc?: string;
  curp?: string;
  
  // Información adicional
  estadoCivil?: EstadoCivil;
  ocupacion?: string;
  nacionalidad?: string;
  
  // Metadatos
  fechaCreacion?: string; // ISO date string
  fechaActualizacion?: string; // ISO date string
  
  // Campos calculados
  nombreCompleto?: string;
  direccionCompleta?: string;
}

// ========== PERSONAL INFO STATE ==========
export interface PersonalInfoState {
  informacionPersonal: InformacionPersonalResponse | null;
  loading: boolean;
  error: string | null;
}

// ========== VALIDATION TYPES ==========
export interface PersonalInfoValidation {
  isValid: boolean;
  error?: string;
}

export interface PersonalInfoValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
