import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" *ngIf="authService.isAuthenticated">
      <span>Customer Portal</span>
      
      <div class="nav-links">
        <button mat-button routerLink="/dashboard" routerLinkActive="active">
          <!-- <mat-icon>dashboard</mat-icon> -->
          <span>Dashboard</span>
        </button>
        <button mat-button routerLink="/profile" routerLinkActive="active">
          <!-- <mat-icon>person</mat-icon> -->
          Profile
        </button>
        <button mat-button routerLink="/finance" routerLinkActive="active">
          <!-- <mat-icon>account_balance</mat-icon> -->
          Finance
        </button>
      </div>

      <span class="spacer"></span>
      <span class="logout-button" (click)="logout()">Logout</span>
      
      <!-- <div class="user-menu">
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <div class="user-info">
            <strong>{{ authService.customerId }}</strong>
          </div> -->
          <!-- <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </mat-menu>
      </div> -->
    </mat-toolbar>
  `,
  styles: [`
    .nav-links {
      margin-left: 32px;
    }
    
    .nav-links button {
      margin-right: 15px;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .user-info {
      padding: 8px 16px;
      color: rgba(0,0,0,0.87);
    }
    
    .active {
      background-color: rgba(255,255,255,0.1);
    }

    @media (max-width: 768px) {
      .nav-links {
        margin-left: 16px;
      }
      
      .nav-links button .mat-icon {
        margin-right: 4px;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}