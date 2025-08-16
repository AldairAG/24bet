/**
 * Auth Slice para 24bet
 * Maneja el estado de autenticación
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../service/authService';
import {
  AuthState,
  LoginRequest,
  RegistroRequest,
  JwtResponse,
  UsuarioResponse,
} from '../types/authTypes';

// ========== ESTADO INICIAL ==========

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
};

// ========== ASYNC THUNKS ==========

/**
 * Login async thunk
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error en el login');
    }
  }
);

/**
 * Registro async thunk
 */
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData: RegistroRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error en el registro');
    }
  }
);

/**
 * Logout async thunk
 */
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    authService.logout();
    // También limpiar otros estados relacionados si es necesario
    dispatch(clearUserData());
  }
);

/**
 * Verificar autenticación desde token almacenado
 */
export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('No authenticated');
      }

      const userFromToken = authService.getUserFromToken();
      if (!userFromToken) {
        throw new Error('Invalid token');
      }

      return userFromToken;
    } catch (error: any) {
      authService.logout(); // Limpiar token inválido
      return rejectWithValue('Session expired');
    }
  }
);

// ========== SLICE ==========

const authSlice = createSlice({
  name: 'auth',
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
     * Limpiar datos de usuario (para logout)
     */
    clearUserData: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },

    /**
     * Actualizar información del usuario
     */
    updateUser: (state, action: PayloadAction<Partial<UsuarioResponse>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
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
  },
  extraReducers: (builder) => {
    // ========== LOGIN ==========
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<JwtResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
          rol: action.payload.role as any,
          activo: true,
          // Los demás campos se llenarán cuando se obtenga el perfil completo
        } as UsuarioResponse;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload as string;
      })

    // ========== REGISTRO ==========
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action: PayloadAction<UsuarioResponse>) => {
        state.loading = false;
        state.error = null;
        // Después del registro, el usuario debe hacer login
        // No se autentica automáticamente
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== LOGOUT ==========
    builder
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.loading = false;
        state.error = null;
      })

    // ========== CHECK AUTH ==========
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
          rol: action.payload.role as any,
          activo: true,
        } as UsuarioResponse;
        state.error = null;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

// ========== EXPORT ACTIONS ==========
export const {
  clearError,
  clearUserData,
  updateUser,
  setLoading,
  setError,
} = authSlice.actions;

// ========== SELECTORS ==========
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.rol;
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.user?.rol === 'ADMIN';

// ========== EXPORT REDUCER ==========
export default authSlice.reducer;
