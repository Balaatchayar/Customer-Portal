import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CustomerService } from '../../core/services/customer.service';
import { CustomerProfile } from '../../core/models/customer.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="container">
      <h1>Customer Profile</h1>
      
      <div class="profile-grid" *ngIf="profile">
        <mat-card class="profile-card">
          <mat-card-header>
            <!-- <mat-icon mat-card-avatar>business</mat-icon> -->
            <mat-card-title>Company Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-row">
              <strong>Customer ID:</strong>
              <span>{{ profile.customerId }}</span>
            </div>
            <div class="info-row">
              <strong>Company Name:</strong>
              <span>{{ profile.name }}</span>
            </div>
            <div class="info-row">
              <strong>Address:</strong>
              <span>{{ profile.address }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="profile-card">
          <mat-card-header>
            <!-- <mat-icon mat-card-avatar>contact_phone</mat-icon> -->
            <mat-card-title>Contact Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-row">
              <strong>Phone:</strong>
              <span>{{ profile.phone }}</span>
            </div>
            <div class="info-row">
              <strong>Email:</strong>
              <span>{{ profile.email }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="profile-card">
          <mat-card-header>
            <!-- <mat-icon mat-card-avatar>account_balance</mat-icon> -->
            <mat-card-title>Financial Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-row">
              <strong>Credit Limit:</strong>
              <span class="amount">{{ profile.creditLimit | currency }}</span>
            </div>
            <div class="info-row">
              <strong>Currency:</strong>
              <span>{{ profile.currency }}</span>
            </div>
            <div class="info-row">
              <strong>Payment Terms:</strong>
              <span>{{ profile.paymentTerms }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="profile-card">
          <mat-card-header>
            <!-- <mat-icon mat-card-avatar>person</mat-icon> -->
            <mat-card-title>Sales Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-row">
              <strong>Sales Representative:</strong>
              <span>{{ profile.salesPerson }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
    }

    h1 {
      margin-bottom: 24px;
      color: #333;
      font-weight: 300;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .profile-card {
      height: fit-content;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row strong {
      color: #666;
      font-weight: 500;
    }

    .info-row span {
      color: #333;
      text-align: right;
      max-width: 60%;
      word-wrap: break-word;
    }

    .amount {
      color: #1976d2;
      font-weight: 500;
    }

    mat-card-header {
      margin-bottom: 16px;
    }

    mat-icon[mat-card-avatar] {
      background-color: #1976d2;
      color: white;
    }

    @media (max-width: 768px) {
      .container {
        padding: 16px;
      }

      .profile-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .info-row span {
        max-width: 100%;
        text-align: left;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile: CustomerProfile | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.getProfile().subscribe(
      profile => this.profile = profile
    );
  }
}