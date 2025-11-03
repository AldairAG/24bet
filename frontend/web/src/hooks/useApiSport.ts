import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type{ AppDispatch, RootState } from '../store';
import {
    fetchEventoById,
    fetchHeadToHead,
    fetchTablaClasificacion,
    clearEventoActual,
    clearHistorialH2H,
    clearTablaClasificacion,
    clearErrors,
    clearAll,
    setError,
    selectEventoActual,
    selectLoadingEvento,
    selectErrorEvento,
    selectHistorialH2H,
    selectLoadingH2H,
    selectErrorH2H,
    selectTablaClasificacion,
    selectLoadingTabla,
    selectErrorTabla,
    selectIsLoading,
    selectError,
} from '../store/slices/apiSportSlice';
import type{ 
    EventoResponseApi, 
    HeadToHeadResponseApi, 
    StandingsApiResponse 
} from '../types/sportApiTypes';

// Interface para el hook
export interface UseApiSportReturn {
    // Estados
    eventoActual: EventoResponseApi | null;
    loadingEvento: boolean;
    errorEvento: string | null;
    
    historialH2H: HeadToHeadResponseApi[];
    loadingH2H: boolean;
    errorH2H: string | null;
    
    tablaClasificacion: StandingsApiResponse[];
    loadingTabla: boolean;
    errorTabla: string | null;
    
    isLoading: boolean;
    error: string | null;
    
    // Acciones asíncronas
    obtenerEventoPorId: (eventoId: number) => Promise<void>;
    obtenerHistorialH2H: (team1: number, team2: number) => Promise<void>;
    obtenerTablaClasificacion: (leagueId: number, season?: number) => Promise<void>;
    
    // Acciones síncronas
    limpiarEventoActual: () => void;
    limpiarHistorialH2H: () => void;
    limpiarTablaClasificacion: () => void;
    limpiarErrores: () => void;
    limpiarTodo: () => void;
    establecerError: (error: string) => void;
    
    // Funciones de utilidad
    refrescarEvento: () => Promise<void>;
    refrescarHistorialH2H: () => Promise<void>;
    refrescarTablaClasificacion: () => Promise<void>;
    hayDatos: boolean;
    hayErrores: boolean;
}

// Hook personalizado para manejar la API de deportes
export const useApiSport = (): UseApiSportReturn => {
    const dispatch = useDispatch<AppDispatch>();
    
    // Selectores de estado
    const eventoActual = useSelector((state: RootState) => selectEventoActual(state));
    const loadingEvento = useSelector((state: RootState) => selectLoadingEvento(state));
    const errorEvento = useSelector((state: RootState) => selectErrorEvento(state));
    
    const historialH2H = useSelector((state: RootState) => selectHistorialH2H(state));
    const loadingH2H = useSelector((state: RootState) => selectLoadingH2H(state));
    const errorH2H = useSelector((state: RootState) => selectErrorH2H(state));
    
    const tablaClasificacion = useSelector((state: RootState) => selectTablaClasificacion(state));
    const loadingTabla = useSelector((state: RootState) => selectLoadingTabla(state));
    const errorTabla = useSelector((state: RootState) => selectErrorTabla(state));
    
    const isLoading = useSelector((state: RootState) => selectIsLoading(state));
    const error = useSelector((state: RootState) => selectError(state));
    
    // Acciones asíncronas con manejo de errores
    const obtenerEventoPorId = useCallback(async (eventoId: number): Promise<void> => {
        try {
            await dispatch(fetchEventoById(eventoId)).unwrap();
        } catch (error) {
            console.error('Error al obtener evento por ID:', error);
            throw error;
        }
    }, [dispatch]);
    
    const obtenerHistorialH2H = useCallback(async (team1: number, team2: number): Promise<void> => {
        try {
            await dispatch(fetchHeadToHead({ team1, team2 })).unwrap();
        } catch (error) {
            console.error('Error al obtener historial H2H:', error);
            throw error;
        }
    }, [dispatch]);
    
    const obtenerTablaClasificacion = useCallback(async (leagueId: number, season: number = 2025): Promise<void> => {
        try {
            await dispatch(fetchTablaClasificacion({ leagueId, season })).unwrap();
        } catch (error) {
            console.error('Error al obtener tabla de clasificación:', error);
            throw error;
        }
    }, [dispatch]);
    
    // Acciones síncronas
    const limpiarEventoActual = useCallback(() => {
        dispatch(clearEventoActual());
    }, [dispatch]);
    
    const limpiarHistorialH2H = useCallback(() => {
        dispatch(clearHistorialH2H());
    }, [dispatch]);
    
    const limpiarTablaClasificacion = useCallback(() => {
        dispatch(clearTablaClasificacion());
    }, [dispatch]);
    
    const limpiarErrores = useCallback(() => {
        dispatch(clearErrors());
    }, [dispatch]);
    
    const limpiarTodo = useCallback(() => {
        dispatch(clearAll());
    }, [dispatch]);
    
    const establecerError = useCallback((errorMessage: string) => {
        dispatch(setError(errorMessage));
    }, [dispatch]);
    
    // Funciones de utilidad para refrescar datos
    const refrescarEvento = useCallback(async (): Promise<void> => {
        if (eventoActual?.fixture.id) {
            await obtenerEventoPorId(eventoActual.fixture.id);
        }
    }, [eventoActual, obtenerEventoPorId]);
    
    const refrescarHistorialH2H = useCallback(async (): Promise<void> => {
        if (eventoActual?.teams.home.id && eventoActual?.teams.away.id) {
            await obtenerHistorialH2H(eventoActual.teams.home.id, eventoActual.teams.away.id);
        }
    }, [eventoActual, obtenerHistorialH2H]);
    
    const refrescarTablaClasificacion = useCallback(async (): Promise<void> => {
        if (eventoActual?.league.id) {
            await obtenerTablaClasificacion(eventoActual.league.id, eventoActual.league.season);
        }
    }, [eventoActual, obtenerTablaClasificacion]);
    
    // Computed properties para facilitar el uso
    const hayDatos = Boolean(
        eventoActual || 
        historialH2H.length > 0 || 
        tablaClasificacion.length > 0
    );
    
    const hayErrores = Boolean(
        error || 
        errorEvento || 
        errorH2H || 
        errorTabla
    );
    
    return {
        // Estados
        eventoActual,
        loadingEvento,
        errorEvento,
        historialH2H,
        loadingH2H,
        errorH2H,
        tablaClasificacion,
        loadingTabla,
        errorTabla,
        isLoading,
        error,
        
        // Acciones asíncronas
        obtenerEventoPorId,
        obtenerHistorialH2H,
        obtenerTablaClasificacion,
        
        // Acciones síncronas
        limpiarEventoActual,
        limpiarHistorialH2H,
        limpiarTablaClasificacion,
        limpiarErrores,
        limpiarTodo,
        establecerError,
        
        // Funciones de utilidad
        refrescarEvento,
        refrescarHistorialH2H,
        refrescarTablaClasificacion,
        hayDatos,
        hayErrores,
    };
};

export default useApiSport;
