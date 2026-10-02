import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode, AccentColor } from '../types';

interface ThemeState {
  theme: ThemeMode;
  accent: AccentColor;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark', // default to sleek modern dark theme
      accent: 'indigo',

      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          return { theme: next };
        }),

      setTheme: (theme) => set({ theme }),

      setAccent: (accent) => set({ accent }),
    }),
    {
      name: 'taskflow-theme-storage',
    }
  )
);