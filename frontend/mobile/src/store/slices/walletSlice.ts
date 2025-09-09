import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CreateCryptoWalletDto, TipoCrypto, CryptoWalletDto } from '../../types/walletTypes';
import { walletService } from '../../service/walletService';

// ========== ESTADO INICIAL ==========
interface WalletState {
    // Estados de carga
    isCreatingWallet: boolean;
    
    // Datos
    createdWallet: CryptoWalletDto | null;
    availableCryptoTypes: TipoCrypto[];
    
    // Errores
    createWalletError: string | null;
    
    // Estados de validación
    validationError: string | null;
}

const initialState: WalletState = {
    isCreatingWallet: false,
    createdWallet: null,
    availableCryptoTypes: [],
    createWalletError: null,
    validationError: null,
};

// ========== THUNKS ASÍNCRONOS ==========

/**
 * Thunk para crear un nuevo wallet crypto
 */
export const createCryptoWallet = createAsyncThunk<
    CryptoWalletDto, // Tipo de retorno
    { usuarioId: number; walletData: CreateCryptoWalletDto }, // Tipo de parámetros
    { rejectValue: string } // Tipo del error
>(
    'wallet/createCryptoWallet',
    async ({ usuarioId, walletData }, { rejectWithValue }) => {
        try {
            // Validar datos antes de enviar
            walletService.validateCreateWalletData(walletData);
            
            // Crear el wallet
            const createdWallet = await walletService.createWallet(usuarioId, walletData);
            
            return createdWallet;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear wallet';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Thunk para cargar los tipos de criptomonedas disponibles
 */
export const loadAvailableCryptoTypes = createAsyncThunk<
    TipoCrypto[], // Tipo de retorno
    void, // Sin parámetros
    { rejectValue: string } // Tipo del error
>(
    'wallet/loadAvailableCryptoTypes',
    async (_, { rejectWithValue }) => {
        try {
            const cryptoTypes = walletService.getTiposCrypto();
            return cryptoTypes;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar tipos de criptomonedas';
            return rejectWithValue(errorMessage);
        }
    }
);

// ========== SLICE ==========
const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        // Limpiar errores
        clearCreateWalletError: (state) => {
            state.createWalletError = null;
        },
        
        clearValidationError: (state) => {
            state.validationError = null;
        },
        
        // Limpiar wallet creado
        clearCreatedWallet: (state) => {
            state.createdWallet = null;
        },
        
        // Limpiar todos los datos del wallet
        clearWalletData: (state) => {
            state.createdWallet = null;
            state.createWalletError = null;
            state.validationError = null;
        },
        
        // Establecer error de validación manualmente
        setValidationError: (state, action: PayloadAction<string>) => {
            state.validationError = action.payload;
        },
    },
    extraReducers: (builder) => {
        // ========== CREATE CRYPTO WALLET ==========
        builder
            .addCase(createCryptoWallet.pending, (state) => {
                state.isCreatingWallet = true;
                state.createWalletError = null;
                state.validationError = null;
            })
            .addCase(createCryptoWallet.fulfilled, (state, action) => {
                state.isCreatingWallet = false;
                state.createdWallet = action.payload;
                state.createWalletError = null;
                state.validationError = null;
            })
            .addCase(createCryptoWallet.rejected, (state, action) => {
                state.isCreatingWallet = false;
                state.createWalletError = action.payload || 'Error al crear wallet';
                state.createdWallet = null;
            });

        // ========== LOAD AVAILABLE CRYPTO TYPES ==========
        builder
            .addCase(loadAvailableCryptoTypes.fulfilled, (state, action) => {
                state.availableCryptoTypes = action.payload;
            })
            .addCase(loadAvailableCryptoTypes.rejected, (state, action) => {
                // En caso de error, usar los tipos por defecto
                state.availableCryptoTypes = Object.values(TipoCrypto);
            });
    },
});

// ========== EXPORTS ==========

// Actions
export const {
    clearCreateWalletError,
    clearValidationError,
    clearCreatedWallet,
    clearWalletData,
    setValidationError,
} = walletSlice.actions;

// Selectors
export const selectWalletState = (state: { wallet: WalletState }) => state.wallet;
export const selectIsCreatingWallet = (state: { wallet: WalletState }) => state.wallet.isCreatingWallet;
export const selectCreatedWallet = (state: { wallet: WalletState }) => state.wallet.createdWallet;
export const selectCreateWalletError = (state: { wallet: WalletState }) => state.wallet.createWalletError;
export const selectValidationError = (state: { wallet: WalletState }) => state.wallet.validationError;
export const selectAvailableCryptoTypes = (state: { wallet: WalletState }) => state.wallet.availableCryptoTypes;

// Selector combinado para errores
export const selectWalletErrors = (state: { wallet: WalletState }) => ({
    createError: state.wallet.createWalletError,
    validationError: state.wallet.validationError,
});

// Selector para estado de carga general
export const selectWalletLoading = (state: { wallet: WalletState }) => ({
    isCreating: state.wallet.isCreatingWallet,
});

// Reducer
export default walletSlice.reducer;

// ========== HELPERS PARA COMPONENTES ==========

/**
 * Helper para obtener el nombre completo de una criptomoneda
 */
export const getCryptoDisplayName = (tipo: TipoCrypto): string => {
    return walletService.getCryptoNombreCompleto(tipo);
};

/**
 * Helper para validar datos de wallet antes de enviar
 */
export const validateWalletData = (data: CreateCryptoWalletDto): string | null => {
    try {
        walletService.validateCreateWalletData(data);
        return null;
    } catch (error) {
        return error instanceof Error ? error.message : 'Error de validación';
    }
};