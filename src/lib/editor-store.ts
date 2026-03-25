import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LIGHT_TOKENS, DEFAULT_DARK_TOKENS } from "./default-tokens";

interface TokenSnapshot {
  lightTokens: Record<string, string>;
  darkTokens: Record<string, string>;
}

interface EditorState {
  lightTokens: Record<string, string>;
  darkTokens: Record<string, string>;
  activeMode: "light" | "dark";

  // Undo/redo history
  past: TokenSnapshot[];
  future: TokenSnapshot[];

  setToken: (name: string, value: string) => void;
  setActiveMode: (mode: "light" | "dark") => void;
  resetToDefaults: () => void;
  undo: () => void;
  redo: () => void;
}

const MAX_HISTORY = 50;

/** Debounce helper — only push to history after 300ms of no changes */
let snapshotTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSnapshot: TokenSnapshot | null = null;

function flushPendingSnapshot(get: () => EditorState, set: (partial: Partial<EditorState>) => void) {
  if (pendingSnapshot && snapshotTimer) {
    clearTimeout(snapshotTimer);
    snapshotTimer = null;
    const past = [...get().past, pendingSnapshot].slice(-MAX_HISTORY);
    set({ past, future: [] });
    pendingSnapshot = null;
  }
}

function scheduleSnapshot(
  get: () => EditorState,
  set: (partial: Partial<EditorState>) => void,
) {
  // Capture the current state BEFORE the edit as the snapshot to push
  if (!pendingSnapshot) {
    pendingSnapshot = {
      lightTokens: { ...get().lightTokens },
      darkTokens: { ...get().darkTokens },
    };
  }

  if (snapshotTimer) clearTimeout(snapshotTimer);
  snapshotTimer = setTimeout(() => {
    if (pendingSnapshot) {
      const past = [...get().past, pendingSnapshot].slice(-MAX_HISTORY);
      set({ past, future: [] });
      pendingSnapshot = null;
    }
    snapshotTimer = null;
  }, 300);
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      lightTokens: { ...DEFAULT_LIGHT_TOKENS },
      darkTokens: { ...DEFAULT_DARK_TOKENS },
      activeMode: "light" as const,
      past: [],
      future: [],

      setToken: (name, value) => {
        scheduleSnapshot(get, set);
        const mode = get().activeMode;
        if (mode === "light") {
          set((s) => ({ lightTokens: { ...s.lightTokens, [name]: value } }));
        } else {
          set((s) => ({ darkTokens: { ...s.darkTokens, [name]: value } }));
        }
      },

      setActiveMode: (mode) => set({ activeMode: mode }),

      resetToDefaults: () => {
        const { lightTokens, darkTokens, past } = get();
        set({
          lightTokens: { ...DEFAULT_LIGHT_TOKENS },
          darkTokens: { ...DEFAULT_DARK_TOKENS },
          past: [...past, { lightTokens, darkTokens }].slice(-MAX_HISTORY),
          future: [],
        });
      },

      undo: () => {
        flushPendingSnapshot(get, set);
        const { past, lightTokens, darkTokens, future } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        set({
          lightTokens: { ...previous.lightTokens },
          darkTokens: { ...previous.darkTokens },
          past: past.slice(0, -1),
          future: [{ lightTokens, darkTokens }, ...future],
        });
      },

      redo: () => {
        const { future, lightTokens, darkTokens, past } = get();
        if (future.length === 0) return;
        const next = future[0];
        set({
          lightTokens: { ...next.lightTokens },
          darkTokens: { ...next.darkTokens },
          past: [...past, { lightTokens, darkTokens }],
          future: future.slice(1),
        });
      },
    }),
    {
      name: "perimeter-editor",
      partialize: (state) => ({
        lightTokens: state.lightTokens,
        darkTokens: state.darkTokens,
        activeMode: state.activeMode,
        // Don't persist undo/redo history
      }),
    },
  ),
);
