# Testing

## Setup

Tests run via Vitest. Each internal package that has tests defines:

```json
// package.json
"scripts": {
    "test": "vitest run"
}
```

The test environment is configured in each package's `vitest.config.ts` or inferred from the root. Tests use:

- **vitest** — test runner
- **@testing-library/react** — rendering and querying
- **@testing-library/jest-dom** — DOM matchers (`toBeInTheDocument`, `toBeDisabled`, etc.)
- **@testing-library/user-event** — simulating user interactions
- **jsdom** — browser environment

## Running Tests

```bash
# All tests via Turborepo (from project root)
pnpm test

# Single package
cd packages/components && pnpm test

# Watch mode (for development)
cd packages/components && pnpm vitest

# Single test file
cd packages/components && pnpm vitest Alert.test
```

## What to Test Per Component

### Required Tests

Every component must have these tests:

1. **Renders with default props** — verify the component renders and is in the document
2. **Renders all variants** — loop through `Object.keys(variants)`, render each, verify no crash
3. **Renders all sizes** — loop through `Object.keys(sizes)`, render each, verify no crash (if component has sizes)
4. **Custom className** — verify `className` prop is applied
5. **data-testid** — verify `data-testid` is forwarded

### Additional Tests for Interactive Components

6. **Click handler fires** — `userEvent.click` triggers `onClick`
7. **Disabled state** — button is disabled, click handler does NOT fire
8. **Loading state** — `isLoading` disables the component and shows spinner, `aria-busy="true"`
9. **Keyboard navigation** — for tabs, dropdowns, etc.

### Additional Tests for Compound API

10. **Compound parts render** — `Button.Root` + `Button.Icon` + `Button.Label` render together
11. **aria-hidden on decorative parts** — `Button.Icon` wrapper has `aria-hidden="true"`

## Test Template

```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './index';
import { myVariants, mySizes } from './MyComponent.variants';

describe('MyComponent', () => {
    it('renders with default props', () => {
        render(<MyComponent>Content</MyComponent>);
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders all variants without crashing', () => {
        for (const variant of Object.keys(myVariants)) {
            const { unmount } = render(
                <MyComponent variant={variant as keyof typeof myVariants}>
                    {variant}
                </MyComponent>,
            );
            expect(screen.getByText(variant)).toBeInTheDocument();
            unmount();
        }
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(mySizes)) {
            const { unmount } = render(
                <MyComponent size={size as keyof typeof mySizes}>
                    {size}
                </MyComponent>,
            );
            expect(screen.getByText(size)).toBeInTheDocument();
            unmount();
        }
    });

    it('applies custom className', () => {
        render(<MyComponent className="custom">Test</MyComponent>);
        expect(screen.getByText('Test').className).toContain('custom');
    });

    it('forwards data-testid', () => {
        render(<MyComponent data-testid="test-id">Test</MyComponent>);
        expect(screen.getByTestId('test-id')).toBeInTheDocument();
    });
});
```

## Test File Location

Tests live alongside their component:

```
packages/components/src/primitives/<Name>/<Name>.test.tsx
packages/components/src/composite/<Name>/<Name>.test.tsx
packages/icons/src/Icon.test.tsx
```

## Querying Elements

Preferred query order (most accessible first):

1. `screen.getByRole('button', { name: 'Click me' })` — ARIA role + accessible name
2. `screen.getByText('Content')` — visible text
3. `screen.getByTestId('my-id')` — test ID (last resort)

## Simulating User Events

Always use `@testing-library/user-event` over `fireEvent`:

```tsx
const user = userEvent.setup();

// Click
await user.click(screen.getByRole('button'));

// Type
await user.type(screen.getByRole('textbox'), 'hello');

// Tab
await user.tab();

// Keyboard
await user.keyboard('{ArrowRight}');
```
