# Adding a Theme

How to create a new named theme CSS file.

## Step 1: Create the Theme File

Create `packages/tokens/src/themes/<name>.css`.

Template:

```css
/**
 * <Name> Theme
 * <Brief description>
 */
[data-theme='<name>'] {
    /* Override only the tokens you need to change.
       All other tokens inherit from :root (light) defaults. */

    /* Example: brand color overrides */
    --color-primary: #<hex>;
    --color-primary-hover: #<hex>;
    --color-primary-active: #<hex>;
    --color-primary-foreground: #<hex>;

    /* Example: surface overrides */
    --color-background: #<hex>;
    --color-foreground: #<hex>;
}
```

## Step 2: Import in base.css

Open `packages/tokens/src/base.css` and add an import for the new theme after the existing theme imports:

```css
@import 'tailwindcss';
@import './tokens.css';
@import './themes/dark.css';
@import './themes/<name>.css'; /* Add this line */
```

## Step 3: Build and Verify

```bash
pnpm build
```

The theme CSS will be included in `dist/tokens/base.css`.

## Step 4: Test in Storybook

In Storybook, wrap a story with the theme:

```tsx
export const WithTheme: Story = {
    decorators: [
        (Story) => (
            <div data-theme="<name>">
                <Story />
            </div>
        ),
    ],
};
```

Or start Storybook (`pnpm dev`) and manually add `data-theme="<name>"` to the preview root in browser DevTools.

## Step 5: Apply in Consumer Apps

```html
<!-- Entire page -->
<html data-theme="<name>">
    <!-- Scoped section -->
    <div data-theme="<name>">
        <Card>Themed content</Card>
    </div>
</html>
```

## Tokens Available for Override

See `docs/reference/design-tokens.md` for the full list. Common overrides:

- **Brand colors**: `--color-primary`, `--color-primary-hover`, `--color-primary-active`, `--color-primary-foreground`
- **Surfaces**: `--color-background`, `--color-foreground`, `--color-card`, `--color-card-foreground`
- **Borders**: `--color-border`, `--color-border-subtle`, `--color-input`
- **Base scale**: `--color-bg`, `--color-bg-subtle`, `--color-bg-muted`, `--color-text`, `--color-text-secondary`, `--color-text-muted`
- **Shadows**: `--shadow-xs` through `--shadow-2xl`

## Dark Variant of a Named Theme

If you need a dark version of a named theme, create a separate file that combines dark surface overrides with your theme's brand colors:

```css
/* packages/tokens/src/themes/<name>-dark.css */
[data-theme='<name>-dark'] {
    /* Dark surfaces (copy from dark.css) */
    --color-background: #0c0a09;
    --color-foreground: #fafaf9;
    --color-card: #1c1917;
    /* ... */

    /* Named theme brand colors */
    --color-primary: #<hex>;
    /* ... */
}
```
