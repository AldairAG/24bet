/**
 * Redux Store Configuration para 24bet
 * Configuración central del store con todos los reducers
 */

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import userReducer from '../slices/userSlice';
import kycReducer from '../slices/kycSlice';
import personalInfoReducer from '../slices/personalInfoSlice';

// ========== STORE CONFIGURATION ==========

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    kyc: kycReducer,
    personalInfo: personalInfoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar estas rutas para checks de serialización
        ignoredActions: [
          // File uploads pueden contener objetos File no serializables
          'kyc/uploadDocument/pending',
          'kyc/uploadDocument/fulfilled',
          'kyc/uploadDocument/rejected',
        ],
        ignoredActionsPaths: ['payload.archivo', 'meta.arg.archivo'],
        ignoredPaths: ['kyc.uploadProgress'],
      },
    }),
  devTools: true, // Siempre habilitado para desarrollo
});

// ========== TYPES ==========

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// ========== STORE UTILITIES ==========

/**
 * Hook para obtener el estado del store de manera tipada
 */
export const getState = (): RootState => store.getState();

/**
 * Hook para dispatch de manera tipada
 */
export const dispatch = store.dispatch;

// ========== STORE PERSISTENCE (OPCIONAL) ==========

/**
 * Función para serializar el estado para persistencia
 */
export const serializeState = (state: RootState): string => {
  try {
    // Solo serializar ciertos campos importantes
    const serializedState = {
      auth: {
        isAuthenticated: state.auth.isAuthenticated,
        token: state.auth.token,
        user: state.auth.user,
      },
      // No persistir estados de loading o errores temporales
    };
    return JSON.stringify(serializedState);
  } catch (error) {
    console.error('Error serializando estado:', error);
    return '{}';
  }
};

/**
 * Función para deserializar el estado desde persistencia
 */
export const deserializeState = (serializedState: string): Partial<RootState> => {
  try {
    const parsed = JSON.parse(serializedState);
    return parsed;
  } catch (error) {
    console.error('Error deserializando estado:', error);
    return {};
  }
};

/**
 * Guardar estado en localStorage
 */
export const saveStateToStorage = (): void => {
  try {
    const state = store.getState();
    const serializedState = serializeState(state);
    localStorage.setItem('24bet_app_state', serializedState);
  } catch (error) {
    console.error('Error guardando estado en localStorage:', error);
  }
};

/**
 * Cargar estado desde localStorage
 */
export const loadStateFromStorage = (): Partial<RootState> => {
  try {
    const serializedState = localStorage.getItem('24bet_app_state');
    if (serializedState === null) {
      return {};
    }
    return deserializeState(serializedState);
  } catch (error) {
    console.error('Error cargando estado desde localStorage:', error);
    return {};
  }
};

// ========== STORE LISTENERS ==========

/**
 * Listener para auto-guardar ciertos cambios importantes
 */
store.subscribe(() => {
  const state = store.getState();

  // Auto-guardar cuando cambia el estado de autenticación
  const prevAuth = loadStateFromStorage().auth;
  if (prevAuth?.isAuthenticated !== state.auth.isAuthenticated) {
    saveStateToStorage();
  }
});

// ========== DEVELOPMENT HELPERS ==========

// Exponer store en window para debugging (siempre en desarrollo)
if (typeof window !== 'undefined') {
  (window as any).__24BET_STORE__ = store;

  // Log de cambios de estado en desarrollo
  store.subscribe(() => {
    const state = store.getState();
    console.group('🔄 24bet Store Update');
    console.log('Auth:', state.auth.isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated');
    console.log('User:', state.user.currentUser?.username || 'None');
    console.log('KYC Status:', state.kyc.estadoKyc?.estadoGeneral || 'Unknown');
    console.log('Personal Info:', state.personalInfo.informacionPersonal ? '✅ Complete' : '❌ Missing');
    console.groupEnd();
  });
}

// ========== EXPORT DEFAULT ==========
export default store;
