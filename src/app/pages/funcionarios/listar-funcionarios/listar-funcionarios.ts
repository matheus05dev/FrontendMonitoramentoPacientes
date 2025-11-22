import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { FuncionariosService } from '../../../core/services/funcionarios.service';
import { FuncionarioSaudeResponseDTO } from '../../../core/types/FuncionarioResponse';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-funcionarios',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './listar-funcionarios.html',
  styleUrls: ['./listar-funcionarios.css'],
})
export class ListarFuncionarios implements OnInit {
  funcionarios: FuncionarioSaudeResponseDTO[] = [];
  filteredFuncionarios: FuncionarioSaudeResponseDTO[] = [];
  searchTerm: string = '';
  loading = false;

  constructor(
    private funcionariosService: FuncionariosService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  loadFuncionarios(): void {
    this.loading = true;
    this.funcionariosService.listarTodos().subscribe({
      next: (data) => {
        this.funcionarios = data;
        this.filteredFuncionarios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar funcionários:', err);
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredFuncionarios = this.funcionarios.filter(
        (func) =>
          func.nome?.toLowerCase().includes(term) ||
          func.email?.toLowerCase().includes(term) ||
          func.cpf?.includes(term)
      );
    } else {
      this.filteredFuncionarios = this.funcionarios;
    }
  }

  viewFuncionario(id: number): void {
    this.router.navigate(['app/funcionarios/info', id]);
  }

  editFuncionario(id: number): void {
    this.router.navigate(['app/funcionarios/editar', id]);
  }

  deleteFuncionario(id: number): void {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      this.funcionariosService.deletar(id).subscribe({
        next: () => this.loadFuncionarios(),
        error: (err) => console.error('Erro ao deletar:', err),
      });
    }
  }

  createFuncionario(): void {
    this.router.navigate(['/app/funcionarios/criar']);
  }
}
