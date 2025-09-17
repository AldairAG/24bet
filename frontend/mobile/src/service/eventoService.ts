import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import React from 'react';

// Interfaces para los tipos de datos
export interface EventoDeportivo {
  id: number;
  equipoLocal: string;
  equipoVisitante: string;
  fechaInicio: string;
  estado: 'PROGRAMADO' | 'EN_VIVO' | 'FINALIZADO' | 'CANCELADO' | 'PAUSADO';
  marcadorLocal?: number;
  marcadorVisitante?: number;
  minutoJuego?: number;
  liga: Liga;
  momios: Momio[];
}

export interface Momio {
  id: number;
  eventoDeportivoId: number;
  tipo: 'GANADOR' | 'EMPATE' | 'TOTAL_GOLES' | 'HANDICAP';
  nombre: string;
  cuota: number;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Liga {
  id: number;
  nombre: string;
  pais: string;
  activa: boolean;
}

export interface EstadisticasEventos {
  totalEventos: number;
  eventosEnVivo: number;
  eventosProximos: number;
  totalMomios: number;
  ligasActivas: number;
}

// Tipos para los callbacks
export type EventoCallback = (eventos: EventoDeportivo[]) => void;
export type MomioCallback = (momios: Momio[]) => void;
export type EstadisticasCallback = (estadisticas: EstadisticasEventos) => void;
export type EventoEspecificoCallback = (evento: EventoDeportivo) => void;
export type ConexionCallback = (conectado: boolean) => void;

export class EventosWebSocketService {
  private client: Client | null = null;
  private connected = false;
  private subscriptions = new Map<string, any>();
  private reconnectInterval: NodeJS.Timeout | null = null;
  private readonly baseUrl: string;
  
  // Callbacks para los diferentes tipos de eventos
  private callbacks = {
    conexion: new Set<ConexionCallback>(),
    eventosEnVivo: new Set<EventoCallback>(),
    eventosProximos: new Set<EventoCallback>(),
    momios: new Set<MomioCallback>(),
    estadisticas: new Set<EstadisticasCallback>(),
    eventosEspecificos: new Map<number, Set<EventoEspecificoCallback>>()
  };

  constructor(baseUrl: string = 'http://localhost:8080') {
    this.baseUrl = baseUrl;
    this.initializeClient();
  }

  /**
   * Inicializa el cliente WebSocket
   */
  private initializeClient(): void {
    const socket = new SockJS(`${this.baseUrl}/ws`);
    
    this.client = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {},
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      console.log('✅ WebSocket conectado:', frame);
      this.connected = true;
      this.notifyConexionCallbacks(true);
      this.suscribirseATodosLosCanales();
      this.clearReconnectInterval();
    };

    this.client.onDisconnect = (frame) => {
      console.log('❌ WebSocket desconectado:', frame);
      this.connected = false;
      this.notifyConexionCallbacks(false);
      this.startReconnect();
    };

    this.client.onStompError = (frame) => {
      console.error('❌ Error STOMP:', frame.headers['message'], frame.body);
      this.connected = false;
      this.notifyConexionCallbacks(false);
      this.startReconnect();
    };
  }

  /**
   * Conectar al WebSocket
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }

      const onConnect = () => {
        if (this.client) {
          this.client.onConnect = undefined;
          this.client.onStompError = undefined;
        }
        resolve();
      };

      const onError = (frame: any) => {
        if (this.client) {
          this.client.onConnect = undefined;
          this.client.onStompError = undefined;
        }
        reject(new Error(`Error de conexión: ${frame.headers?.message || 'Desconocido'}`));
      };

      this.client!.onConnect = onConnect;
      this.client!.onStompError = onError;

      try {
        this.client?.activate();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Desconectar del WebSocket
   */
  public disconnect(): void {
    this.clearReconnectInterval();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
    this.client?.deactivate();
    this.connected = false;
    this.notifyConexionCallbacks(false);
  }

  /**
   * Suscribirse a todos los canales principales
   */
  private suscribirseATodosLosCanales(): void {
    // Eventos en vivo
    this.suscribirse('/topic/eventos-vivo', (message) => {
      const eventos: EventoDeportivo[] = JSON.parse(message.body);
      this.callbacks.eventosEnVivo.forEach(callback => callback(eventos));
    });

    // Eventos próximos
    this.suscribirse('/topic/eventos-proximos', (message) => {
      const eventos: EventoDeportivo[] = JSON.parse(message.body);
      this.callbacks.eventosProximos.forEach(callback => callback(eventos));
    });

    // Momios actualizados
    this.suscribirse('/topic/momios', (message) => {
      const momios: Momio[] = JSON.parse(message.body);
      this.callbacks.momios.forEach(callback => callback(momios));
    });

    // Estadísticas
    this.suscribirse('/topic/estadisticas', (message) => {
      const estadisticas: EstadisticasEventos = JSON.parse(message.body);
      this.callbacks.estadisticas.forEach(callback => callback(estadisticas));
    });
  }

  /**
   * Suscribirse a un canal específico
   */
  private suscribirse(destination: string, callback: (message: any) => void): void {
    if (!this.client?.connected) {
      console.warn('Cliente no conectado, no se puede suscribir a:', destination);
      return;
    }

    const subscription = this.client.subscribe(destination, callback);
    this.subscriptions.set(destination, subscription);
    console.log(`📡 Suscrito a: ${destination}`);
  }

