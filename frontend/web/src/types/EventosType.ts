import type { GoalsApi, LeagueApi, ScoreApi, TeamsApi } from "./sportApiTypes";

/**
 * DTO básico para liga
 */
export interface LigaBasica {
    id: number;
    sportsDbId: string;
    nombre: string;
    nombreAlternativo: string;
    deporte: string;
    pais: string;
    logoUrl: string;
    badgeUrl: string;
    activa: boolean;
}
/**
 * DTO para respuesta de evento en vivo
 */
export interface EventoConOddsResponse {
    fixture: Fixture;
    league: LeagueApi;
    teams: TeamsApi;
    goals: GoalsApi;
    score: ScoreApi;
    sport: string;
    odds: Bet[];
}

/**
 * DTO para respuesta de ligas por deporte
 * @deprecated
 */
export interface LigaPorDeporteResponse {
    id: number;
    nombreLiga: string;
    pais: string;
    banderaPais: string;
    deporte: string;
    activa: boolean;
}

/**
 * DTO para respuesta detallada de liga por deporte
 */
export interface LigaPorDeporteDetalleResponse {
    id: number,
    apiSportsId: number,
    temporada: number,
    nombre: string,
    pais: PaisResponse,
    paisNombre: string,
    logoUrl: string,
    activa: boolean,
    fechaCreacion: string,
    fechaActualizacion: string,
}

/**
 * DTO para respuesta de eventos por liga
 */
export interface FixtureStatus {
    long: string;
    short: string;
}

export interface Evento {
    fixture: Fixture;
    bets: Bet[];
    teams: TeamsApi;
}

export interface Bet {
    id: number;
    name: string;
    values: Value[];
}

export interface Value {
    id:number
    value: string;
    odd: number;
}

export interface Fixture {
    id: number;
    date: string;
    timestamp: number;
    status: FixtureStatus;
}

export interface EventosPorLigaResponse {
    fixture: Fixture;
    nombreEvento: string;
}

export interface DateGroup {
    date: string;
    displayDate: string;
    events: EventosPorLigaResponse[];
    isExpanded: boolean;
}

/**
 * DTO para respuesta de pais
 */
export interface PaisResponse {
    id: number;
    name: string;
    countryCode: string;
    flagUrl: string;
    activo: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
}

/**
 * DTO básico para equipo
 */
export interface EquipoBasico {
    id: number;
    sportsDbId: string;
    nombre: string;
    nombreCorto: string;
    nombreAlternativo: string;
    pais: string;
    ciudad: string;
    logoUrl: string;
    jerseyUrl: string;
    estadio: string;
    activo: boolean;
}

/**
 * Respuesta de evento deportivo
 * Utilizado para el endpoint "Obtiene todos los eventos en vivo"
 * GET /24bet/eventos/en-vivo
 * @deprecated
 */
export interface EventoDeportivoResponse {
    id: number;
    sportsDbId: string;
    nombre: string;
    descripcion?: string; // Opcional
    fechaEvento: string; // LocalDateTime se mapea a string en JSON
    temporada: string;
    jornada: string;
    semana?: number; // Opcional
    estado: string;
    resultadoLocal?: number; // Opcional
    resultadoVisitante?: number; // Opcional
    resultadoMedioLocal?: number; // Opcional
    resultadoMedioVisitante?: number; // Opcional
    espectadores?: number; // Opcional
    tiempoPartido?: string; // Opcional
    thumbUrl?: string; // Opcional
    bannerUrl?: string; // Opcional
    videoUrl?: string; // Opcional
    ubicacion?: string; // Opcional
    pais?: string; // Opcional
    ciudad?: string; // Opcional
    latitud?: number; // Opcional - BigDecimal se mapea a number en TypeScript
    longitud?: number; // Opcional - BigDecimal se mapea a number en TypeScript
    esPostemporada: boolean;
    enVivo?: boolean; // Opcional - puede no venir del backend
    activo: boolean;
    fechaCreacion: string; // LocalDateTime se mapea a string en JSON
    fechaActualizacion: string; // LocalDateTime se mapea a string en JSON

    strEquipoLocal?: string; // Opcional
    strEquipoVisitante?: string; // Opcional

    // Información de la liga
    liga: LigaBasica;

    // Información de los equipos - Opcional ya que pueden no venir del backend
    equipoLocal?: EquipoBasico;
    equipoVisitante?: EquipoBasico;
}

/**
 * Array de eventos deportivos - Respuesta del endpoint en vivo
 * @deprecated
 */
export type EventosEnVivoResponse = EventoDeportivoResponse[];

/**
 * Estados posibles de un evento deportivo
 */
export enum EstadoEvento {
    PROGRAMADO = 'PROGRAMADO',
    EN_VIVO = 'EN_VIVO',
    FINALIZADO = 'FINALIZADO',
    CANCELADO = 'CANCELADO',
    POSTERGADO = 'POSTERGADO',
    SUSPENDIDO = 'SUSPENDIDO'
}

/**
 * Deportes disponibles
 */
export enum TipoDeporte {
    FUTBOL = 'Soccer',
    BASKETBALL = 'Basketball',
    BASEBALL = 'Baseball',
    AMERICANFOOTBALL = 'American Football',
    HOCKEY = 'Ice Hockey',
    TENNIS = 'Tennis'
}
