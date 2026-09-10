import { useMemo, useState, useEffect } from 'react';
import {
  Package, Wallet, Car, Wrench, FileText, FolderKanban, Target,
  TrendingUp, Plus, Search, Activity,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  RadialBarChart, RadialBar,
} from 'recharts';
import { useApp } from '@/hooks/useAppStore';
import { useRouter } from '@/hooks/useRouter';
import { PageHeader, Card, CardHeader, Button, Badge } from '@/components/ui';
import { statusBadge } from '@/components/ui/Badge';
import { formatRupiah, formatRupiahShort, calculatePercentage, formatRelativeTime } from '@/utils/format';
import type { WidgetKey } from '@/types';

const COLORS = {
  baik: '#10b981',
  rusakRingan: '#f59e0b',
  rusakBerat: '#ef4444',
  perawatan: '#3b82f6',
};

const CATEGORY_COLORS = ['#3366ff', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

export function DashboardPage() {
  const { aset, asetLoading, asetError, fetchAset, kendaraan, maintenance, pengajuan, proyek, rka, kpi, aktivitas, lastUpdated, widgets } = useApp();
  const { navigate } = useRouter();

  useEffect(() => {
    fetchAset();
  }, [fetchAset]);

  const stats = useMemo(() => {
    const totalAset = aset.reduce((s, a) => s + (!isNaN(a.jumlah) && a.jumlah > 0 ? a.jumlah : 0), 0);
    const totalKodeAset = aset.length;
    const validNilai = aset.filter(a => !isNaN(a.nilaiAset) && a.nilaiAset > 0);
    const nilaiAset = validNilai.reduce((s, a) => s + a.nilaiAset, 0);
    const asetTanpaNilai = aset.length - validNilai.length;
    const kendaraanAktif = kendaraan.filter(k => k.status !== 'Tidak Aktif').length;
    const maintenanceAktif = maintenance.filter(m => m.status === 'Menunggu' || m.status === 'Diproses').length;
    const pengajuanAktif = pengajuan.filter(p => p.status === 'Menunggu' || p.status === 'Diproses').length;
    const proyekBerjalan = proyek.filter(p => p.status === 'Berjalan').length;
    const totalRKA = rka.reduce((s, r) => s + r.anggaran, 0);
    const avgKPI = kpi.length > 0 ? Math.round(kpi.reduce((s, k) => s + (k.realisasi / k.target) * 100, 0) / kpi.length) : 0;

    const kondisiCount = {
      'Baik': aset.filter(a => a.kondisi === 'Baik').length,
      'Rusak Ringan': aset.filter(a => a.kondisi === 'Rusak Ringan').length,
      'Rusak Berat': aset.filter(a => a.kondisi === 'Rusak Berat').length,
      'Baik + Perawatan': aset.filter(a => a.kondisi === 'Baik + Perawatan').length,
    };

    const kategoriCount: Record<string, number> = {};
    aset.forEach(a => {
      kategoriCount[a.kategori] = (kategoriCount[a.kategori] || 0) + 1;
    });

    const lokasiCount: Record<string, number> = {};
    aset.forEach(a => {
      lokasiCount[a.lokasi] = (lokasiCount[a.lokasi] || 0) + 1;
    });

    return {
      totalAset, totalKodeAset, nilaiAset, asetTanpaNilai, kendaraanAktif, maintenanceAktif,
      pengajuanAktif, proyekBerjalan, totalRKA, avgKPI,
      kondisiCount, kategoriCount, lokasiCount,
    };
  }, [aset, kendaraan, maintenance, pengajuan, proyek, rka, kpi]);

  const kondisiData = [
    { name: 'Baik', value: stats.kondisiCount['Baik'], color: COLORS.baik },
    { name: 'Rusak Ringan', value: stats.kondisiCount['Rusak Ringan'], color: COLORS.rusakRingan },
    { name: 'Rusak Berat', value: stats.kondisiCount['Rusak Berat'], color: COLORS.rusakBerat },
    { name: 'Baik + Perawatan', value: stats.kondisiCount['Baik + Perawatan'], color: COLORS.perawatan },
  ];

  const kategoriData = Object.entries(stats.kategoriCount).map(([name, value]) => ({ name, value }));

  const rkaByCategory = useMemo(() => {
    const cats = ['Tanah', 'Kendaraan', 'Proyek Pembangunan', 'Jaringan Listrik', 'AC', 'Program Lainnya'];
    return cats.map(cat => ({
      name: cat,
      anggaran: rka.filter(r => r.kategori === cat).reduce((s, r) => s + r.anggaran, 0),
    })).filter(d => d.anggaran > 0);
  }, [rka]);

  const top5RKA = useMemo(() =>
    [...rka].sort((a, b) => b.anggaran - a.anggaran).slice(0, 5),
  [rka]);

  const kpiRadialData = [{ name: 'KPI', value: stats.avgKPI, fill: '#3366ff' }];

  const widgetMap: Record<WidgetKey, { kpi?: boolean; chart?: boolean }> = {
    totalAset: { kpi: true }, nilaiAset: { kpi: true }, kendaraan: { kpi: true },
    maintenance: { kpi: true }, pengajuan: { kpi: true }, proyek: { kpi: true },
    rka: { kpi: true }, kpi: { kpi: true },
    kondisiAset: { chart: true }, kategoriAset: { chart: true },
    rkaChart: { chart: true }, aktivitas: { chart: true },
  };

  const kpiWidgets = widgets.filter(w => w.visible && widgetMap[w.key]?.kpi);
  const chartWidgets = widgets.filter(w => w.visible && widgetMap[w.key]?.chart);

  const kpiConfig: Record<string, { label: string; value: string; sub: string; info?: string; icon: typeof Package; color: string; onClick?: () => void }> = {
    totalAset: { label: 'Total Aset', value: stats.totalAset.toLocaleString('id-ID'), sub: `${stats.totalKodeAset} kode aset`, icon: Package, color: 'brand', onClick: () => navigate('/inventaris') },
    nilaiAset: { label: 'Total Nilai Aset', value: formatRupiahShort(stats.nilaiAset), sub: formatRupiah(stats.nilaiAset), info: stats.asetTanpaNilai > 0 ? `${stats.asetTanpaNilai} aset belum memiliki nilai aset` : undefined, icon: Wallet, color: 'emerald', onClick: () => navigate('/inventaris') },
    kendaraan: { label: 'Kendaraan Operasional', value: String(stats.kendaraanAktif), sub: `${kendaraan.filter(k => k.status === 'Tersedia').length} tersedia`, icon: Car, color: 'blue', onClick: () => navigate('/kendaraan') },
    maintenance: { label: 'Maintenance Aktif', value: String(stats.maintenanceAktif), sub: `${maintenance.filter(m => m.prioritas === 'Urgent').length} urgent`, icon: Wrench, color: 'amber', onClick: () => navigate('/maintenance') },
    pengajuan: { label: 'Pengajuan Aktif', value: String(stats.pengajuanAktif), sub: `${pengajuan.filter(p => p.status === 'Menunggu').length} menunggu`, icon: FileText, color: 'pink', onClick: () => navigate('/pengajuan') },
    proyek: { label: 'Proyek Berjalan', value: String(stats.proyekBerjalan), sub: `${proyek.length} total proyek`, icon: FolderKanban, color: 'indigo', onClick: () => navigate('/proyek') },
    rka: { label: 'Total RKA', value: formatRupiahShort(stats.totalRKA), sub: `${rka.length} program`, icon: TrendingUp, color: 'teal', onClick: () => navigate('/rka') },
    kpi: { label: 'Achievement KPI', value: `${stats.avgKPI}%`, sub: `${kpi.length} indikator`, icon: Target, color: 'rose', onClick: () => navigate('/kpi') },
  };

  const colorClasses: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    pink: 'bg-pink-50 text-pink-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    teal: 'bg-teal-50 text-teal-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  const quickActions = [
    { label: 'Tambah Aset', icon: Plus, path: '/inventaris', color: 'bg-brand-600' },
    { label: 'Pengajuan Sarpras', icon: FileText, path: '/pengajuan', color: 'bg-emerald-600' },
    { label: 'Maintenance', icon: Wrench, path: '/maintenance', color: 'bg-amber-600' },
    { label: 'Booking Kendaraan', icon: Car, path: '/kendaraan', color: 'bg-blue-600' },
    { label: 'Tambah Proyek', icon: FolderKanban, path: '/proyek', color: 'bg-indigo-600' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard Sarana Prasarana"
        subtitle="Monitoring dan evaluasi pengelolaan sarana prasarana IDN"
        breadcrumb={['SPMS', 'Beranda', 'Dashboard']}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="brand">Periode: Agustus 2026</Badge>
            <Badge variant="warning">MODE PROTOTYPE</Badge>
          </div>
        }
      />

      {/* Last updated + quick actions */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">Last Updated: {formatRelativeTime(lastUpdated)}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-ink-200 text-xs font-semibold text-ink-700 hover:border-brand-300 hover:text-brand-600 hover:shadow-card-hover transition-all"
              >
                <span className={`w-5 h-5 rounded-md ${action.color} flex items-center justify-center text-white`}>
                  <Plus size={12} />
                </span>
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiWidgets.map(w => {
          const cfg = kpiConfig[w.key];
          if (!cfg) return null;
          const Icon = cfg.icon;
          return (
            <button
              key={w.key}
              onClick={cfg.onClick}
              className="text-left bg-white rounded-2xl border border-ink-100 shadow-card hover:shadow-card-hover hover:border-brand-200 transition-all p-5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorClasses[cfg.color]}`}>
                  <Icon size={20} />
                </div>
                <TrendingUp size={16} className="text-ink-300 group-hover:text-brand-400 transition-colors" />
              </div>
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide">{cfg.label}</p>
              <p className="text-2xl font-extrabold text-ink-900 mt-1 tracking-tight">{cfg.value}</p>
              <p className="text-xs text-ink-400 mt-1">{cfg.sub}</p>
              {cfg.info && <p className="text-[10px] text-amber-600 font-medium mt-0.5">{cfg.info}</p>}
            </button>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Kondisi Aset */}
        {chartWidgets.find(w => w.key === 'kondisiAset') && (
          <Card>
            <CardHeader title="Kondisi Aset" subtitle="Distribusi kondisi seluruh aset" />
            <div className="p-5">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={kondisiData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2}>
                      {kondisiData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-3">
                {kondisiData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-ink-600 font-medium">{d.name}</span>
                    </div>
                    <span className="text-ink-800 font-bold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Kategori Aset */}
        {chartWidgets.find(w => w.key === 'kategoriAset') && (
          <Card className="lg:col-span-2">
            <CardHeader title="Kategori Aset" subtitle="Jumlah aset per kategori" />
            <div className="p-5">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kategoriData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#667390' }} axisLine={{ stroke: '#d5d9e2' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#667390' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f6f7f9' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {kategoriData.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Charts row 2: RKA + KPI Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {chartWidgets.find(w => w.key === 'rkaChart') && (
          <Card className="lg:col-span-2">
            <CardHeader title="Anggaran RKA per Kategori" subtitle="Distribusi anggaran rencana" />
            <div className="p-5">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rkaByCategory} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#667390' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatRupiahShort(v)} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#667390' }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                    <Bar dataKey="anggaran" radius={[0, 6, 6, 0]} fill="#3366ff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        )}

        {/* KPI Ring */}
        <Card>
          <CardHeader title="KPI Achievement" subtitle="Rata-rata pencapaian KPI" />
          <div className="p-5 flex flex-col items-center">
            <div className="h-44 w-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={kpiRadialData} startAngle={90} endAngle={-270}>
                  <RadialBar background dataKey="value" cornerRadius={20} fill="#3366ff" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-ink-900">{stats.avgKPI}%</span>
                <span className="text-xs text-ink-400">Achievement</span>
              </div>
            </div>
            <div className="mt-4 w-full space-y-1.5">
              {kpi.slice(0, 3).map(k => (
                <div key={k.id} className="flex items-center justify-between text-xs">
                  <span className="text-ink-500 truncate pr-2">{k.indikator}</span>
                  <span className="font-bold text-ink-800">{calculatePercentage(k.realisasi, k.target)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Top 5 RKA + Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Top 5 Program Anggaran Terbesar" subtitle="Rencana Anggaran Kegiatan" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-ink-500 uppercase tracking-wide">Program</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-ink-500 uppercase tracking-wide">Anggaran</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-ink-500 uppercase tracking-wide">Realisasi</th>
                  <th className="text-center px-5 py-3 text-xs font-bold text-ink-500 uppercase tracking-wide">%</th>
                </tr>
              </thead>
              <tbody>
                {top5RKA.map(r => {
                  const pct = calculatePercentage(r.realisasi, r.anggaran);
                  return (
                    <tr key={r.id} className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-ink-800 line-clamp-1">{r.namaProgram}</p>
                        <p className="text-xs text-ink-400">{r.kategori}</p>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-ink-800 whitespace-nowrap">{formatRupiah(r.anggaran)}</td>
                      <td className="px-5 py-3 text-right text-ink-600 whitespace-nowrap">
                        <span className="text-[10px] text-amber-600 font-semibold mr-1">DATA SIMULASI</span>
                        {formatRupiah(r.realisasi)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-ink-700 w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Aktivitas */}
        {chartWidgets.find(w => w.key === 'aktivitas') && (
          <Card>
            <CardHeader title="Aktivitas Terbaru" subtitle="Log aktivitas sistem" />
            <div className="p-5 space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
              {aktivitas.slice(0, 8).map(a => {
                const iconBg = {
                  aset: 'bg-brand-50 text-brand-600',
                  maintenance: 'bg-amber-50 text-amber-600',
                  pengajuan: 'bg-pink-50 text-pink-600',
                  rka: 'bg-teal-50 text-teal-600',
                  proyek: 'bg-indigo-50 text-indigo-600',
                  kendaraan: 'bg-blue-50 text-blue-600',
                  kpi: 'bg-rose-50 text-rose-600',
                }[a.jenis];
                return (
                  <div key={a.id} className="flex gap-3">
                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                      <Activity size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ink-800">{a.aksi}</p>
                      <p className="text-xs text-ink-500 line-clamp-2">{a.deskripsi}</p>
                      <p className="text-[10px] text-ink-400 mt-0.5">{a.waktu}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Distribusi Lokasi */}
      <Card className="mb-6">
        <CardHeader title="Distribusi Aset berdasarkan Lokasi" subtitle="Sebaran aset di seluruh unit IDN" />
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(stats.lokasiCount).map(([lokasi, count], i) => (
              <div key={lokasi} className="bg-ink-50/50 rounded-xl p-4 border border-ink-100">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}20`, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}>
                  <Package size={16} />
                </div>
                <p className="text-xs text-ink-500 font-medium line-clamp-2">{lokasi}</p>
                <p className="text-xl font-extrabold text-ink-900 mt-1">{count}</p>
                <p className="text-[10px] text-ink-400">unit aset</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
