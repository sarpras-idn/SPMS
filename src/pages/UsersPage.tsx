import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, AlertCircle, Plus } from 'lucide-react';
import { PageHeader, Card, Button, Input, Modal, Badge, EmptyState } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from '@/hooks/useRouter';
import { useApp } from '@/hooks/useAppStore';
import { getUsers, createUser } from '@/api/users';
import type { CreateUserPayload } from '@/api/users';
import type { User } from '@/types';

const roleOptions = ['Super Admin', 'Admin Cabang'];
const statusOptions = ['Aktif', 'Nonaktif'];
const unitOptions = [
  'Kantor Yayasan',
  'IDN Jonggol Ikhwan',
  'IDN Jonggol Akhwat',
  'IDN Pamijahan',
  'IDN Sentul',
  'IDN Solo',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { replace } = useRouter();
  const { pushToast } = useApp();
  const isSuperAdmin = currentUser?.role === 'Super Admin';

  useEffect(() => {
    if (!isSuperAdmin) {
      replace('/dashboard');
    }
  }, [isSuperAdmin, replace]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.nama.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || u.role === filterRole;
    return matchSearch && matchRole;
  });

  if (!isSuperAdmin) {
    return null;
  }

  const roleBadge = (role: string) => {
    if (role === 'Super Admin') return <Badge variant="brand">{role}</Badge>;
    if (role === 'Admin Cabang') return <Badge variant="info">{role}</Badge>;
    return <Badge variant="neutral">{role}</Badge>;
  };

  const handleCreate = async (payload: CreateUserPayload) => {
    setSaving(true);
    try {
      await createUser(payload);
      pushToast('User berhasil dibuat.');
      setModalOpen(false);
      await load();
    } catch (err) {
      pushToast(err instanceof Error ? err.message : 'Gagal membuat user.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="User & Role" subtitle="Manajemen pengguna dan hak akses sistem"
        breadcrumb={['SPMS', 'Pengaturan', 'User & Role']}
        actions={isSuperAdmin && (
          <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Tambah User</Button>
        )} />

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari user..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Semua Role</option>
            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
            {loading ? 'Memuat data...' : `${users.length} pengguna terdaftar`}
          </span>
          <button onClick={load} disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-600 border border-ink-200 hover:bg-ink-50 disabled:opacity-50 transition-colors">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {error ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-3">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <p className="text-sm font-semibold text-ink-800">Gagal memuat data pengguna</p>
            <p className="text-xs text-ink-500 mt-1 max-w-sm">{error}</p>
            <button onClick={load} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors">
              <RefreshCw size={14} /> Coba lagi
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/50">
                  <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Unit</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-12"><div className="flex items-center justify-center gap-2 text-sm text-ink-400"><RefreshCw size={16} className="animate-spin" /> Memuat data pengguna...</div></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState message="Belum ada data pengguna." /></td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id} className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                          {u.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <span className="font-semibold text-ink-800">{u.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-600 text-xs">{u.email}</td>
                    <td className="px-4 py-3">{roleBadge(u.role)}</td>
                    <td className="px-4 py-3 text-ink-600 text-xs">{u.unit}</td>
                    <td className="px-4 py-3"><Badge variant={u.status === 'Aktif' ? 'success' : 'neutral'}>{u.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && (
          <div className="px-4 py-3 border-t border-ink-100 text-xs text-ink-500">Menampilkan {filtered.length} dari {users.length} user</div>
        )}
      </Card>

      {modalOpen && (
        <UserForm
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}

function UserForm({
  saving, onClose, onSubmit,
}: {
  saving: boolean;
  onClose: () => void;
  onSubmit: (d: CreateUserPayload) => void;
}) {
  const [form, setForm] = useState({
    nama: '',
    email: '',
    role: '',
    unit: '',
    status: '',
    password: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));
  const markTouched = (k: keyof typeof form) => setTouched(prev => ({ ...prev, [k]: true }));

  const errors: Partial<Record<keyof typeof form, string>> = {};
  if (!form.nama.trim()) errors.nama = 'Nama wajib diisi.';
  if (!form.email.trim()) errors.email = 'Email wajib diisi.';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Format email tidak valid.';
  if (!form.role) errors.role = 'Role wajib dipilih.';
  if (!form.unit) errors.unit = 'Unit wajib dipilih.';
  if (!form.status) errors.status = 'Status wajib dipilih.';
  if (!form.password) errors.password = 'Password wajib diisi.';

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = () => {
    setTouched({ nama: true, email: true, role: true, unit: true, status: true, password: true });
    if (!isValid) return;
    onSubmit({
      nama: form.nama.trim(),
      email: form.email.trim(),
      role: form.role,
      unit: form.unit,
      status: form.status,
      password: form.password,
    });
  };

  return (
    <Modal open onClose={onClose} title="Tambah User" size="md"
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={saving}>Batal</Button>
        <Button onClick={handleSubmit} disabled={saving || !isValid}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </>}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Input label="Nama Lengkap" value={form.nama} onChange={v => set('nama', v)} required /></div>
        <div className="col-span-2">
          <Input label="Email" type="email" value={form.email} onChange={v => set('email', v)} required />
          {touched.email && errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <Input label="Role" value={form.role} onChange={v => set('role', v)} options={roleOptions} required />
        <Input label="Unit" value={form.unit} onChange={v => set('unit', v)} options={unitOptions} required />
        <Input label="Status" value={form.status} onChange={v => set('status', v)} options={statusOptions} required />
        <div>
          <Input label="Password" type="password" value={form.password} onChange={v => set('password', v)} required />
          {touched.password && errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>
      </div>
    </Modal>
  );
}
