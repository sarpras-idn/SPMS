import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, ChevronDown, Menu, Search } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime } from '@/utils/format';

export function Header({
  onToggleMobile, onLogout,
}: {
  onToggleMobile: () => void;
  onLogout: () => void;
}) {
  const { aktivitas, lastUpdated } = useApp();
  const { user } = useAuth();
  const userInitials = (user?.nama ?? '?')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const recentAktivitas = aktivitas.slice(0, 5);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-ink-100 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onToggleMobile} className="lg:hidden p-2 rounded-lg hover:bg-ink-100 text-ink-600">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-bold text-ink-900 leading-tight">SPMS</h1>
          <p className="text-[11px] text-ink-400 leading-tight">Dashboard Sarana Prasarana</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Last updated */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-50 border border-ink-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-ink-500 font-medium">Diperbarui {formatRelativeTime(lastUpdated)}</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="relative p-2.5 rounded-lg hover:bg-ink-100 text-ink-600 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-elevated border border-ink-100 animate-scale-in overflow-hidden">
              <div className="px-4 py-3 border-b border-ink-100">
                <p className="font-semibold text-sm text-ink-900">Notifikasi</p>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {recentAktivitas.map(a => (
                  <div key={a.id} className="px-4 py-3 border-b border-ink-50 hover:bg-ink-50/50 transition-colors">
                    <p className="text-xs font-semibold text-ink-800">{a.aksi}</p>
                    <p className="text-xs text-ink-500 mt-0.5 line-clamp-2">{a.deskripsi}</p>
                    <p className="text-[10px] text-ink-400 mt-1">{a.waktu}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center">
                <p className="text-xs text-brand-600 font-medium">Lihat semua aktivitas</p>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg hover:bg-ink-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
              {userInitials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-ink-900 leading-tight">{user?.nama ?? 'Pengguna'}</p>
              <p className="text-[10px] text-ink-400 leading-tight">{user?.role ?? '-'}</p>
            </div>
            <ChevronDown size={14} className="text-ink-400 hidden md:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-elevated border border-ink-100 animate-scale-in overflow-hidden">
              <div className="px-4 py-4 border-b border-ink-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                    {userInitials}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-ink-900">{user?.nama ?? 'Pengguna'}</p>
                    <p className="text-xs text-ink-400">{user?.role ?? '-'}</p>
                  </div>
                </div>
              </div>
              <div className="py-1.5">
                <div className="px-4 py-2.5 flex items-center justify-between hover:bg-ink-50 cursor-pointer">
                  <span className="text-sm text-ink-700">Profil</span>
                  <span className="text-xs text-ink-400">{user?.role ?? '-'}</span>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between hover:bg-ink-50 cursor-pointer">
                  <span className="text-sm text-ink-700">Pengaturan</span>
                </div>
              </div>
              <div className="border-t border-ink-100 p-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
