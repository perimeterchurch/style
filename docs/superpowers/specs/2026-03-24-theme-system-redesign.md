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
7. Maintain consumer API (`data-theme` attribute, same CSS imports) — note: `className` overrides for themed properties (colors, radius, shadow) will no longer work since those properties are now CSS-variable-driven, not Tailwind-class-driven. This is a **behavioral breaking change** documented in Section 6.

## Non-Goals

- JavaScript runtime theme API (consumers use `data-theme` attribute — no JS helpers needed)
- Theme inheritance/composition (themes are flat CSS variable overrides; "inherited" in the Theme Editor means "using `:root` default value," not extending another theme)
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

**`list-themes` implementation:** Read all `*.css` files in `themes/`. For each file, extract the theme name from the `[data-theme='...']` selector using a regex. Return the list. Include "light" as the base (maps to editing `tokens.css` directly). Note: existing files use bare names (`dark.css`, `light.css`) while generated files use `theme-` prefix (`theme-perimeter-api.css`). The endpoint handles both conventions — it reads the theme name from the CSS selector, not the filename.

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

### Design Decision: CSS Classes, Not Inline Styles

Variants are applied as **CSS classes** (`.btn-primary`, `.btn-sm`), not inline `style` attributes. This is critical because:
- Inline styles would override theme `[data-theme] .btn` rules due to CSS specificity
- CSS classes in `@layer style-components` have lower specificity than both theme selectors and Tailwind utilities, allowing themes and consumer `className` overrides to work correctly

### Specificity Hierarchy (lowest to highest)

1. `@layer style-components { .btn { ... } }` — base component defaults
2. `@layer style-components { .btn-primary { ... } }` — variant classes
3. `[data-theme='dark'] .btn { ... }` — theme overrides (NOT in a layer, so higher specificity)
4. Tailwind utilities via consumer `className` — highest specificity due to Tailwind's layer ordering

This means: themes override component defaults, and consumers can still use Tailwind classes to override themes where needed.

### Current Variant File Patterns (4 distinct shapes)

The codebase has four variant patterns that each need a migration strategy:

**Pattern A — Standard VariantDefinition** (Button, Card, Badge, Skeleton):
```ts
// Current: { base, hover?, active?, focus?, outline? } with resolveVariant()
primary: { base: 'bg-[var(--color-primary)] text-white', hover: 'hover:bg-...', outline: '...' }
```

**Pattern B — Simple class maps** (Checkbox, Label):
```ts
// Current: Record<string, string> — just dimension/color classes
checkboxSizeClasses: { xs: 'h-3 w-3', sm: 'h-4 w-4', md: 'h-5 w-5' }
```

**Pattern C — Multi-slot structures** (Switch):
```ts
// Current: Record<string, { track, knob, translate }> — multiple DOM elements
switchSizeClasses: { sm: { track: 'h-5 w-9', knob: 'h-4 w-4', translate: 'translate-x-4' } }
```

**Pattern D — Hybrid functions** (Input, Select):
```ts
// Current: Mix of joined strings, Records, and helper functions
inputBaseClasses: string; inputSizeClasses: Record<string, string>; getInputBorderClasses(): string
```

### New Format

All patterns converge to the same shape: **CSS classes defined in `components.css`** that set CSS variables.

**Pattern A → CSS variant classes:**
```css
/* components.css */
.btn-primary { --btn-color: var(--color-primary); --btn-fg: var(--color-primary-foreground); }
.btn-secondary { --btn-color: var(--color-secondary); --btn-fg: var(--color-secondary-foreground); }
.btn-ghost { --btn-bg: transparent; --btn-border: transparent; --btn-shadow: none; }
.btn-outline { --btn-bg: transparent; --btn-fg: var(--btn-color); --btn-border: var(--btn-color); }
.btn-sm { --btn-padding-x: var(--spacing-sm); --btn-padding-y: var(--spacing-xs); --btn-font-size: var(--font-size-xs); }
```

**Pattern B → Dimensional CSS classes:**
```css
.checkbox { --checkbox-size: var(--spacing-md); width: var(--checkbox-size); height: var(--checkbox-size); }
.checkbox-sm { --checkbox-size: var(--spacing-sm); }
.checkbox-lg { --checkbox-size: var(--spacing-lg); }
```

**Pattern C → Multi-slot CSS classes:**
```css
.switch { --switch-track-w: 2.75rem; --switch-track-h: 1.5rem; --switch-knob-size: 1.25rem; --switch-translate: 1.25rem; }
.switch-sm { --switch-track-w: 2.25rem; --switch-track-h: 1.25rem; --switch-knob-size: 1rem; --switch-translate: 1rem; }
.switch-track { width: var(--switch-track-w); height: var(--switch-track-h); }
.switch-knob { width: var(--switch-knob-size); height: var(--switch-knob-size); transform: translateX(var(--switch-translate)); }
```

**Pattern D → Simplified base + variant classes:**
```css
.input { --input-radius: var(--radius-md); --input-padding-x: var(--spacing-sm); --input-font-size: var(--font-size-sm); --input-border: var(--color-border); }
.input-sm { --input-padding-x: var(--spacing-xs); --input-font-size: var(--font-size-xs); }
.input-error { --input-border: var(--color-error); --input-focus-ring: var(--color-error); }
```

