import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { API_CONFIG } from '../../config/API_CONFIG';
import { UsuarioAutenticado } from '../types/UsuarioAutenticado';
import { LoginRequest } from '../types/LoginRequest';
import { TokenResponse } from '../types/TokenResponse';
import { WebSocketService } from './websocket.service';

const statusAutenticacaoInicial: UsuarioAutenticado = {
  username: '',
  role: '',
  exp: 0,
  iat: 0,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private webSocketService = inject(WebSocketService);
  private statusAutenticacao$ = new BehaviorSubject<UsuarioAutenticado>(
    statusAutenticacaoInicial
  );
  readonly statusAutenticacao = this.statusAutenticacao$.asObservable();

  autenticar(form: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${API_CONFIG.baseUrl}/auth/login`, form)
      .pipe(
        tap((response) => {
          this.tokenService.saveTokens(response);
          this.setUsuarioAutenticado(response.accessToken);
          // Aguardar um pouco antes de conectar ao WebSocket para garantir que a sessão está estabelecida
          setTimeout(() => {
            this.webSocketService.connect().catch((error) => {
              console.error('Erro ao conectar WebSocket após login:', error);
              // Não bloquear a navegação se o WebSocket falhar
            });
          }, 500);
          this.router.navigate(['app/home']);
        })
      );
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(
        () => new Error('Refresh token não encontrado. Deslogando.')
      );
    }

    return this.http
      .post<TokenResponse>(`${API_CONFIG.baseUrl}/auth/refresh`, {
        refreshToken,
      })
      .pipe(
        tap((tokens: TokenResponse) => {
          this.tokenService.saveAccessToken(tokens.accessToken);
          this.setUsuarioAutenticado(tokens.accessToken);
        })
      );
  }

  logout(): void {
    this.http.post(`${API_CONFIG.baseUrl}/auth/logout`, {}).subscribe({
      complete: () => {
        this.webSocketService.disconnect();
        this.limparUsuarioAutenticado();
        this.router.navigate(['']);
      },
      error: () => {
        // Mesmo em caso de erro no backend, limpa o frontend
        this.webSocketService.disconnect();
        this.limparUsuarioAutenticado();
        this.router.navigate(['']);
      },
    });
  }

  setUsuarioAutenticado(token: string): void {
    // Este método agora só atualiza o status do BehaviorSubject
    // A responsabilidade de salvar o token está no autenticar() e refreshToken()
    if (!token) {
      this.limparUsuarioAutenticado();
      return;
    }

    const usuarioAutenticado: UsuarioAutenticado = this.getUsuarioAutenticado();
    try {
      this.statusAutenticacao$.next(usuarioAutenticado);
    } catch (error) {
      console.error('Erro ao decodificar o token: ', error);
      this.limparUsuarioAutenticado();
    }
  }

  limparUsuarioAutenticado(): void {
    this.statusAutenticacao$.next(statusAutenticacaoInicial);
    this.tokenService.deleteTokens();
  }

  getUsuarioAutenticado(): UsuarioAutenticado {
    return {
      username: this.tokenService.getUsername(),
      role: this.tokenService.getRole(),
      exp: this.tokenService.getExp(),
      iat: this.tokenService.getIat(),
    };
  }

  isLoggedIn(): boolean {
    return (
      !!this.tokenService.getAccessToken() && !this.tokenService.isTokenExpired()
    );
  }
}
