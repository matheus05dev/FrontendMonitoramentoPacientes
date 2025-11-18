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
import { UsersService } from '../../../core/services/users.service';
import { UserRequest } from '../../../core/types/UserRequest';
import { Role } from '../../../core/enum/Role.enum';

@Component({
  selector: 'app-editar-usuarios',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './editar-usuarios.html',
  styleUrls: ['./editar-usuarios.css'],
})
export class EditarUsuarios implements OnInit {
  form: FormGroup;
  id: number;
  roles = Object.values(Role);

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: [''],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.usersService.buscarPorId(this.id).subscribe({
      next: (u) => {
        if (u) {
          this.form.patchValue({
            username: u.username,
            role: u.role,
          });
        }
      },
      error: (err) => console.error('Erro ao carregar usuário:', err),
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value as UserRequest;
      // If password empty, remove it so backend doesn't overwrite
      if (!formValue.password) {
        const { password, ...rest } = formValue as any;
        this.usersService.atualizar(this.id, rest).subscribe({
          next: () => this.router.navigate(['app/usuarios']),
          error: (err) => console.error('Erro ao atualizar usuário:', err),
        });
      } else {
        this.usersService.atualizar(this.id, formValue).subscribe({
          next: () => this.router.navigate(['app/usuarios']),
          error: (err) => console.error('Erro ao atualizar usuário:', err),
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['app/usuarios']);
  }
}
