import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, UserRound } from 'lucide-react';
import { useApp } from '@/hooks/useAppStore';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Modal,
  ConfirmDialog,
  EmptyState,
} from '@/components/ui';
import { Badge, statusBadge } from '@/components/ui/Badge';
import type { Driver } from '@/api/drivers';

const statusOptions = [
  'Aktif',
  'Tidak Aktif',
];

const cabangOptions = [
  'Jonggol',
  'Pamijahan',
  'Sentul',
  'Solo',
];

export function SupirPage() {
  const {
    drivers,
    driversLoading,
    driversError,
    driversSaving,
    addDriver,
    updateDriver,
    deleteDriver,
    pushToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterCabang, setFilterCabang] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Driver | null>(null);

  const filtered = useMemo(
    () =>
      drivers.filter(driver => {
        const searchValue = search.toLowerCase();

        const matchSearch =
          !search ||
          driver.namaSupir.toLowerCase().includes(searchValue) ||
          driver.kodeSupir.toLowerCase().includes(searchValue) ||
          driver.cabang.toLowerCase().includes(searchValue) ||
          driver.nomorHP.toLowerCase().includes(searchValue);

        const matchCabang =
          !filterCabang ||
          driver.cabang === filterCabang;

        const matchStatus =
          !filterStatus ||
          driver.status === filterStatus;

        return (
          matchSearch &&
          matchCabang &&
          matchStatus
        );
      }),
    [
      drivers,
      search,
      filterCabang,
      filterStatus,
    ]
  );

  const handleSave = async (
    data: Omit<Driver, 'id' | 'kodeSupir'>
  ) => {
    const error = editing
      ? await updateDriver(editing.id, data)
      : await addDriver(data);

    if (error) {
      pushToast(error, 'error');
      return;
    }

    pushToast(
      editing
        ? 'Data supir berhasil diperbarui.'
        : 'Data supir berhasil ditambahkan.',
      'success'
    );

    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const error = await deleteDriver(deleteId);

    if (error) {
      pushToast(error, 'error');
      return;
    }

    pushToast(
      'Data supir berhasil dihapus.',
      'success'
    );

    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader
        title="Supir"
        subtitle="Manajemen data supir operasional IDN"
        breadcrumb={[
          'SPMS',
          'Operasional',
          'Supir',
        ]}
        actions={
          <Button
            disabled={driversSaving}
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus size={16} />
            Tambah Supir
          </Button>
        }
      />

      {/* FILTER */}
      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* SEARCH */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300"
            />

            <input
              type="text"
              value={search}
              onChange={e =>
                setSearch(e.target.value)
              }
              placeholder="Cari supir..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            />
          </div>

          {/* CABANG */}
          <select
            value={filterCabang}
            onChange={e =>
              setFilterCabang(e.target.value)
            }
            className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">
              Semua Cabang
            </option>

            {cabangOptions.map(cabang => (
              <option
                key={cabang}
                value={cabang}
              >
                {cabang}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            value={filterStatus}
            onChange={e =>
              setFilterStatus(e.target.value)
            }
            className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">
              Semua Status
            </option>

            {statusOptions.map(status => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* ERROR */}
      {driversError && (
        <Card className="mb-4 p-4 border border-red-200 bg-red-50">
          <p className="text-sm font-semibold text-red-700">
            Gagal memuat data supir
          </p>

          <p className="text-xs text-red-600 mt-1">
            {driversError}
          </p>
        </Card>
      )}

      {/* TABLE */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">

                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">
                  Kode
                </th>

                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">
                  Nama Supir
                </th>

                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">
                  Cabang
                </th>

                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">
                  No. HP
                </th>

                <th className="text-left px-4 py-3 text-xs font-bold text-ink-500 uppercase">
                  Status
                </th>

                <th className="text-center px-4 py-3 text-xs font-bold text-ink-500 uppercase">
                  Aksi
                </th>

              </tr>
            </thead>

            <tbody>
              {driversLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center"
                  >
                    <div className="text-sm text-ink-500">
                      Memuat data supir...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState message="Tidak ada data supir" />
                  </td>
                </tr>
              ) : (
                filtered.map(driver => {
                  const statusBdg =
                    statusBadge(driver.status);

                  return (
                    <tr
                      key={driver.id}
                      className="border-b border-ink-50 hover:bg-ink-50/30 transition-colors"
                    >

                      {/* KODE */}
                      <td className="px-4 py-3 font-mono text-xs text-ink-600">
                        {driver.kodeSupir}
                      </td>

                      {/* NAMA */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">

                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <UserRound size={15} />
                          </div>

                          <div>
                            <p className="font-semibold text-ink-800">
                              {driver.namaSupir}
                            </p>

                            <p className="text-xs text-ink-400">
                              Driver Operasional
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* CABANG */}
                      <td className="px-4 py-3 text-ink-600">
                        {driver.cabang}
                      </td>

                      {/* NOMOR HP */}
                      <td className="px-4 py-3 font-mono text-xs text-ink-700">
                        {driver.nomorHP}
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3">
                        <Badge variant={statusBdg.variant}>
                          {driver.status}
                        </Badge>
                      </td>

                      {/* AKSI */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">

                          <button
                            disabled={driversSaving}
                            onClick={() => {
                              setEditing(driver);
                              setModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-ink-400 hover:bg-brand-50 hover:text-brand-600 transition-colors disabled:opacity-50"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            disabled={driversSaving}
                            onClick={() =>
                              setDeleteId(driver.id)
                            }
                            className="p-1.5 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Hapus"
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="px-4 py-3 border-t border-ink-100 text-xs text-ink-500">
          Menampilkan {filtered.length} dari {drivers.length} supir
        </div>
      </Card>

      {/* FORM */}
      {modalOpen && (
        <SupirForm
          editing={editing}
          saving={driversSaving}
          onClose={() => {
            if (driversSaving) return;

            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* DELETE */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => {
          if (!driversSaving) {
            setDeleteId(null);
          }
        }}
        onConfirm={handleDelete}
        title="Hapus Supir"
        message="Apakah Anda yakin ingin menghapus data supir ini?"
        confirmText={
          driversSaving
            ? 'Menghapus...'
            : 'Hapus'
        }
      />
    </div>
  );
}


/* =====================================================
   FORM SUPIR
===================================================== */

function SupirForm({
  editing,
  saving,
  onClose,
  onSave,
}: {
  editing: Driver | null;
  saving: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<Driver, 'id' | 'kodeSupir'>
  ) => Promise<void>;
}) {
  const [form, setForm] = useState<
    Omit<Driver, 'id' | 'kodeSupir'>
  >({
    namaSupir:
      editing?.namaSupir || '',

    cabang:
      editing?.cabang ||
      cabangOptions[0],

    nomorHP:
      editing?.nomorHP || '',

    status:
      editing?.status || 'Aktif',
  });

  const set = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={
        editing
          ? 'Edit Supir'
          : 'Tambah Supir'
      }
      size="md"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Batal
          </Button>

          <Button
            onClick={() => onSave(form)}
            disabled={saving}
          >
            {saving
              ? 'Menyimpan...'
              : 'Simpan'}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4">

        {/* KODE */}
        <div>
          <Input
            label="Kode Supir"
            value={
              editing?.kodeSupir ||
              'Otomatis oleh sistem'
            }
            onChange={() => {}}
            disabled
          />

          {!editing && (
            <p className="text-[11px] text-ink-400 mt-1">
              Kode akan dibuat otomatis oleh sistem.
            </p>
          )}
        </div>

        {/* NAMA */}
        <Input
          label="Nama Supir"
          value={form.namaSupir}
          onChange={v =>
            set('namaSupir', v)
          }
          required
        />

        {/* CABANG */}
        <Input
          label="Cabang"
          value={form.cabang}
          onChange={v =>
            set('cabang', v)
          }
          options={cabangOptions}
          required
        />

        {/* NOMOR HP */}
        <Input
          label="Nomor HP"
          value={form.nomorHP}
          onChange={v =>
            set('nomorHP', v)
          }
          required
        />

        {/* STATUS */}
        <Input
          label="Status"
          value={form.status}
          onChange={v =>
            set('status', v)
          }
          options={statusOptions}
        />

      </div>
    </Modal>
  );
}