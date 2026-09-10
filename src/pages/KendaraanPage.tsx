import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Car } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, Button, Input, Modal, ConfirmDialog, EmptyState } from '@/components/ui';
import { Badge, statusBadge } from '@/components/ui/Badge';
import { formatTanggalShort } from '@/utils/format';
import type { Kendaraan, StatusKendaraan, KondisiKendaraan } from '@/types';

const statusOptions: StatusKendaraan[] = ['Tersedia', 'Digunakan', 'Maintenance', 'Tidak Aktif'];
const kondisiOptions: KondisiKendaraan[] = ['Baik', 'Perlu Servis', 'Maintenance'];
const driverOptions = [
  'Bapak Ari — Jonggol',
  'Bapak Hendro — Jonggol',
  'Bapak Deni — Jonggol',
  'Bapak Akim — Pamijahan',
  'Bapak Yusuf — Sentul',
  'Bapak Hari — Solo',
];
const lokasiOptions = ['IDN Jonggol Ikhwan', 'IDN Jonggol Akhwat', 'Kantor Yayasan', 'IDN Pamijahan', 'IDN Sentul', 'IDN Solo'];

export function KendaraanPage() {
  const { kendaraan, addKendaraan, updateKendaraan, deleteKendaraan, pushToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Kendaraan | null>(null);

  const filtered = useMemo(() =>
    kendaraan.filter(k => {
      const matchSearch = !search ||
        k.namaKendaraan.toLowerCase().includes(search.toLowerCase()) ||
        k.nomorPolisi.toLowerCase().includes(search.toLowerCase()) ||
        k.kodeKendaraan.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || k.status === filterStatus;
      return matchSearch && matchStatus;
    }), [kendaraan, search, filterStatus]);

  const handleSave = (data: Omit<Kendaraan, 'id'>) => {
    if (editing) { updateKendaraan(editing.id, data); }
    else { addKendaraan(data); }
    pushToast('Data berhasil disimpan.');
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="Kendaraan Operasional"
        subtitle="Manajemen kendaraan operasional IDN"
        breadcrumb={['SPMS', 'Operasional', 'Kendaraan']}
        actions={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} /> Tambah Kendaraan</Button>}
      />

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kendaraan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
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
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Kendaraan</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">No. Polisi</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Tahun</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Driver/PIC</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-ink-500 uppercase">KM</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Kondisi</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}><EmptyState message="Tidak ada data kendaraan" /></td></tr>
              ) : filtered.map(k => {
                const statusBdg = statusBadge(k.status);
                const kondisiBdg = statusBadge(k.kondisi);
                return (
                  <tr key={k.id} className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-ink-600">{k.kodeKendaraan}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Car size={15} /></div>
                        <div>
                          <p className="font-semibold text-ink-800">{k.namaKendaraan}</p>
                          <p className="text-xs text-ink-400">{k.merek} {k.tipe}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-ink-700">{k.nomorPolisi}</td>
                    <td className="px-4 py-3 text-ink-600">{k.tahun}</td>
                    <td className="px-4 py-3 text-ink-600 text-xs">{k.driver}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-800">{k.kilometer.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3"><Badge variant={kondisiBdg.variant}>{k.kondisi}</Badge></td>
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
        <div className="px-4 py-3 border-t border-ink-100 text-xs text-ink-500">
          Menampilkan {filtered.length} dari {kendaraan.length} kendaraan
        </div>
      </Card>

      {modalOpen && <KendaraanForm editing={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteKendaraan(deleteId); pushToast('Data berhasil dihapus.'); } }}
        title="Hapus Kendaraan" message="Apakah Anda yakin ingin menghapus data kendaraan ini?"
        confirmText="Hapus" />
    </div>
  );
}

function KendaraanForm({ editing, onClose, onSave }: { editing: Kendaraan | null; onClose: () => void; onSave: (d: Omit<Kendaraan, 'id'>) => void; }) {
  const [form, setForm] = useState<Omit<Kendaraan, 'id'>>({
    kodeKendaraan: editing?.kodeKendaraan || `KND-${String(Date.now()).slice(-3)}`,
    namaKendaraan: editing?.namaKendaraan || '',
    nomorPolisi: editing?.nomorPolisi || '',
    merek: editing?.merek || 'Toyota',
    tipe: editing?.tipe || '',
    tahun: editing?.tahun || new Date().getFullYear(),
    kondisi: editing?.kondisi || 'Baik',
    status: editing?.status || 'Tersedia',
    driver: editing?.driver || driverOptions[0],
    lokasi: editing?.lokasi || lokasiOptions[0],
    kilometer: editing?.kilometer || 0,
    keterangan: editing?.keterangan || '',
  });
  const set = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={editing ? 'Edit Kendaraan' : 'Tambah Kendaraan'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Batal</Button><Button onClick={() => onSave(form)}>Simpan</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Kode Kendaraan" value={form.kodeKendaraan} onChange={v => set('kodeKendaraan', v)} required />
        <Input label="Nama Kendaraan" value={form.namaKendaraan} onChange={v => set('namaKendaraan', v)} required />
        <Input label="Nomor Polisi" value={form.nomorPolisi} onChange={v => set('nomorPolisi', v)} />
        <Input label="Merek" value={form.merek} onChange={v => set('merek', v)} />
        <Input label="Tipe" value={form.tipe} onChange={v => set('tipe', v)} />
        <Input label="Tahun" type="number" value={form.tahun} onChange={v => set('tahun', Number(v))} />
        <Input label="Kondisi" value={form.kondisi} onChange={v => set('kondisi', v as KondisiKendaraan)} options={kondisiOptions} />
        <Input label="Status" value={form.status} onChange={v => set('status', v as StatusKendaraan)} options={statusOptions} />
        <Input label="Driver/PIC" value={form.driver} onChange={v => set('driver', v)} options={driverOptions} />
        <Input label="Lokasi" value={form.lokasi} onChange={v => set('lokasi', v)} options={lokasiOptions} />
        <Input label="Kilometer" type="number" value={form.kilometer} onChange={v => set('kilometer', Number(v))} />
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-ink-600 mb-1.5">Keterangan</label>
          <textarea value={form.keterangan} onChange={e => set('keterangan', e.target.value)} rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
        </div>
      </div>
    </Modal>
  );
}
