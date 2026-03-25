# Editor Tier 1 Improvements — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add undo/redo, named theme management, toast feedback, and a resizable sidebar to the theme editor.

**Architecture:** Undo/redo via `zundo` middleware on the existing Zustand store. Named themes in a separate Zustand store persisted to localStorage. Toast via shadcn's Sonner component. Resizable sidebar via the already-installed `react-resizable-panels`.

**Tech Stack:** Zustand, zundo, Sonner, react-resizable-panels, shadcn Dialog/AlertDialog/Select

**Spec:** `docs/specs/2026-03-25-editor-tier1-improvements.md`

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `src/lib/theme-manager-store.ts` | Zustand store for saved themes (save/load/delete) |
| `src/components/editor/theme-selector.tsx` | Theme dropdown + save/delete dialog UI |

### Modified Files

| File | Changes |
|------|---------|
| `src/lib/editor-store.ts` | Add zundo temporal middleware for undo/redo |
| `src/app/editor/page.tsx` | Resizable panels, keyboard shortcuts |
| `src/components/editor/token-controls.tsx` | Toast notifications, undo/redo buttons, theme selector integration |
| `src/app/layout.tsx` | Add `<Toaster />` |
| `package.json` | Add `zundo` |

---

## Chunk 1: Toast Feedback + Resizable Sidebar

These are the simplest changes and improve the experience immediately.

### Task 1: Add Sonner toaster to root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Read the current layout**

Read `src/app/layout.tsx`.

- [ ] **Step 2: Add Toaster import and component**

Import `Toaster` from `@/components/ui/sonner` and add it inside `<body>` alongside `{children}`:

```tsx
import { Toaster } from "@/components/ui/sonner";

// Inside body:
<body className="min-h-full flex flex-col">
  {children}
  <Toaster />
</body>
```

- [ ] **Step 3: Add toast notifications to token-controls**

Read `src/components/editor/token-controls.tsx`. Import `toast` from `sonner`. Wrap every clipboard operation in try/catch with toast:

```tsx
import { toast } from "sonner";

// Export CSS button:
onClick={async () => {
  try {
    const css = exportAsCSS(lightTokens, darkTokens);
    await navigator.clipboard.writeText(css);
    toast.success("CSS copied to clipboard");
  } catch {
    toast.error("Failed to copy to clipboard");
  }
}}

// Copy JSON button:
onClick={async () => {
  try {
    const json = exportAsRegistryTheme("custom-theme", lightTokens, darkTokens);
    await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    toast.success("Theme JSON copied to clipboard");
  } catch {
    toast.error("Failed to copy to clipboard");
  }
}}

// Reset button:
onClick={() => {
  resetToDefaults();
  toast("Tokens reset to defaults");
}}
```

- [ ] **Step 4: Verify**

```bash
pnpm dev
# Open /editor, click Export CSS, see toast
# Click Reset, see toast
```

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/components/editor/token-controls.tsx
git commit -m "feat: add toast feedback to editor actions"
```

---

### Task 2: Replace fixed sidebar with resizable panels

**Files:**
- Modify: `src/app/editor/page.tsx`

- [ ] **Step 1: Read the current editor page**

Read `src/app/editor/page.tsx`.

- [ ] **Step 2: Replace layout with ResizablePanelGroup**

```tsx
"use client";

