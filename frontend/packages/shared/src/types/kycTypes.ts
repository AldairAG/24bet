// ========== KYC DOCUMENT TYPES ==========

export type TipoDocumento = 'INE' | 'COMPROBANTE_DOMICILIO';
export type EstadoDocumento = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export interface SubirDocumentoRequest {
  tipoDocumento: TipoDocumento;
  archivo: File;
  observaciones?: string;
}

export interface DocumentoKycResponse {
  id: number;
  usuarioId: number;
  tipoDocumento: TipoDocumento;
  nombreArchivo: string;
  tipoMime: string;
  tamañoArchivo: number;
  estado: EstadoDocumento;
  motivoRechazo?: string;
  observaciones?: string;
  fechaSubida: string; // ISO date string
  fechaRevision?: string; // ISO date string
  version: number;
  activo: boolean;
}

export interface RevisionDocumentoRequest {
  estado: EstadoDocumento;
  motivoRechazo?: string;
  observaciones?: string;
}

export interface EstadoKycResponse {
  usuarioId: number;
  estadoGeneral: EstadoKyc;
  documentos: DocumentoKycResponse[];
  documentosRequeridos: TipoDocumento[];
  documentosPendientes: TipoDocumento[];
  documentosAprobados: TipoDocumento[];
  documentosRechazados: TipoDocumento[];
  porcentajeCompletado: number;
  puedeOperar: boolean;
  fechaUltimaActualizacion?: string; // ISO date string
}

export type EstadoKyc = 'NO_INICIADO' | 'EN_PROCESO' | 'COMPLETADO' | 'RECHAZADO';

// ========== KYC STATE ==========

export interface KycState {
  estadoKyc: EstadoKycResponse | null;
  misDocumentos: DocumentoKycResponse[];
  documentosPendientesRevision: DocumentoKycResponse[];
  loading: boolean;
  uploadingDocument: boolean;
  error: string | null;
  uploadProgress: number;
}

// ========== PERSONAL INFO STATE ==========

export interface PersonalInfoState {
  informacionPersonal: import('./authTypes').InformacionPersonalResponse | null;
  loading: boolean;
  error: string | null;
}
