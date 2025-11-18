import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LeiturasService } from '../../../core/services/leituras.service';
import { LeituraResponse } from '../../../core/types/LeituraResponse';

@Component({
  selector: 'app-listar-leituras',
  imports: [CommonModule, FormsModule, MatIconModule],
  standalone: true,
  templateUrl: './listar-leituras.html',
  styleUrl: './listar-leituras.css'
})
export class ListarLeituras implements OnInit {
  leituras: LeituraResponse[] = [];
  atendimentoId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(private leiturasService: LeiturasService) {}

  ngOnInit(): void {}

  buscarLeituras(): void {
    if (!this.atendimentoId) {
      this.error = 'Por favor, informe o ID do atendimento';
      return;
    }

    this.loading = true;
    this.error = null;
    this.leituras = [];

    this.leiturasService.buscarLeiturasPorAtendimento(this.atendimentoId).subscribe({
      next: (data) => {
        this.leituras = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao buscar leituras';
        this.loading = false;
        console.error(err);
      },
    });
  }
}
