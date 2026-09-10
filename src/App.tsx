import { useState, useEffect } from 'react';
import { AppProvider } from '@/hooks/useAppStore';
import { RouterProvider, useRouter } from '@/hooks/useRouter';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToastContainer } from '@/components/ui/Toast';
import { DashboardPage } from '@/pages/DashboardPage';
import { InventarisPage } from '@/pages/InventarisPage';
import { GedungPage } from '@/pages/GedungPage';
import { KendaraanPage } from '@/pages/KendaraanPage';
import { MaintenancePage } from '@/pages/MaintenancePage';
import { PengajuanPage } from '@/pages/PengajuanPage';
import { ProyekPage } from '@/pages/ProyekPage';
import { RKAPage } from '@/pages/RKAPage';
import { KPIPage } from '@/pages/KPIPage';
import { SOPPage } from '@/pages/SOPPage';
import { LaporanPage } from '@/pages/LaporanPage';
import { ImportDataPage } from '@/pages/ImportDataPage';
import { DashboardManagementPage } from '@/pages/DashboardManagementPage';
import { UsersPage } from '@/pages/UsersPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const routes: Record<string, () => JSX.Element | null> = {
  '/dashboard': DashboardPage,
  '/inventaris': InventarisPage,
  '/gedung': GedungPage,
  '/kendaraan': KendaraanPage,
  '/maintenance': MaintenancePage,
  '/pengajuan': PengajuanPage,
  '/proyek': ProyekPage,
  '/rka': RKAPage,
  '/kpi': KPIPage,
  '/sop': SOPPage,
  '/laporan': LaporanPage,
  '/import-data': ImportDataPage,
  '/dashboard-management': DashboardManagementPage,
  '/users': UsersPage,
};

const SUPER_ADMIN_ROUTES = ['/users', '/dashboard-management', '/import-data'];

function AppContent() {
  const { path, replace } = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user && path !== '/login') {
      replace('/login');
      return;
    }
    if (user && path === '/login') {
      replace('/dashboard');
      return;
    }
    if (user && user.role !== 'Super Admin' && SUPER_ADMIN_ROUTES.includes(path)) {
      replace('/dashboard');
    }
  }, [user, path, replace]);

  if (!user || path === '/login') {
    if (path === '/login' && user) return null;
    return <LoginPage />;
  }

  const Page = routes[path];
  const pageContent = Page ? <Page /> : <NotFoundPage />;

  return (
    <div className="flex min-h-screen bg-ink-100">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleMobile={() => setMobileOpen(o => !o)}
          onLogout={() => { logout(); replace('/login'); }}
        />
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">
          {pageContent}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <AppProvider>
        <AppContent />
        <ToastContainer />
      </AppProvider>
    </RouterProvider>
  );
}

export default App;
