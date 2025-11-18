import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { UsersService } from '../../../core/services/users.service';
import { UserResponse } from '../../../core/types/UserResponse';

@Component({
  selector: 'app-listar-usuarios',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './listar-usuarios.html',
  styleUrls: ['./listar-usuarios.css'],
})
export class ListarUsuarios implements OnInit {
  usuarios: UserResponse[] = [];
  filteredUsuarios: UserResponse[] = [];
  searchTerm: string = '';
  loading = false;

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.usersService.listarTodos().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.filteredUsuarios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredUsuarios = this.usuarios.filter(
        (u) =>
          u.username?.toLowerCase().includes(term) ||
          u.role?.toLowerCase().includes(term)
      );
    } else {
      this.filteredUsuarios = this.usuarios;
    }
  }

  createUser(): void {
    this.router.navigate(['app/usuarios/criar']);
  }

  editUser(id: number): void {
    this.router.navigate(['app/usuarios/editar', id]);
  }

  deleteUser(id: number): void {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      this.usersService.deletar(id).subscribe({
        next: () => this.loadUsuarios(),
        error: (err) => console.error('Erro ao deletar usuário:', err),
      });
    }
  }
}
