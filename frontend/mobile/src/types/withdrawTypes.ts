export interface WalletInfo {
    id: string;
    nombre: string;
    direccion: string;
    criptomoneda: string;
    simbolo: string;
    icono: string;
    color: string;
}

export interface SolicitudRetiro {
    id: string;
    walletId: string;
    cantidadUSD: number;
    cantidadCripto: number;
    simbolo: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
    fechaCreacion: Date;
}

export interface RetiroFormValues {
    cantidadUSD: string;
}

export interface WalletFormValues {
    nombre: string;
    direccion: string;
    criptomoneda: string;
}

export interface CriptomonedaConfig {
    nombre: string;
    simbolo: string;
    icono: string;
    color: string;
    tasaCambio: number;
}

export type CriptomonedaType = 'bitcoin' | 'ethereum' | 'usdt' | 'solana';
