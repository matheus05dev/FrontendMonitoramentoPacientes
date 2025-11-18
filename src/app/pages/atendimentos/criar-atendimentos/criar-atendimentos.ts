import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AtendimentosService } from '../../../core/services/atendimentos.service';
import { PacientesService } from '../../../core/services/pacientes.service';
import { FuncionariosService } from '../../../core/services/funcionarios.service';
import { AtendimentoRequest } from '../../../core/types/AtendimentoRequest';
import { PacienteResponse } from '../../../core/types/PacienteResponse';
import { FuncionarioSaudeResponseDTO } from '../../../core/types/FuncionarioResponse';
import { Diagnostico } from '../../../core/enum/Diagnostico.enum';
import { StatusMonitoramento } from '../../../core/enum/StatusMonitoramento.enum';

@Component({
  selector: 'app-criar-atendimentos',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  standalone: true,
  templateUrl: './criar-atendimentos.html',
  styleUrl: './criar-atendimentos.css',
})
export class CriarAtendimentos implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  // single-theme: dark theme is default
  isDarkMode = true;

  pacientes: PacienteResponse[] = [];
  medicos: FuncionarioSaudeResponseDTO[] = [];

  diagnosticos: { key: string; value: string }[] = [];
  statusMonitoramentos = Object.values(StatusMonitoramento);

  constructor(
    private fb: FormBuilder,
    private atendimentosService: AtendimentosService,
    private pacientesService: PacientesService,
    private funcionariosService: FuncionariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.diagnosticos = Object.entries(Diagnostico)
      .filter(([key]) => isNaN(Number(key)))
      .map(([key, value]) => ({ key, value }));

    this.carregarPacientes();
    this.carregarMedicos();

    this.form = this.fb.group({
      paciente: [null, Validators.required],
      medicoResponsavel: [null, Validators.required],
      medicoComplicacaoId: [''],
      acompanhante: [''],
      condicoesPreexistentes: [''],
      diagnostico: [''],
      tratamento: [''],
      observacoes: [''],
      statusMonitoramento: [''],
    });
    // Check for dark theme
    this.isDarkMode = true;
  }

  carregarPacientes(): void {
    this.pacientesService.listarTodos().subscribe({
      next: (pacientes) => (this.pacientes = pacientes),
      error: (err) => console.error('Erro ao carregar pacientes:', err),
    });
  }

  carregarMedicos(): void {
    this.funcionariosService.listarTodos().subscribe({
      next: (medicos) => (this.medicos = medicos),
      error: (err) => console.error('Erro ao carregar médicos:', err),
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;

      const request: AtendimentoRequest = {
        pacienteId: this.form.value.paciente.id,
        medicoResponsavelId: this.form.value.medicoResponsavel.id,
        medicoComplicacaoId: this.form.value.medicoComplicacaoId || undefined,
        acompanhante: this.form.value.acompanhante,
        condicoesPreexistentes: this.form.value.condicoesPreexistentes,
        diagnostico: this.form.value.diagnostico,
        tratamento: this.form.value.tratamento,
        observacoes: this.form.value.observacoes,
        statusMonitoramento: this.form.value.statusMonitoramento,
      };

      this.atendimentosService.criar(request).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['app/atendimentos']);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Erro ao criar atendimento';
          console.error(err);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancelar(): void {
    this.router.navigate(['app/atendimentos']);
  }
}
