# Component Architecture

## Dual API Pattern

Most interactive components expose two APIs via `Object.assign`:

### Simple API (Props-Driven)

A single component with props for all configuration:

```tsx
<Button variant="primary" size="md" outline>
    Click me
</Button>
```

### Compound API (Composable)

Sub-components for full layout control:

```tsx
<Button.Root variant="primary" size="md">
    <Button.Icon><SearchIcon /></Button.Icon>
    <Button.Label>Search</Button.Label>
</Button.Root>
```

### How Object.assign Works

The simple component is a `forwardRef` component. Compound parts are attached via `Object.assign`:

```tsx
const SimpleButton = forwardRef<ButtonElement, ButtonProps>(/* ... */);

export const Button = Object.assign(SimpleButton, {
    Root: ButtonRoot,
    Icon: ButtonIcon,
    Label: ButtonLabel,
});
```

This means `Button` works as both `<Button>` (simple) and `<Button.Root>` (compound).

### Components with Compound API

| Component | Simple | Compound Parts |
| --- | --- | --- |
| Button | `<Button>` | `Button.Root`, `Button.Icon`, `Button.Label` |
| Card | `<Card>` | `Card.Header`, `Card.Body`, `Card.Footer` |
| Input | `<Input>` | `Input.Root`, `Input.Addon` |
| Select | `<Select>` | `Select.Root`, `Select.Option` |
| Tabs | `<Tabs>` | `Tabs.Root`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panels`, `Tabs.Panel` |
| ComboSelect | `<ComboSelect>` | — (uses Headless UI internally) |
| Dropdown | `<Dropdown>` | — (uses Headless UI internally) |

### React Context for Shared State

Compound APIs use React Context to share state between parent and children:

```tsx
interface ButtonContextValue {
    variant: ButtonVariant;
    size: ButtonSize;
}

const ButtonContext = createContext<ButtonContextValue>({
    variant: 'primary',
    size: 'md',
});
```

The Root component wraps children in a Provider. Child components call `useContext` to access shared state.

## Variant File Pattern

Every component has a `.variants.ts` file that is the single source of truth for styling.

### File Location

```
packages/components/src/primitives/<Name>/<Name>.variants.ts
packages/components/src/composite/<Name>/<Name>.variants.ts
```

### VariantDefinition Records

For components with semantic variants (primary, secondary, etc.):

```ts
import type { VariantDefinition } from '../../utils/types';

export const buttonVariants: Record<string, VariantDefinition> = {
    primary: {
        base: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
        hover: 'hover:bg-[var(--color-primary-hover)]',
        active: 'active:bg-[var(--color-primary-active)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2 ...',
        outline: 'border-2 border-[var(--color-primary)] ...',
    },
    // ... more variants
};
```

### SizeDefinition Records

For components with size options:

```ts
import type { SizeDefinition } from '../../utils/types';

export const buttonSizes: Record<string, SizeDefinition> = {
    xs: { padding: 'px-2 py-1', fontSize: 'text-xs', iconSize: 12, radius: 'rounded' },
    sm: { padding: 'px-3 py-1.5', fontSize: 'text-sm', iconSize: 14, radius: 'rounded-md' },
    md: { padding: 'px-4 py-2', fontSize: 'text-base', iconSize: 16, radius: 'rounded-lg' },
    lg: { padding: 'px-5 py-2.5', fontSize: 'text-lg', iconSize: 18, radius: 'rounded-xl' },
    xl: { padding: 'px-6 py-3', fontSize: 'text-xl', iconSize: 20, radius: 'rounded-2xl' },
};
```

### resolveVariant Helper

The `resolveVariant` function in `packages/components/src/utils/types.ts` builds a className from a `VariantDefinition`:

```ts
resolveVariant(definition, { outline: false })
// → concatenates: base + hover + active + focus + disabled

resolveVariant(definition, { outline: true })
// → concatenates: outline + hover + active + focus + disabled
```

### Token-Driven Styling

Components reference CSS custom properties via `var()`:

```
bg-[var(--color-primary)]
```

This means themes and scoped overrides automatically propagate without component changes.

## Component Folder Structure

Every component follows this structure:

```
packages/components/src/primitives/<Name>/
├── index.tsx              # Component implementation
├── <Name>.variants.ts     # Variant + size definitions
├── <Name>.test.tsx        # Vitest tests
└── <Name>.stories.tsx     # Storybook stories
```

Composite components live in `packages/components/src/composite/<Name>/` with the same file layout.

## Barrel Exports

Components are re-exported through barrel files:

1. Each category has an `index.ts`:
   - `packages/components/src/primitives/index.ts` — exports all primitives
   - `packages/components/src/composite/index.ts` — exports all composites

2. The package root `packages/components/src/index.ts` re-exports primitives + utilities

3. Composite components have their own tsup entry point (`src/composite/index.ts` → `dist/composite/`)

## Utility Functions

### cn (className merge)

Located at `packages/components/src/utils/cn.ts`:

```ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
```

Combines `clsx` (conditional classes) with `twMerge` (Tailwind class deduplication).

## Base Types

Located at `packages/components/src/utils/types.ts`:

- `BaseVariant` — `'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost'`
- `BaseSize` — `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `BaseComponentProps` — `{ 'data-testid'?: string }`
- `InteractiveProps` — `{ disabled?: boolean; isLoading?: boolean; 'aria-label'?: string }`
- `WidthProps` — `{ fullWidth?: boolean }`
