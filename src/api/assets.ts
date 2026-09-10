import { apiGet, apiPost } from './client';
import type { Aset } from '@/types';

export async function getAssets(): Promise<Aset[]> {
  const data = await apiGet<unknown[]>('getAssets');
  return data.map((raw) => normalizeAsset(raw as Record<string, unknown>));
}

export async function createAsset(data: Omit<Aset, 'id'>): Promise<unknown> {
  const { createdAt, updatedAt, ...payload } = data;
  return apiPost('createAsset', payload);
}

export async function updateAsset(id: string, data: Omit<Aset, 'id'>): Promise<unknown> {
  const { createdAt, updatedAt, ...payload } = data;
  return apiPost('updateAsset', { id, ...payload });
}

export async function deleteAsset(id: string): Promise<unknown> {
  return apiPost('deleteAsset', { id });
}

function normalizeAsset(raw: Record<string, unknown>): Aset {
  return {
    id: String(raw.id ?? raw.ID ?? ''),
    kodeAset: String(raw.kodeAset ?? ''),
    namaAset: String(raw.namaAset ?? ''),
    kategori: String(raw.kategori ?? ''),
    subKategori: String(raw.subKategori ?? ''),
    merek: String(raw.merek ?? ''),
    tipe: String(raw.tipe ?? ''),
    nomorSeri: String(raw.nomorSeri ?? ''),
    lokasi: String(raw.lokasi ?? ''),
    pic: String(raw.pic ?? ''),
    jumlah: Number(raw.jumlah ?? 0),
    satuan: String(raw.satuan ?? 'Unit'),
    kondisi: String(raw.kondisi ?? 'Baik') as Aset['kondisi'],
    statusAset: String(raw.statusAset ?? 'Aktif') as Aset['statusAset'],
    tahunPembelian: Number(raw.tahunPembelian ?? new Date().getFullYear()),
    tanggalPembelian: String(raw.tanggalPembelian ?? ''),
    nilaiAset: Number(raw.nilaiAset ?? 0),
    sumberPerolehan: String(raw.sumberPerolehan ?? 'Pembelian') as Aset['sumberPerolehan'],
    keterangan: String(raw.keterangan ?? ''),
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  };
}
