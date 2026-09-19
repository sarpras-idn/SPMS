import { apiGet, apiPost } from './client';

export interface Branch {
  id: string;
  kodeCabang: string;
  namaCabang: string;
  status: string;
}

export interface Area {
  id: string;
  branchId: string;
  kodeArea: string;
  namaArea: string;
  status: string;
}

export interface Building {
  id: string;
  areaId: string;
  kodeBangunan: string;
  namaBangunan: string;
  tipeBangunan: string;
  status: string;
}

export interface Floor {
  id: string;
  buildingId: string;
  kodeLantai: string;
  namaLantai: string;
  urutan: number;
  status: string;
}

export interface Room {
  id: string;
  floorId: string;
  kodeRuangan: string;
  namaRuangan: string;
  tipeRuangan: string;
  status: string;
}

/* =========================
   GET
========================= */

export async function getBranches(): Promise<Branch[]> {
  return apiGet<Branch[]>('getBranches');
}

export async function getAreas(): Promise<Area[]> {
  return apiGet<Area[]>('getAreas');
}

export async function getBuildings(): Promise<Building[]> {
  return apiGet<Building[]>('getBuildings');
}

export async function getFloors(): Promise<Floor[]> {
  return apiGet<Floor[]>('getFloors');
}

export async function getRooms(): Promise<Room[]> {
  return apiGet<Room[]>('getRooms');
}

/* =========================
   BUILDING
========================= */

export async function createBuilding(
  data: Omit<Building, 'id' | 'kodeBangunan'>
): Promise<unknown> {
  return apiPost<unknown>('createBuilding', data);
}

export async function updateBuilding(
  data: Building
): Promise<unknown> {
  return apiPost<unknown>('updateBuilding', data);
}

export async function deleteBuilding(
  id: string
): Promise<unknown> {
  return apiPost<unknown>('deleteBuilding', { id });
}

/* =========================
   FLOOR
========================= */

export async function createFloor(
  data: Omit<Floor, 'id' | 'kodeLantai'>
): Promise<unknown> {
  return apiPost<unknown>('createFloor', data);
}

export async function updateFloor(
  data: Floor
): Promise<unknown> {
  return apiPost<unknown>('updateFloor', data);
}

export async function deleteFloor(
  id: string
): Promise<unknown> {
  return apiPost<unknown>('deleteFloor', { id });
}

/* =========================
   ROOM
========================= */

export async function createRoom(
  data: Omit<Room, 'id' | 'kodeRuangan'>
): Promise<unknown> {
  return apiPost<unknown>('createRoom', data);
}

export async function updateRoom(
  data: Room
): Promise<unknown> {
  return apiPost<unknown>('updateRoom', data);
}

export async function deleteRoom(
  id: string
): Promise<unknown> {
  return apiPost<unknown>('deleteRoom', { id });
}