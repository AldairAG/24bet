/**
 * User Slice para 24bet
 * Maneja el estado de gestión de usuarios
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '../service/userService';
import {
  UserState,
  UsuarioResponse,
  EditarPerfilRequest,
  EditarUsuarioAdminRequest,
  CambiarPasswordRequest,
} from '../types/authTypes';
import {
  Page,
  PageRequest,
} from '../types/apiTypes';

// ========== ESTADO INICIAL ==========

const initialState: UserState = {
  currentUser: null,
  users: [],
  usersPage: null,
  loading: false,
  error: null,
};

// ========== ASYNC THUNKS ==========

/**
 * Obtener mi perfil
 */
export const getMyProfileAsync = createAsyncThunk(
  'user/getMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getMyProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener perfil');
    }
  }
);

/**
 * Actualizar mi perfil
 */
export const updateMyProfileAsync = createAsyncThunk(
  'user/updateMyProfile',
  async (profileData: EditarPerfilRequest, { rejectWithValue }) => {
    try {
      const response = await userService.updateMyProfile(profileData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar perfil');
    }
  }
);

/**
 * Cambiar contraseña
 */
export const changePasswordAsync = createAsyncThunk(
  'user/changePassword',
  async (passwordData: CambiarPasswordRequest, { rejectWithValue }) => {
    try {
      await userService.changePassword(passwordData);
      return 'Contraseña actualizada exitosamente';
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cambiar contraseña');
    }
  }
);

/**
 * Obtener todos los usuarios (admin)
 */
export const getAllUsersAsync = createAsyncThunk(
  'user/getAllUsers',
  async (pageRequest: PageRequest = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers(pageRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener usuarios');
    }
  }
);

/**
 * Obtener usuario por ID
 */
export const getUserByIdAsync = createAsyncThunk(
  'user/getUserById',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener usuario');
    }
  }
);

/**
 * Actualizar usuario como admin
 */
export const updateUserAsAdminAsync = createAsyncThunk(
  'user/updateUserAsAdmin',
  async ({ id, userData }: { id: number; userData: EditarUsuarioAdminRequest }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserAsAdmin(id, userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar usuario');
    }
  }
);

/**
 * Eliminar usuario
 */
export const deleteUserAsync = createAsyncThunk(
  'user/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await userService.deleteUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al eliminar usuario');
    }
  }
);

/**
 * Buscar usuarios
 */
export const searchUsersAsync = createAsyncThunk(
  'user/searchUsers',
  async ({ query, pageRequest }: { query: string; pageRequest?: PageRequest }, { rejectWithValue }) => {
    try {
      const response = await userService.searchUsers(query, pageRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error en la búsqueda');
    }
  }
);

/**
 * Obtener estadísticas de usuarios
 */
export const getUserStatsAsync = createAsyncThunk(
  'user/getUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUserStats();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener estadísticas');
    }
  }
);

// ========== SLICE ==========

const userSlice = createSlice({
  name: 'user',
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
     * Limpiar datos de usuarios
     */
    clearUsers: (state) => {
      state.users = [];
      state.usersPage = null;
    },

    /**
     * Actualizar usuario en la lista
     */
    updateUserInList: (state, action: PayloadAction<UsuarioResponse>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      
      // También actualizar en usersPage si existe
      if (state.usersPage) {
        const pageIndex = state.usersPage.content.findIndex(user => user.id === action.payload.id);
        if (pageIndex !== -1) {
          state.usersPage.content[pageIndex] = action.payload;
        }
      }
    },

    /**
     * Remover usuario de la lista
     */
    removeUserFromList: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      
      // También remover de usersPage si existe
      if (state.usersPage) {
        state.usersPage.content = state.usersPage.content.filter(user => user.id !== action.payload);
        state.usersPage.totalElements = Math.max(0, state.usersPage.totalElements - 1);
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
    // ========== GET MY PROFILE ==========
    builder
      .addCase(getMyProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyProfileAsync.fulfilled, (state, action: PayloadAction<UsuarioResponse>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(getMyProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== UPDATE MY PROFILE ==========
    builder
      .addCase(updateMyProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyProfileAsync.fulfilled, (state, action: PayloadAction<UsuarioResponse>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateMyProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== CHANGE PASSWORD ==========
    builder
      .addCase(changePasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== GET ALL USERS ==========
    builder
      .addCase(getAllUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersAsync.fulfilled, (state, action: PayloadAction<Page<UsuarioResponse>>) => {
        state.loading = false;
        state.usersPage = {
          content: action.payload.content,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.number,
          pageSize: action.payload.size,
        };
        state.users = action.payload.content;
        state.error = null;
      })
      .addCase(getAllUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== GET USER BY ID ==========
    builder
      .addCase(getUserByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByIdAsync.fulfilled, (state, action: PayloadAction<UsuarioResponse>) => {
        state.loading = false;
        state.error = null;
        
        // Actualizar en la lista si ya existe
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(getUserByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== UPDATE USER AS ADMIN ==========
    builder
      .addCase(updateUserAsAdminAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsAdminAsync.fulfilled, (state, action: PayloadAction<UsuarioResponse>) => {
        state.loading = false;
        state.error = null;
        
        // Actualizar en la lista
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        
        // También actualizar en usersPage si existe
        if (state.usersPage) {
          const pageIndex = state.usersPage.content.findIndex(user => user.id === action.payload.id);
          if (pageIndex !== -1) {
            state.usersPage.content[pageIndex] = action.payload;
          }
        }
      })
      .addCase(updateUserAsAdminAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== DELETE USER ==========
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.error = null;
        
        // Remover de la lista
        state.users = state.users.filter(user => user.id !== action.payload);
        
        // También remover de usersPage si existe
        if (state.usersPage) {
          state.usersPage.content = state.usersPage.content.filter(user => user.id !== action.payload);
          state.usersPage.totalElements = Math.max(0, state.usersPage.totalElements - 1);
        }
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ========== SEARCH USERS ==========
    builder
      .addCase(searchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsersAsync.fulfilled, (state, action: PayloadAction<Page<UsuarioResponse>>) => {
        state.loading = false;
        state.usersPage = {
          content: action.payload.content,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.number,
          pageSize: action.payload.size,
        };
        state.users = action.payload.content;
        state.error = null;
      })
      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ========== EXPORT ACTIONS ==========
export const {
  clearError,
  clearUsers,
  updateUserInList,
  removeUserFromList,
  setLoading,
  setError,
} = userSlice.actions;

// ========== SELECTORS ==========
export const selectUser = (state: { user: UserState }) => state.user;
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectUsers = (state: { user: UserState }) => state.user.users;
export const selectUsersPage = (state: { user: UserState }) => state.user.usersPage;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;

// Selectores específicos
export const selectUserById = (userId: number) => (state: { user: UserState }) =>
  state.user.users.find(user => user.id === userId);

export const selectUsersCount = (state: { user: UserState }) => 
  state.user.usersPage?.totalElements || state.user.users.length;

// ========== EXPORT REDUCER ==========
export default userSlice.reducer;
