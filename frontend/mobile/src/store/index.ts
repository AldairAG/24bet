import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import walletReducer from './slices/walletSlice';
import exampleReducer from './slices/exampleSlice';
import eventosReducer from './slices/EventosSlice';
import apuestaSlice from './slices/apuestaSlice';
import apiSportReducer from './slices/apiSportSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        wallet: walletReducer,
        example: exampleReducer,
        eventos: eventosReducer,
        apuesta: apuestaSlice,
        apiSport: apiSportReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;