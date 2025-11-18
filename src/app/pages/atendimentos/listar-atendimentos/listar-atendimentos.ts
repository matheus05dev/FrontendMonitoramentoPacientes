import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AtendimentosService } from '../../../core/services/atendimentos.service';
import { AtendimentoResponse } from '../../../core/types/AtendimentoResponse';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-listar-atendimentos',
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  standalone: true,
  templateUrl: './listar-atendimentos.html',
  styleUrl: './listar-atendimentos.css',
})
export class ListarAtendimentos implements OnInit {
  atendimentos: AtendimentoResponse[] = [];
  filteredAtendimentos: AtendimentoResponse[] = [];
  searchTerm: string = '';
  loading = true;
  error: string | null = null;

  constructor(
    private atendimentosService: AtendimentosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarAtendimentos();
  }

  carregarAtendimentos(): void {
    this.atendimentosService.listarTodos().subscribe({
      next: (data) => {
        this.atendimentos = data;
        this.filteredAtendimentos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar atendimentos';
        this.loading = false;
        console.error(err);
      },
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredAtendimentos = this.atendimentos.filter(
        (atendimento) =>
          atendimento.nomePaciente?.toLowerCase().includes(term) ||
          atendimento.nomeMedicoResponsavel?.toLowerCase().includes(term) ||
          atendimento.numeroQuarto?.toString().includes(term)
      );
    } else {
      this.filteredAtendimentos = this.atendimentos;
    }
  }

  navegarParaCriar(): void {
    this.router.navigate(['app/atendimentos/criar']);
  }

  navegarParaInfo(id: number): void {
    this.router.navigate(['app/atendimentos/info', id]);
  }

  navegarParaEditar(id: number): void {
    this.router.navigate(['app/atendimentos/editar', id]);
  }

  deletarAtendimento(id: number): void {
    if (confirm('Tem certeza que deseja deletar este atendimento?')) {
      this.atendimentosService.deletar(id).subscribe({
        next: () => {
          this.carregarAtendimentos();
          alert('Atendimento deletado com sucesso!');
        },
        error: (err) => {
          alert('Erro ao deletar atendimento');
          console.error(err);
        },
      });
    }
  }
}
