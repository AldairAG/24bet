import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { soporteService } from '../../service/soporteService';
import type {
  Ticket,
  CrearTicketRequest,
  ActualizarTicketRequest,
  Comentario,
  NuevoComentarioRequest
} from '../../types/soporteTypes';

interface SoporteState {
  tickets: Ticket[];
  ticketActual: Ticket | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SoporteState = {
  tickets: [],
  ticketActual: null,
  isLoading: false,
  error: null
};

// Thunks
export const crearTicket = createAsyncThunk(
  'soporte/crearTicket',
  async (ticket: CrearTicketRequest) => {
    const response = await soporteService.crearTicket(ticket);
    return response.data;
  }
);

export const actualizarTicket = createAsyncThunk(
  'soporte/actualizarTicket',
  async ({ id, ticket }: { id: number; ticket: ActualizarTicketRequest }) => {
    const response = await soporteService.actualizarTicket(id, ticket);
    return response.data;
  }
);

export const obtenerTicket = createAsyncThunk(
  'soporte/obtenerTicket',
  async (id: number) => {
    const response = await soporteService.obtenerTicket(id);
    return response.data;
  }
);

export const obtenerTicketsUsuario = createAsyncThunk(
  'soporte/obtenerTicketsUsuario',
  async () => {
    const response = await soporteService.obtenerTicketsUsuario();
    return response.data;
  }
);

export const obtenerTodosLosTickets = createAsyncThunk(
  'soporte/obtenerTodosLosTickets',
  async () => {
    const response = await soporteService.obtenerTodosLosTickets();
    return response.data;
  }
);

export const publicarComentario = createAsyncThunk(
  'soporte/publicarComentario',
  async (comentario: NuevoComentarioRequest) => {
    const response = await soporteService.publicarComentario(comentario);
    return response.data;
  }
);

// Slice
export const soporteSlice = createSlice({
  name: 'soporte',
  initialState,
  reducers: {
    limpiarError: (state) => {
      state.error = null;
    },
    limpiarTicketActual: (state) => {
      state.ticketActual = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Crear Ticket
      .addCase(crearTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(crearTicket.fulfilled, (state, action: PayloadAction<Ticket>) => {
        state.isLoading = false;
        state.tickets.push(action.payload);
        state.ticketActual = action.payload;
      })
      .addCase(crearTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al crear el ticket';
      })

      // Actualizar Ticket
      .addCase(actualizarTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(actualizarTicket.fulfilled, (state, action: PayloadAction<Ticket>) => {
        state.isLoading = false;
        const index = state.tickets.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.ticketActual?.id === action.payload.id) {
          state.ticketActual = action.payload;
        }
      })
      .addCase(actualizarTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al actualizar el ticket';
      })

      // Obtener Ticket
      .addCase(obtenerTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(obtenerTicket.fulfilled, (state, action: PayloadAction<Ticket>) => {
        state.isLoading = false;
        state.ticketActual = action.payload;
      })
      .addCase(obtenerTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al obtener el ticket';
      })

      // Obtener Tickets Usuario
      .addCase(obtenerTicketsUsuario.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(obtenerTicketsUsuario.fulfilled, (state, action: PayloadAction<Ticket[]>) => {
        state.isLoading = false;
        state.tickets = action.payload;
      })
      .addCase(obtenerTicketsUsuario.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al obtener los tickets del usuario';
      })

      // Obtener Todos los Tickets
      .addCase(obtenerTodosLosTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(obtenerTodosLosTickets.fulfilled, (state, action: PayloadAction<Ticket[]>) => {
        state.isLoading = false;
        state.tickets = action.payload;
      })
      .addCase(obtenerTodosLosTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al obtener todos los tickets';
      })

      // Publicar Comentario
      .addCase(publicarComentario.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(publicarComentario.fulfilled, (state, action: PayloadAction<Comentario>) => {
        state.isLoading = false;
        if (state.ticketActual && action.payload.tiket.id === state.ticketActual.id) {
          state.ticketActual.comentarios.push(action.payload);
        }
        const ticketIndex = state.tickets.findIndex(t => t.id === action.payload.tiket.id);
        if (ticketIndex !== -1) {
          state.tickets[ticketIndex].comentarios.push(action.payload);
        }
      })
      .addCase(publicarComentario.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error al publicar el comentario';
      });
  }
});

// Actions
export const { limpiarError, limpiarTicketActual } = soporteSlice.actions;

// Selectors
export const selectTickets = (state: RootState) => state.soporte.tickets;
export const selectTicketActual = (state: RootState) => state.soporte.ticketActual;
export const selectIsLoading = (state: RootState) => state.soporte.isLoading;
export const selectError = (state: RootState) => state.soporte.error;

export default soporteSlice.reducer;
