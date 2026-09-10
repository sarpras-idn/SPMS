import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, CardHeader, Button, Input, Modal, ConfirmDialog, EmptyState } from '@/components/ui';
import { Badge, statusBadge } from '@/components/ui/Badge';
import { formatRupiah, formatTanggalShort, calculatePercentage } from '@/utils/format';
import type { Proyek as PType, StatusProyek } from '@/types';

const statusOptions: StatusProyek[] = ['Perencanaan', 'Berjalan', 'Selesai', 'Ditunda'];

export function ProyekPage() {
  const { proyek, addProyek, updateProyek, deleteProyek, pushToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<PType | null>(null);

  const filtered = useMemo(() => proyek.filter(p => {
    const matchSearch = !search || p.namaProyek.toLowerCase().includes(search.toLowerCase()) || p.kodeProyek.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  }), [proyek, search, filterStatus]);

  const handleSave = (data: Omit<PType, 'id'>) => {
    if (editing) updateProyek(editing.id, data);
    else addProyek(data);
    pushToast('Data berhasil disimpan.');
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Proyek" subtitle="Manajemen proyek pembangunan dan pengadaan"
        breadcrumb={['SPMS', 'Program', 'Proyek']}
        actions={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} /> Tambah Proyek</Button>} />

      {/* Project Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {proyek.map(p => {
          const statusBdg = statusBadge(p.status);
          const pct = calculatePercentage(p.realisasi, p.anggaran);
          const barColor = p.progress >= 100 ? 'bg-emerald-500' : p.progress >= 50 ? 'bg-brand-500' : 'bg-amber-500';
          return (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xs text-ink-400">{p.kodeProyek}</p>
                  <h3 className="font-bold text-ink-900 mt-0.5">{p.namaProyek}</h3>
                </div>
                <Badge variant={statusBdg.variant}>{p.status}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
                <span>PIC: {p.pic}</span>
                <span>Target: {formatTanggalShort(p.targetSelesai)}</span>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-ink-500">Progress</span>
                  <span className="font-bold text-ink-800">{p.progress}%</span>
                </div>
                <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-ink-50">
                <div>
                  <p className="text-ink-400">Anggaran</p>
                  <p className="font-semibold text-ink-800">{formatRupiah(p.anggaran)}</p>
                </div>
                <div className="text-right">
                  <p className="text-ink-400">Realisasi ({pct}%)</p>
                  <p className="font-semibold text-ink-800">{formatRupiah(p.realisasi)}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari proyek..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Kode</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Nama Proyek</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">PIC</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-ink-500 uppercase">Anggaran</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-ink-500 uppercase">Realisasi</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Progress</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Target</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}><EmptyState message="Tidak ada data proyek" /></td></tr>
              ) : filtered.map(p => {
                const statusBdg = statusBadge(p.status);
                const pct = calculatePercentage(p.realisasi, p.anggaran);
                return (
                  <tr key={p.id} className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-ink-600">{p.kodeProyek}</td>
                    <td className="px-4 py-3 font-semibold text-ink-800">{p.namaProyek}</td>
                    <td className="px-4 py-3 text-ink-600 text-xs">{p.pic}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-800 whitespace-nowrap">{formatRupiah(p.anggaran)}</td>
                    <td className="px-4 py-3 text-right text-ink-600 whitespace-nowrap">
                      <span className="text-[10px] text-amber-600 font-semibold mr-1">SIMULASI</span>{formatRupiah(p.realisasi)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-16 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="text-xs font-bold text-ink-700 w-8 text-right">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={statusBdg.variant}>{p.status}</Badge></td>
                    <td className="px-4 py-3 text-ink-600 text-xs whitespace-nowrap">{formatTanggalShort(p.targetSelesai)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setEditing(p); setModalOpen(true); }} className="p-1.5 rounded-lg text-ink-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Edit2 size={15} /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && <ProyekForm editing={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteProyek(deleteId); pushToast('Data berhasil dihapus.'); } }}
        title="Hapus Proyek" message="Apakah Anda yakin ingin menghapus data proyek ini?" confirmText="Hapus" />
    </div>
  );
}

function ProyekForm({ editing, onClose, onSave }: { editing: PType | null; onClose: () => void; onSave: (d: Omit<PType, 'id'>) => void; }) {
  const [form, setForm] = useState<Omit<PType, 'id'>>({
    kodeProyek: editing?.kodeProyek || `PRJ-${String(Date.now()).slice(-3)}`,
    namaProyek: editing?.namaProyek || '',
    pic: editing?.pic || '',
    anggaran: editing?.anggaran || 0,
    realisasi: editing?.realisasi || 0,
    progress: editing?.progress || 0,
    status: editing?.status || 'Perencanaan',
    targetSelesai: editing?.targetSelesai || new Date().toISOString().slice(0, 10),
  });
  const set = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={editing ? 'Edit Proyek' : 'Tambah Proyek'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Batal</Button><Button onClick={() => onSave(form)}>Simpan</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Kode Proyek" value={form.kodeProyek} onChange={v => set('kodeProyek', v)} required />
        <Input label="Nama Proyek" value={form.namaProyek} onChange={v => set('namaProyek', v)} required />
        <Input label="PIC" value={form.pic} onChange={v => set('pic', v)} />
        <Input label="Status" value={form.status} onChange={v => set('status', v as StatusProyek)} options={statusOptions} />
        <Input label="Anggaran" type="number" value={form.anggaran} onChange={v => set('anggaran', Number(v))} />
        <Input label="Realisasi (Simulasi)" type="number" value={form.realisasi} onChange={v => set('realisasi', Number(v))} />
        <Input label="Progress (%)" type="number" value={form.progress} onChange={v => set('progress', Number(v))} />
        <Input label="Target Selesai" type="date" value={form.targetSelesai} onChange={v => set('targetSelesai', v)} />
      </div>
    </Modal>
  );
}
