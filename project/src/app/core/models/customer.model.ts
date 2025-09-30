export interface CustomerProfile {
  customerId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  creditLimit: number;
  currency: string;
  salesPerson: string;
  paymentTerms: string;
}

export interface Inquiry {
  inquiryNumber: string;
  date: string;
  status: string;
  amount: number;
  description: string;
}

export interface SalesOrder {
  orderNumber: string;
  date: string;
  status: string;
  amount: number;
  deliveryDate: string;
  description: string;
}

export interface Delivery {
  deliveryNumber: string;
  date: string;
  status: string;
  orderNumber: string;
  trackingNumber: string;
  items: DeliveryItem[];
}

export interface DeliveryItem {
  material: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface Invoice {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  pdfUrl?: string;
}

export interface AgingBucket {
  period: string;
  amount: number;
  percentage: number;
}

export interface Memo {
  memoNumber: string;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  amount: number;
  description: string;
}

export interface SalesSummary {
  period: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}