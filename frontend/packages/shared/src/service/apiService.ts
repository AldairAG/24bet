/**
 * Base API Service para 24bet
 * Maneja configuración común, interceptors y error handling
 */
import { getConfig } from "./../config";

// ========== CONFIGURACIÓN BASE ==========

export const API_BASE_URL = getConfig().API_URL || 'http://localhost:8080/24bet';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTRO: '/auth/registro',
  },
  // Usuarios
  USUARIOS: {
    BASE: '/usuarios',
    BY_ID: (id: number) => `/usuarios/${id}`,
    ADMIN_EDIT: (id: number) => `/usuarios/${id}/admin`,
    PERFIL: '/usuarios/perfil',
    CAMBIAR_PASSWORD: '/usuarios/cambiar-password',
  },
  // Información Personal
  INFO_PERSONAL: {
    BASE: '/informacion-personal',
    BY_USER: (userId: number) => `/informacion-personal/${userId}`,
    MI_INFO: '/informacion-personal/mi-informacion',
  },
  // KYC
  KYC: {
    BASE: '/kyc',
    DOCUMENTOS: '/kyc/documentos',
    MI_ESTADO: '/kyc/mi-estado',
    MIS_DOCUMENTOS: '/kyc/mis-documentos',
    DOCUMENTO_BY_ID: (id: number) => `/kyc/documentos/${id}`,
    DESCARGAR: (id: number) => `/kyc/documentos/${id}/descargar`,
    REVISION: (id: number) => `/kyc/documentos/${id}/revision`,
    ADMIN_DOCUMENTOS: '/kyc/admin/documentos',
  },
} as const;

// ========== TIPOS DE ERROR ==========

export interface ApiError {
  success: false;
  message: string;
  status?: number;
  code?: string;
}

export class Api24BetError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly success = false;

  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'Api24BetError';
  }
}

// ========== SERVICIO BASE ==========

export class BaseApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Obtiene headers con token de autenticación
   */
  private getAuthHeaders(): Record<string, string> {
    const token = this.getStoredToken();
    return {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Obtiene token del localStorage
   */
  private getStoredToken(): string | null {
    try {
      return localStorage.getItem('24bet_token');
    } catch {
      return null;
    }
  }

  /**
   * Guarda token en localStorage
   */
  public setToken(token: string): void {
    try {
      localStorage.setItem('24bet_token', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  /**
   * Elimina token del localStorage
   */
  public clearToken(): void {
    try {
      localStorage.removeItem('24bet_token');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  /**
   * Maneja errores de API
   */
  private async handleApiError(response: Response): Promise<never> {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    let errorCode: string | undefined;

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
      if (errorData.code) {
        errorCode = errorData.code;
      }
    } catch {
      // Si no se puede parsear JSON, usar mensaje por defecto
    }

    throw new Api24BetError(errorMessage, response.status, errorCode);
  }

  /**
   * Realiza petición HTTP GET
   */
  protected async get<T>(endpoint: string, requireAuth: boolean = true): Promise<T> {
    const headers = requireAuth ? this.getAuthHeaders() : this.defaultHeaders;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    return response.json();
  }

  /**
   * Realiza petición HTTP POST
   */
  protected async post<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    requireAuth: boolean = true
  ): Promise<TResponse> {
    const headers = requireAuth ? this.getAuthHeaders() : this.defaultHeaders;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    return response.json();
  }

  /**
   * Realiza petición HTTP PUT
   */
  protected async put<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    requireAuth: boolean = true
  ): Promise<TResponse> {
    const headers = requireAuth ? this.getAuthHeaders() : this.defaultHeaders;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    return response.json();
  }

  /**
   * Realiza petición HTTP DELETE
   */
  protected async delete<T>(endpoint: string, requireAuth: boolean = true): Promise<T> {
    const headers = requireAuth ? this.getAuthHeaders() : this.defaultHeaders;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      await this.handleApiError(response);
    }

    return response.json();
  }

  /**
   * Realiza upload de archivos con FormData
   */
  protected async uploadFile<TResponse>(
    endpoint: string,
    formData: FormData,
    requireAuth: boolean = true,
    onProgress?: (progress: number) => void
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const token = requireAuth ? this.getStoredToken() : null;

      // Setup headers (no Content-Type para FormData)
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      // Progress tracking
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
          }
        });
      }

      // Response handling
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Api24BetError('Error parsing response', xhr.status));
          }
        } else {
          let errorMessage = `Error ${xhr.status}: ${xhr.statusText}`;
          try {
            const errorData = JSON.parse(xhr.responseText);
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // Usar mensaje por defecto
          }
          reject(new Api24BetError(errorMessage, xhr.status));
        }
      });

      // Error handling
      xhr.addEventListener('error', () => {
        reject(new Api24BetError('Network error occurred'));
      });

      // Send request
      xhr.open('POST', `${this.baseUrl}${endpoint}`);
      xhr.send(formData);
    });
  }
}

// ========== INSTANCIA SINGLETON ==========

export const apiService = new BaseApiService();