import { useState } from "react";
import { PreviewFrame } from "@/components/editor/preview-frame";
import { TokenControls } from "@/components/editor/token-controls";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const PREVIEW_TABS = [
  { label: "Showcase", path: "/preview/showcase" },
  { label: "Forms", path: "/preview/forms" },
  { label: "Dashboard", path: "/preview/dashboard" },
] as const;

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<string>(PREVIEW_TABS[0].path);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen"
      autoSaveId="editor-layout"
    >
      <ResizablePanel
        defaultSize={25}
        minSize={15}
        maxSize={40}
        className="bg-background"
      >
        <TokenControls />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75} className="flex flex-col">
        <div className="flex gap-1 p-2 border-b bg-muted/50">
          {PREVIEW_TABS.map((tab) => (
            <Button
              key={tab.path}
              variant={activeTab === tab.path ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.path)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="flex-1">
          <PreviewFrame src={activeTab} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
```

- [ ] **Step 3: Verify**

```bash
pnpm dev
# Open /editor, drag the sidebar handle, resize works
# Refresh page — size persists
```

- [ ] **Step 4: Commit**

```bash
git add src/app/editor/page.tsx
git commit -m "feat: add resizable sidebar panel to editor"
```

---

## Chunk 2: Undo/Redo

### Task 3: Add zundo middleware to editor store

**Files:**
- Modify: `package.json`
- Modify: `src/lib/editor-store.ts`

- [ ] **Step 1: Install zundo**

```bash
cd /Users/parkerb/dev/perimeter/claude/style && pnpm add zundo
```

- [ ] **Step 2: Read the current editor store**

Read `src/lib/editor-store.ts`.

- [ ] **Step 3: Add temporal middleware**

Wrap the store with `zundo`'s `temporal` middleware. The middleware sits between `persist` and the store creator. Use `equality` option to debounce — only create a history entry when tokens actually change, and use `limit` to cap at 50 entries.

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { temporal } from "zundo";
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
    temporal(
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
      {
        limit: 50,
      },
    ),
    { name: "perimeter-editor" },
  ),
);
```

**IMPORTANT:** Read the `zundo` docs to verify the correct middleware nesting order. `temporal` should wrap the store initializer, and `persist` should wrap `temporal`. If the order is wrong, either undo/redo or persistence will break. Check the zundo README for examples with `persist`.

- [ ] **Step 4: Verify store works**

```bash
pnpm dev
# Open /editor, change a color — should still work
# Check browser console for any Zustand errors
```

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml src/lib/editor-store.ts
git commit -m "feat: add undo/redo history to editor store via zundo"
```

---

### Task 4: Add undo/redo UI and keyboard shortcuts

**Files:**
- Modify: `src/components/editor/token-controls.tsx`
- Modify: `src/app/editor/page.tsx`

- [ ] **Step 1: Add undo/redo buttons to token-controls**

Read `src/components/editor/token-controls.tsx`. Add undo/redo buttons next to the Reset button. Import `Undo2` and `Redo2` from `lucide-react`.

Access the temporal store:
```tsx
import { useEditorStore } from "@/lib/editor-store";

// Inside TokenControls component:
const { undo, redo, pastStates, futureStates } = useEditorStore.temporal.getState();

// Or use the temporal hook if zundo provides one:
const temporalState = useEditorStore.temporal;
```

**IMPORTANT:** Read the zundo docs to find the correct way to access `undo`/`redo`/`pastStates`/`futureStates` reactively (so the buttons disable/enable correctly). The `.temporal.getState()` approach is non-reactive. You may need `useTemporalStore` or subscribe to the temporal store.

Add buttons:
```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={() => undo()}
  disabled={pastStates.length === 0}
>
  <Undo2 className="size-3.5" />
</Button>
<Button
  variant="ghost"
  size="sm"
  onClick={() => redo()}
  disabled={futureStates.length === 0}
>
  <Redo2 className="size-3.5" />
</Button>
```

Add toast for undo/redo:
```tsx
onClick={() => { undo(); toast("Undo"); }}
onClick={() => { redo(); toast("Redo"); }}
```

- [ ] **Step 2: Add keyboard shortcuts to editor page**

In `src/app/editor/page.tsx`, add a `useEffect` for keyboard shortcuts:

```tsx
import { useEditorStore } from "@/lib/editor-store";

// Inside EditorPage:
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    const isMod = e.metaKey || e.ctrlKey;
    if (isMod && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      useEditorStore.temporal.getState().undo();
    }
    if (isMod && e.key === "z" && e.shiftKey) {
      e.preventDefault();
      useEditorStore.temporal.getState().redo();
    }
  }
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

- [ ] **Step 3: Verify**

```bash
pnpm dev
# Open /editor
# Change a color, click Undo — reverts
# Click Redo — restores
# Cmd+Z / Cmd+Shift+Z — same behavior
# Undo button disabled when no history
```

- [ ] **Step 4: Commit**

```bash
git add src/components/editor/token-controls.tsx src/app/editor/page.tsx
git commit -m "feat: add undo/redo buttons and keyboard shortcuts"
```

---

## Chunk 3: Named Theme Management

### Task 5: Create theme manager store

**Files:**
- Create: `src/lib/theme-manager-store.ts`

- [ ] **Step 1: Read the editor store and registry themes**

Read:
- `src/lib/editor-store.ts` — to understand how to read/write tokens
- `registry/themes/perimeter-api.json` — theme format
- `registry/themes/metrics.json` — theme format

- [ ] **Step 2: Create the theme manager store**

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEditorStore } from "./editor-store";

export interface SavedTheme {
  name: string;
  slug: string;
  lightTokens: Record<string, string>;
  darkTokens: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  isPreset?: boolean;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface ThemeManagerState {
  savedThemes: SavedTheme[];
  activeThemeSlug: string | null;
  saveTheme: (name: string) => void;
  saveThemeAs: (name: string) => void;
  loadTheme: (slug: string) => void;
  deleteTheme: (slug: string) => void;
  getActiveTheme: () => SavedTheme | null;
}

// Built-in presets from registry/themes/
const PRESET_THEMES: SavedTheme[] = [
  {
    name: "Perimeter API",
    slug: "perimeter-api",
    lightTokens: {
      primary: "oklch(0.45 0.12 250)",
      "primary-foreground": "oklch(0.985 0 0)",
      ring: "oklch(0.45 0.12 250)",
      "chart-1": "oklch(0.45 0.12 250)",
    },
    darkTokens: {
      primary: "oklch(0.55 0.12 250)",
      "primary-foreground": "oklch(0.985 0 0)",
      ring: "oklch(0.55 0.12 250)",
      "chart-1": "oklch(0.55 0.12 250)",
    },
    createdAt: "2026-03-25T00:00:00Z",
    updatedAt: "2026-03-25T00:00:00Z",
    isPreset: true,
  },
  // ... metrics theme similarly
];

export const useThemeManagerStore = create<ThemeManagerState>()(
  persist(
    (set, get) => ({
      savedThemes: [...PRESET_THEMES],
      activeThemeSlug: null,

      saveTheme: (name) => {
        const slug = slugify(name);
        const editor = useEditorStore.getState();
        const now = new Date().toISOString();
        const existing = get().savedThemes.find((t) => t.slug === slug);

        if (existing?.isPreset) {
          // Can't overwrite presets — save as copy
          get().saveThemeAs(name + " (Custom)");
          return;
        }

        const theme: SavedTheme = {
          name,
          slug,
          lightTokens: { ...editor.lightTokens },
          darkTokens: { ...editor.darkTokens },
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
        };

        set((s) => ({
          savedThemes: existing
            ? s.savedThemes.map((t) => (t.slug === slug ? theme : t))
            : [...s.savedThemes, theme],
          activeThemeSlug: slug,
        }));
      },

      saveThemeAs: (name) => {
        const slug = slugify(name);
        const editor = useEditorStore.getState();
        const now = new Date().toISOString();

        // Ensure unique slug
        let finalSlug = slug;
        let counter = 1;
        while (get().savedThemes.some((t) => t.slug === finalSlug)) {
          finalSlug = `${slug}-${counter}`;
          counter++;
        }

        const theme: SavedTheme = {
          name,
          slug: finalSlug,
          lightTokens: { ...editor.lightTokens },
          darkTokens: { ...editor.darkTokens },
          createdAt: now,
          updatedAt: now,
        };

        set((s) => ({
          savedThemes: [...s.savedThemes, theme],
          activeThemeSlug: finalSlug,
        }));
      },

      loadTheme: (slug) => {
        const theme = get().savedThemes.find((t) => t.slug === slug);
        if (!theme) return;

        const editor = useEditorStore.getState();
        // For presets that only override some tokens, merge with defaults
        const { DEFAULT_LIGHT_TOKENS, DEFAULT_DARK_TOKENS } = require("./default-tokens");
        const lightTokens = { ...DEFAULT_LIGHT_TOKENS, ...theme.lightTokens };
        const darkTokens = { ...DEFAULT_DARK_TOKENS, ...theme.darkTokens };

        useEditorStore.setState({ lightTokens, darkTokens });
        set({ activeThemeSlug: slug });
      },

      deleteTheme: (slug) => {
        const theme = get().savedThemes.find((t) => t.slug === slug);
        if (!theme || theme.isPreset) return;

        set((s) => ({
          savedThemes: s.savedThemes.filter((t) => t.slug !== slug),
          activeThemeSlug: s.activeThemeSlug === slug ? null : s.activeThemeSlug,
        }));
      },

      getActiveTheme: () => {
        const slug = get().activeThemeSlug;
        return slug ? get().savedThemes.find((t) => t.slug === slug) ?? null : null;
      },
    }),
    { name: "perimeter-themes" },
  ),
);
```

**NOTE:** The `require` for default-tokens is to avoid circular imports. At implementation time, use a dynamic import or restructure to avoid this. Read the actual import graph first.

- [ ] **Step 3: Commit**

```bash
git add src/lib/theme-manager-store.ts
git commit -m "feat: add theme manager store with save/load/delete"
```

---

### Task 6: Create theme selector UI

**Files:**
- Create: `src/components/editor/theme-selector.tsx`

- [ ] **Step 1: Implement the theme selector component**

Uses shadcn `Select`, `Dialog`, `AlertDialog`, `Input`, `Button`, `Label`, and `Separator`.

The component renders:
1. A `Select` dropdown showing saved themes + "Unsaved Changes" + "+ Create New Theme"
2. Action buttons: Save, Save As, Delete
3. A `Dialog` for entering a new theme name (used by Save As and Create New)
4. An `AlertDialog` for confirming deletion

```tsx
"use client";

import { useState } from "react";
import { useThemeManagerStore } from "@/lib/theme-manager-store";
import { useEditorStore } from "@/lib/editor-store";
import { exportAsRegistryTheme } from "@/lib/export-theme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, SaveAll, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

export function ThemeSelector() {
  // ... component implementation
  // Use the stores, render Select + Dialog + AlertDialog
  // Save/SaveAs open dialog, Delete opens alert dialog
  // Download creates a blob and triggers file download
}
```

Read shadcn's Select, Dialog, and AlertDialog component files to understand their exact API before implementing. The component should:

- Show "Unsaved Changes" when `activeThemeSlug` is null
- Show theme names when saved themes exist
- Show "(preset)" badge next to preset themes
- Disable Delete for presets
- On Save: if active theme exists, overwrite. If null, open save dialog.
- On Save As: always open dialog for new name
- On load: call `loadTheme(slug)` and show toast
- On delete: open confirmation, call `deleteTheme(slug)` and show toast
- Download button: export as JSON file via `URL.createObjectURL(new Blob(...))`

- [ ] **Step 2: Commit**

```bash
git add src/components/editor/theme-selector.tsx
git commit -m "feat: add theme selector with save/load/delete dialogs"
```

---

### Task 7: Integrate theme selector into token controls

**Files:**
- Modify: `src/components/editor/token-controls.tsx`

- [ ] **Step 1: Read the current token-controls**

- [ ] **Step 2: Add ThemeSelector above the mode toggle**

Import `ThemeSelector` and render it at the top of the sidebar header, above the light/dark toggle:

```tsx
import { ThemeSelector } from "./theme-selector";

// Inside TokenControls, in the header div:
<div className="p-3 border-b space-y-2">
  <ThemeSelector />
  <Separator />
  <div className="flex gap-1.5">
    {/* Light/Dark toggle + Undo/Redo + Reset */}
  </div>
  {/* Export buttons */}
</div>
```

Update the "Copy JSON" export to use the active theme name:

```tsx
const activeTheme = useThemeManagerStore((s) => s.getActiveTheme());
const themeName = activeTheme?.name ?? "custom-theme";

// In Copy JSON onClick:
const json = exportAsRegistryTheme(slugify(themeName), lightTokens, darkTokens);
```

- [ ] **Step 3: Verify**

```bash
pnpm dev
# Open /editor
# Theme selector shows "Unsaved Changes"
# Click Save → dialog asks for name → saves → appears in dropdown
# Select a preset → tokens update in editor + preview
# Delete a custom theme → confirmation → removed
# Export JSON uses active theme name
```

- [ ] **Step 4: Commit**

```bash
git add src/components/editor/token-controls.tsx
git commit -m "feat: integrate theme selector into editor sidebar"
```

---

## Chunk 4: Verification

### Task 8: Quality checks and manual testing

- [ ] **Step 1: Typecheck**

```bash
cd /Users/parkerb/dev/perimeter/claude/style && pnpm typecheck
```

- [ ] **Step 2: Lint**

```bash
pnpm lint
```

- [ ] **Step 3: Format**

```bash
pnpm format
```

- [ ] **Step 4: Full quality**

```bash
pnpm quality
```

- [ ] **Step 5: Manual testing checklist**

```bash
pnpm dev
```

Verify:
- [ ] Toast: Export CSS shows success toast
- [ ] Toast: Copy JSON shows success toast
- [ ] Toast: Reset shows toast
- [ ] Resizable: drag sidebar handle works
- [ ] Resizable: size persists on page refresh
- [ ] Undo: change color, Cmd+Z reverts it
- [ ] Redo: Cmd+Shift+Z restores it
- [ ] Undo buttons: disabled when no history
- [ ] Undo debounce: dragging color picker creates ~1 undo entry, not many
- [ ] Theme save: enter name, save, appears in dropdown
- [ ] Theme load: select saved theme, tokens update
- [ ] Theme overwrite: edit tokens, save same theme name, overwrites
- [ ] Theme preset: presets can be loaded but not deleted
- [ ] Theme delete: delete custom theme with confirmation
- [ ] Theme export: download .json file works
- [ ] All preview tabs still work with theme changes

- [ ] **Step 6: Fix issues and commit**

```bash
git add .
git commit -m "fix: resolve quality issues from tier 1 editor improvements"
```
