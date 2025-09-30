export interface LoginRequest {
  customerId: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
  customerId?: string;
  raw: any;
}

export interface User {
  customerId: string;
  token: string;
}