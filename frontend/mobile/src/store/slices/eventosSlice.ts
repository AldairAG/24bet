import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { deportesWebSocketService, EventoDeportivo, Momio, EstadisticasEventos, Liga } from '../service/eventoService';

// Tipos para el estado
export interface EventosState {
  // Estados de conexión
  connected: boolean;
  reconnecting: boolean;
  connectionError: string | null;
  
  // Eventos
  eventosEnVivo: EventoDeportivo[];
  eventosProximos: EventoDeportivo[];
  eventoSeleccionado: EventoDeportivo | null;
  eventosEspecificos: { [eventoId: number]: EventoDeportivo };
  
  // Momios
  momios: Momio[];
  momiosActualizados: { [eventoId: number]: Momio[] };
  
  // Estadísticas
  estadisticas: EstadisticasEventos | null;
  
  // UI Estado
  loading: boolean;
  error: string | null;
  
  // Filtros
  filtros: {
    liga: Liga | null;
    estado: EventoDeportivo['estado'] | null;
    fechaInicio: string | null;
    fechaFin: string | null;
  };
  
  // Configuración
  configuracion: {
    actualizacionAutomatica: boolean;
    notificacionesPush: boolean;
    tipoNotificaciones: ('momios' | 'eventos' | 'resultados')[];
  };
}

// Estado inicial
const initialState: EventosState = {
  // Estados de conexión
  connected: false,
  reconnecting: false,
  connectionError: null,
  
  // Eventos
  eventosEnVivo: [],
  eventosProximos: [],
  eventoSeleccionado: null,
  eventosEspecificos: {},
  
  // Momios
  momios: [],
  momiosActualizados: {},
  
  // Estadísticas
  estadisticas: null,
  
  // UI Estado
  loading: false,
  error: null,
  
  // Filtros
  filtros: {
    liga: null,
    estado: null,
    fechaInicio: null,
    fechaFin: null,
  },
  
  // Configuración
  configuracion: {
    actualizacionAutomatica: true,
    notificacionesPush: true,
    tipoNotificaciones: ['momios', 'eventos', 'resultados'],
  },
};

// Thunks asíncronos para el WebSocket
export const conectarWebSocket = createAsyncThunk(
  'eventos/conectarWebSocket',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await deportesWebSocketService.connect();
      
      // Configurar callbacks del WebSocket
      deportesWebSocketService.onConexion((conectado) => {
        dispatch(setConexionEstado(conectado));
      });
      
      deportesWebSocketService.onEventosEnVivo((eventos) => {
        dispatch(setEventosEnVivo(eventos));
      });
      
      deportesWebSocketService.onEventosProximos((eventos) => {
        dispatch(setEventosProximos(eventos));
      });
      
      deportesWebSocketService.onMomios((momios) => {
        dispatch(setMomiosActualizados(momios));
      });
      
      deportesWebSocketService.onEstadisticas((estadisticas) => {
        dispatch(setEstadisticas(estadisticas));
      });
      
      return true;
    } catch (error) {
      return rejectWithValue(`Error al conectar WebSocket: ${error}`);
    }
  }
);

export const desconectarWebSocket = createAsyncThunk(
  'eventos/desconectarWebSocket',
  async () => {
    deportesWebSocketService.disconnect();
    return false;
  }
);

export const suscribirseAEvento = createAsyncThunk(
  'eventos/suscribirseAEvento',
  async (eventoId: number, { dispatch }) => {
    deportesWebSocketService.suscribirseAEvento(eventoId, (evento) => {
      dispatch(setEventoEspecifico({ eventoId, evento }));
    });
    return eventoId;
  }
);

export const desuscribirseDeEvento = createAsyncThunk(
  'eventos/desuscribirseDeEvento',
  async (eventoId: number, { dispatch }) => {
    deportesWebSocketService.desuscribirseDeEvento(eventoId);
    dispatch(removeEventoEspecifico(eventoId));
    return eventoId;
  }
);

export const reconectarWebSocket = createAsyncThunk(
  'eventos/reconectarWebSocket',
  async (_, { dispatch }) => {
    dispatch(setReconectando(true));
    deportesWebSocketService.reconnect();
    
    // Esperar un poco para la reconexión
    await new Promise(resolve => setTimeout(resolve, 2000));
    dispatch(setReconectando(false));
    
    return true;
  }
);

