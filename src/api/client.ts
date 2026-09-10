const FALLBACK_API_BASE_URL =
  'https://script.google.com/macros/s/AKfycbyBGCXKut3ZMOFFB9G4tr6WUfde2mA7fiy-Qyae7dVyEBzfOeGvZ0hWpAOinSCbiEnTmg/exec';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || FALLBACK_API_BASE_URL;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function apiGet<T>(action: string): Promise<T> {
  const url = `${API_BASE_URL}?action=${encodeURIComponent(action)}`;
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error('API returned success: false');
  }
  return json.data;
}

export async function apiPost<T>(action: string, data: unknown): Promise<T> {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, data }),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    const raw = json as unknown as Record<string, unknown>;
    const errMsg = raw.message || raw.error || 'No error details provided';
    throw new Error(errMsg as string);
  }
  return json.data;
}
