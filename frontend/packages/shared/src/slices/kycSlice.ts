/**
 * KYC Slice para 24bet
 * Maneja el estado de documentos KYC
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { kycService } from '../service/kycService';
import {
  KycState,
  EstadoKycResponse,
  DocumentoKycResponse,
  SubirDocumentoRequest,
  RevisionDocumentoRequest
} from '../types/kycTypes';

import { Page,PageRequest } from '../types/apiTypes';

// ========== ESTADO INICIAL ==========

const initialState: KycState = {
  estadoKyc: null,
  misDocumentos: [],
  documentosPendientesRevision: [],
  loading: false,
  uploadingDocument: false,
  error: null,
  uploadProgress: 0,
};

// ========== ASYNC THUNKS ==========

/**
 * Obtener mi estado de KYC
 */
export const getMyKycStatusAsync = createAsyncThunk(
  'kyc/getMyKycStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await kycService.getMyKycStatus();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener estado KYC');
    }
  }
);

/**
 * Obtener mis documentos KYC
 */
export const getMyDocumentsAsync = createAsyncThunk(
  'kyc/getMyDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await kycService.getMyDocuments();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener documentos');
    }
  }
);

/**
 * Subir documento KYC
 */
export const uploadDocumentAsync = createAsyncThunk(
  'kyc/uploadDocument',
  async (documentData: SubirDocumentoRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await kycService.uploadDocument(
        documentData,
        (progress: number) => {
          dispatch(setUploadProgress(progress));
        }
      );
      
      // Después de subir, actualizar el estado KYC
      dispatch(getMyKycStatusAsync());
      dispatch(getMyDocumentsAsync());
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al subir documento');
    }
  }
);

/**
 * Obtener documento por ID
 */
export const getDocumentByIdAsync = createAsyncThunk(
  'kyc/getDocumentById',
  async (documentId: number, { rejectWithValue }) => {
    try {
      const response = await kycService.getDocumentById(documentId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener documento');
    }
  }
);

/**
 * Descargar documento
 */
export const downloadDocumentAsync = createAsyncThunk(
  'kyc/downloadDocument',
  async ({ documentId, fileName }: { documentId: number; fileName: string }, { rejectWithValue }) => {
    try {
      const blob = await kycService.downloadDocument(documentId);
      
      // Crear URL temporal para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return 'Descarga iniciada';
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al descargar documento');
    }
  }
);

/**
 * Eliminar documento
 */
export const deleteDocumentAsync = createAsyncThunk(
  'kyc/deleteDocument',
  async (documentId: number, { dispatch, rejectWithValue }) => {
    try {
      await kycService.deleteDocument(documentId);
      
      // Actualizar estado después de eliminar
      dispatch(getMyKycStatusAsync());
      dispatch(getMyDocumentsAsync());
      
      return documentId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al eliminar documento');
    }
  }
);

// ========== ASYNC THUNKS PARA ADMIN ==========

/**
 * Obtener documentos pendientes de revisión (admin)
 */
export const getPendingDocumentsAsync = createAsyncThunk(
  'kyc/getPendingDocuments',
  async (pageRequest: PageRequest = {}, { rejectWithValue }) => {
    try {
      const response = await kycService.getPendingDocuments(pageRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener documentos pendientes');
    }
  }
);

/**
 * Revisar documento (admin)
 */
export const reviewDocumentAsync = createAsyncThunk(
  'kyc/reviewDocument',
  async ({ documentId, revisionData }: { documentId: number; revisionData: RevisionDocumentoRequest }, { dispatch, rejectWithValue }) => {
    try {
      const response = await kycService.reviewDocument(documentId, revisionData);
      
      // Actualizar lista de documentos pendientes
      dispatch(getPendingDocumentsAsync({}));
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al revisar documento');
    }
  }
);

/**
 * Obtener documentos de un usuario (admin)
 */
export const getUserDocumentsAsync = createAsyncThunk(
  'kyc/getUserDocuments',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await kycService.getUserDocuments(userId);
      return { userId, documents: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener documentos del usuario');
    }
  }
);

/**
 * Obtener estado KYC de un usuario (admin)
 */
export const getUserKycStatusAsync = createAsyncThunk(
  'kyc/getUserKycStatus',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await kycService.getUserKycStatus(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener estado KYC del usuario');
    }
  }
);

