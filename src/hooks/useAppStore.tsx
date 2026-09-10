import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type {
  Aset, Kendaraan, Maintenance, Pengajuan, Proyek, RKA, KPI, SOP, Aktivitas, WidgetConfig,
} from '@/types';
import { asetSeed } from '@/data/assets';
import { kendaraanSeed } from '@/data/vehicles';
import { maintenanceSeed } from '@/data/maintenance';
import { pengajuanSeed } from '@/data/pengajuan';
import { proyekSeed } from '@/data/projects';
import { rkaSeed } from '@/data/rka';
import { kpiSeed } from '@/data/kpi';
import { sopSeed } from '@/data/sop';
import { aktivitasSeed } from '@/data/activities';
import { generateId } from '@/utils/format';
import { getAssets, createAsset, updateAsset, deleteAsset } from '@/api/assets';
import { getMasterData } from '@/api/masterData';
import type { MasterData } from '@/api/masterData';

interface ToastMsg { id: string; message: string; type: 'success' | 'error' | 'info'; }

interface AppState {
  aset: Aset[];
  asetLoading: boolean;
  asetError: string | null;
  asetSource: 'api' | 'seed' | null;
  asetSaving: boolean;
  fetchAset: () => Promise<void>;
  masterData: MasterData | null;
  masterDataLoading: boolean;
  masterDataError: string | null;
  fetchMasterData: () => Promise<void>;
  kendaraan: Kendaraan[];
  maintenance: Maintenance[];
  pengajuan: Pengajuan[];
  proyek: Proyek[];
  rka: RKA[];
  kpi: KPI[];
  sop: SOP[];
  aktivitas: Aktivitas[];
  lastUpdated: number;
  toasts: ToastMsg[];
  widgets: WidgetConfig[];
  // CRUD generic
  addAset: (a: Omit<Aset, 'id'>) => Promise<string | null>;
  updateAset: (id: string, a: Omit<Aset, 'id'>) => Promise<string | null>;
  deleteAset: (id: string) => Promise<string | null>;
  addKendaraan: (k: Omit<Kendaraan, 'id'>) => void;
  updateKendaraan: (id: string, k: Partial<Kendaraan>) => void;
  deleteKendaraan: (id: string) => void;
  addMaintenance: (m: Omit<Maintenance, 'id'>) => void;
  updateMaintenance: (id: string, m: Partial<Maintenance>) => void;
  deleteMaintenance: (id: string) => void;
  addPengajuan: (p: Omit<Pengajuan, 'id'>) => void;
  updatePengajuan: (id: string, p: Partial<Pengajuan>) => void;
  deletePengajuan: (id: string) => void;
  addProyek: (p: Omit<Proyek, 'id'>) => void;
  updateProyek: (id: string, p: Partial<Proyek>) => void;
  deleteProyek: (id: string) => void;
  addRKA: (r: Omit<RKA, 'id'>) => void;
  updateRKA: (id: string, r: Partial<RKA>) => void;
  deleteRKA: (id: string) => void;
  addKPI: (k: Omit<KPI, 'id'>) => void;
  updateKPI: (id: string, k: Partial<KPI>) => void;
  deleteKPI: (id: string) => void;
  addSOP: (s: Omit<SOP, 'id'>) => void;
  updateSOP: (id: string, s: Partial<SOP>) => void;
  deleteSOP: (id: string) => void;
  resetData: () => void;
  pushToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  toggleWidget: (key: string) => void;
  reorderWidgets: (widgets: WidgetConfig[]) => void;
}