// Slice
const eventosSlice = createSlice({
  name: 'eventos',
  initialState,
  reducers: {
    // Estados de conexión
    setConexionEstado: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
      if (action.payload) {
        state.connectionError = null;
        state.reconnecting = false;
      }
    },
    
    setReconectando: (state, action: PayloadAction<boolean>) => {
      state.reconnecting = action.payload;
    },
    
    setConnectionError: (state, action: PayloadAction<string | null>) => {
      state.connectionError = action.payload;
    },
    
    // Eventos
    setEventosEnVivo: (state, action: PayloadAction<EventoDeportivo[]>) => {
      state.eventosEnVivo = action.payload;
      
      // Actualizar eventos específicos si están en la lista
      action.payload.forEach(evento => {
        if (state.eventosEspecificos[evento.id]) {
          state.eventosEspecificos[evento.id] = evento;
        }
      });
    },
    
    setEventosProximos: (state, action: PayloadAction<EventoDeportivo[]>) => {
      state.eventosProximos = action.payload;
    },
    
    setEventoSeleccionado: (state, action: PayloadAction<EventoDeportivo | null>) => {
      state.eventoSeleccionado = action.payload;
    },
    
    setEventoEspecifico: (state, action: PayloadAction<{ eventoId: number; evento: EventoDeportivo }>) => {
      const { eventoId, evento } = action.payload;
      state.eventosEspecificos[eventoId] = evento;
      
      // Si es el evento seleccionado, actualizarlo también
      if (state.eventoSeleccionado?.id === eventoId) {
        state.eventoSeleccionado = evento;
      }
    },
    
    removeEventoEspecifico: (state, action: PayloadAction<number>) => {
      delete state.eventosEspecificos[action.payload];
    },
    
    // Momios
    setMomios: (state, action: PayloadAction<Momio[]>) => {
      state.momios = action.payload;
    },
    
    setMomiosActualizados: (state, action: PayloadAction<Momio[]>) => {
      // Agrupar momios por evento
      const momiosPorEvento: { [eventoId: number]: Momio[] } = {};
      
      action.payload.forEach(momio => {
        if (!momiosPorEvento[momio.eventoDeportivoId]) {
          momiosPorEvento[momio.eventoDeportivoId] = [];
        }
        momiosPorEvento[momio.eventoDeportivoId].push(momio);
      });
      
      state.momiosActualizados = momiosPorEvento;
      
      // Actualizar momios globales
      state.momios = action.payload;
      
      // Actualizar momios en eventos específicos
      Object.keys(momiosPorEvento).forEach(eventoIdStr => {
        const eventoId = parseInt(eventoIdStr);
        if (state.eventosEspecificos[eventoId]) {
          state.eventosEspecificos[eventoId].momios = momiosPorEvento[eventoId];
        }
      });
      
      // Actualizar momios en evento seleccionado
      if (state.eventoSeleccionado && momiosPorEvento[state.eventoSeleccionado.id]) {
        state.eventoSeleccionado.momios = momiosPorEvento[state.eventoSeleccionado.id];
      }
    },
    
    // Estadísticas
    setEstadisticas: (state, action: PayloadAction<EstadisticasEventos>) => {
      state.estadisticas = action.payload;
    },
    
    // UI Estado
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Filtros
    setFiltroLiga: (state, action: PayloadAction<Liga | null>) => {
      state.filtros.liga = action.payload;
    },
    
    setFiltroEstado: (state, action: PayloadAction<EventoDeportivo['estado'] | null>) => {
      state.filtros.estado = action.payload;
    },
    
    setFiltroFechas: (state, action: PayloadAction<{ fechaInicio: string | null; fechaFin: string | null }>) => {
      state.filtros.fechaInicio = action.payload.fechaInicio;
      state.filtros.fechaFin = action.payload.fechaFin;
    },
    
    clearFiltros: (state) => {
      state.filtros = {
        liga: null,
        estado: null,
        fechaInicio: null,
        fechaFin: null,
      };
    },
    
    // Configuración
    setActualizacionAutomatica: (state, action: PayloadAction<boolean>) => {
      state.configuracion.actualizacionAutomatica = action.payload;
    },
    
    setNotificacionesPush: (state, action: PayloadAction<boolean>) => {
      state.configuracion.notificacionesPush = action.payload;
    },
    
    setTipoNotificaciones: (state, action: PayloadAction<('momios' | 'eventos' | 'resultados')[]>) => {
      state.configuracion.tipoNotificaciones = action.payload;
    },
    
    // Reset completo
    resetEventosState: () => initialState,
  },
  
  extraReducers: (builder) => {
    // Conectar WebSocket
    builder
      .addCase(conectarWebSocket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(conectarWebSocket.fulfilled, (state) => {
        state.loading = false;
        state.connected = true;
        state.connectionError = null;
      })
      .addCase(conectarWebSocket.rejected, (state, action) => {
        state.loading = false;
        state.connected = false;
        state.connectionError = action.payload as string;
        state.error = action.payload as string;
      });
    
    // Desconectar WebSocket
    builder
      .addCase(desconectarWebSocket.fulfilled, (state) => {
        state.connected = false;
        state.connectionError = null;
        state.eventosEnVivo = [];
        state.eventosProximos = [];
        state.eventosEspecificos = {};
        state.momios = [];
        state.momiosActualizados = {};
      });
    
    // Suscribirse a evento
    builder
      .addCase(suscribirseAEvento.fulfilled, (state, action) => {
        // El callback se maneja en el thunk
      });
    
    // Reconectar
    builder
      .addCase(reconectarWebSocket.pending, (state) => {
        state.reconnecting = true;
      })
      .addCase(reconectarWebSocket.fulfilled, (state) => {
        state.reconnecting = false;
      })
      .addCase(reconectarWebSocket.rejected, (state) => {
        state.reconnecting = false;
      });
  },
});

