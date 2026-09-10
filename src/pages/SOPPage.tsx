import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, FileCheck } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, Button, Input, Modal, ConfirmDialog, EmptyState } from '@/components/ui';
import { Badge, statusBadge } from '@/components/ui/Badge';
import { formatTanggalShort } from '@/utils/format';
import type { SOP as SOPType, StatusSOP } from '@/types';

const statusOptions: StatusSOP[] = ['Berlaku', 'Revisi', 'Berakhir'];
const kategoriOptions = ['Inventaris', 'Pengadaan', 'Pemeliharaan', 'Kendaraan', 'Utilitas'];

export function SOPPage() {
  const { sop, addSOP, updateSOP, deleteSOP, pushToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<SOPType | null>(null);

  const filtered = useMemo(() => sop.filter(s => {
    const matchSearch = !search || s.namaSOP.toLowerCase().includes(search.toLowerCase()) || s.kodeSOP.toLowerCase().includes(search.toLowerCase());
    const matchKategori = !filterKategori || s.kategori === filterKategori;
    return matchSearch && matchKategori;
  }), [sop, search, filterKategori]);

  const handleSave = (data: Omit<SOPType, 'id'>) => {
    if (editing) updateSOP(editing.id, data);
    else addSOP(data);
    pushToast('Data berhasil disimpan.');
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader title="SOP — Standard Operating Procedure" subtitle="Daftar SOP Bidang Sarana Prasarana IDN"
        breadcrumb={['SPMS', 'Dokumen', 'SOP']}
        actions={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} /> Tambah SOP</Button>} />

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari SOP..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
          </div>
          <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)} className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Kategori</option>
            {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <Card className="col-span-full"><EmptyState message="Tidak ada data SOP" /></Card>
        ) : filtered.map(s => {
          const statusBdg = statusBadge(s.status);
          return (
            <Card key={s.id} className="p-5 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <FileCheck size={20} />
                </div>
                <Badge variant={statusBdg.variant}>{s.status}</Badge>
              </div>
              <p className="font-mono text-xs text-ink-400">{s.kodeSOP}</p>
              <h3 className="font-bold text-ink-900 mt-1 mb-2">{s.namaSOP}</h3>
              <div className="space-y-1 text-xs text-ink-500">
                <div className="flex items-center justify-between">
                  <span>Kategori:</span><span className="font-semibold text-ink-700">{s.kategori}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Versi:</span><span className="font-semibold text-ink-700">{s.versi}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Berlaku:</span><span className="font-semibold text-ink-700">{formatTanggalShort(s.tanggalBerlaku)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>PIC:</span><span className="font-semibold text-ink-700">{s.pic}</span>
                </div>
              </div>
              <p className="text-xs text-ink-500 mt-3 pt-3 border-t border-ink-50">{s.keterangan}</p>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="secondary" size="sm" onClick={() => { setEditing(s); setModalOpen(true); }}><Edit2 size={13} /> Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(s.id)} className="text-red-500 hover:bg-red-50"><Trash2 size={13} /> Hapus</Button>
              </div>
            </Card>
          );
        })}
      </div>

      {modalOpen && <SOPForm editing={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteSOP(deleteId); pushToast('Data berhasil dihapus.'); } }}
        title="Hapus SOP" message="Apakah Anda yakin ingin menghapus data SOP ini?" confirmText="Hapus" />
    </div>
  );
}

function SOPForm({ editing, onClose, onSave }: { editing: SOPType | null; onClose: () => void; onSave: (d: Omit<SOPType, 'id'>) => void; }) {
  const [form, setForm] = useState<Omit<SOPType, 'id'>>({
    kodeSOP: editing?.kodeSOP || `SOP-${String(Date.now()).slice(-2)}`,
    namaSOP: editing?.namaSOP || '',
    kategori: editing?.kategori || kategoriOptions[0],
    versi: editing?.versi || '1.0',
    tanggalBerlaku: editing?.tanggalBerlaku || new Date().toISOString().slice(0, 10),
    pic: editing?.pic || '',
    status: editing?.status || 'Berlaku',
    keterangan: editing?.keterangan || '',
  });
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={editing ? 'Edit SOP' : 'Tambah SOP'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Batal</Button><Button onClick={() => onSave(form)}>Simpan</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Kode SOP" value={form.kodeSOP} onChange={v => set('kodeSOP', v)} required />
        <Input label="Nama SOP" value={form.namaSOP} onChange={v => set('namaSOP', v)} required />
        <Input label="Kategori" value={form.kategori} onChange={v => set('kategori', v)} options={kategoriOptions} />
        <Input label="Versi" value={form.versi} onChange={v => set('versi', v)} />
        <Input label="Tanggal Berlaku" type="date" value={form.tanggalBerlaku} onChange={v => set('tanggalBerlaku', v)} />
        <Input label="PIC" value={form.pic} onChange={v => set('pic', v)} />
        <Input label="Status" value={form.status} onChange={v => set('status', v as StatusSOP)} options={statusOptions} />
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-ink-600 mb-1.5">Keterangan</label>
          <textarea value={form.keterangan} onChange={e => set('keterangan', e.target.value)} rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
        </div>
      </div>
    </Modal>
  );
}
