import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Building2 } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, Button, Input, Modal, ConfirmDialog, EmptyState } from '@/components/ui';
import { Badge, statusBadge } from '@/components/ui/Badge';
import type { GedungRuangan, KondisiAset } from '@/types';
import { gedungSeed } from '@/data/gedung';

const kondisiOptions: KondisiAset[] = ['Baik', 'Rusak Ringan', 'Rusak Berat', 'Baik + Perawatan'];
const tipeOptions = ['Gedung Permanen', 'Gedung Semi-Permanen', 'Asrama', 'Kantor', 'Ruang Kelas', 'Masjid', 'Lapangan'];
const lokasiOptions = ['IDN Jonggol Ikhwan', 'IDN Jonggol Akhwat', 'Kantor Yayasan', 'IDN Pamijahan', 'IDN Sentul', 'IDN Solo'];

export function GedungPage() {
  const { aset, pushToast } = useApp();
  const [gedung, setGedung] = useState<GedungRuangan[]>(() => [...gedungSeed]);
  const [search, setSearch] = useState('');
  const [filterLokasi, setFilterLokasi] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<GedungRuangan | null>(null);

  const filtered = useMemo(() => gedung.filter(g => {
    const matchSearch = !search || g.nama.toLowerCase().includes(search.toLowerCase()) || g.kode.toLowerCase().includes(search.toLowerCase());
    const matchLokasi = !filterLokasi || g.lokasi === filterLokasi;
    return matchSearch && matchLokasi;
  }), [gedung, search, filterLokasi]);

  const handleSave = (data: Omit<GedungRuangan, 'id'>) => {
    if (editing) {
      setGedung(prev => prev.map(g => g.id === editing.id ? { ...editing, ...data } : g));
    } else {
      setGedung(prev => [{ ...data, id: `gdg-${Date.now()}` }, ...prev]);
    }
    pushToast('Data berhasil disimpan.');
    setModalOpen(false); setEditing(null);
  };

  const handleDelete = (id: string) => {
    setGedung(prev => prev.filter(g => g.id !== id));
    pushToast('Data berhasil dihapus.');
  };

  return (
    <div>
      <PageHeader title="Gedung & Ruangan" subtitle="Manajemen gedung dan ruangan IDN"
        breadcrumb={['SPMS', 'Sarana & Aset', 'Gedung & Ruangan']}
        actions={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} /> Tambah Gedung</Button>} />

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari gedung..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
          </div>
          <select value={filterLokasi} onChange={e => setFilterLokasi(e.target.value)} className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Lokasi</option>
            {lokasiOptions.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <Card className="col-span-full"><EmptyState message="Tidak ada data gedung" /></Card>
        ) : filtered.map(g => {
          const kondisiBdg = statusBadge(g.kondisi);
          return (
            <Card key={g.id} className="p-5 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Building2 size={22} />
                </div>
                <Badge variant={kondisiBdg.variant}>{g.kondisi}</Badge>
              </div>
              <p className="font-mono text-xs text-ink-400">{g.kode}</p>
              <h3 className="font-bold text-ink-900 mt-1">{g.nama}</h3>
              <div className="space-y-1 text-xs text-ink-500 mt-3">
                <div className="flex items-center justify-between"><span>Lokasi:</span><span className="font-semibold text-ink-700">{g.lokasi}</span></div>
                <div className="flex items-center justify-between"><span>Tipe:</span><span className="font-semibold text-ink-700">{g.tipe}</span></div>
                <div className="flex items-center justify-between"><span>Kapasitas:</span><span className="font-semibold text-ink-700">{g.kapasitas} orang</span></div>
                <div className="flex items-center justify-between"><span>PIC:</span><span className="font-semibold text-ink-700">{g.pic}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-ink-50">
                <Button variant="secondary" size="sm" onClick={() => { setEditing(g); setModalOpen(true); }}><Edit2 size={13} /> Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(g.id)} className="text-red-500 hover:bg-red-50"><Trash2 size={13} /> Hapus</Button>
              </div>
            </Card>
          );
        })}
      </div>

      {modalOpen && (
        <GedungForm editing={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) handleDelete(deleteId); }}
        title="Hapus Gedung" message="Apakah Anda yakin ingin menghapus data gedung ini?" confirmText="Hapus" />
    </div>
  );
}

function GedungForm({ editing, onClose, onSave }: { editing: GedungRuangan | null; onClose: () => void; onSave: (d: Omit<GedungRuangan, 'id'>) => void; }) {
  const [form, setForm] = useState<Omit<GedungRuangan, 'id'>>({
    kode: editing?.kode || `GDG-${String(Date.now()).slice(-3)}`,
    nama: editing?.nama || '',
    lokasi: editing?.lokasi || lokasiOptions[0],
    tipe: editing?.tipe || tipeOptions[0],
    kapasitas: editing?.kapasitas || 0,
    kondisi: editing?.kondisi || 'Baik',
    pic: editing?.pic || '',
  });
  const set = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={editing ? 'Edit Gedung' : 'Tambah Gedung'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Batal</Button><Button onClick={() => onSave(form)}>Simpan</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Kode" value={form.kode} onChange={v => set('kode', v)} required />
        <Input label="Nama Gedung" value={form.nama} onChange={v => set('nama', v)} required />
        <Input label="Lokasi" value={form.lokasi} onChange={v => set('lokasi', v)} options={lokasiOptions} />
        <Input label="Tipe" value={form.tipe} onChange={v => set('tipe', v)} options={tipeOptions} />
        <Input label="Kapasitas" type="number" value={form.kapasitas} onChange={v => set('kapasitas', Number(v))} />
        <Input label="Kondisi" value={form.kondisi} onChange={v => set('kondisi', v as KondisiAset)} options={kondisiOptions} />
        <div className="col-span-2"><Input label="PIC" value={form.pic} onChange={v => set('pic', v)} /></div>
      </div>
    </Modal>
  );
}
