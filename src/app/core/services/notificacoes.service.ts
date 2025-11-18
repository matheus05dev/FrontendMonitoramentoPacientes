import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/API_CONFIG';
import { WebSocketService } from './websocket.service';
import { NotificacaoResponse } from '../types/NotificacaoResponse';

@Injectable({
  providedIn: 'root',
})
export class NotificacoesService {
  private webSocketService = inject(WebSocketService);
  private http = inject(HttpClient);
  private readonly apiUrl = `${API_CONFIG.baseUrl}/notificacoes`;
  private notificacoesSubject$ = new Subject<NotificacaoResponse[]>();
  private isSubscribed = false;
  private readonly destination = `/user/queue/notificacoes`;

  /**
   * Busca histórico de notificações via WebSocket
   * @returns Observable com a lista de notificações
   */
  buscarHistoricoNotificacoes(): Observable<NotificacaoResponse[]> {
    this.ensureConnectedAndSubscribed()
      .then(() => {
        // Aguardar um pouco para garantir que a subscription esteja ativa
        setTimeout(() => {
          this.sendBuscarNotificacoesRequest();
        }, 200);
      })
      .catch((error) => {
        console.error('Erro ao conectar WebSocket para notificações:', error);
        // Emitir array vazio em caso de erro para não bloquear a UI
        this.notificacoesSubject$.next([]);
      });

    // Adicionar timeout - se não receber resposta em 10 segundos, logar aviso
    // (não emitir array vazio automaticamente, deixar o Subject gerenciar)
    setTimeout(() => {
      console.warn('Aguardando resposta do WebSocket para notificações...');
    }, 10000);

    return this.notificacoesSubject$.asObservable();
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
      // Aguardar um pouco para garantir que a conexão esteja totalmente estabelecida
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Inscrever se ainda não estiver inscrito e estiver conectado
    if (!this.isSubscribed && this.webSocketService.getConnectionStatus()) {
      this.subscribeToNotificacoes();
      // Aguardar um pouco para garantir que a subscription esteja estabelecida
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  /**
   * Inscreve-se na fila de notificações
   * O Spring STOMP com @SendToUser("/queue/notificacoes") roteia automaticamente
   * para /user/{username}/queue/notificacoes baseado no usuário autenticado
   */
  private subscribeToNotificacoes(): void {
    console.log(`Tentando inscrever em: ${this.destination}`);
    const subscriptionId = this.webSocketService.subscribe(
      this.destination,
      (message: NotificacaoResponse[]) => {
        console.log('Notificações recebidas:', message);
        if (Array.isArray(message)) {
          console.log(`Recebidas ${message.length} notificações`);
          this.notificacoesSubject$.next(message);
        } else {
          console.warn('Mensagem recebida não é um array:', message);
          // Tentar converter para array se for um objeto único
          this.notificacoesSubject$.next([message]);
        }
      }
    );

    if (subscriptionId) {
      this.isSubscribed = true;
      console.log(`Inscrito com sucesso em ${this.destination}`);
    } else {
      console.error(`Falha ao inscrever em ${this.destination}`);
    }
  }

  /**
   * Envia requisição para buscar histórico de notificações
   * O backend não espera nenhum payload, então enviamos null
   */
  private sendBuscarNotificacoesRequest(): void {
    console.log('Enviando requisição para buscar histórico de notificações...');
    // Enviar null em vez de {} para indicar que não há payload
    this.webSocketService.send('/notificacoes/historico', null);
  }

  /**
   * Fecha uma notificação via endpoint REST
   * PUT /api/notificacoes/{id}/fechar
   */
  fecharNotificacao(id: number): Observable<NotificacaoResponse> {
    return this.http.put<NotificacaoResponse>(
      `${this.apiUrl}/${id}/fechar`,
      null
    );
  }
}
