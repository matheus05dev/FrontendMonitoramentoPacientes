import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../config/API_CONFIG';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtendimentoRequest } from '../types/AtendimentoRequest';
import { AtendimentoResponse } from '../types/AtendimentoResponse';

@Injectable({
  providedIn: 'root',
})
export class AtendimentosService {
  private baseUrl = `${API_CONFIG.baseUrl}/atendimento`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<AtendimentoResponse[]> {
    return this.http.get<AtendimentoResponse[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<AtendimentoResponse> {
    return this.http.get<AtendimentoResponse>(`${this.baseUrl}/${id}`);
  }

  criar(atendimento: AtendimentoRequest): Observable<AtendimentoResponse> {
    return this.http.post<AtendimentoResponse>(this.baseUrl, atendimento);
  }

  atualizar(
    id: number,
    atendimento: AtendimentoRequest
  ): Observable<AtendimentoResponse> {
    return this.http.put<AtendimentoResponse>(
      `${this.baseUrl}/${id}`,
      atendimento
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
