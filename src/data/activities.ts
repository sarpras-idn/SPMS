import type { Aktivitas } from '@/types';

export const aktivitasSeed: Aktivitas[] = [
  { id: 'act-001', jenis: 'aset', aksi: 'Aset ditambahkan', deskripsi: 'AC Split Daikin 1 PK ditambahkan ke inventaris', waktu: '5 menit lalu', timestamp: Date.now() - 5 * 60 * 1000 },
  { id: 'act-002', jenis: 'maintenance', aksi: 'Maintenance diproses', deskripsi: 'Perbaikan Pompa Air Utama IDN Sentul sedang diproses', waktu: '1 jam lalu', timestamp: Date.now() - 60 * 60 * 1000 },
  { id: 'act-003', jenis: 'pengajuan', aksi: 'Pengajuan baru', deskripsi: 'Pengajuan pengadaan AC 1 PK dari Bapak Ari', waktu: 'Hari ini', timestamp: Date.now() - 3 * 60 * 60 * 1000 },
  { id: 'act-004', jenis: 'rka', aksi: 'RKA diperbarui', deskripsi: 'Anggaran Pembangunan IDN Jonggol diperbarui', waktu: 'Hari ini', timestamp: Date.now() - 5 * 60 * 60 * 1000 },
  { id: 'act-005', jenis: 'proyek', aksi: 'Progress proyek diperbarui', deskripsi: 'Pembangunan Jaringan Listrik IDN Ikhwan mencapai 85%', waktu: 'Kemarin', timestamp: Date.now() - 26 * 60 * 60 * 1000 },
  { id: 'act-006', jenis: 'kendaraan', aksi: 'Kendaraan digunakan', deskripsi: 'Toyota Avanza FF digunakan untuk operasional', waktu: 'Kemarin', timestamp: Date.now() - 28 * 60 * 60 * 1000 },
];
