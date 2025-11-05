import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Evento, EventoConOddsResponse, LigaPorDeporteDetalleResponse } from '../../types/EventosType';
import { eventosService } from '../../service/EventosService';
import type { RootState } from '../index';

// ========== ESTADO INICIAL ==========
export interface EventosState {
    //eventos en vivo 
    eventosEnVivo: EventoConOddsResponse[];
    isLoadingEventosEnVivo: boolean;
    loadEventosEnVivoError: string | null;

    //eventos futuros por deporte
    eventosFuturosPorDeporte: EventoConOddsResponse[];
    isLoadingEventosFuturosPorDeporte: boolean;
    loadEventosFuturosPorDeporteError: string | null;

    // eventos futuros por liga
    eventosFuturosPorLiga: EventoConOddsResponse[];
    isLoadingEventosFuturosPorLiga: boolean;
    loadEventosFuturosPorLigaError: string | null;

    // ligas de deporte
    ligasPorDeporte: LigaPorDeporteDetalleResponse[];
    isLoadingLigasPorDeporte: boolean;
    loadLigasPorDeporteError: string | null;

    //eventos detail
    eventoDetail: Evento | null;
    isLoadingEventoDetail: boolean;
    loadEventoDetailError: string | null;

    // Última actualización
    ultimaActualizacion: string | null;

}

const initialState: EventosState = {
    // eventos en vivo
    eventosEnVivo: [],
    isLoadingEventosEnVivo: false,
    loadEventosEnVivoError: null,

    // eventos futuros por deporte
    eventosFuturosPorDeporte: [],
    isLoadingEventosFuturosPorDeporte: false,
    loadEventosFuturosPorDeporteError: null,

    // eventos futuros por liga
    eventosFuturosPorLiga: [],
    isLoadingEventosFuturosPorLiga: false,
    loadEventosFuturosPorLigaError: null,

    // ligas por deporte
    ligasPorDeporte: [],
    isLoadingLigasPorDeporte: false,
    loadLigasPorDeporteError: null,

    // evento detail
    eventoDetail: null,
    isLoadingEventoDetail: false,
    loadEventoDetailError: null,

    // Última actualización
    ultimaActualizacion: null,

};

// ========== THUNKS ASÍNCRONOS ==========

/**
 * Thunk para cargar eventos en vivo por deporte
 * @param {string} deporte Deporte para filtrar eventos
 * @return {Promise<EventosEnVivoResponse[]>} Lista de eventos en vivo
 */
export const getEventosEnVivoPorDeporte = createAsyncThunk<
    EventoConOddsResponse[], // Tipo de retorno: array
    string, // Parámetro: deporte
    { rejectValue: string } // Tipo del error
