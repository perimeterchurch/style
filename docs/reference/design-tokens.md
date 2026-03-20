# Design Token Reference

Complete reference for every CSS custom property defined in `packages/tokens/src/tokens.css`.

Source file: `packages/tokens/src/tokens.css`

## Semantic Colors

### Primary (Warm Indigo)

| Variable | Light | Dark | @theme |
| --- | --- | --- | --- |
| `--color-primary` | `#5b5bd6` | (unchanged) | Yes |
| `--color-primary-hover` | `#4e4eca` | (unchanged) | Yes |
| `--color-primary-active` | `#4242b8` | (unchanged) | Yes |
| `--color-primary-foreground` | `#ffffff` | (unchanged) | Yes |

### Success (Warm Green)

| Variable | Light | Dark | @theme |
| --- | --- | --- | --- |
| `--color-success` | `#46a758` | (unchanged) | Yes |
| `--color-success-hover` | `#3d9b4f` | (unchanged) | Yes |
| `--color-success-active` | `#348746` | (unchanged) | Yes |
| `--color-success-foreground` | `#ffffff` | (unchanged) | Yes |

### Warning (Warm Amber)

| Variable | Light | Dark | @theme |
| --- | --- | --- | --- |
| `--color-warning` | `#f5a623` | (unchanged) | Yes |
| `--color-warning-hover` | `#e09918` | (unchanged) | Yes |
| `--color-warning-active` | `#c88a14` | (unchanged) | Yes |
| `--color-warning-foreground` | `#ffffff` | (unchanged) | Yes |

### Error (Warm Rose)

| Variable | Light | Dark | @theme |
| --- | --- | --- | --- |
| `--color-error` | `#e54666` | (unchanged) | Yes |
| `--color-error-hover` | `#d93d5c` | (unchanged) | Yes |
| `--color-error-active` | `#c63652` | (unchanged) | Yes |
| `--color-error-foreground` | `#ffffff` | (unchanged) | Yes |

### Info (Sky Blue)

| Variable | Light | Dark | @theme |
| --- | --- | --- | --- |
| `--color-info` | `#0ea5e9` | (unchanged) | Yes |
| `--color-info-hover` | `#0284c7` | (unchanged) | Yes |
| `--color-info-active` | `#0369a1` | (unchanged) | Yes |
| `--color-info-foreground` | `#ffffff` | (unchanged) | Yes |

## Surface Colors

| Variable | Light | Dark | @theme |
| --- | --- | --- | --- |
| `--color-background` | `#ffffff` | `#0c0a09` | Yes |
| `--color-foreground` | `#1c1917` | `#fafaf9` | Yes |
| `--color-card` | `#ffffff` | `#1c1917` | Yes |
| `--color-card-foreground` | `#1c1917` | `#fafaf9` | Yes |
| `--color-muted` | `#f5f5f4` | `#292524` | Yes |
| `--color-muted-foreground` | `#78716c` | `#a8a29e` | Yes |
| `--color-accent` | `#f5f5f4` | `#292524` | Yes |
| `--color-accent-foreground` | `#1c1917` | `#fafaf9` | Yes |
| `--color-popover` | `#ffffff` | `#1c1917` | Yes |
| `--color-popover-foreground` | `#1c1917` | `#fafaf9` | Yes |
| `--color-destructive` | `#e54666` | (unchanged) | Yes |
| `--color-destructive-foreground` | `#ffffff` | (unchanged) | Yes |
| `--color-border` | `#d6d3d1` | `#44403c` | Yes |
| `--color-input` | `#d6d3d1` | `#44403c` | Yes |
| `--color-ring` | `#5b5bd6` | `#5b5bd6` | Yes |

## Base Scale (Warm Stone)

| Variable | Light | Dark | @theme |
| --- | --- | --- | --- |
| `--color-bg` | `#fafaf9` | `#0c0a09` | Yes |
| `--color-bg-subtle` | `#f5f5f4` | `#1c1917` | Yes |
| `--color-bg-muted` | `#e7e5e4` | `#292524` | Yes |
| `--color-text` | `#1c1917` | `#fafaf9` | Yes |
| `--color-text-secondary` | `#57534e` | `#a8a29e` | Yes |
| `--color-text-muted` | `#a8a29e` | `#78716c` | Yes |
| `--color-border-subtle` | `#e7e5e4` | `#292524` | Yes |

## Typography

### Font Families

