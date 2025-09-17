import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  deportesWebSocketService, 
  EventoDeportivo, 
  Momio, 
  EstadisticasEventos, 
  Liga,
  EventoCallback,
  MomioCallback,
  EstadisticasCallback,
  EventoEspecificoCallback,
  ConexionCallback
} from '../../service/eventoService';

// Estados específicos del WebSocket
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

// Interface para el estado del slice
export interface EventosWebSocketState {
  // Estado de conexión WebSocket
  connectionStatus: ConnectionStatus;
  connectionError: string | null;
  connectionStats: {
    connected: boolean;
    subscriptions: number;
    activeEventSubscriptions: number;
    reconnecting: boolean;
  };
  
  // Eventos en tiempo real
  eventosEnVivo: EventoDeportivo[];
  eventosProximos: EventoDeportivo[];
  eventosEspecificos: { [eventoId: number]: EventoDeportivo };
  
  // Momios en tiempo real
  momiosActualizados: Momio[];
  momiosPorEvento: { [eventoId: number]: Momio[] };
  
  // Estadísticas en tiempo real
  estadisticas: EstadisticasEventos | null;
  
  // Evento seleccionado para detalle
  eventoSeleccionado: EventoDeportivo | null;
  
  // Suscripciones activas
  suscripcionesActivas: number[];
  
  // Control de la UI
  loading: boolean;
  error: string | null;
  
  // Configuración del WebSocket
  configuracion: {
    autoReconectar: boolean;
    intervaloPing: number;
    maxReintentos: number;
    tiempoReintento: number;
  };
  
  // Filtros aplicados
  filtros: {
    liga: Liga | null;
    estado: EventoDeportivo['estado'] | null;
    busqueda: string;
    soloActivos: boolean;
  };
  
  // Metadatos de última actualización
  ultimaActualizacion: {
    eventos: string | null;
    momios: string | null;
    estadisticas: string | null;
  };
}

// Estado inicial
const initialState: EventosWebSocketState = {
  // Estado de conexión
  connectionStatus: 'disconnected',
  connectionError: null,
  connectionStats: {
    connected: false,
    subscriptions: 0,
    activeEventSubscriptions: 0,
    reconnecting: false,
  },
  
  // Eventos
  eventosEnVivo: [],
  eventosProximos: [],
  eventosEspecificos: {},
  
  // Momios
  momiosActualizados: [],
  momiosPorEvento: {},
  
  // Estadísticas
  estadisticas: null,
  
  // Evento seleccionado
  eventoSeleccionado: null,
  
  // Suscripciones
  suscripcionesActivas: [],
  
  // UI
  loading: false,
  error: null,
  
  // Configuración
  configuracion: {
    autoReconectar: true,
    intervaloPing: 30000,
    maxReintentos: 5,
    tiempoReintento: 5000,
  },
  
  // Filtros
  filtros: {
    liga: null,
    estado: null,
    busqueda: '',
    soloActivos: true,
  },
  
  // Metadatos
  ultimaActualizacion: {
    eventos: null,
    momios: null,
    estadisticas: null,
  },
};

// ================================
// THUNKS ASÍNCRONOS
// ================================

/**
 * Conectar al WebSocket
 */
export const conectarWebSocket = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>(
  'eventosWebSocket/conectar',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setConnectionStatus('connecting'));
      
      // Conectar al WebSocket
      await deportesWebSocketService.connect();
      
      // Configurar callbacks del servicio
      deportesWebSocketService.onConexion((conectado: boolean) => {
        dispatch(setConnectionStats(deportesWebSocketService.getConnectionStats()));
        if (conectado) {
          dispatch(setConnectionStatus('connected'));
        } else {
          dispatch(setConnectionStatus('disconnected'));
        }
      });
      
      deportesWebSocketService.onEventosEnVivo((eventos: EventoDeportivo[]) => {
        dispatch(actualizarEventosEnVivo(eventos));
        dispatch(setUltimaActualizacion({ tipo: 'eventos', timestamp: new Date().toISOString() }));
      });
      
      deportesWebSocketService.onEventosProximos((eventos: EventoDeportivo[]) => {
        dispatch(actualizarEventosProximos(eventos));
      });
      
      deportesWebSocketService.onMomios((momios: Momio[]) => {
        dispatch(actualizarMomios(momios));
        dispatch(setUltimaActualizacion({ tipo: 'momios', timestamp: new Date().toISOString() }));
      });
      
      deportesWebSocketService.onEstadisticas((estadisticas: EstadisticasEventos) => {
        dispatch(actualizarEstadisticas(estadisticas));
        dispatch(setUltimaActualizacion({ tipo: 'estadisticas', timestamp: new Date().toISOString() }));
      });
      
      return true;
      
    } catch (error) {
      dispatch(setConnectionStatus('error'));
      return rejectWithValue(`Error conectando WebSocket: ${error}`);
    }
  }
);

