import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { CreateCryptoWalletDto, TipoCrypto, CryptoWalletDto, SolicitudDepositoResponse, SolicitudRetiroDto, SolicitudRetiroResponse, SolicitudDepositoDto } from '../../types/walletTypes';
import { walletService } from '../../service/walletService';

// ========== ESTADO INICIAL ==========
interface WalletState {
    // Estados de deposito y retiro
    isCreatingDepositRequest: boolean;
    isCreatingWithdrawalRequest: boolean;
    depositRequestError: string | null;
    withdrawalRequestError: string | null;
    depositRequestResponse: SolicitudDepositoResponse | null;
    withdrawalRequestResponse: SolicitudRetiroResponse | null;

    // Estados de carga
    isCreatingWallet: boolean;
    isLoadingUserWallets: boolean;
    isDeactivatingWallet: boolean;

    // Datos
    createdWallet: CryptoWalletDto | null;
    userWallets: CryptoWalletDto[];
    availableCryptoTypes: TipoCrypto[];

    // Errores
    createWalletError: string | null;
    loadUserWalletsError: string | null;
    deactivateWalletError: string | null;

    // Estados de validación
    validationError: string | null;
}

const initialState: WalletState = {
    // Estados de deposito y retiro
    isCreatingDepositRequest: false,
    isCreatingWithdrawalRequest: false,
    depositRequestError: null,
    withdrawalRequestError: null,
    depositRequestResponse: null,
    withdrawalRequestResponse: null,

    isCreatingWallet: false,
    isLoadingUserWallets: false,
    isDeactivatingWallet: false,
    createdWallet: null,
    userWallets: [],
    availableCryptoTypes: [],
    createWalletError: null,
    loadUserWalletsError: null,
    deactivateWalletError: null,
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
 * Thunk para crear una solicitud de depósito
 */
export const createDepositRequest = createAsyncThunk<
    SolicitudDepositoResponse, // Tipo de retorno
    { usuarioId: number; depositoData: SolicitudDepositoDto }, // Tipo de parámetros
    { rejectValue: string } // Tipo del error
>(
    'wallet/createDepositRequest',
    async ({ usuarioId, depositoData }, { rejectWithValue }) => {
        try {
            const response = await walletService.createSolicitudDeposito(usuarioId, depositoData);
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear solicitud de depósito';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Thunk para crear una solicitud de retiro
 */
export const createWithdrawalRequest = createAsyncThunk<
    SolicitudRetiroResponse, // Tipo de retorno
    { usuarioId: number; retiroData: SolicitudRetiroDto }, // Tipo de parámetros
    { rejectValue: string } // Tipo del error
>(
    'wallet/createWithdrawalRequest',
    async ({ usuarioId, retiroData }, { rejectWithValue }) => {
        try {
            const response = await walletService.createSolicitudRetiro(usuarioId, retiroData);
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear solicitud de retiro';
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

/**
 * Thunk para obtener todas las wallets de un usuario
 */
export const getUserWallets = createAsyncThunk<
    CryptoWalletDto[], // Tipo de retorno
    number, // Tipo de parámetros: usuarioId
    { rejectValue: string } // Tipo del error
>(
    'wallet/getUserWallets',
    async (usuarioId, { rejectWithValue }) => {
        try {
            const wallets = await walletService.getWalletsByUsuario(usuarioId) || [];
            return wallets.data || [];
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar wallets del usuario';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Thunk para desactivar un wallet
 */
export const deactivateWallet = createAsyncThunk<
    number, // Tipo de retorno: walletId
    number, // Tipo de parámetros: walletId
    { rejectValue: string } // Tipo del error
>(
    'wallet/deactivateWallet',
    async (walletId, { rejectWithValue }) => {
        try {
            await walletService.deactivateWallet(walletId);
            return walletId;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al desactivar wallet';
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

        clearLoadUserWalletsError: (state) => {
            state.loadUserWalletsError = null;
        },

        clearDeactivateWalletError: (state) => {
            state.deactivateWalletError = null;
        },

        clearValidationError: (state) => {
            state.validationError = null;
        },

        // Limpiar wallet creado
        clearCreatedWallet: (state) => {
            state.createdWallet = null;
        },

        // Limpiar wallets del usuario
        clearUserWallets: (state) => {
            state.userWallets = [];
        },

        clearWithdrawalRequest: (state) => {
            state.withdrawalRequestResponse = null;
            state.withdrawalRequestError = null;
        },

        clearDepositRequest: (state) => {
            state.depositRequestResponse = null;
            state.depositRequestError = null;
        },

        // Limpiar todos los datos del wallet
        clearWalletData: (state) => {
            state.createdWallet = null;
            state.userWallets = [];
            state.createWalletError = null;
            state.loadUserWalletsError = null;
            state.deactivateWalletError = null;
            state.validationError = null;
            state.depositRequestResponse = null;
            state.withdrawalRequestResponse = null;
            state.depositRequestError = null;
            state.withdrawalRequestError = null;

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

        // ========== GET USER WALLETS ==========
        builder
            .addCase(getUserWallets.pending, (state) => {
                state.isLoadingUserWallets = true;
                state.loadUserWalletsError = null;
            })
            .addCase(getUserWallets.fulfilled, (state, action) => {
                state.isLoadingUserWallets = false;
                state.userWallets = action.payload;
                state.loadUserWalletsError = null;
            })
            .addCase(getUserWallets.rejected, (state, action) => {
                state.isLoadingUserWallets = false;
                state.loadUserWalletsError = action.payload || 'Error al cargar wallets del usuario';
                state.userWallets = [];
            });

        // ========== DEACTIVATE WALLET ==========
        builder
            .addCase(deactivateWallet.pending, (state) => {
                state.isDeactivatingWallet = true;
                state.deactivateWalletError = null;
            })
            .addCase(deactivateWallet.fulfilled, (state, action) => {
                state.isDeactivatingWallet = false;
                state.deactivateWalletError = null;
                // Remover wallet desactivado de la lista local
                state.userWallets = state.userWallets.filter(w => w.id !== action.payload);
            })
            .addCase(deactivateWallet.rejected, (state, action) => {
                state.isDeactivatingWallet = false;
                state.deactivateWalletError = action.payload || 'Error al desactivar wallet';
            });

        // ========== CREATE DEPOSIT REQUEST ==========
        builder
            .addCase(createDepositRequest.pending, (state) => {
                state.isCreatingDepositRequest = true;
                state.depositRequestError = null;
            })
            .addCase(createDepositRequest.fulfilled, (state, action) => {
                state.isCreatingDepositRequest = false;
                state.depositRequestResponse = action.payload;
                state.depositRequestError = null;
            })
            .addCase(createDepositRequest.rejected, (state, action) => {
                state.isCreatingDepositRequest = false;
                state.depositRequestError = action.payload || 'Error al crear solicitud de depósito';
                state.depositRequestResponse = null;
            });

        // ========== CREATE WITHDRAWAL REQUEST ==========
        builder
            .addCase(createWithdrawalRequest.pending, (state) => {
                state.isCreatingWithdrawalRequest = true;
                state.withdrawalRequestError = null;
            })
            .addCase(createWithdrawalRequest.fulfilled, (state, action) => {
                state.isCreatingWithdrawalRequest = false;
                state.withdrawalRequestResponse = action.payload;
                state.withdrawalRequestError = null;
            })
            .addCase(createWithdrawalRequest.rejected, (state, action) => {
                state.isCreatingWithdrawalRequest = false;
                state.withdrawalRequestError = action.payload || 'Error al crear solicitud de retiro';
                state.withdrawalRequestResponse = null;
            });
    },
});

// ========== EXPORTS ==========

// Actions
export const {
    clearCreateWalletError,
    clearLoadUserWalletsError,
    clearDeactivateWalletError,
    clearValidationError,
    clearCreatedWallet,
    clearUserWallets,
    clearWalletData,
    setValidationError,
    clearDepositRequest,
    clearWithdrawalRequest
} = walletSlice.actions;

// Selectors
export const selectWalletState = (state: { wallet: WalletState }) => state.wallet;
export const selectIsCreatingWallet = (state: { wallet: WalletState }) => state.wallet.isCreatingWallet;
export const selectIsLoadingUserWallets = (state: { wallet: WalletState }) => state.wallet.isLoadingUserWallets;
export const selectIsDeactivatingWallet = (state: { wallet: WalletState }) => state.wallet.isDeactivatingWallet;
export const selectCreatedWallet = (state: { wallet: WalletState }) => state.wallet.createdWallet;
export const selectUserWallets = (state: { wallet: WalletState }) => state.wallet.userWallets;
export const selectCreateWalletError = (state: { wallet: WalletState }) => state.wallet.createWalletError;
export const selectLoadUserWalletsError = (state: { wallet: WalletState }) => state.wallet.loadUserWalletsError;
export const selectDeactivateWalletError = (state: { wallet: WalletState }) => state.wallet.deactivateWalletError;
export const selectValidationError = (state: { wallet: WalletState }) => state.wallet.validationError;
export const selectAvailableCryptoTypes = (state: { wallet: WalletState }) => state.wallet.availableCryptoTypes;
export const selectIsCreatingDepositRequest = (state: { wallet: WalletState }) => state.wallet.isCreatingDepositRequest;
export const selectIsCreatingWithdrawalRequest = (state: { wallet: WalletState }) => state.wallet.isCreatingWithdrawalRequest;


export const selectDepositRequestState = (state: { wallet: WalletState }) => ({
    isCreating: state.wallet.isCreatingDepositRequest,
    response: state.wallet.depositRequestResponse,
    error: state.wallet.depositRequestError,
});

export const selectWithdrawalRequestState = (state: { wallet: WalletState }) => ({
    isCreating: state.wallet.isCreatingWithdrawalRequest,
    response: state.wallet.withdrawalRequestResponse,
    error: state.wallet.withdrawalRequestError,
});

// Selector combinado para errores
export const selectWalletErrors = (state: { wallet: WalletState }) => ({
    createError: state.wallet.createWalletError,
    loadUserWalletsError: state.wallet.loadUserWalletsError,
    deactivateWalletError: state.wallet.deactivateWalletError,
    validationError: state.wallet.validationError,
    depositRequestError: state.wallet.depositRequestError,
    withdrawalRequestError: state.wallet.withdrawalRequestError,
});

// Selector para estado de carga general
export const selectWalletLoading = (state: { wallet: WalletState }) => ({
    isCreating: state.wallet.isCreatingWallet,
    isLoadingUserWallets: state.wallet.isLoadingUserWallets,
    isDeactivating: state.wallet.isDeactivatingWallet,
    isCreatingDepositRequest: state.wallet.isCreatingDepositRequest,
    isCreatingWithdrawalRequest: state.wallet.isCreatingWithdrawalRequest,
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