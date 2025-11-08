import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ApuestaEnBoleto, ApuestaHistorialResponse, CrearApuesta, CrearParlayApuestas, ParlayHistorialResponse } from '../../types/apuestasTypes';
import ApuestaService from '../../service/apuestaService';
/**
 * Estado del slice de apuestas
 */
interface ApuestaState {
    // Boleto/carrito de apuestas
    boleto: ApuestaEnBoleto[];
    // Estados de loading
    loading: {
        obteniendoHistorial: boolean;
        realizandoApuesta: boolean;
        obteniendoHistorialParlays: boolean;
    };
    // Estados de error
    error: {
        obteniendoHistorial: string | null;
        realizandoApuesta: string | null;
        obteniendoHistorialParlays: string | null;
    };
    // Estado de visibilidad del carrito (se muestra automáticamente si hay apuestas)
    carritoVisible: boolean;
    // Totales calculados
    totalApostar: number;
    gananciaPotencial: number;
    // Cálculos de Parlay
    parlayTotal: number;
    parlayGanancia: number;
    esParlayValido: boolean;
    apuestasParlay?: number;
    historialApuestas: ApuestaHistorialResponse[];
    historialParlays: ParlayHistorialResponse[];
}

/**
 * Estado inicial
 */
const initialState: ApuestaState = {
    boleto: [],
    loading: {
        obteniendoHistorial: false,
        realizandoApuesta: false,
        obteniendoHistorialParlays: false,
    },
    error: {
        obteniendoHistorial: null,
        realizandoApuesta: null,
        obteniendoHistorialParlays: null,
    },
    carritoVisible: false,
    totalApostar: 0,
    gananciaPotencial: 0,
    parlayTotal: 0,
    parlayGanancia: 0,
    esParlayValido: false,
    apuestasParlay: 10,
    historialApuestas: [],
    historialParlays: [],
};

/**
 * Thunk para realizar las apuestas del boleto
 */
