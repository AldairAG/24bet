import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { 
    type CreateCryptoWalletDto,
    type CryptoWalletDto,
    type SolicitudDepositoResponse,
    type SolicitudRetiroDto,
    type SolicitudRetiroResponse,
    type SolicitudDepositoDto,
    type SolicitudDepositoAdmin,
    type SolicitudRetiroAdmin,
    type AdminAprobarSolicitudDto,
    type AdminRechazarSolicitudDto,
    type AdminAprobarRetiroDto,
    type EstadisticasTransaccionesDto,
    type DashboardAdminDto,
} from '../../types/walletTypes';
import { walletService } from '../../service/walletService';
import { TipoCrypto } from '../../types/walletTypes';

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
    isLoadingWithdrawalRequests: boolean;

    // Datos
    createdWallet: CryptoWalletDto | null;
    userWallets: CryptoWalletDto[];
    availableCryptoTypes: TipoCrypto[];
    withdrawalRequests: SolicitudRetiroDto[];

    // Errores
    createWalletError: string | null;
    loadUserWalletsError: string | null;
    deactivateWalletError: string | null;
    loadWithdrawalRequestsError: string | null;

    // Estados de validación
    validationError: string | null;

    // ===== ADMIN: estados de carga =====
    isLoadingAdminDepositsPending: boolean;
    isLoadingAdminWithdrawalsPending: boolean;
    isApprovingAdminDeposit: boolean;
    isRejectingAdminDeposit: boolean;
    isApprovingAdminWithdrawal: boolean;
    isRejectingAdminWithdrawal: boolean;
    isLoadingAdminStats: boolean;
    isLoadingAdminDashboard: boolean;

    // ===== ADMIN: datos =====
    adminDepositsPending: SolicitudDepositoAdmin[];
    adminWithdrawalsPending: SolicitudRetiroAdmin[];
    adminStats: EstadisticasTransaccionesDto | null;
    adminDashboard: DashboardAdminDto | null;

    // ===== ADMIN: errores =====
    adminDepositsError: string | null;
    adminWithdrawalsError: string | null;
    approveAdminDepositError: string | null;
    rejectAdminDepositError: string | null;
    approveAdminWithdrawalError: string | null;
    rejectAdminWithdrawalError: string | null;
    adminStatsError: string | null;
    adminDashboardError: string | null;
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
    isLoadingWithdrawalRequests: false,
    createdWallet: null,
    userWallets: [],
    availableCryptoTypes: [],
    withdrawalRequests: [],
    createWalletError: null,
    loadUserWalletsError: null,
    deactivateWalletError: null,
    loadWithdrawalRequestsError: null,
    validationError: null,

    // ===== ADMIN: estados =====
    isLoadingAdminDepositsPending: false,
    isLoadingAdminWithdrawalsPending: false,
    isApprovingAdminDeposit: false,
    isRejectingAdminDeposit: false,
    isApprovingAdminWithdrawal: false,
    isRejectingAdminWithdrawal: false,
    isLoadingAdminStats: false,
    isLoadingAdminDashboard: false,

    // ===== ADMIN: datos =====
    adminDepositsPending: [],
    adminWithdrawalsPending: [],
    adminStats: null,
    adminDashboard: null,

    // ===== ADMIN: errores =====
    adminDepositsError: null,
    adminWithdrawalsError: null,
    approveAdminDepositError: null,
    rejectAdminDepositError: null,
    approveAdminWithdrawalError: null,
    rejectAdminWithdrawalError: null,
    adminStatsError: null,
    adminDashboardError: null,
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
            return wallets || [];
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

/**
 * Thunk para obtener las solicitudes de retiro de un usuario
 */
export const getWithdrawalRequests = createAsyncThunk<
    unknown, // Tipo de retorno
    number, // Tipo de parámetros: usuarioId
    { rejectValue: string } // Tipo del error
>(
    'wallet/getWithdrawalRequests',
    async (usuarioId, { rejectWithValue }) => {
        try {
            const response = await walletService.getSolicitudesRetiro(usuarioId);
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar solicitudes de retiro';
            return rejectWithValue(errorMessage);
        }
    }
);

