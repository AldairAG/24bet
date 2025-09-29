import { apiBase } from './apiBase';
import { EventoDeportivoResponse, EventosEnVivoResponse, EventosPorLigaResponse, LigaPorDeporteDetalleResponse, LigaPorDeporteResponse } from '../types/EventosType';
import { ApiResponseWrapper } from '../types/authTypes';

/**
 * Servicio para la gestión de eventos deportivos
 * Basado en EventoDeportivoController del backend
 */
class EventosService {
    private baseUrl = '/eventos';

    /**
     * Obtiene todos los eventos en vivo
     * GET /24bet/eventos/en-vivo
     * @returns Promise con la lista de eventos deportivos en vivo
     */
    async getEventosEnVivo(): Promise<EventosEnVivoResponse> {
        try {
            const response = await apiBase.get<EventosEnVivoResponse>(
                `${this.baseUrl}/en-vivo`
            );

            return response.data;
        } catch (error) {
            console.error('Error fetching live events:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene ligas por deporte
     */
    async getLigasPorDeporte(deporte: string): Promise<ApiResponseWrapper<LigaPorDeporteDetalleResponse[]>> {
        try {
            const response = await apiBase.get<LigaPorDeporteDetalleResponse[]>(
                `${this.baseUrl}/ligas-por-deporte/${deporte}`
            );
            return response;
        } catch (error) {
            console.error('Error fetching leagues by sport:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene todos los eventos futuros
     * GET /24bet/eventos/futuros
     * @returns Promise con la lista de eventos futuros
     */
    async getEventosFuturosByLiga(ligaNombre: string): Promise<EventosPorLigaResponse[]> {
        try {
            const response = await apiBase.get<EventosPorLigaResponse[]>(
                `${this.baseUrl}/eventos-por-liga/${ligaNombre}`
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

    /**
     * Valida si un evento está en vivo
     * @param evento Evento a validar
     * @returns true si el evento está en vivo
     */
    validateEventoEnVivo(evento: EventoDeportivoResponse): boolean {
        // Si tiene la propiedad enVivo, usarla
        if (evento.enVivo !== undefined) {
            return evento.enVivo && evento.activo;
        }

        // Si no tiene enVivo, determinar basándose en el estado
        // Estados que indican que el evento está en vivo:
        // "1H" = Primera mitad, "2H" = Segunda mitad, "HT" = Medio tiempo, "ET" = Tiempo extra, etc.
        const estadosEnVivo = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE', 'IN PLAY'];
        const estadoUpper = evento.estado?.toUpperCase() || '';

        const estaEnVivo = estadosEnVivo.some(estado =>
            estadoUpper.includes(estado) || estado.includes(estadoUpper)
        );

        console.log(`🏁 Validando evento ${evento.id} (${evento.nombre}):`, {
            estado: evento.estado,
            activo: evento.activo,
            enVivo: evento.enVivo,
            calculadoEnVivo: estaEnVivo,
            resultado: estaEnVivo && evento.activo
        });

        return estaEnVivo && evento.activo;
    }

    /**
     * Filtra eventos que están realmente en vivo
     * @param eventos Lista de eventos
     * @returns Eventos filtrados que están en vivo
     */
    filterEventosEnVivo(eventos: EventosEnVivoResponse): EventosEnVivoResponse {
        return eventos.filter(evento => this.validateEventoEnVivo(evento));
    }

    /**
     * Ordena eventos por fecha de evento
     * @param eventos Lista de eventos
     * @param orden Orden: 'asc' para ascendente, 'desc' para descendente
     * @returns Eventos ordenados por fecha
     */
    sortEventosByFecha(eventos: EventosEnVivoResponse, orden: 'asc' | 'desc' = 'asc'): EventosEnVivoResponse {
        return [...eventos].sort((a, b) => {
            const fechaA = new Date(a.fechaEvento).getTime();
            const fechaB = new Date(b.fechaEvento).getTime();

            return orden === 'asc' ? fechaA - fechaB : fechaB - fechaA;
        });
    }

    /**
     * Filtra eventos por liga específica
     * @param eventos Lista de eventos
     * @param ligaNombre Nombre de la liga a filtrar
     * @returns Eventos filtrados por liga
     */
    filterEventosByLiga(eventos: EventosEnVivoResponse, ligaNombre: string): EventosEnVivoResponse {
        return eventos.filter(evento =>
            evento.liga.nombre.toLowerCase().includes(ligaNombre.toLowerCase()) ||
            evento.liga.nombreAlternativo?.toLowerCase().includes(ligaNombre.toLowerCase())
        );
    }

    /**
     * Filtra eventos por deporte
     * @param eventos Lista de eventos
     * @param deporte Nombre del deporte a filtrar
     * @returns Eventos filtrados por deporte
     */
    filterEventosByDeporte(eventos: EventosEnVivoResponse, deporte: string): EventosEnVivoResponse {
        return eventos.filter(evento =>
            evento.liga.deporte.toLowerCase() === deporte.toLowerCase()
        );
    }

    /**
     * Filtra eventos por país
     * @param eventos Lista de eventos
     * @param pais Nombre del país a filtrar
     * @returns Eventos filtrados por país
     */
    filterEventosByPais(eventos: EventosEnVivoResponse, pais: string): EventosEnVivoResponse {
        return eventos.filter(evento =>
            (evento.pais && evento.pais.toLowerCase() === pais.toLowerCase()) ||
            (evento.liga.pais && evento.liga.pais.toLowerCase() === pais.toLowerCase())
        );
    }

    /**
     * Busca eventos por nombre (equipo local, visitante o nombre del evento)
     * @param eventos Lista de eventos
     * @param termino Término de búsqueda
     * @returns Eventos que coinciden con el término de búsqueda
     */
    searchEventos(eventos: EventosEnVivoResponse, termino: string): EventosEnVivoResponse {
        const terminoLower = termino.toLowerCase();

        return eventos.filter(evento =>
            evento.nombre.toLowerCase().includes(terminoLower) ||
            (evento.equipoLocal?.nombre && evento.equipoLocal.nombre.toLowerCase().includes(terminoLower)) ||
            (evento.equipoVisitante?.nombre && evento.equipoVisitante.nombre.toLowerCase().includes(terminoLower)) ||
            evento.liga.nombre.toLowerCase().includes(terminoLower)
        );
    }

    /**
     * Obtiene eventos únicos por liga
     * @param eventos Lista de eventos
     * @returns Map con eventos agrupados por liga
     */
    groupEventosByLiga(eventos: EventosEnVivoResponse): Map<string, EventosEnVivoResponse> {
        const eventosPorLiga = new Map<string, EventosEnVivoResponse>();

        eventos.forEach(evento => {
            const ligaNombre = evento.liga.nombre;

            if (!eventosPorLiga.has(ligaNombre)) {
                eventosPorLiga.set(ligaNombre, []);
            }

            eventosPorLiga.get(ligaNombre)!.push(evento);
        });

        return eventosPorLiga;
    }

    /**
     * Formatea el tiempo de partido para mostrar en UI
     * @param tiempoPartido Tiempo actual del partido
     * @returns Tiempo formateado para mostrar
     */
    formatTiempoPartido(tiempoPartido?: string): string {
        if (!tiempoPartido || tiempoPartido.trim() === '') {
            return 'En vivo';
        }

        // Si es un número, agregar comillas simples para indicar minutos
        if (/^\d+$/.test(tiempoPartido)) {
            return `${tiempoPartido}'`;
        }

        return tiempoPartido;
    }

    /**
     * Formatea el resultado del partido
     * @param evento Evento deportivo
     * @returns String con el resultado formateado
     */
    formatResultado(evento: EventoDeportivoResponse): string {
        const local = evento.resultadoLocal || 0;
        const visitante = evento.resultadoVisitante || 0;

        return `${local} - ${visitante}`;
    }
}

// Exportar instancia única del servicio
export const eventosService = new EventosService();
export default eventosService;
