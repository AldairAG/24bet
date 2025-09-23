import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EventoDeportivoResponse, EventosEnVivoResponse, LigaPorDeporteResponse } from '../../types/EventosType';
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
    eventosEnVivo: EventosEnVivoResponse;
    eventosFuturos: EventosEnVivoResponse;
    ligasPorDeporte: LigaPorDeporteResponse[];
    eventoDetail: EventoDeportivoResponse | null;
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
    LigaPorDeporteResponse[], // Tipo de retorno
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
 * Thunk para cargar eventos futuros
 */
export const getEventosFuturos = createAsyncThunk<
    EventosEnVivoResponse, // Tipo de datos de retorno
    void, // Tipo de parámetro de entrada
    { rejectValue: string } // Tipo de error
>(
    'eventos/getEventosFuturos',
    async (_, { rejectWithValue }) => {
        try {
            return await eventosService.getEventosFuturos();
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
        }
    }
);

/**
 * Thunk para cargar eventos en vivo
 */
export const getEventosEnVivo = createAsyncThunk<
    EventosEnVivoResponse, // Tipo de retorno
    void, // Sin parámetros
    { rejectValue: string } // Tipo del error
>(
    'eventos/getEventosEnVivo',
    async (_, { rejectWithValue }) => {
        try {
            const eventos = await eventosService.getEventosEnVivo();
            return eventos;
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

        // ========== ACCIONES DE ACTUALIZACIÓN LOCAL ==========

        /**
         * Actualiza un evento específico en el estado local
         */
        updateEventoEnVivo: (state, action: PayloadAction<EventoDeportivoResponse>) => {
            const eventoActualizado = action.payload;
            const index = state.eventosEnVivo.findIndex(evento => evento.id === eventoActualizado.id);

            if (index !== -1) {
                state.eventosEnVivo[index] = eventoActualizado;
                state.ultimaActualizacion = new Date().toISOString();
            }
        },

        /**
         * Actualiza el resultado de un evento
         */
        updateResultadoEvento: (state, action: PayloadAction<{
            eventoId: number;
            resultadoLocal: number;
            resultadoVisitante: number;
            tiempoPartido?: string;
        }>) => {
            const { eventoId, resultadoLocal, resultadoVisitante, tiempoPartido } = action.payload;
            const evento = state.eventosEnVivo.find(e => e.id === eventoId);

            if (evento) {
                evento.resultadoLocal = resultadoLocal;
                evento.resultadoVisitante = resultadoVisitante;
                if (tiempoPartido) {
                    evento.tiempoPartido = tiempoPartido;
                }
                state.ultimaActualizacion = new Date().toISOString();
            }
        },
    },
    extraReducers: (builder) => {
        // ========== GET EVENTOS EN VIVO ==========
        builder
            .addCase(getEventosEnVivo.pending, (state) => {
                console.log('⏳ Cargando eventos en vivo...');
                state.isLoadingEventosEnVivo = true;
                state.loadEventosEnVivoError = null;
            })
            .addCase(getEventosEnVivo.fulfilled, (state, action) => {
                console.log('✅ Eventos cargados exitosamente:', action.payload);
                console.log('✅ Cantidad de eventos en reducer:', action.payload?.length || 0);
                state.isLoadingEventosEnVivo = false;
                state.eventosEnVivo = action.payload;
                state.loadEventosEnVivoError = null;
                state.ultimaActualizacion = new Date().toISOString();
            })
            .addCase(getEventosEnVivo.rejected, (state, action) => {
                console.error('❌ Error al cargar eventos:', action.payload);
                state.isLoadingEventosEnVivo = false;
                state.loadEventosEnVivoError = action.payload || 'Error al cargar eventos en vivo';
                state.eventosEnVivo = [];
            });
        
        // ========== GET EVENTOS FUTUROS ==========
        builder
            .addCase(getEventosFuturos.pending, (state) => {
                console.log('⏳ Cargando eventos futuros...');
                state.isLoadingEventosFuturos = true;
                state.loadEventosFuturosError = null;
            })
            .addCase(getEventosFuturos.fulfilled, (state, action) => {
                console.log('✅ Eventos futuros cargados exitosamente:', action.payload);
                console.log('✅ Cantidad de eventos futuros en reducer:', action.payload?.length || 0);
                state.isLoadingEventosFuturos = false;
                state.eventosFuturos = action.payload;
                state.loadEventosFuturosError = null;
                state.ultimaActualizacion = new Date().toISOString();
            })
            .addCase(getEventosFuturos.rejected, (state, action) => {
                console.error('❌ Error al cargar eventos futuros:', action.payload);
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
    updateEventoEnVivo,
    updateResultadoEvento,
    clearLoadLigasPorDeporteError,
    clearLoadEventoDetailError,
    clearLoadEventosError
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

// ========== SELECTORS COMBINADOS ==========

/**
 * Selector para obtener eventos filtrados y ordenados
 */
export const selectEventosEnVivoFiltrados = (state: RootState): EventosEnVivoResponse => {
    const { eventosEnVivo, filtros, ordenamiento } = state.eventos;

    // Verificación de seguridad: asegurarse de que eventosEnVivo sea un array
    if (!Array.isArray(eventosEnVivo)) {
        console.log('🚨 eventosEnVivo no es un array:', eventosEnVivo);
        return [];
    }

    console.log('🔍 Selector - eventosEnVivo original:', eventosEnVivo);
    console.log('🔍 Selector - cantidad de eventos:', eventosEnVivo.length);

    // Debug: Analizar el primer evento para ver su estructura
    if (eventosEnVivo.length > 0) {
        const primerEvento = eventosEnVivo[0];
        console.log('🔍 Selector - Primer evento estructura:', {
            id: primerEvento.id,
            nombre: primerEvento.nombre,
            enVivo: primerEvento.enVivo,
            activo: primerEvento.activo,
            estado: primerEvento.estado,
            fechaEvento: primerEvento.fechaEvento
        });
    }

    let eventosFiltrados = [...eventosEnVivo];

    // Aplicar filtros
    if (filtros.deporte) {
        eventosFiltrados = eventosService.filterEventosByDeporte(eventosFiltrados, filtros.deporte);
    }

    if (filtros.pais) {
        eventosFiltrados = eventosService.filterEventosByPais(eventosFiltrados, filtros.pais);
    }

    if (filtros.terminoBusqueda) {
        eventosFiltrados = eventosService.searchEventos(eventosFiltrados, filtros.terminoBusqueda);
    }

    // Aplicar ordenamiento
    if (ordenamiento.campo === 'fecha') {
        eventosFiltrados = eventosService.sortEventosByFecha(eventosFiltrados, ordenamiento.direccion);
    } else if (ordenamiento.campo === 'nombre') {
        eventosFiltrados = eventosFiltrados.sort((a, b) => {
            const nombreA = a.nombre.toLowerCase();
            const nombreB = b.nombre.toLowerCase();

            if (ordenamiento.direccion === 'asc') {
                return nombreA.localeCompare(nombreB);
            } else {
                return nombreB.localeCompare(nombreA);
            }
        });
    }

    console.log('🔍 Selector - eventosFiltrados finales:', eventosFiltrados);
    console.log('🔍 Selector - cantidad final:', eventosFiltrados.length);

    return eventosFiltrados;
};

/**
 * Selector para obtener eventos agrupados por liga
 */
export const selectEventosEnVivoPorLiga = (state: RootState): Map<string, EventosEnVivoResponse> => {
    const eventosFiltrados = selectEventosEnVivoFiltrados(state);
    if (!Array.isArray(eventosFiltrados)) {
        return new Map();
    }
    return eventosService.groupEventosByLiga(eventosFiltrados);
};

/**
 * Selector para obtener estadísticas de eventos en vivo
 */
export const selectEventosEnVivoStats = (state: RootState) => {
    const eventos = state.eventos.eventosEnVivo;

    // Verificación de seguridad
    if (!Array.isArray(eventos)) {
        return {
            totalEventos: 0,
            eventosPorDeporte: {},
            eventosPorPais: {},
            eventosPorLiga: {},
            eventosEnVivo: 0,
            eventosProximos: 0,
            eventosFinalizados: 0
        };
    }

    const totalEventos = eventos.length;
    const eventosPorDeporte = eventos.reduce((acc, evento) => {
        const deporte = evento.liga.deporte;
        acc[deporte] = (acc[deporte] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const eventosPorPais = eventos.reduce((acc, evento) => {
        const pais = evento.pais || evento.liga.pais || 'Sin país';
        acc[pais] = (acc[pais] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return {
        totalEventos,
        eventosPorDeporte,
        eventosPorPais,
    };
};

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
