import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/API_CONFIG';
import { UserRequest } from '../types/UserRequest';
import { UserResponse } from '../types/UserResponse';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  criar(user: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, user);
  }

  listarTodos(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/id/${id}`);
  }

  buscarPorUsername(username: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/username/${username}`);
  }

  atualizar(id: number, user: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, user);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
