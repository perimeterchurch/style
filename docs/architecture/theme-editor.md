# Theme Editor Architecture

## Overview

The theme editor at `/editor` provides a visual interface for customizing design tokens with live preview. It renders preview components **inline in the same React tree** — no iframe, no postMessage. Token changes update CSS custom properties on a wrapper div, and all child components respond instantly.

## Why Inline (Not iframe)

An earlier implementation used an iframe with `postMessage` for CSS isolation. This caused:
- Timing bugs (messages lost during page navigation)
- Stale closures (dark mode reset on tab switch)
- Complexity (`@tailwindcss/browser` CDN, origin validation, debouncing)

The inline approach eliminates all of these. Since the editor and preview share the same `globals.css`, there's no CSS to isolate from.

## Layout

```
┌──────────────────────────┬───────────────────────────────────┐
│  Sidebar (resizable)      │  Preview Area                     │
│                           │  [Showcase] [Forms] [Dashboard]   │
│  ThemeSelector            │  ┌─────────────────────────────┐  │
│  Light / Dark toggle      │  │ <div style={tokenVars}      │  │
│  Undo / Redo              │  │       className={dark?}>     │  │
│  Reset                    │  │   <Showcase />               │  │
│                           │  │   (real React components)    │  │
│  Token Groups:            │  │                              │  │
│  - Primary colors         │  └─────────────────────────────┘  │
│  - Secondary colors       │                                   │
│  - Background/foreground  │                                   │
│  - ...                    │                                   │
│                           │                                   │
│  Export CSS / Copy JSON   │                                   │
└──────────────────────────┴───────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/editor/page.tsx` | Editor page layout, tab switching, keyboard shortcuts |
| `src/components/editor/token-controls.tsx` | Sidebar: mode toggle, undo/redo, token inputs, export |
| `src/components/editor/theme-selector.tsx` | Theme dropdown, save/load/delete dialogs |
| `src/components/editor/preview-panel.tsx` | Wrapper that applies token CSS vars + dark class |
| `src/components/preview/showcase.tsx` | Component grid preview |
| `src/components/preview/forms.tsx` | Form examples preview |
| `src/components/preview/dashboard.tsx` | Dashboard layout preview |

## State Management

### Editor Store (`src/lib/editor-store.ts`)

Zustand store persisted to `localStorage` under key `perimeter-editor`.

```ts
interface EditorState {
  lightTokens: Record<string, string>;   // OKLCH values for light mode
  darkTokens: Record<string, string>;    // OKLCH values for dark mode
  activeMode: "light" | "dark";
  past: TokenSnapshot[];                 // Undo stack (max 50)
  future: TokenSnapshot[];               // Redo stack
  setToken: (name: string, value: string) => void;
  setActiveMode: (mode: "light" | "dark") => void;
  resetToDefaults: () => void;
  undo: () => void;
  redo: () => void;
}
```

**Undo/redo:** Custom implementation with past/future stacks. Snapshots are debounced (300ms) so dragging a color picker creates one undo entry, not fifty. `flushPendingSnapshot()` is called before undo/redo to prevent race conditions. History is NOT persisted to localStorage — only tokens and active mode are.

**Persistence:** Only `lightTokens`, `darkTokens`, and `activeMode` are saved. The `partialize` option in Zustand's persist middleware excludes undo/redo history.

### Theme Manager Store (`src/lib/theme-manager-store.ts`)

Zustand store persisted to `localStorage` under key `perimeter-themes`.

```ts
interface SavedTheme {
  name: string;
  slug: string;
  lightTokens: Record<string, string>;
  darkTokens: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  isPreset?: boolean;
}
```

**Presets:** On first load, the store seeds with preset themes from `registry/themes/` (perimeter-api, metrics). Presets are read-only — editing creates a copy, deleting is blocked.

**Loading a theme:** Merges the theme's partial overrides with `DEFAULT_*_TOKENS`, then writes to the editor store. Pushes the previous state onto the undo stack.

## Preview Panel

`PreviewPanel` renders the active preview component inside a div that applies:
1. **CSS custom properties** via `style={{ '--primary': value, ... }}` — all tokens from the active mode
2. **Dark mode class** via `className="dark"` when `activeMode === "dark"`
3. **Background/foreground** via `bg-background text-foreground` Tailwind classes

CSS custom property inheritance ensures all child components see the overridden values. No re-rendering needed for token changes — the browser handles CSS variable updates natively.

## Export

| Format | Function | Output |
|--------|----------|--------|
| CSS | `exportAsCSS()` | `:root { --primary: ...; }` + `.dark { ... }` |
| Registry Theme | `exportAsRegistryTheme()` | shadcn `registry:theme` JSON |
| File Download | Theme selector "Download" button | `.json` file saved to disk |

## Toast Feedback

All user actions show toast notifications via Sonner:
- Token export → success/error
- Theme save/load/delete → success
- Reset → info
- Undo/redo → info
