import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { QuartosService } from '../../../core/services/quartos.service';
import { QuartoRequest } from '../../../core/types/QuartoRequest';
import { QuartoResponse } from '../../../core/types/QuartoResponse';
import { LocalizacaoQuarto } from '../../../core/enum/LocalizacaoQuarto.enum';
import { TipoQuarto } from '../../../core/enum/TipoQuarto.enum';

@Component({
  selector: 'app-editar-quartos',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './editar-quartos.html',
  styleUrls: ['./editar-quartos.css'],
})
export class EditarQuartos implements OnInit {
  form: FormGroup;
  id: number;
  localizacoes = Object.values(LocalizacaoQuarto);
  tipos = Object.values(TipoQuarto);
  // single-theme: dark theme is default
  isDarkMode = true;

  constructor(
    private fb: FormBuilder,
    private quartosService: QuartosService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      numero: ['', [Validators.required, Validators.min(1)]],
      localizacao: ['', Validators.required],
      tipo: ['', Validators.required],
      capacidade: ['', [Validators.required, Validators.min(1)]],
    });
    // Check for dark theme
    this.isDarkMode = true;
  }

  ngOnInit(): void {
    this.loadQuarto();
  }

  loadQuarto(): void {
    this.quartosService.buscarPorId(this.id).subscribe({
      next: (quarto) => {
        if (quarto) {
          this.form.patchValue({
            numero: quarto.numero,
            localizacao: quarto.localizacao,
            tipo: quarto.tipo,
            capacidade: quarto.capacidade,
          });
        }
      },
      error: (err) => console.error('Erro ao carregar quarto:', err),
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const request: QuartoRequest = this.form.value;
      this.quartosService.atualizar(this.id, request).subscribe({
        next: () => this.router.navigate(['app/quartos']),
        error: (err) => console.error('Erro ao atualizar quarto:', err),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['app/quartos']);
  }
}
