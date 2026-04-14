import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  setAuth: (accessToken: string, refreshToken: string, user: any) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: (accessToken, refreshToken, user) => 
        set({ accessToken, refreshToken, user }),
      setAccessToken: (accessToken) => 
        set({ accessToken }),
      logout: () => 
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
