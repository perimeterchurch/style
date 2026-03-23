# Storybook Addon Simplified Redesign

## Summary

Simplify the Storybook addon to focus on what matters: a polished Token Editor for live design token editing, integrated with official Storybook addons for theme switching and token documentation. Remove the Variant Creator panel (variant editing is a developer task best done in code). Rewrite the Token Editor UI using Storybook's built-in components — zero external dependencies, zero CSS injection.

## Goals

1. Rewrite Token Editor UI with `storybook/internal/components` (Button, TabsState, Form.Input, Badge, etc.)
2. Add per-token reset and contextual hints
3. Integrate `@storybook/addon-themes` for light/dark theme switching
4. Integrate `storybook-design-token` for auto-generated token documentation
5. Remove Variant Creator panel and all associated complexity (parser, property grid, CSS injection, AddonProvider, design system component imports)

## Non-Goals

- Visual variant editing (variants are developer-owned, edited in code)
- Using our own design system components in the addon UI (this caused CSS injection, bundler, and React import issues)
- Changing the server middleware API endpoints
- Changing the channel API or preview.ts

---

## Section 1: Scope

### Remove Entirely

| What | Why |
|------|-----|
| Variant Creator panel (all files in `src/panels/VariantCreator/`) | Variant editing is a developer task; the visual property grid added enormous complexity |
| `src/panels/utils/parseTailwindClasses.ts` + tests | Only needed by the property grid |
| `src/panels/shared/AddonProvider.tsx` + tests | CSS injection wrapper no longer needed |
| `src/addon-components.css` | CSS bundle for manager iframe no longer needed |
| `@perimeterchurch/style` dependency on addon | No longer importing design system components |
| `tsconfig.json` paths aliases | Were added for cross-package component resolution |

### Keep (Rewrite UI)

| What | Status |
|------|--------|
| Token Editor panel | Rewrite UI with Storybook components |
| Server middleware (all 6 endpoints) | Unchanged — variant endpoints kept for future use |
| Channel API (TOKEN_CHANGED / TOKENS_RESET) | Unchanged |
| `preview.ts` live preview listener | Unchanged |
| `src/panels/shared/HintText.tsx` | Rewrite dismiss button with Storybook's `Button` |
| `src/panels/shared/HelpToggle.tsx` | Rewrite with Storybook's `IconButton` |

### Add New

| What | How |
|------|-----|
| `@storybook/addon-themes` | Configure `withThemeByDataAttribute` for light/dark switching |
| `storybook-design-token` | Add `@tokens`/`@presenter` annotations to `tokens.css` |
| Per-token reset | New functionality in Token Editor |
| Contextual hints | HintText + HelpToggle in Token Editor panel |

---

## Section 2: Token Editor Panel — Storybook Components

### Component Swap Map

| Current | Replaced With | Import From |
|---------|--------------|-------------|
| Custom `CategoryTabs` | `TabsState` + `TabBar` + `TabButton` | `storybook/internal/components` |
| Custom `TokenSearch` | `Form.Input` with search styling | `storybook/internal/components` |
| Custom `TokenGroup` | `Collapsible` or toggle `Button` | `storybook/internal/components` |
| Toolbar `<button>` elements | `Button` | `storybook/internal/components` |
| Theme name dialog | `Form.Input` + `Button` | `storybook/internal/components` |
| Count indicators | `Badge` | `storybook/internal/components` |
| Help toggle | `IconButton` | `storybook/internal/components` |

### Token Editors

The four specialized editors (`ColorEditor`, `SpacingEditor`, `ShadowEditor`, `TextEditor`) keep their specialized inputs:
- Color picker (`<input type="color">`) — no Storybook equivalent
- Range slider (`<input type="range">`) — no Storybook equivalent
- Shadow preview box — custom inline styles
- Spacing preview box — custom inline styles

Their text inputs and labels switch to `Form.Input`. The `useAddonTheme()` hook continues to be used for any remaining inline styles on preview elements.

### New Features

**Per-token reset:**
- Each modified token shows a `Badge` with "modified" and a small reset `IconButton`
- Clicking reset reverts that single token and emits `TOKEN_CHANGED` with the original value
- Toolbar shows a `Badge` with the count of modified tokens

**Contextual hints:**
- Dismissable `HintText` banner at top: "Design tokens are the shared values (colors, spacing, shadows) used across all components. Changes here update the live preview instantly."
- `?` `IconButton` in toolbar to re-show dismissed hints
- Tooltips on Save ("Writes changes to tokens.css"), Save as Theme ("Creates a new theme CSS file"), Reset ("Revert all unsaved changes")

---

## Section 3: Theme System Integration

### @storybook/addon-themes

