import axios from 'axios';
import type {
    CryptoPrice
} from '../../types/CryptoTypes';

export async function getExchangeRates(): Promise<CryptoPrice> {
    // For now, return mock data. In production, this would fetch from a real API
    const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price?ids=solana%2Cethereum%2Cbitcoin&vs_currencies=usd";
    const response = await axios.get<CryptoPrice>(COINGECKO_URL);
    return response.data;
}