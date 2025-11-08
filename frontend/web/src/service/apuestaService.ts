import { apiBase } from './apiBase';
import type { ApuestaHistorialResponse, CrearApuesta, CrearParlayApuestas, ParlayHistorialResponse } from '../types/apuestasTypes';
import type { ApiResponseWrapper } from '../types/authTypes';

/**
 * Implementación del servicio de apuestas
 */
class ApuestaService {
    private readonly baseUrl = '/apuestas';

    /**
     * Crea una lista de apuestas
     * @param apuestas Lista de apuestas a crear
     * @returns Promise con el resultado de la operación
     */
    async crearListaApuestas(apuestas: CrearApuesta[]): Promise<ApiResponseWrapper<CrearApuesta[]>> {

        if (!Array.isArray(apuestas) || apuestas.length === 0) {
            throw new Error('La lista de apuestas no puede estar vacía');
        }

        const response = await apiBase.post<ApiResponseWrapper<CrearApuesta[]>>(`${this.baseUrl}/crear`, apuestas);

        return response.data;
    }

    /**
     * crear un parlay de apuestas
     */
    async crearParlayApuestas(parlay: CrearParlayApuestas): Promise<ApiResponseWrapper<CrearParlayApuestas[]>> {

        if (!Array.isArray(parlay.apuestas) || parlay.apuestas.length === 0) {
            throw new Error('La lista de apuestas no puede estar vacía');
        }
        const response = await apiBase.post<ApiResponseWrapper<CrearParlayApuestas[]>>(`${this.baseUrl}/parlay/crear`, parlay);

        return response.data;
    }

    /** 
     * Obtiene el historial de apuestas
     */
    async obtenerHistorialApuestas(): Promise<ApiResponseWrapper<ApuestaHistorialResponse[]>> {
        const response = await apiBase.get<ApuestaHistorialResponse[]>(`${this.baseUrl}/historial`);
        return response;
    }

    /**
     * Obtiene el historial de parlays
     */
    async obtenerHistorialParlays(): Promise<ApiResponseWrapper<ParlayHistorialResponse[]>> {
        const response = await apiBase.get<ParlayHistorialResponse[]>(`${this.baseUrl}/parlay/historial`);
        return response;
    }

}


// Export por defecto para compatibilidad
export default new ApuestaService();