export const realizarApuestaThunk = createAsyncThunk(
    'apuesta/realizarApuesta',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { apuesta: ApuestaState };
            const boleto = state.apuesta.boleto;

            if (boleto.length === 0) {
                throw new Error('El boleto está vacío');
            }

            // Convertir ApuestaEnBoleto[] a CrearApuesta[]
            const apuestasParaCrear: CrearApuesta[] = boleto.map(apuesta => ({
                id: apuesta.id,
                eventoId: apuesta.eventoId,
                monto: apuesta.monto,
                odd: apuesta.odd,
                tipoApuesta: apuesta.tipoApuesta
            }));

            const resultado = await ApuestaService.crearListaApuestas(apuestasParaCrear);
            return resultado;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al realizar las apuestas';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Thunk para realizar un parlay de apuestas
 */
export const realizarParlayApuestaThunk = createAsyncThunk(
    'apuesta/realizarParlayApuesta',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { apuesta: ApuestaState };
            const boleto = state.apuesta.boleto;
            if (boleto.length === 0) {
                throw new Error('El boleto está vacío');
            }
            // Convertir ApuestaEnBoleto[] a CrearApuesta[]
            const apuestasParaCrear: CrearApuesta[] = boleto.map(apuesta => ({
                id: apuesta.id,
                eventoId: apuesta.eventoId,
                monto: apuesta.monto,
                odd: apuesta.odd,
                tipoApuesta: apuesta.tipoApuesta
            }));

            const parlayApuesta: CrearParlayApuestas = {
                apuestas: apuestasParaCrear,
                montoApostar: state.apuesta.apuestasParlay || 10,
            };

            const resultado = await ApuestaService.crearParlayApuestas(parlayApuesta);
            return resultado;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al realizar el parlay de apuestas';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Thunk para obtener el historial de apuestas
 */
export const obtenerHistorialApuestasThunk = createAsyncThunk(
    'apuesta/obtenerHistorialApuestas',
    async (_, { rejectWithValue }) => {
        try {
            const resultado = await ApuestaService.obtenerHistorialApuestas();
            return resultado.data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al obtener el historial de apuestas';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Thunk para obtener el historial de parlays
 */
export const obtenerHistorialParlaysThunk = createAsyncThunk(
    'apuesta/obtenerHistorialParlays',
    async (_, { rejectWithValue }) => {
        try {
            const resultado = await ApuestaService.obtenerHistorialParlays();
            return resultado.data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al obtener el historial de parlays';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Slice de apuestas
 */
const apuestaSlice = createSlice({
    name: 'apuesta',
    initialState,
    reducers: {
        /**
         * Agregar una apuesta al boleto
         */
        agregarApuesta: (state, action: PayloadAction<ApuestaEnBoleto>) => {
            const nuevaApuesta = action.payload;

            // Verificar si la apuesta ya existe (mismo id y eventoId)
            const existeApuesta = state.boleto.find(
                apuesta => apuesta.id === nuevaApuesta.id && apuesta.eventoId === nuevaApuesta.eventoId
            );

            //verificar si ya existe otra apuesta del mismo evento
            const existeApuestaEvento = state.boleto.find(
                apuesta => apuesta.eventoId === nuevaApuesta.eventoId
            );

            if (existeApuestaEvento) {
                //si la apuesta no es valida para parlay, hace a todas las demas apuestas del mismo evento invalidas para parlay
                // Marcar apuestas del mismo evento como inválidas para parlay
                state.boleto.forEach(apuesta => {
                    if (apuesta.eventoId === nuevaApuesta.eventoId) {
                        apuesta.validaParaParlay = false;
                    }
                });
                nuevaApuesta.validaParaParlay = false;
            } else {
                // Si no existe una apuesta del mismo evento, agregarla normalmente y hace a todas las demas apuestas del mismo evento validas para parlay
                state.boleto = state.boleto.map(apuesta => {
                    if (apuesta.eventoId === nuevaApuesta.eventoId) {
                        return { ...apuesta, validaParaParlay: true };
                    }
                    return apuesta;
                });
            }

            if (!existeApuesta?.id) {
                state.boleto.push(nuevaApuesta);
                // Mostrar carrito automáticamente cuando hay al menos 1 apuesta
                state.carritoVisible = true;
                // Recalcular totales
                apuestaSlice.caseReducers.calcularTotales(state);
            }
        },

        /**
         * Eliminar una apuesta del boleto
         */
        eliminarApuesta: (state, action: PayloadAction<{ id: number; eventoId: number }>) => {
            const { id, eventoId } = action.payload;

            state.boleto = state.boleto.filter(
                apuesta => !(apuesta.id === id && apuesta.eventoId === eventoId)
            );

            // Ocultar carrito si no hay apuestas
            if (state.boleto.length === 0) {
                state.carritoVisible = false;
            }

            // Restaurar validez para parlay de otras apuestas del mismo evento devolviendo un entero 
            const hayOtraApuestaMismoEvento = state.boleto.filter(
                apuesta => apuesta.eventoId === eventoId
            ).length;

            if (hayOtraApuestaMismoEvento === 1) {
                state.boleto = state.boleto.map(apuesta => ({
                    ...apuesta,
                    validaParaParlay: true,
                }));
            }

            // Recalcular totales
            apuestaSlice.caseReducers.calcularTotales(state);
        },

        /**
         * Editar el monto de un parlay
         */
        editarMontoParlay: (state, action: PayloadAction<{ nuevoMonto: number }>) => {
            const { nuevoMonto } = action.payload;

            // Validar que el monto sea positivo
            if (nuevoMonto <= 0) {
                return;
            }
            state.apuestasParlay = nuevoMonto;
            // Recalcular totales
            apuestaSlice.caseReducers.calcularTotales(state);
        },


        /**
         * Editar el monto de una apuesta específica
         */
        editarMonto: (state, action: PayloadAction<{ id: number; eventoId: number; nuevoMonto: number }>) => {
            const { id, eventoId, nuevoMonto } = action.payload;

            // Validar que el monto sea positivo
            if (nuevoMonto <= 0) {
                return;
            }

            const apuesta = state.boleto.find(
                apuesta => apuesta.id === id && apuesta.eventoId === eventoId
            );

            if (apuesta) {
                apuesta.monto = nuevoMonto;
                // Recalcular totales
                apuestaSlice.caseReducers.calcularTotales(state);
            }
        },

        /**
         * Limpiar todo el boleto
         */
        limpiarTodo: (state) => {
            state.boleto = [];
            state.carritoVisible = false;
            state.totalApostar = 0;
            state.gananciaPotencial = 0;
            state.parlayTotal = 0;
            state.parlayGanancia = 0;
            state.esParlayValido = false;
            state.error.realizandoApuesta = null;
        },

        /**
         * Calcular totales (función auxiliar)
         */
        calcularTotales: (state) => {
            state.totalApostar = state.boleto.reduce((total, apuesta) => total + apuesta.monto, 0);
            state.gananciaPotencial = state.boleto.reduce(
                (total, apuesta) => total + (apuesta.monto * apuesta.odd),
                0
            );

            // Parlay se activa con 2 o más apuestas diferentes (independiente del evento para testing)
            state.esParlayValido = state.boleto.length >= 2;

            if (state.esParlayValido) {

                const montoBase = state.apuestasParlay && state.apuestasParlay > 0 ? state.apuestasParlay : state.totalApostar;
                const cuotaCombinada = state.boleto.reduce((cuota, apuesta) => cuota * apuesta.odd, 1);

                //state.parlayTotal = montoBase;
                state.parlayGanancia = montoBase * cuotaCombinada;

            } else {
                state.parlayTotal = 0;
                state.parlayGanancia = 0;
                console.log('❌ Parlay no válido - Requiere al menos 2 apuestas');
            }
        },

        /**
         * Alternar visibilidad del carrito
         */
        toggleCarritoVisible: (state) => {
            state.carritoVisible = !state.carritoVisible;
        },

        /**
         * Establecer visibilidad del carrito
         */
        setCarritoVisible: (state, action: PayloadAction<boolean>) => {
            state.carritoVisible = action.payload;
        },

        /**
         * Limpiar errores
         */
        limpiarErrores: (state) => {
            state.error.realizandoApuesta = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Realizar apuesta - pending
            .addCase(realizarApuestaThunk.pending, (state) => {
                state.loading.realizandoApuesta = true;
                state.error.realizandoApuesta = null;
            })
            // Realizar apuesta - fulfilled
            .addCase(realizarApuestaThunk.fulfilled, (state) => {
                state.loading.realizandoApuesta = false;
                state.error.realizandoApuesta = null;
                // Limpiar el boleto después de realizar las apuestas exitosamente
                state.boleto = [];
                state.carritoVisible = false;
                state.totalApostar = 0;
                state.gananciaPotencial = 0;
                state.parlayTotal = 0;
                state.parlayGanancia = 0;
                state.esParlayValido = false;
            })
            // Realizar apuesta - rejected
            .addCase(realizarApuestaThunk.rejected, (state, action) => {
                state.loading.realizandoApuesta = false;
                state.error.realizandoApuesta = action.payload as string;
            });
        builder
            .addCase(realizarParlayApuestaThunk.pending, (state) => {
                state.loading.realizandoApuesta = true;
                state.error.realizandoApuesta = null;
            })
            .addCase(realizarParlayApuestaThunk.fulfilled, (state) => {
                state.loading.realizandoApuesta = false;
                state.error.realizandoApuesta = null;
                // Limpiar el boleto después de realizar las apuestas exitosamente
                state.boleto = [];
                state.carritoVisible = false;
                state.totalApostar = 0;
                state.gananciaPotencial = 0;
                state.parlayTotal = 0;
                state.parlayGanancia = 0;
                state.esParlayValido = false;
            })
            .addCase(realizarParlayApuestaThunk.rejected, (state, action) => {
                state.loading.realizandoApuesta = false;
                state.error.realizandoApuesta = action.payload as string;
            });
        builder
            .addCase(obtenerHistorialApuestasThunk.pending, (state) => {
                state.loading.obteniendoHistorial = true;
            })
            .addCase(obtenerHistorialApuestasThunk.fulfilled, (state, action) => {
                state.loading.obteniendoHistorial = false;
                state.historialApuestas = action.payload;
            })
            .addCase(obtenerHistorialApuestasThunk.rejected, (state, action) => {
                state.loading.obteniendoHistorial = false;
                state.error.obteniendoHistorial = action.payload as string;
            });
        builder
            .addCase(obtenerHistorialParlaysThunk.pending, (state) => {
                state.loading.obteniendoHistorialParlays = true;
            })
            .addCase(obtenerHistorialParlaysThunk.fulfilled, (state, action) => {
                state.loading.obteniendoHistorialParlays = false;
                state.error.obteniendoHistorialParlays = null;
                state.historialParlays = Object.values(action.payload);
            })
            .addCase(obtenerHistorialParlaysThunk.rejected, (state, action) => {
                state.loading.obteniendoHistorialParlays = false;
                state.error.obteniendoHistorialParlays = action.payload as string;
            });
    }
});

// Exportar acciones
export const {
    agregarApuesta,
    eliminarApuesta,
    editarMonto,
    limpiarTodo,
    calcularTotales,
    toggleCarritoVisible,
    setCarritoVisible,
    limpiarErrores,
    editarMontoParlay,
} = apuestaSlice.actions;

// Selectores
export const selectBoleto = (state: { apuesta: ApuestaState }) => state.apuesta.boleto;
export const selectCarritoVisible = (state: { apuesta: ApuestaState }) => state.apuesta.carritoVisible;
export const selectTotalApostar = (state: { apuesta: ApuestaState }) => state.apuesta.totalApostar;
export const selectGananciaPotencial = (state: { apuesta: ApuestaState }) => state.apuesta.gananciaPotencial;
export const selectIsRealizandoApuesta = (state: { apuesta: ApuestaState }) => state.apuesta.loading.realizandoApuesta;
export const selectErrorRealizandoApuesta = (state: { apuesta: ApuestaState }) => state.apuesta.error.realizandoApuesta;
export const selectCantidadApuestas = (state: { apuesta: ApuestaState }) => state.apuesta.boleto.length;
export const selectApuestasParlay = (state: { apuesta: ApuestaState }) => state.apuesta.apuestasParlay;
export const selectHistorialApuestas = (state: { apuesta: ApuestaState }) => state.apuesta.historialApuestas;
export const selectIsObteniendoHistorial = (state: { apuesta: ApuestaState }) => state.apuesta.loading.obteniendoHistorial;
export const selectErrorObteniendoHistorial = (state: { apuesta: ApuestaState }) => state.apuesta.error.obteniendoHistorial;
export const selectHistorialParlays = (state: { apuesta: ApuestaState }) => state.apuesta.historialParlays;
export const selectIsObteniendoHistorialParlays = (state: { apuesta: ApuestaState }) => state.apuesta.loading.obteniendoHistorialParlays;
export const selectErrorObteniendoHistorialParlays = (state: { apuesta: ApuestaState }) => state.apuesta.error.obteniendoHistorialParlays;

// Selectores avanzados
export const selectApuestaPorId = (state: { apuesta: ApuestaState }, id: number, eventoId: number) =>
    state.apuesta.boleto.find(apuesta => apuesta.id === id && apuesta.eventoId === eventoId);

export const selectHayApuestas = (state: { apuesta: ApuestaState }) => state.apuesta.boleto.length > 0;

// Selectores de Parlay
export const selectParlayTotal = (state: { apuesta: ApuestaState }) => state.apuesta.parlayTotal;
export const selectParlayGanancia = (state: { apuesta: ApuestaState }) => state.apuesta.parlayGanancia;
export const selectEsParlayValido = (state: { apuesta: ApuestaState }) => state.apuesta.esParlayValido;

// Exportar reducer
export default apuestaSlice.reducer;
