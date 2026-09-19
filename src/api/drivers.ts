import { apiGet, apiPost } from './client';

export interface Driver {
  id: string;
  kodeSupir: string;
  namaSupir: string;
  cabang: string;
  nomorHP: string;
  status: string;
}

export async function getDrivers(): Promise<Driver[]> {
  return apiGet<Driver[]>('getDrivers');
}

export async function createDriver(
  data: Omit<Driver, 'id' | 'kodeSupir'>
): Promise<Driver> {
  return apiPost<Driver>('createDriver', data);
}

export async function updateDriver(
  data: Driver
): Promise<Driver> {
  return apiPost<Driver>('updateDriver', data);
}

export async function deleteDriver(
  id: string
): Promise<unknown> {
  return apiPost<unknown>('deleteDriver', { id });
}