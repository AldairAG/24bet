import { useState, useEffect } from 'react';
import { usuarioService } from '../service/usuarioService';
import { kycService } from '../service/kycService';
import type { UsuarioResponse } from '../types/authTypes';
import type { EstadoKycResponse } from '../service/kycService';

interface UseApiExampleState {
  usuario: UsuarioResponse | null;
  estadoKyc: EstadoKycResponse | null;
  loading: boolean;
  error: string | null;
}

export const useApiExample = () => {
  const [state, setState] = useState<UseApiExampleState>({
    usuario: null,
    estadoKyc: null,
    loading: false,
    error: null,
  });

  // Función para obtener el perfil del usuario
  const obtenerPerfil = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await usuarioService.obtenerPerfilActual();
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          usuario: response.data,
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: response.message,
          loading: false 
        }));
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Error al obtener el perfil',
        loading: false 
      }));
    }
  };

  // Función para obtener el estado KYC
  const obtenerEstadoKyc = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await kycService.obtenerMiEstado();
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          estadoKyc: response.data,
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: response.message,
          loading: false 
        }));
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Error al obtener el estado KYC',
        loading: false 
      }));
    }
  };

  // Función para actualizar el perfil
  const actualizarPerfil = async (datos: {
    nombre: string;
    apellido: string;
    ladaTelefono: string;
    numeroTelefono: string;
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await usuarioService.editarPerfil(datos);
      if (response.success) {
        setState(prev => ({ 
          ...prev, 
          usuario: response.data,
          loading: false 
        }));
        return { success: true, message: response.message };
      } else {
        setState(prev => ({ 
          ...prev, 
          error: response.message,
          loading: false 
        }));
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar el perfil';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
      return { success: false, message: errorMessage };
    }
  };

  // Función para subir documento KYC
  const subirDocumentoKyc = async (
    tipoDocumento: string,
    ladoDocumento: string,
    archivo: File,
    onProgress?: (progress: number) => void
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const documento = await kycService.subirDocumento(
        tipoDocumento as any,
        ladoDocumento as any,
        archivo,
        onProgress
      );
      
      setState(prev => ({ ...prev, loading: false }));
      
      // Refrescar el estado KYC después de subir un documento
      await obtenerEstadoKyc();
      
      return { success: true, data: documento };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al subir el documento';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
      return { success: false, message: errorMessage };
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      await Promise.all([
        obtenerPerfil(),
        obtenerEstadoKyc()
      ]);
    };

    cargarDatosIniciales();
  }, []);

  return {
    // Estado
    ...state,
    
    // Funciones
    obtenerPerfil,
    obtenerEstadoKyc,
    actualizarPerfil,
    subirDocumentoKyc,
    
    // Helper para limpiar errores
    clearError: () => setState(prev => ({ ...prev, error: null })),
    
    // Helper para refrescar todos los datos
    refresh: async () => {
      await Promise.all([
        obtenerPerfil(),
        obtenerEstadoKyc()
      ]);
    }
  };
};
