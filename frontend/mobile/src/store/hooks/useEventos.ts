import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../index';
import {
  conectarWebSocket,
  desconectarWebSocket,
  suscribirseAEvento,
  desuscribirseDeEvento,
  reconectarWebSocket,
  setEventoSeleccionado,
  setFiltroLiga,
  setFiltroEstado,
  setFiltroFechas,
  clearFiltros,
  selectEventosState,
  selectConnectionState,
  selectEventosEnVivo,
  selectEventosProximos,
  selectEventoSeleccionado,
  selectMomios,
  selectEstadisticas,
  selectFiltros,
  selectConfiguracion,
  selectEventosFiltrados,
  selectEstadisticasResumen,
  selectEventoEspecifico,
  selectMomiosPorEvento,
  EventosState,
} from '../slices/eventosSlice';
import { EventoDeportivo, Liga } from '../../service/eventoService';

// Hook principal para manejar eventos deportivos
export const useEventosDeportivos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const eventosState = useSelector(selectEventosState);
  const connectionState = useSelector(selectConnectionState);
  
  // Conectar automáticamente al montar
  useEffect(() => {
    if (!connectionState.connected && !connectionState.reconnecting) {
      dispatch(conectarWebSocket());
    }
    
    // Desconectar al desmontar
    return () => {
      dispatch(desconectarWebSocket());
    };
  }, [dispatch]);
  
  // Funciones de conexión
  const conectar = () => dispatch(conectarWebSocket());
  const desconectar = () => dispatch(desconectarWebSocket());
  const reconectar = () => dispatch(reconectarWebSocket());
  
  return {
    // Estado
    ...eventosState,
    connectionState,
    
    // Acciones de conexión
    conectar,
    desconectar,
    reconectar,
  };
};

// Hook para eventos en vivo
export const useEventosEnVivo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const eventosEnVivo = useSelector(selectEventosEnVivo);
  const connected = useSelector(selectConnectionState).connected;
  
  useEffect(() => {
    if (!connected) {
      dispatch(conectarWebSocket());
    }
  }, [dispatch, connected]);
  
  return {
    eventosEnVivo,
    connected,
    count: eventosEnVivo.length,
  };
};

// Hook para eventos próximos
export const useEventosProximos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const eventosProximos = useSelector(selectEventosProximos);
  const connected = useSelector(selectConnectionState).connected;
  
  useEffect(() => {
    if (!connected) {
      dispatch(conectarWebSocket());
    }
  }, [dispatch, connected]);
  
  return {
    eventosProximos,
    connected,
    count: eventosProximos.length,
  };
};

// Hook para evento específico
export const useEventoEspecifico = (eventoId: number | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const eventoEspecifico = useSelector(selectEventoEspecifico(eventoId || 0));
  const momiosEvento = useSelector(selectMomiosPorEvento(eventoId || 0));
  
  useEffect(() => {
    if (eventoId) {
      dispatch(suscribirseAEvento(eventoId));
      
      return () => {
        dispatch(desuscribirseDeEvento(eventoId));
      };
    }
  }, [dispatch, eventoId]);
  
  return {
    evento: eventoEspecifico,
    momios: momiosEvento,
    suscrito: !!eventoEspecifico,
  };
};

// Hook para momios
export const useMomios = (eventoId?: number) => {
  const momiosGlobales = useSelector(selectMomios);
  const momiosEvento = useSelector(selectMomiosPorEvento(eventoId || 0));
  
  return {
    momiosGlobales,
    momiosEvento: eventoId ? momiosEvento : [],
    totalMomios: momiosGlobales.length,
  };
};

// Hook para estadísticas
export const useEstadisticasEventos = () => {
  const estadisticas = useSelector(selectEstadisticas);
  const estadisticasResumen = useSelector(selectEstadisticasResumen);
  
  return {
    estadisticas,
    resumen: estadisticasResumen,
  };
};

// Hook para filtros
export const useFiltrosEventos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filtros = useSelector(selectFiltros);
  const eventosFiltrados = useSelector(selectEventosFiltrados);
  
  const aplicarFiltroLiga = (liga: Liga | null) => {
    dispatch(setFiltroLiga(liga));
  };
  
  const aplicarFiltroEstado = (estado: EventoDeportivo['estado'] | null) => {
    dispatch(setFiltroEstado(estado));
  };
  
  const aplicarFiltroFechas = (fechaInicio: string | null, fechaFin: string | null) => {
    dispatch(setFiltroFechas({ fechaInicio, fechaFin }));
  };
  
  const limpiarFiltros = () => {
    dispatch(clearFiltros());
  };
  
  return {
    filtros,
    eventosFiltrados,
    aplicarFiltroLiga,
    aplicarFiltroEstado,
    aplicarFiltroFechas,
    limpiarFiltros,
    hayFiltrosActivos: !!(filtros.liga || filtros.estado || filtros.fechaInicio || filtros.fechaFin),
  };
};

// Hook para selección de eventos
export const useSeleccionEvento = () => {
  const dispatch = useDispatch<AppDispatch>();
  const eventoSeleccionado = useSelector(selectEventoSeleccionado);
  
  const seleccionarEvento = (evento: EventoDeportivo | null) => {
    dispatch(setEventoSeleccionado(evento));
  };
  
  return {
    eventoSeleccionado,
    seleccionarEvento,
    hayEventoSeleccionado: !!eventoSeleccionado,
  };
};

// Hook para configuración
export const useConfiguracionEventos = () => {
  const configuracion = useSelector(selectConfiguracion);
  
  return {
    configuracion,
    actualizacionAutomatica: configuracion.actualizacionAutomatica,
    notificacionesPush: configuracion.notificacionesPush,
    tipoNotificaciones: configuracion.tipoNotificaciones,
  };
};

// Hook compuesto para dashboard completo
export const useDashboardEventos = () => {
  const eventosEnVivo = useEventosEnVivo();
  const eventosProximos = useEventosProximos();
  const estadisticas = useEstadisticasEventos();
  const connectionState = useSelector(selectConnectionState);
  
  return {
    eventosEnVivo: eventosEnVivo.eventosEnVivo,
    eventosProximos: eventosProximos.eventosProximos,
    estadisticas: estadisticas.resumen,
    connectionState,
    totalEventos: eventosEnVivo.count + eventosProximos.count,
  };
};

// Hook para lista de eventos con paginación simple
export const useEventosConPaginacion = (pageSize: number = 10) => {
  const eventosFiltrados = useSelector(selectEventosFiltrados);
  
  const [currentPage, setCurrentPage] = React.useState(0);
  
  const totalPages = Math.ceil(eventosFiltrados.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const eventosActuales = eventosFiltrados.slice(startIndex, endIndex);
  
  const siguientePagina = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const paginaAnterior = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const irAPagina = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };
  
  return {
    eventos: eventosActuales,
    currentPage,
    totalPages,
    totalEventos: eventosFiltrados.length,
    hasNextPage: currentPage < totalPages - 1,
    hasPrevPage: currentPage > 0,
    siguientePagina,
    paginaAnterior,
    irAPagina,
  };
};