/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { EventoDeportivoResponse, EventosEnVivoResponse } from '../types/EventosType';
import {
    // Thunks
    getEventosEnVivo,
    getEventosFuturos,
    getEventoDetail,
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
    selectIsLoadingEventosFuturos,
    selectEventosFuturos,
    selectLoadEventosFuturosError,
    selectFiltros,
    selectOrdenamiento,
    selectUltimaActualizacion,
    selectEventosEnVivoFiltrados,
    selectEventosEnVivoPorLiga,
    selectEventosEnVivoStats,
    selectEventosErrors,
    selectEventosLoading,
    selectLigasPorDeporte,
    selectIsLoadingLigasPorDeporte,
    selectLoadLigasPorDeporteError,
    selectIsLoadingEventoDetail,
    selectLoadEventoDetailError,
    selectEventoDetail,
    // Types
    // Helpers
    getEventoNombreFormateado,
    getEventoResultadoFormateado,
    getEventoTiempoFormateado,
    getLigasPorDeporte,
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
    const isLoadingEventosFuturos = useSelector(selectIsLoadingEventosFuturos);
    const eventosFuturos = useSelector(selectEventosFuturos);
    const loadEventosFuturosError = useSelector(selectLoadEventosFuturosError);
    const filtros = useSelector(selectFiltros);
    const ordenamiento = useSelector(selectOrdenamiento);
    const ultimaActualizacion = useSelector(selectUltimaActualizacion);
    const eventosEnVivoFiltrados = useSelector(selectEventosEnVivoFiltrados);
    const eventosEnVivoPorLiga = useSelector(selectEventosEnVivoPorLiga);
    const eventosStats = useSelector(selectEventosEnVivoStats);
    const eventosErrors = useSelector(selectEventosErrors);
    const eventosLoading = useSelector(selectEventosLoading);
    const ligasPorDeporte = useSelector(selectLigasPorDeporte);
    const isLoadingLigasPorDeporte = useSelector(selectIsLoadingLigasPorDeporte);
    const loadLigasPorDeporteError = useSelector(selectLoadLigasPorDeporteError);
    const eventoDetail = useSelector(selectEventoDetail);
    const isLoadingEventoDetail = useSelector(selectIsLoadingEventoDetail);
    const loadEventoDetailError = useSelector(selectLoadEventoDetailError);

    // ========== ACCIONES PRINCIPALES ==========

    /**
     * Cargar evento por nombre desde el servidor
     */
    const loadEventoPorNombre = useCallback(async (nombre: string) => {
        const result = await dispatch(getEventoDetail(nombre) as any);
        return result;
    }, [dispatch]);

    /**
     * Carga ligas por deporte desde el servidor
     */
    const loadLigasPorDeporte = useCallback(async (deporte: string) => {
        const result = await dispatch(getLigasPorDeporte(deporte) as any);
        return result;
    }, [dispatch]);

    /**
     * Carga eventos futuros desde el servidor
     */
    const loadEventosFuturos = useCallback(async (ligaNombre: string) => {
        const result = await dispatch(getEventosFuturos(ligaNombre) as any);
        return result;
    }, [dispatch]);

    // ========== OBJETO PARA MANEJO DE LIGAS POR DEPORTE ==========

    /**
     * Objeto especializado para gestionar ligas por deporte
     * Proporciona funcionalidades completas para cargar y manejar ligas
     */
    const ligasManager = {
        /**
         * Carga ligas para un deporte específico
         */
        cargarLigas: async (deporte: string) => {
            return await loadLigasPorDeporte(deporte);
        },

        /**
         * Obtiene las ligas actualmente cargadas
         */
        obtenerLigasCargadas: () => ligasPorDeporte,

        /**
         * Verifica si hay ligas cargadas
         */
        hayLigasCargadas: () => Array.isArray(ligasPorDeporte) && ligasPorDeporte.length > 0,

        /**
         * Obtiene solo las ligas activas
         */
        obtenerLigasActivas: () => {
            if (!Array.isArray(ligasPorDeporte)) return [];
            return ligasPorDeporte.filter(liga => liga.activa);
        },

        /**
         * Busca una liga específica por ID
         */
        buscarLigaPorId: (id: number) => {
            if (!Array.isArray(ligasPorDeporte)) return undefined;
            return ligasPorDeporte.find(liga => liga.id === id);
        },

        /**
         * Busca ligas por nombre (coincidencia parcial, case insensitive)
         */
        buscarLigasPorNombre: (nombre: string) => {
            if (!Array.isArray(ligasPorDeporte)) return [];
            return ligasPorDeporte.filter(liga =>
                liga.nombre.toLowerCase().includes(nombre.toLowerCase())
            );
        },

        /**
         * Filtra ligas por país
         */
        filtrarLigasPorPais: (pais: string) => {
            if (!Array.isArray(ligasPorDeporte)) return [];
            return ligasPorDeporte.filter(liga =>
                liga.pais.name.toLowerCase().includes(pais.toLowerCase())
            );
        },

        /**
         * Obtiene países únicos de las ligas cargadas
         */
        obtenerPaisesDisponibles: () => {
            if (!Array.isArray(ligasPorDeporte)) return [];
            const paises = new Set(ligasPorDeporte.map(liga => liga.pais));
            return Array.from(paises).sort();
        },

        /**
         * Obtiene estadísticas de las ligas cargadas
         */
        obtenerEstadisticas: () => {
            if (!Array.isArray(ligasPorDeporte)) return {
                total: 0,
                activas: 0,
                inactivas: 0,
                paises: 0
            };

            const activas = ligasPorDeporte.filter(liga => liga.activa).length;
            const paises = new Set(ligasPorDeporte.map(liga => liga.pais)).size;

            return {
                total: ligasPorDeporte.length,
                activas,
                inactivas: ligasPorDeporte.length - activas,
                paises
            };
        },

        /**
         * Verifica si está cargando ligas
         */
        estaCargando: () => isLoadingLigasPorDeporte,

        /**
         * Obtiene el error de carga actual
         */
        obtenerError: () => loadLigasPorDeporteError,

        /**
         * Verifica si hay errores
         */
        hayError: () => !!loadLigasPorDeporteError,

        /**
         * Formatea una liga para mostrar en UI
         */
        formatearLiga: (liga: any) => ({
            id: liga.id,
            nombre: liga.nombreLiga,
            pais: liga.pais,
            bandera: liga.banderaPais,
            deporte: liga.deporte,
            activa: liga.activa,
            displayName: `${liga.nombreLiga} (${liga.pais})`
        }),

        /**
         * Ordena las ligas por diferentes criterios
         */
        ordenarLigas: (criterio: 'nombre' | 'pais' | 'id' = 'nombre') => {
            if (!Array.isArray(ligasPorDeporte)) return [];

            return [...ligasPorDeporte].sort((a, b) => {
                switch (criterio) {
                    case 'nombre':
                        return a.nombre.localeCompare(b.nombre);
                    case 'pais':
                        return a.pais.name.localeCompare(b.pais.name);
                    case 'id':
                        return a.id - b.id;
                    default:
                        return 0;
                }
            });
        }
    };

    // ========== OBJETO PARA MANEJO DE PAÍSES Y FILTRADO ==========

    /**
     * Objeto especializado para gestionar países y filtrar ligas por país
     * Proporciona funcionalidades completas para filtrar y manejar países
     */
    const paisesManager = {
        /**
         * Obtiene todos los países únicos de las ligas cargadas
         */
        obtenerTodosLosPaises: () => {
            if (!Array.isArray(ligasPorDeporte)) return [];
            const paises = new Set(ligasPorDeporte.map(liga => liga.pais));
            return Array.from(paises).sort();
        },

        /**
         * Filtra ligas por un país específico
         */
        filtrarLigasPorPais: (pais: string) => {
            if (!Array.isArray(ligasPorDeporte)) return [];
            return ligasPorDeporte.filter(liga =>
                liga.pais.name.toLowerCase().includes(pais.toLowerCase())
            );
        },

        /**
         * Filtra ligas por múltiples países
         */
        filtrarLigasPorPaises: (paises: string[]) => {
            if (!Array.isArray(ligasPorDeporte)) return [];
            const paisesLower = paises.map(p => p.toLowerCase());
            return ligasPorDeporte.filter(liga =>
                paisesLower.some(pais => liga.pais.name.toLowerCase().includes(pais))
            );
        },

        /**
         * Busca países por término de búsqueda (coincidencia parcial)
         */
        buscarPaises: (termino: string) => {
            const todosPaises = paisesManager.obtenerTodosLosPaises();
            return todosPaises.filter(pais =>
                pais.name.toLowerCase().includes(termino.toLowerCase())
            );
        },

        /**
         * Obtiene estadísticas de ligas por país
         */
        obtenerEstadisticasPorPais: () => {
            if (!Array.isArray(ligasPorDeporte)) return {};

            const estadisticas: { [pais: string]: { total: number; activas: number; inactivas: number } } = {};

            ligasPorDeporte.forEach(liga => {
                if (!estadisticas[liga.pais.name]) {
                    estadisticas[liga.pais.name] = { total: 0, activas: 0, inactivas: 0 };
                }
                estadisticas[liga.pais.name].total++;
                if (liga.activa) {
                    estadisticas[liga.pais.name].activas++;
                } else {
                    estadisticas[liga.pais.name].inactivas++;
                }
            });

            return estadisticas;
        },

        /**
         * Obtiene el top N países con más ligas
         */
        obtenerTopPaisesPorLigas: (limite: number = 10) => {
            const estadisticas = paisesManager.obtenerEstadisticasPorPais();

            return Object.entries(estadisticas)
                .map(([pais, stats]) => ({
                    pais,
                    ...stats
                }))
                .sort((a, b) => b.total - a.total)
                .slice(0, limite);
        },

        /**
         * Obtiene países que tienen ligas activas
         */
        obtenerPaisesConLigasActivas: () => {
            if (!Array.isArray(ligasPorDeporte)) return [];
            const paisesActivos = new Set(
                ligasPorDeporte
                    .filter(liga => liga.activa)
                    .map(liga => liga.pais)
            );
            return Array.from(paisesActivos).sort();
        },

        /**
         * Verifica si un país tiene ligas
         */
        paisTieneLigas: (pais: string) => {
            if (!Array.isArray(ligasPorDeporte)) return false;
            return ligasPorDeporte.some(liga =>
                liga.pais.name.toLowerCase() === pais.toLowerCase()
            );
        },

        /**
         * Obtiene el número de ligas por país
         */
        contarLigasPorPais: (pais: string) => {
            if (!Array.isArray(ligasPorDeporte)) return 0;
            return ligasPorDeporte.filter(liga =>
                liga.pais.name.toLowerCase() === pais.toLowerCase()
            ).length;
        },

        /**
         * Obtiene ligas activas de un país específico
         */
        obtenerLigasActivasPorPais: (pais: string) => {
            if (!Array.isArray(ligasPorDeporte)) return [];
            return ligasPorDeporte.filter(liga =>
                liga.pais.name.toLowerCase() === pais.toLowerCase() && liga.activa
            );
        },

        /**
         * Formatea información de país con estadísticas
         */
        formatearPaisConEstadisticas: (pais: string) => {
            const ligasPais = paisesManager.filtrarLigasPorPais(pais);
            const ligasActivas = ligasPais.filter(liga => liga.activa);

            return {
                nombre: pais,
                totalLigas: ligasPais.length,
                ligasActivas: ligasActivas.length,
                ligasInactivas: ligasPais.length - ligasActivas.length,
                ligas: ligasPais,
                banderaUrl: ligasPais.length > 0 ? ligasPais[0].logoUrl : '',
                displayName: `${pais} (${ligasPais.length} ligas)`
            };
        },

        /**
         * Obtiene resumen general de países
         */
        obtenerResumenPaises: () => {
            const todosPaises = paisesManager.obtenerTodosLosPaises();
            const paisesConLigasActivas = paisesManager.obtenerPaisesConLigasActivas();
            const estadisticas = paisesManager.obtenerEstadisticasPorPais();

            const totalLigas = Object.values(estadisticas).reduce((sum, stats) => sum + stats.total, 0);
            const totalLigasActivas = Object.values(estadisticas).reduce((sum, stats) => sum + stats.activas, 0);

            return {
                totalPaises: todosPaises.length,
                paisesConLigasActivas: paisesConLigasActivas.length,
                totalLigas,
                totalLigasActivas,
                promedioLigasPorPais: todosPaises.length > 0 ? (totalLigas / todosPaises.length).toFixed(2) : 0
            };
        }
    };

    // ========== OBJETO PARA MANEJO DE EVENTOS FUTUROS ==========

    /**
     * Objeto especializado para gestionar eventos futuros
     * Proporciona funcionalidades para cargar y filtrar eventos futuros
     */
    const eventosFuturosManager = {
        /**
         * Carga eventos futuros desde el servidor
         */
        cargarEventosFuturos: async (ligaNombre: string) => {
            return await loadEventosFuturos(ligaNombre);
        },

        /**
         * Obtiene los eventos futuros actualmente cargados
         */
        obtenerEventosFuturos: () => eventosFuturos,

        /**
         * Verifica si hay eventos futuros cargados
         */
        hayEventosFuturos: () => Array.isArray(eventosFuturos) && eventosFuturos.length > 0,

        /**
         * Filtra eventos futuros por liga específica
         */
        filtrarPorLiga: () => {
            return eventosFuturos
        },

        /**
         * Agrupa eventos futuros por fecha
         */
        agruparPorFecha: () => {
            if (!Array.isArray(eventosFuturos)) return {};

            const eventosPorFecha: { [fecha: string]: typeof eventosFuturos } = {};

            eventosFuturos.forEach(evento => {
                const fecha = new Date(evento.fixture.date).toDateString();
                if (!eventosPorFecha[fecha]) {
                    eventosPorFecha[fecha] = [];
                }
                eventosPorFecha[fecha].push(evento);
            });

            return eventosPorFecha;
        },

        /**
         * Verifica si está cargando eventos futuros
         */
        estaCargando: () => isLoadingEventosFuturos,

        /**
         * Obtiene el error de carga actual
         */
        obtenerError: () => loadEventosFuturosError,

        /**
         * Verifica si hay errores
         */
        hayError: () => !!loadEventosFuturosError,

        /**
         * Ordena eventos por fecha
         */
        ordenarPorFecha: (direccion: 'asc' | 'desc' = 'asc') => {
            if (!Array.isArray(eventosFuturos)) return [];

            return [...eventosFuturos].sort((a, b) => {
                const fechaA = new Date(a.fixture.date).getTime();
                const fechaB = new Date(b.fixture.date).getTime();
                return direccion === 'asc' ? fechaA - fechaB : fechaB - fechaA;
            });
        },
    };

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
        ligasPorDeporte,
        eventoDetail,

        // Objeto especializado para ligas
        ligasManager,

        // Objeto especializado para países
        paisesManager,

        // Objeto especializado para eventos futuros
        eventosFuturosManager,

        // Estados de carga
        isLoadingEventosEnVivo,
        isLoadingEventosFuturos,
        isLoading: eventosLoading.isLoading,
        loading: eventosLoading,
        isLoadingLigasPorDeporte,
        isLoadingEventoDetail,

        // Datos principales
        eventosEnVivo,
        eventosFuturos,
        eventosEnVivoFiltrados,
        eventosEnVivoPorLiga,
        eventosStats,

        // Estados de configuración
        filtros,
        ordenamiento,
        ultimaActualizacion,

        // Errores
        loadEventosEnVivoError,
        loadEventosFuturosError,
        loadLigasPorDeporteError,
        loadEventoDetailError,
        errors: eventosErrors,
        hasErrors: hasErrors(),
        allErrors: getAllErrors(),

        // Acciones principales
        loadEventosEnVivo,
        loadEventosFuturos,
        loadLigasPorDeporte,
        reloadEventosEnVivo,
        loadEventoPorNombre,

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