/**
 * Desconectar del WebSocket
 */
export const desconectarWebSocket = createAsyncThunk<boolean, void>(
  'eventosWebSocket/desconectar',
  async (_, { dispatch }) => {
    deportesWebSocketService.disconnect();
    dispatch(setConnectionStatus('disconnected'));
    dispatch(limpiarEventosEspecificos());
    return false;
  }
);

/**
 * Reconectar WebSocket
 */
export const reconectarWebSocket = createAsyncThunk<boolean, void>(
  'eventosWebSocket/reconectar',
  async (_, { dispatch }) => {
    try {
      dispatch(setConnectionStatus('reconnecting'));
      deportesWebSocketService.reconnect();
      
      // Esperar un momento para la reconexión
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (error) {
      dispatch(setConnectionStatus('error'));
      return false;
    }
  }
);

/**
 * Suscribirse a un evento específico
 */
export const suscribirseAEvento = createAsyncThunk<
  number,
  { eventoId: number },
  { rejectValue: string }
>(
  'eventosWebSocket/suscribirseEvento',
  async ({ eventoId }, { dispatch, rejectWithValue }) => {
    try {
      deportesWebSocketService.suscribirseAEvento(eventoId, (evento: EventoDeportivo) => {
        dispatch(actualizarEventoEspecifico({ eventoId, evento }));
      });
      
      dispatch(agregarSuscripcionActiva(eventoId));
      return eventoId;
      
    } catch (error) {
      return rejectWithValue(`Error suscribiéndose al evento ${eventoId}: ${error}`);
    }
  }
);

/**
 * Desuscribirse de un evento específico
 */
export const desuscribirseDeEvento = createAsyncThunk<number, { eventoId: number }>(
  'eventosWebSocket/desuscribirseEvento',
  async ({ eventoId }, { dispatch }) => {
    deportesWebSocketService.desuscribirseDeEvento(eventoId);
    dispatch(removerSuscripcionActiva(eventoId));
    dispatch(removerEventoEspecifico(eventoId));
    return eventoId;
  }
);

// ================================
// SLICE
// ================================

const eventosWebSocketSlice = createSlice({
  name: 'eventosWebSocket',
  initialState,
  reducers: {
    // ========== ESTADO DE CONEXIÓN ==========
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.connectionStatus = action.payload;
      if (action.payload === 'connected') {
        state.connectionError = null;
        state.error = null;
      }
    },
    
    setConnectionError: (state, action: PayloadAction<string>) => {
      state.connectionError = action.payload;
      state.error = action.payload;
      state.connectionStatus = 'error';
    },
    
    setConnectionStats: (state, action: PayloadAction<typeof initialState.connectionStats>) => {
      state.connectionStats = action.payload;
    },
    
    // ========== EVENTOS EN VIVO ==========
    actualizarEventosEnVivo: (state, action: PayloadAction<EventoDeportivo[]>) => {
      state.eventosEnVivo = action.payload;
      
      // Actualizar eventos específicos si están en la lista
      action.payload.forEach(evento => {
        if (state.eventosEspecificos[evento.id]) {
          state.eventosEspecificos[evento.id] = evento;
        }
        
        // Actualizar evento seleccionado si coincide
        if (state.eventoSeleccionado?.id === evento.id) {
          state.eventoSeleccionado = evento;
        }
      });
    },
    
    actualizarEventosProximos: (state, action: PayloadAction<EventoDeportivo[]>) => {
      state.eventosProximos = action.payload;
    },
    
    // ========== EVENTOS ESPECÍFICOS ==========
    actualizarEventoEspecifico: (state, action: PayloadAction<{ eventoId: number; evento: EventoDeportivo }>) => {
      const { eventoId, evento } = action.payload;
      state.eventosEspecificos[eventoId] = evento;
      
      // Actualizar evento seleccionado si es el mismo
      if (state.eventoSeleccionado?.id === eventoId) {
        state.eventoSeleccionado = evento;
      }
      
      // Actualizar en listas de eventos
      const indexEnVivo = state.eventosEnVivo.findIndex(e => e.id === eventoId);
      if (indexEnVivo !== -1) {
        state.eventosEnVivo[indexEnVivo] = evento;
      }
      
      const indexProximo = state.eventosProximos.findIndex(e => e.id === eventoId);
      if (indexProximo !== -1) {
        state.eventosProximos[indexProximo] = evento;
      }
    },
    
    removerEventoEspecifico: (state, action: PayloadAction<number>) => {
      delete state.eventosEspecificos[action.payload];
    },
    
    limpiarEventosEspecificos: (state) => {
      state.eventosEspecificos = {};
    },
    
    // ========== MOMIOS ==========
    actualizarMomios: (state, action: PayloadAction<Momio[]>) => {
      state.momiosActualizados = action.payload;
      
      // Agrupar momios por evento
      const momiosPorEvento: { [eventoId: number]: Momio[] } = {};
      action.payload.forEach(momio => {
        if (!momiosPorEvento[momio.eventoDeportivoId]) {
          momiosPorEvento[momio.eventoDeportivoId] = [];
        }
        momiosPorEvento[momio.eventoDeportivoId].push(momio);
      });
      
      state.momiosPorEvento = momiosPorEvento;
      
      // Actualizar momios en eventos específicos
      Object.keys(momiosPorEvento).forEach(eventoIdStr => {
        const eventoId = parseInt(eventoIdStr);
        if (state.eventosEspecificos[eventoId]) {
          state.eventosEspecificos[eventoId].momios = momiosPorEvento[eventoId];
        }
        
        // Actualizar en evento seleccionado
        if (state.eventoSeleccionado?.id === eventoId) {
          state.eventoSeleccionado.momios = momiosPorEvento[eventoId];
        }
      });
    },
    
    // ========== ESTADÍSTICAS ==========
    actualizarEstadisticas: (state, action: PayloadAction<EstadisticasEventos>) => {
      state.estadisticas = action.payload;
    },
    
    // ========== EVENTO SELECCIONADO ==========
    seleccionarEvento: (state, action: PayloadAction<EventoDeportivo | null>) => {
      state.eventoSeleccionado = action.payload;
    },
    
    // ========== SUSCRIPCIONES ==========
    agregarSuscripcionActiva: (state, action: PayloadAction<number>) => {
      if (!state.suscripcionesActivas.includes(action.payload)) {
        state.suscripcionesActivas.push(action.payload);
      }
    },
    
    removerSuscripcionActiva: (state, action: PayloadAction<number>) => {
      state.suscripcionesActivas = state.suscripcionesActivas.filter(
        id => id !== action.payload
      );
    },
    
    limpiarSuscripciones: (state) => {
      state.suscripcionesActivas = [];
    },
    
    // ========== FILTROS ==========
    setFiltroLiga: (state, action: PayloadAction<Liga | null>) => {
      state.filtros.liga = action.payload;
    },
    
    setFiltroEstado: (state, action: PayloadAction<EventoDeportivo['estado'] | null>) => {
      state.filtros.estado = action.payload;
    },
    
    setFiltroBusqueda: (state, action: PayloadAction<string>) => {
      state.filtros.busqueda = action.payload;
    },
    
    setSoloActivos: (state, action: PayloadAction<boolean>) => {
      state.filtros.soloActivos = action.payload;
    },
    
    limpiarFiltros: (state) => {
      state.filtros = {
        liga: null,
        estado: null,
        busqueda: '',
        soloActivos: true,
      };
    },
    
    // ========== CONFIGURACIÓN ==========
    setAutoReconectar: (state, action: PayloadAction<boolean>) => {
      state.configuracion.autoReconectar = action.payload;
    },
    
    setIntervaloReintento: (state, action: PayloadAction<number>) => {
      state.configuracion.tiempoReintento = action.payload;
    },
    
    // ========== UI ESTADO ==========
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    limpiarError: (state) => {
      state.error = null;
      state.connectionError = null;
    },
    
    // ========== METADATOS ==========
    setUltimaActualizacion: (state, action: PayloadAction<{ tipo: 'eventos' | 'momios' | 'estadisticas'; timestamp: string }>) => {
      const { tipo, timestamp } = action.payload;
      state.ultimaActualizacion[tipo] = timestamp;
    },
    
    // ========== RESET ==========
    resetEstado: () => initialState,
  },
  
  // Extrareducers para manejar thunks
  extraReducers: (builder) => {
    // Conectar WebSocket
    builder
      .addCase(conectarWebSocket.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.connectionStatus = 'connecting';
      })
      .addCase(conectarWebSocket.fulfilled, (state) => {
        state.loading = false;
        state.connectionStatus = 'connected';
        state.connectionError = null;
      })
      .addCase(conectarWebSocket.rejected, (state, action) => {
        state.loading = false;
        state.connectionStatus = 'error';
        state.connectionError = action.payload || 'Error de conexión';
        state.error = action.payload || 'Error de conexión';
      });
    
    // Desconectar WebSocket
    builder
      .addCase(desconectarWebSocket.fulfilled, (state) => {
        state.connectionStatus = 'disconnected';
        state.connectionError = null;
        state.suscripcionesActivas = [];
        state.eventosEspecificos = {};
      });
    
    // Reconectar WebSocket
    builder
      .addCase(reconectarWebSocket.pending, (state) => {
        state.connectionStatus = 'reconnecting';
      })
      .addCase(reconectarWebSocket.fulfilled, (state) => {
        state.connectionStatus = 'connected';
      })
      .addCase(reconectarWebSocket.rejected, (state) => {
        state.connectionStatus = 'error';
      });
    
    // Suscribirse a evento
    builder
      .addCase(suscribirseAEvento.fulfilled, (state, action) => {
        // La suscripción se maneja en el reducer agregarSuscripcionActiva
      })
      .addCase(suscribirseAEvento.rejected, (state, action) => {
        state.error = action.payload || 'Error al suscribirse';
      });
  },
});

