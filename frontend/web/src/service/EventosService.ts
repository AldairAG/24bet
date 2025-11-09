/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiBase } from '../../src/service/apiBase';
import type { Evento, EventoConOddsResponse, LigaPorDeporteDetalleResponse } from '../../src/types/EventosType';
import type { ApiResponseWrapper } from '../types/authTypes';

/**
 * Servicio para la gestión de eventos deportivos
 * Basado en EventoDeportivoController del backend
 */
class EventosService {
    private baseUrl = '/eventos';

    /**
     * Obtiene todos los eventos en vivo de un deporte
     * GET /24bet/eventos/en-vivo/{deporte}
     * @param deporte Nombre del deporte (e.g., "Soccer", "Basketball")
     * @returns Promise con la lista de eventos deportivos en vivo
     */
    async getEventosEnVivoPorDeporte(deporte: string): Promise<EventoConOddsResponse[]> {
        try {
            const response = await apiBase.get<EventoConOddsResponse[]>(
                `${this.baseUrl}/eventos-en-vivo-por-deporte/${deporte}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching live events by sport:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene todos los eventos en vivo
     * GET /24bet/eventos/en-vivo
     * @returns Promise con la lista de eventos deportivos en vivo
     */
    async getEventosEnVivo(): Promise<EventoConOddsResponse[]> {
        try {
            const response = await apiBase.get<EventoConOddsResponse[]>(
                `${this.baseUrl}/en-vivo`
            );

            return response.data;
        } catch (error) {
            console.error('Error fetching live events:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene un evento por su nombre
     * GET /24bet/eventos/nombre/{nombre}
     * @param nombre Nombre del evento
     */
    async getEventoPorNombre(nombre: string): Promise<ApiResponseWrapper<Evento>> {
        try {
            const response = await apiBase.get<Evento>(
                `${this.baseUrl}/evento-por-nombre/${nombre}`
            );

            return response;
        } catch (error) {
            console.error('Error fetching event by name:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene ligas por deporte
     */
    async getLigasPorDeporte(deporte: string): Promise<LigaPorDeporteDetalleResponse[]> {
        try {
            const response = await apiBase.get<LigaPorDeporteDetalleResponse[]>(
                `${this.baseUrl}/ligas-por-deporte/${deporte}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching leagues by sport:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene todos los eventos futuros por nombre de la liga
     * GET /24bet/eventos/futuros
     * @returns Promise con la lista de eventos futuros
     */
    async getEventosFuturosByLigaName(paisNombre: string, ligaNombre: string): Promise<EventoConOddsResponse[]> {
        try {
            const response = await apiBase.get<EventoConOddsResponse[]>(
                `${this.baseUrl}/eventos-por-liga/${paisNombre}/${ligaNombre}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching future events:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene todos los eventos futuros
     * GET /24bet/eventos/futuros
     * @returns Promise con la lista de eventos futuros
     */
    async getEventosFuturosPorDeporte(deporte: string): Promise<EventoConOddsResponse[]> {
        try {
            const response = await apiBase.get<EventoConOddsResponse[]>(
                `${this.baseUrl}/eventos-mas-proximos-por-deporte/${deporte}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching future events:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Maneja errores de las peticiones HTTP
     * @param error Error capturado
     * @returns Error procesado
     */
    /**
     * Obtiene y actualiza las ligas de un deporte desde la API externa (Solo admin)
     * POST /24bet/eventos/datosMaestros/ligas/{deporteNombre}
     * @param deporteNombre Nombre del deporte
     * @returns Promise con el número de ligas actualizadas
     */
    async actualizarLigasPorDeporte(deporteNombre: string): Promise<number> {
        try {
            const response = await apiBase.post<ApiResponseWrapper<number>>(
                `${this.baseUrl}/datosMaestros/ligas/${deporteNombre}`
            );
            return response.data.data || 0;
        } catch (error) {
            console.error('Error updating leagues:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene y actualiza los equipos de un deporte desde la API externa (Solo admin)
     * POST /24bet/eventos/datosMaestros/equipos/{deporteNombre}
     * @param deporteNombre Nombre del deporte
     * @returns Promise con el número de equipos actualizados
     */
    async actualizarEquiposPorDeporte(deporteNombre: string): Promise<number> {
        try {
            const response = await apiBase.post<ApiResponseWrapper<number>>(
                `${this.baseUrl}/datosMaestros/equipos/${deporteNombre}`
            );
            return response.data.data || 0;
        } catch (error) {
            console.error('Error updating teams:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene y actualiza los eventos de un deporte para una fecha específica desde la API externa (Solo admin)
     * POST /24bet/eventos/datosMaestros/eventos-por-fecha/{deporteNombre}/{fecha}
     * @param deporteNombre Nombre del deporte
     * @param fecha Fecha en formato YYYY-MM-DD
     * @returns Promise con el número de eventos actualizados
     */
    async actualizarEventosPorDeporteYFecha(deporteNombre: string, fecha: string): Promise<number> {
        try {
            const response = await apiBase.post<ApiResponseWrapper<number>>(
                `${this.baseUrl}/datosMaestros/eventos-por-fecha/${deporteNombre}/${fecha}`
            );
            return response.data.data || 0;
        } catch (error) {
            console.error('Error updating events:', error);
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        if (error.response) {
            // Error de respuesta del servidor
            const status = error.response.status;
            const message = error.response.data?.message || error.response.statusText;

            switch (status) {
                case 400:
                    return new Error(`Solicitud inválida: ${message}`);
                case 401:
                    return new Error('No autorizado. Por favor, inicie sesión nuevamente.');
                case 403:
                    return new Error('No tiene permisos para acceder a esta información.');
                case 404:
                    return new Error('No se encontraron eventos en vivo.');
                case 500:
                    return new Error('Error interno del servidor. Inténtelo más tarde.');
                case 503:
                    return new Error('Servicio no disponible temporalmente.');
                default:
                    return new Error(`Error del servidor: ${message}`);
            }
        } else if (error.request) {
            // Error de red
            return new Error('Error de conexión. Verifique su conexión a internet.');
        } else {
            // Error de configuración
            return new Error(`Error: ${error.message}`);
        }
    }
}

// Exportar instancia única del servicio
export const eventosService = new EventosService();
export default eventosService;
