import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LIGHT_TOKENS, DEFAULT_DARK_TOKENS } from "./default-tokens";

interface EditorState {
  lightTokens: Record<string, string>;
  darkTokens: Record<string, string>;
  activeMode: "light" | "dark";
  setToken: (name: string, value: string) => void;
  setActiveMode: (mode: "light" | "dark") => void;
  resetToDefaults: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      lightTokens: { ...DEFAULT_LIGHT_TOKENS },
      darkTokens: { ...DEFAULT_DARK_TOKENS },
      activeMode: "light" as const,
      setToken: (name, value) => {
        const mode = get().activeMode;
        if (mode === "light") {
          set((s) => ({ lightTokens: { ...s.lightTokens, [name]: value } }));
        } else {
          set((s) => ({ darkTokens: { ...s.darkTokens, [name]: value } }));
        }
      },
      setActiveMode: (mode) => set({ activeMode: mode }),
      resetToDefaults: () =>
        set({
          lightTokens: { ...DEFAULT_LIGHT_TOKENS },
          darkTokens: { ...DEFAULT_DARK_TOKENS },
        }),
    }),
    { name: "perimeter-editor" },
  ),
);
