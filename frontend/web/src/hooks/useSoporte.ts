import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store';
import {
  crearTicket,
  actualizarTicket,
  obtenerTicket,
  obtenerTicketsUsuario,
  obtenerTodosLosTickets,
  publicarComentario,
  limpiarError,
  limpiarTicketActual,
  selectTickets,
  selectTicketActual,
  selectIsLoading,
  selectError
} from '../store/slices/soporteSlice';
import type {
  CrearTicketRequest,
  ActualizarTicketRequest,
  NuevoComentarioRequest,
  Ticket
} from '../types/soporteTypes';

export const useSoporte = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tickets = useSelector(selectTickets);
  const ticketActual = useSelector(selectTicketActual);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const handleCrearTicket = useCallback(async (ticket: CrearTicketRequest) => {
    try {
      const resultado = await dispatch(crearTicket(ticket)).unwrap();
      return { success: true, data: resultado };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [dispatch]);

  const handleActualizarTicket = useCallback(async (id: number, ticket: ActualizarTicketRequest) => {
    try {
      const resultado = await dispatch(actualizarTicket({ id, ticket })).unwrap();
      return { success: true, data: resultado };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [dispatch]);

  const handleObtenerTicket = useCallback(async (id: number) => {
    try {
      const resultado = await dispatch(obtenerTicket(id)).unwrap();
      return { success: true, data: resultado };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [dispatch]);

  const handleObtenerTicketsUsuario = useCallback(async () => {
    try {
      const resultado = await dispatch(obtenerTicketsUsuario()).unwrap();
      return { success: true, data: resultado };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [dispatch]);

  const handleObtenerTodosLosTickets = useCallback(async () => {
    try {
      const resultado = await dispatch(obtenerTodosLosTickets()).unwrap();
      return { success: true, data: resultado };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [dispatch]);

  const handlePublicarComentario = useCallback(async (comentario: NuevoComentarioRequest) => {
    try {
      const resultado = await dispatch(publicarComentario(comentario)).unwrap();
      return { success: true, data: resultado };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [dispatch]);

  const handleLimpiarError = useCallback(() => {
    dispatch(limpiarError());
  }, [dispatch]);

  const handleLimpiarTicketActual = useCallback(() => {
    dispatch(limpiarTicketActual());
  }, [dispatch]);

  // Funciones auxiliares para filtrar tickets
  const obtenerTicketsPorEstado = useCallback((estado: string): Ticket[] => {
    return tickets.filter(ticket => ticket.estado === estado);
  }, [tickets]);

  const obtenerTicketsPorTipo = useCallback((tipo: string): Ticket[] => {
    return tickets.filter(ticket => ticket.tipo === tipo);
  }, [tickets]);

  return {
    // Estado
    tickets,
    ticketActual,
    isLoading,
    error,

    // Acciones principales
    crearTicket: handleCrearTicket,
    actualizarTicket: handleActualizarTicket,
    obtenerTicket: handleObtenerTicket,
    obtenerTicketsUsuario: handleObtenerTicketsUsuario,
    obtenerTodosLosTickets: handleObtenerTodosLosTickets,
    publicarComentario: handlePublicarComentario,

    // Acciones de limpieza
    limpiarError: handleLimpiarError,
    limpiarTicketActual: handleLimpiarTicketActual,

    // Funciones auxiliares
    obtenerTicketsPorEstado,
    obtenerTicketsPorTipo
  };
};
