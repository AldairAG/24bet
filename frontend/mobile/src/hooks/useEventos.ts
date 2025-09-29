import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EventoDeportivoResponse, EventosEnVivoResponse } from '../types/EventosType';
import {
    // Thunks
    getEventosEnVivo,
    getEventosFuturos,
    // Actions
    clearLoadEventosEnVivoError,
    clearLoadEventosFuturosError,
    clearEventosEnVivo,
    clearEventosData,
    // Selectors
    selectEventosState,
    selectIsLoadingEventosEnVivo,
    selectEventosEnVivo,
    selectLoadEventosEnVivoError,
    selectIsLoadingEventosFuturos,
    selectEventosFuturos,
    selectLoadEventosFuturosError,
    selectUltimaActualizacion,
    selectEventosErrors,
    selectEventosLoading,
    selectLigasPorDeporte,
    selectIsLoadingLigasPorDeporte,
    selectLoadLigasPorDeporteError,
    // Types
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
    const ultimaActualizacion = useSelector(selectUltimaActualizacion);
    const eventosErrors = useSelector(selectEventosErrors);
    const eventosLoading = useSelector(selectEventosLoading);
    const ligasPorDeporte = useSelector(selectLigasPorDeporte);
    const isLoadingLigasPorDeporte = useSelector(selectIsLoadingLigasPorDeporte);
    const loadLigasPorDeporteError = useSelector(selectLoadLigasPorDeporteError);

    // ========== ACCIONES PRINCIPALES ==========

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
            const paises = new Set(ligasPorDeporte.map(liga => liga.pais.name));
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
            const paises = new Set(ligasPorDeporte.map(liga => liga.pais.name)).size;

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
            displayName: `${liga.nombreLiga} (${liga.pais.name})`
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
            const paises = new Set(ligasPorDeporte.map(liga => liga.pais.name));
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
                pais.toLowerCase().includes(termino.toLowerCase())
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
                    .map(liga => liga.pais.name)
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
         * Agrupa las ligas por país
         */
        agruparLigasPorPais: () => {
            if (!Array.isArray(ligasPorDeporte)) return {};
            
            return ligasPorDeporte.reduce((grupos, liga) => {
                const pais = liga.pais.name;
                if (!grupos[pais]) {
                    grupos[pais] = [];
                }
                grupos[pais].push(liga);
                return grupos;
            }, {} as { [pais: string]: typeof ligasPorDeporte });
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
                banderaUrl: ligasPais.length > 0 ? ligasPais[0].pais.flagUrl : '',
                displayName: `${pais} (${ligasPais.length} ligas)`
            };
        },

        /**
         * Obtiene países ordenados por diferentes criterios
         */
        ordenarPaises: (criterio: 'nombre' | 'totalLigas' | 'ligasActivas' = 'nombre') => {
            const paises = paisesManager.obtenerTodosLosPaises();
            
            if (criterio === 'nombre') {
                return paises.sort();
            }
            
            const paisesConStats = paises.map(pais => 
                paisesManager.formatearPaisConEstadisticas(pais)
            );
            
            switch (criterio) {
                case 'totalLigas':
                    return paisesConStats
                        .sort((a, b) => b.totalLigas - a.totalLigas)
                        .map(p => p.nombre);
                case 'ligasActivas':
                    return paisesConStats
                        .sort((a, b) => b.ligasActivas - a.ligasActivas)
                        .map(p => p.nombre);
                default:
                    return paises.sort();
            }
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
        filtrarPorLiga: (ligaNombre: string) => {
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

    // ========== FUNCIONES DE VALIDACIÓN ==========

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

        // Datos principales
        eventosEnVivo,
        eventosFuturos,
        ultimaActualizacion,

        // Errores
        loadEventosEnVivoError,
        loadEventosFuturosError,
        loadLigasPorDeporteError,
        errors: eventosErrors,
        hasErrors: hasErrors(),
        allErrors: getAllErrors(),

        // Acciones principales
        loadEventosEnVivo,
        loadEventosFuturos,
        loadLigasPorDeporte,
        reloadEventosEnVivo,

        // Acciones de limpieza
        clearLoadError,
        clearEventos,
        clearAllEventosData,
        resetEventosState,

        // Funciones de utilidad
        searchEventos,
        filterByDeporte,
        filterByPais,
        getEventosActualmenteEnVivo,
        sortEventosByFecha,
        findEventoById,
        autoLoadEventos,
    };
};

export default useEventos;