// ===== ADMIN: THUNKS =====

export const loadAdminDepositsPending = createAsyncThunk<
    SolicitudDepositoAdmin[],
    void,
    { rejectValue: string }
>(
    'wallet/admin/loadDepositsPending',
    async (_, { rejectWithValue }) => {
        try {
            const list = await walletService.getAdminDepositosPendientes();
            return list || [];
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error al cargar depósitos pendientes (admin)';
            return rejectWithValue(msg);
        }
    }
);

export const loadAdminWithdrawalsPending = createAsyncThunk<
    SolicitudRetiroAdmin[],
    void,
    { rejectValue: string }
>(
    'wallet/admin/loadWithdrawalsPending',
    async (_, { rejectWithValue }) => {
        try {
            const list = await walletService.getAdminRetirosPendientes();
            return list || [];
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error al cargar retiros pendientes (admin)';
            return rejectWithValue(msg);
        }
    }
);

export const approveAdminDeposit = createAsyncThunk<
    SolicitudDepositoAdmin,
    { solicitudId: number } & AdminAprobarSolicitudDto,
    { rejectValue: string }
>(
    'wallet/admin/approveDeposit',
    async ({ solicitudId, adminId, observaciones }, { rejectWithValue }) => {
        try {
            const res = await walletService.aprobarAdminDeposito(solicitudId, { adminId, observaciones });
            return res;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error al aprobar depósito (admin)';
            return rejectWithValue(msg);
        }
    }
);

export const rejectAdminDeposit = createAsyncThunk<
    SolicitudDepositoAdmin,
    { solicitudId: number } & AdminRechazarSolicitudDto,
    { rejectValue: string }
>(
    'wallet/admin/rejectDeposit',
    async ({ solicitudId, adminId, motivo }, { rejectWithValue }) => {
        try {
            const res = await walletService.rechazarAdminDeposito(solicitudId, { adminId, motivo });
            return res;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error al rechazar depósito (admin)';
            return rejectWithValue(msg);
        }
    }
);

export const approveAdminWithdrawal = createAsyncThunk<
    SolicitudRetiroAdmin,
    { solicitudId: number } & AdminAprobarRetiroDto,
    { rejectValue: string }
>(
    'wallet/admin/approveWithdrawal',
    async ({ solicitudId, adminId, observaciones, referenciaTransaccion }, { rejectWithValue }) => {
        try {
            const res = await walletService.aprobarAdminRetiro(solicitudId, { adminId, observaciones, referenciaTransaccion });
            return res;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error al aprobar retiro (admin)';
            return rejectWithValue(msg);
        }
    }
);

export const rejectAdminWithdrawal = createAsyncThunk<
    SolicitudRetiroAdmin,
    { solicitudId: number } & AdminRechazarSolicitudDto,
    { rejectValue: string }
>(
    'wallet/admin/rejectWithdrawal',
    async ({ solicitudId, adminId, motivo }, { rejectWithValue }) => {
        try {
            const res = await walletService.rechazarAdminRetiro(solicitudId, { adminId, motivo });
            return res;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error al rechazar retiro (admin)';
            return rejectWithValue(msg);
        }
    }
);

export const loadAdminStats = createAsyncThunk<
    EstadisticasTransaccionesDto,
    void,
    { rejectValue: string }
>(
    'wallet/admin/loadStats',
    async (_, { rejectWithValue }) => {
        try {
            const stats = await walletService.getAdminEstadisticas();
            return stats;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error al cargar estadísticas (admin)';
            return rejectWithValue(msg);
        }
    }
);

export const loadAdminDashboard = createAsyncThunk<
    DashboardAdminDto,
    void,
    { rejectValue: string }
