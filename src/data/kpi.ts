import type { KPI } from '@/types';

export const kpiSeed: KPI[] = [
  { id: 'kpi-001', kodeKPI: 'KPI-01', sasaranStrategis: 'Pemeliharaan Sarana Prasarana', indikator: 'Ketepatan pemeliharaan aset', target: 90, realisasi: 82, satuan: '%', status: 'On Track' },
  { id: 'kpi-002', kodeKPI: 'KPI-02', sasaranStrategis: 'Pelayanan Sarana Prasarana', indikator: 'Penyelesaian pengajuan sarpras', target: 85, realisasi: 78, satuan: '%', status: 'On Track' },
  { id: 'kpi-003', kodeKPI: 'KPI-03', sasaranStrategis: 'Ketersediaan Sarana Prasarana', indikator: 'Ketersediaan sarana prasarana', target: 95, realisasi: 96, satuan: '%', status: 'Tercapai' },
  { id: 'kpi-004', kodeKPI: 'KPI-04', sasaranStrategis: 'Pelaksanaan Program', indikator: 'Ketepatan pelaksanaan program', target: 80, realisasi: 65, satuan: '%', status: 'Perlu Perhatian' },
  { id: 'kpi-005', kodeKPI: 'KPI-05', sasaranStrategis: 'Manajemen Anggaran', indikator: 'Efisiensi penggunaan anggaran', target: 88, realisasi: 91, satuan: '%', status: 'Tercapai' },
];
