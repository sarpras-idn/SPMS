import { apiGet } from './client';

export interface MasterData {
  Kategori: string[];
  'Sub Kategori': string[];
  Lokasi: string[];
  PIC: string[];
  Satuan: string[];
  Kondisi: string[];
  'Status Aset': string[];
  'Sumber Perolehan': string[];
}

export async function getMasterData(): Promise<MasterData> {
  return apiGet<MasterData>('getMasterData');
}