  /**
   * Suscribirse a un evento específico
   */
  public suscribirseAEvento(eventoId: number, callback: EventoEspecificoCallback): void {
    const destination = `/topic/evento/${eventoId}`;
    
    // Agregar callback al map
    if (!this.callbacks.eventosEspecificos.has(eventoId)) {
      this.callbacks.eventosEspecificos.set(eventoId, new Set());
    }
    this.callbacks.eventosEspecificos.get(eventoId)?.add(callback);

    // Si ya existe la suscripción, no crear otra
    if (this.subscriptions.has(destination)) {
      return;
    }

    this.suscribirse(destination, (message) => {
      const evento: EventoDeportivo = JSON.parse(message.body);
      const callbacks = this.callbacks.eventosEspecificos.get(eventoId);
      callbacks?.forEach(cb => cb(evento));
    });
  }

  /**
   * Desuscribirse de un evento específico
   */
  public desuscribirseDeEvento(eventoId: number, callback?: EventoEspecificoCallback): void {
    const destination = `/topic/evento/${eventoId}`;
    const callbacks = this.callbacks.eventosEspecificos.get(eventoId);

    if (callback && callbacks) {
      callbacks.delete(callback);
      
      // Si no quedan callbacks, desuscribirse completamente
      if (callbacks.size === 0) {
        this.callbacks.eventosEspecificos.delete(eventoId);
        const subscription = this.subscriptions.get(destination);
        if (subscription) {
          subscription.unsubscribe();
          this.subscriptions.delete(destination);
        }
      }
    } else {
      // Desuscribirse completamente del evento
      this.callbacks.eventosEspecificos.delete(eventoId);
      const subscription = this.subscriptions.get(destination);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptions.delete(destination);
      }
    }
  }

  // Métodos para agregar callbacks
  public onConexion(callback: ConexionCallback): () => void {
    this.callbacks.conexion.add(callback);
    // Retornar función para desuscribirse
    return () => this.callbacks.conexion.delete(callback);
  }

  public onEventosEnVivo(callback: EventoCallback): () => void {
    this.callbacks.eventosEnVivo.add(callback);
    return () => this.callbacks.eventosEnVivo.delete(callback);
  }

  public onEventosProximos(callback: EventoCallback): () => void {
    this.callbacks.eventosProximos.add(callback);
    return () => this.callbacks.eventosProximos.delete(callback);
  }

  public onMomios(callback: MomioCallback): () => void {
    this.callbacks.momios.add(callback);
    return () => this.callbacks.momios.delete(callback);
  }

  public onEstadisticas(callback: EstadisticasCallback): () => void {
    this.callbacks.estadisticas.add(callback);
    return () => this.callbacks.estadisticas.delete(callback);
  }

  /**
   * Métodos utilitarios
   */
  public isConnected(): boolean {
    return this.connected;
  }

  public getSubscriptionsCount(): number {
    return this.subscriptions.size;
  }

  public getActiveEventSubscriptions(): number[] {
    return Array.from(this.callbacks.eventosEspecificos.keys());
  }

  /**
   * Notificar cambios de conexión
   */
  private notifyConexionCallbacks(conectado: boolean): void {
    this.callbacks.conexion.forEach(callback => callback(conectado));
  }

  /**
   * Iniciar proceso de reconexión
   */
  private startReconnect(): void {
    this.clearReconnectInterval();
    this.reconnectInterval = setInterval(() => {
      if (!this.connected) {
        console.log('🔄 Intentando reconectar...');
        this.initializeClient();
        this.client?.activate();
      } else {
        this.clearReconnectInterval();
      }
    }, 5000);
  }

  /**
   * Limpiar intervalo de reconexión
   */
  private clearReconnectInterval(): void {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  /**
   * Método para forzar reconexión manual
   */
  public reconnect(): void {
    this.disconnect();
    setTimeout(() => {
      this.connect().catch(console.error);
    }, 1000);
  }

  /**
   * Obtener estadísticas de conexión
   */
  public getConnectionStats(): {
    connected: boolean;
    subscriptions: number;
    activeEventSubscriptions: number;
    reconnecting: boolean;
  } {
    return {
      connected: this.connected,
      subscriptions: this.subscriptions.size,
      activeEventSubscriptions: this.callbacks.eventosEspecificos.size,
      reconnecting: this.reconnectInterval !== null
    };
  }
}

// Instancia singleton del servicio
export const deportesWebSocketService = new DeportesWebSocketService();

// Hook personalizado para React Native (opcional)
export const useDeportesWebSocket = () => {
  const [connected, setConnected] = React.useState(false);
  const [stats, setStats] = React.useState(deportesWebSocketService.getConnectionStats());

  React.useEffect(() => {
    const unsubscribe = deportesWebSocketService.onConexion(setConnected);
    
    const interval = setInterval(() => {
      setStats(deportesWebSocketService.getConnectionStats());
    }, 1000);

    // Conectar automáticamente
    deportesWebSocketService.connect().catch(console.error);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return {
    connected,
    stats,
    service: deportesWebSocketService
  };
};

// Exportar también la clase para uso directo
export default DeportesWebSocketService;