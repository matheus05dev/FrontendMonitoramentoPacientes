import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenResponse } from '../types/TokenResponse';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  saveTokens(tokens: TokenResponse): void {
    this.saveAccessToken(tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  }

  saveAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  deleteTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  getAccessToken(): string {
    return localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
  }

  getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN_KEY) ?? '';
  }

  getDecodedAccessToken(): any {
    const token = this.getAccessToken();
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
    const decodedToken = this.getDecodedAccessToken();
    return decodedToken ? decodedToken.sub : ''; // O subject no novo token é o 'sub'
  }

  getRole(): string {
    const decodedToken = this.getDecodedAccessToken();
    return decodedToken ? decodedToken.role : '';
  }

  getExp(): number {
    const decodedToken = this.getDecodedAccessToken();
    return decodedToken ? decodedToken.exp : 0;
  }

  getIat(): number {
    const decodedToken = this.getDecodedAccessToken();
    return decodedToken ? decodedToken.iat : 0;
  }

  isTokenExpired(): boolean {
    const exp = this.getExp();
    if (!exp) {
      return true;
    }
    return Date.now() >= exp * 1000;
  }
}
