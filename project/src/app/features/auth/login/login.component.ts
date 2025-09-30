import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
            <div class="portal-title-wrapper">
            <h1 class="portal-title">Customer Portal</h1>
            </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <!-- Customer ID Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Customer ID <span class="required"></span></mat-label>
              <input matInput formControlName="customerId" placeholder="Enter your Customer ID" />
              <mat-error *ngIf="loginForm.get('customerId')?.hasError('required')">
                Customer ID is required
              </mat-error>
            </mat-form-field>

            <!-- Password Field -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                placeholder="Enter your password"
              />
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <!-- Error Message -->
            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <!-- Login Button -->
            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width login-button"
              [disabled]="loginForm.invalid || isLoading"
            >
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #0a0550ff;
    }

    .login-card {
      width: 360px;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .portal-title-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: -10px; /* Optional: adjust spacing */
    margin-bottom: 16px;
    }


    .portal-title {
      // display: block;
      // width: 100%;
      // text-align: center;
      // margin-top: -10px; /* Slight upward shift */
      // margin-bottom: 16px;
      font-size: 24px;
      font-weight: bold;
      color: #130496ff;
      margin: 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .required {
      color: red;
      font-weight: bold;
    }

    .error-message {
      color: red;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    .login-button {
      font-weight: bold;
      letter-spacing: 1px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      customerId: ['', Validators.required],
      password: ['', Validators.required]
    });

    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = {
        customerId: this.loginForm.value.customerId,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}