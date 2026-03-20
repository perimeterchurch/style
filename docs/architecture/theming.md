# Theming Architecture

## Default Themes

The system ships with two built-in themes:

### Light Theme (Default)

Light values are the defaults defined in `:root` in `packages/tokens/src/tokens.css`. The light theme file at `packages/tokens/src/themes/light.css` is intentionally empty — it exists as a placeholder.

```css
/* packages/tokens/src/themes/light.css */
[data-theme='light'] {
    /* Light theme uses default :root values — no overrides needed */
}
```

### Dark Theme

Dark overrides are in `packages/tokens/src/themes/dark.css`. It overrides surface colors, base scale, and shadows under `[data-theme='dark']`.

Key dark mode changes:
- Background inverts: `#ffffff` becomes `#0c0a09`
- Text inverts: `#1c1917` becomes `#fafaf9`
- Borders lighten: `#d6d3d1` becomes `#44403c`
- Shadows use pure black with higher opacity

## How data-theme Scoping Works

Themes activate by setting `data-theme` on any DOM element:

```html
<!-- Entire page dark -->
<html data-theme="dark">

<!-- Scoped dark section -->
<div data-theme="dark">
    <Card>This card and all children use dark tokens</Card>
</div>
```

Because tokens use CSS custom properties via `var()`, any child element under a `[data-theme]` ancestor automatically picks up the overridden values. No JavaScript is required.

## @custom-variant dark Integration

In `packages/tokens/src/base.css`, dark mode is wired to Tailwind v4's `@custom-variant`:

```css
@custom-variant dark (&:where([data-theme="dark"] *, [data-theme="dark"]));
```

This means Tailwind's `dark:` prefix works based on `data-theme="dark"` ancestry, not `prefers-color-scheme`. Components can use:

```
dark:bg-stone-800 dark:text-stone-300
```

And these classes activate when a `[data-theme="dark"]` ancestor exists.

## Named Theme System

Beyond light/dark, you can create named themes that override any subset of tokens. Named themes use the same `[data-theme='<name>']` selector pattern.

A named theme CSS file overrides whichever tokens it needs:

```css
/* Example: packages/tokens/src/themes/christmas.css */
[data-theme='christmas'] {
    --color-primary: #c41e3a;
    --color-primary-hover: #a3162e;
    --color-primary-active: #8b1226;
    --color-success: #228b22;
}
```

Apply it the same way:

```html
<div data-theme="christmas">
    <Button>Festive Button</Button>
</div>
```

## How to Create a Named Theme

1. Create a new CSS file at `packages/tokens/src/themes/<name>.css`
2. Use the `[data-theme='<name>']` selector
3. Override only the tokens you want to change — all others inherit from `:root`
4. Import the theme in `packages/tokens/src/base.css`:
   ```css
   @import './themes/<name>.css';
   ```
5. Run `pnpm build` to verify the CSS is included in the output
6. Consumers apply the theme with `data-theme="<name>"` on any element

## Theme Composition

Themes do not cascade with each other. The innermost `[data-theme]` attribute wins. If you need a dark version of a named theme, create a separate theme file (e.g., `christmas-dark.css`) that combines both sets of overrides.

## Storybook Theme Support

The `.storybook-root` class is included alongside `:root` in token definitions to support Storybook's iframe sandboxing. Storybook decorators can set `data-theme` on the story root to preview theme variants.
