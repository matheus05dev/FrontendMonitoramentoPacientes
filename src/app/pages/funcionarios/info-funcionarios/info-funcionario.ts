import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FuncionariosService } from '../../../core/services/funcionarios.service';
import { FuncionarioSaudeResponseDTO } from '../../../core/types/FuncionarioResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-info-funcionario',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './info-funcionario.html',
  styleUrls: ['./info-funcionario.css'],
})
export class InfoFuncionarios implements OnInit {
  funcionario: FuncionarioSaudeResponseDTO | null = null;
  id: number;
  

  constructor(
    private funcionariosService: FuncionariosService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadFuncionario();
  }

  loadFuncionario(): void {
    this.funcionariosService.buscarPorId(this.id).subscribe({
      next: (func) => (this.funcionario = func),
      error: (err) => this.toastr.error('Erro ao carregar informações do funcionário.'),
    });
  }

  edit(): void {
    this.router.navigate(['app/funcionarios/editar', this.id]);
  }

  back(): void {
    this.router.navigate(['app/funcionarios']);
  }
}
