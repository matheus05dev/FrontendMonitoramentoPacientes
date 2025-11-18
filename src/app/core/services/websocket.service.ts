import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { API_CONFIG } from '../../config/API_CONFIG';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private tokenService = inject(TokenService);
  private stompClient: any = null;
  private socket: any = null;
  private isConnected$ = new BehaviorSubject<boolean>(false);
  private connectionSubject$ = new Subject<boolean>();
  private subscriptions: Map<string, any> = new Map();
  private connectPromise: Promise<void> | null = null;

  constructor() {
    // Não inicializar aqui, apenas quando necessário (quando conectar)
  }

  private async initializeStompClient(): Promise<void> {
    if (!this.stompClient) {
      try {
        // Garantir que global esteja definido antes de importar
        this.ensureGlobalPolyfill();

        // Importar STOMP e SockJS
        // Usar wrapper para SockJS que garante que global esteja definido
        const [{ Client }, { getSockJS }] = await Promise.all([
          import('@stomp/stompjs'),
          import('./sockjs-wrapper')
        ]);

        // Obter SockJS através do wrapper
        const SockJS = await getSockJS();

        // Criar cliente STOMP usando @stomp/stompjs
        this.stompClient = new Client({
          webSocketFactory: () => {
            return new SockJS(API_CONFIG.wsUrl) as any;
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          debug: (str: string) => {
            // Desabilitar logs excessivos - descomentar para debug
            // console.log('STOMP: ' + str);
          },
        });

        // Configurar callbacks de evento
        this.stompClient.onConnect = () => {
          console.log('WebSocket conectado');
          this.isConnected$.next(true);
          this.connectionSubject$.next(true);
        };

        this.stompClient.onDisconnect = () => {
          console.log('WebSocket desconectado');
          this.isConnected$.next(false);
          this.connectionSubject$.next(false);
        };

        this.stompClient.onStompError = (frame: any) => {
          console.error('Erro STOMP:', frame);
        };

        this.stompClient.onWebSocketError = (event: any) => {
          console.error('Erro WebSocket:', event);
        };
      } catch (error) {
        console.error('Erro ao carregar módulos WebSocket:', error);
        throw error;
      }
    }
  }

  /**
   * Garante que a variável global esteja definida
   */
  private ensureGlobalPolyfill(): void {
    // Definir no window
    if (typeof window !== 'undefined') {
      if (typeof (window as any).global === 'undefined') {
        (window as any).global = window;
      }
    }
    
    // Definir no globalThis
    if (typeof globalThis !== 'undefined') {
      if (typeof (globalThis as any).global === 'undefined') {
        (globalThis as any).global = typeof window !== 'undefined' ? window : globalThis;
      }
    }
    
    // Definir no self (para workers)
    if (typeof self !== 'undefined') {
      if (typeof (self as any).global === 'undefined') {
        (self as any).global = self;
      }
    }
  }

  /**
   * Conecta ao WebSocket
   */
  connect(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Inicializar o cliente se ainda não foi inicializado
        await this.initializeStompClient();

        if (!this.stompClient) {
          reject(new Error('Cliente STOMP não inicializado'));
          return;
        }

      const token = this.tokenService.getToken();
      if (!token) {
        reject(new Error('Token não encontrado. Não é possível conectar ao WebSocket.'));
        return;
      }

      // Configurar headers de autenticação
      this.stompClient.configure({
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Tentando conectar WebSocket com token:', token.substring(0, 20) + '...');

      // Criar uma Promise que será resolvida quando conectar
      const originalOnConnect = this.stompClient.onConnect;
      const originalOnStompError = this.stompClient.onStompError;
      const originalOnWebSocketError = this.stompClient.onWebSocketError;

      // Sobrescrever callbacks temporariamente para resolver a Promise
      this.stompClient.onConnect = (frame: any) => {
        console.log('WebSocket conectado com sucesso:', frame);
        if (originalOnConnect) {
          originalOnConnect(frame);
        }
        resolve();
      };

      this.stompClient.onStompError = (frame: any) => {
        console.error('Erro STOMP ao conectar:', frame);
        if (originalOnStompError) {
          originalOnStompError(frame);
        }
        reject(new Error(frame.headers?.['message'] || 'Erro ao conectar WebSocket'));
      };

      this.stompClient.onWebSocketError = (event: any) => {
        console.error('Erro WebSocket ao conectar:', event);
        if (originalOnWebSocketError) {
          originalOnWebSocketError(event);
        }
        reject(event);
      };

      // Ativar conexão
      this.stompClient.activate();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Desconecta do WebSocket
   */
  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      // Desinscrever de todas as assinaturas
      this.subscriptions.forEach((subscription, destination) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      this.stompClient.deactivate();
      console.log('WebSocket desconectado');
      this.isConnected$.next(false);
      this.connectionSubject$.next(false);
    }
  }

  /**
   * Verifica se está conectado
   */
  isConnected(): Observable<boolean> {
    return this.isConnected$.asObservable();
  }

  /**
   * Retorna o estado atual da conexão
   */
  getConnectionStatus(): boolean {
    return this.stompClient?.active || false;
  }

  /**
   * Envia uma mensagem para um destino específico
   */
  send(destination: string, body: any): void {
    if (this.stompClient && this.stompClient.active) {
      // Se body for null ou undefined, enviar string vazia
      const bodyString = body !== null && body !== undefined ? JSON.stringify(body) : '';
      const fullDestination = `/app${destination}`;
      
      console.log(`Enviando mensagem para: ${fullDestination}`, bodyString ? `Body: ${bodyString}` : 'Body: (vazio)');
      
      this.stompClient.publish({
        destination: fullDestination,
        body: bodyString,
      });
      
      console.log(`Mensagem enviada com sucesso para ${fullDestination}`);
    } else {
      console.error('WebSocket não está conectado. Status:', this.stompClient?.active);
    }
  }

  /**
   * Inscreve-se em uma fila para receber mensagens
   */
  subscribe(destination: string, callback: (message: any) => void): string | null {
    if (this.stompClient && this.stompClient.active) {
      // Verificar se já existe uma assinatura para este destino
      if (this.subscriptions.has(destination)) {
        console.warn(`Já existe uma assinatura para ${destination}`);
        return destination;
      }

      console.log(`Inscrito em: ${destination}`);
      const subscription = this.stompClient.subscribe(destination, (message: any) => {
        console.log(`Mensagem recebida de ${destination}:`, message);
        try {
          const data = JSON.parse(message.body);
          console.log(`Dados parseados:`, data);
          callback(data);
        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
          console.log('Corpo da mensagem (raw):', message.body);
          // Tentar callback com o body direto se não conseguir fazer parse
          callback(message.body);
        }
      });

      this.subscriptions.set(destination, subscription);
      console.log(`Subscription criada com sucesso para ${destination}`);
      return destination;
    } else {
      console.error('WebSocket não está conectado. Status:', this.stompClient?.active);
      return null;
    }
  }

  /**
   * Desinscreve-se de uma fila
   */
  unsubscribe(destination: string): void {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  /**
   * Reconecta ao WebSocket (útil quando o token é atualizado)
   */
  reconnect(): Promise<void> {
    this.disconnect();
    return new Promise((resolve) => {
      setTimeout(() => {
        this.connect().then(resolve).catch((error) => {
          console.error('Erro ao reconectar:', error);
          resolve();
        });
      }, 1000);
    });
  }
}


