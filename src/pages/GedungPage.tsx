import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Building2,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  DoorOpen,
} from 'lucide-react';

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

import type {
  Building,
  Floor,
  Room,
} from '@/api/locations';

import {
  createBuilding,
  updateBuilding,
  deleteBuilding,
  createFloor,
  updateFloor,
  deleteFloor,
  createRoom,
  updateRoom,
  deleteRoom,
} from '@/api/locations';


/* =====================================================
   MAIN PAGE
===================================================== */

export function GedungPage() {
  const {
    branches,
    areas,
    buildings,
    floors,
    rooms,
    fetchLocations,
    locationsLoading,
    locationsError,
    pushToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterArea, setFilterArea] = useState('');

  const [selectedBuilding, setSelectedBuilding] =
    useState<Building | null>(null);

  const [buildingModalOpen, setBuildingModalOpen] =
    useState(false);

  const [editingBuilding, setEditingBuilding] =
    useState<Building | null>(null);

  const [deleteBuildingId, setDeleteBuildingId] =
    useState<string | null>(null);

  const [floorModalOpen, setFloorModalOpen] =
    useState(false);

  const [editingFloor, setEditingFloor] =
    useState<Floor | null>(null);

  const [deleteFloorId, setDeleteFloorId] =
    useState<string | null>(null);

  const [roomModalOpen, setRoomModalOpen] =
    useState(false);

  const [editingRoom, setEditingRoom] =
    useState<Room | null>(null);

  const [selectedFloorId, setSelectedFloorId] =
    useState<string | null>(null);

  const [deleteRoomId, setDeleteRoomId] =
    useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);


  /* =====================================================
     FILTER AREA
  ===================================================== */

  const filteredAreas = useMemo(() => {
    if (!filterBranch) return areas;

    return areas.filter(
      area => area.branchId === filterBranch
    );
  }, [areas, filterBranch]);


  /* =====================================================
     FILTER BUILDINGS
  ===================================================== */

  const filteredBuildings = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return buildings.filter(building => {
      const area = areas.find(
        item => item.id === building.areaId
      );

      const branch = branches.find(
        item => item.id === area?.branchId
      );

      const matchSearch =
        !keyword ||
        building.namaBangunan
          .toLowerCase()
          .includes(keyword) ||
        building.kodeBangunan
          .toLowerCase()
          .includes(keyword) ||
        building.tipeBangunan
          .toLowerCase()
          .includes(keyword) ||
        area?.namaArea
          ?.toLowerCase()
          .includes(keyword) ||
        branch?.namaCabang
          ?.toLowerCase()
          .includes(keyword);

      const matchBranch =
        !filterBranch ||
        area?.branchId === filterBranch;

      const matchArea =
        !filterArea ||
        building.areaId === filterArea;

      return (
        matchSearch &&
        matchBranch &&
        matchArea
      );
    });
  }, [
    buildings,
    areas,
    branches,
    search,
    filterBranch,
    filterArea,
  ]);


  /* =====================================================
     BUILDING
  ===================================================== */

  const openAddBuilding = () => {
    setEditingBuilding(null);
    setBuildingModalOpen(true);
  };

  const openEditBuilding = (building: Building) => {
    setEditingBuilding(building);
    setBuildingModalOpen(true);
  };

  const closeBuildingModal = () => {
    setBuildingModalOpen(false);
    setEditingBuilding(null);
  };

  const handleBuildingSaved = async () => {
    closeBuildingModal();
    await fetchLocations();
  };

  const handleDeleteBuilding = async (id: string) => {
    try {
      await deleteBuilding(id);

      pushToast(
        'Data gedung berhasil dihapus.',
        'success'
      );

      setDeleteBuildingId(null);

      await fetchLocations();

      if (selectedBuilding?.id === id) {
        setSelectedBuilding(null);
      }
    } catch (err) {
      pushToast(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus data gedung.',
        'error'
      );
    }
  };


  /* =====================================================
     FLOOR
  ===================================================== */

  const buildingFloors = useMemo(() => {
    if (!selectedBuilding) return [];

    return floors
      .filter(
        floor =>
          floor.buildingId === selectedBuilding.id
      )
      .sort(
        (a, b) =>
          Number(a.urutan || 0) -
          Number(b.urutan || 0)
      );
  }, [floors, selectedBuilding]);


  const openAddFloor = () => {
    setEditingFloor(null);
    setFloorModalOpen(true);
  };

  const openEditFloor = (floor: Floor) => {
    setEditingFloor(floor);
    setFloorModalOpen(true);
  };

  const closeFloorModal = () => {
    setFloorModalOpen(false);
    setEditingFloor(null);
  };

  const handleFloorSaved = async () => {
    closeFloorModal();
    await fetchLocations();
  };

  const handleDeleteFloor = async (id: string) => {
    try {
      await deleteFloor(id);

      pushToast(
        'Data lantai berhasil dihapus.',
        'success'
      );

      setDeleteFloorId(null);

      await fetchLocations();
    } catch (err) {
      pushToast(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus lantai.',
        'error'
      );
    }
  };


  /* =====================================================
     ROOM
  ===================================================== */

  const openAddRoom = (floorId: string) => {
    setSelectedFloorId(floorId);
    setEditingRoom(null);
    setRoomModalOpen(true);
  };

  const openEditRoom = (room: Room) => {
    setSelectedFloorId(room.floorId);
    setEditingRoom(room);
    setRoomModalOpen(true);
  };

  const closeRoomModal = () => {
    setRoomModalOpen(false);
    setEditingRoom(null);
    setSelectedFloorId(null);
  };

  const handleRoomSaved = async () => {
    closeRoomModal();
    await fetchLocations();
  };

  const handleDeleteRoom = async (id: string) => {
    try {
      await deleteRoom(id);

      pushToast(
        'Data ruangan berhasil dihapus.',
        'success'
      );

      setDeleteRoomId(null);

      await fetchLocations();
    } catch (err) {
      pushToast(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus ruangan.',
        'error'
      );
    }
  };


  /* =====================================================
     DETAIL GEDUNG
  ===================================================== */

  if (selectedBuilding) {
    const area = areas.find(
      item => item.id === selectedBuilding.areaId
    );

    const branch = branches.find(
      item => item.id === area?.branchId
    );

    return (
      <div>

        <PageHeader
          title={selectedBuilding.namaBangunan}
          subtitle={`${selectedBuilding.kodeBangunan} • ${selectedBuilding.tipeBangunan}`}
          breadcrumb={[
            'SPMS',
            'Sarana & Aset',
            'Gedung & Ruangan',
            selectedBuilding.namaBangunan,
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  setSelectedBuilding(null)
                }
              >
                <ArrowLeft size={16} />
                Kembali
              </Button>

              <Button
                onClick={() =>
                  openEditBuilding(selectedBuilding)
                }
              >
                <Edit2 size={15} />
                Edit Gedung
              </Button>
            </div>
          }
        />

        {/* INFO GEDUNG */}

        <Card className="mb-5 p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div>
              <p className="text-xs text-ink-400">
                Kode Bangunan
              </p>

              <p className="font-mono font-semibold text-sm text-ink-800 mt-1">
                {selectedBuilding.kodeBangunan}
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-400">
                Cabang
              </p>

              <p className="font-semibold text-sm text-ink-800 mt-1">
                {branch?.namaCabang || '-'}
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-400">
                Unit / Area
              </p>

              <p className="font-semibold text-sm text-ink-800 mt-1">
                {area?.namaArea || '-'}
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-400">
                Status
              </p>

              <div className="mt-1">
                <Badge
                  variant={
                    statusBadge(
                      selectedBuilding.status
                    ).variant
                  }
                >
                  {selectedBuilding.status}
                </Badge>
              </div>
            </div>

          </div>
        </Card>


        {/* LANTAI */}

        <Card>

          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">

            <div>
              <h3 className="font-semibold text-ink-900">
                Lantai & Ruangan
              </h3>

              <p className="text-xs text-ink-400 mt-0.5">
                Kelola lantai dan ruangan pada gedung ini.
              </p>
            </div>

            <Button
              size="sm"
              onClick={openAddFloor}
            >
              <Plus size={15} />
              Tambah Lantai
            </Button>

          </div>


          {buildingFloors.length === 0 ? (

            <EmptyState
              message="Belum ada lantai pada gedung ini."
            />

          ) : (

            <div className="divide-y divide-ink-100">

              {buildingFloors.map(floor => {

                const floorRooms = rooms
                  .filter(
                    room =>
                      room.floorId === floor.id
                  )
                  .sort((a, b) =>
                    a.kodeRuangan.localeCompare(
                      b.kodeRuangan
                    )
                  );

                return (
                  <FloorSection
                    key={floor.id}
                    floor={floor}
                    rooms={floorRooms}
                    onEdit={() =>
                      openEditFloor(floor)
                    }
                    onDelete={() =>
                      setDeleteFloorId(floor.id)
                    }
                    onAddRoom={() =>
                      openAddRoom(floor.id)
                    }
                    onEditRoom={openEditRoom}
                    onDeleteRoom={id =>
                      setDeleteRoomId(id)
                    }
                  />
                );
              })}

            </div>

          )}

        </Card>


        {/* BUILDING MODAL */}

        {buildingModalOpen && (
          <GedungForm
            editing={editingBuilding}
            branches={branches}
            areas={areas}
            onClose={closeBuildingModal}
            onSaved={handleBuildingSaved}
            pushToast={pushToast}
          />
        )}


        {/* FLOOR MODAL */}

        {floorModalOpen && selectedBuilding && (
          <FloorForm
            editing={editingFloor}
            building={selectedBuilding}
            onClose={closeFloorModal}
            onSaved={handleFloorSaved}
            pushToast={pushToast}
          />
        )}


        {/* ROOM MODAL */}

        {roomModalOpen && selectedFloorId && (
          <RoomForm
            editing={editingRoom}
            floorId={selectedFloorId}
            onClose={closeRoomModal}
            onSaved={handleRoomSaved}
            pushToast={pushToast}
          />
        )}


        {/* DELETE FLOOR */}

        <ConfirmDialog
          open={!!deleteFloorId}
          onClose={() =>
            setDeleteFloorId(null)
          }
          onConfirm={() => {
            if (deleteFloorId) {
              handleDeleteFloor(deleteFloorId);
            }
          }}
          title="Hapus Lantai"
          message="Apakah Anda yakin ingin menghapus lantai ini?"
          confirmText="Hapus"
        />


        {/* DELETE ROOM */}

        <ConfirmDialog
          open={!!deleteRoomId}
          onClose={() =>
            setDeleteRoomId(null)
          }
          onConfirm={() => {
            if (deleteRoomId) {
              handleDeleteRoom(deleteRoomId);
            }
          }}
          title="Hapus Ruangan"
          message="Apakah Anda yakin ingin menghapus ruangan ini?"
          confirmText="Hapus"
        />

      </div>
    );
  }


  /* =====================================================
     BUILDING LIST
  ===================================================== */

  return (
    <div>

      <PageHeader
        title="Gedung & Ruangan"
        subtitle="Manajemen gedung, lantai, dan ruangan IDN"
        breadcrumb={[
          'SPMS',
          'Sarana & Aset',
          'Gedung & Ruangan',
        ]}
        actions={
          <Button onClick={openAddBuilding}>
            <Plus size={16} />
            Tambah Gedung
          </Button>
        }
      />


      {/* FILTER */}

      <Card className="mb-4 p-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

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
              placeholder="Cari gedung..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            />

          </div>


          <select
            value={filterBranch}
            onChange={e => {
              setFilterBranch(e.target.value);
              setFilterArea('');
            }}
            className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >

            <option value="">
              Semua Cabang
            </option>

            {branches
              .filter(
                branch =>
                  branch.status === 'Aktif'
              )
              .map(branch => (
                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.namaCabang}
                </option>
              ))}

          </select>


          <select
            value={filterArea}
            onChange={e =>
              setFilterArea(e.target.value)
            }
            className="px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >

            <option value="">
              Semua Unit / Area
            </option>

            {filteredAreas
              .filter(
                area =>
                  area.status === 'Aktif'
              )
              .map(area => (
                <option
                  key={area.id}
                  value={area.id}
                >
                  {area.namaArea}
                </option>
              ))}

          </select>

        </div>

      </Card>


      {/* ERROR */}

      {locationsError && (
        <Card className="mb-4 p-4 border-red-100 bg-red-50">

          <p className="text-sm text-red-600">
            Gagal memuat data lokasi:{' '}
            {locationsError}
          </p>

        </Card>
      )}


      {/* LOADING */}

      {locationsLoading ? (

        <Card>
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-ink-400">
              Memuat data gedung...
            </p>
          </div>
        </Card>

      ) : filteredBuildings.length === 0 ? (

        <Card>
          <EmptyState message="Tidak ada data gedung" />
        </Card>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {filteredBuildings.map(building => {

            const area = areas.find(
              item =>
                item.id === building.areaId
            );

            const branch = branches.find(
              item =>
                item.id === area?.branchId
            );

            const buildingFloorCount =
              floors.filter(
                floor =>
                  floor.buildingId === building.id
              ).length;

            const buildingRoomCount =
              rooms.filter(room => {
                const floor =
                  floors.find(
                    item =>
                      item.id === room.floorId
                  );

                return (
                  floor?.buildingId ===
                  building.id
                );
              }).length;

            const status =
              statusBadge(building.status);

            return (
              <Card
                key={building.id}
                className="p-5 hover:shadow-card-hover transition-all"
              >

                <div className="flex items-start justify-between mb-3">

                  <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Building2 size={22} />
                  </div>

                  <Badge variant={status.variant}>
                    {building.status}
                  </Badge>

                </div>


                <p className="font-mono text-xs text-ink-400">
                  {building.kodeBangunan}
                </p>

                <h3 className="font-bold text-ink-900 mt-1">
                  {building.namaBangunan}
                </h3>


                <div className="space-y-2 text-xs text-ink-500 mt-4">

                  <div className="flex items-start justify-between gap-4">
                    <span>Cabang:</span>
                    <span className="font-semibold text-ink-700 text-right">
                      {branch?.namaCabang || '-'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span>Unit / Area:</span>
                    <span className="font-semibold text-ink-700 text-right">
                      {area?.namaArea || '-'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span>Tipe:</span>
                    <span className="font-semibold text-ink-700 text-right">
                      {building.tipeBangunan || '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span>Lantai:</span>
                    <span className="font-semibold text-ink-700">
                      {buildingFloorCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Ruangan:</span>
                    <span className="font-semibold text-ink-700">
                      {buildingRoomCount}
                    </span>
                  </div>

                </div>


                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-ink-50">

                  <Button
                    size="sm"
                    onClick={() =>
                      setSelectedBuilding(building)
                    }
                  >
                    <ChevronRight size={14} />
                    Kelola
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      openEditBuilding(building)
                    }
                  >
                    <Edit2 size={13} />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDeleteBuildingId(
                        building.id
                      )
                    }
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={13} />
                  </Button>

                </div>

              </Card>
            );
          })}

        </div>

      )}


      {/* BUILDING FORM */}

      {buildingModalOpen && (
        <GedungForm
          editing={editingBuilding}
          branches={branches}
          areas={areas}
          onClose={closeBuildingModal}
          onSaved={handleBuildingSaved}
          pushToast={pushToast}
        />
      )}


      {/* DELETE BUILDING */}

      <ConfirmDialog
        open={!!deleteBuildingId}
        onClose={() =>
          setDeleteBuildingId(null)
        }
        onConfirm={() => {
          if (deleteBuildingId) {
            handleDeleteBuilding(
              deleteBuildingId
            );
          }
        }}
        title="Hapus Gedung"
        message="Apakah Anda yakin ingin menghapus data gedung ini?"
        confirmText="Hapus"
      />

    </div>
  );
}


