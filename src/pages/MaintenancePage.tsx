import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, Button, Input, Modal, ConfirmDialog, EmptyState } from '@/components/ui';
import { Badge, statusBadge } from '@/components/ui/Badge';
import { formatRupiah, formatTanggalShort } from '@/utils/format';
import type { Maintenance as MType, StatusMaintenance, Prioritas } from '@/types';

const statusOptions: StatusMaintenance[] = ['Menunggu', 'Diproses', 'Selesai', 'Ditunda'];
const prioritasOptions: Prioritas[] = ['Rendah', 'Sedang', 'Tinggi', 'Urgent'];
const lokasiOptions = ['IDN Jonggol Ikhwan', 'IDN Jonggol Akhwat', 'Kantor Yayasan', 'IDN Pamijahan', 'IDN Sentul', 'IDN Solo'];

export function MaintenancePage() {
  const { maintenance, addMaintenance, updateMaintenance, deleteMaintenance, pushToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPrioritas, setFilterPrioritas] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<MType | null>(null);

  const filtered = useMemo(() => maintenance.filter(m => {
    const matchSearch = !search || m.aset.toLowerCase().includes(search.toLowerCase()) || m.kerusakan.toLowerCase().includes(search.toLowerCase()) || m.nomor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || m.status === filterStatus;
    const matchPrioritas = !filterPrioritas || m.prioritas === filterPrioritas;
    return matchSearch && matchStatus && matchPrioritas;
  }), [maintenance, search, filterStatus, filterPrioritas]);

  const handleSave = (data: Omit<MType, 'id'>) => {
    if (editing) updateMaintenance(editing.id, data);
    else addMaintenance(data);
    pushToast('Data berhasil disimpan.');
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Maintenance" subtitle="Manajemen pemeliharaan dan perbaikan sarana prasarana"
        breadcrumb={['SPMS', 'Operasional', 'Maintenance']}
        actions={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} /> Tambah Maintenance</Button>} />

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari maintenance..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterPrioritas} onChange={e => setFilterPrioritas(e.target.value)} className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Prioritas</option>
            {prioritasOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">No.</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Tanggal</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Aset</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Lokasi</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Kerusakan</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Prioritas</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">PIC</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-ink-500 uppercase">Estimasi</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10}><EmptyState message="Tidak ada data maintenance" /></td></tr>
              ) : filtered.map(m => {
                const statusBdg = statusBadge(m.status);
                const prioBdg = statusBadge(m.prioritas);
                return (
                  <tr key={m.id} className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-ink-600">{m.nomor}</td>
                    <td className="px-4 py-3 text-ink-600 whitespace-nowrap">{formatTanggalShort(m.tanggal)}</td>
                    <td className="px-4 py-3 font-semibold text-ink-800">{m.aset}</td>
                    <td className="px-4 py-3 text-ink-600 text-xs">{m.lokasi}</td>
                    <td className="px-4 py-3 text-ink-600 text-xs max-w-xs">{m.kerusakan}</td>
                    <td className="px-4 py-3"><Badge variant={prioBdg.variant}>{m.prioritas}</Badge></td>
                    <td className="px-4 py-3 text-ink-600 text-xs">{m.pic}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-800 whitespace-nowrap">{formatRupiah(m.estimasiBiaya)}</td>
                    <td className="px-4 py-3"><Badge variant={statusBdg.variant}>{m.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setEditing(m); setModalOpen(true); }} className="p-1.5 rounded-lg text-ink-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Edit2 size={15} /></button>
                        <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-ink-100 text-xs text-ink-500">Menampilkan {filtered.length} dari {maintenance.length} maintenance</div>
      </Card>

      {modalOpen && <MaintenanceForm editing={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteMaintenance(deleteId); pushToast('Data berhasil dihapus.'); } }}
        title="Hapus Maintenance" message="Apakah Anda yakin ingin menghapus data maintenance ini?" confirmText="Hapus" />
    </div>
  );
}

function MaintenanceForm({ editing, onClose, onSave }: { editing: MType | null; onClose: () => void; onSave: (d: Omit<MType, 'id'>) => void; }) {
  const [form, setForm] = useState<Omit<MType, 'id'>>({
    nomor: editing?.nomor || `MNT-${String(Date.now()).slice(-3)}`,
    tanggal: editing?.tanggal || new Date().toISOString().slice(0, 10),
    aset: editing?.aset || '',
    lokasi: editing?.lokasi || lokasiOptions[0],
    kerusakan: editing?.kerusakan || '',
    prioritas: editing?.prioritas || 'Sedang',
    pic: editing?.pic || '',
    estimasiBiaya: editing?.estimasiBiaya || 0,
    status: editing?.status || 'Menunggu',
    keterangan: editing?.keterangan || '',
  });
  const set = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={editing ? 'Edit Maintenance' : 'Tambah Maintenance'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Batal</Button><Button onClick={() => onSave(form)}>Simpan</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nomor" value={form.nomor} onChange={v => set('nomor', v)} required />
        <Input label="Tanggal" type="date" value={form.tanggal} onChange={v => set('tanggal', v)} />
        <Input label="Aset" value={form.aset} onChange={v => set('aset', v)} required />
        <Input label="Lokasi" value={form.lokasi} onChange={v => set('lokasi', v)} options={lokasiOptions} />
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-ink-600 mb-1.5">Kerusakan</label>
          <textarea value={form.kerusakan} onChange={e => set('kerusakan', e.target.value)} rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
        </div>
        <Input label="Prioritas" value={form.prioritas} onChange={v => set('prioritas', v as Prioritas)} options={prioritasOptions} />
        <Input label="Status" value={form.status} onChange={v => set('status', v as StatusMaintenance)} options={statusOptions} />
        <Input label="PIC" value={form.pic} onChange={v => set('pic', v)} />
        <Input label="Estimasi Biaya" type="number" value={form.estimasiBiaya} onChange={v => set('estimasiBiaya', Number(v))} />
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-ink-600 mb-1.5">Keterangan</label>
          <textarea value={form.keterangan} onChange={e => set('keterangan', e.target.value)} rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
        </div>
      </div>
    </Modal>
  );
}
