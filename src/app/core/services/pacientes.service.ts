import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/API_CONFIG';
import { PacienteRequest } from '../types/PacienteRequest';
import { PacienteResponse } from '../types/PacienteResponse';

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}/pacientes`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<PacienteResponse[]> {
    return this.http.get<PacienteResponse[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<PacienteResponse> {
    return this.http.get<PacienteResponse>(`${this.apiUrl}/id/${id}`);
  }

  buscarPorCpf(cpf: string): Observable<PacienteResponse> {
    return this.http.get<PacienteResponse>(`${this.apiUrl}/cpf/${cpf}`);
  }

  buscarPorNome(nome: string): Observable<PacienteResponse[]> {
    return this.http.get<PacienteResponse[]>(`${this.apiUrl}/nome/${nome}`);
  }

  criar(paciente: PacienteRequest): Observable<PacienteResponse> {
    return this.http.post<PacienteResponse>(this.apiUrl, paciente);
  }

  atualizar(
    id: number,
    paciente: PacienteRequest
  ): Observable<PacienteResponse> {
    return this.http.put<PacienteResponse>(`${this.apiUrl}/${id}`, paciente);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
