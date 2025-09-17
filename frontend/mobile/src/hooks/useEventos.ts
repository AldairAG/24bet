import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  // Thunks
  conectarWebSocket,
  desconectarWebSocket,
  suscribirseAEvento,
  desuscribirseDeEvento,
  reconectarWebSocket,
  
  // Actions
  setEventoSeleccionado,
  setFiltroLiga,
  setFiltroEstado,
  setFiltroFechas,
  clearFiltros,
  setActualizacionAutomatica,
  setNotificacionesPush,
  setTipoNotificaciones,
  clearError,
  resetEventosState,
  
  // Selectores
  selectEventosState,
  selectConnectionState,
  selectEventosEnVivo,
  selectEventosProximos,
  selectEventoSeleccionado,
  selectEventoEspecifico,
  selectMomios,
  selectMomiosPorEvento,
  selectEstadisticas,
  selectFiltros,
  selectConfiguracion,
  selectEventosFiltrados,
  selectEstadisticasResumen,
} from '../store/slices/eventosSlice';
import { EventoDeportivo, Liga, Momio } from '../service/eventoService';

/**
 * Hook personalizado para manejar eventos deportivos en tiempo real
 * Proporciona funcionalidad completa para WebSocket, filtros y estados
 */
export const useEventos = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectores del estado
  const estadoCompleto = useSelector(selectEventosState);
  const estadoConexion = useSelector(selectConnectionState);
  const eventosEnVivo = useSelector(selectEventosEnVivo);
  const eventosProximos = useSelector(selectEventosProximos);
  const eventoSeleccionado = useSelector(selectEventoSeleccionado);
  const momios = useSelector(selectMomios);
  const estadisticas = useSelector(selectEstadisticas);
  const filtros = useSelector(selectFiltros);
  const configuracion = useSelector(selectConfiguracion);
  const eventosFiltrados = useSelector(selectEventosFiltrados);
  const estadisticasResumen = useSelector(selectEstadisticasResumen);

  // Funciones de conexión WebSocket
  const conectar = useCallback(async () => {
    try {
      await dispatch(conectarWebSocket()).unwrap();
      return true;
    } catch (error) {
      console.error('Error conectando WebSocket:', error);
      return false;
    }
  }, [dispatch]);

  const desconectar = useCallback(async () => {
    try {
      await dispatch(desconectarWebSocket()).unwrap();
      return true;
    } catch (error) {
      console.error('Error desconectando WebSocket:', error);
      return false;
    }
  }, [dispatch]);

  const reconectar = useCallback(async () => {
    try {
      await dispatch(reconectarWebSocket()).unwrap();
      return true;
    } catch (error) {
      console.error('Error reconectando WebSocket:', error);
      return false;
    }
  }, [dispatch]);

  // Funciones de suscripción a eventos específicos
  const suscribirseEvento = useCallback(async (eventoId: number) => {
    try {
      await dispatch(suscribirseAEvento(eventoId)).unwrap();
      return true;
    } catch (error) {
      console.error('Error suscribiéndose al evento:', error);
      return false;
    }
  }, [dispatch]);

  const desuscribirseEvento = useCallback(async (eventoId: number) => {
    try {
      await dispatch(desuscribirseDeEvento(eventoId)).unwrap();
      return true;
    } catch (error) {
      console.error('Error desuscribiéndose del evento:', error);
      return false;
    }
  }, [dispatch]);

  // Funciones de selección de eventos
  const seleccionarEvento = useCallback((evento: EventoDeportivo | null) => {
    dispatch(setEventoSeleccionado(evento));
  }, [dispatch]);

  // Funciones de filtrado
  const aplicarFiltroLiga = useCallback((liga: Liga | null) => {
    dispatch(setFiltroLiga(liga));
  }, [dispatch]);

  const aplicarFiltroEstado = useCallback((estado: EventoDeportivo['estado'] | null) => {
    dispatch(setFiltroEstado(estado));
  }, [dispatch]);

  const aplicarFiltroFechas = useCallback((fechaInicio: string | null, fechaFin: string | null) => {
    dispatch(setFiltroFechas({ fechaInicio, fechaFin }));
  }, [dispatch]);

  const limpiarFiltros = useCallback(() => {
    dispatch(clearFiltros());
  }, [dispatch]);

  // Funciones de configuración
  const toggleActualizacionAutomatica = useCallback(() => {
    dispatch(setActualizacionAutomatica(!configuracion.actualizacionAutomatica));
  }, [dispatch, configuracion.actualizacionAutomatica]);

  const toggleNotificacionesPush = useCallback(() => {
    dispatch(setNotificacionesPush(!configuracion.notificacionesPush));
  }, [dispatch, configuracion.notificacionesPush]);

  const actualizarTipoNotificaciones = useCallback((tipos: ('momios' | 'eventos' | 'resultados')[]) => {
    dispatch(setTipoNotificaciones(tipos));
  }, [dispatch]);

  // Funciones de utilidad
  const limpiarError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetearEstado = useCallback(() => {
    dispatch(resetEventosState());
  }, [dispatch]);

  // Hook para obtener evento específico
  const useEventoEspecifico = useCallback((eventoId: number) => {
    return useSelector(selectEventoEspecifico(eventoId));
  }, []);

  // Hook para obtener momios de un evento específico
  const useMomiosPorEvento = useCallback((eventoId: number) => {
    return useSelector(selectMomiosPorEvento(eventoId));
  }, []);

  // Funciones de búsqueda y filtrado avanzado
  const buscarEventos = useCallback((termino: string): EventoDeportivo[] => {
    const todoLosEventos = [...eventosEnVivo, ...eventosProximos];
    
    if (!termino.trim()) {
      return todoLosEventos;
    }

    const terminoLower = termino.toLowerCase();
    return todoLosEventos.filter(evento => 
      evento.nombre.toLowerCase().includes(terminoLower) ||
      evento.equipoLocal?.toLowerCase().includes(terminoLower) ||
      evento.equipoVisitante?.toLowerCase().includes(terminoLower) ||
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

  // Función para obtener mejores momios
  const obtenerMejoresMomios = useCallback((tipo: string): Momio[] => {
    return momios
      .filter(momio => momio.tipo === tipo && momio.activo)
      .sort((a, b) => b.cuota - a.cuota)
      .slice(0, 10);
  }, [momios]);

  // Función para validar si un evento está disponible para apuestas
  const esEventoDisponible = useCallback((evento: EventoDeportivo): boolean => {
    return evento.estado !== 'FINALIZADO' && 
           evento.estado !== 'CANCELADO' &&
           evento.momios && 
           evento.momios.length > 0 &&
           evento.momios.some(momio => momio.activo);
  }, []);

  // Auto-conexión al montar el componente
  useEffect(() => {
    let shouldConnect = true;

    const autoConectar = async () => {
      if (configuracion.actualizacionAutomatica && !estadoConexion.connected && shouldConnect) {
        await conectar();
      }
    };

    autoConectar();

    // Cleanup
    return () => {
      shouldConnect = false;
    };
  }, [configuracion.actualizacionAutomatica, estadoConexion.connected, conectar]);

  // Auto-reconexión en caso de pérdida de conexión
  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    if (estadoConexion.error && configuracion.actualizacionAutomatica) {
      reconnectTimeout = setTimeout(() => {
        if (!estadoConexion.connected) {
          reconectar();
        }
      }, 5000); // Intentar reconectar después de 5 segundos
    }

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [estadoConexion.error, estadoConexion.connected, configuracion.actualizacionAutomatica, reconectar]);

  return {
    // Estado
    estado: estadoCompleto,
    conexion: estadoConexion,
    eventosEnVivo,
    eventosProximos,
    eventoSeleccionado,
    momios,
    estadisticas,
    filtros,
    configuracion,
    eventosFiltrados,
    estadisticasResumen,

    // Funciones de conexión
    conectar,
    desconectar,
    reconectar,

    // Funciones de suscripción
    suscribirseEvento,
    desuscribirseEvento,

    // Funciones de selección
    seleccionarEvento,

    // Funciones de filtrado
    aplicarFiltroLiga,
    aplicarFiltroEstado,
    aplicarFiltroFechas,
    limpiarFiltros,

    // Funciones de configuración
    toggleActualizacionAutomatica,
    toggleNotificacionesPush,
    actualizarTipoNotificaciones,

    // Funciones de utilidad
    limpiarError,
    resetearEstado,

    // Hooks especializados
    useEventoEspecifico,
    useMomiosPorEvento,

    // Funciones de búsqueda
    buscarEventos,
    obtenerEventosPorLiga,
    obtenerEventosPorEstado,
    obtenerMejoresMomios,

    // Funciones de validación
    esEventoDisponible,

    // Estado de carga y errores
    loading: estadoCompleto.loading,
    error: estadoCompleto.error,
    connected: estadoConexion.connected,
    reconnecting: estadoConexion.reconnecting,
  };
};

// Hook especializado para eventos en vivo
export const useEventosEnVivo = () => {
  const { eventosEnVivo, conectar, suscribirseEvento } = useEventos();

  const suscribirseAEventosEnVivo = useCallback(async () => {
    const conectado = await conectar();
    if (conectado) {
      // Suscribirse a todos los eventos en vivo
      eventosEnVivo.forEach(evento => {
        suscribirseEvento(evento.id);
      });
    }
    return conectado;
  }, [conectar, suscribirseEvento, eventosEnVivo]);

  return {
    eventosEnVivo,
    suscribirseAEventosEnVivo,
  };
};

// Hook especializado para un evento específico
export const useEventoEspecifico = (eventoId: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const evento = useSelector(selectEventoEspecifico(eventoId));
  const momiosEvento = useSelector(selectMomiosPorEvento(eventoId));
  const { suscribirseEvento, desuscribirseEvento } = useEventos();

  useEffect(() => {
    // Auto-suscribirse al montar
    suscribirseEvento(eventoId);

    // Desuscribirse al desmontar
    return () => {
      desuscribirseEvento(eventoId);
    };
  }, [eventoId, suscribirseEvento, desuscribirseEvento]);

  return {
    evento,
    momios: momiosEvento,
    isLoading: !evento,
  };
};

// Hook para estadísticas en tiempo real
export const useEstadisticasEnTiempoReal = () => {
  const { estadisticas, estadisticasResumen, conectar } = useEventos();

  useEffect(() => {
    conectar(); // Asegurarse de estar conectado para recibir estadísticas
  }, [conectar]);

  return {
    estadisticas,
    resumen: estadisticasResumen,
  };
};

export default useEventos;
