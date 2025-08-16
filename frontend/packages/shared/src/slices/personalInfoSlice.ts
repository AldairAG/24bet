/**
 * Personal Info Slice para 24bet
 * Maneja el estado de información personal
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { personalInfoService } from '../service/personalInfoService';
import {
  PersonalInfoState,
  InformacionPersonalRequest,
  InformacionPersonalResponse,
} from '../types/personalInfoTypes';

// ========== ESTADO INICIAL ==========

const initialState: PersonalInfoState = {
  informacionPersonal: null,
  loading: false,
  error: null,
};

// ========== ASYNC THUNKS ==========

/**
 * Obtener mi información personal
 */
export const getMyPersonalInfoAsync = createAsyncThunk(
  'personalInfo/getMyPersonalInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await personalInfoService.getMyPersonalInfo();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener información personal');
    }
  }
);

/**
 * Actualizar mi información personal
 */
export const updateMyPersonalInfoAsync = createAsyncThunk(
  'personalInfo/updateMyPersonalInfo',
  async (personalInfo: InformacionPersonalRequest, { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updateMyPersonalInfo(personalInfo);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar información personal');
    }
  }
);

/**
 * Obtener información personal por ID de usuario (admin o propio)
 */
export const getPersonalInfoByUserIdAsync = createAsyncThunk(
  'personalInfo/getPersonalInfoByUserId',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await personalInfoService.getPersonalInfoByUserId(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener información personal del usuario');
    }
  }
);

/**
 * Actualizar información personal por ID de usuario (admin o propio)
 */
export const updatePersonalInfoByUserIdAsync = createAsyncThunk(
  'personalInfo/updatePersonalInfoByUserId',
  async ({ userId, personalInfo }: { userId: number; personalInfo: InformacionPersonalRequest }, { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updatePersonalInfoByUserId(userId, personalInfo);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar información personal del usuario');
    }
  }
);

// ========== SLICE ==========

