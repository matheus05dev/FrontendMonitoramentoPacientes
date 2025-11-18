import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FuncionariosService } from '../../../core/services/funcionarios.service';
import { FuncionarioSaudeRequestDTO } from '../../../core/types/FuncionarioRequest';
import { FuncionarioSaudeResponseDTO } from '../../../core/types/FuncionarioResponse';
import { Sexo } from '../../../core/enum/Sexo.enum';
import { Cargo } from '../../../core/enum/Cargo.enum';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-funcionarios',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  standalone: true,
  templateUrl: './editar-funcionarios.html',
  styleUrl: './editar-funcionarios.css',
})
export class EditarFuncionarios implements OnInit {
  form!: FormGroup;
  funcionarioId!: number;
  loading = false;
  error: string | null = null;
  sexos = Object.values(Sexo);
  cargos = Object.values(Cargo);
  // single-theme: dark theme is default
  isDarkMode = true;

  constructor(
    private fb: FormBuilder,
    private funcionariosService: FuncionariosService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.isDarkMode = true;
  }

  ngOnInit(): void {
    this.funcionarioId = +this.route.snapshot.paramMap.get('id')!;

    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', Validators.required],
      telefones: this.fb.array([]),
      cargo: ['', Validators.required],
      especialidades: this.fb.array([]),
      identificacao: ['', Validators.required],
    });

    this.carregarFuncionario();
  }

  get telefones(): FormArray {
    return this.form.get('telefones') as FormArray;
  }

  get especialidades(): FormArray {
    return this.form.get('especialidades') as FormArray;
  }

  carregarFuncionario(): void {
    this.loading = true;
    this.funcionariosService.buscarPorId(this.funcionarioId).subscribe({
      next: (funcionario) => {
        if (funcionario) {
          this.preencherFormulario(funcionario);
        } else {
          this.error = 'Funcionário não encontrado';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar funcionário';
        this.loading = false;
        console.error(err);
      },
    });
  }

  preencherFormulario(funcionario: FuncionarioSaudeResponseDTO): void {
    // Limpar arrays existentes
    while (this.telefones.length !== 0) {
      this.telefones.removeAt(0);
    }
    while (this.especialidades.length !== 0) {
      this.especialidades.removeAt(0);
    }

    // Preencher telefones
    if (funcionario.telefones && funcionario.telefones.length > 0) {
      funcionario.telefones.forEach((tel) => {
        this.telefones.push(
          this.fb.group({
            DDD: [
              tel.ddd.toString(),
              [Validators.required, Validators.pattern(/^\d+$/)],
            ],
            numero: [tel.numero, Validators.required],
          })
        );
      });
    }

    // Preencher especialidades
    if (funcionario.especialidades && funcionario.especialidades.length > 0) {
      funcionario.especialidades.forEach((esp) => {
        this.especialidades.push(this.fb.control(esp, Validators.required));
      });
    }

    // Preencher outros campos
    this.form.patchValue({
      nome: funcionario.nome,
      email: funcionario.email,
      sexo: funcionario.sexo,
      dataNascimento: funcionario.dataNascimento,
      cpf: funcionario.cpf,
      cargo: funcionario.cargo,
      identificacao: funcionario.identificacao,
    });
  }

  addTelefone(): void {
    this.telefones.push(
      this.fb.group({
        DDD: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        numero: ['', Validators.required],
      })
    );
  }

  removeTelefone(index: number): void {
    this.telefones.removeAt(index);
  }

  addEspecialidade(): void {
    this.especialidades.push(this.fb.control('', Validators.required));
  }

  removeEspecialidade(index: number): void {
    this.especialidades.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.error = null;

      const formValue = this.form.value;
      const funcionario: FuncionarioSaudeRequestDTO = {
        ...formValue,
        telefones: formValue.telefones.map((tel: any) => ({
          ddd: parseInt(tel.DDD, 10),
          numero: tel.numero,
        })),
      };

      this.funcionariosService
        .atualizar(this.funcionarioId, funcionario)
        .subscribe({
          next: () => {
            this.loading = false;
            this.toastr.success('Funcionário atualizado com sucesso!');
            this.router.navigate(['app/funcionarios']);
          },
          error: (err) => {
            this.loading = false;
            this.toastr.error('Erro ao atualizar funcionário');
            console.error(err);
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['app/funcionarios']);
  }
}
