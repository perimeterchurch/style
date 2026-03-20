# Consuming @perimeterchurch/style

How to install and use this package in another project.

## Step 1: Configure .npmrc

Create or update `.npmrc` in the consumer project root:

```
@perimeterchurch:registry=https://npm.pkg.github.com
```

This tells npm/pnpm to resolve `@perimeterchurch/*` packages from GitHub Packages.

## Step 2: Authenticate

For local development, create a GitHub personal access token with `read:packages` scope and add to `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=ghp_<your-token>
```

For CI, set `NODE_AUTH_TOKEN` environment variable.

## Step 3: Install

```bash
# Core (tokens + components)
pnpm add @perimeterchurch/style

# Required peer deps
pnpm add react react-dom

# Optional peer deps (install only what you need)
pnpm add @headlessui/react    # For composite components
pnpm add framer-motion        # For motion components
pnpm add lucide-react         # For icon system
```

## Step 4: Import Base CSS

In your app's root CSS file (or layout component):

```css
/* Import base CSS (tokens + resets + dark mode) */
@import "@perimeterchurch/style/css";
```

Or for Tailwind v4 integration:

```css
/* Import Tailwind preset (tokens as Tailwind theme values) */
@import "tailwindcss";
@import "@perimeterchurch/style/tailwind";
@import "@perimeterchurch/style/css";
```

## Import Patterns

### Components (Primitives)

```tsx
import { Button, Card, Input, Badge } from '@perimeterchurch/style/components';
```

Available: `Button`, `Card`, `Badge`, `Input`, `Label`, `Skeleton`, `LoadingSpinner`, `Select`, `Textarea`, `Checkbox`, `Switch`, `Avatar`, `FilterChip`, `EmptyState`, `IndeterminateProgress`, `SearchInput`

### Components (Composite)

```tsx
import { ComboSelect, Dropdown, Tabs, Pagination } from '@perimeterchurch/style/composite';
```

Requires: `@headlessui/react@^2`

Available: `ComboSelect`, `Dropdown`, `DropdownItem`, `DropdownDivider`, `IconSelect`, `MultiIconSelect`, `Tabs`, `Pagination`, `DateRangePicker`

### Motion

```tsx
import { FadeIn, SlideUp, AnimatedList } from '@perimeterchurch/style/motion';
```

Requires: `framer-motion@^11`

Available: `FadeIn`, `SlideUp`, `ScaleIn`, `AnimatedList`, `AnimatedPanel`, `CountUp`, `SkeletonTransition`

Config presets: `springs`, `durations`, `easings`, `staggers`, `transitions`, `fadeVariants`, `slideUpVariants`, `scaleInVariants`, `staggerContainer`, `staggerItemVariants`, etc.

### Icons

```tsx
import { Icon, registerIcon, getIconNames } from '@perimeterchurch/style/icons';
```

Requires: `lucide-react@^0.400`

### Utilities

```tsx
import { cn, resolveVariant } from '@perimeterchurch/style/components';
import type { VariantDefinition, SizeDefinition, BaseVariant, BaseSize } from '@perimeterchurch/style/components';
```

### Tokens (JS)

```tsx
import { TOKEN_VERSION } from '@perimeterchurch/style';
```

## Tailwind Preset Integration

If you use Tailwind v4, import the preset to get all design token utility classes:

```css
/* app.css */
@import "tailwindcss";
@import "@perimeterchurch/style/tailwind";
```

This gives you classes like `bg-primary`, `text-error`, `rounded-lg`, `shadow-md`, etc.

## Theme Override Examples

### Global Dark Mode

```html
<html data-theme="dark">
    <body>
        <!-- All components use dark tokens -->
    </body>
</html>
```

### Scoped Theme

```tsx
<div data-theme="dark" className="p-4 rounded-lg">
    <Card>
        <Card.Header>Dark section</Card.Header>
        <Card.Body>This card uses dark theme tokens</Card.Body>
    </Card>
</div>
```

### Custom Token Overrides (CSS)

Override individual tokens for a section:

```css
.brand-section {
    --color-primary: #e11d48;
    --color-primary-hover: #be123c;
    --color-primary-active: #9f1239;
}
```

```tsx
<div className="brand-section">
    <Button variant="primary">Rose Primary</Button>
</div>
```

### Per-Component Override (Inline)

```tsx
<Button
    variant="primary"
    style={{ '--color-primary': '#e11d48' } as React.CSSProperties}
>
    Custom Color
</Button>
```

## Peer Dependency Matrix

| Entry Point | Peer Deps |
| --- | --- |
| `@perimeterchurch/style` | — |
| `@perimeterchurch/style/css` | — |
| `@perimeterchurch/style/tailwind` | — |
| `@perimeterchurch/style/components` | `react@^19` |
| `@perimeterchurch/style/composite` | `react@^19`, `@headlessui/react@^2` |
| `@perimeterchurch/style/motion` | `react@^19`, `framer-motion@^11` |
| `@perimeterchurch/style/icons` | `react@^19`, `lucide-react@^0.400` |
