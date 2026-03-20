# Design Tokens Architecture

## Two-Layer System

Tokens are defined twice in `packages/tokens/src/tokens.css`:

### Layer 1: `@theme` Block (Build-Time)

The `@theme { }` block provides static hex values that Tailwind v4 reads at build time to generate utility classes. These values cannot use `var()` — they must be literal.

```css
@theme {
    --color-primary: #5b5bd6;
    --radius-md: 0.5rem;
    /* ... */
}
```

This enables classes like `bg-primary`, `text-error`, `rounded-md` in Tailwind.

### Layer 2: `:root` Block (Runtime)

The `:root, .storybook-root { }` block provides CSS custom properties that components reference via `var()`. These can be overridden at runtime by themes or scoped styles.

```css
:root, .storybook-root {
    --color-primary: #5b5bd6;
    --spacing-md: 1rem;
    /* ... */
}
```

Components use these via `bg-[var(--color-primary)]` for runtime overrideability.

### Why Both Layers

- `@theme` values generate Tailwind utilities (`bg-primary` works)
- `:root` values allow runtime overrides (themes, scoped styling)
- Both layers use identical values for the default (light) theme
- Components use `var()` syntax so theme changes propagate automatically

## Token Categories

### Semantic Colors

| Variable | Default | Purpose |
| --- | --- | --- |
| `--color-primary` | `#5b5bd6` | Primary actions (warm indigo) |
| `--color-primary-hover` | `#4e4eca` | Primary hover state |
| `--color-primary-active` | `#4242b8` | Primary active/pressed state |
| `--color-primary-foreground` | `#ffffff` | Text on primary background |
| `--color-success` | `#46a758` | Success state (warm green) |
| `--color-success-hover` | `#3d9b4f` | Success hover |
| `--color-success-active` | `#348746` | Success active |
| `--color-success-foreground` | `#ffffff` | Text on success background |
| `--color-warning` | `#f5a623` | Warning state (warm amber) |
| `--color-warning-hover` | `#e09918` | Warning hover |
| `--color-warning-active` | `#c88a14` | Warning active |
| `--color-warning-foreground` | `#ffffff` | Text on warning background |
| `--color-error` | `#e54666` | Error state (warm rose) |
| `--color-error-hover` | `#d93d5c` | Error hover |
| `--color-error-active` | `#c63652` | Error active |
| `--color-error-foreground` | `#ffffff` | Text on error background |
| `--color-info` | `#0ea5e9` | Info state (sky blue) |
| `--color-info-hover` | `#0284c7` | Info hover |
| `--color-info-active` | `#0369a1` | Info active |
| `--color-info-foreground` | `#ffffff` | Text on info background |

### Surface Colors

| Variable | Default | Purpose |
| --- | --- | --- |
| `--color-background` | `#ffffff` | Page background |
| `--color-foreground` | `#1c1917` | Default text color |
| `--color-card` | `#ffffff` | Card background |
| `--color-card-foreground` | `#1c1917` | Card text |
| `--color-muted` | `#f5f5f4` | Muted/subtle background |
| `--color-muted-foreground` | `#78716c` | Muted text |
| `--color-accent` | `#f5f5f4` | Accent background |
| `--color-accent-foreground` | `#1c1917` | Accent text |
| `--color-popover` | `#ffffff` | Popover/dropdown background |
| `--color-popover-foreground` | `#1c1917` | Popover text |
| `--color-destructive` | `#e54666` | Destructive action (alias for error) |
| `--color-destructive-foreground` | `#ffffff` | Text on destructive background |
| `--color-border` | `#d6d3d1` | Default border |
| `--color-input` | `#d6d3d1` | Input border |
| `--color-ring` | `#5b5bd6` | Focus ring |

### Base Scale (Warm Stone)

| Variable | Default | Purpose |
| --- | --- | --- |
| `--color-bg` | `#fafaf9` | App-level background |
| `--color-bg-subtle` | `#f5f5f4` | Subtle background |
| `--color-bg-muted` | `#e7e5e4` | Muted background |
| `--color-text` | `#1c1917` | Primary text |
| `--color-text-secondary` | `#57534e` | Secondary text |
| `--color-text-muted` | `#a8a29e` | Muted text |
| `--color-border-subtle` | `#e7e5e4` | Subtle border |

### Typography

