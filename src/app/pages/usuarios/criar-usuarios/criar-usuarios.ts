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
import { UsersService } from '../../../core/services/users.service';
import { UserRequest } from '../../../core/types/UserRequest';
import { Role } from '../../../core/enum/Role.enum';

@Component({
  selector: 'app-criar-usuarios',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './criar-usuarios.html',
  styleUrl: './criar-usuarios.css',
})
export class CriarUsuarios {
  form: FormGroup;
  roles = Object.values(Role);
  isDarkMode = true;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
    this.isDarkMode = true;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const payload: UserRequest = this.form.value;
      this.usersService.criar(payload).subscribe({
        next: () => this.router.navigate(['app/usuarios']),
        error: (err) => console.error('Erro ao criar usuário:', err),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['app/usuarios']);
  }
}
