# Theme System Redesign

## Summary

Redesign the design system's theming architecture to support multi-theme editing, component-scoped CSS variables, and a dynamic theme switcher. Themes become the foundation of component look and feel — not just color overrides but per-component property control (radius, shadow, padding, typography). The Token Editor becomes a Theme Editor with theme selection, inherited vs overridden token distinction, and component-specific tabs. Variant files are refactored from Tailwind class strings to CSS variable maps following DaisyUI's architecture.

## Goals

1. Introduce component-scoped CSS variables (`--btn-*`, `--card-*`, `--input-*`, etc.) that derive from global tokens and can be overridden per-theme
2. Refactor variant files from Tailwind class strings to CSS variable maps
3. Add `list-themes` and `read-theme` server endpoints for dynamic theme discovery
4. Redesign the Token Editor into a Theme Editor with theme selection dropdown, component tabs, and inherited/overridden distinction
5. Replace `@storybook/addon-themes` with a custom dynamic theme switcher toolbar
6. Reorganize Foundation stories into a Themes section
7. Maintain backward-compatible consumer API (`data-theme` attribute, same CSS imports)

## Non-Goals

- JavaScript runtime theme API (consumers use `data-theme` attribute — no JS helpers needed)
- Theme inheritance/composition (themes are flat CSS variable overrides)
- Visual regression testing (separate initiative)
- New components (separate initiative)

---

## Section 1: Component-Scoped CSS Variables

### Architecture

Every component gets private CSS variables that derive from global tokens. Themes override them at any level — globally, per-component, or per-variant.

### Naming Convention

`--{component}-{property}`

### Component Variable Pattern

```css
.btn {
    --btn-bg: var(--btn-color, var(--color-muted));
    --btn-fg: var(--color-foreground);
    --btn-border: color-mix(in oklab, var(--btn-bg), #000 8%);
    --btn-radius: var(--radius-md);
    --btn-padding-x: var(--spacing-md);
    --btn-padding-y: var(--spacing-sm);
    --btn-font-size: var(--font-size-sm);
    --btn-shadow: var(--shadow-xs);

    background-color: var(--btn-bg);
    color: var(--btn-fg);
    border-color: var(--btn-border);
    border-radius: var(--btn-radius);
    padding: var(--btn-padding-y) var(--btn-padding-x);
    font-size: var(--btn-font-size);
    box-shadow: var(--btn-shadow);
}
```

### Color Variants

Color variants swap `--{component}-color` and foreground. Everything else derives:

```css
.btn-primary {
    --btn-color: var(--color-primary);
    --btn-fg: var(--color-primary-foreground);
}
.btn-secondary {
    --btn-color: var(--color-secondary);
    --btn-fg: var(--color-secondary-foreground);
}
.btn-ghost {
    --btn-bg: transparent;
    --btn-border: transparent;
    --btn-shadow: none;
    --btn-fg: var(--color-foreground);
}
```

### Size Variants

Size variants override dimensional variables:

```css
.btn-sm {
    --btn-padding-x: var(--spacing-sm);
    --btn-padding-y: var(--spacing-xs);
    --btn-font-size: var(--font-size-xs);
}
.btn-lg {
    --btn-padding-x: var(--spacing-lg);
    --btn-padding-y: var(--spacing-md);
    --btn-font-size: var(--font-size-md);
}
```

### Theme Overrides Per-Component

```css
[data-theme='perimeter-api'] {
    --btn-radius: 9999px;
    --btn-shadow: var(--shadow-md);
    --card-shadow: none;
    --input-radius: var(--radius-sm);
}
```

### Components That Get Scoped Variables

Each component gets these common properties (where applicable):

| Property | Variable Pattern | Description |
|----------|-----------------|-------------|
| Background | `--{comp}-bg` | Background color |
| Foreground | `--{comp}-fg` | Text/content color |
| Border | `--{comp}-border` | Border color |
| Radius | `--{comp}-radius` | Border radius |
| Shadow | `--{comp}-shadow` | Box shadow |
| Padding X | `--{comp}-padding-x` | Horizontal padding |
| Padding Y | `--{comp}-padding-y` | Vertical padding |
| Font Size | `--{comp}-font-size` | Text size |

