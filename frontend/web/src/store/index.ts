import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventosReducer from './slices/EventosSlice';
import apuestaReducer from './slices/apuestaSlice';
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch