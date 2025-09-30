import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { appConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private baseUrl = appConfig.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getInvoicePDF(billingNumber: string): Observable<Blob> {
    const url = `${this.baseUrl}/invoice-pdf/${billingNumber}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}