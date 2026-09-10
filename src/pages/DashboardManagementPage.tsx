import { useState } from 'react';
import { Eye, EyeOff, GripVertical, RotateCcw, Save, Shield } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { PageHeader, Card, CardHeader, Button, ConfirmDialog } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import type { WidgetConfig } from '@/types';

export function DashboardManagementPage() {
  const { widgets, toggleWidget, reorderWidgets, resetData, pushToast } = useApp();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  const handleDragStart = (i: number) => setDragIndex(i);
  const handleDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setDragOverIndex(i); };
  const handleDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) return;
    const newWidgets = [...widgets];
    const [moved] = newWidgets.splice(dragIndex, 1);
    newWidgets.splice(i, 0, moved);
    reorderWidgets(newWidgets);
    setOrderChanged(true);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleSaveOrder = () => {
    pushToast('Konfigurasi dashboard berhasil disimpan.', 'success');
    setOrderChanged(false);
  };

  const handleReset = () => {
    resetData();
    pushToast('Data demo berhasil direset ke kondisi awal.', 'success');
  };

  const visibleCount = widgets.filter(w => w.visible).length;

  return (
    <div>
      <PageHeader title="Dashboard Management" subtitle="Konfigurasi widget dashboard untuk Super Admin"
        breadcrumb={['SPMS', 'Pengaturan', 'Dashboard Management']}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setResetOpen(true)}><RotateCcw size={15} /> Reset Data Demo</Button>
            <Button onClick={handleSaveOrder} disabled={!orderChanged}><Save size={15} /> Simpan Urutan</Button>
          </div>
        }
      />

      {/* Access notice */}
      <div className="mb-4 flex items-center gap-3 p-4 rounded-xl bg-brand-50 border border-brand-100">
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
          <Shield size={20} />
        </div>
        <div>
          <p className="font-semibold text-ink-800 text-sm">Akses Super Admin</p>
          <p className="text-xs text-ink-500">Hanya Super Admin yang dapat mengatur widget dashboard. User: M. Yusuf Badru Tamam</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-xs font-bold text-ink-400 uppercase">Total Widget</p>
          <p className="text-2xl font-extrabold text-ink-900 mt-1">{widgets.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-bold text-ink-400 uppercase">Widget Aktif</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{visibleCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-bold text-ink-400 uppercase">Widget Disembunyikan</p>
          <p className="text-2xl font-extrabold text-ink-400 mt-1">{widgets.length - visibleCount}</p>
        </Card>
      </div>

      {/* Widget list */}
      <Card>
        <CardHeader title="Dashboard Widget Management" subtitle="Drag & drop untuk mengatur urutan, toggle untuk menampilkan/sembunyikan" />
        <div className="p-4 space-y-2">
          {widgets.map((w, i) => (
            <div
              key={w.key}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                dragOverIndex === i ? 'border-brand-400 bg-brand-50/50' : 'border-ink-100 bg-white'
              } ${dragIndex === i ? 'opacity-50' : ''}`}
            >
              <div className="cursor-grab active:cursor-grabbing text-ink-300 hover:text-ink-500">
                <GripVertical size={18} />
              </div>
              <div className="w-7 h-7 rounded-lg bg-ink-100 flex items-center justify-center text-xs font-bold text-ink-500">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-ink-800">{w.label}</p>
                <p className="text-xs text-ink-400">Widget: {w.key}</p>
              </div>
              <Badge variant={w.visible ? 'success' : 'neutral'}>{w.visible ? 'Tampil' : 'Sembunyi'}</Badge>
              <button
                onClick={() => toggleWidget(w.key)}
                className={`p-2 rounded-lg transition-colors ${w.visible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-ink-400 hover:bg-ink-100'}`}
                title={w.visible ? 'Sembunyikan' : 'Tampilkan'}
              >
                {w.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset Data Demo"
        message="Apakah Anda yakin ingin mengembalikan seluruh data ke kondisi awal?"
        confirmText="Reset Data"
        variant="warning"
      />
    </div>
  );
}
