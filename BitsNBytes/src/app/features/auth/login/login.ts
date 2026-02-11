import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);
  
  // Signal to track login error message
  loginError = signal<string>('');
  
  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  get emailFormControl() {
    return this.loginForm.controls.email;
  }
  get passwordFormControl() {
    return this.loginForm.controls.password;
  }
  
  onSubmit() {
    // Clear any previous error
    this.loginError.set('');
    
    const formRawValue = this.loginForm.getRawValue();
    this.authService.login(formRawValue.email, formRawValue.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        // Set user-friendly error message
        if (error.status === 400 || error.status === 401) {
          this.loginError.set('Invalid email or password. Please try again.');
        } else {
          this.loginError.set('An error occurred. Please try again later.');
        }
      }
    });
  }
}
