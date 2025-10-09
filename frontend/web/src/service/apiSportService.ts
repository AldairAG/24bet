/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosResponse } from 'axios';
import type { 
    EventoResponseApi, 
    HeadToHeadResponseApi, 
    StandingsApiResponse 
} from '../types/sportApiTypes';

const BASE_URL = 'https://v3.football.api-sports.io';

// Interfaces para las respuestas de la API
interface ApiResponse<T> {
    get: string;
    parameters: Record<string, any>;
    errors: any[];
    results: number;
    paging: {
        current: number;
        total: number;
    };
    response: T[];
}

// Endpoints de la API
const apiEndpoints = {
    EVENTO_BY_ID: (id: number) => `/fixtures?id=${id}`,
    H2H: (team1: number, team2: number) => `/fixtures/headtohead?h2h=${team1}-${team2}`,
    TABLA_CLASIFICACION: (leagueId: number, season: number = 2025) => `/standings?league=${leagueId}&season=${season}`,

};

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-apisports-key': '50a0c0944d32698112f06a42b3b3248e',
        'Content-Type': 'application/json',
    },
});

// Método genérico para realizar peticiones GET
export const get = async <T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
    try {
        const response: AxiosResponse<ApiResponse<T>> = await apiClient.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('Error en la petición a la API:', error);
        throw error;
    }
};

// Servicio específico para obtener evento por ID
export const getEventoById = async (id: number): Promise<EventoResponseApi | null> => {
    try {
        const response = await get<EventoResponseApi>(apiEndpoints.EVENTO_BY_ID(id));
        return response.response.length > 0 ? response.response[0] : null;
    } catch (error) {
        console.error('Error al obtener evento por ID:', error);
        throw error;
    }
};

// Servicio específico para obtener historial entre equipos (Head to Head)
export const getHeadToHead = async (team1: number, team2: number): Promise<HeadToHeadResponseApi[]> => {
    try {
        const response = await get<HeadToHeadResponseApi>(apiEndpoints.H2H(team1, team2));
        return response.response;
    } catch (error) {
        console.error('Error al obtener Head to Head:', error);
        throw error;
    }
};

// Servicio específico para obtener tabla de clasificación
export const getTablaClasificacion = async (leagueId: number, season: number = 2025): Promise<StandingsApiResponse[]> => {
    try {
        const response = await get<{ league: any; standings: StandingsApiResponse[][] }>(
            apiEndpoints.TABLA_CLASIFICACION(leagueId, season)
        );
        // La API devuelve standings como un array anidado, tomamos el primer grupo
        return response.response.length > 0 && response.response[0].standings.length > 0 
            ? response.response[0].standings[0] 
            : [];
    } catch (error) {
        console.error('Error al obtener tabla de clasificación:', error);
        throw error;
    }
};







// Exportar todo el servicio como objeto
export const apiSportService = {
    getEventoById,
    getHeadToHead,
    getTablaClasificacion,
    get,
};