/* =====================================================
   FLOOR SECTION
===================================================== */

function FloorSection({
  floor,
  rooms,
  onEdit,
  onDelete,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
}: {
  floor: Floor;
  rooms: Room[];
  onEdit: () => void;
  onDelete: () => void;
  onAddRoom: () => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (id: string) => void;
}) {

  const [open, setOpen] = useState(true);

  const status =
    statusBadge(floor.status);

  return (
    <div>

      <div className="px-5 py-4 bg-ink-50/50">

        <div className="flex items-center justify-between gap-3">

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 text-left min-w-0"
          >

            {open ? (
              <ChevronDown
                size={17}
                className="text-ink-400"
              />
            ) : (
              <ChevronRight
                size={17}
                className="text-ink-400"
              />
            )}

            <div>

              <div className="flex items-center gap-2">

                <h4 className="font-semibold text-ink-900">
                  {floor.namaLantai}
                </h4>

                <Badge variant={status.variant}>
                  {floor.status}
                </Badge>

              </div>

              <p className="font-mono text-xs text-ink-400 mt-0.5">
                {floor.kodeLantai}
                {' • '}
                {rooms.length} ruangan
              </p>

            </div>

          </button>


          <div className="flex items-center gap-1">

            <Button
              variant="ghost"
              size="sm"
              onClick={onAddRoom}
            >
              <Plus size={13} />
              Ruangan
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
            >
              <Edit2 size={13} />
              Edit
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 size={13} />
            </Button>

          </div>

        </div>

      </div>


      {open && (
        <div className="px-5 py-4">

          {rooms.length === 0 ? (

            <div className="rounded-lg border border-dashed border-ink-200 p-5 text-center">

              <DoorOpen
                size={22}
                className="mx-auto text-ink-300"
              />

              <p className="text-xs text-ink-400 mt-2">
                Belum ada ruangan.
              </p>

              <button
                type="button"
                onClick={onAddRoom}
                className="text-xs text-brand-600 font-medium mt-1 hover:underline"
              >
                + Tambah Ruangan
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

              {rooms.map(room => {

                const roomStatus =
                  statusBadge(room.status);

                return (
                  <div
                    key={room.id}
                    className="rounded-xl border border-ink-100 bg-white p-4"
                  >

                    <div className="flex items-start justify-between gap-2">

                      <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                        <DoorOpen size={17} />
                      </div>

                      <Badge
                        variant={roomStatus.variant}
                      >
                        {room.status}
                      </Badge>

                    </div>

                    <p className="font-mono text-[11px] text-ink-400 mt-3">
                      {room.kodeRuangan}
                    </p>

                    <p className="font-semibold text-sm text-ink-900 mt-1">
                      {room.namaRuangan}
                    </p>

                    <p className="text-xs text-ink-400 mt-1">
                      Tipe: {room.tipeRuangan || '-'}
                    </p>


                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-ink-50">

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          onEditRoom(room)
                        }
                      >
                        <Edit2 size={12} />
                        Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onDeleteRoom(room.id)
                        }
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={12} />
                      </Button>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>
      )}

    </div>
  );
}


/* =====================================================
   GEDUNG FORM
===================================================== */

function GedungForm({
  editing,
  branches,
  areas,
  onClose,
  onSaved,
  pushToast,
}: {
  editing: Building | null;
  branches: {
    id: string;
    kodeCabang: string;
    namaCabang: string;
    status: string;
  }[];
  areas: {
    id: string;
    branchId: string;
    kodeArea: string;
    namaArea: string;
    status: string;
  }[];
  onClose: () => void;
  onSaved: () => void;
  pushToast: (
    message: string,
    type?: 'success' | 'error' | 'info'
  ) => void;
}) {

  const [branchId, setBranchId] =
    useState('');

  const [areaId, setAreaId] =
    useState(editing?.areaId || '');

  const [namaBangunan, setNamaBangunan] =
    useState(
      editing?.namaBangunan || ''
    );

  const [tipeBangunan, setTipeBangunan] =
    useState(
      editing?.tipeBangunan || 'Gedung'
    );

  const [status, setStatus] =
    useState(
      editing?.status || 'Aktif'
    );

  const [saving, setSaving] =
    useState(false);


  useEffect(() => {

    if (!editing) return;

    const selectedArea =
      areas.find(
        area =>
          area.id === editing.areaId
      );

    setBranchId(
      selectedArea?.branchId || ''
    );

  }, [editing, areas]);


  const availableAreas =
    useMemo(() => {

      if (!branchId) return [];

      return areas.filter(
        area =>
          area.branchId === branchId &&
          area.status === 'Aktif'
      );

    }, [areas, branchId]);


  const handleSubmit = async () => {

    if (!areaId) {
      pushToast(
        'Unit / Area wajib dipilih.',
        'error'
      );
      return;
    }

    if (!namaBangunan.trim()) {
      pushToast(
        'Nama bangunan wajib diisi.',
        'error'
      );
      return;
    }

    setSaving(true);

    try {

      if (editing) {

        await updateBuilding({
          id: editing.id,
          areaId,
          kodeBangunan:
            editing.kodeBangunan,
          namaBangunan:
            namaBangunan.trim(),
          tipeBangunan,
          status,
        });

        pushToast(
          'Data gedung berhasil diperbarui.',
          'success'
        );

      } else {

        await createBuilding({
          areaId,
          namaBangunan:
            namaBangunan.trim(),
          tipeBangunan,
          status,
        });

        pushToast(
          'Data gedung berhasil ditambahkan.',
          'success'
        );
      }

      onSaved();

    } catch (err) {

      pushToast(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan data gedung.',
        'error'
      );

    } finally {

      setSaving(false);

    }
  };


  return (
    <Modal
      open
      onClose={onClose}
      title={
        editing
          ? 'Edit Gedung'
          : 'Tambah Gedung'
      }
      size="lg"
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
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving
              ? 'Menyimpan...'
              : 'Simpan'}
          </Button>
        </>
      }
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <SelectField
          label="Cabang"
          value={branchId}
          onChange={value => {
            setBranchId(value);
            setAreaId('');
          }}
          options={branches
            .filter(
              branch =>
                branch.status === 'Aktif'
            )
            .map(branch => ({
              value: branch.id,
              label: branch.namaCabang,
            }))}
          required
        />

        <SelectField
          label="Unit / Area"
          value={areaId}
          onChange={setAreaId}
          options={availableAreas.map(
            area => ({
              value: area.id,
              label: area.namaArea,
            })
          )}
          required
        />

        <Input
          label="Nama Gedung"
          value={namaBangunan}
          onChange={setNamaBangunan}
          placeholder="Contoh: Gedung Asrama"
          required
        />

        <SelectField
          label="Tipe Bangunan"
          value={tipeBangunan}
          onChange={setTipeBangunan}
          options={[
            {
              value: 'Gedung',
              label: 'Gedung',
            },
            {
              value: 'Saung',
              label: 'Saung',
            },
          ]}
          required
        />

        <SelectField
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            {
              value: 'Aktif',
              label: 'Aktif',
            },
            {
              value: 'Tidak Aktif',
              label: 'Tidak Aktif',
            },
          ]}
          required
        />

        {editing && (
          <div className="col-span-full">

            <div className="rounded-lg bg-ink-50 border border-ink-100 p-3">

              <p className="text-xs text-ink-400">
                Kode Bangunan
              </p>

              <p className="font-mono text-sm font-semibold text-ink-700 mt-1">
                {editing.kodeBangunan}
              </p>

              <p className="text-xs text-ink-400 mt-2">
                Kode bangunan tidak diubah saat
                proses edit.
              </p>

            </div>

          </div>
        )}

      </div>

    </Modal>
  );
}


