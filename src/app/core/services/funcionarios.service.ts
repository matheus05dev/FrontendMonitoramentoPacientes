import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/API_CONFIG';
import { FuncionarioSaudeRequestDTO } from '../types/FuncionarioRequest';
import { FuncionarioSaudeResponseDTO } from '../types/FuncionarioResponse';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  private baseUrl = `${API_CONFIG.baseUrl}/funcionario`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<FuncionarioSaudeResponseDTO[]> {
    return this.http.get<FuncionarioSaudeResponseDTO[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<FuncionarioSaudeResponseDTO | null> {
    return this.http.get<FuncionarioSaudeResponseDTO | null>(
      `${this.baseUrl}/${id}`
    );
  }

  buscarPorNome(nome: string): Observable<FuncionarioSaudeResponseDTO[]> {
    return this.http.get<FuncionarioSaudeResponseDTO[]>(
      `${this.baseUrl}/buscar-por-nome/${nome}`
    );
  }

  buscarPorCpf(cpf: string): Observable<FuncionarioSaudeResponseDTO | null> {
    return this.http.get<FuncionarioSaudeResponseDTO | null>(
      `${this.baseUrl}/buscar-por-cpf/${cpf}`
    );
  }

  criar(
    funcionario: FuncionarioSaudeRequestDTO
  ): Observable<FuncionarioSaudeResponseDTO> {
    return this.http.post<FuncionarioSaudeResponseDTO>(
      this.baseUrl,
      funcionario
    );
  }

  atualizar(
    id: number,
    funcionario: FuncionarioSaudeRequestDTO
  ): Observable<FuncionarioSaudeResponseDTO> {
    return this.http.put<FuncionarioSaudeResponseDTO>(
      `${this.baseUrl}/${id}`,
      funcionario
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
