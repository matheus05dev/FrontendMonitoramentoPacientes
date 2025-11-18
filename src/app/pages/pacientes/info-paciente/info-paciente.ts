import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PacientesService } from '../../../core/services/pacientes.service';
import { PacienteResponse } from '../../../core/types/PacienteResponse';

@Component({
  selector: 'app-info-paciente',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './info-paciente.html',
  styleUrls: ['./info-paciente.css'],
})
export class InfoPaciente implements OnInit {
  paciente: PacienteResponse | null = null;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacientesService: PacientesService
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadPaciente();
  }

  loadPaciente(): void {
    this.pacientesService.buscarPorId(this.id).subscribe({
      next: (data) => {
        this.paciente = data;
      },
      error: (err) => {
        console.error('Erro ao carregar paciente:', err);
        this.router.navigate(['app/pacientes']);
      },
    });
  }

  edit(): void {
    this.router.navigate(['app/pacientes/editar', this.id]);
  }

  back(): void {
    this.router.navigate(['app/pacientes']);
  }
}
