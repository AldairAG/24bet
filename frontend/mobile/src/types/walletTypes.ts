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
        BITCOIN = "BTC",
        ETHEREUM = "ETH",
        LITECOIN = "LTC",
        RIPPLE = "XRP",
        CARDANO = "ADA",
        POLKADOT = "DOT",
        CHAINLINK = "LINK",
        BITCOIN_CASH = "BCH",
        STELLAR = "XLM",
        DOGECOIN = "DOGE",
        POLYGON = "MATIC",
        SOLANA = "SOL",
        AVALANCHE = "AVAX",
        TRON = "TRX",
        BINANCE_COIN = "BNB",
        USDT = "USDT",
        USDC = "USDC",
        BUSD = "BUSD"
    }