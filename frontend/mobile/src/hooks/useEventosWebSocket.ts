import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  // Thunks
  conectarWebSocket,
  desconectarWebSocket,
  reconectarWebSocket,
  suscribirseAEvento,
  desuscribirseDeEvento,
  
  // Actions
  seleccionarEvento,
  setFiltroLiga,
  setFiltroEstado,
  setFiltroBusqueda,
  setSoloActivos,
  limpiarFiltros,
  setAutoReconectar,
  limpiarError,
  resetEstado,
  
  // Selectores
  selectEventosWebSocket,
  selectConnectionStatus,
  selectConnectionStats,
  selectEventosEnVivo,
  selectEventosProximos,
  selectEventoSeleccionado,
  selectEventoEspecifico,
  selectMomiosActualizados,
  selectMomiosPorEvento,
  selectEstadisticas,
  selectSuscripcionesActivas,
  selectFiltros,
  selectConfiguracion,
  selectUltimaActualizacion,
  selectEventosFiltrados,
  selectResumenEstadisticas,
  
  // Types
  ConnectionStatus,
} from '../store/slices/eventosWebSocketSlice';
import { EventoDeportivo, Liga, Momio } from '../service/eventoService';

/**
 * Hook principal para manejar eventos deportivos con WebSocket
 * Basado completamente en el eventoService.ts
 */