### Variant File Simplification

Variant `.ts` files become lightweight mappings from prop values to CSS class names:

```ts
// Button.variants.ts (new) — maps props to CSS classes
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const buttonVariantClass: Record<ButtonVariant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
    info: 'btn-info',
    ghost: 'btn-ghost',
};

export const buttonSizeClass: Record<ButtonSize, string> = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
};

/** Icon pixel sizes per button size (consumed as a prop, not CSS) */
export const buttonIconSize: Record<ButtonSize, number> = {
    xs: 12, sm: 14, md: 16, lg: 18, xl: 20,
};
```

### Component File Changes

Components compose CSS classes instead of building Tailwind strings:

```tsx
function Button({ variant = 'primary', size = 'md', outline, className, ...props }) {
    return (
        <button
            className={cn(
                'btn',
                buttonVariantClass[variant],
                buttonSizeClass[size],
                outline && 'btn-outline',
                className,
            )}
            {...props}
        />
    );
}
```

### Eliminated Types and Utilities

- **Delete `VariantDefinition` interface** — no longer needed (variants are CSS classes)
- **Delete `SizeDefinition` interface** — no longer needed
- **Delete `resolveVariant()` function** — replaced by simple class composition
- **Delete `InteractiveProps` type** if it only served variant resolution
- **Keep `BaseComponentProps`** (className, children, etc.) and `WidthProps`
- **Update `packages/components/src/utils/types.ts`** accordingly

### Dark Mode Strategy

Dark mode is handled entirely in CSS — no `dark:` Tailwind prefixes in component code:

```css
/* In components.css */
[data-theme='dark'] .btn {
    --btn-border: color-mix(in oklab, var(--btn-bg), #fff 12%);
}
[data-theme='dark'] .card {
    --card-border: var(--color-stone-700);
}
```

The existing `@custom-variant dark` in `base.css` stays for any remaining Tailwind `dark:` usage outside components (e.g., in stories or consumer code), but components themselves no longer use it.

### Outline Mode

Outline is a CSS class, not a separate variant definition:

```css
.btn-outline {
    --btn-bg: transparent;
    --btn-fg: var(--btn-color, var(--color-foreground));
    --btn-border: var(--btn-color, var(--color-border));
}
.btn-outline:hover {
    --btn-bg: var(--btn-color);
    --btn-fg: var(--color-primary-foreground);
}
```

Applied via `outline && 'btn-outline'` in the component, after the variant class.

### iconSize Handling

`iconSize` stays as a **numeric value in the variant file** (not a CSS variable) since it's passed as a prop to icon components (`<Icon size={iconSize} />`). The `buttonIconSize` record maps sizes to pixel values separately from the CSS class system.

### Behavioral/Layout Tailwind Classes

Classes like `active:scale-[0.98]` (press feedback), `min-h-11`, `transition-colors` stay in component JSX as regular Tailwind classes passed through `cn()`. They are not themeable and don't move to CSS variables.

### Where Component CSS Lives

New file: `packages/tokens/src/components.css` — imported in `base.css` after `tokens.css`. Contains all `@layer style-components { ... }` definitions. This keeps component base styles with the token system (since they reference tokens) and ensures they're included in the consumer's CSS import.

### Migration Scope

16 primitives + 7 composites (23 total) need:
1. Base CSS class + variant/size classes added to `components.css`
2. `.variants.ts` simplified to prop→class-name mappings
3. Component `index.tsx` updated to compose CSS classes via `cn()`
4. Tests updated (assertions change from `toHaveClass('bg-[var(--color-primary)]')` to `toHaveClass('btn-primary')`)
5. `resolveVariant()`, `VariantDefinition`, `SizeDefinition` deleted from `utils/types.ts`

### Tailwind Class Usage After Refactor

Components still use Tailwind for:
- Layout utilities (`flex`, `grid`, `inline-flex`, `items-center`)
- Behavioral classes (`active:scale-[0.98]`, `transition-colors`)
- Non-themeable concerns (`truncate`, `overflow-hidden`, `whitespace-nowrap`)
- User-provided `className` (passed through via `cn()`)

Components NO LONGER use Tailwind for:
- Colors (`bg-[var(...)]` → CSS variable via `.btn-primary`)
- Radius (`rounded-md` → CSS variable via `.btn`)
- Shadows (`shadow-md` → CSS variable via `.btn`)
- Padding (`px-3 py-1.5` → CSS variable via `.btn-md`)
- Font size (`text-sm` → CSS variable via `.btn-md`)

### Existing Variant CRUD Endpoints

The `read-variants`, `write-variant`, and `delete-variant` middleware endpoints currently read/write `VariantDefinition` objects from `.variants.ts` files. Since variant files now contain simple class-name mappings (not editable CSS), these endpoints become irrelevant for visual editing. The Theme Editor edits component variables at the **theme level** (in `components.css` and theme files), not at the variant level.