// ================================
// SELECTORES
// ================================

export const selectEventosWebSocket = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket;

export const selectConnectionStatus = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket.connectionStatus;

export const selectConnectionStats = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket.connectionStats;

export const selectEventosEnVivo = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket.eventosEnVivo;

export const selectEventosProximos = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket.eventosProximos;

export const selectEventoSeleccionado = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket.eventoSeleccionado;

export const selectEventoEspecifico = (eventoId: number) => 
  (state: { eventosWebSocket: EventosWebSocketState }) => 
    state.eventosWebSocket.eventosEspecificos[eventoId];

export const selectMomiosActualizados = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket.momiosActualizados;

export const selectMomiosPorEvento = (eventoId: number) => 
  (state: { eventosWebSocket: EventosWebSocketState }) => 
    state.eventosWebSocket.momiosPorEvento[eventoId] || [];

export const selectEstadisticas = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket.estadisticas;

export const selectSuscripcionesActivas = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket.suscripcionesActivas;

export const selectFiltros = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket.filtros;

export const selectConfiguracion = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket.configuracion;

export const selectUltimaActualizacion = (state: { eventosWebSocket: EventosWebSocketState }) => 
  state.eventosWebSocket.ultimaActualizacion;

// Selectores computados
export const selectEventosFiltrados = (state: { eventosWebSocket: EventosWebSocketState }) => {
  const { eventosEnVivo, eventosProximos, filtros } = state.eventosWebSocket;
  const todosEventos = [...eventosEnVivo, ...eventosProximos];
  
  return todosEventos.filter(evento => {
    // Filtro por liga
    if (filtros.liga && evento.liga.id !== filtros.liga.id) {
      return false;
    }
    
    // Filtro por estado
    if (filtros.estado && evento.estado !== filtros.estado) {
      return false;
    }
    
    // Filtro por búsqueda
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      const coincide = 
        evento.equipoLocal.toLowerCase().includes(busqueda) ||
        evento.equipoVisitante.toLowerCase().includes(busqueda) ||
        evento.liga.nombre.toLowerCase().includes(busqueda);
      
      if (!coincide) return false;
    }
    
    // Filtro solo activos (que tengan momios disponibles)
    if (filtros.soloActivos) {
      return evento.momios && evento.momios.length > 0 && 
             evento.momios.some(momio => momio.activo);
    }
    
    return true;
  });
};

