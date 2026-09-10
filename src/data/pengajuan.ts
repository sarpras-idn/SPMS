import type { Pengajuan } from '@/types';

export const pengajuanSeed: Pengajuan[] = [
  { id: 'pgj-001', nomorPengajuan: 'PGJ-001', tanggal: '2026-08-15', pemohon: 'Bapak Ari', unit: 'IDN Jonggol Ikhwan', pengajuan: 'Pengadaan AC 1 PK untuk ruang kelas baru', prioritas: 'Sedang', estimasiBiaya: 6500000, status: 'Menunggu', keterangan: 'Menunggu approval' },
  { id: 'pgj-002', nomorPengajuan: 'PGJ-002', tanggal: '2026-08-14', pemohon: 'Ibu Siti', unit: 'IDN Jonggol Akhwat', pengajuan: 'Penggantian kasur asrama 10 unit', prioritas: 'Tinggi', estimasiBiaya: 4000000, status: 'Diproses', keterangan: 'Review anggaran' },
  { id: 'pgj-003', nomorPengajuan: 'PGJ-003', tanggal: '2026-08-13', pemohon: 'Bapak Yusuf', unit: 'IDN Sentul', pengajuan: 'Perbaikan pompa air utama', prioritas: 'Urgent', estimasiBiaya: 1200000, status: 'Disetujui', keterangan: 'Segera eksekusi' },
  { id: 'pgj-004', nomorPengajuan: 'PGJ-004', tanggal: '2026-08-12', pemohon: 'M. Yusuf', unit: 'Kantor Yayasan', pengajuan: 'Pengadaan kursi staff 5 unit', prioritas: 'Rendah', estimasiBiaya: 2250000, status: 'Disetujui', keterangan: 'Proses pengadaan' },
  { id: 'pgj-005', nomorPengajuan: 'PGJ-005', tanggal: '2026-08-11', pemohon: 'Bapak Akim', unit: 'IDN Pamijahan', pengajuan: 'Pengadaan whiteboard 6 unit', prioritas: 'Sedang', estimasiBiaya: 3600000, status: 'Selesai', keterangan: 'Sudah diterima' },
  { id: 'pgj-006', nomorPengajuan: 'PGJ-006', tanggal: '2026-08-10', pemohon: 'Bapak Hari', unit: 'IDN Solo', pengajuan: 'Upgrade bandwidth internet', prioritas: 'Sedang', estimasiBiaya: 6000000, status: 'Ditolak', keterangan: 'Anggaran tidak mencukupi' },
  { id: 'pgj-007', nomorPengajuan: 'PGJ-007', tanggal: '2026-08-09', pemohon: 'Bapak Hendro', unit: 'IDN Jonggol Ikhwan', pengajuan: 'Perbaikan instalasi listrik panel A', prioritas: 'Urgent', estimasiBiaya: 600000, status: 'Diproses', keterangan: 'Koordinasi dengan PLN' },
  { id: 'pgj-008', nomorPengajuan: 'PGJ-008', tanggal: '2026-08-08', pemohon: 'Bapak Deni', unit: 'IDN Jonggol Ikhwan', pengajuan: 'Pengadaan karpet masjid 10 lembar', prioritas: 'Rendah', estimasiBiaya: 290000, status: 'Selesai', keterangan: 'Sudah diterima' },
];
