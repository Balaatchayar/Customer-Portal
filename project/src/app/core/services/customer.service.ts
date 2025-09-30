import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  CustomerProfile, 
  Inquiry, 
  SalesOrder, 
  Delivery, 
  Invoice, 
  AgingBucket, 
  Memo, 
  SalesSummary 
} from '../models/customer.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private get customerId(): string {
    return this.authService.customerId || '';
  }

  getProfile(): Observable<CustomerProfile> {
    return this.http.post<any>(`${environment.apiUrl}/profile`, { 
      CUSTOMER_ID: this.customerId 
    }).pipe(
      map(response => this.parseProfileData(response)),
      catchError(() => of(this.getMockProfile()))
    );
  }

  getInquiries(): Observable<Inquiry[]> {
    return this.http.post<any>(`${environment.apiUrl}/inquiry`, { 
      customerId: this.customerId 
    }).pipe(
      map(response => this.parseInquiryData(response)),
      catchError(() => of(this.getMockInquiries()))
    );
  }

  getSalesOrders(): Observable<SalesOrder[]> {
    return this.http.post<any>(`${environment.apiUrl}/sales`, { 
      CUSTOMER_ID: this.customerId 
    }).pipe(
      map(response => this.parseSalesData(response)),
      catchError(() => of(this.getMockSalesOrders()))
    );
  }

  getDeliveries(): Observable<Delivery[]> {
    return this.http.post<any>(`${environment.apiUrl}/deliveries`, { 
      CUSTOMER_ID: this.customerId 
    }).pipe(
      map(response => this.parseDeliveryData(response)),
      catchError(() => of(this.getMockDeliveries()))
    );
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.post<any>(`${environment.apiUrl}/invoices`, { 
      CUSTOMER_ID: this.customerId 
    }).pipe(
      map(response => this.parseInvoiceData(response)),
      catchError(() => of(this.getMockInvoices()))
    );
  }

  getAging(): Observable<AgingBucket[]> {
    return this.http.post<any>(`${environment.apiUrl}/aging`, { 
      customerId: this.customerId 
    }).pipe(
      map(response => this.parseAgingData(response)),
      catchError(() => of(this.getMockAging()))
    );
  }

  getMemos(): Observable<Memo[]> {
    return this.http.post<any>(`${environment.apiUrl}/memos`, { 
      CUSTOMER_ID: this.customerId 
    }).pipe(
      map(response => this.parseMemoData(response)),
      catchError(() => of(this.getMockMemos()))
    );
  }

  getSalesSummary(): Observable<SalesSummary[]> {
    return this.http.post<any>(`${environment.apiUrl}/overall`, { 
      CUSTOMER_ID: this.customerId 
    }).pipe(
      map(response => this.parseSalesSummaryData(response)),
      catchError(() => of(this.getMockSalesSummary()))
    );
  }

  // Data parsing methods (to handle SAP XML responses)
  private parseProfileData(response: any): CustomerProfile {
    // Parse SAP XML response - simplified for now
    return this.getMockProfile();
  }

  private parseInquiryData(response: any): Inquiry[] {
    return this.getMockInquiries();
  }

  private parseSalesData(response: any): SalesOrder[] {
    return this.getMockSalesOrders();
  }

  private parseDeliveryData(response: any): Delivery[] {
    return this.getMockDeliveries();
  }

  private parseInvoiceData(response: any): Invoice[] {
    return this.getMockInvoices();
  }

  private parseAgingData(response: any): AgingBucket[] {
    return this.getMockAging();
  }

  private parseMemoData(response: any): Memo[] {
    return this.getMockMemos();
  }

  private parseSalesSummaryData(response: any): SalesSummary[] {
    return this.getMockSalesSummary();
  }

  // Mock data methods
  private getMockProfile(): CustomerProfile {
    return {
      customerId: this.customerId,
      name: 'ACME Corporation Ltd.',
      address: '123 Business Street, Corporate City, CC 12345',
      phone: '+1 (555) 123-4567',
      email: 'contact@acme-corp.com',
      creditLimit: 500000,
      currency: 'USD',
      salesPerson: 'John Smith',
      paymentTerms: 'Net 30 Days'
    };
  }

  private getMockInquiries(): Inquiry[] {
    return [
      {
        inquiryNumber: '0010000001',
        date: 'May 18, 2025',
        status: 'Open',
        amount: 130.00,
        description: 'biscuit'
      },
      {
        inquiryNumber: '0010000002',
        date: 'May 18, 2025',
        status: 'In Progress',
        amount: 100.00,
        description: 'coffee'
      },
      {
        inquiryNumber: '0010000003',
        date: 'May 18, 2025',
        status: 'Closed',
        amount: 0.00,
        description: 'coffee'
      }
    ];
  }

  private getMockSalesOrders(): SalesOrder[] {
    return [
      {
        orderNumber: '0010000001',
        date: 'May 18, 2025',
        status: 'Confirmed',
        amount: 130.00,
        deliveryDate: 'May 20, 2025',
        description: 'biscuit'
      },
      {
        orderNumber: '0010000002',
        date: 'May 18, 2025',
        status: 'Processing',
        amount: 100.00,
        deliveryDate: 'May 20, 2025',
        description: 'coffee'
      },
      {
        orderNumber: '0010000003',
        date: 'May 18, 2025',
        status: 'Shipped',
        amount: 0.00,
        deliveryDate: 'May 20, 2025',
        description: 'coffee'
      }
    ];
  }

  private getMockDeliveries(): Delivery[] {
    return [
      {
        deliveryNumber: '0080000010',
        date: 'May 15, 2025',
        status: 'Delivered',
        orderNumber: 'Z001',
        trackingNumber: '000010',
        items: [
          { material: 'PART-001', description: 'Motor Assembly', quantity: 2, unit: 'EA' },
          { material: 'PART-002', description: 'Control Unit', quantity: 1, unit: 'EA' }
        ]
      },
      {
        deliveryNumber: '0080000011',
        date: 'May 16, 2025',
        status: 'In Transit',
        orderNumber: 'Z001',
        trackingNumber: '000010',
        items: [
          { material: 'EQUIP-001', description: 'Main Unit', quantity: 1, unit: 'EA' }
        ]
      }
    ];
  }

  private getMockInvoices(): Invoice[] {
    return [
      {
        invoiceNumber: '0090000010',
        date: 'May 15, 2025',
        dueDate: 'May 16, 2025',
        amount: 516.00,
        status: 'Paid'
      },
      {
        invoiceNumber: '0090000011',
        date: 'May 18, 2025',
        dueDate: 'May 19, 2025',
        amount: 156.00,
        status: 'Outstanding'
      },
      {
        invoiceNumber: '0090000012',
        date: 'May 18, 2025',
        dueDate: 'May 19, 2025',
        amount: 76.00,
        status: 'Outstanding'
      }
    ];
  }

  private getMockAging(): AgingBucket[] {
    return [
      { period: '0-30 Days', amount: 77000, percentage: 65 },
      { period: '31-60 Days', amount: 25000, percentage: 21 },
      { period: '61-90 Days', amount: 12000, percentage: 10 },
      { period: '90+ Days', amount: 5000, percentage: 4 }
    ];
  }

  private getMockMemos(): Memo[] {
    return [
      {
        memoNumber: '000000000000000019',
        type: 'CREDIT',
        date: 'May 21, 2025',
        amount: 38,
        description: 'sandwich non veg'
      },
      {
        memoNumber: '000000000000000008',
        type: 'DEBIT',
        date: 'May 21, 2025',
        amount: 1978,
        description: 'biscuit'
      }
    ];
  }

  private getMockSalesSummary(): SalesSummary[] {
    return [
      { period: 'Jan 2024', revenue: 95000, orders: 3, avgOrderValue: 31667 },
      { period: 'Dec 2023', revenue: 78000, orders: 2, avgOrderValue: 39000 },
      { period: 'Nov 2023', revenue: 65000, orders: 4, avgOrderValue: 16250 },
      { period: 'Oct 2023', revenue: 82000, orders: 3, avgOrderValue: 27333 },
      { period: 'Sep 2023', revenue: 91000, orders: 5, avgOrderValue: 18200 },
      { period: 'Aug 2023', revenue: 73000, orders: 2, avgOrderValue: 36500 }
    ];
  }
}