export const useEventosWebSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectores del estado
  const estadoCompleto = useSelector(selectEventosWebSocket);
  const connectionStatus = useSelector(selectConnectionStatus);
  const connectionStats = useSelector(selectConnectionStats);
  const eventosEnVivo = useSelector(selectEventosEnVivo);
  const eventosProximos = useSelector(selectEventosProximos);
  const eventoSeleccionado = useSelector(selectEventoSeleccionado);
  const momiosActualizados = useSelector(selectMomiosActualizados);
  const estadisticas = useSelector(selectEstadisticas);
  const suscripcionesActivas = useSelector(selectSuscripcionesActivas);
  const filtros = useSelector(selectFiltros);
  const configuracion = useSelector(selectConfiguracion);
  const ultimaActualizacion = useSelector(selectUltimaActualizacion);
  const eventosFiltrados = useSelector(selectEventosFiltrados);
  const resumenEstadisticas = useSelector(selectResumenEstadisticas);

  // Ref para evitar conexiones múltiples
  const conectandoRef = useRef(false);

  // ========== FUNCIONES DE CONEXIÓN ==========
  const conectar = useCallback(async (): Promise<boolean> => {
    if (conectandoRef.current || connectionStatus === 'connected' || connectionStatus === 'connecting') {
      return connectionStatus === 'connected';
    }

    try {
      conectandoRef.current = true;
      await dispatch(conectarWebSocket()).unwrap();
      return true;
    } catch (error) {
      console.error('❌ Error conectando WebSocket:', error);
      return false;
    } finally {
      conectandoRef.current = false;
    }
  }, [dispatch, connectionStatus]);

  const desconectar = useCallback(async (): Promise<boolean> => {
    try {
      await dispatch(desconectarWebSocket()).unwrap();
      return true;
    } catch (error) {
      console.error('❌ Error desconectando WebSocket:', error);
      return false;
    }
  }, [dispatch]);

  const reconectar = useCallback(async (): Promise<boolean> => {
    try {
      await dispatch(reconectarWebSocket()).unwrap();
      return true;
    } catch (error) {
      console.error('❌ Error reconectando WebSocket:', error);
      return false;
    }
  }, [dispatch]);

  // ========== FUNCIONES DE SUSCRIPCIÓN ==========
  const suscribirseEvento = useCallback(async (eventoId: number): Promise<boolean> => {
    try {
      await dispatch(suscribirseAEvento({ eventoId })).unwrap();
      return true;
    } catch (error) {
      console.error(`❌ Error suscribiéndose al evento ${eventoId}:`, error);
      return false;
    }
  }, [dispatch]);

  const desuscribirseEvento = useCallback(async (eventoId: number): Promise<boolean> => {
    try {
      await dispatch(desuscribirseDeEvento({ eventoId })).unwrap();
      return true;
    } catch (error) {
      console.error(`❌ Error desuscribiéndose del evento ${eventoId}:`, error);
      return false;
    }
  }, [dispatch]);

  // ========== FUNCIONES DE EVENTOS ==========
  const seleccionar = useCallback((evento: EventoDeportivo | null) => {
    dispatch(seleccionarEvento(evento));
  }, [dispatch]);

  // ========== FUNCIONES DE FILTROS ==========
  const aplicarFiltroLiga = useCallback((liga: Liga | null) => {
    dispatch(setFiltroLiga(liga));
  }, [dispatch]);

  const aplicarFiltroEstado = useCallback((estado: EventoDeportivo['estado'] | null) => {
    dispatch(setFiltroEstado(estado));
  }, [dispatch]);

  const aplicarFiltroBusqueda = useCallback((busqueda: string) => {
    dispatch(setFiltroBusqueda(busqueda));
  }, [dispatch]);

  const toggleSoloActivos = useCallback(() => {
    dispatch(setSoloActivos(!filtros.soloActivos));
  }, [dispatch, filtros.soloActivos]);

  const limpiarTodosFiltros = useCallback(() => {
    dispatch(limpiarFiltros());
  }, [dispatch]);

  // ========== FUNCIONES DE CONFIGURACIÓN ==========
  const toggleAutoReconectar = useCallback(() => {
    dispatch(setAutoReconectar(!configuracion.autoReconectar));
  }, [dispatch, configuracion.autoReconectar]);

  // ========== FUNCIONES DE UTILIDAD ==========
  const limpiarErrores = useCallback(() => {
    dispatch(limpiarError());
  }, [dispatch]);

  const reiniciarEstado = useCallback(() => {
    dispatch(resetEstado());
  }, [dispatch]);

  // ========== FUNCIONES DE BÚSQUEDA Y FILTRADO ==========
  const buscarEventos = useCallback((termino: string): EventoDeportivo[] => {
    const todoLosEventos = [...eventosEnVivo, ...eventosProximos];
    
    if (!termino.trim()) {
      return todoLosEventos;
    }

    const terminoLower = termino.toLowerCase();
    return todoLosEventos.filter(evento => 
      evento.equipoLocal.toLowerCase().includes(terminoLower) ||
      evento.equipoVisitante.toLowerCase().includes(terminoLower) ||
      evento.liga.nombre.toLowerCase().includes(terminoLower)
    );
  }, [eventosEnVivo, eventosProximos]);

  const obtenerEventosPorLiga = useCallback((ligaId: number): EventoDeportivo[] => {
    const todoLosEventos = [...eventosEnVivo, ...eventosProximos];
    return todoLosEventos.filter(evento => evento.liga.id === ligaId);
  }, [eventosEnVivo, eventosProximos]);

  const obtenerEventosPorEstado = useCallback((estado: EventoDeportivo['estado']): EventoDeportivo[] => {
    const todoLosEventos = [...eventosEnVivo, ...eventosProximos];
    return todoLosEventos.filter(evento => evento.estado === estado);
  }, [eventosEnVivo, eventosProximos]);

  const obtenerMejoresMomios = useCallback((tipo: Momio['tipo'], limite: number = 10): Momio[] => {
    return momiosActualizados
      .filter(momio => momio.tipo === tipo && momio.activo)
      .sort((a, b) => b.cuota - a.cuota)
      .slice(0, limite);
  }, [momiosActualizados]);

  // ========== FUNCIONES DE VALIDACIÓN ==========
  const esEventoDisponible = useCallback((evento: EventoDeportivo): boolean => {
    return evento.estado !== 'FINALIZADO' && 
           evento.estado !== 'CANCELADO' &&
           evento.momios && 
           evento.momios.length > 0 &&
           evento.momios.some(momio => momio.activo);
  }, []);

  const estaConectado = useCallback((): boolean => {
    return connectionStatus === 'connected';
  }, [connectionStatus]);

  const estaReconectando = useCallback((): boolean => {
    return connectionStatus === 'reconnecting';
  }, [connectionStatus]);

  const tieneError = useCallback((): boolean => {
    return connectionStatus === 'error' || estadoCompleto.error !== null;
  }, [connectionStatus, estadoCompleto.error]);

  // ========== EFECTOS AUTOMÁTICOS ==========
  
  // Auto-conexión si está configurada
  useEffect(() => {
    let shouldConnect = true;

    const autoConectar = async () => {
      if (configuracion.autoReconectar && 
          connectionStatus === 'disconnected' && 
          shouldConnect && 
          !conectandoRef.current) {
        await conectar();
      }
    };

    autoConectar();

    return () => {
      shouldConnect = false;
    };
  }, [configuracion.autoReconectar, connectionStatus, conectar]);

  // Auto-reconexión en caso de error
  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    if (connectionStatus === 'error' && configuracion.autoReconectar) {
      reconnectTimeout = setTimeout(() => {
        if (connectionStatus === 'error') {
          reconectar();
        }
      }, configuracion.tiempoReintento);
    }

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [connectionStatus, configuracion.autoReconectar, configuracion.tiempoReintento, reconectar]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      // No desconectar automáticamente para preservar la conexión
      // entre componentes, pero limpiar errores
      limpiarErrores();
    };
  }, [limpiarErrores]);

  return {
    // ========== ESTADO ==========
    estado: estadoCompleto,
    connectionStatus,
    connectionStats,
    eventosEnVivo,
    eventosProximos,
    eventoSeleccionado,
    momiosActualizados,
    estadisticas,
    suscripcionesActivas,
    filtros,
    configuracion,
    ultimaActualizacion,
    eventosFiltrados,
    resumenEstadisticas,

    // ========== FUNCIONES DE CONEXIÓN ==========
    conectar,
    desconectar,
    reconectar,

    // ========== FUNCIONES DE SUSCRIPCIÓN ==========
    suscribirseEvento,
    desuscribirseEvento,

    // ========== FUNCIONES DE EVENTOS ==========
    seleccionar,

    // ========== FUNCIONES DE FILTROS ==========
    aplicarFiltroLiga,
    aplicarFiltroEstado,
    aplicarFiltroBusqueda,
    toggleSoloActivos,
    limpiarTodosFiltros,

    // ========== FUNCIONES DE CONFIGURACIÓN ==========
    toggleAutoReconectar,

    // ========== FUNCIONES DE UTILIDAD ==========
    limpiarErrores,
    reiniciarEstado,

    // ========== FUNCIONES DE BÚSQUEDA ==========
    buscarEventos,
    obtenerEventosPorLiga,
    obtenerEventosPorEstado,
    obtenerMejoresMomios,

    // ========== FUNCIONES DE VALIDACIÓN ==========
    esEventoDisponible,
    estaConectado,
    estaReconectando,
    tieneError,

    // ========== PROPIEDADES DE CONVENIENCIA ==========
    loading: estadoCompleto.loading,
    error: estadoCompleto.error,
    connected: connectionStatus === 'connected',
    reconnecting: connectionStatus === 'reconnecting',
    totalEventos: resumenEstadisticas.totalEventos,
    totalMomios: resumenEstadisticas.totalMomios,
  };
};