>(
    'eventos/getEventosEnVivo',
    async (deporte, { rejectWithValue }) => {
        try {
            const eventos = await eventosService.getEventosEnVivoPorDeporte(deporte);
            return eventos;
        } catch (error) {
            console.error('❌ Error en thunk:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar eventos en vivo';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Thunk para cargar eventos futuros por nombre de deporte
 */
export const getEventosFuturosPorDeporte = createAsyncThunk<
    EventoConOddsResponse[], // Tipo de datos de retorno
    string, // Tipo de parámetro de entrada
    { rejectValue: string } // Tipo de error
>(
    'eventos/getEventosFuturosPorDeporte',
    async (deporte, { rejectWithValue }) => {
        try {
            return await eventosService.getEventosFuturosPorDeporte(deporte);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
        }
    }
);

/**
 * Thunk para cargar eventos futuros por liga
 */
export const getEventosFuturosPorLiga = createAsyncThunk<
    EventoConOddsResponse[], // Tipo de datos de retorno
    { paisNombre: string; ligaNombre: string }, // Tipo de parámetro de entrada
    { rejectValue: string } // Tipo de error
>(
    'eventos/getEventosFuturosPorLiga',
    async ({ paisNombre, ligaNombre }, { rejectWithValue }) => {
        try {
            return await eventosService.getEventosFuturosByLigaName(paisNombre, ligaNombre);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
        }
    }
);

/**
 * Thunk para cargar ligas por deporte
 */
export const getLigasPorDeporte = createAsyncThunk<
    LigaPorDeporteDetalleResponse[], // Tipo de retorno
    string, // Parámetro: deporte
    { rejectValue: string } // Tipo del error
>(
    'eventos/getLigasPorDeporte',
    async (deporte, { rejectWithValue }) => {
        try {
            const ligas = await eventosService.getLigasPorDeporte(deporte);
            return ligas;
        } catch (error) {
            console.error('❌ Error en thunk:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar ligas por deporte';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Thunk para cargar detalles de un evento por su nombre
 */
export const getEventoDetail = createAsyncThunk<
    Evento, // Tipo de retorno
    string, // Parámetro: nombre del evento
    { rejectValue: string } // Tipo del error
>(
    'eventos/getEventoDetail',
    async (eventoName, { rejectWithValue }) => {
        try {
            const eventoResponse = await eventosService.getEventoPorNombre(eventoName);
            return eventoResponse.data;
        } catch (error) {
            console.error('❌ Error en thunk:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar detalles del evento';
            return rejectWithValue(errorMessage);
        }
    }
);




// ========== SLICE ==========
const eventosSlice = createSlice({
    name: 'eventos',
    initialState,
    reducers: {
        // ========== ACCIONES DE LIMPIEZA ==========

        /**
         * Limpia el error de carga de eventos futuros
         */
        clearLoadEventosFuturosPorLigaError: (state) => {
            state.loadEventosFuturosPorLigaError = null;
        },

        /**
         * Limpia el error de carga de ligas por deporte
         */
        clearLoadLigasPorDeporteError: (state) => {
            state.loadLigasPorDeporteError = null;
        },

        /**
         * Limpia el error de carga de detalles de evento
         */
        clearLoadEventoDetailError: (state) => {
            state.loadEventoDetailError = null;
        },

        /**
         * Limpia el error de carga de eventos
         */
        clearLoadEventosError: (state) => {
            state.loadEventosFuturosPorDeporteError = null;
        },

        /**
         * Limpia el error de carga de eventos en vivo
         */
        clearLoadEventosEnVivoError: (state) => {
            state.loadEventosEnVivoError = null;
        },

        /**
         * Limpia los eventos en vivo
         */
        clearEventosEnVivo: (state) => {
            state.eventosEnVivo = [];
        },

        /**
         * Limpia todos los datos de eventos
         */
        clearEventosData: (state) => {
            state.eventosEnVivo = [];
            state.loadEventosEnVivoError = null;
            state.ultimaActualizacion = null;
        },

    },
    extraReducers: (builder) => {
        // ========== GET EVENTOS EN VIVO ==========
        builder
            .addCase(getEventosEnVivoPorDeporte.pending, (state) => {
                state.isLoadingEventosEnVivo = true;
                state.loadEventosEnVivoError = null;
            })
            .addCase(getEventosEnVivoPorDeporte.fulfilled, (state, action) => {
                state.isLoadingEventosEnVivo = false;
                state.eventosEnVivo = action.payload;
                state.loadEventosEnVivoError = null;
                state.ultimaActualizacion = new Date().toISOString();
            })
            .addCase(getEventosEnVivoPorDeporte.rejected, (state, action) => {
                state.isLoadingEventosEnVivo = false;
                state.loadEventosEnVivoError = action.payload || 'Error al cargar eventos en vivo';
                state.eventosEnVivo = [];
            });

        // ========== GET EVENTOS FUTUROS POR DEPORTE ==========
        builder
            .addCase(getEventosFuturosPorDeporte.pending, (state) => {
                state.isLoadingEventosFuturosPorDeporte = true;
                state.loadEventosFuturosPorDeporteError = null;
            })
            .addCase(getEventosFuturosPorDeporte.fulfilled, (state, action) => {
                state.isLoadingEventosFuturosPorDeporte = false;
                state.eventosFuturosPorDeporte = action.payload;
                state.loadEventosFuturosPorDeporteError = null;
                state.ultimaActualizacion = new Date().toISOString();
            })
            .addCase(getEventosFuturosPorDeporte.rejected, (state, action) => {
                state.isLoadingEventosFuturosPorDeporte = false;
                state.loadEventosFuturosPorDeporteError = action.payload || 'Error al cargar eventos futuros por deporte';
                state.eventosFuturosPorDeporte = [];
            });

        // ========== GET EVENTOS FUTUROS POR LIGA ==========
        builder
            .addCase(getEventosFuturosPorLiga.pending, (state) => {
                state.isLoadingEventosFuturosPorLiga = true;
                state.loadEventosFuturosPorLigaError = null;
            })
            .addCase(getEventosFuturosPorLiga.fulfilled, (state, action) => {
                state.isLoadingEventosFuturosPorLiga = false;
                state.eventosFuturosPorLiga= action.payload;
                state.loadEventosFuturosPorLigaError = null;
                state.ultimaActualizacion = new Date().toISOString();
            })
            .addCase(getEventosFuturosPorLiga.rejected, (state, action) => {
                state.isLoadingEventosFuturosPorLiga = false;
                state.loadEventosFuturosPorLigaError = action.payload || 'Error al cargar eventos futuros';
                state.eventosFuturosPorLiga = [];
            });

        // ========== GET LIGAS POR DEPORTE ==========
        builder
            .addCase(getLigasPorDeporte.pending, (state) => {
                state.isLoadingLigasPorDeporte = true;
                state.loadLigasPorDeporteError = null;
            })
            .addCase(getLigasPorDeporte.fulfilled, (state, action) => {
                state.isLoadingLigasPorDeporte = false;
                state.ligasPorDeporte = action.payload;
                state.loadLigasPorDeporteError = null;
            })
            .addCase(getLigasPorDeporte.rejected, (state, action) => {
                state.isLoadingLigasPorDeporte = false;
                state.loadLigasPorDeporteError = action.payload || 'Error al cargar ligas por deporte';
                state.ligasPorDeporte = [];
            });

        // ========== GET DETALLES DE EVENTO ==========
        builder
            .addCase(getEventoDetail.pending, (state) => {
                state.isLoadingEventoDetail = true;
                state.loadEventoDetailError = null;
            })
            .addCase(getEventoDetail.fulfilled, (state, action) => {
                state.isLoadingEventoDetail = false;
                state.eventoDetail = action.payload;
                state.loadEventoDetailError = null;
            })
            .addCase(getEventoDetail.rejected, (state, action) => {
                state.isLoadingEventoDetail = false;
                state.loadEventoDetailError = action.payload || 'Error al cargar detalles del evento';
                state.eventoDetail = null;
            });
    },
});

// ========== ACTIONS ==========
export const {
    clearLoadEventosEnVivoError,
    clearLoadEventosFuturosPorLigaError,
    clearEventosEnVivo,
    clearEventosData,
    clearLoadLigasPorDeporteError,
    clearLoadEventoDetailError,
    clearLoadEventosError,
} = eventosSlice.actions;

// ========== SELECTORS ==========
export const selectEventosState = (state: RootState) => state.eventos;
// Eventos en vivo
export const selectEventosEnVivo = (state: RootState) => state.eventos?.eventosEnVivo ?? [];
export const selectIsLoadingEventosEnVivo = (state: RootState) => state.eventos?.isLoadingEventosEnVivo ?? false;
export const selectLoadEventosEnVivoError = (state: RootState) => state.eventos?.loadEventosEnVivoError ?? null;
// Eventos futuros por deporte
export const selectEventosFuturosPorDeporte = (state: RootState) => state.eventos?.eventosFuturosPorDeporte ?? [];
export const selectIsLoadingEventosFuturosPorDeporte = (state: RootState) => state.eventos?.isLoadingEventosFuturosPorDeporte ?? false;
export const selectLoadEventosFuturosPorDeporteError = (state: RootState) => state.eventos?.loadEventosFuturosPorDeporteError ?? null;
// Eventos futuros por liga
export const selectEventosFuturosPorLiga = (state: RootState) => state.eventos?.eventosFuturosPorLiga ?? [];
export const selectIsLoadingEventosFuturosPorLiga = (state: RootState) => state.eventos?.isLoadingEventosFuturosPorLiga ?? false;
export const selectLoadEventosFuturosPorLigaError = (state: RootState) => state.eventos?.loadEventosFuturosPorLigaError ?? null;
//Evento detail
export const selectEventoDetail = (state: RootState) => state.eventos?.eventoDetail ?? null;
export const selectIsLoadingEventoDetail = (state: RootState) => state.eventos?.isLoadingEventoDetail ?? false;
export const selectLoadEventoDetailError = (state: RootState) => state.eventos?.loadEventoDetailError ?? null;
// Ligas por deporte
export const selectLigasPorDeporte = (state: RootState) => state.eventos?.ligasPorDeporte ?? [];
export const selectIsLoadingLigasPorDeporte = (state: RootState) => state.eventos?.isLoadingLigasPorDeporte ?? false;
export const selectLoadLigasPorDeporteError = (state: RootState) => state.eventos?.loadLigasPorDeporteError ?? null;

// Última actualización
export const selectUltimaActualizacion = (state: RootState) => state.eventos?.ultimaActualizacion ?? null;

// ========== EXPORT DEFAULT ==========
export default eventosSlice.reducer;