const defaultWidgets: WidgetConfig[] = [
  { key: 'totalAset', label: 'Total Aset', visible: true },
  { key: 'nilaiAset', label: 'Total Nilai Aset', visible: true },
  { key: 'kendaraan', label: 'Kendaraan Operasional', visible: true },
  { key: 'maintenance', label: 'Maintenance Aktif', visible: true },
  { key: 'pengajuan', label: 'Pengajuan Aktif', visible: true },
  { key: 'proyek', label: 'Proyek Berjalan', visible: true },
  { key: 'rka', label: 'Total RKA', visible: true },
  { key: 'kpi', label: 'Achievement KPI', visible: true },
  { key: 'kondisiAset', label: 'Kondisi Aset', visible: true },
  { key: 'kategoriAset', label: 'Kategori Aset', visible: true },
  { key: 'rkaChart', label: 'RKA Chart', visible: true },
  { key: 'aktivitas', label: 'Aktivitas Terbaru', visible: true },
];

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [aset, setAset] = useState<Aset[]>(asetSeed);
  const [asetLoading, setAsetLoading] = useState<boolean>(false);
  const [asetError, setAsetError] = useState<string | null>(null);
  const [asetSource, setAsetSource] = useState<'api' | 'seed' | null>(null);
  const [asetSaving, setAsetSaving] = useState<boolean>(false);
  const [masterData, setMasterData] = useState<MasterData | null>(null);
  const [masterDataLoading, setMasterDataLoading] = useState<boolean>(false);
  const [masterDataError, setMasterDataError] = useState<string | null>(null);
  const [kendaraan, setKendaraan] = useState<Kendaraan[]>(kendaraanSeed);
  const [maintenance, setMaintenance] = useState<Maintenance[]>(maintenanceSeed);
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>(pengajuanSeed);
  const [proyek, setProyek] = useState<Proyek[]>(proyekSeed);
  const [rka, setRka] = useState<RKA[]>(rkaSeed);
  const [kpi, setKpi] = useState<KPI[]>(kpiSeed);
  const [sop, setSop] = useState<SOP[]>(sopSeed);
  const [aktivitas, setAktivitas] = useState<Aktivitas[]>(aktivitasSeed);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaultWidgets);

  const pushAktivitas = useCallback((jenis: Aktivitas['jenis'], aksi: string, deskripsi: string) => {
    const newAct: Aktivitas = {
      id: generateId('act'),
      jenis, aksi, deskripsi,
      waktu: 'Baru saja',
      timestamp: Date.now(),
    };
    setAktivitas(prev => [newAct, ...prev].slice(0, 30));
  }, []);

  const touch = useCallback(() => setLastUpdated(Date.now()), []);

  const fetchAset = useCallback(async () => {
    setAsetLoading(true);
    setAsetError(null);
    try {
      const data = await getAssets();
      if (data && data.length > 0) {
        setAset(data);
        setAsetSource('api');
      } else {
        setAset(asetSeed);
        setAsetSource('seed');
      }
    } catch (err) {
      setAsetError(err instanceof Error ? err.message : 'Gagal terhubung ke server');
      setAset(asetSeed);
      setAsetSource('seed');
    } finally {
      setAsetLoading(false);
    }
  }, []);

  const pushToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = generateId('toast');
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const fetchMasterData = useCallback(async () => {
    setMasterDataLoading(true);
    setMasterDataError(null);
    try {
      const data = await getMasterData();
      setMasterData(data);
    } catch (err) {
      setMasterDataError(err instanceof Error ? err.message : 'Gagal memuat data pilihan');
    } finally {
      setMasterDataLoading(false);
    }
  }, []);

  const addAset = useCallback(async (a: Omit<Aset, 'id'>): Promise<string | null> => {
    setAsetSaving(true);
    try {
      await createAsset(a);
      pushAktivitas('aset', 'Aset ditambahkan', `${a.namaAset} ditambahkan ke inventaris`);
      touch();
      await fetchAset();
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : 'Gagal menyimpan ke server';
    } finally {
      setAsetSaving(false);
    }
  }, [pushAktivitas, touch, fetchAset]);

  const updateAset = useCallback(async (id: string, a: Omit<Aset, 'id'>): Promise<string | null> => {
    if (!id) {
      return 'Aset ini tidak memiliki ID dari server. Data yang dimasukkan manual ke Google Sheets tidak dapat diperbarui dari aplikasi.';
    }
    setAsetSaving(true);
    try {
      await updateAsset(id, a);
      pushAktivitas('aset', 'Aset diperbarui', `Data aset diperbarui`);
      touch();
      await fetchAset();
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : 'Gagal memperbarui aset';
    } finally {
      setAsetSaving(false);
    }
  }, [pushAktivitas, touch, fetchAset]);

  const deleteAset = useCallback(async (id: string): Promise<string | null> => {
    setAsetSaving(true);
    try {
      await deleteAsset(id);
      pushAktivitas('aset', 'Aset dihapus', `Aset dihapus dari inventaris`);
      touch();
      await fetchAset();
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : 'Gagal menghapus aset';
    } finally {
      setAsetSaving(false);
    }
  }, [pushAktivitas, touch, fetchAset]);

  const addKendaraan = useCallback((k: Omit<Kendaraan, 'id'>) => {
    setKendaraan(prev => [{ ...k, id: generateId('ken') }, ...prev]);
    pushAktivitas('kendaraan', 'Kendaraan ditambahkan', `${k.namaKendaraan} ditambahkan`);
    touch();
  }, [pushAktivitas, touch]);

  const updateKendaraan = useCallback((id: string, k: Partial<Kendaraan>) => {
    setKendaraan(prev => prev.map(item => item.id === id ? { ...item, ...k } : item));
    pushAktivitas('kendaraan', 'Kendaraan diperbarui', `Data kendaraan diperbarui`);
    touch();
  }, [pushAktivitas, touch]);

  const deleteKendaraan = useCallback((id: string) => {
    setKendaraan(prev => prev.filter(item => item.id !== id));
    pushAktivitas('kendaraan', 'Kendaraan dihapus', `Kendaraan dihapus`);
    touch();
  }, [pushAktivitas, touch]);

  const addMaintenance = useCallback((m: Omit<Maintenance, 'id'>) => {
    setMaintenance(prev => [{ ...m, id: generateId('mnt') }, ...prev]);
    pushAktivitas('maintenance', 'Maintenance ditambahkan', `Maintenance ${m.aset} ditambahkan`);
    touch();
  }, [pushAktivitas, touch]);

  const updateMaintenance = useCallback((id: string, m: Partial<Maintenance>) => {
    setMaintenance(prev => prev.map(item => item.id === id ? { ...item, ...m } : item));
    pushAktivitas('maintenance', 'Maintenance diperbarui', `Maintenance diperbarui`);
    touch();
  }, [pushAktivitas, touch]);

  const deleteMaintenance = useCallback((id: string) => {
    setMaintenance(prev => prev.filter(item => item.id !== id));
    pushAktivitas('maintenance', 'Maintenance dihapus', `Maintenance dihapus`);
    touch();
  }, [pushAktivitas, touch]);

  const addPengajuan = useCallback((p: Omit<Pengajuan, 'id'>) => {
    setPengajuan(prev => [{ ...p, id: generateId('pgj') }, ...prev]);
    pushAktivitas('pengajuan', 'Pengajuan baru', `Pengajuan dari ${p.pemohon}`);
    touch();
  }, [pushAktivitas, touch]);

  const updatePengajuan = useCallback((id: string, p: Partial<Pengajuan>) => {
    setPengajuan(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
    pushAktivitas('pengajuan', 'Pengajuan diperbarui', `Pengajuan diperbarui`);
    touch();
  }, [pushAktivitas, touch]);

  const deletePengajuan = useCallback((id: string) => {
    setPengajuan(prev => prev.filter(item => item.id !== id));
    pushAktivitas('pengajuan', 'Pengajuan dihapus', `Pengajuan dihapus`);
    touch();
  }, [pushAktivitas, touch]);

  const addProyek = useCallback((p: Omit<Proyek, 'id'>) => {
    setProyek(prev => [{ ...p, id: generateId('prj') }, ...prev]);
    pushAktivitas('proyek', 'Proyek ditambahkan', `Proyek ${p.namaProyek} ditambahkan`);
    touch();
  }, [pushAktivitas, touch]);

  const updateProyek = useCallback((id: string, p: Partial<Proyek>) => {
    setProyek(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
    pushAktivitas('proyek', 'Progress proyek diperbarui', `Proyek diperbarui`);
    touch();
  }, [pushAktivitas, touch]);

  const deleteProyek = useCallback((id: string) => {
    setProyek(prev => prev.filter(item => item.id !== id));
    pushAktivitas('proyek', 'Proyek dihapus', `Proyek dihapus`);
    touch();
  }, [pushAktivitas, touch]);

  const addRKA = useCallback((r: Omit<RKA, 'id'>) => {
    setRka(prev => [{ ...r, id: generateId('rka') }, ...prev]);
    pushAktivitas('rka', 'RKA ditambahkan', `RKA ${r.namaProgram} ditambahkan`);
    touch();
  }, [pushAktivitas, touch]);

  const updateRKA = useCallback((id: string, r: Partial<RKA>) => {
    setRka(prev => prev.map(item => item.id === id ? { ...item, ...r } : item));
    pushAktivitas('rka', 'RKA diperbarui', `RKA diperbarui`);
    touch();
  }, [pushAktivitas, touch]);

  const deleteRKA = useCallback((id: string) => {
    setRka(prev => prev.filter(item => item.id !== id));
    pushAktivitas('rka', 'RKA dihapus', `RKA dihapus`);
    touch();
  }, [pushAktivitas, touch]);

  const addKPI = useCallback((k: Omit<KPI, 'id'>) => {
    setKpi(prev => [{ ...k, id: generateId('kpi') }, ...prev]);
    touch();
  }, [touch]);

  const updateKPI = useCallback((id: string, k: Partial<KPI>) => {
    setKpi(prev => prev.map(item => item.id === id ? { ...item, ...k } : item));
    touch();
  }, [touch]);

  const deleteKPI = useCallback((id: string) => {
    setKpi(prev => prev.filter(item => item.id !== id));
    touch();
  }, [touch]);

  const addSOP = useCallback((s: Omit<SOP, 'id'>) => {
    setSop(prev => [{ ...s, id: generateId('sop') }, ...prev]);
    touch();
  }, [touch]);

  const updateSOP = useCallback((id: string, s: Partial<SOP>) => {
    setSop(prev => prev.map(item => item.id === id ? { ...item, ...s } : item));
    touch();
  }, [touch]);

  const deleteSOP = useCallback((id: string) => {
    setSop(prev => prev.filter(item => item.id !== id));
    touch();
  }, [touch]);

  const resetData = useCallback(() => {
    setAset(asetSeed);
    setKendaraan(kendaraanSeed);
    setMaintenance(maintenanceSeed);
    setPengajuan(pengajuanSeed);
    setProyek(proyekSeed);
    setRka(rkaSeed);
    setKpi(kpiSeed);
    setSop(sopSeed);
    setAktivitas(aktivitasSeed);
    setWidgets(defaultWidgets);
    touch();
  }, [touch]);

  const toggleWidget = useCallback((key: string) => {
    setWidgets(prev => prev.map(w => w.key === key ? { ...w, visible: !w.visible } : w));
  }, []);

  const reorderWidgets = useCallback((newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets);
  }, []);

  const value: AppState = {
    aset, asetLoading, asetError, asetSource, asetSaving, fetchAset,
    masterData, masterDataLoading, masterDataError, fetchMasterData,
    kendaraan, maintenance, pengajuan, proyek, rka, kpi, sop, aktivitas,
    lastUpdated, toasts, widgets,
    addAset, updateAset, deleteAset,
    addKendaraan, updateKendaraan, deleteKendaraan,
    addMaintenance, updateMaintenance, deleteMaintenance,
    addPengajuan, updatePengajuan, deletePengajuan,
    addProyek, updateProyek, deleteProyek,
    addRKA, updateRKA, deleteRKA,
    addKPI, updateKPI, deleteKPI,
    addSOP, updateSOP, deleteSOP,
    resetData, pushToast, removeToast, toggleWidget, reorderWidgets,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
