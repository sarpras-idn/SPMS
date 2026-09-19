import { useRouter } from '@/hooks/useRouter';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Package,
  Building2,
  Car,
  UsersRound,
  Wrench,
  FileText,
  FolderKanban,
  Wallet,
  Target,
  FileCheck,
  BarChart3,
  Upload,
  Settings,
  Users,
  PanelLeftClose,
  PanelLeft,
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
    items: [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'SARANA & ASET',
    items: [
      {
        label: 'Inventaris',
        path: '/inventaris',
        icon: Package,
      },
      {
        label: 'Gedung & Ruangan',
        path: '/gedung',
        icon: Building2,
      },
    ],
  },
  {
    title: 'OPERASIONAL',
    items: [
      {
        label: 'Kendaraan',
        path: '/kendaraan',
        icon: Car,
      },
      {
        label: 'Supir',
        path: '/supir',
        icon: UsersRound,
      },
      {
        label: 'Maintenance',
        path: '/maintenance',
        icon: Wrench,
      },
      {
        label: 'Pengajuan',
        path: '/pengajuan',
        icon: FileText,
      },
    ],
  },
  {
    title: 'PROGRAM',
    items: [
      {
        label: 'Proyek',
        path: '/proyek',
        icon: FolderKanban,
      },
      {
        label: 'RKA',
        path: '/rka',
        icon: Wallet,
      },
    ],
  },
  {
    title: 'PERFORMANCE',
    items: [
      {
        label: 'KPI',
        path: '/kpi',
        icon: Target,
      },
    ],
  },
  {
    title: 'DOKUMEN',
    items: [
      {
        label: 'SOP',
        path: '/sop',
        icon: FileCheck,
      },
      {
        label: 'Laporan',
        path: '/laporan',
        icon: BarChart3,
      },
      {
        label: 'Import Data',
        path: '/import-data',
        icon: Upload,
        superAdminOnly: true,
      },
    ],
  },
  {
    title: 'PENGATURAN',
    items: [
      {
        label: 'Dashboard Management',
        path: '/dashboard-management',
        icon: Settings,
        superAdminOnly: true,
      },
      {
        label: 'User & Role',
        path: '/users',
        icon: Users,
        superAdminOnly: true,
      },
    ],
  },
];

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
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
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="
            fixed inset-0
            bg-ink-950/40
            backdrop-blur-[2px]
            z-30
            lg:hidden
          "
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed lg:sticky
          top-0 left-0
          h-screen
          z-40
          flex flex-col
          text-white
          overflow-hidden
          transition-all duration-300 ease-in-out

          ${collapsed ? 'w-20' : 'w-64'}

          ${
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
        style={{
          background:
            'linear-gradient(180deg, rgba(17,24,39,0.96) 0%, rgba(15,23,42,0.94) 100%)',

          backdropFilter: 'blur(18px) saturate(120%)',
          WebkitBackdropFilter: 'blur(18px) saturate(120%)',

          borderRight:
            '1px solid rgba(255,255,255,0.08)',

          boxShadow:
            '8px 0 32px rgba(15,23,42,0.12), inset -1px 0 0 rgba(255,255,255,0.035)',
        }}
      >
        {/* =====================================================
            SUBTLE GLASS REFLECTION
            ===================================================== */}

        <div
          className="
            absolute
            inset-0
            pointer-events-none
          "
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.045) 0%, transparent 24%, transparent 70%, rgba(59,130,246,0.035) 100%)',
          }}
        />

        {/* =====================================================
            LOGO
            ===================================================== */}

        <div
          className={`
            relative
            flex
            items-center
            gap-3
            px-5
            h-16
            shrink-0
            ${collapsed ? 'justify-center' : ''}
          `}
          style={{
            borderBottom:
              '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="
              w-9
              h-9
              rounded-xl
              flex
              items-center
              justify-center
              font-extrabold
              text-white
              text-sm
              shrink-0
            "
            style={{
              background:
                'linear-gradient(145deg, #3366ff, #2855d9)',

              border:
                '1px solid rgba(255,255,255,0.16)',

              boxShadow:
                '0 6px 18px rgba(51,102,255,0.22), inset 0 1px 0 rgba(255,255,255,0.22)',
            }}
          >
            SP
          </div>

          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-extrabold text-base leading-tight tracking-tight">
                SPMS
              </p>

              <p className="text-[10px] text-ink-400 leading-tight">
                Sarana Prasarana MS
              </p>
            </div>
          )}
        </div>

        {/* =====================================================
            NAVIGATION
            ===================================================== */}

        <nav
          className="
            relative
            flex-1
            overflow-y-auto
            scrollbar-thin
            py-4
            px-3
            space-y-5
          "
        >
          {navSections.map(section => {
            const items = section.items.filter(
              item =>
                !item.superAdminOnly || isSuperAdmin
            );

            if (items.length === 0) return null;

            return (
              <div key={section.title}>
                {!collapsed && (
                  <p
                    className="
                      px-3
                      mb-1.5
                      text-[10px]
                      font-bold
                      text-ink-500
                      tracking-wider
                    "
                  >
                    {section.title}
                  </p>
                )}

                <div className="space-y-0.5">
                  {items.map(item => {
                    const active =
                      path === item.path ||
                      (
                        item.path !== '/dashboard' &&
                        path.startsWith(item.path)
                      );

                    const Icon = item.icon;

                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          onCloseMobile();
                        }}
                        title={
                          collapsed
                            ? item.label
                            : undefined
                        }
                        className={`
                          group
                          relative
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          rounded-lg
                          text-sm
                          font-medium
                          transition-all
                          duration-200

                          ${collapsed ? 'justify-center' : ''}

                          ${
                            active
                              ? 'text-white'
                              : 'text-ink-300 hover:text-white'
                          }
                        `}
                        style={
                          active
                            ? {
                                background:
                                  'linear-gradient(135deg, rgba(51,102,255,0.88), rgba(51,102,255,0.72))',

                                border:
                                  '1px solid rgba(147,197,253,0.16)',

                                boxShadow:
                                  '0 6px 18px rgba(51,102,255,0.16), inset 0 1px 0 rgba(255,255,255,0.12)',
                              }
                            : undefined
                        }
                      >
                        {!active && (
                          <span
                            className="
                              absolute
                              inset-0
                              rounded-lg
                              bg-white/[0.035]
                              opacity-0
                              group-hover:opacity-100
                              transition-opacity
                            "
                          />
                        )}

                        <Icon
                          size={18}
                          className={`
                            relative
                            shrink-0
                            transition-all
                            duration-200

                            ${
                              active
                                ? 'text-white'
                                : 'text-ink-400 group-hover:text-white'
                            }

                            group-hover:scale-[1.03]
                          `}
                        />

                        {!collapsed && (
                          <span className="relative truncate">
                            {item.label}
                          </span>
                        )}

                        {active && !collapsed && (
                          <span
                            className="
                              absolute
                              right-2
                              w-1.5
                              h-1.5
                              rounded-full
                              bg-white/80
                            "
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* =====================================================
            COLLAPSE
            ===================================================== */}

        <div
          className="
            relative
            p-3
            shrink-0
            hidden
            lg:block
          "
          style={{
            borderTop:
              '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <button
            onClick={onToggleCollapse}
            className="
              group
              relative
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-lg
              text-sm
              font-medium
              text-ink-300
              hover:text-white
              transition-all
              duration-200
            "
          >
            <span
              className="
                absolute
                inset-0
                rounded-lg
                bg-white/[0.035]
                opacity-0
                group-hover:opacity-100
                transition-opacity
              "
            />

            {collapsed ? (
              <PanelLeft
                size={18}
                className="
                  relative
                  mx-auto
                  group-hover:scale-[1.03]
                  transition-transform
                "
              />
            ) : (
              <>
                <PanelLeftClose
                  size={18}
                  className="
                    relative
                    shrink-0
                    group-hover:scale-[1.03]
                    transition-transform
                  "
                />

                <span className="relative">
                  Ciutkan Menu
                </span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}