const personalInfoSlice = createSlice({
  name: 'personalInfo',
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
     * Limpiar información personal
     */
    clearPersonalInfo: (state) => {
      state.informacionPersonal = null;
    },

    /**
     * Actualizar campo específico de información personal
     */
    updatePersonalInfoField: (state, action: PayloadAction<Partial<InformacionPersonalResponse>>) => {
      if (state.informacionPersonal) {
        state.informacionPersonal = { ...state.informacionPersonal, ...action.payload };
      }
    },

    /**
     * Set loading manual
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Set error manual
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    /**
     * Validar y set información personal temporal (para formularios)
     */
    setTempPersonalInfo: (state, action: PayloadAction<InformacionPersonalResponse>) => {
      state.informacionPersonal = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ========== GET MY PERSONAL INFO ==========
    builder
      .addCase(getMyPersonalInfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyPersonalInfoAsync.fulfilled, (state, action: PayloadAction<InformacionPersonalResponse>) => {
        state.loading = false;
        state.informacionPersonal = action.payload;
        state.error = null;
      })
      .addCase(getMyPersonalInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== UPDATE MY PERSONAL INFO ==========
    builder
      .addCase(updateMyPersonalInfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyPersonalInfoAsync.fulfilled, (state, action: PayloadAction<InformacionPersonalResponse>) => {
        state.loading = false;
        state.informacionPersonal = action.payload;
        state.error = null;
      })
      .addCase(updateMyPersonalInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== GET PERSONAL INFO BY USER ID ==========
    builder
      .addCase(getPersonalInfoByUserIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPersonalInfoByUserIdAsync.fulfilled, (state, action: PayloadAction<InformacionPersonalResponse>) => {
        state.loading = false;
        state.informacionPersonal = action.payload;
        state.error = null;
      })
      .addCase(getPersonalInfoByUserIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== UPDATE PERSONAL INFO BY USER ID ==========
    builder
      .addCase(updatePersonalInfoByUserIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePersonalInfoByUserIdAsync.fulfilled, (state, action: PayloadAction<InformacionPersonalResponse>) => {
        state.loading = false;
        state.informacionPersonal = action.payload;
        state.error = null;
      })
      .addCase(updatePersonalInfoByUserIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ========== EXPORT ACTIONS ==========
export const {
  clearError,
  clearPersonalInfo,
  updatePersonalInfoField,
  setLoading,
  setError,
  setTempPersonalInfo,
} = personalInfoSlice.actions;

// ========== SELECTORS ==========
export const selectPersonalInfo = (state: { personalInfo: PersonalInfoState }) => state.personalInfo;
export const selectPersonalInfoData = (state: { personalInfo: PersonalInfoState }) => state.personalInfo.informacionPersonal;
export const selectPersonalInfoLoading = (state: { personalInfo: PersonalInfoState }) => state.personalInfo.loading;
export const selectPersonalInfoError = (state: { personalInfo: PersonalInfoState }) => state.personalInfo.error;

// Selectores específicos para validaciones
export const selectIsPersonalInfoComplete = (state: { personalInfo: PersonalInfoState }) => {
  const info = state.personalInfo.informacionPersonal;
  if (!info) return false;
  
  // Verificar campos requeridos mínimos
  return !!(
    info.primerNombre &&
    info.apellidoPaterno &&
    info.fechaNacimiento &&
    info.telefono &&
    info.calle &&
    info.ciudad &&
    info.estado &&
    info.codigoPostal &&
    info.pais
  );
};

export const selectPersonalInfoAge = (state: { personalInfo: PersonalInfoState }) => {
  const info = state.personalInfo.informacionPersonal;
  if (!info?.fechaNacimiento) return null;
  
  const today = new Date();
  const birthDate = new Date(info.fechaNacimiento);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const selectPersonalInfoFullName = (state: { personalInfo: PersonalInfoState }) => {
  const info = state.personalInfo.informacionPersonal;
  if (!info) return null;
  
  const nombres = [info.primerNombre, info.segundoNombre].filter(Boolean).join(' ');
  const apellidos = [info.apellidoPaterno, info.apellidoMaterno].filter(Boolean).join(' ');
  
  return [nombres, apellidos].filter(Boolean).join(' ');
};

export const selectPersonalInfoFullAddress = (state: { personalInfo: PersonalInfoState }) => {
  const info = state.personalInfo.informacionPersonal;
  if (!info) return null;
  
  const partes = [
    info.calle,
    info.numeroExterior,
    info.numeroInterior && `Int. ${info.numeroInterior}`,
    info.colonia,
    info.ciudad,
    info.estado,
    info.codigoPostal,
    info.pais
  ].filter(Boolean);
  
  return partes.join(', ');
};

// Selector para validaciones específicas
export const selectPersonalInfoValidation = (state: { personalInfo: PersonalInfoState }) => {
  const info = state.personalInfo.informacionPersonal;
  if (!info) return { isValid: false, errors: ['No hay información personal'] };
  
  const errors: string[] = [];
  
  // Validaciones básicas
  if (!info.primerNombre) errors.push('Primer nombre es requerido');
  if (!info.apellidoPaterno) errors.push('Apellido paterno es requerido');
  if (!info.fechaNacimiento) errors.push('Fecha de nacimiento es requerida');
  if (!info.telefono) errors.push('Teléfono es requerido');
  if (!info.calle) errors.push('Dirección es requerida');
  if (!info.ciudad) errors.push('Ciudad es requerida');
  if (!info.estado) errors.push('Estado es requerido');
  if (!info.codigoPostal) errors.push('Código postal es requerido');
  
  // Validaciones de formato
  if (info.rfc && !/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(info.rfc)) {
    errors.push('RFC no tiene formato válido');
  }
  
  if (info.curp && !/^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}[0-1][0-9][0-3][0-9][HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}[A-Z0-9]{1}[0-9]{1}$/.test(info.curp)) {
    errors.push('CURP no tiene formato válido');
  }
  
  if (info.codigoPostal && !/^[0-9]{5}$/.test(info.codigoPostal)) {
    errors.push('Código postal debe tener 5 dígitos');
  }
  
  // Validación de edad (mayor de edad)
  if (info.fechaNacimiento) {
    const age = selectPersonalInfoAge({ personalInfo: { ...state.personalInfo } });
    if (age !== null && age < 18) {
      errors.push('Debe ser mayor de 18 años');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ========== EXPORT REDUCER ==========
export default personalInfoSlice.reducer;
