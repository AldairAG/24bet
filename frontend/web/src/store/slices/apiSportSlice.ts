import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { 
    EventoResponseApi, 
    HeadToHeadResponseApi, 
    StandingsApiResponse 
} from '../../types/sportApiTypes';
import { apiSportService } from '../../service/apiSportService';

// Interfaces para el estado del slice
export interface ApiSportState {
    // Estado para evento individual
    eventoActual: EventoResponseApi | null;
    loadingEvento: boolean;
    errorEvento: string | null;

    // Estado para Head to Head
    historialH2H: HeadToHeadResponseApi[];
    loadingH2H: boolean;
    errorH2H: string | null;

    // Estado para tabla de clasificación
    tablaClasificacion: StandingsApiResponse[];
    loadingTabla: boolean;
    errorTabla: string | null;

    // Estado general
    isLoading: boolean;
    error: string | null;
}

// Estado inicial
const initialState: ApiSportState = {
    eventoActual: null,
    loadingEvento: false,
    errorEvento: null,

    historialH2H: [],
    loadingH2H: false,
    errorH2H: null,

    tablaClasificacion: [],
    loadingTabla: false,
    errorTabla: null,

    isLoading: false,
    error: null,
};

// Async Thunks para las operaciones asíncronas

// Thunk para obtener evento por ID
export const fetchEventoById = createAsyncThunk(
    'apiSport/fetchEventoById',
    async (eventoId: number, { rejectWithValue }) => {
        try {
            const evento = await apiSportService.getEventoById(eventoId);
            if (!evento) {
                throw new Error('Evento no encontrado');
            }
            return evento;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al obtener el evento');
        }
    }
);

// Thunk para obtener historial Head to Head
export const fetchHeadToHead = createAsyncThunk(
    'apiSport/fetchHeadToHead',
    async ({ team1, team2 }: { team1: number; team2: number }, { rejectWithValue }) => {
        try {
            const historial = await apiSportService.getHeadToHead(team1, team2);
            return historial;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al obtener el historial H2H');
        }
    }
);

// Thunk para obtener tabla de clasificación
export const fetchTablaClasificacion = createAsyncThunk(
    'apiSport/fetchTablaClasificacion',
    async ({ leagueId, season = 2025 }: { leagueId: number; season?: number }, { rejectWithValue }) => {
        try {
            const tabla = await apiSportService.getTablaClasificacion(leagueId, season);
            return tabla;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al obtener la tabla de clasificación');
        }
    }
);

// Slice de Redux
const apiSportSlice = createSlice({
    name: 'apiSport',
    initialState,
    reducers: {
        // Limpiar evento actual
        clearEventoActual: (state) => {
            state.eventoActual = null;
            state.errorEvento = null;
        },
        
        // Limpiar historial H2H
        clearHistorialH2H: (state) => {
            state.historialH2H = [];
            state.errorH2H = null;
        },
        
        // Limpiar tabla de clasificación
        clearTablaClasificacion: (state) => {
            state.tablaClasificacion = [];
            state.errorTabla = null;
        },
        
        // Limpiar todos los errores
        clearErrors: (state) => {
            state.error = null;
            state.errorEvento = null;
            state.errorH2H = null;
            state.errorTabla = null;
        },
        
        // Limpiar todo el estado
        clearAll: () => {
            return initialState;
        },
        
        // Establecer error general
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        // Casos para fetchEventoById
        builder
            .addCase(fetchEventoById.pending, (state) => {
                state.loadingEvento = true;
                state.errorEvento = null;
                state.isLoading = true;
            })
            .addCase(fetchEventoById.fulfilled, (state, action) => {
                state.loadingEvento = false;
                state.eventoActual = action.payload;
                state.errorEvento = null;
                state.isLoading = false;
            })
            .addCase(fetchEventoById.rejected, (state, action) => {
                state.loadingEvento = false;
                state.errorEvento = action.payload as string;
                state.eventoActual = null;
                state.isLoading = false;
            });

        // Casos para fetchHeadToHead
        builder
            .addCase(fetchHeadToHead.pending, (state) => {
                state.loadingH2H = true;
                state.errorH2H = null;
                state.isLoading = true;
            })
            .addCase(fetchHeadToHead.fulfilled, (state, action) => {
                state.loadingH2H = false;
                state.historialH2H = action.payload;
                state.errorH2H = null;
                state.isLoading = false;
            })
            .addCase(fetchHeadToHead.rejected, (state, action) => {
                state.loadingH2H = false;
                state.errorH2H = action.payload as string;
                state.historialH2H = [];
                state.isLoading = false;
            });

        // Casos para fetchTablaClasificacion
        builder
            .addCase(fetchTablaClasificacion.pending, (state) => {
                state.loadingTabla = true;
                state.errorTabla = null;
                state.isLoading = true;
            })
            .addCase(fetchTablaClasificacion.fulfilled, (state, action) => {
                state.loadingTabla = false;
                state.tablaClasificacion = action.payload;
                state.errorTabla = null;
                state.isLoading = false;
            })
            .addCase(fetchTablaClasificacion.rejected, (state, action) => {
                state.loadingTabla = false;
                state.errorTabla = action.payload as string;
                state.tablaClasificacion = [];
                state.isLoading = false;
            });
    },
});

// Exportar acciones
export const {
    clearEventoActual,
    clearHistorialH2H,
    clearTablaClasificacion,
    clearErrors,
    clearAll,
    setError,
} = apiSportSlice.actions;

// Selectores
export const selectEventoActual = (state: { apiSport: ApiSportState }) => state.apiSport.eventoActual;
export const selectLoadingEvento = (state: { apiSport: ApiSportState }) => state.apiSport.loadingEvento;
export const selectErrorEvento = (state: { apiSport: ApiSportState }) => state.apiSport.errorEvento;

export const selectHistorialH2H = (state: { apiSport: ApiSportState }) => state.apiSport.historialH2H;
export const selectLoadingH2H = (state: { apiSport: ApiSportState }) => state.apiSport.loadingH2H;
export const selectErrorH2H = (state: { apiSport: ApiSportState }) => state.apiSport.errorH2H;

export const selectTablaClasificacion = (state: { apiSport: ApiSportState }) => state.apiSport.tablaClasificacion;
export const selectLoadingTabla = (state: { apiSport: ApiSportState }) => state.apiSport.loadingTabla;
export const selectErrorTabla = (state: { apiSport: ApiSportState }) => state.apiSport.errorTabla;

export const selectIsLoading = (state: { apiSport: ApiSportState }) => state.apiSport.isLoading;
export const selectError = (state: { apiSport: ApiSportState }) => state.apiSport.error;

// Exportar el reducer
export default apiSportSlice.reducer;
