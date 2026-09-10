import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, CardHeader, Button, Input, Modal, ConfirmDialog, EmptyState, Badge } from '@/components/ui';
import { formatRupiah, formatRupiahShort, calculatePercentage } from '@/utils/format';
import type { RKA as RKAType, KategoriRKA } from '@/types';

const kategoriOptions: KategoriRKA[] = ['Tanah', 'Kendaraan', 'Proyek Pembangunan', 'Jaringan Listrik', 'AC', 'Program Lainnya'];
const COLORS = ['#3366ff', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

export function RKAPage() {
  const { rka, addRKA, updateRKA, deleteRKA, pushToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<RKAType | null>(null);

  const filtered = useMemo(() => rka.filter(r => {
    const matchSearch = !search || r.namaProgram.toLowerCase().includes(search.toLowerCase()) || r.kodeRKA.toLowerCase().includes(search.toLowerCase());
    const matchKategori = !filterKategori || r.kategori === filterKategori;
    return matchSearch && matchKategori;
  }), [rka, search, filterKategori]);

  const totalAnggaran = useMemo(() => rka.reduce((s, r) => s + r.anggaran, 0), [rka]);
  const totalRealisasi = useMemo(() => rka.reduce((s, r) => s + r.realisasi, 0), [rka]);

  const byCategory = useMemo(() => {
    return kategoriOptions.map(cat => ({
      name: cat,
      value: rka.filter(r => r.kategori === cat).reduce((s, r) => s + r.anggaran, 0),
    })).filter(d => d.value > 0);
  }, [rka]);

  const top5 = useMemo(() => [...rka].sort((a, b) => b.anggaran - a.anggaran).slice(0, 5), [rka]);

  const handleSave = (data: Omit<RKAType, 'id'>) => {
    if (editing) updateRKA(editing.id, data);
    else addRKA(data);
    pushToast('Data berhasil disimpan.');
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader title="RKA — Rencana Anggaran Kegiatan" subtitle="Rencana anggaran Bidang Sarana Prasarana IDN 2026"
        breadcrumb={['SPMS', 'Program', 'RKA']}
        actions={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} /> Tambah RKA</Button>} />

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <p className="text-xs font-bold text-ink-400 uppercase">Total Anggaran RKA</p>
          <p className="text-2xl font-extrabold text-ink-900 mt-1">{formatRupiah(totalAnggaran)}</p>
          <p className="text-xs text-ink-400 mt-1">{rka.length} program</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold text-ink-400 uppercase">Total Realisasi <span className="text-amber-600">SIMULASI</span></p>
          <p className="text-2xl font-extrabold text-ink-900 mt-1">{formatRupiah(totalRealisasi)}</p>
          <p className="text-xs text-ink-400 mt-1">{calculatePercentage(totalRealisasi, totalAnggaran)}% dari anggaran</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold text-ink-400 uppercase">Sisa Anggaran</p>
          <p className="text-2xl font-extrabold text-ink-900 mt-1">{formatRupiah(totalAnggaran - totalRealisasi)}</p>
          <p className="text-xs text-ink-400 mt-1">{100 - calculatePercentage(totalRealisasi, totalAnggaran)}% tersisa</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader title="Distribusi Anggaran per Kategori" subtitle="RKA berdasarkan kategori" />
          <div className="p-5">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatRupiah(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-3">
              {byCategory.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-ink-600 font-medium">{d.name}</span>
                  </div>
                  <span className="text-ink-800 font-bold">{formatRupiahShort(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Top 5 Program Anggaran Terbesar" subtitle="Program dengan anggaran tertinggi" />
          <div className="p-5 space-y-3">
            {top5.map((r, i) => {
              const pct = calculatePercentage(r.realisasi, r.anggaran);
              return (
                <div key={r.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: COLORS[i % COLORS.length] }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink-800 truncate">{r.namaProgram}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-ink-600">{pct}%</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-ink-800 whitespace-nowrap">{formatRupiahShort(r.anggaran)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari RKA..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
          </div>
          <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)} className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Kategori</option>
            {kategoriOptions.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-3 border-b border-ink-100 flex items-center gap-2">
          <Badge variant="warning">DATA SIMULASI</Badge>
          <span className="text-xs text-ink-500">Realisasi merupakan data simulasi, bukan aktual</span>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Kode</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Program</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Kategori</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-ink-500 uppercase">Anggaran</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-ink-500 uppercase">Realisasi</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-ink-500 uppercase">Sisa</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">%</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><EmptyState message="Tidak ada data RKA" /></td></tr>
              ) : filtered.map(r => {
                const sisa = r.anggaran - r.realisasi;
                const pct = calculatePercentage(r.realisasi, r.anggaran);
                return (
                  <tr key={r.id} className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-ink-600">{r.kodeRKA}</td>
                    <td className="px-4 py-3 font-semibold text-ink-800 max-w-xs">{r.namaProgram}</td>
                    <td className="px-4 py-3"><Badge variant="neutral">{r.kategori}</Badge></td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-800 whitespace-nowrap">{formatRupiah(r.anggaran)}</td>
                    <td className="px-4 py-3 text-right text-ink-600 whitespace-nowrap">{formatRupiah(r.realisasi)}</td>
                    <td className="px-4 py-3 text-right text-ink-600 whitespace-nowrap">{formatRupiah(sisa)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-14 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-bold text-ink-700 w-8 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setEditing(r); setModalOpen(true); }} className="p-1.5 rounded-lg text-ink-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Edit2 size={15} /></button>
                        <button onClick={() => setDeleteId(r.id)} className="p-1.5 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-ink-200 bg-ink-50/50 font-bold">
                <td colSpan={3} className="px-4 py-3 text-ink-800">Total</td>
                <td className="px-4 py-3 text-right text-ink-900 whitespace-nowrap">{formatRupiah(totalAnggaran)}</td>
                <td className="px-4 py-3 text-right text-ink-900 whitespace-nowrap">{formatRupiah(totalRealisasi)}</td>
                <td className="px-4 py-3 text-right text-ink-900 whitespace-nowrap">{formatRupiah(totalAnggaran - totalRealisasi)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {modalOpen && <RKAForm editing={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteRKA(deleteId); pushToast('Data berhasil dihapus.'); } }}
        title="Hapus RKA" message="Apakah Anda yakin ingin menghapus data RKA ini?" confirmText="Hapus" />
    </div>
  );
}

function RKAForm({ editing, onClose, onSave }: { editing: RKAType | null; onClose: () => void; onSave: (d: Omit<RKAType, 'id'>) => void; }) {
  const [form, setForm] = useState<Omit<RKAType, 'id'>>({
    kodeRKA: editing?.kodeRKA || `RKA-${String(Date.now()).slice(-3)}`,
    namaProgram: editing?.namaProgram || '',
    kategori: editing?.kategori || 'Program Lainnya',
    anggaran: editing?.anggaran || 0,
    realisasi: editing?.realisasi || 0,
    keterangan: editing?.keterangan || '',
  });
  const set = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open onClose={onClose} title={editing ? 'Edit RKA' : 'Tambah RKA'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Batal</Button><Button onClick={() => onSave(form)}>Simpan</Button></>}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Kode RKA" value={form.kodeRKA} onChange={v => set('kodeRKA', v)} required />
        <Input label="Kategori" value={form.kategori} onChange={v => set('kategori', v as KategoriRKA)} options={kategoriOptions} />
        <div className="col-span-2">
          <Input label="Nama Program" value={form.namaProgram} onChange={v => set('namaProgram', v)} required />
        </div>
        <Input label="Anggaran (Rp)" type="number" value={form.anggaran} onChange={v => set('anggaran', Number(v))} />
        <Input label="Realisasi Simulasi (Rp)" type="number" value={form.realisasi} onChange={v => set('realisasi', Number(v))} />
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-ink-600 mb-1.5">Keterangan</label>
          <textarea value={form.keterangan} onChange={e => set('keterangan', e.target.value)} rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
        </div>
      </div>
    </Modal>
  );
}
