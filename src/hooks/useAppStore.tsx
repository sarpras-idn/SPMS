import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type {
  Aset,
  Kendaraan,
  Maintenance,
  Pengajuan,
  Proyek,
  RKA,
  KPI,
  SOP,
  Aktivitas,
  WidgetConfig,
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

import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from '@/api/assets';

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '@/api/vehicles';

import {
  getDrivers,
  createDriver,
  updateDriver as updateDriverApi,
  deleteDriver as deleteDriverApi,
} from '@/api/drivers';

import type { Driver } from '@/api/drivers';

import { getMasterData } from '@/api/masterData';
import type { MasterData } from '@/api/masterData';

import {
  getBranches,
  getAreas,
  getBuildings,
  getFloors,
  getRooms,
} from '@/api/locations';

import type {
  Branch,
  Area,
  Building,
  Floor,
  Room,
} from '@/api/locations';

interface ToastMsg {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

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

  branches: Branch[];
  areas: Area[];
  buildings: Building[];
  floors: Floor[];
  rooms: Room[];

  locationsLoading: boolean;
  locationsError: string | null;
  fetchLocations: () => Promise<void>;

  kendaraan: Kendaraan[];
  kendaraanLoading: boolean;
  kendaraanError: string | null;
  kendaraanSaving: boolean;
  fetchKendaraan: () => Promise<void>;

  drivers: Driver[];
  driversLoading: boolean;
  driversError: string | null;
  driversSaving: boolean;
  fetchDrivers: () => Promise<void>;

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

  addAset: (a: Omit<Aset, 'id'>) => Promise<string | null>;
  updateAset: (id: string, a: Omit<Aset, 'id'>) => Promise<string | null>;
  deleteAset: (id: string) => Promise<string | null>;

  addKendaraan: (
    k: Omit<Kendaraan, 'id' | 'kodeKendaraan'>
  ) => Promise<string | null>;

  updateKendaraan: (
    id: string,
    k: Partial<Kendaraan>
  ) => Promise<string | null>;

  deleteKendaraan: (
    id: string
  ) => Promise<string | null>;

  addDriver: (
    d: Omit<Driver, 'id' | 'kodeSupir'>
  ) => Promise<string | null>;

  updateDriver: (
    id: string,
    d: Partial<Driver>
  ) => Promise<string | null>;

  deleteDriver: (
    id: string
  ) => Promise<string | null>;

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

  pushToast: (
    message: string,
    type?: 'success' | 'error' | 'info'
  ) => void;

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

  const [branches, setBranches] = useState<Branch[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [locationsLoading, setLocationsLoading] = useState<boolean>(false);
  const [locationsError, setLocationsError] = useState<string | null>(null);

  const [kendaraan, setKendaraan] = useState<Kendaraan[]>([]);
  const [kendaraanLoading, setKendaraanLoading] = useState<boolean>(false);
  const [kendaraanError, setKendaraanError] = useState<string | null>(null);
  const [kendaraanSaving, setKendaraanSaving] = useState<boolean>(false);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driversLoading, setDriversLoading] = useState<boolean>(false);
  const [driversError, setDriversError] = useState<string | null>(null);
  const [driversSaving, setDriversSaving] = useState<boolean>(false);

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

  const pushAktivitas = useCallback(
    (
      jenis: Aktivitas['jenis'],
      aksi: string,
      deskripsi: string
    ) => {
      const newAct: Aktivitas = {
        id: generateId('act'),
        jenis,
        aksi,
        deskripsi,
        waktu: 'Baru saja',
        timestamp: Date.now(),
      };

      setAktivitas(prev => [newAct, ...prev].slice(0, 30));
    },
    []
  );

  const touch = useCallback(
    () => setLastUpdated(Date.now()),
    []
  );

  // =========================================================
  // INVENTARIS - DATA DARI GOOGLE SHEETS
  // =========================================================

  const fetchAset = useCallback(async () => {
    setAsetLoading(true);
    setAsetError(null);

    try {
      const data = await getAssets();

      setAset(data || []);
      setAsetSource('api');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal terhubung ke server';

      setAsetError(errorMessage);
      setAset([]);
      setAsetSource(null);
    } finally {
      setAsetLoading(false);
    }
  }, []);

  // =========================================================
  // MASTER DATA
  // =========================================================

  const fetchMasterData = useCallback(async () => {
    setMasterDataLoading(true);
    setMasterDataError(null);

    try {
      const data = await getMasterData();
      setMasterData(data);
    } catch (err) {
      setMasterDataError(
        err instanceof Error
          ? err.message
          : 'Gagal memuat data pilihan'
      );
    } finally {
      setMasterDataLoading(false);
    }
  }, []);

  // =========================================================
  // MASTER LOKASI
  // =========================================================

  const fetchLocations = useCallback(async () => {
    setLocationsLoading(true);
    setLocationsError(null);

    try {
      const [
        branchData,
        areaData,
        buildingData,
        floorData,
        roomData,
      ] = await Promise.all([
        getBranches(),
        getAreas(),
        getBuildings(),
        getFloors(),
        getRooms(),
      ]);

      setBranches(branchData);
      setAreas(areaData);
      setBuildings(buildingData);
      setFloors(floorData);
      setRooms(roomData);
    } catch (err) {
      setLocationsError(
        err instanceof Error
          ? err.message
          : 'Gagal memuat master lokasi'
      );
    } finally {
      setLocationsLoading(false);
    }
  }, []);

  // =========================================================
  // INVENTARIS CRUD
  // =========================================================

  const addAset = useCallback(
    async (a: Omit<Aset, 'id'>): Promise<string | null> => {
      setAsetSaving(true);

      try {
        await createAsset(a);

        pushAktivitas(
          'aset',
          'Aset ditambahkan',
          `${a.namaAset} ditambahkan ke inventaris`
        );

        touch();
        await fetchAset();

        return null;
      } catch (err) {
        return err instanceof Error
          ? err.message
          : 'Gagal menyimpan ke server';
      } finally {
        setAsetSaving(false);
      }
    },
    [pushAktivitas, touch, fetchAset]
  );

  const updateAset = useCallback(
    async (
      id: string,
      a: Omit<Aset, 'id'>
    ): Promise<string | null> => {
      if (!id) {
        return 'Aset ini tidak memiliki ID dari server. Data yang dimasukkan manual ke Google Sheets tidak dapat diperbarui dari aplikasi.';
      }

      setAsetSaving(true);

      try {
        await updateAsset(id, a);

        pushAktivitas(
          'aset',
          'Aset diperbarui',
          `Data aset diperbarui`
        );

        touch();
        await fetchAset();

        return null;
      } catch (err) {
        return err instanceof Error
          ? err.message
          : 'Gagal memperbarui aset';
      } finally {
        setAsetSaving(false);
      }
    },
    [pushAktivitas, touch, fetchAset]
  );

  const deleteAset = useCallback(
    async (id: string): Promise<string | null> => {
      setAsetSaving(true);

      try {
        await deleteAsset(id);

        pushAktivitas(
          'aset',
          'Aset dihapus',
          `Aset dihapus dari inventaris`
        );

        touch();
        await fetchAset();

        return null;
      } catch (err) {
        return err instanceof Error
          ? err.message
          : 'Gagal menghapus aset';
      } finally {
        setAsetSaving(false);
      }
    },
    [pushAktivitas, touch, fetchAset]
  );

  // =========================================================
  // KENDARAAN - DATA DARI GOOGLE SHEETS
  // =========================================================

  const fetchKendaraan = useCallback(async () => {
    setKendaraanLoading(true);
    setKendaraanError(null);

    try {
      const data = await getVehicles();
      setKendaraan(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal terhubung ke server';

      setKendaraanError(errorMessage);
      setKendaraan([]);
    } finally {
      setKendaraanLoading(false);
    }
  }, []);

  const addKendaraan = useCallback(
    async (
      k: Omit<Kendaraan, 'id' | 'kodeKendaraan'>
    ): Promise<string | null> => {
      setKendaraanSaving(true);

      try {
        await createVehicle(k);

        pushAktivitas(
          'kendaraan',
          'Kendaraan ditambahkan',
          `${k.namaKendaraan} ditambahkan`
        );

        touch();
        await fetchKendaraan();

        return null;
      } catch (err) {
        return err instanceof Error
          ? err.message
          : 'Gagal menyimpan kendaraan ke server';
      } finally {
        setKendaraanSaving(false);
      }
    },
    [pushAktivitas, touch, fetchKendaraan]
  );

  const updateKendaraan = useCallback(
    async (
      id: string,
      k: Partial<Kendaraan>
    ): Promise<string | null> => {
      if (!id) {
        return 'Kendaraan ini tidak memiliki ID dari server.';
      }

      setKendaraanSaving(true);

      try {
        const current = kendaraan.find(
          item => item.id === id
        );

        if (!current) {
          return 'Data kendaraan tidak ditemukan.';
        }

        await updateVehicle({
          ...current,
          ...k,
          id,
        });

        pushAktivitas(
          'kendaraan',
          'Kendaraan diperbarui',
          'Data kendaraan diperbarui'
        );

        touch();
        await fetchKendaraan();

        return null;
      } catch (err) {
        return err instanceof Error
          ? err.message
          : 'Gagal memperbarui kendaraan';
      } finally {
        setKendaraanSaving(false);
      }
    },
    [kendaraan, pushAktivitas, touch, fetchKendaraan]
  );

  const deleteKendaraan = useCallback(
    async (
      id: string
    ): Promise<string | null> => {
      if (!id) {
        return 'Kendaraan ini tidak memiliki ID dari server.';
      }

      setKendaraanSaving(true);

      try {
        await deleteVehicle(id);

        pushAktivitas(
          'kendaraan',
          'Kendaraan dihapus',
          'Kendaraan dihapus'
        );

        touch();
        await fetchKendaraan();

        return null;
      } catch (err) {
        return err instanceof Error
          ? err.message
          : 'Gagal menghapus kendaraan';
      } finally {
        setKendaraanSaving(false);
      }
    },
    [pushAktivitas, touch, fetchKendaraan]
  );

  // =========================================================
  // SUPIR - DATA DARI GOOGLE SHEETS
  // =========================================================

  const fetchDrivers = useCallback(async () => {
    setDriversLoading(true);
    setDriversError(null);

    try {
      const data = await getDrivers();
      setDrivers(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal terhubung ke server';

      setDriversError(errorMessage);
      setDrivers([]);
    } finally {
      setDriversLoading(false);
    }
  }, []);

  const addDriver = useCallback(
    async (
      d: Omit<Driver, 'id' | 'kodeSupir'>
    ): Promise<string | null> => {
      setDriversSaving(true);

      try {
        await createDriver(d);

        pushAktivitas(
          'kendaraan',
          'Supir ditambahkan',
          `${d.namaSupir} ditambahkan`
        );

        touch();
        await fetchDrivers();

        return null;
      } catch (err) {
        return err instanceof Error
          ? err.message
          : 'Gagal menyimpan supir ke server';
      } finally {
        setDriversSaving(false);
      }
    },
    [pushAktivitas, touch, fetchDrivers]
  );

  const updateDriver = useCallback(
    async (
      id: string,
      d: Partial<Driver>
    ): Promise<string | null> => {
      if (!id) {
        return 'Supir ini tidak memiliki ID dari server.';
      }

      setDriversSaving(true);

      try {
        const current = drivers.find(
          item => item.id === id
        );

        if (!current) {
          return 'Data supir tidak ditemukan.';
        }

        await updateDriverApi({
          ...current,
          ...d,
          id,
        });

        pushAktivitas(
          'kendaraan',
          'Supir diperbarui',
          'Data supir diperbarui'
        );

        touch();
        await fetchDrivers();

        return null;
      } catch (err) {
        return err instanceof Error
          ? err.message
          : 'Gagal memperbarui supir';
      } finally {
        setDriversSaving(false);
      }
    },
    [drivers, pushAktivitas, touch, fetchDrivers]
  );

  const deleteDriver = useCallback(
    async (
      id: string
    ): Promise<string | null> => {
      if (!id) {
        return 'Supir ini tidak memiliki ID dari server.';
      }

      setDriversSaving(true);

      try {
        await deleteDriverApi(id);

        pushAktivitas(
          'kendaraan',
          'Supir dihapus',
          'Supir dihapus'
        );

        touch();
        await fetchDrivers();

        return null;
      } catch (err) {
        return err instanceof Error
          ? err.message
          : 'Gagal menghapus supir';
      } finally {
        setDriversSaving(false);
      }
    },
    [pushAktivitas, touch, fetchDrivers]
  );

  // =========================================================
  // MAINTENANCE
  // =========================================================

  const addMaintenance = useCallback(
    (m: Omit<Maintenance, 'id'>) => {
      setMaintenance(prev => [
        { ...m, id: generateId('mnt') },
        ...prev,
      ]);

      pushAktivitas(
        'maintenance',
        'Maintenance ditambahkan',
        `Maintenance ${m.aset} ditambahkan`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  const updateMaintenance = useCallback(
    (id: string, m: Partial<Maintenance>) => {
      setMaintenance(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ...m }
            : item
        )
      );

      pushAktivitas(
        'maintenance',
        'Maintenance diperbarui',
        `Maintenance diperbarui`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  const deleteMaintenance = useCallback(
    (id: string) => {
      setMaintenance(prev =>
        prev.filter(item => item.id !== id)
      );

      pushAktivitas(
        'maintenance',
        'Maintenance dihapus',
        `Maintenance dihapus`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  // =========================================================
  // PENGAJUAN
  // =========================================================

  const addPengajuan = useCallback(
    (p: Omit<Pengajuan, 'id'>) => {
      setPengajuan(prev => [
        { ...p, id: generateId('pgj') },
        ...prev,
      ]);

      pushAktivitas(
        'pengajuan',
        'Pengajuan baru',
        `Pengajuan dari ${p.pemohon}`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  const updatePengajuan = useCallback(
    (id: string, p: Partial<Pengajuan>) => {
      setPengajuan(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ...p }
            : item
        )
      );

      pushAktivitas(
        'pengajuan',
        'Pengajuan diperbarui',
        `Pengajuan diperbarui`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  const deletePengajuan = useCallback(
    (id: string) => {
      setPengajuan(prev =>
        prev.filter(item => item.id !== id)
      );

      pushAktivitas(
        'pengajuan',
        'Pengajuan dihapus',
        `Pengajuan dihapus`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  // =========================================================
  // PROYEK
  // =========================================================

  const addProyek = useCallback(
    (p: Omit<Proyek, 'id'>) => {
      setProyek(prev => [
        { ...p, id: generateId('prj') },
        ...prev,
      ]);

      pushAktivitas(
        'proyek',
        'Proyek ditambahkan',
        `Proyek ${p.namaProyek} ditambahkan`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  const updateProyek = useCallback(
    (id: string, p: Partial<Proyek>) => {
      setProyek(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ...p }
            : item
        )
      );

      pushAktivitas(
        'proyek',
        'Progress proyek diperbarui',
        `Proyek diperbarui`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  const deleteProyek = useCallback(
    (id: string) => {
      setProyek(prev =>
        prev.filter(item => item.id !== id)
      );

      pushAktivitas(
        'proyek',
        'Proyek dihapus',
        `Proyek dihapus`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  // =========================================================
  // RKA
  // =========================================================

  const addRKA = useCallback(
    (r: Omit<RKA, 'id'>) => {
      setRka(prev => [
        { ...r, id: generateId('rka') },
        ...prev,
      ]);

      pushAktivitas(
        'rka',
        'RKA ditambahkan',
        `RKA ${r.namaProgram} ditambahkan`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  const updateRKA = useCallback(
    (id: string, r: Partial<RKA>) => {
      setRka(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ...r }
            : item
        )
      );

      pushAktivitas(
        'rka',
        'RKA diperbarui',
        `RKA diperbarui`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  const deleteRKA = useCallback(
    (id: string) => {
      setRka(prev =>
        prev.filter(item => item.id !== id)
      );

      pushAktivitas(
        'rka',
        'RKA dihapus',
        `RKA dihapus`
      );

      touch();
    },
    [pushAktivitas, touch]
  );

  // =========================================================
  // KPI
  // =========================================================

  const addKPI = useCallback(
    (k: Omit<KPI, 'id'>) => {
      setKpi(prev => [
        { ...k, id: generateId('kpi') },
        ...prev,
      ]);

      touch();
    },
    [touch]
  );

  const updateKPI = useCallback(
    (id: string, k: Partial<KPI>) => {
      setKpi(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ...k }
            : item
        )
      );

      touch();
    },
    [touch]
  );

  const deleteKPI = useCallback(
    (id: string) => {
      setKpi(prev =>
        prev.filter(item => item.id !== id)
      );

      touch();
    },
    [touch]
  );

  // =========================================================
  // SOP
  // =========================================================

  const addSOP = useCallback(
    (s: Omit<SOP, 'id'>) => {
      setSop(prev => [
        { ...s, id: generateId('sop') },
        ...prev,
      ]);

      touch();
    },
    [touch]
  );

  const updateSOP = useCallback(
    (id: string, s: Partial<SOP>) => {
      setSop(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ...s }
            : item
        )
      );

      touch();
    },
    [touch]
  );

  const deleteSOP = useCallback(
    (id: string) => {
      setSop(prev =>
        prev.filter(item => item.id !== id)
      );

      touch();
    },
    [touch]
  );

  // =========================================================
  // RESET DATA
  // =========================================================

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

  // =========================================================
  // TOAST
  // =========================================================

  const pushToast = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'info' = 'success'
    ) => {
      const id = generateId('toast');

      setToasts(prev => [
        ...prev,
        { id, message, type },
      ]);

      setTimeout(() => {
        setToasts(prev =>
          prev.filter(t => t.id !== id)
        );
      }, 3500);
    },
    []
  );

  const removeToast = useCallback(
    (id: string) => {
      setToasts(prev =>
        prev.filter(t => t.id !== id)
      );
    },
    []
  );

  // =========================================================
  // WIDGET
  // =========================================================

  const toggleWidget = useCallback(
    (key: string) => {
      setWidgets(prev =>
        prev.map(w =>
          w.key === key
            ? { ...w, visible: !w.visible }
            : w
        )
      );
    },
    []
  );

  const reorderWidgets = useCallback(
    (newWidgets: WidgetConfig[]) => {
      setWidgets(newWidgets);
    },
    []
  );

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchAset();
    fetchMasterData();
    fetchKendaraan();
    fetchDrivers();
  }, [
    fetchAset,
    fetchMasterData,
    fetchKendaraan,
    fetchDrivers,
  ]);

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value: AppState = {
    aset,
    asetLoading,
    asetError,
    asetSource,
    asetSaving,
    fetchAset,

    masterData,
    masterDataLoading,
    masterDataError,
    fetchMasterData,

    branches,
    areas,
    buildings,
    floors,
    rooms,

    locationsLoading,
    locationsError,
    fetchLocations,

    kendaraan,
    kendaraanLoading,
    kendaraanError,
    kendaraanSaving,
    fetchKendaraan,

    drivers,
    driversLoading,
    driversError,
    driversSaving,
    fetchDrivers,

    maintenance,
    pengajuan,
    proyek,
    rka,
    kpi,
    sop,
    aktivitas,

    lastUpdated,
    toasts,
    widgets,

    addAset,
    updateAset,
    deleteAset,

    addKendaraan,
    updateKendaraan,
    deleteKendaraan,

    addDriver,
    updateDriver,
    deleteDriver,

    addMaintenance,
    updateMaintenance,
    deleteMaintenance,

    addPengajuan,
    updatePengajuan,
    deletePengajuan,

    addProyek,
    updateProyek,
    deleteProyek,

    addRKA,
    updateRKA,
    deleteRKA,

    addKPI,
    updateKPI,
    deleteKPI,

    addSOP,
    updateSOP,
    deleteSOP,

    resetData,
    pushToast,
    removeToast,
    toggleWidget,
    reorderWidgets,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }

  return ctx;
}