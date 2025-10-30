import type { Usuario } from "./authTypes";
import type { SolicitudDepositoResponse, SolicitudRetiroResponse } from "./walletTypes";

export type EditUserProfile = Omit<Usuario, 'id' | 'activo' | 'fechaCreacion' | 'fechaActualizacion' | 'rol' | 'saldoUsd' | 'documentosKyc' | 'fechaNacimiento' >

export interface usuarioAdminResponse {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    saldoUsd: number;
}


export interface ResumenTransacciones {
    depositosPendientes: number;
    retirosPendientes: number;
    totalDepositado: number;
    totalRetirado: number;
    saldoDisponible: number;
    saldoBloqueado: number;
    retiros: SolicitudRetiroResponse[];
    depositos: SolicitudDepositoResponse[];
}
