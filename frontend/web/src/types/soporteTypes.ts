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

export interface Ticket {
  id: number;
  tipo: TipoProblema;
  asunto: string;
  descripcion: string;
  estado: EstadoTicket;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  usuarioId: number;
}

export interface CrearTicketRequest {
  tipo: TipoProblema;
  asunto: string;
  descripcion: string;
}
