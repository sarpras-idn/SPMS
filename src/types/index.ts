export type KondisiAset = string;
export type StatusAset = string;
export type SumberPerolehan = string;

export interface Aset {
  id: string;
  kodeAset: string;
  namaAset: string;
  kategori: string;
  subKategori: string;
  merek: string;
  tipe: string;
  nomorSeri: string;
  lokasi: string;
  pic: string;
  jumlah: number;
  satuan: string;
  kondisi: KondisiAset;
  statusAset: StatusAset;
  tahunPembelian: number;
  tanggalPembelian: string;
  nilaiAset: number;
  sumberPerolehan: SumberPerolehan;
  keterangan: string;
  createdAt?: string;
  updatedAt?: string;
}

export type StatusKendaraan = 'Tersedia' | 'Digunakan' | 'Maintenance' | 'Tidak Aktif';
export type KondisiKendaraan = 'Baik' | 'Perlu Servis' | 'Maintenance';

export interface Kendaraan {
  id: string;
  kodeKendaraan: string;
  namaKendaraan: string;
  nomorPolisi: string;
  merek: string;
  tipe: string;
  tahun: number;
  kondisi: KondisiKendaraan;
  status: StatusKendaraan;
  driver: string;
  lokasi: string;
  kilometer: number;
  keterangan: string;
}

export type StatusMaintenance = 'Menunggu' | 'Diproses' | 'Selesai' | 'Ditunda';
export type Prioritas = 'Rendah' | 'Sedang' | 'Tinggi' | 'Urgent';

export interface Maintenance {
  id: string;
  nomor: string;
  tanggal: string;
  aset: string;
  lokasi: string;
  kerusakan: string;
  prioritas: Prioritas;
  pic: string;
  estimasiBiaya: number;
  status: StatusMaintenance;
  keterangan: string;
}

export type StatusPengajuan = 'Menunggu' | 'Diproses' | 'Disetujui' | 'Ditolak' | 'Selesai';

export interface Pengajuan {
  id: string;
  nomorPengajuan: string;
  tanggal: string;
  pemohon: string;
  unit: string;
  pengajuan: string;
  prioritas: Prioritas;
  estimasiBiaya: number;
  status: StatusPengajuan;
  keterangan: string;
}

export type StatusProyek = 'Perencanaan' | 'Berjalan' | 'Selesai' | 'Ditunda';

export interface Proyek {
  id: string;
  kodeProyek: string;
  namaProyek: string;
  pic: string;
  anggaran: number;
  realisasi: number;
  progress: number;
  status: StatusProyek;
  targetSelesai: string;
}

export type KategoriRKA = 'Tanah' | 'Kendaraan' | 'Proyek Pembangunan' | 'Jaringan Listrik' | 'AC' | 'Program Lainnya';

export interface RKA {
  id: string;
  kodeRKA: string;
  namaProgram: string;
  kategori: KategoriRKA;
  anggaran: number;
  realisasi: number;
  keterangan: string;
}

export type StatusKPI = 'On Track' | 'Perlu Perhatian' | 'Tercapai' | 'Belum Mulai';

export interface KPI {
  id: string;
  kodeKPI: string;
  sasaranStrategis: string;
  indikator: string;
  target: number;
  realisasi: number;
  satuan: string;
  status: StatusKPI;
}

export type StatusSOP = 'Berlaku' | 'Revisi' | 'Berakhir';

export interface SOP {
  id: string;
  kodeSOP: string;
  namaSOP: string;
  kategori: string;
  versi: string;
  tanggalBerlaku: string;
  pic: string;
  status: StatusSOP;
  keterangan: string;
}

export interface GedungRuangan {
  id: string;
  kode: string;
  nama: string;
  lokasi: string;
  tipe: string;
  kapasitas: number;
  kondisi: KondisiAset;
  pic: string;
}

export interface Aktivitas {
  id: string;
  jenis: 'aset' | 'maintenance' | 'pengajuan' | 'rka' | 'proyek' | 'kendaraan' | 'kpi';
  aksi: string;
  deskripsi: string;
  waktu: string;
  timestamp: number;
}

export interface User {
  id: string;
  nama: string;
  email: string;
  role: string;
  unit: string;
  status: string;
  passwordHash?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type WidgetKey =
  | 'totalAset'
  | 'nilaiAset'
  | 'kendaraan'
  | 'maintenance'
  | 'pengajuan'
  | 'proyek'
  | 'rka'
  | 'kpi'
  | 'kondisiAset'
  | 'kategoriAset'
  | 'rkaChart'
  | 'aktivitas';

export interface WidgetConfig {
  key: WidgetKey;
  label: string;
  visible: boolean;
}
