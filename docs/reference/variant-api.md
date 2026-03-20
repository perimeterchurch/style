# Variant API Reference

Source file: `packages/components/src/utils/types.ts`

## VariantDefinition

Defines the CSS classes for a single visual variant. Every component's `.variants.ts` file exports a `Record<string, VariantDefinition>`.

```ts
export interface VariantDefinition {
    /** Base classes always applied */
    base: string;
    /** Hover state classes (use hover: prefix) */
    hover?: string;
    /** Active/pressed state classes (use active: prefix) */
    active?: string;
    /** Focus-visible state classes (use focus-visible: prefix) */
    focus?: string;
    /** Disabled state classes — MUST use disabled: prefix */
    disabled?: string;
    /** Outline mode classes (border-based instead of filled) */
    outline?: string;
    /** Metadata for addon-created variants */
    _meta?: {
        clonedFrom?: string;
        createdAt?: string;
    };
}
```

### Field Details

| Field      | Required | Prefix Convention | Description                                                                                                                           |
| ---------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `base`     | Yes      | None              | Always-applied classes. Background, text color, etc.                                                                                  |
| `hover`    | No       | `hover:`          | Classes applied on mouse hover                                                                                                        |
| `active`   | No       | `active:`         | Classes applied on press/click                                                                                                        |
| `focus`    | No       | `focus-visible:`  | Classes applied on keyboard focus                                                                                                     |
| `disabled` | No       | `disabled:`       | Classes applied when disabled. Example: `disabled:opacity-50`                                                                         |
| `outline`  | No       | None              | Alternative appearance using borders instead of fills. When `resolveVariant` is called with `{ outline: true }`, this replaces `base` |
| `_meta`    | No       | —                 | Metadata for programmatically cloned variants                                                                                         |

### Example

```ts
const myVariants: Record<string, VariantDefinition> = {
    primary: {
        base: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
        hover: 'hover:bg-[var(--color-primary-hover)]',
        active: 'active:bg-[var(--color-primary-active)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2',
        disabled: 'disabled:pointer-events-none disabled:opacity-50',
        outline:
            'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]',
    },
};
```

## SizeDefinition

Defines the CSS classes for a single size variant.

```ts
export interface SizeDefinition {
    /** Padding classes (e.g., 'px-4 py-2') */
    padding: string;
    /** Font size class (e.g., 'text-base') */
    fontSize: string;
    /** Icon size in pixels */
    iconSize?: number;
    /** Border radius class (e.g., 'rounded-lg') */
    radius?: string;
}
```

### Example

```ts
const mySizes: Record<string, SizeDefinition> = {
    xs: { padding: 'px-2 py-1', fontSize: 'text-xs', iconSize: 12, radius: 'rounded' },
    sm: { padding: 'px-3 py-1.5', fontSize: 'text-sm', iconSize: 14, radius: 'rounded-md' },
    md: { padding: 'px-4 py-2', fontSize: 'text-base', iconSize: 16, radius: 'rounded-lg' },
    lg: { padding: 'px-5 py-2.5', fontSize: 'text-lg', iconSize: 18, radius: 'rounded-xl' },
    xl: { padding: 'px-6 py-3', fontSize: 'text-xl', iconSize: 20, radius: 'rounded-2xl' },
};
```

## resolveVariant

Helper function that builds a className string from a `VariantDefinition`.

```ts
export function resolveVariant(
    definition: VariantDefinition,
    options?: { outline?: boolean },
): string;
```

### Behavior

**Default mode** (`outline` is `false` or omitted):

Concatenates: `base` + `hover` + `active` + `focus` + `disabled`

```ts
resolveVariant(buttonVariants.primary);
// → "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] focus-visible:outline-none ..."
```

**Outline mode** (`outline` is `true` and `definition.outline` exists):

Concatenates: `outline` + `hover` + `active` + `focus` + `disabled`

```ts
resolveVariant(buttonVariants.primary, { outline: true });
// → "border-2 border-[var(--color-primary)] text-[var(--color-primary)] ... hover:bg-[var(--color-primary-hover)] ..."
```

If `outline` is `true` but `definition.outline` is undefined, falls back to default mode.

### Usage in Components

```tsx
const MyComponent = forwardRef<HTMLDivElement, Props>(
    ({ variant = 'primary', outline = false, className, ...props }, ref) => {
        const variantDef = myVariants[variant];

        return (
            <div
                ref={ref}
                className={cn(
                    'base-layout-classes',
                    resolveVariant(variantDef, { outline }),
                    className,
                )}
                {...props}
            />
        );
    },
);
```

## Base Types

### BaseVariant

```ts
export type BaseVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'ghost';
```

The 7 standard semantic variants. Components may use a subset or extend this.

### BaseSize

```ts
export type BaseSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

The 5 standard sizes. Components may use a subset.

### BaseComponentProps

```ts
export interface BaseComponentProps {
    'data-testid'?: string;
}
```

Extended by all component prop interfaces.

### InteractiveProps

```ts
export interface InteractiveProps extends BaseComponentProps {
    disabled?: boolean;
    isLoading?: boolean;
    'aria-label'?: string;
}
```

Extended by interactive components (Button, Input, Select, etc.).

### WidthProps

```ts
export interface WidthProps {
    fullWidth?: boolean;
}
```

Extended by components that support full-width mode (Button, Input, etc.).

## cn Utility

Located at `packages/components/src/utils/cn.ts`:

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
```

Combines `clsx` (conditional class joining) with `twMerge` (Tailwind class deduplication). Always use `cn()` instead of manual string concatenation.
