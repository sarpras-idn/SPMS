import { apiPost } from './client';

export interface AuthUser {
  id: string;
  nama: string;
  email: string;
  role: string;
  unit: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  return apiPost<AuthUser>('login', { email, password });
}
