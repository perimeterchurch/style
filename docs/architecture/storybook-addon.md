# Storybook Addon Architecture

## Overview

The `packages/storybook-addon/` package provides two Storybook panels for live design system editing during development:

- **Token Editor** -- browse, search, and edit CSS custom properties with live preview, then persist changes to `tokens.css` or save as a named theme
- **Variant Creator** -- view, edit, clone, and delete component variant definitions (the `.variants.ts` files that drive component styling)

Both panels are dev-only tools. In production Storybook builds (where the Vite dev server middleware is unavailable), both panels automatically switch to read-only mode.

## Architecture

### Runtime Topology

```
┌──────────────────────────────────────────────────┐
│  Storybook Manager (iframe)                      │
│  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Token Editor  │  │ Variant Creator          │  │
│  │ panel         │  │ panel                    │  │
│  └──────┬───────┘  └──────────┬───────────────┘  │
│         │ fetch /api/style-addon/*   │            │
│         │ channel.emit(TOKEN_CHANGED)│            │
└─────────┼────────────────────────────┼────────────┘
          │                            │
┌─────────▼────────────────────────────▼────────────┐
│  Vite Dev Server                                   │
│  style-addon-middleware plugin                     │
│  (reads/writes packages/tokens/src/tokens.css,     │
│   packages/tokens/src/themes/*.css,                │
│   packages/components/src/**/*.variants.ts)        │
└────────────────────────────────────────────────────┘
          │ channel event
┌─────────▼──────────────────────────────────────────┐
│  Storybook Preview (iframe)                        │
│  preview.ts listens for TOKEN_CHANGED / TOKENS_RESET│
│  → applies document.documentElement.style overrides │
└────────────────────────────────────────────────────┘
```

### Dependencies

The addon now depends on `@perimeterchurch/style: workspace:*`. This gives panels access to the shared component library (Button, Card, Badge, Input, Select, Tabs, SearchInput, Textarea, EmptyState) so the UI is built from the same design system it edits.

### Registration

The addon registers via `src/preset.ts`, which exports three hooks:

| Hook                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `managerEntries()`     | Loads `manager.ts` into the manager iframe |
| `previewAnnotations()` | Loads `preview.ts` into the preview iframe |
| `viteFinal()`          | Injects the API middleware Vite plugin     |

`src/manager.ts` registers two panels under addon ID `perimeterchurch/style-addon`:

- `perimeterchurch/style-addon/token-editor` -- Token Editor
- `perimeterchurch/style-addon/variant-creator` -- Variant Creator

`manager.ts` also imports `./addon-components.css`, which injects the design system's CSS custom properties and component styles into the manager iframe so that `@perimeterchurch/style` components render correctly inside the panels.

### CSS Scoping and AddonProvider

Every panel is wrapped in `AddonProvider` (defined in `src/panels/shared/AddonProvider.tsx`). `AddonProvider` renders a `<div className="style-addon-root">` container that scopes all design system styles. This prevents Storybook's own manager styles from colliding with the panel UI.

```tsx
// manager.ts — both panels follow this pattern
render: ({ active }) =>
    React.createElement(AddonProvider, null,
        React.createElement(TokenEditor, { channel }))
```

The optional `theme` prop on `AddonProvider` accepts `"dark"` and sets `data-theme` on the root element for dark-mode support.

### Channel API

Defined in `src/constants.ts`:

| Event                                       | Direction          | Payload                           |
| ------------------------------------------- | ------------------ | --------------------------------- |
| `perimeterchurch/style-addon/token-changed` | Manager -> Preview | `{ name: string, value: string }` |
| `perimeterchurch/style-addon/tokens-reset`  | Manager -> Preview | (none)                            |

The preview listener (`src/preview.ts`) applies token overrides as inline `style` properties on `document.documentElement` for instant visual feedback. On reset, it removes all overrides.

## Token Editor

### How to Use

1. Open Storybook (`pnpm dev`) and select the **Token Editor** panel
2. Browse tokens by category (Colors, Spacing, Shadows, Typography, Radii, Transitions) using tabs
3. Search across all tokens using the search bar
4. Edit any token value -- the preview updates immediately
5. **Save** writes changes to `packages/tokens/src/tokens.css`
6. **Reset** reverts all unsaved edits and restores the preview
7. **Save as Theme** creates a new theme CSS file under `packages/tokens/src/themes/` and adds the `@import` to `base.css`

### Data Flow

