import { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/hooks/useRouter';

export function LoginPage() {
  const { login, loading } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tidak dapat terhubung ke server.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3366ff 0%, transparent 50%), radial-gradient(circle at 80% 80%, #10b981 0%, transparent 40%)' }} />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center font-extrabold text-lg">SP</div>
            <div>
              <p className="font-extrabold text-lg tracking-tight">SPMS</p>
              <p className="text-xs text-ink-400">Sarana Prasarana Management System</p>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">Sistem Informasi<br />Manajemen Sarana<br />Prasarana IDN</h1>
            <p className="text-ink-400 mt-4 max-w-md leading-relaxed">Platform terintegrasi untuk pengelolaan, monitoring, dan evaluasi sarana prasarana IDN. Prototype resmi Bidang Sarana Prasarana.</p>
            <div className="flex items-center gap-6 mt-8">
              <div>
                <p className="text-3xl font-extrabold">27+</p>
                <p className="text-xs text-ink-400">Aset Terdaftar</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">5</p>
                <p className="text-xs text-ink-400">Kendaraan Operasional</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">24</p>
                <p className="text-xs text-ink-400">Program RKA</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <ShieldCheck size={14} />
            <span>Periode 2026 — Bidang Sarana Prasarana IDN</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-ink-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center font-extrabold text-white text-lg">SP</div>
            <div>
              <p className="font-extrabold text-lg text-ink-900">SPMS</p>
              <p className="text-xs text-ink-400">Sarana Prasarana Management System</p>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-ink-900">Selamat Datang</h2>
          <p className="text-sm text-ink-500 mt-1">Masuk ke akun SPMS Anda untuk melanjutkan</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" placeholder="email@idn.sch.id" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" placeholder="••••••••" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-all disabled:opacity-50">
              {loading ? 'Memproses...' : <>Masuk <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-ink-100/50 border border-ink-100">
            <p className="text-xs text-ink-500">Hanya Super Admin yang dapat membuat akun baru melalui menu User &amp; Role.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
