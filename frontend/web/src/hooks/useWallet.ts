import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store';
import type { CreateCryptoWalletDto, SolicitudDepositoDto, SolicitudRetiroDto } from '../types/walletTypes';
import { TipoCrypto } from '../types/walletTypes';
import {
    // Thunks
    createCryptoWallet,
    loadAvailableCryptoTypes,
    getUserWallets,
    deactivateWallet,
    createDepositRequest,
    createWithdrawalRequest,
    getWithdrawalRequests,
    loadAdminDepositsPending,
    loadAdminWithdrawalsPending,
    approveAdminDeposit,
    rejectAdminDeposit,
    approveAdminWithdrawal,
    rejectAdminWithdrawal,
    loadAdminStats,
    loadAdminDashboard,
    // Actions
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
    clearAdminDepositsError,
    clearAdminWithdrawalsError,
    clearAdminOperationErrors,
    clearAdminStatsError,
    clearAdminDashboardError,
    // Selectors
    selectWalletState,
    selectIsCreatingWallet,
    selectIsLoadingUserWallets,
    selectIsDeactivatingWallet,
    selectIsLoadingWithdrawalRequests,
    selectCreatedWallet,
    selectUserWallets,
    selectWithdrawalRequests,
    selectCreateWalletError,
    selectLoadUserWalletsError,
    selectDeactivateWalletError,
    selectLoadWithdrawalRequestsError,
    selectValidationError,
    selectAvailableCryptoTypes,
    selectWalletErrors,
    selectWalletLoading,
    selectIsCreatingDepositRequest,
    selectIsCreatingWithdrawalRequest,
    selectDepositRequestState,
    selectWithdrawalRequestState,
    selectAdminDepositsPending,
    selectAdminWithdrawalsPending,
    selectAdminStats,
    selectAdminDashboard,
    selectAdminErrors,
    selectAdminLoading,
    // Helpers
    getCryptoDisplayName,
    validateWalletData,
    selectDepositRequests,
    selectLoadDepositRequestsError,
    selectIsLoadingDepositRequests,
    getDepositRequests,
} from '../store/slices/walletSlice';

/**
 * Hook personalizado para la gestión de wallets de criptomonedas
 */
