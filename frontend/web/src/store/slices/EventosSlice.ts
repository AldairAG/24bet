import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Evento, EventoDeportivoResponse, EventosPorLigaResponse, LigaPorDeporteDetalleResponse } from '../../types/EventosType';
import { eventosService } from '../../service/EventosService';
import type { RootState } from '../index';

// ========== ESTADO INICIAL ==========
export interface EventosState {
    // Estados de carga
    isLoadingEventos: boolean;
    isLoadingLigasPorDeporte: boolean;
    isLoadingEventoDetail: boolean;
    isLoadingEventosEnVivo: boolean;
    isLoadingEventosFuturos: boolean;

    // Datos
    eventosEnVivo: Evento[];
    eventosFuturos: EventosPorLigaResponse[];
    ligasPorDeporte: LigaPorDeporteDetalleResponse[];
    eventoDetail: Evento | null;
    eventos: EventoDeportivoResponse[];

    // Errores
    loadEventosEnVivoError: string | null;
    loadEventosFuturosError: string | null;
    loadLigasPorDeporteError: string | null;
    loadEventoDetailError: string | null;
    loadEventosError: string | null;

    // Estados de filtrado y búsqueda
    filtros: {
        deporte?: string;
        pais?: string;
        terminoBusqueda?: string;
    };

    // Configuración de ordenamiento
    ordenamiento: {
        campo: 'fecha' | 'nombre';
        direccion: 'asc' | 'desc';
    };

    // Última actualización
    ultimaActualizacion: string | null;

}

const initialState: EventosState = {
    // Estados de carga
    isLoadingEventos: false,
    isLoadingEventosEnVivo: false,
    isLoadingEventosFuturos: false,
    isLoadingLigasPorDeporte: false,
    isLoadingEventoDetail: false,


    // Datos
    eventosEnVivo: [],
    eventosFuturos: [],
    ligasPorDeporte: [],
    eventoDetail: null,
    eventos: [],

    // Errores
    loadEventosEnVivoError: null,
    loadEventosFuturosError: null,
    loadLigasPorDeporteError: null,
    loadEventoDetailError: null,
    loadEventosError: null,

    // Estados de filtrado y búsqueda
    filtros: {},
    ordenamiento: {
        campo: 'fecha',
        direccion: 'asc',
    },
    ultimaActualizacion: null,
};

// ========== THUNKS ASÍNCRONOS ==========

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

/**
 * Thunk para cargar eventos futuros
 */
export const getEventosFuturos = createAsyncThunk<
    EventosPorLigaResponse[], // Tipo de datos de retorno
    string, // Tipo de parámetro de entrada
    { rejectValue: string } // Tipo de error
>(
    'eventos/getEventosFuturos',
    async (ligaNombre, { rejectWithValue }) => {
        try {
            return await eventosService.getEventosFuturos(ligaNombre);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
        }
    }
);

/**
 * Thunk para cargar eventos en vivo por deporte
 * @param {string} deporte Deporte para filtrar eventos
 * @return {Promise<EventosEnVivoResponse[]>} Lista de eventos en vivo
 */
export const getEventosEnVivoPorDeporte = createAsyncThunk<
    Evento[], // Tipo de retorno: array
    string, // Parámetro: deporte
    { rejectValue: string } // Tipo del error
