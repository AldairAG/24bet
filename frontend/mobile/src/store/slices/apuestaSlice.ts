import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApuestaEnBoleto, CrearApuesta } from '../../types/apuestasTypes';
import { apuestaService } from '../../service/apuestaService';
import { ApiResponseWrapper } from '../../types/authTypes';

/**
 * Estado del slice de apuestas
 */
interface ApuestaState {
    // Boleto/carrito de apuestas
    boleto: ApuestaEnBoleto[];
    // Estados de loading
    loading: {
        realizandoApuesta: boolean;
    };
    // Estados de error
    error: {
        realizandoApuesta: string | null;
    };
    // Estado de visibilidad del carrito (se muestra automáticamente si hay apuestas)
    carritoVisible: boolean;
    // Totales calculados
    totalApostar: number;
    gananciaPotencial: number;
}

/**
 * Estado inicial
 */
const initialState: ApuestaState = {
    boleto: [],
    loading: {
        realizandoApuesta: false,
    },
    error: {
        realizandoApuesta: null,
    },
    carritoVisible: false,
    totalApostar: 0,
    gananciaPotencial: 0,
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
            
            const resultado = await apuestaService.crearListaApuestas(apuestasParaCrear);
            return resultado;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al realizar las apuestas');
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
            
            if (!existeApuesta?.id ) {
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
            .addCase(realizarApuestaThunk.fulfilled, (state, action) => {
                state.loading.realizandoApuesta = false;
                state.error.realizandoApuesta = null;
                // Limpiar el boleto después de realizar las apuestas exitosamente
                state.boleto = [];
                state.carritoVisible = false;
                state.totalApostar = 0;
                state.gananciaPotencial = 0;
            })
            // Realizar apuesta - rejected
            .addCase(realizarApuestaThunk.rejected, (state, action) => {
                state.loading.realizandoApuesta = false;
                state.error.realizandoApuesta = action.payload as string;
            });
    },
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
} = apuestaSlice.actions;

// Selectores
export const selectBoleto = (state: { apuesta: ApuestaState }) => state.apuesta.boleto;
export const selectCarritoVisible = (state: { apuesta: ApuestaState }) => state.apuesta.carritoVisible;
export const selectTotalApostar = (state: { apuesta: ApuestaState }) => state.apuesta.totalApostar;
export const selectGananciaPotencial = (state: { apuesta: ApuestaState }) => state.apuesta.gananciaPotencial;
export const selectIsRealizandoApuesta = (state: { apuesta: ApuestaState }) => state.apuesta.loading.realizandoApuesta;
export const selectErrorRealizandoApuesta = (state: { apuesta: ApuestaState }) => state.apuesta.error.realizandoApuesta;
export const selectCantidadApuestas = (state: { apuesta: ApuestaState }) => state.apuesta.boleto.length;

// Selectores avanzados
export const selectApuestaPorId = (state: { apuesta: ApuestaState }, id: number, eventoId: number) => 
    state.apuesta.boleto.find(apuesta => apuesta.id === id && apuesta.eventoId === eventoId);

export const selectHayApuestas = (state: { apuesta: ApuestaState }) => state.apuesta.boleto.length > 0;

// Exportar reducer
export default apuestaSlice.reducer;
