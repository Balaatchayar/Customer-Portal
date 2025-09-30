import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { CustomerService } from '../../core/services/customer.service';
import { Inquiry, SalesOrder, Delivery } from '../../core/models/customer.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  template: `
    <div class="container">
      <h1> Dashboard</h1>

      <mat-card>
        <mat-tab-group>
          <!-- Inquiries Tab -->
          <mat-tab label="Inquiries">
            <div class="tab-content">
              <div class="table-header">
                <h2> Customer Inquiries</h2>
                <mat-form-field appearance="outline">
                  <mat-label>Search inquiries...</mat-label>
                  <input matInput (keyup)="applyFilter($event, 'inquiries')" placeholder="Search">
                  <!-- <mat-icon matSuffix>search</mat-icon> -->
                </mat-form-field>
              </div>

              <div class="table-container">
                <table mat-table [dataSource]="inquiries" class="full-width">
                  <ng-container matColumnDef="inquiryNumber">
                    <th mat-header-cell *matHeaderCellDef>Inquiry #</th>
                    <td mat-cell *matCellDef="let inquiry">{{ inquiry.inquiryNumber }}</td>
                  </ng-container>

                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let inquiry">{{ inquiry.date | date }}</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let inquiry">
                      <mat-chip [color]="getStatusColor(inquiry.status)">
                        {{ inquiry.status }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef>Amount</th>
                    <td mat-cell *matCellDef="let inquiry">{{ inquiry.amount | currency }}</td>
                  </ng-container>

                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef>Description</th>
                    <td mat-cell *matCellDef="let inquiry">{{ inquiry.description }}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="inquiryColumns" sticky></tr>
                  <tr mat-row *matRowDef="let row; columns: inquiryColumns;"></tr>
                </table>

                <div *ngIf="inquiries.data.length === 0" class="empty-state">
                  <mat-icon>info</mat-icon> No inquiries found.
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Sales Orders Tab -->
          <mat-tab label="Sales Orders">
            <div class="tab-content">
              <div class="table-header">
                <h2> Sales Orders</h2>
                <mat-form-field appearance="outline">
                  <mat-label>Search orders...</mat-label>
                  <input matInput (keyup)="applyFilter($event, 'orders')" placeholder="Search">
                  <!-- <mat-icon matSuffix>search</mat-icon> -->
                </mat-form-field>
              </div>

              <div class="table-container">
                <table mat-table [dataSource]="salesOrders" class="full-width">
                  <ng-container matColumnDef="orderNumber">
                    <th mat-header-cell *matHeaderCellDef>Order #</th>
                    <td mat-cell *matCellDef="let order">{{ order.orderNumber }}</td>
                  </ng-container>

                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Order Date</th>
                    <td mat-cell *matCellDef="let order">{{ order.date | date }}</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let order">
                      <mat-chip [color]="getStatusColor(order.status)">
                        {{ order.status }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef>Amount</th>
                    <td mat-cell *matCellDef="let order">{{ order.amount | currency }}</td>
                  </ng-container>

                  <ng-container matColumnDef="deliveryDate">
                    <th mat-header-cell *matHeaderCellDef>Delivery Date</th>
                    <td mat-cell *matCellDef="let order">{{ order.deliveryDate | date }}</td>
                  </ng-container>

                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef>Description</th>
                    <td mat-cell *matCellDef="let order">{{ order.description }}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="orderColumns" sticky></tr>
                  <tr mat-row *matRowDef="let row; columns: orderColumns;"></tr>
                </table>

                <div *ngIf="salesOrders.data.length === 0" class="empty-state">
                  <mat-icon>info</mat-icon> No sales orders found.
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Deliveries Tab -->
          <mat-tab label="Deliveries">
            <div class="tab-content">
              <div class="table-header">
                <h2> Deliveries</h2>
                <mat-form-field appearance="outline">
                  <mat-label>Search deliveries...</mat-label>
                  <input matInput (keyup)="applyFilter($event, 'deliveries')" placeholder="Search">
                  <!-- <mat-icon matSuffix>search</mat-icon> -->
                </mat-form-field>
              </div>

              <div class="table-container">
                <table mat-table [dataSource]="deliveries" class="full-width">
                  <ng-container matColumnDef="deliveryNumber">
                    <th mat-header-cell *matHeaderCellDef>Delivery #</th>
                    <td mat-cell *matCellDef="let delivery">{{ delivery.deliveryNumber }}</td>
                  </ng-container>

                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let delivery">{{ delivery.date | date }}</td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let delivery">
                      <mat-chip [color]="getStatusColor(delivery.status)">
                        {{ delivery.status }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="orderNumber">
                    <th mat-header-cell *matHeaderCellDef>Order #</th>
                    <td mat-cell *matCellDef="let delivery">{{ delivery.orderNumber }}</td>
                  </ng-container>

                  <ng-container matColumnDef="trackingNumber">
                    <th mat-header-cell *matHeaderCellDef>Tracking #</th>
                    <td mat-cell *matCellDef="let delivery">{{ delivery.trackingNumber }}</td>
                  </ng-container>

                  <ng-container matColumnDef="items">
                    <th mat-header-cell *matHeaderCellDef>Items</th>
                    <td mat-cell *matCellDef="let delivery">{{ delivery.items.length }} item(s)</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="deliveryColumns" sticky></tr>
                  <tr mat-row *matRowDef="let row; columns: deliveryColumns;"></tr>
                </table>

                <div *ngIf="deliveries.data.length === 0" class="empty-state">
                  <mat-icon>info</mat-icon> No deliveries found.
                </div>
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
      display: flex;
      align-items: center;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    .header-icon {
      margin-right: 8px;
      color: #007bff;
    }

    .tab-content {
      padding: 24px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .table-header h2 {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      color: #666;
    }

    .table-header mat-icon {
      margin-right: 6px;
      color: #888;
    }

    .table-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    table {
      background: white;
    }

    .mat-mdc-header-cell {
      background-color: #f5f5f5;
      font-weight: 500;
      color: #333;
    }

    .mat-mdc-row:hover {
      background-color: #f9f9f9;
    }

    mat-chip {
      font-size: 12px;
      min-height: 24px;
    }

    .empty-state {
      text-align: center;
      color: #999;
      margin: 16px 0;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .container {
        padding: 16px;
      }

      .table-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .table-container {
        overflow-x: auto;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  inquiries = new MatTableDataSource<Inquiry>();
  salesOrders = new MatTableDataSource<SalesOrder>();
  deliveries = new MatTableDataSource<Delivery>();

  inquiryColumns = ['inquiryNumber', 'date', 'status', 'amount', 'description'];
  orderColumns = ['orderNumber', 'date', 'status', 'amount', 'deliveryDate', 'description'];
  deliveryColumns = ['deliveryNumber', 'date', 'status', 'orderNumber', 'trackingNumber', 'items'];

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.customerService.getInquiries().subscribe(data => this.inquiries.data = data);
    this.customerService.getSalesOrders().subscribe(data => this.salesOrders.data = data);
    this.customerService.getDeliveries().subscribe(data => this.deliveries.data = data);
  }

  applyFilter(event: Event, table: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    switch (table) {
      case 'inquiries':
        this.inquiries.filter = filterValue;
        break;
      case 'orders':
        this.salesOrders.filter = filterValue;
        break;
      case 'deliveries':
        this.deliveries.filter = filterValue;
        break;
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
      case 'confirmed':
      case 'delivered':
        return 'primary';
      case 'in progress':
      case 'processing':
      case 'in transit':
        return 'accent';
      case 'closed':
      case 'shipped':
        return 'warn';
      default:
        return '';
    }
  }
}