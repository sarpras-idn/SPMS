import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Target } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, CardHeader, Button, Input, Modal, ConfirmDialog, EmptyState } from '@/components/ui';
import { Badge, statusBadge } from '@/components/ui/Badge';
import { calculatePercentage } from '@/utils/format';
import type { KPI as KPIType, StatusKPI } from '@/types';

const statusOptions: StatusKPI[] = ['On Track', 'Perlu Perhatian', 'Tercapai', 'Belum Mulai'];

export function KPIPage() {
  const { kpi, addKPI, updateKPI, deleteKPI, pushToast } = useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<KPIType | null>(null);

  const filtered = useMemo(() => kpi.filter(k => {
    const matchSearch = !search || k.indikator.toLowerCase().includes(search.toLowerCase()) || k.kodeKPI.toLowerCase().includes(search.toLowerCase()) || k.sasaranStrategis.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  }), [kpi, search]);

  const avgAchievement = kpi.length > 0 ? Math.round(kpi.reduce((s, k) => s + calculatePercentage(k.realisasi, k.target), 0) / kpi.length) : 0;

  const handleSave = (data: Omit<KPIType, 'id'>) => {
    if (editing) updateKPI(editing.id, data);
    else addKPI(data);
    pushToast('Data berhasil disimpan.');
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader title="KPI — Key Performance Indicator" subtitle="Indikator kinerja Bidang Sarana Prasarana IDN"
        breadcrumb={['SPMS', 'Performance', 'KPI']}
        actions={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} /> Tambah KPI</Button>} />

      {/* Overall Achievement */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="h-40 w-40 relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: avgAchievement }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={20} fill="#3366ff" />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-ink-900">{avgAchievement}%</span>
              <span className="text-xs text-ink-400">Overall Achievement</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
            {kpi.map(k => {
              const pct = calculatePercentage(k.realisasi, k.target);
              const color = pct >= 100 ? '#10b981' : pct >= 75 ? '#3366ff' : pct >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <div key={k.id} className="bg-ink-50/50 rounded-xl p-4 border border-ink-100">
                  <div className="flex items-center justify-between mb-2">
                    <Target size={16} className="text-ink-400" />
                    <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                  </div>
                  <p className="text-xs font-semibold text-ink-800 line-clamp-2">{k.indikator}</p>
                  <div className="mt-2 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Search */}
      <Card className="mb-4 p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari KPI..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Kode</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Sasaran Strategis</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Indikator</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Target</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Realisasi</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Achievement</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><EmptyState message="Tidak ada data KPI" /></td></tr>
              ) : filtered.map(k => {
                const pct = calculatePercentage(k.realisasi, k.target);
                const statusBdg = statusBadge(k.status);
                const color = pct >= 100 ? 'bg-emerald-500' : pct >= 75 ? 'bg-brand-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
                return (
                  <tr key={k.id} className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-ink-600">{k.kodeKPI}</td>
                    <td className="px-4 py-3 text-ink-600 text-xs">{k.sasaranStrategis}</td>
                    <td className="px-4 py-3 font-semibold text-ink-800">{k.indikator}</td>
                    <td className="px-4 py-3 text-center text-ink-700">{k.target}{k.satuan}</td>
                    <td className="px-4 py-3 text-center text-ink-700">{k.realisasi}{k.satuan}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-16 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className="text-xs font-bold text-ink-700 w-8 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={statusBdg.variant}>{k.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setEditing(k); setModalOpen(true); }} className="p-1.5 rounded-lg text-ink-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Edit2 size={15} /></button>
                        <button onClick={() => setDeleteId(k.id)} className="p-1.5 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && <KPIForm editing={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteKPI(deleteId); pushToast('Data berhasil dihapus.'); } }}
        title="Hapus KPI" message="Apakah Anda yakin ingin menghapus data KPI ini?" confirmText="Hapus" />
    </div>
  );
}

function KPIForm({ editing, onClose, onSave }: { editing: KPIType | null; onClose: () => void; onSave: (d: Omit<KPIType, 'id'>) => void; }) {
  const [form, setForm] = useState<Omit<KPIType, 'id'>>({
    kodeKPI: editing?.kodeKPI || `KPI-${String(Date.now()).slice(-2)}`,
    sasaranStrategis: editing?.sasaranStrategis || '',
    indikator: editing?.indikator || '',
    target: editing?.target || 100,
    realisasi: editing?.realisasi || 0,
    satuan: editing?.satuan || '%',
    status: editing?.status || 'On Track',
  });
  const set = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={editing ? 'Edit KPI' : 'Tambah KPI'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Batal</Button><Button onClick={() => onSave(form)}>Simpan</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Kode KPI" value={form.kodeKPI} onChange={v => set('kodeKPI', v)} required />
        <Input label="Sasaran Strategis" value={form.sasaranStrategis} onChange={v => set('sasaranStrategis', v)} />
        <div className="col-span-2">
          <Input label="Indikator" value={form.indikator} onChange={v => set('indikator', v)} required />
        </div>
        <Input label="Target" type="number" value={form.target} onChange={v => set('target', Number(v))} />
        <Input label="Realisasi" type="number" value={form.realisasi} onChange={v => set('realisasi', Number(v))} />
        <Input label="Satuan" value={form.satuan} onChange={v => set('satuan', v)} />
        <Input label="Status" value={form.status} onChange={v => set('status', v as StatusKPI)} options={statusOptions} />
      </div>
    </Modal>
  );
}
