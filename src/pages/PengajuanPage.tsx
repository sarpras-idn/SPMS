import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, Button, Input, Modal, ConfirmDialog, EmptyState } from '@/components/ui';
import { Badge, statusBadge } from '@/components/ui/Badge';
import { formatRupiah, formatTanggalShort } from '@/utils/format';
import type { Pengajuan as PType, StatusPengajuan, Prioritas } from '@/types';

const statusOptions: StatusPengajuan[] = ['Menunggu', 'Diproses', 'Disetujui', 'Ditolak', 'Selesai'];
const prioritasOptions: Prioritas[] = ['Rendah', 'Sedang', 'Tinggi', 'Urgent'];
const unitOptions = ['IDN Jonggol Ikhwan', 'IDN Jonggol Akhwat', 'Kantor Yayasan', 'IDN Pamijahan', 'IDN Sentul', 'IDN Solo'];

export function PengajuanPage() {
  const { pengajuan, addPengajuan, updatePengajuan, deletePengajuan, pushToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<PType | null>(null);

  const filtered = useMemo(() => pengajuan.filter(p => {
    const matchSearch = !search || p.pemohon.toLowerCase().includes(search.toLowerCase()) || p.pengajuan.toLowerCase().includes(search.toLowerCase()) || p.nomorPengajuan.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  }), [pengajuan, search, filterStatus]);

  const handleSave = (data: Omit<PType, 'id'>) => {
    if (editing) updatePengajuan(editing.id, data);
    else addPengajuan(data);
    pushToast('Data berhasil disimpan.');
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Pengajuan Sarpras" subtitle="Manajemen pengajuan sarana prasarana"
        breadcrumb={['SPMS', 'Operasional', 'Pengajuan']}
        actions={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} /> Tambah Pengajuan</Button>} />

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pengajuan..."
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
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">No. Pengajuan</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Tanggal</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Pemohon</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Pengajuan</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Prioritas</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-ink-500 uppercase">Estimasi</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}><EmptyState message="Tidak ada data pengajuan" /></td></tr>
              ) : filtered.map(p => {
                const statusBdg = statusBadge(p.status);
                const prioBdg = statusBadge(p.prioritas);
                return (
                  <tr key={p.id} className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-ink-600">{p.nomorPengajuan}</td>
                    <td className="px-4 py-3 text-ink-600 whitespace-nowrap">{formatTanggalShort(p.tanggal)}</td>
                    <td className="px-4 py-3 font-semibold text-ink-800">{p.pemohon}</td>
                    <td className="px-4 py-3 text-ink-600 text-xs">{p.unit}</td>
                    <td className="px-4 py-3 text-ink-600 text-xs max-w-xs">{p.pengajuan}</td>
                    <td className="px-4 py-3"><Badge variant={prioBdg.variant}>{p.prioritas}</Badge></td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-800 whitespace-nowrap">{formatRupiah(p.estimasiBiaya)}</td>
                    <td className="px-4 py-3"><Badge variant={statusBdg.variant}>{p.status}</Badge></td>
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
        <div className="px-4 py-3 border-t border-ink-100 text-xs text-ink-500">Menampilkan {filtered.length} dari {pengajuan.length} pengajuan</div>
      </Card>

      {modalOpen && <PengajuanForm editing={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deletePengajuan(deleteId); pushToast('Data berhasil dihapus.'); } }}
        title="Hapus Pengajuan" message="Apakah Anda yakin ingin menghapus data pengajuan ini?" confirmText="Hapus" />
    </div>
  );
}

function PengajuanForm({ editing, onClose, onSave }: { editing: PType | null; onClose: () => void; onSave: (d: Omit<PType, 'id'>) => void; }) {
  const [form, setForm] = useState<Omit<PType, 'id'>>({
    nomorPengajuan: editing?.nomorPengajuan || `PGJ-${String(Date.now()).slice(-3)}`,
    tanggal: editing?.tanggal || new Date().toISOString().slice(0, 10),
    pemohon: editing?.pemohon || '',
    unit: editing?.unit || unitOptions[0],
    pengajuan: editing?.pengajuan || '',
    prioritas: editing?.prioritas || 'Sedang',
    estimasiBiaya: editing?.estimasiBiaya || 0,
    status: editing?.status || 'Menunggu',
    keterangan: editing?.keterangan || '',
  });
  const set = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={editing ? 'Edit Pengajuan' : 'Tambah Pengajuan'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Batal</Button><Button onClick={() => onSave(form)}>Simpan</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="No. Pengajuan" value={form.nomorPengajuan} onChange={v => set('nomorPengajuan', v)} required />
        <Input label="Tanggal" type="date" value={form.tanggal} onChange={v => set('tanggal', v)} />
        <Input label="Pemohon" value={form.pemohon} onChange={v => set('pemohon', v)} required />
        <Input label="Unit" value={form.unit} onChange={v => set('unit', v)} options={unitOptions} />
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-ink-600 mb-1.5">Pengajuan</label>
          <textarea value={form.pengajuan} onChange={e => set('pengajuan', e.target.value)} rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
        </div>
        <Input label="Prioritas" value={form.prioritas} onChange={v => set('prioritas', v as Prioritas)} options={prioritasOptions} />
        <Input label="Status" value={form.status} onChange={v => set('status', v as StatusPengajuan)} options={statusOptions} />
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
