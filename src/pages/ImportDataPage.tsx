import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, FileUp } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, CardHeader, Button, Badge } from '@/components/ui';

const importTypes = [
  { key: 'aset', label: 'Import Data Aset', desc: 'Format: Kode, Nama, Kategori, Lokasi, Jumlah, Kondisi, Nilai' },
  { key: 'kendaraan', label: 'Import Data Kendaraan', desc: 'Format: Kode, Nama, No Polisi, Merek, Tahun, Status' },
  { key: 'rka', label: 'Import Data RKA', desc: 'Format: Kode, Program, Kategori, Anggaran, Realisasi' },
  { key: 'kpi', label: 'Import Data KPI', desc: 'Format: Kode, Indikator, Target, Realisasi, Status' },
];

export function ImportDataPage() {
  const { pushToast } = useApp();
  const [selectedType, setSelectedType] = useState<string>('aset');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [imported, setImported] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setImported(false);
    setErrors([]);
    setPreview([]);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(r => r.trim()).map(r => r.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
      if (rows.length === 0) {
        setErrors(['File CSV kosong']);
        return;
      }
      const errs: string[] = [];
      const header = rows[0];
      const expectedCols = importTypes.find(t => t.key === selectedType)?.desc.split(': ')[1].split(',').length || 0;
      rows.forEach((row, i) => {
        if (row.length < expectedCols) errs.push(`Baris ${i + 1}: kolom tidak lengkap (diharapkan ${expectedCols}, ditemukan ${row.length})`);
        row.forEach((cell, j) => { if (!cell) errs.push(`Baris ${i + 1}, Kolom ${j + 1}: nilai kosong`); });
      });
      setErrors(errs);
      setPreview(rows.slice(0, 6));
    };
    reader.readAsText(f);
  };

  const handleImport = () => {
    if (errors.length > 0) {
      pushToast('Terdapat error validasi. Periksa kembali data.', 'error');
      return;
    }
    setImported(true);
    pushToast('Data berhasil diimport.', 'success');
  };

  const reset = () => {
    setFile(null); setPreview([]); setErrors([]); setImported(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <PageHeader title="Import Data" subtitle="Import data dari file CSV ke sistem SPMS"
        breadcrumb={['SPMS', 'Dokumen', 'Import Data']} />

      {/* Type selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {importTypes.map(t => (
          <button key={t.key} onClick={() => { setSelectedType(t.key); reset(); }}
            className={`text-left p-4 rounded-2xl border transition-all ${selectedType === t.key ? 'border-brand-500 bg-brand-50/50 shadow-card' : 'border-ink-100 bg-white hover:border-brand-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedType === t.key ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'}`}>
                <FileSpreadsheet size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm text-ink-900">{t.label}</p>
              </div>
            </div>
            <p className="text-xs text-ink-400 mt-2">{t.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upload */}
        <Card className="p-5">
          <CardHeader title="Upload File CSV" subtitle="Pilih file CSV untuk diimport" />
          <div className="mt-4">
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-ink-200 rounded-2xl p-10 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all"
            >
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                  <p className="font-semibold text-ink-800 text-sm">{file.name}</p>
                  <p className="text-xs text-ink-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-ink-100 flex items-center justify-center">
                    <Upload size={22} className="text-ink-400" />
                  </div>
                  <p className="font-semibold text-ink-700 text-sm">Klik untuk memilih file CSV</p>
                  <p className="text-xs text-ink-400">atau drag & drop file ke sini</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div className="flex items-center gap-2 mt-4">
              <Button onClick={handleImport} disabled={!file || errors.length > 0}><FileUp size={15} /> Import Data</Button>
              {file && <Button variant="secondary" onClick={reset}>Reset</Button>}
            </div>
            {imported && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-700">Data berhasil diimport ke sistem</p>
              </div>
            )}
          </div>
        </Card>

        {/* Validation */}
        <Card className="p-5">
          <CardHeader title="Validasi & Error" subtitle="Hasil pengecekan data" />
          <div className="mt-4">
            {errors.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                {errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-100">
                    <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{err}</p>
                  </div>
                ))}
              </div>
            ) : file ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-700">Validasi berhasil. Tidak ada error.</p>
              </div>
            ) : (
              <div className="text-center py-10 text-ink-400">
                <p className="text-sm">Belum ada file diupload</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <Card className="mt-4 overflow-hidden">
          <CardHeader title="Preview Data" subtitle={`${preview.length} baris ditampilkan`} action={<Badge variant="brand">Preview</Badge>} />
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/50">
                  {preview[0].map((h, i) => <th key={i} className="text-left px-4 py-2 text-xs font-bold text-ink-500 uppercase">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {preview.slice(1).map((row, i) => (
                  <tr key={i} className="border-b border-ink-50">
                    {row.map((cell, j) => <td key={j} className="px-4 py-2 text-ink-700">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