Plus component-specific properties:

| Component | Additional Variables |
|-----------|---------------------|
| Button | `--btn-color` (cascade source), `--btn-hover-bg`, `--btn-icon-size` |
| Card | `--card-hover-shadow`, `--card-hover-translate` |
| Input | `--input-placeholder-color`, `--input-focus-ring` |
| Select | `--select-chevron-color` |
| Badge | `--badge-dot-size` |
| Checkbox | `--checkbox-check-color` |
| Switch | `--switch-thumb-color`, `--switch-track-color` |
| Avatar | `--avatar-fallback-bg`, `--avatar-fallback-fg` |
| Tabs | `--tabs-indicator-color`, `--tabs-hover-bg` |
| Textarea | `--textarea-min-height` |
| Skeleton | `--skeleton-shimmer-from`, `--skeleton-shimmer-via` |

---

## Section 2: Theme File Structure and Server Endpoints

### Theme File Format

Each theme file is a CSS file in `packages/tokens/src/themes/` with a `[data-theme='name']` selector containing CSS variable overrides:

```css
/* themes/perimeter-api.css */
[data-theme='perimeter-api'] {
    /* Global token overrides */
    --color-primary: #1e40af;
    --color-primary-hover: #1d4ed8;
    --color-primary-foreground: #ffffff;

    /* Component-scoped overrides */
    --btn-radius: 9999px;
    --btn-shadow: var(--shadow-md);
    --card-shadow: none;
    --input-radius: var(--radius-sm);
}
```

### New Server Endpoints

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `list-themes` | GET | Scan `themes/` directory | `{ themes: [{ name: string, slug: string }] }` |
| `read-theme` | GET | Read one theme's overrides | `{ tokens: Record<string, string> }` |

**`list-themes` implementation:** Read all `*.css` files in `themes/`. For each file, extract the theme name from the `[data-theme='...']` selector using a regex. Return the list. Include "light" as the base (maps to editing `tokens.css` directly).

**`read-theme?theme=dark` implementation:** Read the theme CSS file, parse all `--property: value` declarations inside the `[data-theme='...']` block, return as a flat `Record<string, string>`.

### Existing Endpoints (unchanged)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `read-tokens` | GET | Read base `tokens.css` |
| `write-tokens` | POST | Update base tokens |
| `write-theme` | POST | Create/update a theme file (now handles component tokens too) |

### write-theme Enhancement

The existing `write-theme` endpoint already creates theme files. The only change: the `tokens` payload can now include component-scoped variables (`--btn-radius`, `--card-shadow`, etc.) alongside global tokens. No code change needed — `generateThemeCss` already writes arbitrary `--property: value` pairs.

---

## Section 3: Theme Editor UI

### Panel Rename

"Token Editor" becomes "Theme Editor" in `manager.ts` panel registration.

### Layout

```
┌─────────────────────────────────────────────┐
│ Theme: [▼ Light (base) ]  [+ New Theme]  [?]│
├─────────────────────────────────────────────┤
│ [Search tokens...]                           │
├─────────────────────────────────────────────┤
│ [Global Tokens] [Button] [Card] [Input] ... │
├─────────────────────────────────────────────┤
│ ┌─ Primary Colors ──────────────────────┐   │
│ │ --color-primary    ● #5b5bd6  [reset] │   │
│ │ --color-primary-h  ○ #4e4eca         │   │
│ │ --color-primary-fg ○ #ffffff          │   │
│ └───────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│ [Save] [Save as Theme] [Reset]  3 modified  │
└─────────────────────────────────────────────┘
```

### Theme Selector Dropdown

- Populated from `list-themes` endpoint on panel mount
- Selecting a theme fetches its overrides via `read-theme`
- "Light (base)" is always first — selects editing `tokens.css` directly
- New themes appear in the dropdown after creation (re-fetch list)

### Tab System

