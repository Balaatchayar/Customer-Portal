import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CustomerService } from '../../core/services/customer.service';
import { Invoice, AgingBucket, Memo, SalesSummary } from '../../core/models/customer.model';
import { InvoiceService } from '../../core/services/invoice.service';


@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="container">
      <h1>Finance Center</h1>
      
      <mat-card>
        <mat-tab-group>
          <mat-tab label="Invoices">
            <div class="tab-content">
              <div class="section-header">
                <h2>Invoices</h2>
                
              </div>
              
              <div class="table-container">
                <table mat-table [dataSource]="invoices" class="full-width">
                  <ng-container matColumnDef="invoiceNumber">
                    <th mat-header-cell *matHeaderCellDef>Invoice #</th>
                    <td mat-cell *matCellDef="let invoice">{{ invoice.invoiceNumber }}</td>
                  </ng-container>

                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let invoice">{{ invoice.date | date }}</td>
                  </ng-container>

                  <ng-container matColumnDef="dueDate">
                    <th mat-header-cell *matHeaderCellDef>Due Date</th>
                    <td mat-cell *matCellDef="let invoice">{{ invoice.dueDate | date }}</td>
                  </ng-container>

                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef>Amount</th>
                    <td mat-cell *matCellDef="let invoice">{{ invoice.amount | currency }}</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let invoice">
                      <mat-chip [color]="getInvoiceStatusColor(invoice.status)">
                        {{ invoice.status }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
  <th mat-header-cell *matHeaderCellDef>Actions</th>
  <td mat-cell *matCellDef="let invoice">
    <div class="action-container">
      <div class="button-row">
        <button mat-raised-button color="primary" title="View PDF" (click)="viewPDF('90000002')">
  View PDF
</button>
<button mat-raised-button color="accent" title="Download PDF" (click)="downloadPDF('90000002')">
  Download
</button>
      </div>
    </div>
  </td>
</ng-container>

                  <tr mat-header-row *matHeaderRowDef="invoiceColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: invoiceColumns;"></tr>
                </table>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Aging Report">
            <div class="tab-content">
              <div class="section-header">
                <h2>Account Aging</h2>
                <div class="aging-summary">
                  <strong>Total Outstanding: {{ getTotalAging() | currency }}</strong>
                </div>
              </div>
              
              <div class="aging-grid">
                <mat-card *ngFor="let bucket of agingBuckets" class="aging-card">
                  <mat-card-header>
                    <mat-card-title>{{ bucket.period }}</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="aging-amount">{{ bucket.amount | currency }}</div>
                    <div class="aging-percentage">{{ bucket.percentage }}% of total</div>
                    <div class="aging-bar">
                      <div class="aging-fill" [style.width.%]="bucket.percentage"></div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Credit/Debit Memos">
            <div class="tab-content">
              <h2>Credit & Debit Memos</h2>
              
              <div class="table-container">
                <table mat-table [dataSource]="memos" class="full-width">
                  <ng-container matColumnDef="memoNumber">
                    <th mat-header-cell *matHeaderCellDef>Memo #</th>
                    <td mat-cell *matCellDef="let memo">{{ memo.memoNumber }}</td>
                  </ng-container>

                  <ng-container matColumnDef="type">
                    <th mat-header-cell *matHeaderCellDef>Type</th>
                    <td mat-cell *matCellDef="let memo">
                      <mat-chip [color]="memo.type === 'CREDIT' ? 'primary' : 'warn'">
                        {{ memo.type }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let memo">{{ memo.date | date }}</td>
                  </ng-container>

                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef>Amount</th>
                    <td mat-cell *matCellDef="let memo">
                      <span [class]="memo.type === 'CREDIT' ? 'credit-amount' : 'debit-amount'">
                        {{ memo.amount | currency }}
                      </span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef>Description</th>
                    <td mat-cell *matCellDef="let memo">{{ memo.description }}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="memoColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: memoColumns;"></tr>
                </table>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Sales Summary">
            <div class="tab-content">
              <h2>Sales Summary</h2>
              
              <div class="summary-grid">
                <mat-card *ngFor="let summary of salesSummary" class="summary-card">
                  <mat-card-header>
                    <mat-card-title>{{ summary.period }}</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="summary-metric">
                      <span class="metric-label">Revenue:</span>
                      <span class="metric-value revenue">{{ summary.revenue | currency }}</span>
                    </div>
                    <div class="summary-metric">
                      <span class="metric-label">Orders:</span>
                      <span class="metric-value">{{ summary.orders }}</span>
                    </div>
                    <div class="summary-metric">
                      <span class="metric-label">Avg Order:</span>
                      <span class="metric-value">{{ summary.avgOrderValue | currency }}</span>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
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

    .tab-content {
      padding: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      margin: 0;
      color: #666;
      font-weight: 400;
    }

    .actions-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Aligns buttons to the left */
  padding-top: 4px; /* Slight spacing from header */
}

.button-row {
  display: flex;
  gap: 12px; /* Space between buttons */
}

    .aging-summary {
      color: #1976d2;
      font-size: 18px;
    }

    .table-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .aging-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .aging-card {
      text-align: center;
    }

    .aging-amount {
      font-size: 24px;
      font-weight: 500;
      color: #1976d2;
      margin-bottom: 8px;
    }

    .aging-percentage {
      color: #666;
      margin-bottom: 16px;
    }

    .aging-bar {
      height: 8px;
      background-color: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }

    .aging-fill {
      height: 100%;
      background-color: #1976d2;
      transition: width 0.3s ease;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .summary-card {
      border-left: 4px solid #1976d2;
    }

    .summary-metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .metric-label {
      color: #666;
      font-weight: 500;
    }

    .metric-value {
      font-weight: 500;
      color: #333;
    }

    .metric-value.revenue {
      color: #1976d2;
      font-size: 18px;
    }

    .credit-amount {
      color: #4caf50;
      font-weight: 500;
    }

    .debit-amount {
      color: #f44336;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .container {
        padding: 16px;
      }

      .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .aging-grid,
      .summary-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FinanceComponent implements OnInit {
  invoices: Invoice[] = [];
  agingBuckets: AgingBucket[] = [];
  memos: Memo[] = [];
  salesSummary: SalesSummary[] = [];

  invoiceColumns = ['invoiceNumber', 'date', 'dueDate', 'amount', 'status', 'actions'];
  memoColumns = ['memoNumber', 'type', 'date', 'amount', 'description'];

  constructor(
    private customerService: CustomerService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.loadFinanceData();
  }

  loadFinanceData(): void {
    this.customerService.getInvoices().subscribe(data => this.invoices = data);
    this.customerService.getAging().subscribe(data => this.agingBuckets = data);
    this.customerService.getMemos().subscribe(data => this.memos = data);
    this.customerService.getSalesSummary().subscribe(data => this.salesSummary = data);
  }

  getInvoiceStatusColor(status: string): string {
    return status.toLowerCase() === 'paid' ? 'primary' : 'warn';
  }

  getTotalAging(): number {
    return this.agingBuckets.reduce((total, bucket) => total + bucket.amount, 0);
  }

  viewPDF(invoiceId: string): void {
    this.invoiceService.getInvoicePDF(invoiceId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (err: any) => {
        console.error('Error viewing PDF:', err);
      }
    });
  }

  // downloadPDF(invoiceId: string): void {
  //   this.invoiceService.getInvoicePDF(invoiceId).subscribe({
  //     next: (blob: Blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `invoice_${invoiceId}.pdf`;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     },
  //     error: (err: any) => {
  //       console.error('Error downloading PDF:', err);
  //     }
  //   });
  // }
downloadPDF(invoiceId: string): void {
  this.invoiceService.getInvoicePDF(invoiceId).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${invoiceId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err: any) => {
      console.error('Error downloading PDF:', err);
    }
  });
}
}