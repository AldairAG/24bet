import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { store } from '../store'; // Importar tu store de Redux
import { logout } from '../store/slices/authSlice'; // Importar action de logout

// Define __DEV__ for development mode checking
const __DEV__ = process.env.NODE_ENV === 'development';

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
const API_BASE_URL = 'http://localhost:8080/24bet';
//const API_BASE_URL = 'https://24bet.mx/24bet';


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
    // Interceptor de request mejorado
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          // 1. Prioridad: obtener token desde Redux
          let token = this.getTokenFromRedux();
          
          // 2. Fallback: obtener desde storage si Redux no está disponible
          if (!token) {
            token = await storage.getItem('token');
          }

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            
            if (__DEV__) {
              console.log(`🔐 Request with auth: ${config.method?.toUpperCase()} ${config.url}`);
            }
          } else if (__DEV__) {
            console.log(`🔓 Request without auth: ${config.method?.toUpperCase()} ${config.url}`);
          }
        } catch (error) {
          console.error('Error al obtener el token:', error);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de response para manejo de errores
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
          });
        }
        return response;
      },
      async (error) => {
        if (__DEV__) {
          console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            message: error.response?.data?.message,
          });
        }

        // Manejo específico de errores de autenticación
        if (error.response?.status === 401) {
          console.log('🚪 Token expirado o inválido - cerrando sesión');
          await this.handleUnauthorized();
        }

        return Promise.reject(error);
      }
    );
  }

  // Obtener token desde Redux store
  private getTokenFromRedux(): string | null {
    try {
      const state = store.getState();
      return state.auth.token || null;
    } catch (error) {
      console.warn('No se pudo obtener token desde Redux:', error);
      return null;
    }
  }

  // Manejo mejorado de 401
  private async handleUnauthorized() {
    try {
      // 1. Limpiar storage
      await storage.removeItem('token');
      await storage.removeItem('user');
      
      // 2. Limpiar headers de axios
      delete this.axiosInstance.defaults.headers.common['Authorization'];
      
      // 3. Dispatch logout en Redux
      store.dispatch(logout());
      
      console.log('✅ Sesión limpiada completamente');
    } catch (error) {
      console.error('Error al limpiar la sesión:', error);
    }
  }

  // Método para sincronizar token desde Redux
  public syncTokenFromRedux(): void {
    const token = this.getTokenFromRedux();
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  // Método para inicializar token desde storage al arranque
  public async initializeAuthFromStorage(): Promise<void> {
    try {
      const token = await storage.getItem('token');
      if (token) {
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('🔐 Token inicializado desde storage');
      }
    } catch (error) {
      console.error('Error al inicializar token:', error);
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
// Exportar la clase para casos donde se necesite crear múltiples instancias
export { ApiBase, API_BASE_URL };

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