Add as a **root** dev dependency (not the addon's package.json — this is a Storybook-level addon). Configure in `.storybook/preview.ts`:

**Important:** The existing `.storybook/preview.ts` already has a manual theme decorator using `globalTypes.theme`, `initialGlobals.theme`, and a custom decorator. This manual implementation must be **replaced** (not appended) by `withThemeByDataAttribute`. Remove the existing `globalTypes`, `initialGlobals`, and custom theme decorator.

```ts
import { withThemeByDataAttribute } from '@storybook/addon-themes';

export const decorators = [
    withThemeByDataAttribute({
        themes: {
            light: '',
            dark: 'dark',
        },
        defaultTheme: 'light',
        attributeName: 'data-theme',
    }),
];
```

This adds a toolbar dropdown for switching between light and dark themes. Matches the existing `data-theme="dark"` convention used by the token system.

**Version note:** `@storybook/addon-themes@latest` requires `storybook@^10.3.3`. Either bump `storybook` in the root `package.json` or pin `@storybook/addon-themes` to a version compatible with `10.3.2`.

### storybook-design-token

Add as a **root** dev dependency (same as addon-themes — Storybook-level addon). Add token annotations to `packages/tokens/src/tokens.css`:

```css
/**
 * @tokens Colors
 * @presenter Color
 */
--color-primary: #374151;
--color-primary-hover: #1f2937;
/* ... */

/**
 * @tokens Spacing
 * @presenter Spacing
 */
--spacing-1: 0.25rem;
--spacing-2: 0.5rem;
/* ... */
```

Register in `.storybook/main.ts`:

```ts
addons: [
    'storybook-design-token',
    '@storybook/addon-themes',
    getAbsolutePath('../packages/storybook-addon/src/preset.ts'),
],
```

This auto-generates token documentation pages with visual presenters (color swatches, spacing boxes, typography samples, shadow previews).

---

## Section 4: Cleanup

### Files to Delete

All paths relative to `packages/storybook-addon/src/`:

- `panels/VariantCreator/VariantCreator.tsx`
- `panels/VariantCreator/VariantCreator.test.tsx`
- `panels/VariantCreator/VariantList.tsx`
- `panels/VariantCreator/VariantEditor.tsx`
- `panels/VariantCreator/PropertyPicker.tsx`
- `panels/VariantCreator/CssEditor.tsx`
- `panels/VariantCreator/VariantCard.tsx`
- `panels/VariantCreator/NewVariantFlow.tsx`
- `panels/VariantCreator/PropertyCell.tsx`
- `panels/VariantCreator/PropertyGrid.tsx`
- `panels/VariantCreator/index.ts`
- `panels/utils/parseTailwindClasses.ts`
- `panels/utils/parseTailwindClasses.test.ts`
- `panels/shared/AddonProvider.tsx`
- `panels/shared/AddonProvider.test.tsx`
- `addon-components.css`

### Files to Modify

- `manager.ts` — Remove Variant Creator panel registration, remove CSS import, remove AddonProvider wrapper
- `constants.ts` — Keep `VARIANT_CREATOR_PANEL_ID` (middleware still uses the component path resolution), but add a comment noting the panel UI is removed
- `index.ts` — Keep re-exports for constants (used by middleware)
- `package.json` — Remove `@perimeterchurch/style: workspace:*` dependency
- `tsconfig.json` — Remove `paths` aliases for component resolution
- `panels/shared/HintText.tsx` — Replace `var(--color-...)` CSS variable references with plain hex fallback values (the token CSS is not loaded in the manager iframe). Use Storybook's `useTheme()` for colors where available, or hardcoded neutral colors.
- `panels/shared/HelpToggle.tsx` — Same styling cleanup. Use Storybook's `IconButton` for the "?" button.
- `panels/TokenEditor/TokenEditor.tsx` — Full rewrite with Storybook components, per-token reset, hints
- `panels/TokenEditor/CategoryTabs.tsx` — Rewrite with `TabsState`/`TabBar`
- `panels/TokenEditor/TokenSearch.tsx` — Rewrite with `Form.Input`
- `panels/TokenEditor/TokenGroup.tsx` — Rewrite with `Collapsible` or toggle pattern, add dirty indicators
- `panels/TokenEditor/editors/ColorEditor.tsx` — Swap text input for `Form.Input`
- `panels/TokenEditor/editors/SpacingEditor.tsx` — Swap text input for `Form.Input`
- `panels/TokenEditor/editors/ShadowEditor.tsx` — Swap text input for `Form.Input`
- `panels/TokenEditor/editors/TextEditor.tsx` — Swap text input for `Form.Input`
- `panels/TokenEditor/TokenEditor.test.tsx` — Update for new UI structure

### Files to Add/Modify Outside Addon

- `.storybook/main.ts` — Register addon-themes and storybook-design-token
- `.storybook/preview.ts` — **Replace** existing manual theme decorator (`globalTypes.theme`, `initialGlobals.theme`, custom decorator) with `withThemeByDataAttribute`
- `packages/tokens/src/tokens.css` — Add `@tokens`/`@presenter` annotations
- Root `package.json` — Add `@storybook/addon-themes` and `storybook-design-token` as root dev dependencies

### Variant Middleware

The server endpoints for `read-variants`, `write-variant`, `delete-variant` remain in place. They're tested, working, and don't hurt anything. The UI that called them is removed but the API is preserved for potential future use.

### React Imports

The `import * as React from 'react'` additions to `packages/components/src/` files stay — they're good for general compatibility with classic JSX transforms and don't cause harm.

---

## Testing Strategy

- **Update `TokenEditor.test.tsx`** for new Storybook component-based UI structure
- **Delete `VariantCreator.test.tsx`** and `parseTailwindClasses.test.ts` (code they test is removed)
- **Keep all server tests** unchanged (middleware, readTokens, writeTokens, writeTheme, readVariants, writeVariant)
- **Manual testing** in Storybook dev mode:
  - Token Editor renders with Storybook components
  - Browse/search/edit/save tokens works end-to-end
  - Per-token reset works
  - Save as Theme creates theme file
  - Hints appear, dismiss, re-enable via "?" button
  - `@storybook/addon-themes` toolbar dropdown switches light/dark
  - `storybook-design-token` pages show annotated tokens with visual presenters
  - Storybook's own UI is not affected (no CSS leaks)