| Variable | Default | Purpose |
| --- | --- | --- |
| `--font-sans` | System sans-serif stack | Body text |
| `--font-mono` | System monospace stack | Code |
| `--font-size-xs` | `0.75rem` | 12px |
| `--font-size-sm` | `0.875rem` | 14px |
| `--font-size-base` | `1rem` | 16px |
| `--font-size-lg` | `1.125rem` | 18px |
| `--font-size-xl` | `1.25rem` | 20px |
| `--font-size-2xl` | `1.5rem` | 24px |
| `--font-size-3xl` | `1.875rem` | 30px |
| `--font-size-4xl` | `2.25rem` | 36px |
| `--font-weight-normal` | `400` | Normal weight |
| `--font-weight-medium` | `500` | Medium weight |
| `--font-weight-semibold` | `600` | Semibold weight |
| `--font-weight-bold` | `700` | Bold weight |
| `--line-height-tight` | `1.25` | Tight leading |
| `--line-height-normal` | `1.5` | Normal leading |
| `--line-height-relaxed` | `1.75` | Relaxed leading |

### Spacing

| Variable | Default | Purpose |
| --- | --- | --- |
| `--spacing-xs` | `0.5rem` | 8px |
| `--spacing-sm` | `0.75rem` | 12px |
| `--spacing-md` | `1rem` | 16px |
| `--spacing-lg` | `1.5rem` | 24px |
| `--spacing-xl` | `2rem` | 32px |
| `--spacing-2xl` | `3rem` | 48px |
| `--spacing-3xl` | `4rem` | 64px |

### Border Radius

| Variable | Default | Purpose |
| --- | --- | --- |
| `--radius-none` | `0` | No rounding |
| `--radius-sm` | `0.375rem` | Small |
| `--radius-md` | `0.5rem` | Medium |
| `--radius-lg` | `0.75rem` | Large |
| `--radius-xl` | `1rem` | Extra large |
| `--radius-2xl` | `1.5rem` | 2x extra large |
| `--radius-full` | `9999px` | Pill/circle |

### Shadows

| Variable | Default | Purpose |
| --- | --- | --- |
| `--shadow-xs` | `0 1px 2px 0 rgb(28 25 23 / 0.04)` | Minimal elevation |
| `--shadow-sm` | (multi-layer) | Small elevation |
| `--shadow-md` | (multi-layer) | Medium elevation |
| `--shadow-lg` | (multi-layer) | Large elevation |
| `--shadow-xl` | (multi-layer) | Extra large elevation |
| `--shadow-2xl` | `0 25px 50px -12px rgb(28 25 23 / 0.2)` | Maximum elevation |

All shadows use warm stone tint `rgb(28 25 23 / ...)` for consistency.

### Transitions

| Variable | Default | Purpose |
| --- | --- | --- |
| `--transition-fast` | `150ms cubic-bezier(0.4, 0, 0.2, 1)` | Quick interactions |
| `--transition-base` | `200ms cubic-bezier(0.4, 0, 0.2, 1)` | Default transitions |
| `--transition-slow` | `300ms cubic-bezier(0.4, 0, 0.2, 1)` | Slow/emphasis |

### Z-Index Scale

| Variable | Default | Purpose |
| --- | --- | --- |
| `--z-dropdown` | `1000` | Dropdowns |
| `--z-sticky` | `1020` | Sticky headers |
| `--z-fixed` | `1030` | Fixed elements |
| `--z-modal-backdrop` | `1040` | Modal backdrop |
| `--z-modal` | `1050` | Modal content |
| `--z-popover` | `1060` | Popovers |
| `--z-tooltip` | `1070` | Tooltips |

## CSS Layer Strategy

`packages/tokens/src/base.css` uses two CSS layers:

- **`style-tokens`** — Sets font-family, color, and line-height on `:root` and `.storybook-root`
- **`style-base`** — Box-sizing reset, cursor rules, shimmer animation, scrollbar hiding

Layers ensure predictable specificity: Tailwind utilities always win over base styles.

## How to Add a New Token

1. Add the variable to the `@theme { }` block in `packages/tokens/src/tokens.css` with its static value
2. Add the same variable to the `:root, .storybook-root { }` block with the same value
3. If the token needs dark mode override, add it to `packages/tokens/src/themes/dark.css` under `[data-theme='dark']`
4. Run `pnpm build` to verify
5. Document the new token in `docs/reference/design-tokens.md`

## Focus Ring Utilities

Defined in `tokens.css` under `@layer utilities`:

- `.focus-ring` — Outer focus ring: `ring-2 ring-ring ring-offset-2 ring-offset-background`
- `.focus-ring-inset` — Inset focus ring: `ring-2 ring-inset ring-ring`