```
User edits a token value
  → handleTokenChange updates local dirty state
  → channel.emit(TOKEN_CHANGED, { name, value })
  → preview.ts sets CSS property on :root
  → user sees live change in story preview

User clicks Save
  → POST /api/style-addon/write-tokens { updates: { "--color-primary": "#newvalue" } }
  → middleware reads tokens.css, applies updates, formats with Prettier, atomic-writes
  → Vite HMR picks up file change → full reload
```

### Editor Types

Each token category maps to a specialized editor widget:

| Category    | Editor          | Controls                               |
| ----------- | --------------- | -------------------------------------- |
| Colors      | `ColorEditor`   | Color picker + hex text input + swatch |
| Spacing     | `SpacingEditor` | Range slider (0-10rem) + text input    |
| Shadows     | `ShadowEditor`  | Text input + live shadow preview box   |
| Typography  | `TextEditor`    | Plain text input                       |
| Radii       | `TextEditor`    | Plain text input                       |
| Transitions | `TextEditor`    | Plain text input                       |

### Per-Token Reset

When a token has been modified but not yet saved, `TokenGroup` renders a `Badge` labeled `modified` and a `Button` labeled `Reset` inline next to that token's editor. Clicking Reset restores the single token to its original value without discarding changes to other tokens. This is wired through the optional `onTokenReset` prop on `TokenGroup` and the `dirtyTokens: Set<string>` tracking in `TokenEditor`.

## Variant Creator

### How to Use

1. Navigate to any component story under `Components/`
2. Open the **Variant Creator** panel
3. The panel auto-detects the current component from the story title (e.g., `Components/Primitives/Button`)
4. View all variants and sizes defined in the component's `.variants.ts` file
5. Click **New Variant** to create a variant from scratch or clone an existing one
6. **Edit** a variant to modify its Tailwind classes per state (base, hover, focus, active, disabled) using the visual property grid
7. **Clone** a variant to create a new one pre-filled from an existing variant
8. **Delete** removes addon-created variants (those with `_meta` -- original variants cannot be deleted)

### New Variant Flow

The **New Variant** button opens `NewVariantFlow`, a modal-style form that lets users:

1. Enter a name for the new variant (validated against existing names to prevent conflicts)
2. Select a **source** from a dropdown -- either "Blank (empty)" or any existing variant name

If an existing variant is chosen as the source, its definition is deep-cloned and stamped with `_meta.clonedFrom` and `_meta.createdAt`. A blank variant scaffolds a minimal definition with an empty `base` class string. The confirmed name and definition are passed to the parent via `onConfirm`.

### Property Grid

The property editing experience uses a structured **PropertyGrid** instead of the old append-only `PropertyPicker`. For each variant state (base, hover, focus, active, disabled), `PropertyGrid`:

1. Parses the current class string using `parseTailwindClasses(classString, stateKey)`
2. Displays a 2-column grid of `PropertyCell` components -- one per CSS property (background, text, border, ring)
3. Each `PropertyCell` shows the current token name and a resolved color swatch; clicking it opens a `Select` to pick a new token
4. Any class that `parseTailwindClasses` cannot categorize lands in an "Additional classes" collapsible `Textarea` for manual editing
5. On every change, `buildClassString(updatedProperties, additionalClasses, stateKey)` reconstructs the full class string and calls `onChange`

`PropertyGrid` also renders a `HintText` for each state key on first use, explaining what that state means.

### PropertyCell

`PropertyCell` is the individual cell inside `PropertyGrid`. It is a click-to-edit control:

- **Display mode** -- shows the token name in monospace (or a muted "Click to assign" placeholder) with a circular color swatch when the token resolves to a color value
- **Edit mode** -- replaces the display with a `Select` populated from the available token options; selecting a value commits it and returns to display mode
- A clear button (×) removes the property assignment when a value is set

### Component Detection

The panel extracts the component title from Storybook's state:

```
state.storyId → state.index[storyId].title → "Components/Primitives/Button"
```

This maps to the variants file at:

```
packages/components/src/primitives/Button/Button.variants.ts
```

The `resolveVariantsPath()` function in `readVariants.ts` handles this mapping.

## Contextual Hints

Two shared components provide first-use guidance across both panels:

### HintText

`HintText` (`src/panels/shared/HintText.tsx`) renders an inline dismissible hint banner. Each hint is identified by a `hintId` string. Once dismissed, the hint ID is stored in `localStorage` under `style-addon-hints-dismissed` and the banner no longer appears.

Props: `hintId: string`, `children: ReactNode`, `forceShow?: boolean`

### HelpToggle

`HelpToggle` (`src/panels/shared/HelpToggle.tsx`) is a small `?` button that clears the dismissed-hints list from `localStorage` and triggers a re-render so all `HintText` banners reappear. Intended for use in panel toolbars.

