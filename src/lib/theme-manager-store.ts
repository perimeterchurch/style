import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LIGHT_TOKENS, DEFAULT_DARK_TOKENS } from "./default-tokens";
import { useEditorStore } from "./editor-store";

// Import preset data inline to avoid dynamic imports
import perimeterApiTheme from "../../registry/themes/perimeter-api.json";
import metricsTheme from "../../registry/themes/metrics.json";

export interface SavedTheme {
  slug: string;
  name: string;
  lightTokens: Record<string, string>;
  darkTokens: Record<string, string>;
  isPreset: boolean;
  createdAt: number;
}

interface ThemeManagerState {
  savedThemes: SavedTheme[];
  activeThemeSlug: string | null;

  saveTheme: (name: string) => void;
  saveThemeAs: (name: string) => void;
  loadTheme: (slug: string) => void;
  deleteTheme: (slug: string) => boolean;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueSlug(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

/** Build a preset SavedTheme by merging partial overrides with defaults */
function buildPreset(
  registryTheme: { name: string; cssVars: { light: Record<string, string>; dark: Record<string, string> } },
): SavedTheme {
  return {
    slug: registryTheme.name,
    name: registryTheme.name
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    lightTokens: { ...DEFAULT_LIGHT_TOKENS, ...registryTheme.cssVars.light },
    darkTokens: { ...DEFAULT_DARK_TOKENS, ...registryTheme.cssVars.dark },
    isPreset: true,
    createdAt: 0,
  };
}

const PRESETS: SavedTheme[] = [
  buildPreset(perimeterApiTheme),
  buildPreset(metricsTheme),
];

export const useThemeManagerStore = create<ThemeManagerState>()(
  persist(
    (set, get) => ({
      savedThemes: [...PRESETS],
      activeThemeSlug: null,

      saveTheme: (name: string) => {
        const { activeThemeSlug, savedThemes } = get();
        const editor = useEditorStore.getState();

        // If there's an active non-preset theme, overwrite it
        if (activeThemeSlug) {
          const existing = savedThemes.find((t) => t.slug === activeThemeSlug);
          if (existing && !existing.isPreset) {
            set({
              savedThemes: savedThemes.map((t) =>
                t.slug === activeThemeSlug
                  ? {
                      ...t,
                      name: existing.name,
                      lightTokens: { ...editor.lightTokens },
                      darkTokens: { ...editor.darkTokens },
                    }
                  : t,
              ),
            });
            return;
          }
        }

        // Otherwise create new
        get().saveThemeAs(name);
      },

      saveThemeAs: (name: string) => {
        const { savedThemes } = get();
        const editor = useEditorStore.getState();
        const base = slugify(name);
        const slug = uniqueSlug(
          base,
          savedThemes.map((t) => t.slug),
        );

        const theme: SavedTheme = {
          slug,
          name,
          lightTokens: { ...editor.lightTokens },
          darkTokens: { ...editor.darkTokens },
          isPreset: false,
          createdAt: Date.now(),
        };

        set({
          savedThemes: [...savedThemes, theme],
          activeThemeSlug: slug,
        });
      },

      loadTheme: (slug: string) => {
        const theme = get().savedThemes.find((t) => t.slug === slug);
        if (!theme) return;

        const editor = useEditorStore.getState();
        const lightTokens = { ...DEFAULT_LIGHT_TOKENS, ...theme.lightTokens };
        const darkTokens = { ...DEFAULT_DARK_TOKENS, ...theme.darkTokens };

        // Push current state to undo stack, set new tokens in one operation
        useEditorStore.setState({
          lightTokens,
          darkTokens,
          past: [...editor.past, { lightTokens: editor.lightTokens, darkTokens: editor.darkTokens }].slice(-50),
          future: [],
        });

        set({ activeThemeSlug: slug });
      },

      deleteTheme: (slug: string) => {
        const { savedThemes } = get();
        const theme = savedThemes.find((t) => t.slug === slug);
        if (!theme || theme.isPreset) return false;

        set({
          savedThemes: savedThemes.filter((t) => t.slug !== slug),
          activeThemeSlug:
            get().activeThemeSlug === slug ? null : get().activeThemeSlug,
        });
        return true;
      },
    }),
    {
      name: "perimeter-theme-manager",
      partialize: (state) => ({
        savedThemes: state.savedThemes.filter((t) => !t.isPreset),
        activeThemeSlug: state.activeThemeSlug,
      }),
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<ThemeManagerState> | undefined;
        return {
          ...current,
          activeThemeSlug: persistedState?.activeThemeSlug ?? null,
          savedThemes: [
            ...PRESETS,
            ...(persistedState?.savedThemes ?? []),
          ],
        };
      },
    },
  ),
);
