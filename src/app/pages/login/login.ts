import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/types/LoginRequest';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  loginRequest: LoginRequest = {
    login: '',
    senha: '',
  };

  form = new FormGroup({
    login: new FormControl('', [Validators.required]),
    senha: new FormControl('', [Validators.required]),
  });

  login(): void {
    this.loginRequest = this.form.value as unknown as LoginRequest;
    this.authService.autenticar(this.loginRequest).subscribe({
      next: () => {
        this.toastr.success('Login bem-sucedido');
      },
      error: () => {
        this.toastr.error('Erro ao fazer login');
      },
    });
  }
}
