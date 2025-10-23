import type { SolicitudDepositoDto, SolicitudDepositoResponse } from '../types/walletTypes';
import { api } from './apiBase';

// ========== TIPOS Y INTERFACES ==========

export enum TipoCrypto {
  BITCOIN = 'BITCOIN',
  ETHEREUM = 'ETHEREUM',
  LITECOIN = 'LITECOIN',
  RIPPLE = 'RIPPLE',
  CARDANO = 'CARDANO',
  POLKADOT = 'POLKADOT',
  CHAINLINK = 'CHAINLINK',
  BITCOIN_CASH = 'BITCOIN_CASH',
  STELLAR = 'STELLAR',
  DOGECOIN = 'DOGECOIN',
  POLYGON = 'POLYGON',
  SOLANA = 'SOLANA',
  AVALANCHE = 'AVALANCHE',
  TRON = 'TRON',
  BINANCE_COIN = 'BINANCE_COIN',
  USDT = 'USDT',
  USDC = 'USDC',
  BUSD = 'BUSD',
}

export interface CryptoWalletDto {
  id: number;
  nombre: string;
  address: string;
  tipoCrypto: TipoCrypto;
  numeroTransacciones: number;
  totalRetirado: number;
  balanceActual: number;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  ultimaTransaccion?: string;
  usuarioId: number;
}

export interface CreateCryptoWalletDto {
  nombre: string;
  address: string;
  tipoCrypto: TipoCrypto;
  balanceInicial?: number;
}

export interface UpdateCryptoWalletDto {
  nombre?: string;
  balanceActual?: number;
  activo?: boolean;
}

export interface CryptoWalletSummaryDto {
  id: number;
  nombre: string;
  tipoCrypto: TipoCrypto;
  simboloCrypto: string;
  nombreCompletoCrypto: string;
  balanceActual: number;
  numeroTransacciones: number;
  activo: boolean;
  ultimaTransaccion?: string;
}

export interface WalletStatsDto {
  totalWallets: number;
  totalTransacciones: number;
  balanceTotal: number;
  walletsConBalance: number;
}

export interface BalanceUpdateRequest {
  nuevoBalance: number;
}

export interface TransactionRequest {
  cantidad: number;
}

export interface TipoCryptoInfo {
  tipo: TipoCrypto;
  simbolo: string;
  nombreCompleto: string;
}

// ========== MAPA DE INFORMACIÓN DE CRIPTOMONEDAS ==========

export const CRYPTO_INFO: Record<TipoCrypto, TipoCryptoInfo> = {
  [TipoCrypto.BITCOIN]: { tipo: TipoCrypto.BITCOIN, simbolo: 'BTC', nombreCompleto: 'Bitcoin' },
  [TipoCrypto.ETHEREUM]: { tipo: TipoCrypto.ETHEREUM, simbolo: 'ETH', nombreCompleto: 'Ethereum' },
  [TipoCrypto.LITECOIN]: { tipo: TipoCrypto.LITECOIN, simbolo: 'LTC', nombreCompleto: 'Litecoin' },
  [TipoCrypto.RIPPLE]: { tipo: TipoCrypto.RIPPLE, simbolo: 'XRP', nombreCompleto: 'Ripple' },
  [TipoCrypto.CARDANO]: { tipo: TipoCrypto.CARDANO, simbolo: 'ADA', nombreCompleto: 'Cardano' },
  [TipoCrypto.POLKADOT]: { tipo: TipoCrypto.POLKADOT, simbolo: 'DOT', nombreCompleto: 'Polkadot' },
  [TipoCrypto.CHAINLINK]: { tipo: TipoCrypto.CHAINLINK, simbolo: 'LINK', nombreCompleto: 'Chainlink' },
  [TipoCrypto.BITCOIN_CASH]: { tipo: TipoCrypto.BITCOIN_CASH, simbolo: 'BCH', nombreCompleto: 'Bitcoin Cash' },
  [TipoCrypto.STELLAR]: { tipo: TipoCrypto.STELLAR, simbolo: 'XLM', nombreCompleto: 'Stellar' },
  [TipoCrypto.DOGECOIN]: { tipo: TipoCrypto.DOGECOIN, simbolo: 'DOGE', nombreCompleto: 'Dogecoin' },
  [TipoCrypto.POLYGON]: { tipo: TipoCrypto.POLYGON, simbolo: 'MATIC', nombreCompleto: 'Polygon' },
  [TipoCrypto.SOLANA]: { tipo: TipoCrypto.SOLANA, simbolo: 'SOL', nombreCompleto: 'Solana' },
  [TipoCrypto.AVALANCHE]: { tipo: TipoCrypto.AVALANCHE, simbolo: 'AVAX', nombreCompleto: 'Avalanche' },
  [TipoCrypto.TRON]: { tipo: TipoCrypto.TRON, simbolo: 'TRX', nombreCompleto: 'Tron' },
  [TipoCrypto.BINANCE_COIN]: { tipo: TipoCrypto.BINANCE_COIN, simbolo: 'BNB', nombreCompleto: 'Binance Coin' },
  [TipoCrypto.USDT]: { tipo: TipoCrypto.USDT, simbolo: 'USDT', nombreCompleto: 'Tether' },
  [TipoCrypto.USDC]: { tipo: TipoCrypto.USDC, simbolo: 'USDC', nombreCompleto: 'USD Coin' },
  [TipoCrypto.BUSD]: { tipo: TipoCrypto.BUSD, simbolo: 'BUSD', nombreCompleto: 'Binance USD' },
};

