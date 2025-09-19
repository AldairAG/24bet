import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EventoDeportivoResponse, EventosEnVivoResponse } from '../types/EventosType';
import {
    // Thunks
    getEventosEnVivo,
    // Actions
    clearLoadEventosEnVivoError,
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
    // Selectors
    selectEventosState,
    selectIsLoadingEventosEnVivo,
    selectEventosEnVivo,
    selectLoadEventosEnVivoError,
    selectFiltros,
    selectOrdenamiento,
    selectUltimaActualizacion,
    selectEventosEnVivoFiltrados,
    selectEventosEnVivoPorLiga,
    selectEventosEnVivoStats,
    selectEventosErrors,
    selectEventosLoading,
    // Helpers
    getEventoNombreFormateado,
    getEventoResultadoFormateado,
    getEventoTiempoFormateado,
} from '../store/slices/EventosSlice';
import { eventosService } from '../service/EventosService';

/**
 * Hook personalizado para la gestión de eventos deportivos en vivo
 * Basado en el endpoint "Obtiene todos los eventos en vivo" del EventoDeportivoController
 */
export const useEventos = () => {
    const dispatch = useDispatch();

    // ========== SELECTORES ==========
    const eventosState = useSelector(selectEventosState);
    const isLoadingEventosEnVivo = useSelector(selectIsLoadingEventosEnVivo);
    const eventosEnVivo = useSelector(selectEventosEnVivo);
    const loadEventosEnVivoError = useSelector(selectLoadEventosEnVivoError);
    const filtros = useSelector(selectFiltros);
    const ordenamiento = useSelector(selectOrdenamiento);
    const ultimaActualizacion = useSelector(selectUltimaActualizacion);
    const eventosEnVivoFiltrados = useSelector(selectEventosEnVivoFiltrados);
    const eventosEnVivoPorLiga = useSelector(selectEventosEnVivoPorLiga);
    const eventosStats = useSelector(selectEventosEnVivoStats);
    const eventosErrors = useSelector(selectEventosErrors);
    const eventosLoading = useSelector(selectEventosLoading);

    // ========== ACCIONES PRINCIPALES ==========

    /**
     * Carga todos los eventos en vivo desde el servidor
     */
    const loadEventosEnVivo = useCallback(async () => {
        const result = await dispatch(getEventosEnVivo() as any);
        return result;
    }, [dispatch]);

    /**
     * Recarga los eventos en vivo (útil para actualizaciones periódicas)
     */
    const reloadEventosEnVivo = useCallback(async () => {
        return await loadEventosEnVivo();
    }, [loadEventosEnVivo]);

    // ========== ACCIONES DE LIMPIEZA ==========

    /**
     * Limpia el error de carga de eventos en vivo
     */
    const clearLoadError = useCallback(() => {
        dispatch(clearLoadEventosEnVivoError());
    }, [dispatch]);

    /**
     * Limpia la lista de eventos en vivo
     */
    const clearEventos = useCallback(() => {
        dispatch(clearEventosEnVivo());
    }, [dispatch]);

    /**
     * Limpia todos los datos de eventos (eventos, filtros, errores)
     */
    const clearAllEventosData = useCallback(() => {
        dispatch(clearEventosData());
    }, [dispatch]);

    // ========== ACCIONES DE FILTRADO ==========

    /**
     * Establece filtro por deporte
     */
    const setDeporteFilter = useCallback((deporte?: string) => {
        dispatch(setFiltroDeporte(deporte));
    }, [dispatch]);

    /**
     * Establece filtro por país
     */
    const setPaisFilter = useCallback((pais?: string) => {
        dispatch(setFiltroPais(pais));
    }, [dispatch]);

    /**
     * Establece término de búsqueda
     */
    const setSearchTerm = useCallback((termino?: string) => {
        dispatch(setTerminoBusqueda(termino));
    }, [dispatch]);

    /**
     * Limpia todos los filtros activos
     */
    const clearAllFilters = useCallback(() => {
        dispatch(clearFiltros());
    }, [dispatch]);

    // ========== ACCIONES DE ORDENAMIENTO ==========

    /**
     * Establece el ordenamiento de eventos
     */
    const setSorting = useCallback((campo: 'fecha' | 'nombre', direccion: 'asc' | 'desc') => {
        dispatch(setOrdenamiento({ campo, direccion }));
    }, [dispatch]);

    /**
     * Cambia la dirección del ordenamiento actual
     */
    const toggleSortDirection = useCallback(() => {
        dispatch(toggleDireccionOrdenamiento());
    }, [dispatch]);

    /**
     * Ordena por fecha (ascendente/descendente)
     */
    const sortByFecha = useCallback((direccion: 'asc' | 'desc' = 'asc') => {
        dispatch(setOrdenamiento({ campo: 'fecha', direccion }));
    }, [dispatch]);

    /**
     * Ordena por nombre del evento (ascendente/descendente)
     */
    const sortByNombre = useCallback((direccion: 'asc' | 'desc' = 'asc') => {
        dispatch(setOrdenamiento({ campo: 'nombre', direccion }));
    }, [dispatch]);

    // ========== ACTUALIZACIONES EN TIEMPO REAL ==========

    /**
     * Actualiza un evento específico
     */
    const updateEvento = useCallback((evento: EventoDeportivoResponse) => {
        dispatch(updateEventoEnVivo(evento));
    }, [dispatch]);

    /**
     * Actualiza el resultado y tiempo de un evento específico
     */
    const updateEventoResultado = useCallback((
        eventoId: number,
        resultadoLocal: number,
        resultadoVisitante: number,
        tiempoPartido?: string
    ) => {
        dispatch(updateResultadoEvento({
            eventoId,
            resultadoLocal,
            resultadoVisitante,
            tiempoPartido
        }));
    }, [dispatch]);

    // ========== FUNCIONES DE UTILIDAD ==========

    /**
     * Busca eventos por término específico
     */
    const searchEventos = useCallback((termino: string): EventosEnVivoResponse => {
        if (!Array.isArray(eventosEnVivo)) return [];
        return eventosService.searchEventos(eventosEnVivo, termino);
    }, [eventosEnVivo]);

    /**
     * Filtra eventos por deporte específico
     */
    const filterByDeporte = useCallback((deporte: string): EventosEnVivoResponse => {
        if (!Array.isArray(eventosEnVivo)) return [];
        return eventosService.filterEventosByDeporte(eventosEnVivo, deporte);
    }, [eventosEnVivo]);

    /**
     * Filtra eventos por país específico
     */
    const filterByPais = useCallback((pais: string): EventosEnVivoResponse => {
        if (!Array.isArray(eventosEnVivo)) return [];
        return eventosService.filterEventosByPais(eventosEnVivo, pais);
    }, [eventosEnVivo]);

    /**
     * Obtiene solo eventos que están realmente en vivo
     */
    const getEventosActualmenteEnVivo = useCallback((): EventosEnVivoResponse => {
        if (!Array.isArray(eventosEnVivo)) return [];
        return eventosService.filterEventosEnVivo(eventosEnVivo);
    }, [eventosEnVivo]);

    /**
     * Ordena eventos por fecha
     */
    const sortEventosByFecha = useCallback((direccion: 'asc' | 'desc' = 'asc'): EventosEnVivoResponse => {
        if (!Array.isArray(eventosEnVivo)) return [];
        return eventosService.sortEventosByFecha(eventosEnVivo, direccion);
    }, [eventosEnVivo]);

    // ========== FUNCIONES DE FORMATEO ==========

    /**
     * Formatea el nombre del evento para mostrar en UI
     */
    const formatEventoNombre = useCallback((evento: EventoDeportivoResponse): string => {
        return getEventoNombreFormateado(evento);
    }, []);

    /**
     * Formatea el resultado del evento para mostrar en UI
     */
    const formatEventoResultado = useCallback((evento: EventoDeportivoResponse): string => {
        return getEventoResultadoFormateado(evento);
    }, []);

    /**
     * Formatea el tiempo del partido para mostrar en UI
     */
    const formatEventoTiempo = useCallback((evento: EventoDeportivoResponse): string => {
        return getEventoTiempoFormateado(evento);
    }, []);

    // ========== FUNCIONES DE VALIDACIÓN ==========

    /**
     * Valida si un evento está realmente en vivo
     */
    const isEventoEnVivo = useCallback((evento: EventoDeportivoResponse): boolean => {
        return eventosService.validateEventoEnVivo(evento);
    }, []);

    /**
     * Verifica si hay eventos cargados
     */
    const hasEventos = useCallback((): boolean => {
        return Array.isArray(eventosEnVivo) && eventosEnVivo.length > 0;
    }, [eventosEnVivo]);

    /**
     * Verifica si hay filtros activos
     */
    const hasActiveFilters = useCallback((): boolean => {
        return !!(filtros?.deporte || filtros?.pais || filtros?.terminoBusqueda);
    }, [filtros]);

    /**
     * Verifica si hay errores activos
     */
    const hasErrors = useCallback((): boolean => {
        return eventosErrors?.hasErrors ?? false;
    }, [eventosErrors]);

    /**
     * Obtiene todos los errores activos
     */
    const getAllErrors = useCallback((): string[] => {
        const errors: string[] = [];
        if (loadEventosEnVivoError) errors.push(loadEventosEnVivoError);
        return errors;
    }, [loadEventosEnVivoError]);

    // ========== FUNCIONES AUXILIARES ==========

    /**
     * Obtiene deportes únicos de los eventos cargados
     */
    const getDeportesDisponibles = useCallback((): string[] => {
        if (!Array.isArray(eventosEnVivo)) return [];
        const deportes = new Set(eventosEnVivo.map(evento => evento.liga.deporte));
        return Array.from(deportes).sort();
    }, [eventosEnVivo]);

    /**
     * Obtiene países únicos de los eventos cargados
     */
    const getPaisesDisponibles = useCallback((): string[] => {
        if (!Array.isArray(eventosEnVivo)) return [];
        const paises = new Set(
            eventosEnVivo
                .map(evento => evento.pais || evento.liga.pais)
                .filter(pais => pais) // Filtrar valores undefined/null
        );
        return Array.from(paises).sort();
    }, [eventosEnVivo]);

    /**
     * Obtiene ligas únicas de los eventos cargados
     */
    const getLigasDisponibles = useCallback((): string[] => {
        if (!Array.isArray(eventosEnVivo)) return [];
        const ligas = new Set(eventosEnVivo.map(evento => evento.liga.nombre));
        return Array.from(ligas).sort();
    }, [eventosEnVivo]);

    /**
     * Busca un evento específico por ID
     */
    const findEventoById = useCallback((eventoId: number): EventoDeportivoResponse | undefined => {
        if (!Array.isArray(eventosEnVivo)) return undefined;
        return eventosEnVivo.find(evento => evento.id === eventoId);
    }, [eventosEnVivo]);

    /**
     * Resetea todos los estados a su valor inicial
     */
    const resetEventosState = useCallback(() => {
        dispatch(clearEventosData());
    }, [dispatch]);

    // ========== EFECTOS ==========

    /**
     * Carga automáticamente eventos al inicializar el hook (opcional)
     */
    const autoLoadEventos = useCallback((shouldAutoLoad: boolean = false) => {
        const eventosLength = Array.isArray(eventosEnVivo) ? eventosEnVivo.length : 0;
        if (shouldAutoLoad && eventosLength === 0 && !isLoadingEventosEnVivo) {
            loadEventosEnVivo();
        }
    }, [eventosEnVivo, isLoadingEventosEnVivo, loadEventosEnVivo]);

    // ========== VALORES DE RETORNO ==========
    return {
        // Estado completo
        eventosState,

        // Estados de carga
        isLoadingEventosEnVivo,
        isLoading: eventosLoading.isLoading,
        loading: eventosLoading,

        // Datos principales
        eventosEnVivo,
        eventosEnVivoFiltrados,
        eventosEnVivoPorLiga,
        eventosStats,

        // Estados de configuración
        filtros,
        ordenamiento,
        ultimaActualizacion,

        // Errores
        loadEventosEnVivoError,
        errors: eventosErrors,
        hasErrors: hasErrors(),
        allErrors: getAllErrors(),

        // Acciones principales
        loadEventosEnVivo,
        reloadEventosEnVivo,

        // Acciones de limpieza
        clearLoadError,
        clearEventos,
        clearAllEventosData,
        resetEventosState,

        // Acciones de filtrado
        setDeporteFilter,
        setPaisFilter,
        setSearchTerm,
        clearAllFilters,

        // Acciones de ordenamiento
        setSorting,
        toggleSortDirection,
        sortByFecha,
        sortByNombre,

        // Actualizaciones en tiempo real
        updateEvento,
        updateEventoResultado,

        // Funciones de utilidad
        searchEventos,
        filterByDeporte,
        filterByPais,
        getEventosActualmenteEnVivo,
        sortEventosByFecha,

        // Funciones de formateo
        formatEventoNombre,
        formatEventoResultado,
        formatEventoTiempo,

        // Funciones de validación
        isEventoEnVivo,
        hasEventos: hasEventos(),
        hasActiveFilters: hasActiveFilters(),

        // Funciones auxiliares
        getDeportesDisponibles,
        getPaisesDisponibles,
        getLigasDisponibles,
        findEventoById,
        autoLoadEventos,
    };
};

export default useEventos;
