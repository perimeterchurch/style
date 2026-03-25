# Editor Tier 1 Improvements

## Summary

Four foundational improvements to the theme editor that make it usable for real design work: undo/redo with keyboard shortcuts, named theme management (save/load/switch), toast feedback on all actions, and a resizable sidebar panel.

## Goals

1. Undo/redo with debounced history snapshots and Cmd+Z / Cmd+Shift+Z
2. Named theme management — save, load, switch, delete themes with localStorage persistence
3. Toast notifications on all user actions (export, save, reset, errors)
4. Resizable sidebar using the already-installed `react-resizable-panels`

## Non-Goals

- Token search/filter (Tier 2)
- Contrast checker (Tier 2)
- Per-component editing (Tier 3)
- Server-side theme persistence (localStorage only for now)

---

## Section 1: Undo/Redo

### Implementation

Use the `zundo` package (Zustand temporal middleware) to wrap the editor store with automatic history tracking.

**Install:** `pnpm add zundo`

**Store changes:** Wrap the existing store with `temporal` middleware:

```ts
import { temporal } from 'zundo';

export const useEditorStore = create<EditorState>()(
  persist(
    temporal(
      (set, get) => ({
        // ... existing store
      }),
      {
        // Debounce: only snapshot after 300ms of no changes
        // This prevents color picker drags from creating 50 undo entries
        limit: 50,
        wrapTemporal: (storeInitializer) =>
          // Debounce config handled via equality check
          storeInitializer,
      },
    ),
    { name: 'perimeter-editor' },
  ),
);
```

**Accessing undo/redo:**
```ts
const { undo, redo, pastStates, futureStates } = useEditorStore.temporal.getState();
```

### UI

Two icon buttons in the sidebar toolbar (next to Reset):
- Undo button (`Undo2` icon from Lucide) — disabled when no past states
- Redo button (`Redo2` icon from Lucide) — disabled when no future states

### Keyboard Shortcuts

Register global keyboard shortcuts via a `useEffect` in the editor page:
- `Cmd+Z` (Mac) / `Ctrl+Z` (Windows) → undo
- `Cmd+Shift+Z` / `Ctrl+Shift+Z` → redo

### Debouncing

The `zundo` middleware supports a `limit` option and equality checking. Configure it so rapid token changes (like dragging a color picker) are batched into a single undo entry. Use a 300ms debounce — if no changes for 300ms, snapshot the state.

---

## Section 2: Named Theme Management

### Data Model

```ts
interface SavedTheme {
  name: string;
  slug: string;
  lightTokens: Record<string, string>;
  darkTokens: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
```

### Storage

New Zustand store `useThemeManagerStore` persisted to localStorage under key `perimeter-themes`:

```ts
interface ThemeManagerState {
  savedThemes: SavedTheme[];
  activeThemeSlug: string | null; // null = unsaved working state
  saveTheme: (name: string) => void;
  saveThemeAs: (name: string) => void;
  loadTheme: (slug: string) => void;
  deleteTheme: (slug: string) => void;
}
```

`saveTheme` reads current tokens from the editor store and saves/overwrites. `loadTheme` writes saved tokens into the editor store. `deleteTheme` removes from the list and resets to unsaved state if the deleted theme was active.

### Built-in Presets

On first load (when `savedThemes` is empty), seed with read-only presets parsed from `registry/themes/*.json`:
- `perimeter-api` theme
- `metrics` theme

These presets have an `isPreset: true` flag and cannot be deleted or overwritten. Editing a preset creates a copy.

### UI

**Theme selector** — A `Select` dropdown at the top of the sidebar:
- "Unsaved Changes" (when `activeThemeSlug` is null)
- Saved theme names (sorted alphabetically)
- Separator
- "+ Create New Theme" option (triggers save dialog)

**Action buttons** (row below the selector):
- **Save** (`Save` icon) — if active theme exists, overwrites it. If unsaved, opens save dialog.
- **Save As** (`SaveAll` icon) — always opens dialog for new name.
- **Delete** (`Trash2` icon) — opens confirmation dialog. Disabled for presets.