export const selectResumenEstadisticas = (state: { eventosWebSocket: EventosWebSocketState }) => {
  const { eventosEnVivo, eventosProximos, momiosActualizados, connectionStatus, suscripcionesActivas } = state.eventosWebSocket;
  
  return {
    totalEventos: eventosEnVivo.length + eventosProximos.length,
    eventosEnVivo: eventosEnVivo.length,
    eventosProximos: eventosProximos.length,
    totalMomios: momiosActualizados.length,
    conectado: connectionStatus === 'connected',
    suscripciones: suscripcionesActivas.length,
    promedioMomiosPorEvento: eventosEnVivo.length > 0 ? 
      Math.round(momiosActualizados.length / eventosEnVivo.length * 100) / 100 : 0
  };
};

// Exportar actions
export const {
  setConnectionStatus,
  setConnectionError,
  setConnectionStats,
  actualizarEventosEnVivo,
  actualizarEventosProximos,
  actualizarEventoEspecifico,
  removerEventoEspecifico,
  limpiarEventosEspecificos,
  actualizarMomios,
  actualizarEstadisticas,
  seleccionarEvento,
  agregarSuscripcionActiva,
  removerSuscripcionActiva,
  limpiarSuscripciones,
  setFiltroLiga,
  setFiltroEstado,
  setFiltroBusqueda,
  setSoloActivos,
  limpiarFiltros,
  setAutoReconectar,
  setIntervaloReintento,
  setLoading,
  setError,
  limpiarError,
  setUltimaActualizacion,
  resetEstado,
} = eventosWebSocketSlice.actions;

// Exportar el reducer
export default eventosWebSocketSlice.reducer;