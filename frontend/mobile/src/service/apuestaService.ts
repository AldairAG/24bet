import { apiBase } from './apiBase';
import { CrearApuesta, ApuestaEnBoleto } from '../types/apuestasTypes';
import { ApiResponseWrapper } from '../types/authTypes';

/**
 * Interfaz que define los métodos del servicio de apuestas
 */
export interface IApuestaService {
    /**
     * Crea una lista de apuestas
     * @param apuestas Lista de apuestas a crear
     * @returns Promise con el resultado de la operación
     */
    crearListaApuestas(apuestas: CrearApuesta[]): Promise<any>;

    /**
     * Obtiene una lista de apuestas por usuario (método futuro)
     * @param usuarioId ID del usuario
     * @returns Promise con las apuestas del usuario
     */
    obtenerApuestasPorUsuario?(usuarioId: number): Promise<ApuestaEnBoleto[]>;
}

/**
 * Implementación del servicio de apuestas
 */
class ApuestaService implements IApuestaService {
    private readonly baseUrl = '/24bet/apuestas';

    /**
     * Crea una lista de apuestas
     * @param apuestas Lista de apuestas a crear
     * @returns Promise con el resultado de la operación
     */
    async crearListaApuestas(apuestas: CrearApuesta[]): Promise<ApiResponseWrapper<CrearApuesta[]>> {

        if (!Array.isArray(apuestas) || apuestas.length === 0) {
            throw new Error('La lista de apuestas no puede estar vacía');
        }

        const response = await apiBase.post<ApiResponseWrapper<CrearApuesta[]>>(`${this.baseUrl}/crear-lista`, {
            apuestas
        });

        return response.data;
    }

}

// Instancia singleton del servicio
export const apuestaService: IApuestaService = new ApuestaService();

// Export por defecto para compatibilidad
export default apuestaService;
