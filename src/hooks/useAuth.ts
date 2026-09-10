import { useState, useCallback } from 'react';
import { loginUser } from '@/api/auth';
import type { AuthUser } from '@/api/auth';

const SESSION_KEY = 'spms-user';

function loadSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const saved = sessionStorage.getItem(SESSION_KEY);
  if (!saved) return null;
  try {
    const u = JSON.parse(saved) as AuthUser;
    if (u.status === 'Nonaktif') {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return u;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(loadSession);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const u = await loginUser(email, password);
      if (u.status === 'Nonaktif') {
        throw new Error('Akun Anda sedang nonaktif. Silakan hubungi Super Admin.');
      }
      setUser(u);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  return { user, login, logout, loading };
}
