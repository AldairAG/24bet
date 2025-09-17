import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import walletReducer from './slices/walletSlice';
import exampleReducer from './slices/exampleSlice';
import eventosReducer from './slices/eventosSlice';
import eventosWebSocketReducer from './slices/eventosWebSocketSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        wallet: walletReducer,
        example: exampleReducer,
        eventos: eventosReducer,
        eventosWebSocket: eventosWebSocketReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;