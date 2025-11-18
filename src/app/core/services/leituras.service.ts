import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebSocketService } from './websocket.service';
import { LeituraResponse } from '../types/LeituraResponse';

@Injectable({
  providedIn: 'root',
})
export class LeiturasService {
  private webSocketService = inject(WebSocketService);
  private leiturasSubject$ = new Subject<LeituraResponse[]>();
  private isSubscribed = false;
  private readonly destination = `/user/queue/leituras`;

  /**
   * Busca leituras por atendimento via WebSocket
   * @param atendimentoId ID do atendimento
   * @returns Observable com a lista de leituras
   */
  buscarLeiturasPorAtendimento(atendimentoId: number): Observable<LeituraResponse[]> {
    this.ensureConnectedAndSubscribed().then(() => {
      this.sendBuscarLeiturasRequest(atendimentoId);
    }).catch((error) => {
      console.error('Erro ao conectar WebSocket:', error);
    });

    return this.leiturasSubject$.asObservable();
  }

  /**
   * Garante que está conectado e inscrito na fila
   */
  private async ensureConnectedAndSubscribed(): Promise<void> {
    // Conectar se não estiver conectado
    if (!this.webSocketService.getConnectionStatus()) {
      await this.webSocketService.connect();
      // Resetar flag quando reconectar
      this.isSubscribed = false;
    }

    // Inscrever se ainda não estiver inscrito e estiver conectado
    if (!this.isSubscribed && this.webSocketService.getConnectionStatus()) {
      this.subscribeToLeituras();
    }
  }

  /**
   * Inscreve-se na fila de leituras
   * O Spring STOMP com @SendToUser("/queue/leituras") roteia automaticamente
   * para /user/{username}/queue/leituras baseado no usuário autenticado
   */
  private subscribeToLeituras(): void {
    const subscriptionId = this.webSocketService.subscribe(this.destination, (message: LeituraResponse[]) => {
      this.leiturasSubject$.next(message);
    });

    if (subscriptionId) {
      this.isSubscribed = true;
    }
  }

  /**
   * Envia requisição para buscar leituras
   */
  private sendBuscarLeiturasRequest(atendimentoId: number): void {
    this.webSocketService.send('/leituras/por-atendimento', atendimentoId);
  }
}
