export interface CryptoWalletDto {

    id: number;

    nombre: string;

    address: string;

    tipoCrypto: TipoCrypto;

    numeroTransacciones: number;

    totalRetirado: number;
    balanceActual: number;

    activo: boolean;

    fechaCreacion: Date;

    fechaActualizacion: Date;

    ultimaTransaccion: Date;
}


export enum TipoCrypto {
    BITCOIN = "BITCOIN",
    ETHEREUM = "ETHEREUM",
    LITECOIN = "LITECOIN",
    RIPPLE = "RIPPLE",
    CARDANO = "CARDANO",
    POLKADOT = "POLKADOT",
    CHAINLINK = "CHAINLINK",
    BITCOIN_CASH = "BITCOIN_CASH",
    STELLAR = "STELLAR",
    DOGECOIN = "DOGECOIN",
    POLYGON = "POLYGON",
    SOLANA = "SOLANA",
    AVALANCHE = "AVALANCHE",
    TRON = "TRON",
    BINANCE_COIN = "BINANCE_COIN",
    USDT = "USDT",
    USDC = "USDC",
    BUSD = "BUSD"
    
}

export interface CreateCryptoWalletDto {
    nombre: string;
    address: string;
    tipoCrypto: TipoCrypto;
}

export interface SolicitudDepositoResponse {
    mensaje: string;
    solicitudId: number;
    monto: number;
    estado: string;
}


export interface SolicitudDepositoDto {
    monto: number;
    metodoPago: MetodoPago;
    tipoCrypto: TipoCrypto;
    direccionWallet: string;
}


export enum MetodoPago {
    TRANSFERENCIA_BANCARIA = "TRANSFERENCIA_BANCARIA",
    BITCOIN = "BITCOIN",
    ETHEREUM = "ETHEREUM",
    USDT = "USDT",
    USDC = "USDC",
    TARJETA_CREDITO = "TARJETA_CREDITO",
    TARJETA_DEBITO = "TARJETA_DEBITO",
    TRANSFERENCIA_CRYPTO = "TRANSFERENCIA_CRYPTO",
    PAYPAL = "PAYPAL",
    OTRO = "OTRO"
}


export interface SolicitudRetiroResponse {
    mensaje: string;
    solicitudId: number;
    monto: number;
    montoNeto: number;
    comision: number;
    estado: EstadoSolicitud;
}

export enum MetodoRetiro {
    TRANSFERENCIA_BANCARIA = 'TRANSFERENCIA_BANCARIA',
    BITCOIN = 'BITCOIN',
    ETHEREUM = 'ETHEREUM',
    USDT = 'USDT',
    USDC = 'USDC',
    PAYPAL = 'PAYPAL',
    TRANSFERENCIA_CRYPTO = 'TRANSFERENCIA_CRYPTO',
    OTRO = 'OTRO'
}

export interface SolicitudRetiroDto {
    monto: number;
    metodoRetiro: MetodoRetiro;
    cuentaDestino: string;
    banco: string;
    numeroCuenta: string;
    titularCuenta: string;
    direccionWallet: string;
    tipoCrypto: TipoCrypto;
    observaciones: string;
    estado: EstadoSolicitud;
}

export enum EstadoSolicitud {
    PENDIENTE = 'PENDIENTE',
    APROBADA = 'APROBADA',
    RECHAZADA = 'RECHAZADA',
    PROCESANDO = 'PROCESANDO',
    COMPLETADA = 'COMPLETADA',
    CANCELADA = 'CANCELADA'
}

// ========== ADMINISTRACIÓN: Tipos y DTOs ==========

// Entidad mínima para solicitudes de depósito visibles por admin
export interface SolicitudDepositoAdmin {
    id: number;
    usuarioId: number;
    monto: number;
    estado: EstadoSolicitud | string;
    metodoPago?: string;
    observaciones?: string;
    fechaCreacion?: string;
    fechaActualizacion?: string;
    // Campos adicionales del backend se aceptan sin tipar explícito
    [key: string]: unknown;
}

// Entidad mínima para solicitudes de retiro visibles por admin
export interface SolicitudRetiroAdmin {
    id: number;
    usuarioId: number;
    monto: number;
    montoNeto?: number;
    comision?: number;
    estado: EstadoSolicitud | string;
    metodoRetiro?: string;
    direccionWallet?: string;
    tipoCrypto?: TipoCrypto;
    referenciaTransaccion?: string;
    observaciones?: string;
    fechaCreacion?: string;
    fechaActualizacion?: string;
    // Campos adicionales del backend se aceptan sin tipar explícito
    [key: string]: unknown;
}

// DTOs para acciones de admin
export interface AdminAprobarSolicitudDto {
    adminId: number;
    observaciones?: string;
}

export interface AdminRechazarSolicitudDto {
    adminId: number;
    motivo: string;
}

export interface AdminAprobarRetiroDto {
    adminId: number;
    observaciones?: string;
    referenciaTransaccion: string;
}

// Resúmenes y estadísticas para vistas admin
export interface EstadisticasTransaccionesDto {
    depositosHoy: number;
    retirosHoy: number;
    // Permite información adicional sin romper el tipado
    [key: string]: unknown;
}

export interface DashboardAdminDto {
    depositosPendientes: number;
    retirosPendientes: number;
    depositosHoy: number;
    retirosHoy: number;
    ultimosDepositosPendientes: SolicitudDepositoAdmin[];
    ultimosRetirosPendientes: SolicitudRetiroAdmin[];
}


