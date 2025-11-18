import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacientesService } from '../../../core/services/pacientes.service';
import { PacienteRequest } from '../../../core/types/PacienteRequest';
import { PacienteResponse } from '../../../core/types/PacienteResponse';
import { Sexo } from '../../../core/enum/Sexo.enum';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-pacientes',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './editar-pacientes.html',
  styleUrls: ['./editar-pacientes.css'],
})
export class EditarPacientes implements OnInit {
  form: FormGroup;
  id: number;
  sexos = Object.values(Sexo);

  constructor(
    private fb: FormBuilder,
    private pacientesService: PacientesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService

  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', Validators.required],
      telefones: this.fb.array([]),
      alergias: this.fb.array([]),
    });
    // Add initial telefone
    this.addTelefone();
  }

  ngOnInit(): void {
    this.loadPaciente();
  }

  get telefones(): FormArray {
    return this.form.get('telefones') as FormArray;
  }

  get alergias(): FormArray {
    return this.form.get('alergias') as FormArray;
  }

  loadPaciente(): void {
    this.pacientesService.buscarPorId(this.id).subscribe({
      next: (paciente) => {
        if (paciente) {
          this.form.patchValue({
            nome: paciente.nome,
            email: paciente.email,
            sexo: paciente.sexo,
            dataNascimento: paciente.dataNascimento,
            cpf: paciente.cpf,
            quartoId: paciente.quartoId,
          });
          // Clear existing arrays
          while (this.telefones.length) {
            this.telefones.removeAt(0);
          }
          while (this.alergias.length) {
            this.alergias.removeAt(0);
          }
          // Set telefones
          paciente.telefones.forEach((tel) => {
            this.telefones.push(
              this.fb.group({
                ddd: [
                  tel.ddd ? tel.ddd.toString() : '',
                  [Validators.required, Validators.pattern(/^\d{2}$/)],
                ],
                numero: [
                  tel.numero || '',
                  [Validators.required, Validators.pattern(/^\d{9}$/)],
                ],
              })
            );
          });
          // Set alergias
          paciente.alergias.forEach((al) => {
            this.alergias.push(this.fb.control(al, Validators.required));
          });
        }
      },
      error: (err) => console.error('Erro ao carregar paciente:', err),
    });
  }

  addTelefone(): void {
    this.telefones.push(
      this.fb.group({
        ddd: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
        numero: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      })
    );
  }

  removeTelefone(index: number): void {
    this.telefones.removeAt(index);
  }

  addAlergia(): void {
    this.alergias.push(this.fb.control('', Validators.required));
  }

  removeAlergia(index: number): void {
    this.alergias.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const paciente: PacienteRequest = {
        ...formValue,
        dataNascimento: formValue.dataNascimento,
        quartoId: parseInt(formValue.quartoId, 10),
        telefones: formValue.telefones.map((tel: any) => ({
          ddd: parseInt(tel.ddd, 10),
          numero: tel.numero,
        })),
      };
      this.pacientesService.atualizar(this.id, paciente).subscribe({
        next: () => this.router.navigate(['app/pacientes']),
        error: (err) => this.toastr.error('Erro ao atualizar paciente:', err),
      });
    }
    
  }

  cancel(): void {
    this.router.navigate(['app/pacientes']);
  }
}
