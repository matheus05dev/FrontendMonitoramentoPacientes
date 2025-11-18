import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/API_CONFIG';
import { QuartoRequest } from '../types/QuartoRequest';
import { QuartoResponse } from '../types/QuartoResponse';

@Injectable({
  providedIn: 'root',
})
export class QuartosService {
  private http = inject(HttpClient);
  private baseUrl = `${API_CONFIG.baseUrl}/quarto`;

  listarTodos(): Observable<QuartoResponse[]> {
    return this.http.get<QuartoResponse[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<QuartoResponse> {
    return this.http.get<QuartoResponse>(`${this.baseUrl}/${id}`);
  }

  criar(request: QuartoRequest): Observable<QuartoResponse> {
    return this.http.post<QuartoResponse>(this.baseUrl, request);
  }

  atualizar(id: number, request: QuartoRequest): Observable<QuartoResponse> {
    return this.http.put<QuartoResponse>(`${this.baseUrl}/${id}`, request);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  alocarPaciente(
    quartoId: number,
    pacienteId: number
  ): Observable<QuartoResponse> {
    return this.http.put<QuartoResponse>(
      `${this.baseUrl}/${quartoId}/alocar-paciente/${pacienteId}`,
      {}
    );
  }

  removerPaciente(
    quartoId: number,
    pacienteId: number
  ): Observable<QuartoResponse> {
    return this.http.put<QuartoResponse>(
      `${this.baseUrl}/${quartoId}/remover-paciente/${pacienteId}`,
      {}
    );
  }
}
