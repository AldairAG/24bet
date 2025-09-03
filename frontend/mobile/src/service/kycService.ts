import { api } from './apiBase';
import { ApiResponseWrapper } from '../types/authTypes';

// Tipos específicos para el servicio de KYC
export interface SubirDocumentoRequest {
  tipoDocumento: TipoDocumento;
  ladoDocumento: LadoDocumento;
  archivo: File; // Para web
}

export interface DocumentoKycResponse {
  id: number;
  tipoDocumento: TipoDocumento;
  ladoDocumento: LadoDocumento;
  nombreArchivo: string;
  estado: EstadoDocumento;
  fechaSubida: string;
  fechaRevision?: string;
  comentarios?: string;
}

export interface EstadoKycResponse {
  estadoGeneral: EstadoKyc;
  documentos: DocumentoKycResponse[];
  porcentajeCompletado: number;
  documentosFaltantes: TipoDocumento[];
}

export interface RevisionDocumentoRequest {
  estado: EstadoDocumento;
  comentarios?: string;
}

export enum TipoDocumento {
  CEDULA = 'CEDULA',
  PASAPORTE = 'PASAPORTE',
  LICENCIA = 'LICENCIA',
  COMPROBANTE_INGRESOS = 'COMPROBANTE_INGRESOS',
  COMPROBANTE_DOMICILIO = 'COMPROBANTE_DOMICILIO',
}

export enum LadoDocumento {
  FRONTAL = 'FRONTAL',
  TRASERO = 'TRASERO',
  UNICO = 'UNICO',
}

export enum EstadoDocumento {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  EN_REVISION = 'EN_REVISION',
}

export enum EstadoKyc {
  INCOMPLETO = 'INCOMPLETO',
  EN_REVISION = 'EN_REVISION',
  COMPLETADO = 'COMPLETADO',
  RECHAZADO = 'RECHAZADO',
}

export const kycService = {
  // Subir documento KYC
  subirDocumento: async (
    tipoDocumento: TipoDocumento,
    ladoDocumento: LadoDocumento,
    archivo: File,
    onProgress?: (progress: number) => void
  ): Promise<DocumentoKycResponse> => {
    const formData = new FormData();
    formData.append('tipoDocumento', tipoDocumento);
    formData.append('ladoDocumento', ladoDocumento);
    formData.append('archivo', archivo);

    const response = await api.uploadFile<DocumentoKycResponse>(
      '/24bet/kyc/documentos',
      formData,
      onProgress ? (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      } : undefined
    );

    return response.data;
  },

  // Obtener estado KYC del usuario actual
  obtenerMiEstado: async (): Promise<ApiResponseWrapper<EstadoKycResponse>> => {
    return await api.get<EstadoKycResponse>('/24bet/kyc/mi-estado');
  },

  // Obtener mis documentos KYC
  obtenerMisDocumentos: async (): Promise<ApiResponseWrapper<DocumentoKycResponse[]>> => {
    return await api.get<DocumentoKycResponse[]>('/24bet/kyc/mis-documentos');
  },

  // Descargar documento KYC
  descargarDocumento: async (documentoId: number, filename?: string): Promise<void> => {
    await api.downloadFile(`/24bet/kyc/documentos/${documentoId}/descargar`, filename);
  },

  // Eliminar documento KYC
  eliminarDocumento: async (documentoId: number): Promise<ApiResponseWrapper<void>> => {
    return await api.delete<void>(`/24bet/kyc/documentos/${documentoId}`);
  },

  // Métodos para administradores
  admin: {
    // Obtener todos los documentos para revisión (paginado)
    obtenerDocumentosParaRevision: async (
      page = 0,
      size = 10,
      estado?: EstadoDocumento
    ): Promise<ApiResponseWrapper<any>> => {
      let url = `/24bet/kyc/admin/documentos?page=${page}&size=${size}`;
      if (estado) {
        url += `&estado=${estado}`;
      }
      return await api.get<any>(url);
    },

    // Revisar documento KYC
    revisarDocumento: async (
      documentoId: number,
      revision: RevisionDocumentoRequest
    ): Promise<ApiResponseWrapper<DocumentoKycResponse>> => {
      return await api.put<DocumentoKycResponse>(`/24bet/kyc/admin/documentos/${documentoId}/revisar`, revision);
    },

    // Obtener documento por ID
    obtenerDocumentoPorId: async (documentoId: number): Promise<ApiResponseWrapper<DocumentoKycResponse>> => {
      return await api.get<DocumentoKycResponse>(`/24bet/kyc/admin/documentos/${documentoId}`);
    },

    // Obtener estadísticas de KYC
    obtenerEstadisticas: async (): Promise<ApiResponseWrapper<any>> => {
      return await api.get<any>('/24bet/kyc/admin/estadisticas');
    },
  },
};
