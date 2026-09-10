import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Filter, ArrowUpDown, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, Button, Input, Modal, ConfirmDialog, EmptyState } from '@/components/ui';
import { Badge, statusBadge } from '@/components/ui/Badge';
import { formatRupiah, formatTanggalShort } from '@/utils/format';
import type { Aset } from '@/types';
import type { MasterData } from '@/api/masterData';
import { lokasiAset, kategoriAset } from '@/data/assets';

type SortKey = keyof Aset;

export function InventarisPage() {
  const { aset, asetLoading, asetError, asetSource, asetSaving, fetchAset, masterData, masterDataLoading, masterDataError, fetchMasterData, addAset, updateAset, deleteAset, pushToast } = useApp();

  useEffect(() => {
    fetchAset();
    fetchMasterData();
  }, [fetchAset, fetchMasterData]);
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterLokasi, setFilterLokasi] = useState('');
  const [filterKondisi, setFilterKondisi] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('kodeAset');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Aset | null>(null);
  const [detail, setDetail] = useState<Aset | null>(null);

  const filtered = useMemo(() => {
    let result = aset.filter(a => {
      const matchSearch = !search ||
        a.namaAset.toLowerCase().includes(search.toLowerCase()) ||
        a.kodeAset.toLowerCase().includes(search.toLowerCase()) ||
        a.merek.toLowerCase().includes(search.toLowerCase()) ||
        a.nomorSeri.toLowerCase().includes(search.toLowerCase());
      const matchKategori = !filterKategori || a.kategori === filterKategori;
      const matchLokasi = !filterLokasi || a.lokasi === filterLokasi;
      const matchKondisi = !filterKondisi || a.kondisi === filterKondisi;
      return matchSearch && matchKategori && matchLokasi && matchKondisi;
    });
    result = [...result].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return result;
  }, [aset, search, filterKategori, filterLokasi, filterKondisi, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleSave = async (data: Omit<Aset, 'id'>) => {
    if (editing) {
      const err = await updateAset(editing.id, data);
      if (err) {
        pushToast(`Gagal memperbarui aset: ${err}`, 'error');
      } else {
        pushToast('Data aset berhasil diperbarui.');
        setModalOpen(false);
        setEditing(null);
      }
    } else {
      const err = await addAset(data);
      if (err) {
        pushToast(`Gagal menambahkan aset: ${err}`, 'error');
      } else {
        pushToast('Data aset berhasil ditambahkan.');
        setModalOpen(false);
        setEditing(null);
      }
    }
  };

  return (
    <div>
      <PageHeader
        title="Inventaris Aset"
        subtitle="Manajemen data aset sarana prasarana IDN"
        breadcrumb={['SPMS', 'Sarana & Aset', 'Inventaris']}
        actions={
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus size={16} /> Tambah Aset
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari aset..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            />
          </div>
          <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Kategori</option>
            {kategoriAset.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <select value={filterLokasi} onChange={e => setFilterLokasi(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Lokasi</option>
            {lokasiAset.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={filterKondisi} onChange={e => setFilterKondisi(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Kondisi</option>
            {(masterData?.Kondisi ?? []).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </Card>

      {/* Error state */}
      {asetError && (
        <div className="mb-4 flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertCircle size={20} className="text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Gagal memuat data dari server</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Menampilkan data demo sebagai fallback. Error: {asetError}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => fetchAset()}>
            <RefreshCw size={14} /> Coba lagi
          </Button>
        </div>
      )}

      {/* Loading state */}
      {asetLoading && (
        <Card className="overflow-hidden mb-4">
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-4 bg-ink-100 rounded w-24" />
                <div className="h-4 bg-ink-100 rounded flex-1" />
                <div className="h-4 bg-ink-100 rounded w-20" />
                <div className="h-4 bg-ink-100 rounded w-16" />
                <div className="h-4 bg-ink-100 rounded w-24" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Table */}
      {!asetLoading && (
      <Card className="overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase cursor-pointer hover:text-ink-700" onClick={() => toggleSort('kodeAset')}>
                  <span className="flex items-center gap-1">Kode <ArrowUpDown size={11} /></span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase cursor-pointer hover:text-ink-700" onClick={() => toggleSort('namaAset')}>
                  <span className="flex items-center gap-1">Nama Aset <ArrowUpDown size={11} /></span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Kategori</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Lokasi</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Jumlah</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Kondisi</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-ink-500 uppercase">Nilai Aset</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}><EmptyState message="Tidak ada data aset ditemukan" /></td></tr>
              ) : filtered.map(a => {
                const kondisiBadge = statusBadge(a.kondisi);
                const statusBdg = statusBadge(a.statusAset);
                return (
                  <tr key={a.id} className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-ink-600">{a.kodeAset}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink-800">{a.namaAset}</p>
                      <p className="text-xs text-ink-400">{a.merek} {a.tipe}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{a.kategori}</td>
                    <td className="px-4 py-3 text-ink-600 text-xs">{a.lokasi}</td>
                    <td className="px-4 py-3 text-center font-semibold text-ink-800">{a.jumlah} {a.satuan}</td>
                    <td className="px-4 py-3"><Badge variant={kondisiBadge.variant}>{a.kondisi}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={statusBdg.variant}>{a.statusAset}</Badge></td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-800 whitespace-nowrap">{formatRupiah(a.nilaiAset)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setDetail(a); setDetailOpen(true); }} className="p-1.5 rounded-lg text-ink-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Detail">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => { setEditing(a); setModalOpen(true); }} className="p-1.5 rounded-lg text-ink-400 hover:bg-brand-50 hover:text-brand-600 transition-colors" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteId(a.id)} className="p-1.5 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-ink-100 flex items-center justify-between text-xs text-ink-500">
          <span>Menampilkan {filtered.length} dari {aset.length} aset</span>
          {asetSource && (
            <span className={`font-medium ${asetSource === 'api' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {asetSource === 'api' ? 'Data dari server' : 'Data demo (fallback)'}
            </span>
          )}
        </div>
      </Card>
      )}

      {modalOpen && (
        <AsetFormModal
          editing={editing}
          saving={asetSaving}
          masterData={masterData}
          masterDataLoading={masterDataLoading}
          masterDataError={masterDataError}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}

      {detailOpen && detail && (
        <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Detail Aset" size="lg"
          subtitle={detail.kodeAset}
          footer={<Button variant="secondary" onClick={() => setDetailOpen(false)}>Tutup</Button>}
        >
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Kode Aset', detail.kodeAset],
              ['Nama Aset', detail.namaAset],
              ['Kategori', detail.kategori],
              ['Sub Kategori', detail.subKategori],
              ['Merek', detail.merek],
              ['Tipe/Spesifikasi', detail.tipe],
              ['Nomor Seri', detail.nomorSeri],
              ['Lokasi', detail.lokasi],
              ['PIC', detail.pic],
              ['Jumlah', `${detail.jumlah} ${detail.satuan}`],
              ['Kondisi', detail.kondisi],
              ['Status', detail.statusAset],
              ['Tahun Pembelian', String(detail.tahunPembelian)],
              ['Tanggal Pembelian', formatTanggalShort(detail.tanggalPembelian)],
              ['Nilai Aset', formatRupiah(detail.nilaiAset)],
              ['Sumber Perolehan', detail.sumberPerolehan],
            ].map(([label, value]) => (
              <div key={label} className="bg-ink-50/50 rounded-lg px-3 py-2.5">
                <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-ink-800 mt-0.5">{value}</p>
              </div>
            ))}
            <div className="col-span-2 bg-ink-50/50 rounded-lg px-3 py-2.5">
              <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wide">Keterangan</p>
              <p className="text-sm text-ink-700 mt-0.5">{detail.keterangan || '-'}</p>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          const err = await deleteAset(deleteId);
          if (err) {
            pushToast(`Gagal menghapus aset: ${err}`, 'error');
          } else {
            pushToast('Data aset berhasil dihapus.');
          }
          setDeleteId(null);
        }}
        title="Hapus Aset"
        message="Apakah Anda yakin ingin menghapus data aset ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
      />
    </div>
  );
}

function AsetFormModal({ editing, saving, masterData, masterDataLoading, masterDataError, onClose, onSave }: {
  editing: Aset | null;
  saving: boolean;
  masterData: MasterData | null;
  masterDataLoading: boolean;
  masterDataError: string | null;
  onClose: () => void;
  onSave: (data: Omit<Aset, 'id'>) => void;
}) {
  const withCurrent = (opts: string[], current?: string): string[] =>
    current && !opts.includes(current) ? [...opts, current] : opts;

  const kategoriOptions = withCurrent(masterData?.Kategori ?? [...kategoriAset], editing?.kategori);
  const subKategoriOptions = withCurrent(masterData?.['Sub Kategori'] ?? [], editing?.subKategori);
  const lokasiOptions = withCurrent(masterData?.Lokasi ?? [...lokasiAset], editing?.lokasi);
  const picOptions = withCurrent(masterData?.PIC ?? [], editing?.pic);
  const satuanOptions = withCurrent(masterData?.Satuan ?? [], editing?.satuan);
  const kondisiOpts = withCurrent(masterData?.Kondisi ?? [], editing?.kondisi);
  const statusOpts = withCurrent(masterData?.['Status Aset'] ?? [], editing?.statusAset);
  const sumberOpts = withCurrent(masterData?.['Sumber Perolehan'] ?? [], editing?.sumberPerolehan);

  const [form, setForm] = useState<Omit<Aset, 'id'>>({
    kodeAset: editing?.kodeAset ?? `AST-${Date.now().toString().slice(-6)}`,
    namaAset: editing?.namaAset ?? '',
    kategori: editing?.kategori ?? kategoriOptions[0] ?? '',
    subKategori: editing?.subKategori ?? '',
    merek: editing?.merek ?? '',
    tipe: editing?.tipe ?? '',
    nomorSeri: editing?.nomorSeri ?? '',
    lokasi: editing?.lokasi ?? lokasiOptions[0] ?? '',
    pic: editing?.pic ?? '',
    jumlah: editing?.jumlah ?? 1,
    satuan: editing?.satuan ?? satuanOptions[0] ?? 'Unit',
    kondisi: editing?.kondisi ?? kondisiOpts[0] ?? 'Baik',
    statusAset: editing?.statusAset ?? statusOpts[0] ?? 'Aktif',
    tahunPembelian: editing?.tahunPembelian ?? new Date().getFullYear(),
    tanggalPembelian: (editing?.tanggalPembelian ?? new Date().toISOString()).slice(0, 10),
    nilaiAset: editing?.nilaiAset ?? 0,
    sumberPerolehan: editing?.sumberPerolehan ?? sumberOpts[0] ?? 'Pembelian',
    keterangan: editing?.keterangan ?? '',
  });

  const set = (key: keyof typeof form, val: string | number) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.namaAset || !form.kodeAset) return;
    onSave(form);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? 'Edit Aset' : 'Tambah Aset'}
      subtitle="Lengkapi data aset sarana prasarana"
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Batal</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : 'Simpan'}
          </Button>
        </>
      }
    >
      {masterDataError && (
        <div className="mb-4 flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <p className="text-sm text-red-700">Gagal memuat data pilihan. Silakan coba lagi.</p>
        </div>
      )}
      {masterDataLoading && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <Loader2 size={16} className="animate-spin text-blue-600" />
          <p className="text-sm text-blue-700">Memuat data pilihan...</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Kode Aset" value={form.kodeAset} onChange={v => set('kodeAset', v)} required />
        <Input label="Nama Aset" value={form.namaAset} onChange={v => set('namaAset', v)} required />
        <Input label="Kategori" value={form.kategori} onChange={v => set('kategori', v)} options={kategoriOptions} />
        <Input label="Sub Kategori" value={form.subKategori} onChange={v => set('subKategori', v)} options={subKategoriOptions} />
        <Input label="Merek/Jenis" value={form.merek} onChange={v => set('merek', v)} />
        <Input label="Tipe/Spesifikasi" value={form.tipe} onChange={v => set('tipe', v)} />
        <Input label="Nomor Seri" value={form.nomorSeri} onChange={v => set('nomorSeri', v)} />
        <Input label="Lokasi" value={form.lokasi} onChange={v => set('lokasi', v)} options={lokasiOptions} />
        <Input label="PIC" value={form.pic} onChange={v => set('pic', v)} options={picOptions} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Jumlah" type="number" value={form.jumlah} onChange={v => set('jumlah', Number(v))} />
          <Input label="Satuan" value={form.satuan} onChange={v => set('satuan', v)} options={satuanOptions} />
        </div>
        <Input label="Kondisi" value={form.kondisi} onChange={v => set('kondisi', v)} options={kondisiOpts} />
        <Input label="Status Aset" value={form.statusAset} onChange={v => set('statusAset', v)} options={statusOpts} />
        <Input label="Tahun Pembelian" type="number" value={form.tahunPembelian} onChange={v => set('tahunPembelian', Number(v))} />
        <Input label="Tanggal Pembelian" type="date" value={form.tanggalPembelian} onChange={v => set('tanggalPembelian', v)} />
        <Input label="Nilai Aset (Rp)" type="number" value={form.nilaiAset} onChange={v => set('nilaiAset', Number(v))} />
        <Input label="Sumber Perolehan" value={form.sumberPerolehan} onChange={v => set('sumberPerolehan', v)} options={sumberOpts} />
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-ink-600 mb-1.5">Keterangan</label>
          <textarea
            value={form.keterangan}
            onChange={e => set('keterangan', e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}
