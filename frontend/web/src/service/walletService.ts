import axios from 'axios';
import { apiBase } from './apiBase';
import { type CreateCryptoWalletDto, TipoCrypto, type CryptoWalletDto, type SolicitudDepositoResponse, type SolicitudDepositoDto, type SolicitudRetiroDto, type SolicitudRetiroResponse } from '../types/walletTypes';

// Tipo genérico para respuestas paginadas de Spring
type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty?: boolean;
    numberOfElements?: number;
    sort?: unknown;
    pageable?: unknown;
};

/**
 * Servicio para la gestión de wallets de criptomonedas
 */
class WalletService {
    private baseUrl = '/crypto-wallets';
    private unwrapApiResponse<T>(res: unknown): T {
        if (res && typeof res === 'object' && 'data' in (res as Record<string, unknown>)) {
            const maybe = (res as { data?: unknown }).data;
            if (maybe !== undefined) {
                return maybe as T;
            }
        }
        return res as T;
    }

    /**
     * Crea un nuevo wallet crypto para un usuario
     * @param usuarioId ID del usuario
     * @param createWalletData Datos para crear el wallet
     * @returns Promise con el wallet creado
     */
    async createWallet(usuarioId: number, createWalletData: CreateCryptoWalletDto): Promise<CryptoWalletDto> {
        try {
            const raw = await apiBase.post<CryptoWalletDto>(
                `${this.baseUrl}/usuario/${usuarioId}`,
                createWalletData
            );
            // Puede venir envuelto o no; desenvuelve si existe data, de lo contrario retorna el body tal cual
            return this.unwrapApiResponse<CryptoWalletDto>(raw);
        } catch (error) {
            console.error('Error creating crypto wallet:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Crea una solicitud de depósito para un usuario
     * @param usuarioId ID del usuario
     * @param depositoData Datos de la solicitud de depósito
     * @returns Promise con la respuesta de la solicitud de depósito
     */
    async createSolicitudDeposito(usuarioId: number, depositoData: SolicitudDepositoDto): Promise<SolicitudDepositoResponse> {
        try {
            const raw = await apiBase.post<SolicitudDepositoResponse>(
                `${this.baseUrl}/usuario/${usuarioId}/solicitud-deposito`,
                depositoData
            );
            // Puede venir envuelto o no
            return this.unwrapApiResponse<SolicitudDepositoResponse>(raw);
        } catch (error) {
            console.error('Error creating deposit request:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Crea una solicitud de retiro
     * @param usuarioId ID del usuario
     * @param retiroData Datos de la solicitud de retiro
     * @returns Promise con la respuesta de la solicitud de retiro  
     */
    async createSolicitudRetiro(usuarioId: number, retiroData: SolicitudRetiroDto): Promise<SolicitudRetiroResponse> {

        try {
            const raw = await apiBase.post<SolicitudRetiroResponse>(
                `${this.baseUrl}/usuario/${usuarioId}/solicitud-retiro`,
                retiroData
            );
            // Puede venir envuelto o no
            return this.unwrapApiResponse<SolicitudRetiroResponse>(raw);
        } catch (error) {
            console.error('Error creating withdrawal request:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene todos los wallets de un usuario
     * @param usuarioId ID del usuario
     * @returns Promise con la lista de wallets del usuario
     */
    async getWalletsByUsuario(usuarioId: number): Promise<CryptoWalletDto[]> {
        try {
            const response = await apiBase.get<CryptoWalletDto[]>(
                `${this.baseUrl}/usuario/${usuarioId}`
            );
            // Este endpoint SI usa wrapper { success, message, data }
            return response.data;
        } catch (error) {
            console.error('Error fetching user wallets:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Desactiva un wallet (equivalente a eliminar)
     * @param walletId ID del wallet a desactivar
     * @returns Promise que se resuelve cuando el wallet es desactivado
     */
    async deactivateWallet(walletId: number): Promise<void> {
        try {
            await apiBase.patch(`${this.baseUrl}/${walletId}/desactivar`);
        } catch (error) {
            console.error('Error deactivating wallet:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene las solicitudes de retiro de un usuario
     * @param usuarioId ID del usuario
     * @returns Promise con la lista de solicitudes de retiro
     */
    async getSolicitudesRetiro(usuarioId: number): Promise<PageResponse<unknown>> {
        try {
            const raw = await apiBase.get(
                `${this.baseUrl}/usuario/${usuarioId}/solicitudes-retiro`
            );
            // Puede venir envuelto o no; si viene envuelto extrae data, en caso contrario devuelve el body
            return this.unwrapApiResponse<PageResponse<unknown>>(raw);
        } catch (error) {
            console.error('Error fetching withdrawal requests:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Obtiene todos los tipos de criptomonedas disponibles
     * @returns Array con todos los tipos de crypto disponibles
     */
    getTiposCrypto(): TipoCrypto[] {
        return Object.values(TipoCrypto);
    }

    /**
     * Obtiene el nombre completo de una criptomoneda por su tipo
     * @param tipo Tipo de criptomoneda
     * @returns Nombre completo de la criptomoneda
     */
    getCryptoNombreCompleto(tipo: TipoCrypto): string {
        const nombres: Record<TipoCrypto, string> = {
            [TipoCrypto.BITCOIN]: 'BITCOIN',
            [TipoCrypto.ETHEREUM]: 'ETHEREUM',
            [TipoCrypto.LITECOIN]: 'LITECOIN',
            [TipoCrypto.RIPPLE]: 'RIPPLE',
            [TipoCrypto.CARDANO]: 'CARDANO',
            [TipoCrypto.POLKADOT]: 'POLKADOT',
            [TipoCrypto.CHAINLINK]: 'CHAINLINK',
            [TipoCrypto.BITCOIN_CASH]: 'BITCOIN_CASH',
            [TipoCrypto.STELLAR]: 'STELLAR',
            [TipoCrypto.DOGECOIN]: 'DOGECOIN',
            [TipoCrypto.POLYGON]: 'POLYGON',
            [TipoCrypto.SOLANA]: 'SOLANA',
            [TipoCrypto.AVALANCHE]: 'AVALANCHE',
            [TipoCrypto.TRON]: 'TRON',
            [TipoCrypto.BINANCE_COIN]: 'BINANCE_COIN',
            [TipoCrypto.USDT]: 'USDT',
            [TipoCrypto.USDC]: 'USDC',
            [TipoCrypto.BUSD]: 'BUSD'
        };
        
        return nombres[tipo] || tipo;
    }

    /**
     * Valida los datos de creación de un wallet
     * @param createWalletData Datos a validar
     * @returns true si los datos son válidos
     * @throws Error si los datos no son válidos
     */
    validateCreateWalletData(createWalletData: CreateCryptoWalletDto): boolean {
        const { nombre, address, tipoCrypto } = createWalletData;

        // Validar nombre
        if (!nombre || nombre.trim().length === 0) {
            throw new Error('El nombre del wallet es obligatorio');
        }
        
        if (nombre.length > 100) {
            throw new Error('El nombre del wallet no puede exceder 100 caracteres');
        }

        // Validar address
        if (!address || address.trim().length === 0) {
            throw new Error('La dirección del wallet es obligatoria');
        }
        
        if (address.length > 255) {
            throw new Error('La dirección del wallet no puede exceder 255 caracteres');
        }

        // Validar tipo de crypto
        if (!tipoCrypto) {
            throw new Error('El tipo de criptomoneda es obligatorio');
        }
        
        if (!Object.values(TipoCrypto).includes(tipoCrypto)) {
            throw new Error('Tipo de criptomoneda no válido');
        }

        return true;
    }

    /**
     * Maneja errores de las peticiones HTTP
     * @param error Error capturado
     * @returns Error procesado
     */
    private handleError(error: unknown): Error {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            let message: string | undefined;
            const respData = error.response?.data as unknown;
            if (respData && typeof respData === 'object' && 'message' in (respData as Record<string, unknown>)) {
                const maybeMsg = (respData as Record<string, unknown>).message;
                if (typeof maybeMsg === 'string') {
                    message = maybeMsg;
                }
            }
            message = message || error.response?.statusText || error.message;

            switch (status) {
                case 400:
                    return new Error(`Datos inválidos: ${message}`);
                case 401:
                    return new Error('No autorizado. Por favor, inicie sesión nuevamente.');
                case 403:
                    return new Error('No tiene permisos para realizar esta acción.');
                case 404:
                    return new Error('Recurso no encontrado.');
                case 409:
                    return new Error('Conflicto en la operación.');
                case 500:
                    return new Error('Error interno del servidor. Inténtelo más tarde.');
                default:
                    return new Error(message || 'Error del servidor');
            }
        }

        if (error instanceof Error) {
            return new Error(error.message);
        }

        return new Error('Error desconocido');
    }
}

// Exportar instancia única del servicio
export const walletService = new WalletService();
export default walletService;