>(
    'wallet/admin/loadDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const dash = await walletService.getAdminDashboard();
            return dash;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error al cargar dashboard (admin)';
            return rejectWithValue(msg);
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

        clearLoadWithdrawalRequestsError: (state) => {
            state.loadWithdrawalRequestsError = null;
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

        clearWithdrawalRequests: (state) => {
            state.withdrawalRequests = [];
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
        // ===== ADMIN: clearers =====
        clearAdminDepositsError: (state) => { state.adminDepositsError = null; },
        clearAdminWithdrawalsError: (state) => { state.adminWithdrawalsError = null; },
        clearAdminOperationErrors: (state) => {
            state.approveAdminDepositError = null;
            state.rejectAdminDepositError = null;
            state.approveAdminWithdrawalError = null;
            state.rejectAdminWithdrawalError = null;
        },
        clearAdminStatsError: (state) => { state.adminStatsError = null; },
        clearAdminDashboardError: (state) => { state.adminDashboardError = null; },
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
            .addCase(loadAvailableCryptoTypes.rejected, (state) => {
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

        // ========== GET WITHDRAWAL REQUESTS ==========
        builder
            .addCase(getWithdrawalRequests.pending, (state) => {
                state.isLoadingWithdrawalRequests = true;
                state.loadWithdrawalRequestsError = null;
            })
            .addCase(getWithdrawalRequests.fulfilled, (state, action) => {
                state.isLoadingWithdrawalRequests = false;
                // El backend puede retornar Page<SolicitudRetiro> o un array directo; normalizamos
                const data = action.payload as { content?: unknown[] } | unknown[] | null | undefined;
                let list: unknown[] = [];
                if (Array.isArray(data)) {
                    list = data;
                } else if (data && typeof data === 'object' && 'content' in data) {
                    const c = (data as { content?: unknown[] }).content;
                    list = Array.isArray(c) ? c : [];
                }
                state.withdrawalRequests = list;
                state.loadWithdrawalRequestsError = null;
            })
            .addCase(getWithdrawalRequests.rejected, (state, action) => {
                state.isLoadingWithdrawalRequests = false;
                state.loadWithdrawalRequestsError = action.payload || 'Error al cargar solicitudes de retiro';
                state.withdrawalRequests = [];
            });

        // ===== ADMIN: pending deposits =====
        builder
            .addCase(loadAdminDepositsPending.pending, (state) => {
                state.isLoadingAdminDepositsPending = true;
                state.adminDepositsError = null;
            })
            .addCase(loadAdminDepositsPending.fulfilled, (state, action) => {
                state.isLoadingAdminDepositsPending = false;
                state.adminDepositsPending = action.payload;
                state.adminDepositsError = null;
            })
            .addCase(loadAdminDepositsPending.rejected, (state, action) => {
                state.isLoadingAdminDepositsPending = false;
                state.adminDepositsPending = [];
                state.adminDepositsError = action.payload || 'Error al cargar depósitos pendientes (admin)';
            });

        // ===== ADMIN: pending withdrawals =====
        builder
            .addCase(loadAdminWithdrawalsPending.pending, (state) => {
                state.isLoadingAdminWithdrawalsPending = true;
                state.adminWithdrawalsError = null;
            })
            .addCase(loadAdminWithdrawalsPending.fulfilled, (state, action) => {
                state.isLoadingAdminWithdrawalsPending = false;
                state.adminWithdrawalsPending = action.payload;
                state.adminWithdrawalsError = null;
            })
            .addCase(loadAdminWithdrawalsPending.rejected, (state, action) => {
                state.isLoadingAdminWithdrawalsPending = false;
                state.adminWithdrawalsPending = [];
                state.adminWithdrawalsError = action.payload || 'Error al cargar retiros pendientes (admin)';
            });

        // ===== ADMIN: approve/reject deposit =====
        builder
            .addCase(approveAdminDeposit.pending, (state) => {
                state.isApprovingAdminDeposit = true;
                state.approveAdminDepositError = null;
            })
            .addCase(approveAdminDeposit.fulfilled, (state, action) => {
                state.isApprovingAdminDeposit = false;
                // Actualizar lista local si existe
                state.adminDepositsPending = state.adminDepositsPending.filter(d => d.id !== action.payload.id);
            })
            .addCase(approveAdminDeposit.rejected, (state, action) => {
                state.isApprovingAdminDeposit = false;
                state.approveAdminDepositError = action.payload || 'Error al aprobar depósito (admin)';
            })
            .addCase(rejectAdminDeposit.pending, (state) => {
                state.isRejectingAdminDeposit = true;
                state.rejectAdminDepositError = null;
            })
            .addCase(rejectAdminDeposit.fulfilled, (state, action) => {
                state.isRejectingAdminDeposit = false;
                state.adminDepositsPending = state.adminDepositsPending.filter(d => d.id !== action.payload.id);
            })
            .addCase(rejectAdminDeposit.rejected, (state, action) => {
                state.isRejectingAdminDeposit = false;
                state.rejectAdminDepositError = action.payload || 'Error al rechazar depósito (admin)';
            });

        // ===== ADMIN: approve/reject withdrawal =====
        builder
            .addCase(approveAdminWithdrawal.pending, (state) => {
                state.isApprovingAdminWithdrawal = true;
                state.approveAdminWithdrawalError = null;
            })
            .addCase(approveAdminWithdrawal.fulfilled, (state, action) => {
                state.isApprovingAdminWithdrawal = false;
                state.adminWithdrawalsPending = state.adminWithdrawalsPending.filter(r => r.id !== action.payload.id);
            })
            .addCase(approveAdminWithdrawal.rejected, (state, action) => {
                state.isApprovingAdminWithdrawal = false;
                state.approveAdminWithdrawalError = action.payload || 'Error al aprobar retiro (admin)';
            })
            .addCase(rejectAdminWithdrawal.pending, (state) => {
                state.isRejectingAdminWithdrawal = true;
                state.rejectAdminWithdrawalError = null;
            })
            .addCase(rejectAdminWithdrawal.fulfilled, (state, action) => {
                state.isRejectingAdminWithdrawal = false;
                state.adminWithdrawalsPending = state.adminWithdrawalsPending.filter(r => r.id !== action.payload.id);
            })
            .addCase(rejectAdminWithdrawal.rejected, (state, action) => {
                state.isRejectingAdminWithdrawal = false;
                state.rejectAdminWithdrawalError = action.payload || 'Error al rechazar retiro (admin)';
            });

        // ===== ADMIN: stats =====
        builder
            .addCase(loadAdminStats.pending, (state) => {
                state.isLoadingAdminStats = true;
                state.adminStatsError = null;
            })
            .addCase(loadAdminStats.fulfilled, (state, action) => {
                state.isLoadingAdminStats = false;
                state.adminStats = action.payload;
            })
            .addCase(loadAdminStats.rejected, (state, action) => {
                state.isLoadingAdminStats = false;
                state.adminStatsError = action.payload || 'Error al cargar estadísticas (admin)';
                state.adminStats = null;
            });

        // ===== ADMIN: dashboard =====
        builder
            .addCase(loadAdminDashboard.pending, (state) => {
                state.isLoadingAdminDashboard = true;
                state.adminDashboardError = null;
            })
            .addCase(loadAdminDashboard.fulfilled, (state, action) => {
                state.isLoadingAdminDashboard = false;
                state.adminDashboard = action.payload;
            })
            .addCase(loadAdminDashboard.rejected, (state, action) => {
                state.isLoadingAdminDashboard = false;
                state.adminDashboardError = action.payload || 'Error al cargar dashboard (admin)';
                state.adminDashboard = null;
            });
    },
});

// ========== EXPORTS ==========

// Actions
export const {
    clearCreateWalletError,
    clearLoadUserWalletsError,
    clearDeactivateWalletError,
    clearLoadWithdrawalRequestsError,
    clearValidationError,
    clearCreatedWallet,
    clearUserWallets,
    clearWithdrawalRequests,
    clearWalletData,
    setValidationError,
    clearDepositRequest,
    clearWithdrawalRequest,
    // Admin clearers
    clearAdminDepositsError,
    clearAdminWithdrawalsError,
    clearAdminOperationErrors,
    clearAdminStatsError,
    clearAdminDashboardError,
} = walletSlice.actions;

// Selectors
export const selectWalletState = (state: { wallet: WalletState }) => state.wallet;
export const selectIsCreatingWallet = (state: { wallet: WalletState }) => state.wallet.isCreatingWallet;
export const selectIsLoadingUserWallets = (state: { wallet: WalletState }) => state.wallet.isLoadingUserWallets;
export const selectIsDeactivatingWallet = (state: { wallet: WalletState }) => state.wallet.isDeactivatingWallet;
export const selectIsLoadingWithdrawalRequests = (state: { wallet: WalletState }) => state.wallet.isLoadingWithdrawalRequests;
export const selectCreatedWallet = (state: { wallet: WalletState }) => state.wallet.createdWallet;
export const selectUserWallets = (state: { wallet: WalletState }) => state.wallet.userWallets;
export const selectWithdrawalRequests = (state: { wallet: WalletState }) => state.wallet.withdrawalRequests;
export const selectCreateWalletError = (state: { wallet: WalletState }) => state.wallet.createWalletError;
export const selectLoadUserWalletsError = (state: { wallet: WalletState }) => state.wallet.loadUserWalletsError;
export const selectDeactivateWalletError = (state: { wallet: WalletState }) => state.wallet.deactivateWalletError;
export const selectLoadWithdrawalRequestsError = (state: { wallet: WalletState }) => state.wallet.loadWithdrawalRequestsError;
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
    loadWithdrawalRequestsError: state.wallet.loadWithdrawalRequestsError,
    validationError: state.wallet.validationError,
    depositRequestError: state.wallet.depositRequestError,
    withdrawalRequestError: state.wallet.withdrawalRequestError,
});

