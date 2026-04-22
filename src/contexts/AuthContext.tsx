import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import * as authService from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'mentor' | 'learner') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function persistSession(user: User, token: string, refreshToken: string) {
  localStorage.setItem('mm_user', JSON.stringify(user));
  localStorage.setItem('mm_token', token);
  localStorage.setItem('mm_refresh_token', refreshToken);
}

function clearSession() {
  localStorage.removeItem('mm_user');
  localStorage.removeItem('mm_token');
  localStorage.removeItem('mm_refresh_token');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from storage, then verify with backend.
    // Using async/await with try/finally guarantees setLoading(false) always runs,
    // even if JSON.parse throws synchronously or the network call fails unexpectedly.
    const restoreSession = async () => {
      try {
        const stored = localStorage.getItem('mm_user');
        const token = localStorage.getItem('mm_token');
        if (stored && token) {
          // Optimistically restore user from storage while we verify with backend
          setUser(JSON.parse(stored));
          try {
            const freshUser = await authService.getMe();
            setUser(freshUser);
            localStorage.setItem('mm_user', JSON.stringify(freshUser));
          } catch {
            // Token expired or network failure — clear everything and show login
            clearSession();
            setUser(null);
          }
        }
      } finally {
        // Always dismiss the loading screen regardless of outcome
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token, refreshToken } = await authService.login(email, password);
    persistSession(user, token, refreshToken);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string, role: 'mentor' | 'learner') => {
    const { user, token, refreshToken } = await authService.register(name, email, password, role);
    persistSession(user, token, refreshToken);
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