// ========== HOOKS ESPECIALIZADOS ==========

/**
 * Hook especializado para eventos en vivo únicamente
 */
export const useEventosEnVivo = () => {
  const { 
    eventosEnVivo, 
    conectar, 
    suscribirseEvento, 
    connectionStatus,
    momiosActualizados 
  } = useEventosWebSocket();

  const suscribirseATodosEventosEnVivo = useCallback(async (): Promise<boolean> => {
    const conectado = await conectar();
    if (!conectado) return false;

    // Suscribirse a todos los eventos en vivo
    const promesas = eventosEnVivo.map(evento => suscribirseEvento(evento.id));
    const resultados = await Promise.all(promesas);
    
    return resultados.every(resultado => resultado);
  }, [conectar, suscribirseEvento, eventosEnVivo]);

  const obtenerMomiosEnVivo = useCallback((eventoId: number): Momio[] => {
    return momiosActualizados.filter(momio => 
      momio.eventoDeportivoId === eventoId && momio.activo
    );
  }, [momiosActualizados]);

  return {
    eventosEnVivo,
    suscribirseATodosEventosEnVivo,
    obtenerMomiosEnVivo,
    connected: connectionStatus === 'connected',
    loading: connectionStatus === 'connecting',
  };
};

/**
 * Hook especializado para un evento específico
 */