export const useWallet = () => {
    const dispatch = useDispatch<AppDispatch>();

    // ========== SELECTORES ==========
    const walletState = useSelector(selectWalletState);
    const isCreatingWallet = useSelector(selectIsCreatingWallet);
    const isLoadingUserWallets = useSelector(selectIsLoadingUserWallets);
    const isDeactivatingWallet = useSelector(selectIsDeactivatingWallet);
    const isLoadingWithdrawalRequests = useSelector(selectIsLoadingWithdrawalRequests);
    const isCreatingDepositRequest = useSelector(selectIsCreatingDepositRequest);
    const isCreatingWithdrawalRequest = useSelector(selectIsCreatingWithdrawalRequest);
    const createdWallet = useSelector(selectCreatedWallet);
    const userWallets = useSelector(selectUserWallets);
    const withdrawalRequests = useSelector(selectWithdrawalRequests);
    const createWalletError = useSelector(selectCreateWalletError);
    const loadUserWalletsError = useSelector(selectLoadUserWalletsError);
    const deactivateWalletError = useSelector(selectDeactivateWalletError);
    const loadWithdrawalRequestsError = useSelector(selectLoadWithdrawalRequestsError);
    const validationError = useSelector(selectValidationError);
    const availableCryptoTypes = useSelector(selectAvailableCryptoTypes);
    const walletErrors = useSelector(selectWalletErrors);
    const walletLoading = useSelector(selectWalletLoading);
    const depositRequestState = useSelector(selectDepositRequestState);
    const withdrawalRequestState = useSelector(selectWithdrawalRequestState);
    const adminDepositsPending = useSelector(selectAdminDepositsPending);
    const adminWithdrawalsPending = useSelector(selectAdminWithdrawalsPending);
    const adminStats = useSelector(selectAdminStats);
    const adminDashboard = useSelector(selectAdminDashboard);
    const adminErrors = useSelector(selectAdminErrors);
    const adminLoading = useSelector(selectAdminLoading);
    const depositRequests = useSelector(selectDepositRequests);
    const isLoadingDepositRequests = useSelector(selectIsLoadingDepositRequests);
    const loadDepositRequestsError = useSelector(selectLoadDepositRequestsError);

    // ========== ACCIONES PRINCIPALES ==========

    const loadDepositRequests = useCallback(
        async (usuarioId: number) => {
            const result = await dispatch(getDepositRequests(usuarioId));
            return result;
        },
        [dispatch]
    );

    /**
     * Crea un nuevo wallet crypto para un usuario
     */
    const createWallet = useCallback(
        async (usuarioId: number, walletData: CreateCryptoWalletDto) => {
            const result = await dispatch(
                createCryptoWallet({ usuarioId, walletData })
            );
            return result;
        },
        [dispatch]
    );

    /**
     * Carga los tipos de criptomonedas disponibles
     */
    const loadCryptoTypes = useCallback(async () => {
        const result = await dispatch(loadAvailableCryptoTypes());
        return result;
    }, [dispatch]);

    /**
     * Carga todas las wallets de un usuario
     */
    const loadUserWallets = useCallback(
        async (usuarioId: number) => {
            const result = await dispatch(getUserWallets(usuarioId));
            return result;
        },
        [dispatch]
    );

    /**
     * Desactiva (elimina) un wallet
     */
    const deleteWallet = useCallback(
        async (walletId: number) => {
            const result = await dispatch(deactivateWallet(walletId));
            return result;
        },
        [dispatch]
    );

    /**
     * Crea una solicitud de depósito
     */
    const createDeposit = useCallback(
        async (usuarioId: number, depositoData: SolicitudDepositoDto) => {
            const result = await dispatch(
                createDepositRequest({ usuarioId, depositoData })
            );
            return result;
        },
        [dispatch]
    );

    /**
     * Crea una solicitud de retiro
     */
    const createWithdrawal = useCallback(
        async (usuarioId: number, retiroData: SolicitudRetiroDto) => {
            const result = await dispatch(
                createWithdrawalRequest({ usuarioId, retiroData })
            );
            return result;
        },
        [dispatch]
    );

    /**
     * Carga las solicitudes de retiro de un usuario
     */
    const loadWithdrawalRequests = useCallback(
        async (usuarioId: number) => {
            const result = await dispatch(getWithdrawalRequests(usuarioId));
            return result;
        },
        [dispatch]
    );

    // ===== ADMIN: acciones =====
    const loadAdminPendingDeposits = useCallback(async () => {
        return await dispatch(loadAdminDepositsPending());
    }, [dispatch]);

    const loadAdminPendingWithdrawals = useCallback(async () => {
        return await dispatch(loadAdminWithdrawalsPending());
    }, [dispatch]);

    const approveDepositAdmin = useCallback(async (params: { solicitudId: number; adminId: number; observaciones?: string }) => {
        return await dispatch(approveAdminDeposit(params));
    }, [dispatch]);

    const rejectDepositAdmin = useCallback(async (params: { solicitudId: number; adminId: number; motivo: string }) => {
        return await dispatch(rejectAdminDeposit(params));
    }, [dispatch]);

    const approveWithdrawalAdmin = useCallback(async (params: { solicitudId: number; adminId: number; observaciones?: string; referenciaTransaccion: string }) => {
        return await dispatch(approveAdminWithdrawal(params));
    }, [dispatch]);

    const rejectWithdrawalAdmin = useCallback(async (params: { solicitudId: number; adminId: number; motivo: string }) => {
        return await dispatch(rejectAdminWithdrawal(params));
    }, [dispatch]);

    const loadAdminStatsAction = useCallback(async () => {
        return await dispatch(loadAdminStats());
    }, [dispatch]);

    const loadAdminDashboardAction = useCallback(async () => {
        return await dispatch(loadAdminDashboard());
    }, [dispatch]);

    // ========== ACCIONES DE LIMPIEZA ==========

    /**
     * Limpia el error de creación de wallet
     */
    const clearCreateError = useCallback(() => {
        dispatch(clearCreateWalletError());
    }, [dispatch]);

    /**
     * Limpia el error de carga de wallets del usuario
     */
    const clearLoadWalletsError = useCallback(() => {
        dispatch(clearLoadUserWalletsError());
    }, [dispatch]);

    /**
     * Limpia el error de desactivación de wallet
     */
    const clearDeactivateError = useCallback(() => {
        dispatch(clearDeactivateWalletError());
    }, [dispatch]);

    /**
     * Limpia el error de carga de solicitudes de retiro
     */
    const clearLoadWithdrawalRequestsErr = useCallback(() => {
        dispatch(clearLoadWithdrawalRequestsError());
    }, [dispatch]);

    /**
     * Limpia el error de validación
     */
    const clearValidationErr = useCallback(() => {
        dispatch(clearValidationError());
    }, [dispatch]);

    /**
     * Limpia el wallet creado
     */
    const clearWallet = useCallback(() => {
        dispatch(clearCreatedWallet());
    }, [dispatch]);

    /**
     * Limpia las wallets del usuario cargadas
     */
    const clearWallets = useCallback(() => {
        dispatch(clearUserWallets());
    }, [dispatch]);

    /**
     * Limpia las solicitudes de retiro cargadas
     */
    const clearWithdrawalRequestsList = useCallback(() => {
        dispatch(clearWithdrawalRequests());
    }, [dispatch]);

    /**
     * Limpia todos los datos del wallet
     */
    const clearAllWalletData = useCallback(() => {
        dispatch(clearWalletData());
    }, [dispatch]);

    /**
     * Establece un error de validación personalizado
     */
    const setValidationErr = useCallback(
        (error: string) => {
            dispatch(setValidationError(error));
        },
        [dispatch]
    );

    /**
     * Limpia la solicitud de depósito
     */
    const clearDeposit = useCallback(() => {
        dispatch(clearDepositRequest());
    }, [dispatch]);

    /**
     * Limpia la solicitud de retiro
     */
    const clearWithdrawal = useCallback(() => {
        dispatch(clearWithdrawalRequest());
    }, [dispatch]);

    const clearAdminDepositsErr = useCallback(() => { dispatch(clearAdminDepositsError()); }, [dispatch]);
    const clearAdminWithdrawalsErr = useCallback(() => { dispatch(clearAdminWithdrawalsError()); }, [dispatch]);
    const clearAdminOpsErr = useCallback(() => { dispatch(clearAdminOperationErrors()); }, [dispatch]);
    const clearAdminStatsErr = useCallback(() => { dispatch(clearAdminStatsError()); }, [dispatch]);
    const clearAdminDashboardErr = useCallback(() => { dispatch(clearAdminDashboardError()); }, [dispatch]);

    // ========== FUNCIONES AUXILIARES ==========

    /**
     * Valida los datos de un wallet antes de enviarlo
     */
    const validateWallet = useCallback((data: CreateCryptoWalletDto): string | null => {
        return validateWalletData(data);
    }, []);

    /**
     * Obtiene el nombre completo de una criptomoneda
     */
    const getCryptoName = useCallback((tipo: TipoCrypto): string => {
        return getCryptoDisplayName(tipo);
    }, []);

    /**
     * Obtiene la lista de tipos de crypto formateada para UI
     */
    const getCryptoOptions = useCallback(() => {
        return availableCryptoTypes.map(tipo => ({
            value: tipo,
            label: `${getCryptoDisplayName(tipo)} (${tipo})`,
            symbol: tipo,
        }));
    }, [availableCryptoTypes]);

    /**
     * Verifica si un tipo de crypto está disponible
     */
    const isCryptoAvailable = useCallback(
        (tipo: TipoCrypto): boolean => {
            return availableCryptoTypes.includes(tipo);
        },
        [availableCryptoTypes]
    );

    /**
     * Verifica si hay algún error activo
     */
    const hasErrors = useCallback((): boolean => {
        return !!(
            createWalletError ||
            loadUserWalletsError ||
            deactivateWalletError ||
            validationError ||
            depositRequestState.error ||
            withdrawalRequestState.error
        );
    }, [
        createWalletError,
        loadUserWalletsError,
        deactivateWalletError,
        validationError,
        depositRequestState.error,
        withdrawalRequestState.error
    ]);

    /**
     * Obtiene todos los errores activos
     */
    const getAllErrors = useCallback((): string[] => {
        const errors: string[] = [];
        if (createWalletError) errors.push(createWalletError);
        if (loadUserWalletsError) errors.push(loadUserWalletsError);
        if (deactivateWalletError) errors.push(deactivateWalletError);
        if (validationError) errors.push(validationError);
        if (depositRequestState.error) errors.push(depositRequestState.error);
        if (withdrawalRequestState.error) errors.push(withdrawalRequestState.error);
        return errors;
    }, [
        createWalletError,
        loadUserWalletsError,
        deactivateWalletError,
        validationError,
        depositRequestState.error,
        withdrawalRequestState.error
    ]);

    /**
     * Resetea todos los estados a su valor inicial
     */
    const resetWalletState = useCallback(() => {
        dispatch(clearWalletData());
    }, [dispatch]);

    // ========== EFECTOS ==========

    /**
     * Carga automáticamente los tipos de crypto al inicializar el hook
     */
    useEffect(() => {
        if (availableCryptoTypes.length === 0) {
            loadCryptoTypes();
        }
    }, [loadCryptoTypes, availableCryptoTypes.length]);

    // ========== VALORES DE RETORNO ==========
    return {
        // Estado completo
        walletState,

        // Estados de carga
        isCreatingWallet,
        isLoadingUserWallets,
        isDeactivatingWallet,
        isLoadingWithdrawalRequests,
        isCreatingDepositRequest,
        isCreatingWithdrawalRequest,
        isLoading: isCreatingWallet || isLoadingUserWallets || isDeactivatingWallet || isLoadingWithdrawalRequests || isCreatingDepositRequest || isCreatingWithdrawalRequest,
        loading: walletLoading,
        isLoadingDepositRequests,

        // Datos
        createdWallet,
        userWallets,
        withdrawalRequests,
        adminDepositsPending,
        adminWithdrawalsPending,
        adminStats,
        adminDashboard,
        availableCryptoTypes,
        depositRequestResponse: depositRequestState.response,
        withdrawalRequestResponse: withdrawalRequestState.response,
        depositRequests,

        // Errores
        createWalletError,
        loadUserWalletsError,
        deactivateWalletError,
        loadWithdrawalRequestsError,
        validationError,
        depositRequestError: depositRequestState.error,
        withdrawalRequestError: withdrawalRequestState.error,
        errors: walletErrors,
        adminErrors,
        hasErrors: hasErrors(),
        allErrors: getAllErrors(),
        loadDepositRequestsError,

        // Acciones principales
        createWallet,
        loadCryptoTypes,
        loadUserWallets,
        loadWithdrawalRequests,
        deleteWallet,
        createDeposit,
        createWithdrawal,
        loadDepositRequests,
        // Admin thunks
        loadAdminPendingDeposits,
        loadAdminPendingWithdrawals,
        approveDepositAdmin,
        rejectDepositAdmin,
        approveWithdrawalAdmin,
        rejectWithdrawalAdmin,
        loadAdminStats: loadAdminStatsAction,
        loadAdminDashboard: loadAdminDashboardAction,

        // Acciones de limpieza
        clearCreateError,
        clearLoadWalletsError,
        clearDeactivateError,
        clearLoadWithdrawalRequestsError: clearLoadWithdrawalRequestsErr,
        clearValidationError: clearValidationErr,
        clearWallet,
        clearWallets,
        clearWithdrawalRequests: clearWithdrawalRequestsList,
        clearAllWalletData,
        setValidationError: setValidationErr,
        resetWalletState,
        clearDeposit,
        clearWithdrawal,
        clearAdminDepositsError: clearAdminDepositsErr,
        clearAdminWithdrawalsError: clearAdminWithdrawalsErr,
        clearAdminOperationErrors: clearAdminOpsErr,
        clearAdminStatsError: clearAdminStatsErr,
        clearAdminDashboardError: clearAdminDashboardErr,

        // Funciones auxiliares
        validateWallet,
        getCryptoName,
        getCryptoOptions,
        isCryptoAvailable,
        adminLoading,

        // Tipos disponibles (para fácil acceso)
        TipoCrypto,
    };
};

export default useWallet;