import { useState } from 'react';
import { useRouter } from '@/hooks/useRouter';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, Package, Building2, Car, Wrench, FileText, FolderKanban,
  Wallet, Target, FileCheck, BarChart3, Upload, Settings, Users,
  ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  superAdminOnly?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'BERANDA',
    items: [{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'SARANA & ASET',
    items: [
      { label: 'Inventaris', path: '/inventaris', icon: Package },
      { label: 'Gedung & Ruangan', path: '/gedung', icon: Building2 },
    ],
  },
  {
    title: 'OPERASIONAL',
    items: [
      { label: 'Kendaraan', path: '/kendaraan', icon: Car },
      { label: 'Maintenance', path: '/maintenance', icon: Wrench },
      { label: 'Pengajuan', path: '/pengajuan', icon: FileText },
    ],
  },
  {
    title: 'PROGRAM',
    items: [
      { label: 'Proyek', path: '/proyek', icon: FolderKanban },
      { label: 'RKA', path: '/rka', icon: Wallet },
    ],
  },
  {
    title: 'PERFORMANCE',
    items: [{ label: 'KPI', path: '/kpi', icon: Target }],
  },
  {
    title: 'DOKUMEN',
    items: [
      { label: 'SOP', path: '/sop', icon: FileCheck },
      { label: 'Laporan', path: '/laporan', icon: BarChart3 },
      { label: 'Import Data', path: '/import-data', icon: Upload, superAdminOnly: true },
    ],
  },
  {
    title: 'PENGATURAN',
    items: [
      { label: 'Dashboard Management', path: '/dashboard-management', icon: Settings, superAdminOnly: true },
      { label: 'User & Role', path: '/users', icon: Users, superAdminOnly: true },
    ],
  },
];

export function Sidebar({
  collapsed, onToggleCollapse, mobileOpen, onCloseMobile,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const { path, navigate } = useRouter();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'Super Admin';

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink-950/40 z-30 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-40
        bg-ink-950 text-white flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 h-16 border-b border-white/5 shrink-0 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center font-extrabold text-white text-sm shrink-0">
            SP
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-extrabold text-base leading-tight tracking-tight">SPMS</p>
              <p className="text-[10px] text-ink-400 leading-tight">Sarana Prasarana MS</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-5">
          {navSections.map(section => {
            const items = section.items.filter(item => !item.superAdminOnly || isSuperAdmin);
            if (items.length === 0) return null;
            return (
            <div key={section.title}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-bold text-ink-500 tracking-wider">{section.title}</p>
              )}
              <div className="space-y-0.5">
                {items.map(item => {
                  const active = path === item.path || (item.path !== '/dashboard' && path.startsWith(item.path));
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); onCloseMobile(); }}
                      title={collapsed ? item.label : undefined}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                        ${collapsed ? 'justify-center' : ''}
                        ${active
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-ink-300 hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-white/5 shrink-0 hidden lg:block">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-white transition-all"
          >
            {collapsed ? <PanelLeft size={18} className="mx-auto" /> : (
              <>
                <PanelLeftClose size={18} />
                <span>Ciutkan Menu</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
