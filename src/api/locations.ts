import { apiGet } from './client';

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