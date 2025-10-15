import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventosReducer from './slices/EventosSlice';
import apuestaReducer from './slices/apuestaSlice';
import { apiBase } from '../service/apiBase';
//import walletReducer from './slices/walletSlice';
//import exampleReducer from './slices/exampleSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        eventos: eventosReducer,
        apuesta: apuestaReducer,
        // wallet: walletReducer,
        // example: exampleReducer,
    },
});

// Inicializar el token de apiBase desde sessionStorage al cargar la aplicación
apiBase.initializeAuthFromStorage().catch(console.error);

// Suscribirse a cambios de autenticación para sincronizar el token
store.subscribe(() => {
    const state = store.getState();
    if (state.auth.token) {
        apiBase.syncTokenFromRedux();
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch