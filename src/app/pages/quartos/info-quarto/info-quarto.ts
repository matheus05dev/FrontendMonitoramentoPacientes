import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { QuartosService } from '../../../core/services/quartos.service';
import { PacientesService } from '../../../core/services/pacientes.service';
import { QuartoResponse } from '../../../core/types/QuartoResponse';
import { PacienteResponse } from '../../../core/types/PacienteResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-info-quarto',
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './info-quarto.html',
  styleUrls: ['./info-quarto.css'],
})
export class InfoQuarto implements OnInit {
  quarto: QuartoResponse | null = null;
  id: number;
  patients: PacienteResponse[] = [];
  availablePatients: PacienteResponse[] = [];
  allocatedPatients: PacienteResponse[] = [];
  selectedAllocate: PacienteResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quartosService: QuartosService,
    private pacientesService: PacientesService,
    private toastr: ToastrService
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadQuarto();
    this.loadPacientes();
  }

  loadQuarto(): void {
    this.quartosService.buscarPorId(this.id).subscribe({
      next: (data) => {
        this.quarto = data;
        this.updatePatientLists();
      },
      error: (err) => {
        console.error('Erro ao carregar quarto:', err);
        this.router.navigate(['app/quartos']);
      },
    });
  }

  loadPacientes(): void {
    this.pacientesService.listarTodos().subscribe({
      next: (data) => {
        this.patients = data;
        this.updatePatientLists();
      },
      error: (err) => {
        console.error('Erro ao carregar pacientes:', err);
      },
    });
  }

  updatePatientLists(): void {
    if (this.quarto && this.patients.length > 0) {
      this.availablePatients = this.patients.filter(
        (p) => !this.quarto!.pacientesIds.includes(p.id)
      );
      this.allocatedPatients = this.patients.filter((p) =>
        this.quarto!.pacientesIds.includes(p.id)
      );
    }
  }

  getPatientName(id: number): string {
    const patient = this.patients.find((p) => p.id === id);
    return patient ? patient.nome : 'Paciente desconhecido';
  }

  allocatePaciente(): void {
    if (this.selectedAllocate) {
      this.quartosService
        .alocarPaciente(this.id, this.selectedAllocate.id)
        .subscribe({
          next: (updatedQuarto) => {
            this.quarto = updatedQuarto;
            this.selectedAllocate = null;
            this.updatePatientLists();
            this.toastr.success('Paciente alocado com sucesso!');
          },
          error: (err) => {
            console.error('Erro ao alocar paciente:', err);
            this.toastr.error('Erro ao alocar paciente.');
          },
        });
    }
  }

  removePaciente(id: number): void {
    this.quartosService.removerPaciente(this.id, id).subscribe({
      next: (updatedQuarto) => {
        this.quarto = updatedQuarto;
        this.updatePatientLists();
        this.toastr.success('Paciente removido com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao remover paciente:', err);
        this.toastr.error('Erro ao remover paciente.');
      },
    });
  }

  edit(): void {
    this.router.navigate(['app/quartos/editar', this.id]);
  }

  back(): void {
    this.router.navigate(['app/quartos']);
  }
}