>(
    'eventos/getEventosEnVivo',
    async (deporte, { rejectWithValue }) => {
        try {
            const eventos = await eventosService.getEventosEnVivoPorDeporte(deporte);
            return eventos.data;
        } catch (error) {
            console.error('❌ Error en thunk:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar eventos en vivo';
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
        clearLoadEventosFuturosError: (state) => {
            state.loadEventosFuturosError = null;
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
            state.loadEventosError = null;
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
            state.filtros = {};
            state.ultimaActualizacion = null;
        },

        // ========== ACCIONES DE FILTRADO ==========

        /**
         * Establece filtro por deporte
         */
        setFiltroDeporte: (state, action: PayloadAction<string | undefined>) => {
            state.filtros.deporte = action.payload;
        },

        /**
         * Establece filtro por país
         */
        setFiltroPais: (state, action: PayloadAction<string | undefined>) => {
            state.filtros.pais = action.payload;
        },

        /**
         * Establece término de búsqueda
         */
        setTerminoBusqueda: (state, action: PayloadAction<string | undefined>) => {
            state.filtros.terminoBusqueda = action.payload;
        },

        /**
         * Limpia todos los filtros
         */
        clearFiltros: (state) => {
            state.filtros = {};
        },

        // ========== ACCIONES DE ORDENAMIENTO ==========

        /**
         * Establece el ordenamiento
         */
        setOrdenamiento: (state, action: PayloadAction<{ campo: 'fecha' | 'nombre'; direccion: 'asc' | 'desc' }>) => {
            state.ordenamiento = action.payload;
        },

        /**
         * Cambia la dirección del ordenamiento actual
         */
        toggleDireccionOrdenamiento: (state) => {
            state.ordenamiento.direccion = state.ordenamiento.direccion === 'asc' ? 'desc' : 'asc';
        },

    },
    extraReducers: (builder) => {
        // ========== GET EVENTOS EN VIVO ==========
        builder
            .addCase(getEventosEnVivoPorDeporte.pending, (state) => {
                console.log('⏳ Cargando eventos en vivo...');
                state.isLoadingEventosEnVivo = true;
                state.loadEventosEnVivoError = null;
            })
            .addCase(getEventosEnVivoPorDeporte.fulfilled, (state, action) => {
                console.log('✅ Eventos cargados exitosamente:', action.payload);
                console.log('✅ Cantidad de eventos en reducer:', action.payload?.length || 0);
                state.isLoadingEventosEnVivo = false;
                state.eventosEnVivo = action.payload;
                state.loadEventosEnVivoError = null;
                state.ultimaActualizacion = new Date().toISOString();
            })
            .addCase(getEventosEnVivoPorDeporte.rejected, (state, action) => {
                console.error('❌ Error al cargar eventos:', action.payload);
                state.isLoadingEventosEnVivo = false;
                state.loadEventosEnVivoError = action.payload || 'Error al cargar eventos en vivo';
                state.eventosEnVivo = [];
            });

        // ========== GET EVENTOS FUTUROS ==========
        builder
            .addCase(getEventosFuturos.pending, (state) => {
                state.isLoadingEventosFuturos = true;
                state.loadEventosFuturosError = null;
            })
            .addCase(getEventosFuturos.fulfilled, (state, action) => {
                state.isLoadingEventosFuturos = false;
                state.eventosFuturos = action.payload;
                state.loadEventosFuturosError = null;
                state.ultimaActualizacion = new Date().toISOString();
            })
            .addCase(getEventosFuturos.rejected, (state, action) => {
                state.isLoadingEventosFuturos = false;
                state.loadEventosFuturosError = action.payload || 'Error al cargar eventos futuros';
                state.eventosFuturos = [];
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
    clearLoadEventosFuturosError,
    clearEventosEnVivo,
    clearEventosData,
    setFiltroDeporte,
    setFiltroPais,
    setTerminoBusqueda,
    clearFiltros,
    setOrdenamiento,
    toggleDireccionOrdenamiento,
    clearLoadLigasPorDeporteError,
    clearLoadEventoDetailError,
    clearLoadEventosError,
} = eventosSlice.actions;

// ========== SELECTORS ==========
export const selectEventosState = (state: RootState) => state.eventos;
export const selectIsLoadingEventosEnVivo = (state: RootState) => state.eventos?.isLoadingEventosEnVivo ?? false;
export const selectEventosEnVivo = (state: RootState) => state.eventos?.eventosEnVivo ?? [];
export const selectLoadEventosEnVivoError = (state: RootState) => state.eventos?.loadEventosEnVivoError ?? null;
export const selectIsLoadingEventosFuturos = (state: RootState) => state.eventos?.isLoadingEventosFuturos ?? false;
export const selectEventosFuturos = (state: RootState) => state.eventos?.eventosFuturos ?? [];
export const selectLoadEventosFuturosError = (state: RootState) => state.eventos?.loadEventosFuturosError ?? null;
export const selectFiltros = (state: RootState) => state.eventos?.filtros ?? {};
export const selectOrdenamiento = (state: RootState) => state.eventos?.ordenamiento ?? { campo: 'fecha' as const, direccion: 'asc' as const };
export const selectUltimaActualizacion = (state: RootState) => state.eventos?.ultimaActualizacion ?? null;
export const selectLigasPorDeporte = (state: RootState) => state.eventos?.ligasPorDeporte ?? [];
export const selectIsLoadingLigasPorDeporte = (state: RootState) => state.eventos?.isLoadingLigasPorDeporte ?? false;
export const selectLoadLigasPorDeporteError = (state: RootState) => state.eventos?.loadLigasPorDeporteError ?? null;
export const selectEventoDetail = (state: RootState) => state.eventos?.eventoDetail ?? null;
export const selectIsLoadingEventoDetail = (state: RootState) => state.eventos?.isLoadingEventoDetail ?? false;
export const selectLoadEventoDetailError = (state: RootState) => state.eventos?.loadEventoDetailError ?? null;
export const selectEventos = (state: RootState) => state.eventos?.eventos ?? [];

/**
 * Selector para verificar si hay errores activos
 */
export const selectEventosErrors = (state: RootState) => ({
    loadError: state.eventos?.loadEventosEnVivoError ?? null,
    hasErrors: !!(state.eventos?.loadEventosEnVivoError),
});

/**
 * Selector para estados de carga
 */
export const selectEventosLoading = (state: RootState) => ({
    isLoadingEventosEnVivo: state.eventos?.isLoadingEventosEnVivo ?? false,
    isLoading: state.eventos?.isLoadingEventosEnVivo ?? false,
});

// ========== FUNCIONES AUXILIARES ==========

/**
 * Obtiene el nombre formateado de un evento
 */
export const getEventoNombreFormateado = (evento: EventoDeportivoResponse): string => {
    if (evento.equipoLocal && evento.equipoVisitante) {
        return `${evento.equipoLocal.nombre} vs ${evento.equipoVisitante.nombre}`;
    }
    return evento.nombre; // Usar el nombre del evento si no hay equipos
};

/**
 * Obtiene el resultado formateado de un evento
 */
export const getEventoResultadoFormateado = (evento: EventoDeportivoResponse): string => {
    return eventosService.formatResultado(evento);
};

/**
 * Obtiene el tiempo formateado de un evento
 */
export const getEventoTiempoFormateado = (evento: EventoDeportivoResponse): string => {
    return eventosService.formatTiempoPartido(evento.tiempoPartido);
};

// ========== EXPORT DEFAULT ==========
export default eventosSlice.reducer;