## Server Middleware

### API Endpoints

All endpoints are served under `/api/style-addon/` by the Vite plugin created in `src/server/middleware.ts`.

| Endpoint         | Method | Description                                      |
| ---------------- | ------ | ------------------------------------------------ |
| `read-tokens`    | GET    | Parse `tokens.css` and return flat + categorized |
| `write-tokens`   | POST   | Update token values in `tokens.css`              |
| `write-theme`    | POST   | Create a new theme CSS file + update `base.css`  |
| `read-variants`  | GET    | Parse a component's `.variants.ts` file          |
| `write-variant`  | POST   | Add or update a variant in `.variants.ts`        |
| `delete-variant` | DELETE | Remove a variant from `.variants.ts`             |

### File Write Safety

All file mutations follow the same safety pattern:

1. **Backup** -- copy existing file to `.bak` before any write
2. **Atomic write** -- write to a `.tmp` file, then `rename()` to the target path (prevents partial writes on crash)
3. **Prettier** -- format output through Prettier using the project's config before writing

### Server Modules

| Module            | Responsibility                                                          |
| ----------------- | ----------------------------------------------------------------------- |
| `readTokens.ts`   | Parse `@theme` and `:root` blocks from CSS, categorize tokens           |
| `writeTokens.ts`  | Update CSS custom property values in place                              |
| `writeTheme.ts`   | Generate theme CSS files, manage `@import` in `base.css`                |
| `readVariants.ts` | Parse `.variants.ts` files (extract object literals via brace-counting) |
| `writeVariant.ts` | Add, update, or remove variant entries in `.variants.ts`                |

## Read-Only Mode

Both panels detect when the middleware is unavailable (production builds, static Storybook) and switch to read-only mode:

- Token Editor: hides Save/Reset/Save as Theme toolbar, shows yellow "Read-only" banner
- Variant Creator: hides Edit/Clone/Delete buttons and the New Variant button, shows yellow "Read-only" banner

Detection happens on the initial `fetch()` call -- if it fails with a network error, `readOnly` is set to `true`.

## Extending

### Adding a New Token Category

1. Add the category to the `CategorizedTokens` interface in `src/server/readTokens.ts`
2. Add categorization logic in the `categorizeTokens()` function (match by token prefix)
3. Add the category-to-editor mapping in `CATEGORY_EDITOR_MAP` in `TokenEditor.tsx`
4. If needed, create a new editor widget in `src/panels/TokenEditor/editors/`

### Adding a New Editor Type

1. Create a new component in `src/panels/TokenEditor/editors/` following the `TokenEditorProps` interface (`{ name, value, onChange }`)
2. Export it from `src/panels/TokenEditor/editors/index.ts`
3. Add the editor to the switch in `TokenGroup.tsx`
4. Map it in `CATEGORY_EDITOR_MAP` in `TokenEditor.tsx`

### Adding New API Endpoints

1. Add a new `case` in the `switch` block in `src/server/middleware.ts`
2. Create server handler functions in a new file under `src/server/`
3. Write tests alongside (`.test.ts` in the same directory)

### Working with the Property Grid

The property grid is built from three composable pieces:

- **`PropertyCell`** (`src/panels/VariantCreator/PropertyCell.tsx`) -- a single click-to-edit cell for one CSS property (background, text, border, or ring). Accepts `tokenOptions: SelectOption[]`, the current `currentToken`/`currentLiteral`, a `resolvedColor` for the swatch, and `onSelect`/`onClear` callbacks.

- **`PropertyGrid`** (`src/panels/VariantCreator/PropertyGrid.tsx`) -- renders one `PropertyCell` per property in a 2-column grid for a given variant state key, plus the "Additional classes" textarea for overflow classes. Owns the parse/build cycle internally.

- **Parser utilities** (`src/panels/utils/parseTailwindClasses.ts`) -- two pure functions:
  - `parseTailwindClasses(classString, stateKey?)` -- splits a Tailwind class string into a `ParsedProperties` map (token, literal, or null per property) and an `additionalClasses` remainder string
  - `buildClassString(properties, additionalClasses, stateKey?)` -- reconstructs a class string from a `ParsedProperties` map, prepending the correct state prefix (`hover:`, `focus-visible:`, etc.)

  Both functions are state-prefix-aware: pass `stateKey` so classes are correctly stripped and rebuilt for the target interaction state. Custom properties in `var()` syntax are detected by the `TOKEN_RE` pattern; plain Tailwind color literals are detected by `LITERAL_RE`.
