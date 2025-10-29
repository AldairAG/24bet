/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    // Thunks,
    getEventosFuturosPorDeporte,
    getEventosFuturosPorLiga,
    getEventosEnVivoPorDeporte,
    getLigasPorDeporte,
    getEventoDetail,
    // Actions
    clearLoadEventosEnVivoError,
    clearEventosEnVivo,
    clearEventosData,
    // Selectors
    //eventos en vivo
    selectIsLoadingEventosEnVivo,
    selectEventosEnVivo,
    selectLoadEventosEnVivoError,
    //eventos futuros por deporte
    selectIsLoadingEventosFuturosPorDeporte,
    selectEventosFuturosPorDeporte,
    selectLoadEventosFuturosPorDeporteError,
    // eventos futuros por liga
    selectIsLoadingEventosFuturosPorLiga,
    selectEventosFuturosPorLiga,
    selectLoadEventosFuturosPorLigaError,
    //ligas por deporte
    selectLigasPorDeporte,
    selectIsLoadingLigasPorDeporte,
    selectLoadLigasPorDeporteError,
    //evento detail
    selectEventoDetail,
    selectIsLoadingEventoDetail,
    selectLoadEventoDetailError,
    // Types

} from '../store/slices/EventosSlice';

/**
 * Hook personalizado para la gestión de eventos deportivos en vivo
 * Basado en el endpoint "Obtiene todos los eventos en vivo" del EventoDeportivoController
 */
export const useEventos = () => {
    const dispatch = useDispatch();

    // ========== SELECTORES ==========
    //eventos en vivo
    const eventosEnVivo = useSelector(selectEventosEnVivo);
    const isLoadingEventosEnVivo = useSelector(selectIsLoadingEventosEnVivo);
    const loadEventosEnVivoError = useSelector(selectLoadEventosEnVivoError);
    //eventos futuros por deporte
    const isLoadingEventosFuturosPorDeporte = useSelector(selectIsLoadingEventosFuturosPorDeporte);
    const eventosFuturosPorDeporte = useSelector(selectEventosFuturosPorDeporte);
    const loadEventosFuturosPorDeporteError = useSelector(selectLoadEventosFuturosPorDeporteError);
    //eventos futuros por liga
    const eventosFuturosPorLiga = useSelector(selectEventosFuturosPorLiga);
    const isLoadingEventosFuturosPorLiga = useSelector(selectIsLoadingEventosFuturosPorLiga);
    const loadEventosFuturosPorLigaError = useSelector(selectLoadEventosFuturosPorLigaError);
    //ligas por deporte
    const ligasPorDeporte = useSelector(selectLigasPorDeporte);
    const isLoadingLigasPorDeporte = useSelector(selectIsLoadingLigasPorDeporte);
    const loadLigasPorDeporteError = useSelector(selectLoadLigasPorDeporteError);
    //evento detail
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
    const loadEventosFuturosPorLiga = useCallback(async (ligaNombre: string) => {
        const result = await dispatch(getEventosFuturosPorLiga(ligaNombre) as any);
        return result;
    }, [dispatch]);

    /**
     * Carga todos los eventos en vivo desde el servidor
     */
    const loadEventosEnVivoPorDeporte = useCallback(async (deporte: string) => {
        if (eventosFuturosPorDeporte.length > 0) {
            // Si ya hay eventos cargados, no hacer nada
            return;
        }
        const result = await dispatch(getEventosEnVivoPorDeporte(deporte) as any);
        return result;
    }, [dispatch]);

    /**
     * Carga eventos futuros por deporte desde el servidor
     */
    const loadEventosFuturosPorDeporte = useCallback(async (deporte: string) => {
        const result = await dispatch(getEventosFuturosPorDeporte(deporte) as any);
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

    const obtenerBanderaPorNombrePais = (nombrePais: string): string => {
        if (!nombrePais) return '';
        const pais = paisesManager.obtenerTodosLosPaises().find(p => p.name.toLowerCase() === nombrePais.toLowerCase());
        return pais ? pais.flagUrl : '';
    }

    /**
     * Recarga los eventos en vivo (útil para actualizaciones periódicas)
     */
    const reloadEventosEnVivoPorDeporte = useCallback(async (deporte: string) => {
        return await loadEventosEnVivoPorDeporte(deporte);
    }, [loadEventosEnVivoPorDeporte]);

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

    // ========== VALORES DE RETORNO ==========
    return {
        //eventos en vivo
        eventosEnVivo,
        isLoadingEventosEnVivo,
        loadEventosEnVivoError,
        loadEventosEnVivoPorDeporte,

        //eventos futuros por deporte
        eventosFuturosPorDeporte,
        isLoadingEventosFuturosPorDeporte,
        loadEventosFuturosPorDeporteError,
        loadEventosFuturosPorDeporte,

        //eventos futuros por liga
        eventosFuturosPorLiga,
        isLoadingEventosFuturosPorLiga,
        loadEventosFuturosPorLigaError,
        loadEventosFuturosPorLiga,

        //ligas por deporte
        ligasPorDeporte,
        isLoadingLigasPorDeporte,
        loadLigasPorDeporteError,
        loadLigasPorDeporte,

        //evento detail
        eventoDetail,
        isLoadingEventoDetail,
        loadEventoDetailError,
        loadEventoPorNombre,

        // Objeto especializado para ligas
        ligasManager,

        // Objeto especializado para países
        paisesManager,

        // Acciones principales
        reloadEventosEnVivoPorDeporte,
        obtenerBanderaPorNombrePais,

        // Acciones de limpieza
        clearLoadError,
        clearEventos,
        clearAllEventosData,

    };
};

export default useEventos;