| Variable | Value | @theme |
| --- | --- | --- |
| `--font-sans` | `ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` | Yes |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace` | Yes |

### Font Sizes

| Variable | Value | Pixels | @theme |
| --- | --- | --- | --- |
| `--font-size-xs` | `0.75rem` | 12px | Yes |
| `--font-size-sm` | `0.875rem` | 14px | Yes |
| `--font-size-base` | `1rem` | 16px | Yes |
| `--font-size-lg` | `1.125rem` | 18px | Yes |
| `--font-size-xl` | `1.25rem` | 20px | Yes |
| `--font-size-2xl` | `1.5rem` | 24px | Yes |
| `--font-size-3xl` | `1.875rem` | 30px | Yes |
| `--font-size-4xl` | `2.25rem` | 36px | Yes |

### Font Weights (Runtime Only)

| Variable | Value | @theme |
| --- | --- | --- |
| `--font-weight-normal` | `400` | No |
| `--font-weight-medium` | `500` | No |
| `--font-weight-semibold` | `600` | No |
| `--font-weight-bold` | `700` | No |

### Line Heights (Runtime Only)

| Variable | Value | @theme |
| --- | --- | --- |
| `--line-height-tight` | `1.25` | No |
| `--line-height-normal` | `1.5` | No |
| `--line-height-relaxed` | `1.75` | No |

## Spacing (Runtime Only)

| Variable | Value | Pixels |
| --- | --- | --- |
| `--spacing-xs` | `0.5rem` | 8px |
| `--spacing-sm` | `0.75rem` | 12px |
| `--spacing-md` | `1rem` | 16px |
| `--spacing-lg` | `1.5rem` | 24px |
| `--spacing-xl` | `2rem` | 32px |
| `--spacing-2xl` | `3rem` | 48px |
| `--spacing-3xl` | `4rem` | 64px |

## Border Radius

| Variable | Value | @theme |
| --- | --- | --- |
| `--radius-none` | `0` | Yes |
| `--radius-sm` | `0.375rem` | Yes |
| `--radius-md` | `0.5rem` | Yes |
| `--radius-lg` | `0.75rem` | Yes |
| `--radius-xl` | `1rem` | Yes |
| `--radius-2xl` | `1.5rem` | Yes |
| `--radius-full` | `9999px` | Yes |

## Shadows

All shadows use warm stone tint `rgb(28 25 23 / ...)` in light mode, pure black `rgb(0 0 0 / ...)` in dark mode.

| Variable | Light Value | Dark Value | @theme |
| --- | --- | --- | --- |
| `--shadow-xs` | `0 1px 2px 0 rgb(28 25 23 / 0.04)` | `0 1px 2px 0 rgb(0 0 0 / 0.3)` | Yes |
| `--shadow-sm` | `0 1px 3px 0 rgb(28 25 23 / 0.08), 0 1px 2px -1px rgb(28 25 23 / 0.08)` | `0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)` | Yes |
| `--shadow-md` | `0 4px 6px -1px rgb(28 25 23 / 0.08), 0 2px 4px -2px rgb(28 25 23 / 0.06)` | `0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)` | Yes |
| `--shadow-lg` | `0 10px 15px -3px rgb(28 25 23 / 0.08), 0 4px 6px -4px rgb(28 25 23 / 0.06)` | `0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)` | Yes |
| `--shadow-xl` | `0 20px 25px -5px rgb(28 25 23 / 0.08), 0 8px 10px -6px rgb(28 25 23 / 0.06)` | `0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)` | Yes |
| `--shadow-2xl` | `0 25px 50px -12px rgb(28 25 23 / 0.2)` | `0 25px 50px -12px rgb(0 0 0 / 0.5)` | Yes |

## Transitions (Runtime Only)

| Variable | Value |
| --- | --- |
| `--transition-fast` | `150ms cubic-bezier(0.4, 0, 0.2, 1)` |
| `--transition-base` | `200ms cubic-bezier(0.4, 0, 0.2, 1)` |
| `--transition-slow` | `300ms cubic-bezier(0.4, 0, 0.2, 1)` |

## Z-Index Scale (Runtime Only)

| Variable | Value | Purpose |
| --- | --- | --- |
| `--z-dropdown` | `1000` | Dropdowns, select menus |
| `--z-sticky` | `1020` | Sticky headers |
| `--z-fixed` | `1030` | Fixed position elements |
| `--z-modal-backdrop` | `1040` | Modal overlay backdrop |
| `--z-modal` | `1050` | Modal dialog content |
| `--z-popover` | `1060` | Popovers, tooltips |
| `--z-tooltip` | `1070` | Highest-priority tooltips |

## Focus Utilities

| Class | Effect |
| --- | --- |
| `.focus-ring` | `outline-none ring-2 ring-ring ring-offset-2 ring-offset-background` |
| `.focus-ring-inset` | `outline-none ring-2 ring-inset ring-ring` |