export const useEventoEspecifico = (eventoId: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const evento = useSelector(selectEventoEspecifico(eventoId));
  const momiosEvento = useSelector(selectMomiosPorEvento(eventoId));
  const suscripciones = useSelector(selectSuscripcionesActivas);
  const { suscribirseEvento, desuscribirseEvento, connectionStatus } = useEventosWebSocket();

  const estaSuscrito = suscripciones.includes(eventoId);

  const suscribirse = useCallback(async (): Promise<boolean> => {
    if (estaSuscrito) return true;
    return await suscribirseEvento(eventoId);
  }, [suscribirseEvento, eventoId, estaSuscrito]);

  const desuscribirse = useCallback(async (): Promise<boolean> => {
    if (!estaSuscrito) return true;
    return await desuscribirseEvento(eventoId);
  }, [desuscribirseEvento, eventoId, estaSuscrito]);

  // Auto-suscripción al montar
  useEffect(() => {
    suscribirse();
    
    // Desuscribirse al desmontar
    return () => {
      desuscribirse();
    };
  }, [eventoId]); // Solo re-ejecutar si cambia el eventoId

  return {
    evento,
    momios: momiosEvento,
    estaSuscrito,
    suscribirse,
    desuscribirse,
    isLoading: !evento && connectionStatus === 'connected',
    connected: connectionStatus === 'connected',
  };
};

/**
 * Hook para estadísticas en tiempo real
 */
export const useEstadisticasEnTiempoReal = () => {
  const { estadisticas, resumenEstadisticas, conectar, ultimaActualizacion } = useEventosWebSocket();

  useEffect(() => {
    conectar(); // Asegurarse de estar conectado
  }, [conectar]);

  const tiempoTranscurrido = useCallback((tipo: 'eventos' | 'momios' | 'estadisticas'): number | null => {
    const timestamp = ultimaActualizacion[tipo];
    if (!timestamp) return null;
    
    return Date.now() - new Date(timestamp).getTime();
  }, [ultimaActualizacion]);

  return {
    estadisticas,
    resumen: resumenEstadisticas,
    ultimaActualizacion,
    tiempoTranscurrido,
  };
};

/**
 * Hook para manejo de filtros avanzados
 */
export const useFiltrosEventos = () => {
  const {
    filtros,
    eventosFiltrados,
    aplicarFiltroLiga,
    aplicarFiltroEstado,
    aplicarFiltroBusqueda,
    toggleSoloActivos,
    limpiarTodosFiltros,
  } = useEventosWebSocket();

  const aplicarFiltros = useCallback((nuevosFiltros: Partial<typeof filtros>) => {
    if (nuevosFiltros.liga !== undefined) aplicarFiltroLiga(nuevosFiltros.liga);
    if (nuevosFiltros.estado !== undefined) aplicarFiltroEstado(nuevosFiltros.estado);
    if (nuevosFiltros.busqueda !== undefined) aplicarFiltroBusqueda(nuevosFiltros.busqueda);
    if (nuevosFiltros.soloActivos !== undefined && nuevosFiltros.soloActivos !== filtros.soloActivos) {
      toggleSoloActivos();
    }
  }, [aplicarFiltroLiga, aplicarFiltroEstado, aplicarFiltroBusqueda, toggleSoloActivos, filtros.soloActivos]);

  return {
    filtros,
    eventosFiltrados,
    aplicarFiltros,
    aplicarFiltroLiga,
    aplicarFiltroEstado,
    aplicarFiltroBusqueda,
    toggleSoloActivos,
    limpiarTodosFiltros,
    totalFiltrados: eventosFiltrados.length,
  };
};

export default useEventosWebSocket;