**Decision:** Remove the variant CRUD endpoints from the middleware. The variant files are developer-owned code, edited in the IDE. Component theming happens through the Theme Editor's global and component token tabs.

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

### base.css Change: Remove Bundled Tailwind

The current `base.css` starts with `@import 'tailwindcss'`. This causes double-Tailwind when consumed by projects that already have Tailwind configured (all three consuming projects do). **Remove the Tailwind import from base.css:**

```css
/* base.css — NO @import 'tailwindcss' */
@import './tokens.css';
@import './components.css';
@import './themes/dark.css';
/* ... other theme imports added by write-theme endpoint */

@custom-variant dark (&:where([data-theme="dark"] *, [data-theme="dark"]));

@layer style-tokens { ... }
@layer style-base { ... }
```

Storybook's own preview loads Tailwind separately via the `@tailwindcss/vite` plugin in `.storybook/main.ts`.

### Dark Mode Standardization

All consuming projects must use `data-theme="dark"` attribute (not `.dark` class). This is already the case for perimeter-widgets and metrics. **perimeter-api needs a one-line change** in its theme provider: add `attribute="data-theme"` to the `next-themes` `ThemeProvider`.

### Consumer Import Pattern

All three consuming projects follow the same pattern:

```css
/* Consumer's root CSS */
@import 'tailwindcss';                      /* Consumer's own Tailwind */
@import '@perimeterchurch/style/tailwind';  /* Design tokens as Tailwind theme values */
@import '@perimeterchurch/style/css';       /* Tokens + component classes + themes */
```

For **perimeter-widgets shadow DOM**, import with `?inline` for CSS string injection:
```ts
import styles from '@perimeterchurch/style/css?inline';
```

### Per-Project Integration

**perimeter-api (Next.js 16):**
1. `pnpm add @perimeterchurch/style`
2. Replace `src/styles/tokens.css` with `@import '@perimeterchurch/style/css'`
3. Add `attribute="data-theme"` to `next-themes` ThemeProvider
4. Delete local token definitions — use design system tokens

**perimeter-widgets (Vite + Turborepo):**
1. `pnpm add @perimeterchurch/style` in shared package
2. Replace `shared/src/styles/tokens.css` with `@import '@perimeterchurch/style/css'`
3. Widget CSS inlining via `?inline` continues to work
4. `data-theme` attribute already used — no changes

**metrics (Next.js 15):**
1. Replace `@perimeter-widgets/shared` file dependency with `@perimeterchurch/style`
2. Replace token imports with `@import '@perimeterchurch/style/css'`
3. Keep app-specific tokens (chart colors, service colors) in local `tokens.css` as extensions
4. `data-theme` attribute already used — no changes

### Consumer Theme Application

```html
<!-- Light theme (default — no attribute needed) -->
<html>...</html>

<!-- Dark theme -->
<html data-theme="dark">...</html>

<!-- Project-specific theme -->
<html data-theme="perimeter-api">...</html>

<!-- Scoped theme on a section -->
<div data-theme="metrics">...</div>
```

**New capability:** Themes now include component-scoped overrides. Consumers get this for free through the same CSS import. A consuming project that uses `data-theme="dark"` automatically picks up any `--btn-*`, `--card-*` overrides in `dark.css`.

**Local overrides:** Consumers can override component variables in their own CSS without modifying the style repo:

```css
.sidebar { --btn-radius: var(--radius-sm); --card-shadow: none; }
```

### Consumer Override Precedence (Breaking Change)

**Before this redesign:** Component appearance was controlled by Tailwind classes. Consumers could override with `<Button className="rounded-full bg-red-500">` because Tailwind utilities had higher specificity than the component's own Tailwind classes merged via `cn()`.

**After this redesign:** Themed properties (colors, radius, shadow, padding) are CSS-variable-driven. Consumer overrides work differently:

| Override Method | Works? | Example |
|----------------|--------|---------|
| CSS custom property on parent | Yes | `.sidebar { --btn-radius: 9999px; }` |
| `data-theme` attribute | Yes | `<div data-theme="custom">` |
| Tailwind utility in `className` | **Partial** | `bg-red-500` works (overrides `background-color` in CSS cascade), but `rounded-full` may not override `border-radius: var(--btn-radius)` depending on layer order |
| Inline `style` prop | Yes | `style={{ borderRadius: '9999px' }}` always wins |

**Recommended consumer override pattern:** Use CSS custom properties or `data-theme` for themed overrides, not Tailwind classes. This is the same pattern used by DaisyUI, Radix Themes, and shadcn/ui.

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
| `packages/components/src/utils/types.ts` | Delete `VariantDefinition`, `SizeDefinition`, `resolveVariant()` |
| Every component `.variants.ts` (23 components) | Rewrite to prop→class-name mappings |
| Every component `index.tsx` (23 components) | Compose CSS classes via `cn()` instead of Tailwind class strings |
| Every component `.test.tsx` | Update assertions (class names like `btn-primary` instead of `bg-[var(...)]`) |
| `packages/storybook-addon/src/server/middleware.ts` | Remove `read-variants`, `write-variant`, `delete-variant` routes |

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