// ========== SERVICIO CRYPTO WALLET ==========

class CryptoWalletService {
  private readonly baseUrl = '/crypto-wallets';

  /**
   * Crea un nuevo wallet crypto para un usuario
   */
  async createWallet(usuarioId: number, createDto: CreateCryptoWalletDto): Promise<CryptoWalletDto> {
    try {
      const response = await api.post<CryptoWalletDto>(
        `${this.baseUrl}/usuario/${usuarioId}`,
        createDto
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear wallet crypto:', error);
      throw new Error('No se pudo crear el wallet crypto');
    }
  }

  /**Crear solicitud de deposito */
  async createDepositoRequest(usuarioId: number, depositoDto: SolicitudDepositoDto): Promise<SolicitudDepositoResponse> {
    try {
      const response = await api.post<SolicitudDepositoResponse>(
        `${this.baseUrl}/usuario/${usuarioId}/deposito`,
        depositoDto
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear solicitud de deposito:', error);
      throw new Error('No se pudo crear la solicitud de deposito');
    }
  }


  /**Crear solicitud de retiro */
  async createRetiroRequest(usuarioId: number, retiroDto: SolicitudDepositoDto): Promise<SolicitudDepositoResponse> {
    try {
      const response = await api.post<SolicitudDepositoResponse>(
        `${this.baseUrl}/usuario/${usuarioId}/retiro`,
        retiroDto
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear solicitud de retiro:', error);
      throw new Error('No se pudo crear la solicitud de retiro');
    }
  }

  /**
   * Obtiene todos los wallets de un usuario
   */
  async getWalletsByUsuario(usuarioId: number): Promise<CryptoWalletDto[]> {
    try {
      const response = await api.get<CryptoWalletDto[]>(
        `${this.baseUrl}/usuario/${usuarioId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener wallets del usuario:', error);
      throw new Error('No se pudieron obtener los wallets');
    }
  }

  /**
   * Obtiene todos los wallets activos de un usuario
   */
  async getActiveWalletsByUsuario(usuarioId: number): Promise<CryptoWalletDto[]> {
    try {
      const response = await api.get<CryptoWalletDto[]>(
        `${this.baseUrl}/usuario/${usuarioId}/activos`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener wallets activos:', error);
      throw new Error('No se pudieron obtener los wallets activos');
    }
  }

  /**
   * Obtiene un resumen de los wallets de un usuario
   */
  async getWalletsSummary(usuarioId: number): Promise<CryptoWalletSummaryDto[]> {
    try {
      const response = await api.get<CryptoWalletSummaryDto[]>(
        `${this.baseUrl}/usuario/${usuarioId}/resumen`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener resumen de wallets:', error);
      throw new Error('No se pudo obtener el resumen de wallets');
    }
  }

  /**
   * Obtiene estadísticas de wallets de un usuario
   */
  async getWalletStats(usuarioId: number): Promise<WalletStatsDto> {
    try {
      const response = await api.get<WalletStatsDto>(
        `${this.baseUrl}/usuario/${usuarioId}/estadisticas`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de wallets:', error);
      throw new Error('No se pudieron obtener las estadísticas');
    }
  }

  /**
   * Obtiene un wallet específico por ID
   */
  async getWalletById(walletId: number): Promise<CryptoWalletDto> {
    try {
      const response = await api.get<CryptoWalletDto>(
        `${this.baseUrl}/${walletId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener wallet por ID:', error);
      throw new Error('No se pudo obtener el wallet');
    }
  }

  /**
   * Obtiene un wallet por usuario y tipo de crypto
   */
  async getWalletByUsuarioAndTipo(
    usuarioId: number,
    tipoCrypto: TipoCrypto
  ): Promise<CryptoWalletDto | null> {
    try {
      const response = await api.get<CryptoWalletDto>(
        `${this.baseUrl}/usuario/${usuarioId}/tipo/${tipoCrypto}`
      );
      return response.data;
    } catch (error) {
      // Si es un error 404, retornamos null
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('not found'))) {
        return null;
      }
      console.error('Error al obtener wallet por tipo:', error);
      throw new Error('No se pudo obtener el wallet');
    }
  }

  /**
   * Actualiza un wallet
   */
  async updateWallet(walletId: number, updateDto: UpdateCryptoWalletDto): Promise<CryptoWalletDto> {
    try {
      const response = await api.put<CryptoWalletDto>(
        `${this.baseUrl}/${walletId}`,
        updateDto
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar wallet:', error);
      throw new Error('No se pudo actualizar el wallet');
    }
  }

  /**
   * Actualiza el balance de un wallet
   */
  async updateBalance(walletId: number, nuevoBalance: number): Promise<CryptoWalletDto> {
    try {
      const request: BalanceUpdateRequest = { nuevoBalance };
      const response = await api.patch<CryptoWalletDto>(
        `${this.baseUrl}/${walletId}/balance`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar balance:', error);
      throw new Error('No se pudo actualizar el balance');
    }
  }

  /**
   * Procesa un depósito en un wallet
   */
  async processDeposit(walletId: number, cantidad: number): Promise<CryptoWalletDto> {
    try {
      const request: TransactionRequest = { cantidad };
      const response = await api.post<CryptoWalletDto>(
        `${this.baseUrl}/${walletId}/deposito`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error al procesar depósito:', error);
      throw new Error('No se pudo procesar el depósito');
    }
  }

  /**
   * Procesa un retiro de un wallet
   */
  async processWithdrawal(walletId: number, cantidad: number): Promise<CryptoWalletDto> {
    try {
      const request: TransactionRequest = { cantidad };
      const response = await api.post<CryptoWalletDto>(
        `${this.baseUrl}/${walletId}/retiro`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error al procesar retiro:', error);
      throw new Error('No se pudo procesar el retiro');
    }
  }

  /**
   * Desactiva un wallet (solo admin)
   */
  async deactivateWallet(walletId: number): Promise<void> {
    try {
      await api.patch<void>(`${this.baseUrl}/${walletId}/desactivar`);
    } catch (error) {
      console.error('Error al desactivar wallet:', error);
      throw new Error('No se pudo desactivar el wallet');
    }
  }

  /**
   * Activa un wallet (solo admin)
   */
  async activateWallet(walletId: number): Promise<void> {
    try {
      await api.patch<void>(`${this.baseUrl}/${walletId}/activar`);
    } catch (error) {
      console.error('Error al activar wallet:', error);
      throw new Error('No se pudo activar el wallet');
    }
  }

  /**
   * Obtiene todos los tipos de criptomonedas disponibles
   */
  async getTiposCrypto(): Promise<TipoCrypto[]> {
    try {
      const response = await api.get<TipoCrypto[]>(`${this.baseUrl}/tipos-crypto`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipos de crypto:', error);
      // Retornamos los tipos locales como fallback
      return Object.values(TipoCrypto);
    }
  }

  // ========== MÉTODOS DE UTILIDAD ==========

  /**
   * Obtiene la información completa de una criptomoneda
   */
  getCryptoInfo(tipoCrypto: TipoCrypto): TipoCryptoInfo {
    return CRYPTO_INFO[tipoCrypto];
  }

  /**
   * Formatea el balance con el símbolo de la criptomoneda
   */
  formatBalance(balance: number, tipoCrypto: TipoCrypto): string {
    const info = this.getCryptoInfo(tipoCrypto);
    return `${balance.toFixed(8)} ${info.simbolo}`;
  }

  /**
   * Valida si una dirección de wallet tiene el formato correcto
   * (implementación básica, se puede mejorar con validaciones específicas por crypto)
   */
  validateWalletAddress(address: string, tipoCrypto: TipoCrypto): boolean {
    if (!address || address.trim().length === 0) {
      return false;
    }

    // Validaciones básicas por tipo de crypto
    switch (tipoCrypto) {
      case TipoCrypto.BITCOIN:
      case TipoCrypto.BITCOIN_CASH:
        return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address);

      case TipoCrypto.ETHEREUM:
      case TipoCrypto.USDT:
      case TipoCrypto.USDC:
        return /^0x[a-fA-F0-9]{40}$/.test(address);

      case TipoCrypto.LITECOIN:
        return /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$|^ltc1[a-z0-9]{39,59}$/.test(address);

      case TipoCrypto.RIPPLE:
        return /^r[a-zA-Z0-9]{24,34}$/.test(address);

      default:
        // Para otras cryptos, validación genérica
        return address.length >= 20 && address.length <= 100;
    }
  }

  /**
   * Calcula el total de balance en una moneda específica
   */
  calculateTotalBalance(wallets: CryptoWalletDto[], tipoCrypto?: TipoCrypto): number {
    return wallets
      .filter(wallet => !tipoCrypto || wallet.tipoCrypto === tipoCrypto)
      .filter(wallet => wallet.activo)
      .reduce((total, wallet) => total + wallet.balanceActual, 0);
  }

  /**
   * Obtiene los wallets agrupados por tipo de crypto
   */
  groupWalletsByType(wallets: CryptoWalletDto[]): Record<TipoCrypto, CryptoWalletDto[]> {
    return wallets.reduce((groups, wallet) => {
      if (!groups[wallet.tipoCrypto]) {
        groups[wallet.tipoCrypto] = [];
      }
      groups[wallet.tipoCrypto].push(wallet);
      return groups;
    }, {} as Record<TipoCrypto, CryptoWalletDto[]>);
  }

  /**
   * Verifica si un usuario puede realizar una transacción
   */
  canPerformTransaction(wallet: CryptoWalletDto, amount: number): boolean {
    return wallet.activo && wallet.balanceActual >= amount && amount > 0;
  }

  /**
   * Obtiene el historial de transacciones resumido
   */
  getTransactionSummary(wallets: CryptoWalletDto[]): {
    totalTransacciones: number;
    walletsActivos: number;
    walletsConBalance: number;
  } {
    const totalTransacciones = wallets.reduce((total, wallet) => total + wallet.numeroTransacciones, 0);
    const walletsActivos = wallets.filter(wallet => wallet.activo).length;
    const walletsConBalance = wallets.filter(wallet => wallet.activo && wallet.balanceActual > 0).length;

    return {
      totalTransacciones,
      walletsActivos,
      walletsConBalance,
    };
  }
}

// Exportar una instancia única del servicio
export const cryptoWalletService = new CryptoWalletService();

// Exportar la clase para casos donde se necesite crear múltiples instancias
export { CryptoWalletService };

// Exportar funciones de utilidad directamente
export const cryptoUtils = {
  getCryptoInfo: (tipoCrypto: TipoCrypto) => CRYPTO_INFO[tipoCrypto],
  formatBalance: (balance: number, tipoCrypto: TipoCrypto) =>
    cryptoWalletService.formatBalance(balance, tipoCrypto),
  validateWalletAddress: (address: string, tipoCrypto: TipoCrypto) =>
    cryptoWalletService.validateWalletAddress(address, tipoCrypto),
  calculateTotalBalance: (wallets: CryptoWalletDto[], tipoCrypto?: TipoCrypto) =>
    cryptoWalletService.calculateTotalBalance(wallets, tipoCrypto),
  groupWalletsByType: (wallets: CryptoWalletDto[]) =>
    cryptoWalletService.groupWalletsByType(wallets),
};
