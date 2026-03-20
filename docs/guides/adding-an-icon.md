# Adding an Icon

## Adding a Lucide Icon to the Registry

The registry at `packages/icons/src/registry.ts` pre-registers 32 common icons. To add more:

### Step 1: Add the Import

Open `packages/icons/src/registry.ts`. Add the icon to the import statement from `lucide-react`:

```ts
import {
    // ... existing imports ...
    Bell, // Add new icon import
} from 'lucide-react';
```

### Step 2: Add the Registry Entry

Add the entry to the `lucideIcons` record using a kebab-case key:

```ts
const lucideIcons: Record<string, LucideIcon> = {
    // ... existing entries ...
    bell: Bell,
};
```

### Step 3: Verify

```bash
cd packages/icons && pnpm test && pnpm typecheck
```

The icon is now usable:

```tsx
<Icon name="bell" size={16} />
```

## Naming Convention

Use kebab-case for all icon names:

- `ChevronDown` from lucide becomes `chevron-down`
- `AlertCircle` becomes `alert-circle`
- `ExternalLink` becomes `external-link`

## Adding a Custom SVG Icon

Custom icons are registered at runtime by the consuming application. They are not part of the published package.

### Step 1: Create the SVG Component

The component must accept standard SVG props and forward refs:

```tsx
import { forwardRef, type SVGProps } from 'react';

const PerimeterLogo = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => (
    <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {/* SVG path data */}
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
    </svg>
));

PerimeterLogo.displayName = 'PerimeterLogo';
```

### Step 2: Register at App Startup

```tsx
import { registerIcon } from '@perimeterchurch/style/icons';

// Call once, before any <Icon name="perimeter-logo"> renders
registerIcon('perimeter-logo', PerimeterLogo);
```

### Step 3: Use the Icon

```tsx
import { Icon } from '@perimeterchurch/style/icons';

<Icon name="perimeter-logo" size={24} className="text-primary" />;
```

## Available Icon Names

To get all registered icon names at runtime:

```ts
import { getIconNames } from '@perimeterchurch/style/icons';

const names = getIconNames(); // ['loader', 'chevron-down', 'search', ...]
```

## Pre-Registered Lucide Icons (32)

`loader`, `chevron-down`, `chevron-left`, `chevron-right`, `chevron-up`, `search`, `x`, `check`, `plus`, `minus`, `alert-circle`, `info`, `calendar`, `filter`, `arrow-left`, `arrow-right`, `eye`, `eye-off`, `copy`, `external-link`, `more-horizontal`, `more-vertical`, `settings`, `user`, `mail`, `phone`, `map-pin`, `clock`, `star`, `heart`, `trash`, `edit`, `download`, `upload`
