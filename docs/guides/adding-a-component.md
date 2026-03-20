# Adding a Component

Step-by-step instructions for creating a new component. This example creates a primitive component called `Alert`.

## Step 1: Create Component Folder

```bash
mkdir -p packages/components/src/primitives/Alert
```

## Step 2: Create Variants File

Create `packages/components/src/primitives/Alert/Alert.variants.ts`:

```ts
import type { VariantDefinition, SizeDefinition } from '../../utils/types';

export const alertVariants: Record<string, VariantDefinition> = {
    primary: {
        base: 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]',
    },
    success: {
        base: 'bg-[var(--color-success)]/10 border-[var(--color-success)] text-[var(--color-success)]',
    },
    warning: {
        base: 'bg-[var(--color-warning)]/10 border-[var(--color-warning)] text-[var(--color-warning)]',
    },
    error: {
        base: 'bg-[var(--color-error)]/10 border-[var(--color-error)] text-[var(--color-error)]',
    },
    info: {
        base: 'bg-[var(--color-info)]/10 border-[var(--color-info)] text-[var(--color-info)]',
    },
};

export const alertSizes: Record<string, SizeDefinition> = {
    sm: { padding: 'px-3 py-2', fontSize: 'text-sm' },
    md: { padding: 'px-4 py-3', fontSize: 'text-base' },
    lg: { padding: 'px-5 py-4', fontSize: 'text-lg' },
};

export type AlertVariant = keyof typeof alertVariants;
export type AlertSize = keyof typeof alertSizes;
```

Rules for variant files:

- Import types from `../../utils/types`
- Use `var()` references for all semantic colors: `bg-[var(--color-primary)]`
- Export the records, variant type, and size type
- Every variant needs at least `base`; add `hover`, `active`, `focus`, `disabled`, `outline` as needed

## Step 3: Create Component File

Create `packages/components/src/primitives/Alert/index.tsx`:

```tsx
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { resolveVariant } from '../../utils/types';
import { cn } from '../../utils/cn';
import { alertVariants, alertSizes, type AlertVariant, type AlertSize } from './Alert.variants';

type AlertElement = ElementRef<'div'>;

export interface AlertProps extends ComponentPropsWithoutRef<'div'>, BaseComponentProps {
    variant?: AlertVariant;
    size?: AlertSize;
}

export const Alert = forwardRef<AlertElement, AlertProps>(
    ({ variant = 'info', size = 'md', className, children, ...props }, ref) => {
        const variantDef = alertVariants[variant];
        const sizeDef = alertSizes[size];

        return (
            <div
                ref={ref}
                role="alert"
                className={cn(
                    'rounded-lg border',
                    resolveVariant(variantDef),
                    sizeDef.padding,
                    sizeDef.fontSize,
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        );
    },
);

Alert.displayName = 'Alert';

export { alertVariants, alertSizes, type AlertVariant, type AlertSize };
```

Rules for component files:

- Always use `forwardRef` with explicit element type
- Set `displayName`
- Default `variant` and `size` in destructuring
- Use `cn()` to merge all classes
- Use `resolveVariant()` for variant classes
- Spread `...props` last on the root element
- Re-export variants and types

## Step 4: Create Test File

Create `packages/components/src/primitives/Alert/Alert.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from './index';
import { alertVariants, alertSizes } from './Alert.variants';

describe('Alert', () => {
    it('renders with default props', () => {
        render(<Alert>Test message</Alert>);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent('Test message');
    });

    it('renders all variants without crashing', () => {
        for (const variant of Object.keys(alertVariants)) {
            const { unmount } = render(
                <Alert variant={variant as keyof typeof alertVariants}>{variant}</Alert>,
            );
            expect(screen.getByRole('alert')).toBeInTheDocument();
            unmount();
        }
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(alertSizes)) {
            const { unmount } = render(
                <Alert size={size as keyof typeof alertSizes}>{size}</Alert>,
            );
            expect(screen.getByRole('alert')).toBeInTheDocument();
            unmount();
        }
    });

    it('applies custom className', () => {
        render(<Alert className="custom-class">Test</Alert>);
        expect(screen.getByRole('alert').className).toContain('custom-class');
    });

    it('forwards data-testid', () => {
        render(<Alert data-testid="my-alert">Test</Alert>);
        expect(screen.getByTestId('my-alert')).toBeInTheDocument();
    });
});
```

Required test coverage for every component:

- Renders with default props
- Renders all variants without crashing
- Renders all sizes without crashing (if applicable)
- Applies custom className
- Forwards data-testid
- Interactive behavior (click, disable, loading) for interactive components

## Step 5: Create Stories File

Create `packages/components/src/primitives/Alert/Alert.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './index';
import { alertVariants, alertSizes } from './Alert.variants';

const meta: Meta<typeof Alert> = {
    title: 'Components/Primitives/Alert',
    component: Alert,
    argTypes: {
        variant: {
            control: 'select',
            options: Object.keys(alertVariants),
        },
        size: {
            control: 'select',
            options: Object.keys(alertSizes),
        },
    },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
    args: {
        children: 'This is an alert message.',
        variant: 'info',
        size: 'md',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.keys(alertVariants).map((variant) => (
                <Alert key={variant} variant={variant as keyof typeof alertVariants}>
                    {variant} alert
                </Alert>
            ))}
        </div>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.keys(alertSizes).map((size) => (
                <Alert key={size} size={size as keyof typeof alertSizes}>
                    {size} alert
                </Alert>
            ))}
        </div>
    ),
};

export const Playground: Story = {
    args: {
        children: 'Playground alert',
        variant: 'info',
        size: 'md',
    },
};
```

Story conventions:

- `title` follows `Components/Primitives/<Name>` or `Components/Composite/<Name>`
- Always include `Default`, `AllVariants`, `AllSizes`, and `Playground` stories
- Use `Object.keys()` on the variants/sizes records for DRY iteration
- `Playground` story should have all `args` set for interactive controls

## Step 6: Export from Barrel

Add the export to `packages/components/src/primitives/index.ts`:

```ts
export { Alert, type AlertProps, type AlertVariant, type AlertSize } from './Alert';
```

For composite components, add to `packages/components/src/composite/index.ts` instead.

## Step 7: Verify

```bash
# Run tests
cd packages/components && pnpm test

# Check types
pnpm typecheck

# Start Storybook and verify the component renders
pnpm dev
```
