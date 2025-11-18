import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FuncionariosService } from '../../../core/services/funcionarios.service';
import { FuncionarioSaudeRequestDTO } from '../../../core/types/FuncionarioRequest';
import { Sexo } from '../../../core/enum/Sexo.enum';
import { Cargo } from '../../../core/enum/Cargo.enum';

@Component({
  selector: 'app-criar-funcionarios',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './criar-funcionarios.html',
  styleUrl: './criar-funcionarios.css',
})
export class CriarFuncionarios {
  form: FormGroup;
  sexos = Object.values(Sexo);
  cargos = Object.values(Cargo);
  // single-theme: dark theme is default
  isDarkMode = true;

  constructor(
    private fb: FormBuilder,
    private funcionariosService: FuncionariosService,
    private router: Router
  ) {
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
    // Check for dark theme
    this.isDarkMode = true;
  }

  get telefones(): FormArray {
    return this.form.get('telefones') as FormArray;
  }

  get especialidades(): FormArray {
    return this.form.get('especialidades') as FormArray;
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
      const formValue = this.form.value;
      const funcionario: FuncionarioSaudeRequestDTO = {
        ...formValue,
        telefones: formValue.telefones.map((tel: any) => ({
          ddd: parseInt(tel.DDD, 10),
          numero: tel.numero,
        })),
      };
      this.funcionariosService.criar(funcionario).subscribe({
        next: () => this.router.navigate(['app/funcionarios']),
        error: (err) => console.error('Erro ao criar funcionário:', err),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['app/funcionarios']);
  }
}
