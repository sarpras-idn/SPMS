const FALLBACK_API_BASE_URL =
  'https://script.google.com/macros/s/AKfycbyBGCXKut3ZMOFFB9G4tr6WUfde2mA7fiy-Qyae7dVyEBzfOeGvZ0hWpAOinSCbiEnTmg/exec';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || FALLBACK_API_BASE_URL;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

interface StoredUser {
  id?: string;
  email?: string;
}

function getStoredUser(): StoredUser | null {
  try {
    const raw = sessionStorage.getItem('spms-user');
    if (!raw) return null;

    const user = JSON.parse(raw);

    return {
      id: user?.id,
      email: user?.email,
    };
  } catch {
    return null;
  }
}

function getAuthUser() {
  const user = getStoredUser();

  return {
    id: user?.id || '',
    email: user?.email || '',
  };
}

export async function apiGet<T>(action: string): Promise<T> {
  const authUser = getAuthUser();

  const params = new URLSearchParams({
    action,
    authUserId: authUser.id,
    authUserEmail: authUser.email,
  });

  const url = `${API_BASE_URL}?${params.toString()}`;

  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(
      json.error || json.message || 'API returned success: false'
    );
  }

  return json.data;
}

export async function apiPost<T>(
  action: string,
  data: unknown
): Promise<T> {
  const authUser = getAuthUser();

  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      action,
      data,
      authUser: {
        id: authUser.id,
        email: authUser.email,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(
      json.error || json.message || 'API returned success: false'
    );
  }

  return json.data;
}