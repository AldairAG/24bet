import type { Usuario } from './authTypes';

export const TipoProblema = {
  CUENTA: 'CUENTA',
  PAGOS: 'PAGOS',
  TECNICO: 'TECNICO',
  JUEGOS: 'JUEGOS',
  SEGURIDAD: 'SEGURIDAD',
  OTRO: 'OTRO'
} as const;

export type TipoProblema = typeof TipoProblema[keyof typeof TipoProblema];

export const EstadoTicket = {
  ABIERTO: 'ABIERTO',
  EN_PROCESO: 'EN_PROCESO',
  RESUELTO: 'RESUELTO',
  CERRADO: 'CERRADO'
} as const;

export type EstadoTicket = typeof EstadoTicket[keyof typeof EstadoTicket];

export interface Comentario {
  id: number;
  contenido: string;
  fechaCreacion: Date;
  usuario: Usuario;
  tiket: Ticket;
}

export interface NuevoComentarioRequest {
  contenido: string;
  tiketId: number;
}

export interface Ticket {
  id: number;
  tipo: TipoProblema;
  asunto: string;
  descripcion: string;
  estado: EstadoTicket;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  usuario: Usuario;
  comentarios: Comentario[];
}

export interface CrearTicketRequest {
  tipo: TipoProblema;
  asunto: string;
  descripcion: string;
}

export interface ActualizarTicketRequest {
  id: number;
  tipo?: TipoProblema;
  asunto?: string;
  descripcion?: string;
  estado?: EstadoTicket;
}
