import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { Router, RouterLink } from '@angular/router';

// ─── Custom validator: password === confirmPassword ───
const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  authService = inject(AuthService);
  router = inject(Router);

  // tracks the API error string so we can show it inline
  apiError = signal<string>('');

  signupForm = new FormGroup(
    {
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator }  // group-level validator
  );

  // ─── convenient getters used in the template ───
  get emailControl() { return this.signupForm.controls.email; }
  get passwordControl() { return this.signupForm.controls.password; }
  get confirmPasswordControl() { return this.signupForm.controls.confirmPassword; }
  get passwordsMismatch() {
    return this.signupForm.errors?.['passwordMismatch']
      && this.confirmPasswordControl.touched;
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.apiError.set('');   // clear any previous error

    const { email, password } = this.signupForm.getRawValue();

    // 1. Register
    this.authService.register(email, password).subscribe({
      next: () => {
        // 2. Auto-login immediately after successful registration
        this.authService.login(email, password).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: () => {
            // registration worked but login failed — just send to login page
            this.router.navigate(['/login']);
          },
        });
      },
      error: (err) => {
        // Surface the API validation message (e.g. "email already taken")
        const errors = err.error?.errors;
        if (errors && Array.isArray(errors) && errors.length > 0) {
          this.apiError.set(errors[0]);
        } else {
          this.apiError.set('Something went wrong. Please try again.');
        }
      },
    });
  }
}
