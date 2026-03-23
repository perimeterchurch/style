# Storybook Addon Architecture

## Overview

The `packages/storybook-addon/` package provides a single Storybook panel for live design system editing during development:

- **Token Editor** -- browse, search, and edit CSS custom properties with live preview, then persist changes to `tokens.css` or save as a named theme

The panel is a dev-only tool. In production Storybook builds (where the Vite dev server middleware is unavailable), the panel automatically switches to read-only mode.

## Architecture

### Runtime Topology

```
+-------------------------------------------------+
|  Storybook Manager (iframe)                     |
|  +--------------------------------------------+ |
|  | Token Editor panel                         | |
|  +--------------------+-----------------------+ |
|                       | fetch /api/style-addon/*|
|                       | channel.emit(TOKEN_CHANGED)
+-----------------------+-------------------------+
                        |
+-----------------------v-------------------------+
|  Vite Dev Server                                |
|  style-addon-middleware plugin                  |
|  (reads/writes packages/tokens/src/tokens.css,  |
|   packages/tokens/src/themes/*.css)             |
+-------------------------------------------------+
                        | channel event
+-----------------------v-------------------------+
|  Storybook Preview (iframe)                     |
|  preview.ts listens for TOKEN_CHANGED / TOKENS_RESET
|  -> applies document.documentElement.style overrides
+-------------------------------------------------+
```

### Registration

The addon registers via `src/preset.ts`, which exports three hooks:

| Hook                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `managerEntries()`     | Loads `manager.ts` into the manager iframe |
| `previewAnnotations()` | Loads `preview.ts` into the preview iframe |
| `viteFinal()`          | Injects the API middleware Vite plugin     |

`src/manager.ts` registers one panel under addon ID `perimeterchurch/style-addon`:

- `perimeterchurch/style-addon/token-editor` -- Token Editor

The panel UI is built exclusively with Storybook's built-in components (`Button`, `Badge`, `Form.Input` from `storybook/internal/components`) and plain inline styles. There is no dependency on `@perimeterchurch/style` from within the addon.

### Theme Switching via `@storybook/addon-themes`

Theme switching (light/dark) is handled by Storybook's official `@storybook/addon-themes` package, configured in `.storybook/preview.ts`:

```ts
withThemeByDataAttribute({
    themes: { light: '', dark: 'dark' },
    defaultTheme: 'light',
    attributeName: 'data-theme',
    parentSelector: '.storybook-root',
})
```

A decorator wraps every story in a `<div className="storybook-root">` container so the `data-theme` attribute applies within the correct scope. This is configured in `.storybook/main.ts` as an addon alongside the style addon:

```ts
addons: [
    '@storybook/addon-themes',
    getAbsolutePath('../packages/storybook-addon/src/preset.ts'),
],
```

The addon panels themselves use `useAddonTheme()` (a hook at `src/panels/useAddonTheme.ts`) to read Storybook's manager theme for consistent panel styling.

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
  -> handleTokenChange updates local dirty state
  -> channel.emit(TOKEN_CHANGED, { name, value })
  -> preview.ts sets CSS property on :root
  -> user sees live change in story preview

User clicks Save
  -> POST /api/style-addon/write-tokens { updates: { "--color-primary": "#newvalue" } }
  -> middleware reads tokens.css, applies updates, formats with Prettier, atomic-writes
  -> Vite HMR picks up file change -> full reload
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

When a token has been modified but not yet saved, `TokenGroup` renders a `Badge` labeled "modified" and a `Reset` button inline next to that token's editor. Clicking Reset restores the single token to its original value without discarding changes to other tokens.

This is tracked via:
- `dirty: Record<string, string>` in `TokenEditor` -- maps token names to their unsaved values
- `dirtyTokens: Set<string>` derived from `dirty` and passed to each `TokenGroup`
- `onTokenReset` callback on `TokenGroup` which removes the token from `dirty` and emits a `TOKEN_CHANGED` event with the original value

## Contextual Hints

Two shared components provide first-use guidance:

### HintText

`HintText` (`src/panels/shared/HintText.tsx`) renders an inline dismissible hint banner. Each hint is identified by a `hintId` string. Once dismissed, the hint ID is stored in `localStorage` under `style-addon-hints-dismissed` and the banner no longer appears.

Props: `hintId: string`, `children: ReactNode`, `forceShow?: boolean`

### HelpToggle

`HelpToggle` (`src/panels/shared/HelpToggle.tsx`) is a small `?` button that clears the dismissed-hints list from `localStorage` and triggers a re-render so all `HintText` banners reappear. Located in the Token Editor toolbar.

## Server Middleware

### API Endpoints

All endpoints are served under `/api/style-addon/` by the Vite plugin created in `src/server/middleware.ts`.

| Endpoint         | Method | UI          | Description                                      |
| ---------------- | ------ | ----------- | ------------------------------------------------ |
| `read-tokens`    | GET    | Token Editor | Parse `tokens.css` and return flat + categorized |
| `write-tokens`   | POST   | Token Editor | Update token values in `tokens.css`              |
| `write-theme`    | POST   | Token Editor | Create a new theme CSS file + update `base.css`  |
| `read-variants`  | GET    | None        | Parse a component's `.variants.ts` file          |
| `write-variant`  | POST   | None        | Add or update a variant in `.variants.ts`        |
| `delete-variant` | DELETE | None        | Remove a variant from `.variants.ts`             |

The variant endpoints (`read-variants`, `write-variant`, `delete-variant`) remain in the middleware but no longer have a panel UI. They were retained for potential future use or external tooling.

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

The Token Editor detects when the middleware is unavailable (production builds, static Storybook) and switches to read-only mode:

- Hides Save/Reset/Save as Theme toolbar
- Shows yellow "Read-only" banner

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
