import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { PacientesService } from '../../../core/services/pacientes.service';
import { PacienteResponse } from '../../../core/types/PacienteResponse';

@Component({
  selector: 'app-listar-pacientes',
  imports: [
    CommonModule, 
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './listar-pacientes.html',
  styleUrls: ['./listar-pacientes.css'],
})
export class ListarPacientes implements OnInit {
  pacientes: PacienteResponse[] = [];
  filteredPacientes: PacienteResponse[] = [];
  searchNome: string = '';
  loading = false;

  constructor(
    private pacientesService: PacientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.loading = true;
    this.pacientesService.listarTodos().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.filteredPacientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pacientes:', err);
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (this.searchNome.trim()) {
      const term = this.searchNome.toLowerCase().trim();
      this.filteredPacientes = this.pacientes.filter(
        (paciente) =>
          paciente.nome?.toLowerCase().includes(term) ||
          paciente.email?.toLowerCase().includes(term) ||
          paciente.cpf?.includes(term)
      );
    } else {
      this.filteredPacientes = this.pacientes;
    }
  }

  viewPaciente(id: number): void {
    this.router.navigate(['app/pacientes/info', id]);
  }

  editPaciente(id: number): void {
    this.router.navigate(['app/pacientes/editar', id]);
  }

  deletePaciente(id: number): void {
    if (confirm('Tem certeza que deseja deletar este paciente?')) {
      this.pacientesService.deletar(id).subscribe({
        next: () => {
          this.loadPacientes();
        },
        error: (err) => {
          console.error('Erro ao deletar paciente:', err);
        },
      });
    }
  }

  createPaciente(): void {
    this.router.navigate(['app/pacientes/criar']);
  }
}
