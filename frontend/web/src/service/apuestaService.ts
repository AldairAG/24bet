import { apiBase } from './apiBase';
import type { CrearApuesta } from '../types/apuestasTypes';
import type { ApiResponseWrapper } from '../types/authTypes';

/**
 * Implementación del servicio de apuestas
 */
class ApuestaService  {
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
    async crearParlayApuestas(apuestas: CrearApuesta[]): Promise<ApiResponseWrapper<CrearApuesta[]>> {

        if (!Array.isArray(apuestas) || apuestas.length === 0) {
            throw new Error('La lista de apuestas no puede estar vacía');
        }

        const response = await apiBase.post<ApiResponseWrapper<CrearApuesta[]>>(`${this.baseUrl}/parlay/crear`, apuestas);

        return response.data;
    }

}


// Export por defecto para compatibilidad
export default new ApuestaService();
