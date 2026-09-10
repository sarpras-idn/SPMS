import type { Kendaraan } from '@/types';

export const kendaraanSeed: Kendaraan[] = [
  {
    id: 'ken-001', kodeKendaraan: 'KND-001', namaKendaraan: 'Toyota Avanza MZ',
    nomorPolisi: 'B 9123 MZ', merek: 'Toyota', tipe: 'Avanza 1.3 E', tahun: 2022,
    kondisi: 'Baik', status: 'Tersedia', driver: 'Bapak Ari', lokasi: 'IDN Jonggol Ikhwan',
    kilometer: 48230, keterangan: 'Operasional harian Jonggol',
  },
  {
    id: 'ken-002', kodeKendaraan: 'KND-002', namaKendaraan: 'Toyota Avanza FF',
    nomorPolisi: 'B 9234 FF', merek: 'Toyota', tipe: 'Avanza 1.3 E', tahun: 2021,
    kondisi: 'Perlu Servis', status: 'Digunakan', driver: 'Bapak Hendro', lokasi: 'IDN Jonggol Ikhwan',
    kilometer: 67500, keterangan: 'Service berkala mendekati',
  },
  {
    id: 'ken-003', kodeKendaraan: 'KND-003', namaKendaraan: 'Toyota Avanza BRB',
    nomorPolisi: 'B 9345 BRB', merek: 'Toyota', tipe: 'Avanza 1.3 E', tahun: 2023,
    kondisi: 'Baik', status: 'Tersedia', driver: 'Bapak Deni', lokasi: 'IDN Jonggol Ikhwan',
    kilometer: 22100, keterangan: 'Operasional Jonggol',
  },
  {
    id: 'ken-004', kodeKendaraan: 'KND-004', namaKendaraan: 'Toyota Avanza FN',
    nomorPolisi: 'B 9456 FN', merek: 'Toyota', tipe: 'Avanza 1.3 E', tahun: 2022,
    kondisi: 'Maintenance', status: 'Maintenance', driver: 'Bapak Akim', lokasi: 'IDN Pamijahan',
    kilometer: 54300, keterangan: 'Perbaikan rem',
  },
  {
    id: 'ken-005', kodeKendaraan: 'KND-005', namaKendaraan: 'Toyota Innova FNN (Yayasan)',
    nomorPolisi: 'B 9567 FNN', merek: 'Toyota', tipe: 'Innova 2.0 G', tahun: 2023,
    kondisi: 'Baik', status: 'Tersedia', driver: 'Bapak Yusuf', lokasi: 'IDN Sentul',
    kilometer: 18900, keterangan: 'Kendaraan operasional yayasan',
  },
];