**Save dialog** — shadcn `Dialog` with:
- Text `Input` for theme name
- "Save" and "Cancel" buttons
- Validation: name required, slug must be unique

**Delete confirmation** — shadcn `AlertDialog`:
- "Are you sure you want to delete {name}?"
- "Delete" (destructive) and "Cancel" buttons

### Export Integration

The existing "Copy Theme JSON" button exports in `registry:theme` format using the active theme name as the registry item name. A new "Download .json" button triggers a file download of the theme JSON — users can drop this into `registry/themes/` directly.

---

## Section 3: Toast Feedback

### Setup

Add `<Toaster />` from `sonner` (shadcn's toast component) to the root layout (`src/app/layout.tsx`).

### Toast Triggers

| Action | Toast |
|--------|-------|
| Export CSS copied | `toast.success("CSS copied to clipboard")` |
| Copy Theme JSON | `toast.success("Theme JSON copied to clipboard")` |
| Download Theme .json | `toast.success("Theme file downloaded")` |
| Save theme | `toast.success("Theme '{name}' saved")` |
| Delete theme | `toast.success("Theme '{name}' deleted")` |
| Load theme | `toast("Loaded theme '{name}'")` |
| Reset to defaults | `toast("Tokens reset to defaults")` |
| Undo | `toast("Undo")` (subtle, no icon) |
| Redo | `toast("Redo")` (subtle, no icon) |
| Clipboard failure | `toast.error("Failed to copy to clipboard")` |
| Invalid theme name | `toast.error("Theme name is required")` |

### Implementation

Import `toast` from `sonner` in `token-controls.tsx` and the new theme manager component. Wrap clipboard operations in try/catch.

---

## Section 4: Resizable Sidebar

### Implementation

Replace the fixed `w-80` aside + flex main layout in `src/app/editor/page.tsx` with shadcn's `ResizablePanelGroup`:

```tsx
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

<ResizablePanelGroup direction="horizontal" className="h-screen">
  <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
    <TokenControls />
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={75}>
    {/* preview tabs + iframe */}
  </ResizablePanel>
</ResizablePanelGroup>
```

**Defaults:** Sidebar starts at 25% width (~320px on a 1280px screen), minimum 15% (~192px), maximum 40% (~512px).

**Persistence:** `ResizablePanelGroup` supports an `autoSaveId` prop that persists panel sizes to localStorage automatically. Set `autoSaveId="editor-layout"`.

---

## File Impact

### New Files

| File | Purpose |
|------|---------|
| `src/lib/theme-manager-store.ts` | Zustand store for saved themes |
| `src/components/editor/theme-selector.tsx` | Theme dropdown + save/delete dialogs |

### Modified Files

| File | Changes |
|------|---------|
| `src/lib/editor-store.ts` | Add `zundo` temporal middleware for undo/redo |
| `src/app/editor/page.tsx` | Resizable panels, keyboard shortcuts, undo/redo buttons |
| `src/components/editor/token-controls.tsx` | Toast notifications, theme selector integration |
| `src/app/layout.tsx` | Add `<Toaster />` from sonner |
| `package.json` | Add `zundo` dependency |

### Dependencies

| Package | Purpose |
|---------|---------|
| `zundo` | Zustand undo/redo middleware |

`react-resizable-panels` and `sonner` are already installed.

---

## Testing Strategy

- **TypeScript** — `pnpm typecheck`
- **Lint** — `pnpm lint`
- **Manual testing:**
  - Undo/redo: change a color, Cmd+Z reverts, Cmd+Shift+Z redoes
  - Undo debouncing: drag color picker, release — one undo entry, not many
  - Save theme: enter name, save, verify it appears in dropdown
  - Load theme: select a saved theme, tokens update in editor + preview
  - Delete theme: delete a saved theme, verify it's removed
  - Preset protection: presets can't be deleted or overwritten
  - Export with toast: copy CSS, see toast confirmation
  - Resizable: drag the sidebar handle, resize persists on reload
  - Keyboard shortcuts work in editor context
