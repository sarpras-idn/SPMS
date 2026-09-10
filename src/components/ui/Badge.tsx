import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';

const variants: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-ink-100 text-ink-600 border-ink-200',
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
};

export function Badge({ variant = 'neutral', children }: { variant?: BadgeVariant; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function statusBadge(status: string): { variant: BadgeVariant; label: string } {
  const map: Record<string, BadgeVariant> = {
    'Aktif': 'success', 'Tersedia': 'success', 'Selesai': 'success', 'Disetujui': 'success', 'Tercapai': 'success', 'Berlaku': 'success',
    'Maintenance': 'warning', 'Digunakan': 'warning', 'Diproses': 'warning', 'Perlu Servis': 'warning', 'Revisi': 'warning', 'Perencanaan': 'warning', 'Berjalan': 'warning', 'On Track': 'info',
    'Tidak Aktif': 'error', 'Ditolak': 'error', 'Rusak Berat': 'error',
    'Menunggu': 'neutral', 'Ditunda': 'neutral', 'Belum Mulai': 'neutral', 'Berakhir': 'neutral',
    'Baik': 'success', 'Baik + Perawatan': 'info', 'Rusak Ringan': 'warning',
    'Urgent': 'error', 'Tinggi': 'warning', 'Sedang': 'info', 'Rendah': 'neutral',
    'Perlu Perhatian': 'warning',
  };
  return { variant: map[status] || 'neutral', label: status };
}
