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

## Variant Creator

### How to Use

1. Navigate to any component story under `Components/`
2. Open the **Variant Creator** panel
3. The panel auto-detects the current component from the story title (e.g., `Components/Primitives/Button`)
4. View all variants and sizes defined in the component's `.variants.ts` file
5. **Edit** a variant to modify its Tailwind classes per state (base, hover, focus, active, disabled)
6. **Clone** a variant to create a new one pre-filled from an existing variant
7. **Delete** removes addon-created variants (those with `_meta` -- original variants cannot be deleted)

### PropertyPicker Workflow

When editing a variant, the PropertyPicker lets users build Tailwind classes from design tokens:

1. Select a state key (base, hover, focus, active, disabled)
2. Select a property type (background, text, border, ring)
3. Pick a token from the dropdown
4. The picker generates the correct Tailwind class (e.g., `hover:bg-[var(--color-primary)]`)
5. The CssEditor textarea shows the full class list for manual editing

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
- Variant Creator: hides Edit/Clone/Delete buttons, shows yellow "Read-only" banner

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
