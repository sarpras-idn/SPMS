import { apiGet, apiPost } from './client';
import type { User } from '@/types';

export async function getUsers(): Promise<User[]> {
  const data = await apiGet<unknown[]>('getUsers');
  return data.map((raw) => normalizeUser(raw as Record<string, unknown>));
}

export interface CreateUserPayload {
  nama: string;
  email: string;
  role: string;
  unit: string;
  status: string;
  password: string;
}

export interface CreatedUser {
  id: string;
  nama: string;
  email: string;
  role: string;
  unit: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function createUser(data: CreateUserPayload): Promise<CreatedUser> {
  return apiPost<CreatedUser>('createUser', data);
}

function normalizeUser(raw: Record<string, unknown>): User {
  return {
    id: String(raw.id ?? raw.ID ?? ''),
    nama: String(raw.nama ?? ''),
    email: String(raw.email ?? ''),
    role: String(raw.role ?? ''),
    unit: String(raw.unit ?? ''),
    status: String(raw.status ?? ''),
    passwordHash: raw.passwordHash ? String(raw.passwordHash) : undefined,
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  };
}
