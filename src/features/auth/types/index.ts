export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  token?: string;
  data?: User;
}