import { useState } from 'react';
import { FileText, Printer, Download, Eye, BarChart3 } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, CardHeader, Button, Badge } from '@/components/ui';
import { formatRupiah } from '@/utils/format';

const reportTypes = [
  { key: 'aset', label: 'Laporan Aset', desc: 'Daftar lengkap aset sarana prasarana', icon: FileText },
  { key: 'kondisi', label: 'Laporan Kondisi Aset', desc: 'Rekap kondisi aset per kategori', icon: BarChart3 },
  { key: 'kendaraan', label: 'Laporan Kendaraan', desc: 'Status kendaraan operasional', icon: FileText },
  { key: 'maintenance', label: 'Laporan Maintenance', desc: 'Histori pemeliharaan dan perbaikan', icon: FileText },
  { key: 'rka', label: 'Laporan RKA', desc: 'Rencana anggaran kegiatan', icon: FileText },
  { key: 'proyek', label: 'Laporan Proyek', desc: 'Progress proyek pembangunan', icon: FileText },
  { key: 'kpi', label: 'Laporan KPI', desc: 'Capaian kinerja indikator', icon: FileText },
];

export function LaporanPage() {
  const { aset, kendaraan, maintenance, rka, proyek, kpi, pushToast } = useApp();
  const [selected, setSelected] = useState<string | null>(null);

  const exportCSV = (key: string) => {
    let data: Record<string, unknown>[] = [];
    let headers: string[] = [];
    switch (key) {
      case 'aset':
        headers = ['Kode', 'Nama', 'Kategori', 'Lokasi', 'Jumlah', 'Kondisi', 'Status', 'Nilai'];
        data = aset.map(a => ({ Kode: a.kodeAset, Nama: a.namaAset, Kategori: a.kategori, Lokasi: a.lokasi, Jumlah: a.jumlah, Kondisi: a.kondisi, Status: a.statusAset, Nilai: a.nilaiAset }));
        break;
      case 'kendaraan':
        headers = ['Kode', 'Nama', 'No Polisi', 'Driver', 'KM', 'Kondisi', 'Status'];
        data = kendaraan.map(k => ({ Kode: k.kodeKendaraan, Nama: k.namaKendaraan, 'No Polisi': k.nomorPolisi, Driver: k.driver, KM: k.kilometer, Kondisi: k.kondisi, Status: k.status }));
        break;
      case 'maintenance':
        headers = ['Nomor', 'Tanggal', 'Aset', 'Lokasi', 'Kerusakan', 'Prioritas', 'Status', 'Biaya'];
        data = maintenance.map(m => ({ Nomor: m.nomor, Tanggal: m.tanggal, Aset: m.aset, Lokasi: m.lokasi, Kerusakan: m.kerusakan, Prioritas: m.prioritas, Status: m.status, Biaya: m.estimasiBiaya }));
        break;
      case 'rka':
        headers = ['Kode', 'Program', 'Kategori', 'Anggaran', 'Realisasi'];
        data = rka.map(r => ({ Kode: r.kodeRKA, Program: r.namaProgram, Kategori: r.kategori, Anggaran: r.anggaran, Realisasi: r.realisasi }));
        break;
      case 'proyek':
        headers = ['Kode', 'Nama', 'PIC', 'Anggaran', 'Realisasi', 'Progress', 'Status'];
        data = proyek.map(p => ({ Kode: p.kodeProyek, Nama: p.namaProyek, PIC: p.pic, Anggaran: p.anggaran, Realisasi: p.realisasi, Progress: p.progress, Status: p.status }));
        break;
      case 'kpi':
        headers = ['Kode', 'Indikator', 'Target', 'Realisasi', 'Status'];
        data = kpi.map(k => ({ Kode: k.kodeKPI, Indikator: k.indikator, Target: k.target, Realisasi: k.realisasi, Status: k.status }));
        break;
      case 'kondisi':
        headers = ['Kondisi', 'Jumlah'];
        const kondisi = ['Baik', 'Rusak Ringan', 'Rusak Berat', 'Baik + Perawatan'];
        data = kondisi.map(k => ({ Kondisi: k, Jumlah: aset.filter(a => a.kondisi === k).length }));
        break;
      default: return;
    }
    const csv = [headers.join(','), ...data.map(d => headers.map(h => `"${String(d[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-${key}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    pushToast('Data berhasil diekspor ke CSV.', 'success');
  };

  const renderPreview = () => {
    if (!selected) return null;
    const type = reportTypes.find(r => r.key === selected);
    if (!type) return null;

    return (
      <Card className="print-area">
        <CardHeader title={type.label} subtitle={`Dihasilkan pada ${new Date().toLocaleDateString('id-ID')}`} action={
          <div className="flex gap-2 no-print">
            <Button variant="secondary" size="sm" onClick={() => window.print()}><Printer size={14} /> Print</Button>
            <Button size="sm" onClick={() => exportCSV(selected)}><Download size={14} /> CSV</Button>
          </div>
        } />
        <div className="p-5 overflow-x-auto scrollbar-thin">
          {selected === 'aset' && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Kode</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Nama</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Lokasi</th>
                <th className="text-center px-3 py-2 text-xs font-bold text-ink-500">Jumlah</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Kondisi</th>
                <th className="text-right px-3 py-2 text-xs font-bold text-ink-500">Nilai</th>
              </tr></thead>
              <tbody>
                {aset.map(a => <tr key={a.id} className="border-b border-ink-50">
                  <td className="px-3 py-2 font-mono text-xs">{a.kodeAset}</td>
                  <td className="px-3 py-2 font-semibold">{a.namaAset}</td>
                  <td className="px-3 py-2 text-xs">{a.lokasi}</td>
                  <td className="px-3 py-2 text-center">{a.jumlah}</td>
                  <td className="px-3 py-2">{a.kondisi}</td>
                  <td className="px-3 py-2 text-right">{formatRupiah(a.nilaiAset)}</td>
                </tr>)}
              </tbody>
            </table>
          )}
          {selected === 'kondisi' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Baik', 'Rusak Ringan', 'Rusak Berat', 'Baik + Perawatan'].map(k => {
                const count = aset.filter(a => a.kondisi === k).length;
                return (
                  <div key={k} className="bg-ink-50/50 rounded-xl p-5 border border-ink-100">
                    <p className="text-xs text-ink-400 font-semibold uppercase">{k}</p>
                    <p className="text-3xl font-extrabold text-ink-900 mt-2">{count}</p>
                    <p className="text-xs text-ink-400">unit aset</p>
                  </div>
                );
              })}
            </div>
          )}
          {selected === 'kendaraan' && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Kode</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Kendaraan</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">No Polisi</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Driver</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Status</th>
              </tr></thead>
              <tbody>
                {kendaraan.map(k => <tr key={k.id} className="border-b border-ink-50">
                  <td className="px-3 py-2 font-mono text-xs">{k.kodeKendaraan}</td>
                  <td className="px-3 py-2 font-semibold">{k.namaKendaraan}</td>
                  <td className="px-3 py-2 font-mono text-xs">{k.nomorPolisi}</td>
                  <td className="px-3 py-2 text-xs">{k.driver}</td>
                  <td className="px-3 py-2">{k.status}</td>
                </tr>)}
              </tbody>
            </table>
          )}
          {selected === 'maintenance' && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">No</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Tanggal</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Aset</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Kerusakan</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Status</th>
                <th className="text-right px-3 py-2 text-xs font-bold text-ink-500">Biaya</th>
              </tr></thead>
              <tbody>
                {maintenance.map(m => <tr key={m.id} className="border-b border-ink-50">
                  <td className="px-3 py-2 font-mono text-xs">{m.nomor}</td>
                  <td className="px-3 py-2">{m.tanggal}</td>
                  <td className="px-3 py-2 font-semibold">{m.aset}</td>
                  <td className="px-3 py-2 text-xs">{m.kerusakan}</td>
                  <td className="px-3 py-2">{m.status}</td>
                  <td className="px-3 py-2 text-right">{formatRupiah(m.estimasiBiaya)}</td>
                </tr>)}
              </tbody>
            </table>
          )}
          {selected === 'rka' && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Kode</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Program</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Kategori</th>
                <th className="text-right px-3 py-2 text-xs font-bold text-ink-500">Anggaran</th>
                <th className="text-right px-3 py-2 text-xs font-bold text-ink-500">Realisasi</th>
              </tr></thead>
              <tbody>
                {rka.map(r => <tr key={r.id} className="border-b border-ink-50">
                  <td className="px-3 py-2 font-mono text-xs">{r.kodeRKA}</td>
                  <td className="px-3 py-2 font-semibold">{r.namaProgram}</td>
                  <td className="px-3 py-2">{r.kategori}</td>
                  <td className="px-3 py-2 text-right">{formatRupiah(r.anggaran)}</td>
                  <td className="px-3 py-2 text-right">{formatRupiah(r.realisasi)}</td>
                </tr>)}
              </tbody>
            </table>
          )}
          {selected === 'proyek' && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Kode</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Proyek</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">PIC</th>
                <th className="text-center px-3 py-2 text-xs font-bold text-ink-500">Progress</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Status</th>
              </tr></thead>
              <tbody>
                {proyek.map(p => <tr key={p.id} className="border-b border-ink-50">
                  <td className="px-3 py-2 font-mono text-xs">{p.kodeProyek}</td>
                  <td className="px-3 py-2 font-semibold">{p.namaProyek}</td>
                  <td className="px-3 py-2 text-xs">{p.pic}</td>
                  <td className="px-3 py-2 text-center">{p.progress}%</td>
                  <td className="px-3 py-2">{p.status}</td>
                </tr>)}
              </tbody>
            </table>
          )}
          {selected === 'kpi' && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Kode</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Indikator</th>
                <th className="text-center px-3 py-2 text-xs font-bold text-ink-500">Target</th>
                <th className="text-center px-3 py-2 text-xs font-bold text-ink-500">Realisasi</th>
                <th className="text-left px-3 py-2 text-xs font-bold text-ink-500">Status</th>
              </tr></thead>
              <tbody>
                {kpi.map(k => <tr key={k.id} className="border-b border-ink-50">
                  <td className="px-3 py-2 font-mono text-xs">{k.kodeKPI}</td>
                  <td className="px-3 py-2 font-semibold">{k.indikator}</td>
                  <td className="px-3 py-2 text-center">{k.target}{k.satuan}</td>
                  <td className="px-3 py-2 text-center">{k.realisasi}{k.satuan}</td>
                  <td className="px-3 py-2">{k.status}</td>
                </tr>)}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <PageHeader title="Laporan" subtitle="Pusat laporan sarana prasarana IDN"
        breadcrumb={['SPMS', 'Dokumen', 'Laporan']} />

      {!selected ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map(rt => {
            const Icon = rt.icon;
            return (
              <Card key={rt.key} className="p-5 hover:shadow-card-hover hover:border-brand-200 transition-all cursor-pointer" >
                <div className="flex items-start gap-4" onClick={() => setSelected(rt.key)}>
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-900">{rt.label}</h3>
                    <p className="text-xs text-ink-500 mt-1">{rt.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-ink-50">
                  <Button variant="secondary" size="sm" onClick={() => setSelected(rt.key)}><Eye size={13} /> Preview</Button>
                  <Button variant="ghost" size="sm" onClick={() => exportCSV(rt.key)}><Download size={13} /> CSV</Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="mb-4 no-print">
            <Button variant="secondary" onClick={() => setSelected(null)}>Kembali ke Daftar Laporan</Button>
          </div>
          {renderPreview()}
        </div>
      )}
    </div>
  );
}
