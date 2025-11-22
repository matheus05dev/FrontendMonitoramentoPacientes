import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { QuartosService } from '../../../core/services/quartos.service';
import { QuartoRequest } from '../../../core/types/QuartoRequest';
import { LocalizacaoQuarto } from '../../../core/enum/LocalizacaoQuarto.enum';
import { TipoQuarto } from '../../../core/enum/TipoQuarto.enum';

@Component({
  selector: 'app-criar-quartos',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './criar-quartos.html',
  styleUrls: ['./criar-quartos.css'],
})
export class CriarQuartos {
  form: FormGroup;
  localizacoes = Object.values(LocalizacaoQuarto);
  tipos = Object.values(TipoQuarto);
  isDarkMode = true;

  constructor(
    private fb: FormBuilder,
    private quartosService: QuartosService,
    private router: Router
  ) {
    this.form = this.fb.group({
      numero: ['', [Validators.required, Validators.min(1)]],
      localizacao: ['', Validators.required],
      tipo: ['', Validators.required],
      capacidade: ['', [Validators.required, Validators.min(1)]],
    });
    // single-theme: dark theme is default
    this.isDarkMode = true;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const raw = this.form.value;
      const request: QuartoRequest = {
        numero: Number(raw.numero),
        localizacao: raw.localizacao,
        tipo: raw.tipo,
        capacidade: Number(raw.capacidade),
      };
      console.log('Enviando criar quarto:', request);
      this.quartosService.criar(request).subscribe({
        next: () => this.router.navigate(['app/quartos']),
        error: (err) =>
          console.error('Erro ao criar quarto:', err.status, err.error || err),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['app/quartos']);
  }
}
