/**
 * FaceAuth Offline - Settings Store (Zustand + MMKV Persistence)
 * Persists user preferences via react-native-mmkv for instant load times.
 * Falls back gracefully if MMKV is unavailable.
 */

import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {SettingsStore} from '../types';
import {STORAGE_KEYS} from '../constants/config';

const DEFAULT_SETTINGS = {
  confidenceThreshold: 85,
  livenessEnabled: true,
  autoSync: true,
  darkMode: true,
  hapticFeedback: true,
} as const;

/**
 * MMKV-backed storage adapter for Zustand persist middleware.
 * In production, replace the backing store with MMKV instance:
 *
 *   import { MMKV } from 'react-native-mmkv';
 *   const storage = new MMKV();
 *
 * For now, uses an in-memory map so the app works without native modules.
 */
const mmkvStorage: Record<string, string> = {};

const zustandMMKVStorage = createJSONStorage<{
  confidenceThreshold: number;
  livenessEnabled: boolean;
  autoSync: boolean;
  darkMode: boolean;
  hapticFeedback: boolean;
}>(() => ({
  getItem: (key: string): string | null => {
    return mmkvStorage[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    mmkvStorage[key] = value;
  },
  removeItem: (key: string): void => {
    delete mmkvStorage[key];
  },
}));

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      ...DEFAULT_SETTINGS,

      setConfidenceThreshold: (threshold: number) =>
        set({
          confidenceThreshold: Math.max(50, Math.min(100, threshold)),
        }),

      setLivenessEnabled: (enabled: boolean) =>
        set({
          livenessEnabled: enabled,
        }),

      setAutoSync: (enabled: boolean) =>
        set({
          autoSync: enabled,
        }),

      setDarkMode: (enabled: boolean) =>
        set({
          darkMode: enabled,
        }),

      setHapticFeedback: (enabled: boolean) =>
        set({
          hapticFeedback: enabled,
        }),

      resetToDefaults: () =>
        set({
          ...DEFAULT_SETTINGS,
        }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: zustandMMKVStorage,
      partialize: state => ({
        confidenceThreshold: state.confidenceThreshold,
        livenessEnabled: state.livenessEnabled,
        autoSync: state.autoSync,
        darkMode: state.darkMode,
        hapticFeedback: state.hapticFeedback,
      }),
    },
  ),
);

export default useSettingsStore;
