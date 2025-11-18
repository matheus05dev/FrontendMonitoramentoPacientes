import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { QuartosService } from '../../../core/services/quartos.service';
import { QuartoResponse } from '../../../core/types/QuartoResponse';

@Component({
  selector: 'app-listar-quartos',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './listar-quartos.html',
  styleUrls: ['./listar-quartos.css'],
})
export class ListarQuartos implements OnInit {
  quartos: QuartoResponse[] = [];
  filteredQuartos: QuartoResponse[] = [];
  searchTerm: string = '';
  loading = false;

  constructor(private quartosService: QuartosService, private router: Router) {}

  ngOnInit(): void {
    this.loadQuartos();
  }

  loadQuartos(): void {
    this.loading = true;
    this.quartosService.listarTodos().subscribe({
      next: (data) => {
        this.quartos = data;
        this.filteredQuartos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar quartos:', err);
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredQuartos = this.quartos.filter(
        (quarto) =>
          quarto.numero?.toString().includes(term) ||
          quarto.localizacao?.toLowerCase().includes(term) ||
          quarto.tipo?.toLowerCase().includes(term)
      );
    } else {
      this.filteredQuartos = this.quartos;
    }
  }

  viewQuarto(id: number): void {
    this.router.navigate(['app/quartos/info', id]);
  }

  editQuarto(id: number): void {
    this.router.navigate(['app/quartos/editar', id]);
  }

  deleteQuarto(id: number): void {
    if (confirm('Tem certeza que deseja deletar este quarto?')) {
      this.quartosService.deletar(id).subscribe({
        next: () => {
          this.loadQuartos();
        },
        error: (err) => {
          console.error('Erro ao deletar quarto:', err);
        },
      });
    }
  }

  createQuarto(): void {
    this.router.navigate(['app/quartos/criar']);
  }
}
