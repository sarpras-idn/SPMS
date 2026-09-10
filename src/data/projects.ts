import type { Proyek } from '@/types';

export const proyekSeed: Proyek[] = [
  { id: 'prj-001', kodeProyek: 'PRJ-001', namaProyek: 'Pembangunan IDN Jonggol', pic: 'Doni Azizi, S.Kom', anggaran: 100000000, realisasi: 65000000, progress: 65, status: 'Berjalan', targetSelesai: '2026-12-31' },
  { id: 'prj-002', kodeProyek: 'PRJ-002', namaProyek: 'Pembangunan Jaringan Listrik IDN Ikhwan', pic: 'Bapak Ari', anggaran: 82450000, realisasi: 70000000, progress: 85, status: 'Berjalan', targetSelesai: '2026-09-30' },
  { id: 'prj-003', kodeProyek: 'PRJ-003', namaProyek: 'Pengadaan AC Asrama Saung Baru', pic: 'Bapak Hendro', anggaran: 32000000, realisasi: 32000000, progress: 100, status: 'Selesai', targetSelesai: '2026-06-30' },
  { id: 'prj-004', kodeProyek: 'PRJ-004', namaProyek: 'Pembuatan Halang Rintang Pramuka IDN', pic: 'Bapak Deni', anggaran: 10000000, realisasi: 5000000, progress: 40, status: 'Berjalan', targetSelesai: '2026-10-15' },
  { id: 'prj-005', kodeProyek: 'PRJ-005', namaProyek: 'Pengadaan Mobil Operasional', pic: 'M. Yusuf', anggaran: 250000000, realisasi: 0, progress: 10, status: 'Perencanaan', targetSelesai: '2026-11-30' },
];
