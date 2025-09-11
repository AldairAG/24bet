import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateCryptoWalletDto, TipoCrypto } from '../types/walletTypes';
import {
    // Thunks
    createCryptoWallet,
    loadAvailableCryptoTypes,
    getUserWallets,
    deactivateWallet,
    // Actions
    clearCreateWalletError,
    clearLoadUserWalletsError,
    clearDeactivateWalletError,
    clearValidationError,
    clearCreatedWallet,
    clearUserWallets,
    clearWalletData,
    setValidationError,
    // Selectors
    selectWalletState,
    selectIsCreatingWallet,
    selectIsLoadingUserWallets,
    selectIsDeactivatingWallet,
    selectCreatedWallet,
    selectUserWallets,
    selectCreateWalletError,
    selectLoadUserWalletsError,
    selectDeactivateWalletError,
    selectValidationError,
    selectAvailableCryptoTypes,
    selectWalletErrors,
    selectWalletLoading,
    // Helpers
    getCryptoDisplayName,
    validateWalletData,
} from '../store/slices/walletSlice';

/**
 * Hook personalizado para la gestión de wallets de criptomonedas
 */
export const useWallet = () => {
    const dispatch = useDispatch();

    // ========== SELECTORES ==========
    const walletState = useSelector(selectWalletState);
    const isCreatingWallet = useSelector(selectIsCreatingWallet);
    const isLoadingUserWallets = useSelector(selectIsLoadingUserWallets);
    const isDeactivatingWallet = useSelector(selectIsDeactivatingWallet);
    const createdWallet = useSelector(selectCreatedWallet);
    const userWallets = useSelector(selectUserWallets);
    const createWalletError = useSelector(selectCreateWalletError);
    const loadUserWalletsError = useSelector(selectLoadUserWalletsError);
    const deactivateWalletError = useSelector(selectDeactivateWalletError);
    const validationError = useSelector(selectValidationError);
    const availableCryptoTypes = useSelector(selectAvailableCryptoTypes);
    const walletErrors = useSelector(selectWalletErrors);
    const walletLoading = useSelector(selectWalletLoading);

    // ========== ACCIONES PRINCIPALES ==========

    /**
     * Crea un nuevo wallet crypto para un usuario
     */
    const createWallet = useCallback(
        async (usuarioId: number, walletData: CreateCryptoWalletDto) => {
            const result = await dispatch(
                createCryptoWallet({ usuarioId, walletData }) as any
            );
            return result;
        },
        [dispatch]
    );

    /**
     * Carga los tipos de criptomonedas disponibles
     */
    const loadCryptoTypes = useCallback(async () => {
        const result = await dispatch(loadAvailableCryptoTypes() as any);
        return result;
    }, [dispatch]);

    /**
     * Carga todas las wallets de un usuario
     */
    const loadUserWallets = useCallback(
        async (usuarioId: number) => {
            const result = await dispatch(getUserWallets(usuarioId) as any);
            return result;
        },
        [dispatch]
    );

    /**
     * Desactiva (elimina) un wallet
     */
    const deleteWallet = useCallback(
        async (walletId: number) => {
            const result = await dispatch(deactivateWallet(walletId) as any);
            return result;
        },
        [dispatch]
    );

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
        return !!(createWalletError || loadUserWalletsError || deactivateWalletError || validationError);
    }, [createWalletError, loadUserWalletsError, deactivateWalletError, validationError]);

    /**
     * Obtiene todos los errores activos
     */
    const getAllErrors = useCallback((): string[] => {
        const errors: string[] = [];
        if (createWalletError) errors.push(createWalletError);
        if (loadUserWalletsError) errors.push(loadUserWalletsError);
        if (deactivateWalletError) errors.push(deactivateWalletError);
        if (validationError) errors.push(validationError);
        return errors;
    }, [createWalletError, loadUserWalletsError, deactivateWalletError, validationError]);

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
        isLoading: isCreatingWallet || isLoadingUserWallets || isDeactivatingWallet,
        loading: walletLoading,

        // Datos
        createdWallet,
        userWallets,
        availableCryptoTypes,

        // Errores
        createWalletError,
        loadUserWalletsError,
        deactivateWalletError,
        validationError,
        errors: walletErrors,
        hasErrors: hasErrors(),
        allErrors: getAllErrors(),

        // Acciones principales
        createWallet,
        loadCryptoTypes,
        loadUserWallets,
        deleteWallet,

        // Acciones de limpieza
        clearCreateError,
        clearLoadWalletsError,
        clearDeactivateError,
        clearValidationError: clearValidationErr,
        clearWallet,
        clearWallets,
        clearAllWalletData,
        setValidationError: setValidationErr,
        resetWalletState,

        // Funciones auxiliares
        validateWallet,
        getCryptoName,
        getCryptoOptions,
        isCryptoAvailable,

        // Tipos disponibles (para fácil acceso)
        TipoCrypto,
    };
};

export default useWallet;