// Selector para estado de carga general
export const selectWalletLoading = (state: { wallet: WalletState }) => ({
    isCreating: state.wallet.isCreatingWallet,
    isLoadingUserWallets: state.wallet.isLoadingUserWallets,
    isDeactivating: state.wallet.isDeactivatingWallet,
    isLoadingWithdrawalRequests: state.wallet.isLoadingWithdrawalRequests,
    isCreatingDepositRequest: state.wallet.isCreatingDepositRequest,
    isCreatingWithdrawalRequest: state.wallet.isCreatingWithdrawalRequest,
});

// ===== ADMIN: Selectores =====
export const selectAdminDepositsPending = (state: { wallet: WalletState }) => state.wallet.adminDepositsPending;
export const selectAdminWithdrawalsPending = (state: { wallet: WalletState }) => state.wallet.adminWithdrawalsPending;
export const selectAdminStats = (state: { wallet: WalletState }) => state.wallet.adminStats;
export const selectAdminDashboard = (state: { wallet: WalletState }) => state.wallet.adminDashboard;

export const selectAdminErrors = (state: { wallet: WalletState }) => ({
    depositsError: state.wallet.adminDepositsError,
    withdrawalsError: state.wallet.adminWithdrawalsError,
    approveDepositError: state.wallet.approveAdminDepositError,
    rejectDepositError: state.wallet.rejectAdminDepositError,
    approveWithdrawalError: state.wallet.approveAdminWithdrawalError,
    rejectWithdrawalError: state.wallet.rejectAdminWithdrawalError,
    statsError: state.wallet.adminStatsError,
    dashboardError: state.wallet.adminDashboardError,
});

export const selectAdminLoading = (state: { wallet: WalletState }) => ({
    loadingDeposits: state.wallet.isLoadingAdminDepositsPending,
    loadingWithdrawals: state.wallet.isLoadingAdminWithdrawalsPending,
    approvingDeposit: state.wallet.isApprovingAdminDeposit,
    rejectingDeposit: state.wallet.isRejectingAdminDeposit,
    approvingWithdrawal: state.wallet.isApprovingAdminWithdrawal,
    rejectingWithdrawal: state.wallet.isRejectingAdminWithdrawal,
    loadingStats: state.wallet.isLoadingAdminStats,
    loadingDashboard: state.wallet.isLoadingAdminDashboard,
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