- **"Global Tokens" tab:** Current category tabs (Colors, Spacing, Shadows, Typography, Radii, Transitions) — these are the base design tokens
- **Component tabs:** One tab per component that has scoped variables (Button, Card, Input, Select, Textarea, Badge, Checkbox, Switch, Avatar, Tabs). Each shows that component's `--{comp}-*` variables

### Inherited vs Overridden Display

When editing a custom theme (not base):

- **Overridden tokens** (exist in theme file): Solid indicator (●), full opacity, editable, shows a "reset" button that removes the override
- **Inherited tokens** (from base, not in theme file): Hollow indicator (○), dimmed, still editable (clicking creates an override)
- When editing base/light: All tokens show as overridden (they're the source)

### Save Behavior

- **Base theme selected:** `write-tokens` to `tokens.css` (current behavior)
- **Custom theme selected:** `write-theme` with only the overridden tokens to that theme's CSS file. Inherited tokens are NOT written.

### Live Preview

- Same channel-based approach (`TOKEN_CHANGED` events)
- When editing a custom theme, emit a `THEME_CHANGED` event that sets `data-theme` on the preview iframe
- Dirty token overrides applied as inline styles on top

### New Channel Event

| Event | Direction | Payload |
|-------|-----------|---------|
| `perimeterchurch/style-addon/theme-changed` | Manager → Preview | `{ theme: string }` |

The preview listener sets `data-theme` on `.storybook-root` when this event fires.

---

## Section 4: Variant File Refactor

### Current Format

```ts
// Button.variants.ts (current)
export const buttonVariants = {
    primary: {
        base: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
        hover: 'hover:bg-[var(--color-primary-hover)]',
        focus: 'focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50',
    },
};
export const buttonSizes = {
    sm: { padding: 'px-3 py-1.5', fontSize: 'text-sm', iconSize: 14, radius: 'rounded-md' },
};
```

### New Format

Variant files export CSS variable maps instead of Tailwind class strings:

```ts
// Button.variants.ts (new)
export const buttonVariants: Record<string, Record<string, string>> = {
    primary: {
        '--btn-color': 'var(--color-primary)',
        '--btn-fg': 'var(--color-primary-foreground)',
        '--btn-hover-bg': 'var(--color-primary-hover)',
    },
    secondary: {
        '--btn-color': 'var(--color-secondary)',
        '--btn-fg': 'var(--color-secondary-foreground)',
        '--btn-hover-bg': 'var(--color-secondary-hover)',
    },
    ghost: {
        '--btn-bg': 'transparent',
        '--btn-border': 'transparent',
        '--btn-shadow': 'none',
        '--btn-fg': 'var(--color-foreground)',
    },
};

export const buttonSizes: Record<string, Record<string, string>> = {
    sm: {
        '--btn-padding-x': 'var(--spacing-sm)',
        '--btn-padding-y': 'var(--spacing-xs)',
        '--btn-font-size': 'var(--font-size-xs)',
        '--btn-icon-size': '14px',
    },
    md: {
        '--btn-padding-x': 'var(--spacing-md)',
        '--btn-padding-y': 'var(--spacing-sm)',
        '--btn-font-size': 'var(--font-size-sm)',
        '--btn-icon-size': '16px',
    },
};
```

### Component File Changes

Components apply variant variables as inline `style`, with a base CSS class for the variable-driven styling:

```tsx
function Button({ variant = 'primary', size = 'md', className, style, ...props }) {
    const variantVars = buttonVariants[variant];
    const sizeVars = buttonSizes[size];

    return (
        <button
            className={cn('btn', className)}
            style={{ ...variantVars, ...sizeVars, ...style }}
            {...props}
        />
    );
}
```

### Base Component CSS

Each component gets a CSS class defined in a component CSS file (or in the tokens CSS layer) that consumes its variables:

```css
@layer style-components {
    .btn {
        --btn-bg: var(--btn-color, var(--color-muted));
        --btn-fg: var(--color-foreground);
        --btn-border: color-mix(in oklab, var(--btn-bg), #000 8%);
        --btn-radius: var(--radius-md);
        --btn-padding-x: var(--spacing-md);
        --btn-padding-y: var(--spacing-sm);
        --btn-font-size: var(--font-size-sm);
        --btn-shadow: var(--shadow-xs);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background-color: var(--btn-bg);
        color: var(--btn-fg);
        border: 1px solid var(--btn-border);
        border-radius: var(--btn-radius);
        padding: var(--btn-padding-y) var(--btn-padding-x);
        font-size: var(--btn-font-size);
        box-shadow: var(--btn-shadow);
        font-weight: 500;
        line-height: 1.5;
        cursor: pointer;
        transition: background-color 150ms, border-color 150ms, box-shadow 150ms;
    }

    .btn:hover {
        --btn-bg: var(--btn-hover-bg, color-mix(in oklab, var(--btn-color, var(--color-muted)), #000 10%));
    }

    .btn:focus-visible {
        outline: none;
        box-shadow: var(--btn-shadow), 0 0 0 2px var(--color-background), 0 0 0 4px color-mix(in oklab, var(--btn-color, var(--color-primary)), transparent 50%);
    }

    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }
}
```

### Where Component CSS Lives

New file: `packages/tokens/src/components.css` — imported in `base.css` after `tokens.css`. Contains all `@layer style-components { ... }` definitions. This keeps component base styles with the token system (since they reference tokens) and ensures they're included in the consumer's CSS import.

### Migration Scope

All 19 primitives + 8 composites need:
1. `.variants.ts` rewritten from class strings to CSS variable maps
2. Component `index.tsx` updated to apply variables as inline `style`
3. Base CSS class added to `components.css`
4. Tests updated for new DOM structure (style attributes instead of class names)
5. Stories may need minor updates

### Tailwind Class Usage After Refactor

Components still use Tailwind for:
- Layout utilities (`flex`, `grid`, `inline-flex`, `items-center`)
- Non-themeable concerns (`truncate`, `overflow-hidden`, `whitespace-nowrap`)
- User-provided `className` (passed through via `cn()`)

Components NO LONGER use Tailwind for:
- Colors (`bg-[var(...)]` → CSS variable)
- Radius (`rounded-md` → CSS variable)
- Shadows (`shadow-md` → CSS variable)
- Padding (`px-3 py-1.5` → CSS variable)
- Font size (`text-sm` → CSS variable)

---

## Section 5: Storybook Theme Switcher

### Replace @storybook/addon-themes

Remove `@storybook/addon-themes` dependency. Build a custom theme switcher into the existing addon.

### Implementation

The addon's `preset.ts` already registers manager entries and preview annotations. Add:

**Manager side:** A toolbar button (registered in `manager.ts`) that:
1. Fetches `list-themes` on mount
2. Renders a dropdown with all available themes
3. Emits `THEME_CHANGED` event when selection changes
4. Persists selection in `localStorage`

**Preview side:** The existing `preview.ts` already listens for channel events. Add a listener for `THEME_CHANGED` that:
1. Sets `data-theme` attribute on `.storybook-root`
2. Stores the active theme name for future `TOKEN_CHANGED` events

### Storybook Preview Simplification

`.storybook/preview.ts` becomes simpler — remove `withThemeByDataAttribute` decorator and `@storybook/addon-themes` import. The custom addon handles everything:

```ts
import type { Preview } from '@storybook/react-vite';
import React from 'react';
import '../packages/tokens/src/base.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story) =>
            React.createElement(
                'div',
                { className: 'storybook-root', style: { padding: '1rem' } },
                React.createElement(Story),
            ),
    ],
};

export default preview;
```

---

## Section 6: Story Reorganization and Consumer API

### Story Changes

**Delete:** `packages/components/src/stories/Foundation/` (Colors, Typography, Spacing, Shadows, Radii, Themes stories)

**Create:** `packages/components/src/stories/Themes/`

| Story | Purpose |
|-------|---------|
| `ThemeShowcase.stories.tsx` | Grid of all components rendered in the currently selected theme |
| `ThemeComparison.stories.tsx` | Side-by-side rendering of a component across 2-3 themes |

### Consumer API

**No breaking changes.** Consumers continue to:

```css
/* Import everything — tokens + all themes + component base CSS */
@import '@perimeterchurch/style/css';
```

```html
<!-- Apply a theme -->
<html data-theme="perimeter-api">...</html>
```

**New capability:** Themes now include component-scoped overrides. Consumers get this for free through the same CSS import. A consuming project that uses `data-theme="dark"` automatically picks up any `--btn-*`, `--card-*` overrides in `dark.css`.

**Local overrides:** Consumers can override component variables in their own CSS without modifying the style repo:

```css
.sidebar { --btn-radius: var(--radius-sm); --card-shadow: none; }
```

### base.css Changes

```css
@import 'tailwindcss';
@import './tokens.css';
@import './components.css';  /* NEW — component base CSS with scoped variables */
@import './themes/dark.css';
/* Additional theme imports added by write-theme endpoint */
```

---

## File Impact

### New Files

| File | Purpose |
|------|---------|
| `packages/tokens/src/components.css` | Base CSS classes for all components with CSS variable definitions |
| `packages/storybook-addon/src/panels/ThemeEditor/ThemeEditor.tsx` | New Theme Editor panel (replaces TokenEditor) |
| `packages/storybook-addon/src/panels/ThemeEditor/ThemeSelector.tsx` | Theme dropdown component |
| `packages/storybook-addon/src/panels/ThemeEditor/ComponentTokens.tsx` | Component-specific token tab content |
| `packages/storybook-addon/src/server/listThemes.ts` | List themes endpoint handler |
| `packages/storybook-addon/src/server/readTheme.ts` | Read theme endpoint handler |
| `packages/components/src/stories/Themes/ThemeShowcase.stories.tsx` | Theme showcase story |
| `packages/components/src/stories/Themes/ThemeComparison.stories.tsx` | Theme comparison story |

### Modified Files

| File | Changes |
|------|---------|
| `packages/tokens/src/base.css` | Add `@import './components.css'` |
| `packages/storybook-addon/src/manager.ts` | Rename panel to "Theme Editor", add toolbar theme switcher |
| `packages/storybook-addon/src/preview.ts` | Add `THEME_CHANGED` listener |
| `packages/storybook-addon/src/constants.ts` | Add `THEME_CHANGED` event constant |
| `packages/storybook-addon/src/server/middleware.ts` | Add `list-themes` and `read-theme` routes |
| `.storybook/preview.ts` | Remove `@storybook/addon-themes`, simplify |
| `.storybook/main.ts` | Remove `@storybook/addon-themes` from addons |
| `package.json` (root) | Remove `@storybook/addon-themes` dependency |
| Every component `.variants.ts` | Rewrite from Tailwind classes to CSS variable maps |
| Every component `index.tsx` | Apply variant/size vars as inline style |
| Every component `.test.tsx` | Update assertions for new style-based approach |

### Deleted Files

| File | Reason |
|------|--------|
| `packages/components/src/stories/Foundation/` (all 6 files) | Replaced by Themes section |
| `packages/storybook-addon/src/panels/TokenEditor/` (entire directory) | Replaced by ThemeEditor |

---

## Testing Strategy

- **Unit tests** for `listThemes` and `readTheme` server modules
- **Unit tests** for component CSS variable application (verify style attributes contain correct variables)
- **Update existing component tests** for the variant refactor (test that variant prop produces correct inline styles)
- **Update Theme Editor tests** (rename from TokenEditor, add theme selector and component tab tests)
- **Manual testing:**
    - Theme Editor: switch between themes, edit tokens, see inherited vs overridden
    - Theme Editor: create new theme, verify it appears in dropdown and switcher
    - Theme Editor: component tabs show correct variables
    - Theme switcher toolbar: dropdown shows all themes, switching updates preview
    - Live preview: token changes reflect immediately in story rendering
    - Consumer import: `@perimeterchurch/style/css` includes component base CSS and all themes
    - Component rendering: all components render correctly with CSS variable approach
    - Dark mode: dark theme overrides work for both global and component tokens
