import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Storage wrapper para funcionar tanto en React Native como en Web
class StorageWrapper {
  private storage: any;

  constructor() {
    try {
      // Intentar usar AsyncStorage para React Native
      this.storage = require('@react-native-async-storage/async-storage').default;
    } catch {
      // Fallback para Web usando localStorage
      this.storage = {
        getItem: async (key: string) => {
          if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
          }
          return null;
        },
        setItem: async (key: string, value: string) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(key, value);
          }
        },
        removeItem: async (key: string) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
          }
        },
      };
    }
  }

  async getItem(key: string): Promise<string | null> {
    return await this.storage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    return await this.storage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    return await this.storage.removeItem(key);
  }
}

const storage = new StorageWrapper();

// Tipos para las respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Configuración base de la API
<<<<<<< HEAD
const API_BASE_URL = 'https://24bet.mx/24bet';
=======
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8080/24bet' 
  : 'https://24bet.mx/24bet';
>>>>>>> 31cd7f173321962502319ee8fab484a598a559ce

class ApiBase {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Crear instancia de Axios
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000, // 10 segundos
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Configurar interceptores
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Interceptor de request - agregar token de autenticación
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await storage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error al obtener el token:', error);
        }
        
        // Log de requests en desarrollo
        if (__DEV__) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de response - manejo global de respuestas y errores
    /* this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log de responses exitosas en desarrollo
        if (__DEV__) {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }
        return response;
      },
      async (error) => {
        // Log de errores en desarrollo
        if (__DEV__) {
          console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            data: error.response?.data,
          });
        }

        // Manejo específico de errores
        //if (error.response) {
          //const { status } = error.response;

          //switch (status) {
            //case 401:
              // Token expirado o no válido
              //await this.handleUnauthorized();
              //break;
            //case 403:
              //console.error('Acceso prohibido');
              //break;
            //case 404:
              //console.error('Recurso no encontrado');
              //break;
            //case 500:
              //console.error('Error interno del servidor');
              //break;
            //default:
              //console.error(`Error HTTP ${status}`);
          //}
        //} else if (error.request) {
          //console.error('Error de red - no hay respuesta del servidor');
        //} else {
          //console.error('Error al configurar la request:', error.message);
        //}

        return Promise.reject(error);
      }
    ); */
  }

  private async handleUnauthorized() {
    try {
      // Limpiar token del storage
      await storage.removeItem('token');
      await storage.removeItem('user');
      
      // Aquí podrías dispatch una acción de logout al store
      // o navegar a la pantalla de login
      console.log('Usuario no autorizado - limpiando sesión');
    } catch (error) {
      console.error('Error al limpiar la sesión:', error);
    }
  }

  // Métodos públicos para realizar requests

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método para upload de archivos
  async uploadFile<T>(
    url: string, 
    file: FormData, 
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(url, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método para descargar archivos
  async downloadFile(url: string, filename?: string): Promise<Blob> {
    try {
      const response = await this.axiosInstance.get(url, {
        responseType: 'blob',
      });
      
      // En web, podemos crear un enlace de descarga
      if (typeof window !== 'undefined') {
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename || 'download';
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Métodos de utilidad

  // Actualizar token manualmente
  async setAuthToken(token: string): Promise<void> {
    try {
      await storage.setItem('token', token);
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Error al establecer el token:', error);
    }
  }

  // Limpiar token
  async clearAuthToken(): Promise<void> {
    try {
      await storage.removeItem('token');
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error al limpiar el token:', error);
    }
  }

  // Obtener la instancia de Axios para casos especiales
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  // Manejo de errores centralizado
  private handleError(error: any): Error {
    let errorMessage = 'Error desconocido';
    
    if (error.response?.data) {
      // Error desde el servidor
      const serverError = error.response.data;
      if (serverError.message) {
        errorMessage = serverError.message;
      } else if (typeof serverError === 'string') {
        errorMessage = serverError;
      }
    } else if (error.message) {
      // Error de Axios o red
      errorMessage = error.message;
    }

    return new Error(errorMessage);
  }
}

// Exportar una instancia única (singleton)
export const apiBase = new ApiBase();

// Exportar la clase para casos donde se necesite crear múltiples instancias
export { ApiBase };

// Helper functions para facilitar el uso
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => apiBase.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiBase.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiBase.put<T>(url, data, config),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiBase.patch<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => apiBase.delete<T>(url, config),
  uploadFile: <T>(url: string, file: FormData, onUploadProgress?: (progressEvent: any) => void) => 
    apiBase.uploadFile<T>(url, file, onUploadProgress),
  downloadFile: (url: string, filename?: string) => apiBase.downloadFile(url, filename),
};
