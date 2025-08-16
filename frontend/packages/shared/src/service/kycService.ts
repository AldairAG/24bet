/**
 * KYC Service para 24bet
 * Maneja documentos KYC (Know Your Customer)
 */

import { BaseApiService, API_ENDPOINTS } from './apiService';
import {
  SubirDocumentoRequest,
  DocumentoKycResponse,
  EstadoKycResponse,
  RevisionDocumentoRequest,
  TipoDocumento,
  EstadoDocumento,
} from '../types/kycTypes';

import { ApiResponse,Page,PageRequest } from '../types/apiTypes';

export class KycService extends BaseApiService {

  // ========== OPERACIONES DE USUARIO ==========

  /**
   * Obtener mi estado de KYC
   */
  async getMyKycStatus(): Promise<EstadoKycResponse> {
    const response = await this.get<EstadoKycResponse>(
      API_ENDPOINTS.KYC.MI_ESTADO
    );
    return response;
  }

  /**
   * Obtener mis documentos KYC
   */
  async getMyDocuments(): Promise<DocumentoKycResponse[]> {
    const response = await this.get<DocumentoKycResponse[]>(
      API_ENDPOINTS.KYC.MIS_DOCUMENTOS
    );
    return response;
  }

  /**
   * Subir documento KYC
   */
  async uploadDocument(
    documentData: SubirDocumentoRequest,
    onProgress?: (progress: number) => void
  ): Promise<DocumentoKycResponse> {
    // Crear FormData
    const formData = new FormData();
    formData.append('tipoDocumento', documentData.tipoDocumento);
    formData.append('archivo', documentData.archivo);
    if (documentData.observaciones) {
      formData.append('observaciones', documentData.observaciones);
    }

    // Subir usando el método especial para archivos
    const response = await this.uploadFile<DocumentoKycResponse>(
      API_ENDPOINTS.KYC.DOCUMENTOS,
      formData,
      true, // Requiere auth
      onProgress
    );

    return response;
  }

  /**
   * Obtener documento por ID
   */
  async getDocumentById(documentId: number): Promise<DocumentoKycResponse> {
    const response = await this.get<DocumentoKycResponse>(
      API_ENDPOINTS.KYC.DOCUMENTO_BY_ID(documentId)
    );
    return response;
  }

  /**
   * Descargar documento
   */
  async downloadDocument(documentId: number): Promise<Blob> {
    const response = await fetch(
      `${API_ENDPOINTS.KYC.DESCARGAR(documentId)}`,
      {
        headers: this.getKycAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al descargar documento: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Eliminar documento
   */
  async deleteDocument(documentId: number): Promise<void> {
    await this.delete<void>(API_ENDPOINTS.KYC.DOCUMENTO_BY_ID(documentId));
  }

  // ========== OPERACIONES DE ADMINISTRADOR ==========

  /**
   * Obtener documentos pendientes de revisión (admin)
   */
  async getPendingDocuments(pageRequest?: PageRequest): Promise<Page<DocumentoKycResponse>> {
    let endpoint = `${API_ENDPOINTS.KYC.ADMIN_DOCUMENTOS}?estado=PENDIENTE`;

    if (pageRequest) {
      if (pageRequest.page !== undefined) endpoint += `&page=${pageRequest.page}`;
      if (pageRequest.size !== undefined) endpoint += `&size=${pageRequest.size}`;
      if (pageRequest.sort) endpoint += `&sort=${pageRequest.sort}`;
    }

    const response = await this.get<ApiResponse<Page<DocumentoKycResponse>>>(endpoint);

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Error al obtener documentos pendientes');
    }
  }

  /**
   * Revisar documento (admin)
   */
  async reviewDocument(
    documentId: number,
    revisionData: RevisionDocumentoRequest
  ): Promise<DocumentoKycResponse> {
    const response = await this.put<RevisionDocumentoRequest, ApiResponse<DocumentoKycResponse>>(
      API_ENDPOINTS.KYC.REVISION(documentId),
      revisionData
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || 'Error al revisar documento');
    }
  }

  /**
   * Obtener todos los documentos de un usuario (admin)
   */
  async getUserDocuments(userId: number): Promise<DocumentoKycResponse[]> {
    const response = await this.get<DocumentoKycResponse[]>(
      `${API_ENDPOINTS.KYC.ADMIN_DOCUMENTOS}?usuarioId=${userId}`
    );
    return response;
  }

  /**
   * Obtener estado KYC de un usuario (admin)
   */
  async getUserKycStatus(userId: number): Promise<EstadoKycResponse> {
    const response = await this.get<EstadoKycResponse>(
      `${API_ENDPOINTS.KYC.BASE}/estado/${userId}`
    );
    return response;
  }

  // ========== UTILIDADES ==========

  /**
   * Validar archivo antes de subir
   */
  static validateFile(file: File, tipoDocumento: TipoDocumento): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('El archivo no puede exceder 5MB');
    }

    // Validar tipo MIME
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      errors.push('Solo se permiten archivos JPG, PNG o PDF');
    }

    // Validaciones específicas por tipo de documento
    if (tipoDocumento === 'INE') {
      // Para INE preferir imágenes
      const preferredTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!preferredTypes.includes(file.type)) {
        errors.push('Para INE se recomiendan imágenes JPG o PNG');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Obtener descripción del tipo de documento
   */
  static getDocumentTypeDescription(tipo: TipoDocumento): string {
    const descriptions = {
      INE: 'Credencial de Elector (INE)',
      COMPROBANTE_DOMICILIO: 'Comprobante de Domicilio'
    };
    return descriptions[tipo] || tipo;
  }

  /**
   * Obtener descripción del estado
   */
  static getEstadoDescription(estado: EstadoDocumento): string {
    const descriptions = {
      PENDIENTE: 'Pendiente de revisión',
      APROBADO: 'Aprobado',
      RECHAZADO: 'Rechazado'
    };
    return descriptions[estado] || estado;
  }

  /**
   * Obtener color para el estado
   */
  static getEstadoColor(estado: EstadoDocumento): string {
    const colors = {
      PENDIENTE: '#FFA500', // Naranja
      APROBADO: '#28A745',  // Verde
      RECHAZADO: '#DC3545'  // Rojo
    };
    return colors[estado] || '#6C757D'; // Gris por defecto
  }

  /**
   * Calcular porcentaje de completado KYC
   */
  static calculateKycProgress(estadoKyc: EstadoKycResponse): number {
    const { documentosRequeridos, documentosAprobados } = estadoKyc;

    if (documentosRequeridos.length === 0) return 0;

    return Math.round((documentosAprobados.length / documentosRequeridos.length) * 100);
  }

  /**
   * Verificar si puede operar (KYC completo)
   */
  static canOperate(estadoKyc: EstadoKycResponse): boolean {
    return estadoKyc.puedeOperar && estadoKyc.estadoGeneral === 'COMPLETADO';
  }

  /**
   * Obtener siguiente documento requerido
   */
  static getNextRequiredDocument(estadoKyc: EstadoKycResponse): TipoDocumento | null {
    const { documentosPendientes } = estadoKyc;
    return documentosPendientes.length > 0 ? documentosPendientes[0] : null;
  }

  // Helper privado para headers con auth
  private getKycAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('24bet_token');
    return {
      'Authorization': `Bearer ${token}`,
    };
  }
}

// Instancia singleton
export const kycService = new KycService();
