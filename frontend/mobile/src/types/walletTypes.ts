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


