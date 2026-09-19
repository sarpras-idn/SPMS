import { apiGet, apiPost } from './client';

export interface Vehicle {
  id: string;
  kodeKendaraan: string;
  namaKendaraan: string;
  nomorPolisi: string;
  merek: string;
  tipe: string;
  tahun: string | number;
  warna: string;
  nomorRangka: string;
  nomorMesin: string;
  kilometer: string | number;
  kondisi: string;
  status: string;
  pic: string;
  lokasi: string;
  stnk: string;
  pajak: string;
  keterangan: string;
}

export async function getVehicles(): Promise<Vehicle[]> {
  return apiGet<Vehicle[]>('getVehicles');
}

export async function createVehicle(
  data: Omit<Vehicle, 'id' | 'kodeKendaraan'>
): Promise<Vehicle> {
  return apiPost<Vehicle>('createVehicle', data);
}

export async function updateVehicle(
  data: Vehicle
): Promise<Vehicle> {
  return apiPost<Vehicle>('updateVehicle', data);
}

export async function deleteVehicle(
  id: string
): Promise<unknown> {
  return apiPost<unknown>('deleteVehicle', { id });
}