/* =====================================================
   FLOOR FORM
===================================================== */

function FloorForm({
  editing,
  building,
  onClose,
  onSaved,
  pushToast,
}: {
  editing: Floor | null;
  building: Building;
  onClose: () => void;
  onSaved: () => void;
  pushToast: (
    message: string,
    type?: 'success' | 'error' | 'info'
  ) => void;
}) {

  const [namaLantai, setNamaLantai] =
    useState(
      editing?.namaLantai || ''
    );

  const [urutan, setUrutan] =
    useState(
      editing?.urutan ||
      1
    );

  const [status, setStatus] =
    useState(
      editing?.status || 'Aktif'
    );

  const [saving, setSaving] =
    useState(false);


  const handleSubmit = async () => {

    if (!namaLantai.trim()) {
      pushToast(
        'Nama lantai wajib diisi.',
        'error'
      );
      return;
    }

    setSaving(true);

    try {

      if (editing) {

        await updateFloor({
          id: editing.id,
          buildingId:
            building.id,
          kodeLantai:
            editing.kodeLantai,
          namaLantai:
            namaLantai.trim(),
          urutan:
            Number(urutan),
          status,
        });

        pushToast(
          'Data lantai berhasil diperbarui.',
          'success'
        );

      } else {

        await createFloor({
          buildingId:
            building.id,
          namaLantai:
            namaLantai.trim(),
          urutan:
            Number(urutan),
          status,
        });

        pushToast(
          'Lantai berhasil ditambahkan.',
          'success'
        );
      }

      onSaved();

    } catch (err) {

      pushToast(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan lantai.',
        'error'
      );

    } finally {

      setSaving(false);

    }
  };


  return (
    <Modal
      open
      onClose={onClose}
      title={
        editing
          ? 'Edit Lantai'
          : 'Tambah Lantai'
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
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving
              ? 'Menyimpan...'
              : 'Simpan'}
          </Button>
        </>
      }
    >

      <div className="space-y-4">

        <div className="rounded-lg bg-ink-50 border border-ink-100 p-3">

          <p className="text-xs text-ink-400">
            Gedung
          </p>

          <p className="font-semibold text-sm text-ink-800 mt-1">
            {building.namaBangunan}
          </p>

          <p className="font-mono text-xs text-ink-400 mt-0.5">
            {building.kodeBangunan}
          </p>

        </div>


        <Input
          label="Nama Lantai"
          value={namaLantai}
          onChange={setNamaLantai}
          placeholder="Contoh: Lantai 1"
          required
        />


        <Input
          label="Urutan"
          type="number"
          value={urutan}
          onChange={value =>
            setUrutan(Number(value))
          }
          required
        />


        <SelectField
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            {
              value: 'Aktif',
              label: 'Aktif',
            },
            {
              value: 'Tidak Aktif',
              label: 'Tidak Aktif',
            },
          ]}
          required
        />


        {editing && (
          <div className="rounded-lg bg-ink-50 border border-ink-100 p-3">

            <p className="text-xs text-ink-400">
              Kode Lantai
            </p>

            <p className="font-mono text-sm font-semibold text-ink-700 mt-1">
              {editing.kodeLantai}
            </p>

            <p className="text-xs text-ink-400 mt-2">
              Kode lantai tidak diubah saat
              proses edit.
            </p>

          </div>
        )}

      </div>

    </Modal>
  );
}