// Selectores
export const selectEventosState = (state: { eventos: EventosState }) => state.eventos;
export const selectConnectionState = (state: { eventos: EventosState }) => ({
  connected: state.eventos.connected,
  reconnecting: state.eventos.reconnecting,
  error: state.eventos.connectionError,
});

export const selectEventosEnVivo = (state: { eventos: EventosState }) => state.eventos.eventosEnVivo;
export const selectEventosProximos = (state: { eventos: EventosState }) => state.eventos.eventosProximos;
export const selectEventoSeleccionado = (state: { eventos: EventosState }) => state.eventos.eventoSeleccionado;
export const selectEventoEspecifico = (eventoId: number) => 
  (state: { eventos: EventosState }) => state.eventos.eventosEspecificos[eventoId];

export const selectMomios = (state: { eventos: EventosState }) => state.eventos.momios;
export const selectMomiosPorEvento = (eventoId: number) => 
  (state: { eventos: EventosState }) => state.eventos.momiosActualizados[eventoId] || [];

export const selectEstadisticas = (state: { eventos: EventosState }) => state.eventos.estadisticas;

export const selectFiltros = (state: { eventos: EventosState }) => state.eventos.filtros;
export const selectConfiguracion = (state: { eventos: EventosState }) => state.eventos.configuracion;

// Selectores filtrados
export const selectEventosFiltrados = (state: { eventos: EventosState }) => {
  const { eventosEnVivo, eventosProximos, filtros } = state.eventos;
  const todosEventos = [...eventosEnVivo, ...eventosProximos];
  
  return todosEventos.filter(evento => {
    if (filtros.liga && evento.liga.id !== filtros.liga.id) return false;
    if (filtros.estado && evento.estado !== filtros.estado) return false;
    if (filtros.fechaInicio && evento.fechaInicio < filtros.fechaInicio) return false;
    if (filtros.fechaFin && evento.fechaInicio > filtros.fechaFin) return false;
    
    return true;
  });
};

export const selectEstadisticasResumen = (state: { eventos: EventosState }) => {
  const { eventosEnVivo, eventosProximos, momios, connected } = state.eventos;
  
  return {
    totalEventos: eventosEnVivo.length + eventosProximos.length,
    eventosEnVivo: eventosEnVivo.length,
    eventosProximos: eventosProximos.length,
    totalMomios: momios.length,
    promedioMomiosPorEvento: eventosEnVivo.length > 0 ? momios.length / eventosEnVivo.length : 0,
    conectado: connected,
  };
};

// Exportar actions y reducer
export const {
  setConexionEstado,
  setReconectando,
  setConnectionError,
  setEventosEnVivo,
  setEventosProximos,
  setEventoSeleccionado,
  setEventoEspecifico,
  removeEventoEspecifico,
  setMomios,
  setMomiosActualizados,
  setEstadisticas,
  setLoading,
  setError,
  clearError,
  setFiltroLiga,
  setFiltroEstado,
  setFiltroFechas,
  clearFiltros,
  setActualizacionAutomatica,
  setNotificacionesPush,
  setTipoNotificaciones,
  resetEventosState,
} = eventosSlice.actions;

export default eventosSlice.reducer;
