import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AtendimentosService } from '../../../core/services/atendimentos.service';
import { PacientesService } from '../../../core/services/pacientes.service';
import { FuncionariosService } from '../../../core/services/funcionarios.service';
import { AtendimentoRequest } from '../../../core/types/AtendimentoRequest';
import { AtendimentoResponse } from '../../../core/types/AtendimentoResponse';
import { PacienteResponse } from '../../../core/types/PacienteResponse';
import { FuncionarioSaudeResponseDTO } from '../../../core/types/FuncionarioResponse';
import { Diagnostico } from '../../../core/enum/Diagnostico.enum';
import { StatusMonitoramento } from '../../../core/enum/StatusMonitoramento.enum';
import { StatusPaciente } from '../../../core/enum/StatusPaciente.enum';
import { MatIconModule } from '@angular/material/icon';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-atendimentos',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  standalone: true,
  templateUrl: './editar-atendimentos.html',
  styleUrl: './editar-atendimentos.css',
})
export class EditarAtendimentos implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  atendimentoId!: number;

  pacientes: PacienteResponse[] = [];
  medicos: FuncionarioSaudeResponseDTO[] = [];

  diagnosticos: { key: string; value: string }[] = [];
  statusMonitoramentos = Object.values(StatusMonitoramento);
  statusPacientes = Object.values(StatusPaciente);

  constructor(
    private fb: FormBuilder,
    private atendimentosService: AtendimentosService,
    private pacientesService: PacientesService,
    private funcionariosService: FuncionariosService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.atendimentoId = +this.route.snapshot.paramMap.get('id')!;

    this.diagnosticos = Object.keys(Diagnostico).map((key) => ({
      key,
      value: Diagnostico[key as keyof typeof Diagnostico],
    }));

    this.form = this.fb.group({
      paciente: [null, Validators.required],
      medicoResponsavel: [null, Validators.required],
      medicoComplicacao: [null],
      statusPaciente: ['', Validators.required],
      statusMonitoramento: [''],
      acompanhante: [''],
      condicoesPreexistentes: [''],
      diagnostico: [''],
      tratamento: [''],
      observacoes: [''],
      diagnosticoComplicacao: [''],
      tratamentoComplicacao: [''],
    });

    forkJoin({
      pacientes: this.pacientesService.listarTodos(),
      medicos: this.funcionariosService.listarTodos(),
      atendimento: this.atendimentosService.buscarPorId(this.atendimentoId),
    }).subscribe({
      next: ({ pacientes, medicos, atendimento }) => {
        this.pacientes = pacientes;
        this.medicos = medicos;
        this.preencherFormulario(atendimento);
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar dados');
        console.error(err);
      },
    });
  }

  preencherFormulario(atendimento: AtendimentoResponse): void {
    this.form.patchValue({
      paciente:
        this.pacientes.find((p) => p.id === atendimento.pacienteId) || null,
      medicoResponsavel:
        this.medicos.find((m) => m.id === atendimento.medicoResponsavelId) ||
        null,
      medicoComplicacao:
        this.medicos.find((m) => m.id === atendimento.medicoComplicacaoId) ||
        null,
      statusPaciente: atendimento.statusPaciente || '',
      statusMonitoramento: atendimento.statusMonitoramento || '',
      acompanhante: atendimento.acompanhante || '',
      condicoesPreexistentes: atendimento.condicoesPreexistentes || '',
      diagnostico: atendimento.diagnostico || '',
      tratamento: atendimento.tratamento || '',
      dataEntrada: atendimento.dataEntrada
        ? new Date(atendimento.dataEntrada).toISOString().split('T')[0]
        : '',
      dataSaida: atendimento.dataSaida
        ? new Date(atendimento.dataSaida).toISOString().split('T')[0]
        : '',
      observacoes: atendimento.observacoes || '',
      diagnosticoComplicacao: atendimento.diagnosticoComplicacao || '',
      tratamentoComplicacao: atendimento.tratamentoComplicacao || '',
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;

      const request: AtendimentoRequest = {
        pacienteId: this.form.value.paciente.id,
        medicoResponsavelId: this.form.value.medicoResponsavel.id,
        medicoComplicacaoId: this.form.value.medicoComplicacao
          ? this.form.value.medicoComplicacao.id
          : undefined,
        statusPaciente: this.form.value.statusPaciente,
        statusMonitoramento: this.form.value.statusMonitoramento || undefined,
        acompanhante: this.form.value.acompanhante,
        condicoesPreexistentes: this.form.value.condicoesPreexistentes,
        diagnostico: this.form.value.diagnostico || undefined,
        tratamento: this.form.value.tratamento,
        dataEntrada: this.form.value.dataEntrada,
        dataSaida: this.form.value.dataSaida,
        observacoes: this.form.value.observacoes,
        diagnosticoComplicacao:
          this.form.value.diagnosticoComplicacao || undefined,
        tratamentoComplicacao: this.form.value.tratamentoComplicacao,
      };

      this.atendimentosService
        .atualizar(this.atendimentoId, request)
        .subscribe({
          next: () => {
            this.loading = false;
            this.toastr.success('Atendimento atualizado com sucesso!');
            this.router.navigate(['app/atendimentos']);
          },
          error: (err) => {
            this.loading = false;
            this.toastr.error('Erro ao atualizar atendimento');
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
