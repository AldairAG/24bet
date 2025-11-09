import { api, type ApiResponse } from './apiBase';
import type{
  Ticket,
  CrearTicketRequest,
  ActualizarTicketRequest,
  Comentario,
  NuevoComentarioRequest
} from '../types/soporteTypes';

class SoporteService {
  private readonly BASE_URL = '/soporte';

  /**
   * Crea un nuevo ticket de soporte
   */
  async crearTicket(ticket: CrearTicketRequest): Promise<ApiResponse<Ticket>> {
    return api.post<Ticket>(this.BASE_URL, ticket);
  }

  /**
   * Actualiza un ticket existente
   */
  async actualizarTicket(id: number, ticket: ActualizarTicketRequest): Promise<ApiResponse<Ticket>> {
    return api.put<Ticket>(`${this.BASE_URL}/${id}`, ticket);
  }

  /**
   * Obtiene un ticket por su ID
   */
  async obtenerTicket(id: number): Promise<ApiResponse<Ticket>> {
    return api.get<Ticket>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Obtiene todos los tickets del usuario actual
   */
  async obtenerTicketsUsuario(): Promise<ApiResponse<Ticket[]>> {
    return api.get<Ticket[]>(`${this.BASE_URL}/usuario`);
  }

  /**
   * Obtiene todos los tickets (solo para administradores)
   */
  async obtenerTodosLosTickets(): Promise<ApiResponse<Ticket[]>> {
    return api.get<Ticket[]>(`${this.BASE_URL}/admin/tickets`);
  }

  /**
   * Publica un nuevo comentario en un ticket
   */
  async publicarComentario(comentario: NuevoComentarioRequest): Promise<ApiResponse<Comentario>> {
    return api.post<Comentario>(`${this.BASE_URL}/comentar`, comentario);
  }
}

// Exportar una instancia única del servicio
export const soporteService = new SoporteService();
