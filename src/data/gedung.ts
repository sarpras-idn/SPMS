import type { GedungRuangan } from '@/types';

export const gedungSeed: GedungRuangan[] = [
  { id: 'gdg-001', kode: 'GDG-001', nama: 'Gedung Utama Ikhwan', lokasi: 'IDN Jonggol Ikhwan', tipe: 'Gedung Permanen', kapasitas: 300, kondisi: 'Baik', pic: 'Bapak Ari' },
  { id: 'gdg-002', kode: 'GDG-002', nama: 'Asrama Saung Baru', lokasi: 'IDN Jonggol Ikhwan', tipe: 'Asrama', kapasitas: 80, kondisi: 'Baik + Perawatan', pic: 'Bapak Hendro' },
  { id: 'gdg-003', kode: 'GDG-003', nama: 'Gedung Kelas Akhwat', lokasi: 'IDN Jonggol Akhwat', tipe: 'Gedung Permanen', kapasitas: 240, kondisi: 'Baik', pic: 'Ibu Siti' },
  { id: 'gdg-004', kode: 'GDG-004', nama: 'Kantor Yayasan', lokasi: 'Kantor Yayasan', tipe: 'Kantor', kapasitas: 50, kondisi: 'Baik', pic: 'M. Yusuf' },
  { id: 'gdg-005', kode: 'GDG-005', nama: 'Gedung Pembelajaran Pamijahan', lokasi: 'IDN Pamijahan', tipe: 'Gedung Permanen', kapasitas: 180, kondisi: 'Baik', pic: 'Bapak Akim' },
  { id: 'gdg-006', kode: 'GDG-006', nama: 'Gedung Serbaguna Sentul', lokasi: 'IDN Sentul', tipe: 'Gedung Semi-Permanen', kapasitas: 150, kondisi: 'Rusak Ringan', pic: 'Bapak Yusuf' },
  { id: 'gdg-007', kode: 'GDG-007', nama: 'Gedung Kelas Solo', lokasi: 'IDN Solo', tipe: 'Gedung Permanen', kapasitas: 120, kondisi: 'Baik', pic: 'Bapak Hari' },
];
