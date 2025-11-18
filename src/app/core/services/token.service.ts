import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

const KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  salvarToken(token: string): void {
    localStorage.setItem(KEY, token);
  }

  excluirToken(): void {
    localStorage.removeItem(KEY);
  }

  getToken(): string {
    return localStorage.getItem(KEY) ?? '';
  }

  getTokenDecodificado(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (Error) {
        return null;
      }
    }
    return null;
  }

  getUsername(): string {
    const tokenDecodificado = this.getTokenDecodificado();
    return tokenDecodificado ? tokenDecodificado.username : '';
  }

  getExp(): number {
    const tokenDecodificado = this.getTokenDecodificado();
    return tokenDecodificado ? tokenDecodificado.exp : 0;
  }

  getIat(): number {
    const tokenDecodificado = this.getTokenDecodificado();
    return tokenDecodificado ? tokenDecodificado.iat : 0;
  }
}
