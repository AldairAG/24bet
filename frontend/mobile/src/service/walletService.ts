import { apiBase } from './apiBase';
import { CreateCryptoWalletDto, TipoCrypto, CryptoWalletDto } from '../types/walletTypes';

/**
 * Servicio para la gestión de wallets de criptomonedas
 */
class WalletService {
    private baseUrl = '/crypto-wallets';

    /**
     * Crea un nuevo wallet crypto para un usuario
     * @param usuarioId ID del usuario
     * @param createWalletData Datos para crear el wallet
     * @returns Promise con el wallet creado
     */
    async createWallet(usuarioId: number, createWalletData: CreateCryptoWalletDto): Promise<CryptoWalletDto> {
        try {
            const response = await apiBase.post<CryptoWalletDto>(
                `${this.baseUrl}/usuario/${usuarioId}`,
                createWalletData
            );
            
            return response.data;
        } catch (error) {
            console.error('Error creating crypto wallet:', error);
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
            const prueba = response.data;
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
    private handleError(error: any): Error {
        if (error.response) {
            // Error de respuesta del servidor
            const status = error.response.status;
            const message = error.response.data?.message || error.response.statusText;
            
            switch (status) {
                case 400:
                    return new Error(`Datos inválidos: ${message}`);
                case 401:
                    return new Error('No autorizado. Por favor, inicie sesión nuevamente.');
                case 403:
                    return new Error('No tiene permisos para realizar esta acción.');
                case 404:
                    return new Error('Usuario no encontrado.');
                case 409:
                    return new Error('Ya existe un wallet para este tipo de criptomoneda.');
                case 500:
                    return new Error('Error interno del servidor. Inténtelo más tarde.');
                default:
                    return new Error(`Error del servidor: ${message}`);
            }
        } else if (error.request) {
            // Error de red
            return new Error('Error de conexión. Verifique su conexión a internet.');
        } else {
            // Error de configuración
            return new Error(`Error: ${error.message}`);
        }
    }
}

// Exportar instancia única del servicio
export const walletService = new WalletService();
export default walletService;