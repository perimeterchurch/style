# Icon System Architecture

## Overview

The icon system wraps `lucide-react` icons in a registry pattern with support for custom SVG icons. It is published as `@perimeterchurch/style/icons`.

## Files

```
packages/icons/src/
├── registry.ts    # Icon registry (lucide + custom)
├── Icon.tsx       # <Icon> component
├── index.ts       # Barrel exports
├── Icon.test.tsx  # Tests
└── Icon.stories.tsx
```

## Icon Registry

`packages/icons/src/registry.ts` maintains two maps:

### Lucide Icons (Pre-Registered)

A `Record<string, LucideIcon>` of 32 commonly-used icons with kebab-case names:

`loader`, `chevron-down`, `chevron-left`, `chevron-right`, `chevron-up`, `search`, `x`, `check`, `plus`, `minus`, `alert-circle`, `info`, `calendar`, `filter`, `arrow-left`, `arrow-right`, `eye`, `eye-off`, `copy`, `external-link`, `more-horizontal`, `more-vertical`, `settings`, `user`, `mail`, `phone`, `map-pin`, `clock`, `star`, `heart`, `trash`, `edit`, `download`, `upload`

### Custom Icons

A `Record<string, CustomIcon>` that starts empty. Custom icons are registered at runtime via `registerIcon()`.

Type for custom icons:
```ts
type CustomIcon = ComponentType<SVGProps<SVGSVGElement> & { ref?: React.Ref<SVGSVGElement> }>;
```

## Icon Component

`packages/icons/src/Icon.tsx` provides the `<Icon>` component:

```tsx
<Icon name="search" size={16} className="text-muted-foreground" />
```

Props:
- `name: IconName` — Registry key (lucide name or custom name)
- `size?: number` — Width and height in pixels (default: 16)
- All standard SVG props

Behavior:
- Looks up the icon in the registry via `getIcon(name)`
- If not found, logs a warning in development and returns `null`
- Forwards ref to the underlying SVG element

## Exported Functions

| Function | Signature | Purpose |
| --- | --- | --- |
| `getIcon` | `(name: string) => LucideIcon \| CustomIcon \| undefined` | Look up an icon by name |
| `registerIcon` | `(name: string, icon: CustomIcon) => void` | Register a custom SVG icon |
| `getIconNames` | `() => string[]` | Get all registered icon names (lucide + custom) |

## IconName Type

```ts
export type IconName = keyof typeof lucideIcons | (string & {});
```

This provides autocomplete for built-in names while allowing arbitrary strings for custom icons.

## Adding a Lucide Icon

1. Open `packages/icons/src/registry.ts`
2. Add the import from `lucide-react`:
   ```ts
   import { /* existing */, NewIcon } from 'lucide-react';
   ```
3. Add the entry to `lucideIcons`:
   ```ts
   'new-icon': NewIcon,
   ```
4. Run `pnpm build` and `pnpm test` in the icons package

## Adding a Custom SVG Icon

At runtime in the consuming application:

```tsx
import { registerIcon } from '@perimeterchurch/style/icons';
import { forwardRef } from 'react';

const PerimeterLogo = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
    (props, ref) => (
        <svg ref={ref} viewBox="0 0 24 24" {...props}>
            {/* SVG paths */}
        </svg>
    ),
);

registerIcon('perimeter-logo', PerimeterLogo);

// Now usable:
<Icon name="perimeter-logo" size={24} />
```
