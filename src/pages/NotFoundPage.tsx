import { Compass, ArrowLeft } from 'lucide-react';
import { useRouter } from '@/hooks/useRouter';

export function NotFoundPage() {
  const { navigate } = useRouter();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center mb-6">
        <Compass size={36} className="text-brand-600" />
      </div>
      <p className="text-6xl font-extrabold text-ink-900 tracking-tight">404</p>
      <h1 className="text-xl font-bold text-ink-800 mt-3">Halaman Tidak Ditemukan</h1>
      <p className="text-sm text-ink-500 mt-2 max-w-md">Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. Silakan kembali ke dashboard.</p>
      <button onClick={() => navigate('/dashboard')}
        className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-all">
        <ArrowLeft size={16} /> Kembali ke Dashboard
      </button>
    </div>
  );
}