// ========== SLICE ==========

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    // ========== ACCIONES SÍNCRONAS ==========
    
    /**
     * Limpiar errores
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Limpiar datos de KYC
     */
    clearKycData: (state) => {
      state.estadoKyc = null;
      state.misDocumentos = [];
      state.documentosPendientesRevision = [];
      state.uploadProgress = 0;
    },

    /**
     * Set progreso de subida
     */
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },

    /**
     * Reset progreso de subida
     */
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
      state.uploadingDocument = false;
    },

    /**
     * Set loading manual
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Set uploading document
     */
    setUploadingDocument: (state, action: PayloadAction<boolean>) => {
      state.uploadingDocument = action.payload;
    },

    /**
     * Set error manual
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.uploadingDocument = false;
    },

    /**
     * Actualizar documento en la lista
     */
    updateDocumentInList: (state, action: PayloadAction<DocumentoKycResponse>) => {
      const index = state.misDocumentos.findIndex(doc => doc.id === action.payload.id);
      if (index !== -1) {
        state.misDocumentos[index] = action.payload;
      }
      
      // También en documentos pendientes si está ahí
      const pendingIndex = state.documentosPendientesRevision.findIndex(doc => doc.id === action.payload.id);
      if (pendingIndex !== -1) {
        state.documentosPendientesRevision[pendingIndex] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // ========== GET MY KYC STATUS ==========
    builder
      .addCase(getMyKycStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyKycStatusAsync.fulfilled, (state, action: PayloadAction<EstadoKycResponse>) => {
        state.loading = false;
        state.estadoKyc = action.payload;
        state.error = null;
      })
      .addCase(getMyKycStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== GET MY DOCUMENTS ==========
    builder
      .addCase(getMyDocumentsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyDocumentsAsync.fulfilled, (state, action: PayloadAction<DocumentoKycResponse[]>) => {
        state.loading = false;
        state.misDocumentos = action.payload;
        state.error = null;
      })
      .addCase(getMyDocumentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== UPLOAD DOCUMENT ==========
    builder
      .addCase(uploadDocumentAsync.pending, (state) => {
        state.uploadingDocument = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadDocumentAsync.fulfilled, (state, action: PayloadAction<DocumentoKycResponse>) => {
        state.uploadingDocument = false;
        state.uploadProgress = 100;
        state.error = null;
        
        // Agregar el nuevo documento a la lista
        state.misDocumentos.push(action.payload);
      })
      .addCase(uploadDocumentAsync.rejected, (state, action) => {
        state.uploadingDocument = false;
        state.uploadProgress = 0;
        state.error = action.payload as string;
      })

    // ========== GET DOCUMENT BY ID ==========
    builder
      .addCase(getDocumentByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDocumentByIdAsync.fulfilled, (state, action: PayloadAction<DocumentoKycResponse>) => {
        state.loading = false;
        state.error = null;
        
        // Actualizar en la lista si ya existe
        const index = state.misDocumentos.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.misDocumentos[index] = action.payload;
        }
      })
      .addCase(getDocumentByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== DELETE DOCUMENT ==========
    builder
      .addCase(deleteDocumentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocumentAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.error = null;
        
        // Remover de la lista
        state.misDocumentos = state.misDocumentos.filter(doc => doc.id !== action.payload);
      })
      .addCase(deleteDocumentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== GET PENDING DOCUMENTS (ADMIN) ==========
    builder
      .addCase(getPendingDocumentsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingDocumentsAsync.fulfilled, (state, action: PayloadAction<Page<DocumentoKycResponse>>) => {
        state.loading = false;
        state.documentosPendientesRevision = action.payload.content;
        state.error = null;
      })
      .addCase(getPendingDocumentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== REVIEW DOCUMENT (ADMIN) ==========
    builder
      .addCase(reviewDocumentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewDocumentAsync.fulfilled, (state, action: PayloadAction<DocumentoKycResponse>) => {
        state.loading = false;
        state.error = null;
        
        // Actualizar en la lista de pendientes
        const index = state.documentosPendientesRevision.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          if (action.payload.estado === 'PENDIENTE') {
            state.documentosPendientesRevision[index] = action.payload;
          } else {
            // Si ya no está pendiente, remover de la lista
            state.documentosPendientesRevision.splice(index, 1);
          }
        }
      })
      .addCase(reviewDocumentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ========== EXPORT ACTIONS ==========
export const {
  clearError,
  clearKycData,
  setUploadProgress,
  resetUploadProgress,
  setLoading,
  setUploadingDocument,
  setError,
  updateDocumentInList,
} = kycSlice.actions;

// ========== SELECTORS ==========
export const selectKyc = (state: { kyc: KycState }) => state.kyc;
export const selectKycStatus = (state: { kyc: KycState }) => state.kyc.estadoKyc;
export const selectMyDocuments = (state: { kyc: KycState }) => state.kyc.misDocumentos;
export const selectPendingDocuments = (state: { kyc: KycState }) => state.kyc.documentosPendientesRevision;
export const selectKycLoading = (state: { kyc: KycState }) => state.kyc.loading;
export const selectUploadingDocument = (state: { kyc: KycState }) => state.kyc.uploadingDocument;
export const selectUploadProgress = (state: { kyc: KycState }) => state.kyc.uploadProgress;
export const selectKycError = (state: { kyc: KycState }) => state.kyc.error;

// Selectores específicos
export const selectKycProgress = (state: { kyc: KycState }) => {
  const estadoKyc = state.kyc.estadoKyc;
  return estadoKyc ? estadoKyc.porcentajeCompletado : 0;
};

export const selectCanOperate = (state: { kyc: KycState }) => {
  const estadoKyc = state.kyc.estadoKyc;
  return estadoKyc ? estadoKyc.puedeOperar : false;
};

export const selectDocumentsByType = (tipoDocumento: string) => (state: { kyc: KycState }) =>
  state.kyc.misDocumentos.filter(doc => doc.tipoDocumento === tipoDocumento);

export const selectPendingDocumentsCount = (state: { kyc: KycState }) => 
  state.kyc.documentosPendientesRevision.length;

// ========== EXPORT REDUCER ==========
export default kycSlice.reducer;
