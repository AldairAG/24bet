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

export interface CreateCryptoWalletDto {

    nombre: string;

    address: string;

    tipoCrypto: TipoCrypto;

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