/* =====================================================
   ROOM FORM
===================================================== */

function RoomForm({
  editing,
  floorId,
  onClose,
  onSaved,
  pushToast,
}: {
  editing: Room | null;
  floorId: string;
  onClose: () => void;
  onSaved: () => void;
  pushToast: (
    message: string,
    type?: 'success' | 'error' | 'info'
  ) => void;
}) {

  const [namaRuangan, setNamaRuangan] =
    useState(
      editing?.namaRuangan || ''
    );

  const [tipeRuangan, setTipeRuangan] =
    useState(
      editing?.tipeRuangan || 'Umum'
    );

  const [status, setStatus] =
    useState(
      editing?.status || 'Aktif'
    );

  const [saving, setSaving] =
    useState(false);


  const handleSubmit = async () => {

    if (!namaRuangan.trim()) {
      pushToast(
        'Nama ruangan wajib diisi.',
        'error'
      );
      return;
    }

    setSaving(true);

    try {

      if (editing) {

        await updateRoom({
          id: editing.id,
          floorId,
          kodeRuangan:
            editing.kodeRuangan,
          namaRuangan:
            namaRuangan.trim(),
          tipeRuangan:
            tipeRuangan.trim() || 'Umum',
          status,
        });

        pushToast(
          'Data ruangan berhasil diperbarui.',
          'success'
        );

      } else {

        await createRoom({
          floorId,
          namaRuangan:
            namaRuangan.trim(),
          tipeRuangan:
            tipeRuangan.trim() || 'Umum',
          status,
        });

        pushToast(
          'Ruangan berhasil ditambahkan.',
          'success'
        );
      }

      onSaved();

    } catch (err) {

      pushToast(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan ruangan.',
        'error'
      );

    } finally {

      setSaving(false);

    }
  };


  return (
    <Modal
      open
      onClose={onClose}
      title={
        editing
          ? 'Edit Ruangan'
          : 'Tambah Ruangan'
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
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving
              ? 'Menyimpan...'
              : 'Simpan'}
          </Button>
        </>
      }
    >

      <div className="space-y-4">

        <Input
          label="Nama Ruangan"
          value={namaRuangan}
          onChange={setNamaRuangan}
          placeholder="Contoh: Ruang 01"
          required
        />


        <Input
          label="Tipe Ruangan"
          value={tipeRuangan}
          onChange={setTipeRuangan}
          placeholder="Contoh: Kelas"
        />


        <SelectField
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            {
              value: 'Aktif',
              label: 'Aktif',
            },
            {
              value: 'Tidak Aktif',
              label: 'Tidak Aktif',
            },
          ]}
          required
        />


        {editing && (
          <div className="rounded-lg bg-ink-50 border border-ink-100 p-3">

            <p className="text-xs text-ink-400">
              Kode Ruangan
            </p>

            <p className="font-mono text-sm font-semibold text-ink-700 mt-1">
              {editing.kodeRuangan}
            </p>

            <p className="text-xs text-ink-400 mt-2">
              Kode ruangan tidak diubah saat
              proses edit.
            </p>

          </div>
        )}

      </div>

    </Modal>
  );
}


/* =====================================================
   SELECT FIELD
===================================================== */

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
  required?: boolean;
}) {

  return (
    <div>

      <label className="block text-sm font-medium text-ink-700 mb-1.5">
        {label}
        {required && (
          <span className="text-red-500 ml-0.5">
            *
          </span>
        )}
      </label>

      <select
        value={value}
        onChange={e =>
          onChange(e.target.value)
        }
        className="w-full px-3 py-2.5 rounded-lg border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
      >

        <option value="">
          Pilih {label}
        </option>

        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  );
}