# Storybook Addon UX Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Token Editor and Variant Creator Storybook addon panels with a visual property grid, "New Variant from default" creation, custom design system components, and contextual hints.

**Architecture:** The addon panels (running in Storybook's manager iframe) will use `@perimeterchurch/style` components instead of raw inline-styled HTML. A pre-built CSS bundle provides Tailwind utilities and design tokens in the manager context. A new Tailwind class parser enables the visual property grid to read/write variant definitions structurally.

**Tech Stack:** React 19, Vitest, @testing-library/react, Tailwind CSS v4, Storybook 10

**Spec:** `docs/superpowers/specs/2026-03-23-storybook-addon-ux-redesign.md`

---

## File Structure

All paths below are relative to `packages/storybook-addon/src/` unless noted otherwise.

### New Files

| File | Responsibility |
|------|---------------|
| `panels/utils/parseTailwindClasses.ts` | Parse Tailwind class strings into structured property map; rebuild class strings from structured data |
| `panels/utils/parseTailwindClasses.test.ts` | Unit tests for parser/writer |
| `panels/shared/AddonProvider.tsx` | Wraps addon panels with CSS injection, `.style-addon-root` scoping class, and `data-theme` sync |
| `panels/shared/AddonProvider.test.tsx` | Tests for CSS injection and theme sync |
| `panels/shared/HintText.tsx` | Dismissable hint text with localStorage persistence |
| `panels/shared/HelpToggle.tsx` | "?" toolbar button to re-enable dismissed hints |
| `panels/VariantCreator/VariantCard.tsx` | Card display for a single variant with swatch strip and action buttons |
| `panels/VariantCreator/NewVariantFlow.tsx` | Source variant picker dropdown + creation flow |
| `panels/VariantCreator/PropertyCell.tsx` | Single property cell — shows current token/value, click-to-edit, clear button |
| `panels/VariantCreator/PropertyGrid.tsx` | Grid of PropertyCells for one state section |
| `addon-components.css` | Pre-built CSS entry point for manager iframe (Tailwind scan source) |

### Modified Files

| File | Changes |
|------|---------|
| `packages/storybook-addon/package.json` | Add dep: `@perimeterchurch/style: workspace:*` |
| `manager.ts` | Import AddonProvider, wrap both panels |
| `panels/VariantCreator/VariantCreator.tsx` | Add `mode: 'new'` to EditState, "New Variant" toolbar, delegate to new components |
| `panels/VariantCreator/VariantList.tsx` | Rewrite with Card grid using VariantCard |
| `panels/VariantCreator/VariantEditor.tsx` | Rewrite with PropertyGrid, design system components |
| `panels/VariantCreator/PropertyPicker.tsx` | Refactor to inline cell picker (used by PropertyCell) |
| `panels/VariantCreator/CssEditor.tsx` | Swap to Textarea component, "Additional classes" label |
| `panels/VariantCreator/VariantCreator.test.tsx` | Update for new UI structure |
| `panels/TokenEditor/TokenEditor.tsx` | Custom components, per-token reset, dirty indicators |
| `panels/TokenEditor/CategoryTabs.tsx` | Replace with Tabs composite |
| `panels/TokenEditor/TokenSearch.tsx` | Replace with SearchInput |
| `panels/TokenEditor/TokenGroup.tsx` | Card-based collapsible groups |
| `panels/TokenEditor/editors/ColorEditor.tsx` | Swap raw inputs for Input component |
| `panels/TokenEditor/editors/SpacingEditor.tsx` | Swap raw inputs for Input component |
| `panels/TokenEditor/editors/ShadowEditor.tsx` | Swap raw inputs for Input component |
| `panels/TokenEditor/editors/TextEditor.tsx` | Swap raw inputs for Input component |
| `panels/TokenEditor/TokenEditor.test.tsx` | Update for new UI structure |

---

## Chunk 1: Foundation — Dependencies, CSS Bundle, AddonProvider

### Task 1: Add workspace dependencies

**Files:**
- Modify: `packages/storybook-addon/package.json`

- [ ] **Step 1: Add dependencies to package.json**

Add this to the `dependencies` object in `packages/storybook-addon/package.json`:

```json
"@perimeterchurch/style": "workspace:*"
```

Note: `@headlessui/react` is NOT needed. The `Tabs` component is a custom implementation that does not use headlessui. Only `ComboSelect`, `Dropdown`, `IconSelect`, and `MultiIconSelect` require headlessui, and none of those are used in this plan.

- [ ] **Step 2: Install dependencies**

Run: `cd /Users/parkerb/dev/perimeter/claude/style && pnpm install`
Expected: Lockfile updates, no errors.

- [ ] **Step 3: Verify imports resolve**

Create a temporary test — open a Node REPL or just verify TypeScript can find the types:

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm exec tsc --noEmit 2>&1 | head -20`
Expected: No new errors related to `@perimeterchurch/style` imports.

- [ ] **Step 4: Commit**

```bash
git add packages/storybook-addon/package.json pnpm-lock.yaml
git commit -m "chore: add design system and headlessui deps to storybook-addon"
```

---

### Task 2: Create the pre-built CSS entry point

**Files:**
- Create: `packages/storybook-addon/src/addon-components.css`

The manager iframe needs Tailwind utilities + design tokens. We create a CSS file that Tailwind CLI will scan against the addon panel source files. This gets imported in `manager.ts` and Storybook's manager bundler injects it into the head.

- [ ] **Step 1: Create the CSS entry point**

Create `packages/storybook-addon/src/addon-components.css`:

```css
/* Pre-built CSS bundle for Storybook manager iframe.
   Provides design tokens + Tailwind utilities scoped to .style-addon-root.
   Preflight is excluded to avoid breaking Storybook's own UI. */

@layer style-addon {
  @import '@perimeterchurch/style/css' layer(style-addon);
}

/* Scope: all utility classes and token vars only apply inside .style-addon-root */
.style-addon-root {
  /* Inherit design tokens */
  color: var(--color-foreground);
  font-family: var(--font-sans);
  line-height: 1.5;
}
```

Note: The exact approach for CSS scoping may need iteration during manual testing (Task 3). The critical thing is that we have a CSS file to import. If `@import` doesn't work cleanly in the manager bundler, we fall back to `?inline` raw string injection in AddonProvider.

- [ ] **Step 2: Commit**

```bash
git add packages/storybook-addon/src/addon-components.css
git commit -m "chore: add CSS entry point for manager iframe"
```

---

### Task 3: Create AddonProvider

**Files:**
- Create: `packages/storybook-addon/src/panels/shared/AddonProvider.tsx`
- Create: `packages/storybook-addon/src/panels/shared/AddonProvider.test.tsx`

- [ ] **Step 1: Write failing tests for AddonProvider**

Create `packages/storybook-addon/src/panels/shared/AddonProvider.test.tsx`:

```tsx
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AddonProvider } from './AddonProvider.tsx';

describe('AddonProvider', () => {
    it('renders children inside a .style-addon-root wrapper', () => {
        render(
            <AddonProvider>
                <span data-testid="child">Hello</span>
            </AddonProvider>,
        );
        const child = screen.getByTestId('child');
        expect(child).toBeInTheDocument();
        expect(child.closest('.style-addon-root')).not.toBeNull();
    });

    it('applies data-theme attribute to wrapper', () => {
        render(
            <AddonProvider theme="dark">
                <span>Content</span>
            </AddonProvider>,
        );
        const root = document.querySelector('.style-addon-root');
        expect(root).toHaveAttribute('data-theme', 'dark');
    });

    it('omits data-theme attribute when no theme prop provided', () => {
        render(
            <AddonProvider>
                <span>Content</span>
            </AddonProvider>,
        );
        const root = document.querySelector('.style-addon-root');
        expect(root).not.toHaveAttribute('data-theme');
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/shared/AddonProvider.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement AddonProvider**

Create `packages/storybook-addon/src/panels/shared/AddonProvider.tsx`:

```tsx
import * as React from 'react';
import type { ReactNode } from 'react';

export interface AddonProviderProps {
    children: ReactNode;
    /** Set to "dark" to enable dark mode on design system components. */
    theme?: 'dark' | undefined;
}

/**
 * Wraps addon panel content with:
 * - .style-addon-root scoping class for CSS isolation
 * - data-theme attribute for light/dark mode
 *
 * The CSS bundle (addon-components.css) is imported in manager.ts.
 */
export function AddonProvider({ children, theme }: AddonProviderProps) {
    return (
        <div
            className="style-addon-root"
            data-theme={theme}
            style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
            {children}
        </div>
    );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/shared/AddonProvider.test.tsx`
Expected: All 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/storybook-addon/src/panels/shared/AddonProvider.tsx packages/storybook-addon/src/panels/shared/AddonProvider.test.tsx
git commit -m "feat: add AddonProvider for CSS scoping and theme sync"
```

---

### Task 4: Wire AddonProvider into manager.ts

**Files:**
- Modify: `packages/storybook-addon/src/manager.ts`

- [ ] **Step 1: Update manager.ts to wrap panels with AddonProvider**

Read the current `manager.ts` first. Then modify it to:
1. Import the CSS bundle
2. Import AddonProvider
3. Wrap both panel renders with AddonProvider

The updated `manager.ts`:

```ts
import * as React from 'react';
import { addons, types } from 'storybook/manager-api';
import { ADDON_ID, TOKEN_EDITOR_PANEL_ID, VARIANT_CREATOR_PANEL_ID } from './constants.ts';
import { TokenEditor } from './panels/TokenEditor/index.ts';
import { VariantCreator } from './panels/VariantCreator/index.ts';
import { AddonProvider } from './panels/shared/AddonProvider.tsx';
import './addon-components.css';

addons.register(ADDON_ID, (api) => {
    const channel = api.getChannel();

    addons.add(TOKEN_EDITOR_PANEL_ID, {
        type: types.PANEL,
        title: 'Token Editor',
        render: ({ active }) => {
            if (!active) return null;
            return React.createElement(
                AddonProvider,
                null,
                React.createElement(TokenEditor, { channel }),
            );
        },
    });

    addons.add(VARIANT_CREATOR_PANEL_ID, {
        type: types.PANEL,
        title: 'Variant Creator',
        render: ({ active }) =>
            React.createElement(
                AddonProvider,
                null,
                React.createElement(VariantCreator, { active: active ?? false }),
            ),
    });
});
```

- [ ] **Step 2: Manual test — start Storybook**

Run: `cd /Users/parkerb/dev/perimeter/claude/style && pnpm dev`

Open browser at http://localhost:6006. Check:
- Token Editor panel still renders
- Variant Creator panel still renders
- No CSS conflicts in Storybook's sidebar/toolbar
- If CSS import causes issues, fall back to removing the `import './addon-components.css'` line and adding inline style injection to AddonProvider instead

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/manager.ts
git commit -m "feat: wire AddonProvider into manager panels"
```

---

## Chunk 2: Tailwind Class Parser (TDD)

### Task 5: Parser types and basic token extraction

**Files:**
- Create: `packages/storybook-addon/src/panels/utils/parseTailwindClasses.ts`
- Create: `packages/storybook-addon/src/panels/utils/parseTailwindClasses.test.ts`

- [ ] **Step 1: Write failing tests for basic token extraction**

Create `packages/storybook-addon/src/panels/utils/parseTailwindClasses.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { parseTailwindClasses, buildClassString } from './parseTailwindClasses.ts';
import type { ParsedProperties } from './parseTailwindClasses.ts';

describe('parseTailwindClasses', () => {
    it('parses bg token class', () => {
        const result = parseTailwindClasses('bg-[var(--color-primary)]');
        expect(result.properties.background).toEqual({
            token: '--color-primary',
            raw: 'bg-[var(--color-primary)]',
        });
    });

    it('parses text token class', () => {
        const result = parseTailwindClasses('text-[var(--color-foreground)]');
        expect(result.properties.text).toEqual({
            token: '--color-foreground',
            raw: 'text-[var(--color-foreground)]',
        });
    });

    it('parses border token class', () => {
        const result = parseTailwindClasses('border-[var(--color-primary)]');
        expect(result.properties.border).toEqual({
            token: '--color-primary',
            raw: 'border-[var(--color-primary)]',
        });
    });

    it('parses ring token class', () => {
        const result = parseTailwindClasses('ring-[var(--color-primary)]');
        expect(result.properties.ring).toEqual({
            token: '--color-primary',
            raw: 'ring-[var(--color-primary)]',
        });
    });

    it('returns null for unset properties', () => {
        const result = parseTailwindClasses('bg-[var(--color-primary)]');
        expect(result.properties.text).toBeNull();
        expect(result.properties.border).toBeNull();
        expect(result.properties.ring).toBeNull();
    });

    it('puts unrecognized classes into additionalClasses', () => {
        const result = parseTailwindClasses(
            'bg-[var(--color-primary)] rounded-lg shadow-md transition-colors',
        );
        expect(result.properties.background?.token).toBe('--color-primary');
        expect(result.additionalClasses).toBe('rounded-lg shadow-md transition-colors');
    });

    it('parses multiple properties from a combined string', () => {
        const result = parseTailwindClasses(
            'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
        );
        expect(result.properties.background?.token).toBe('--color-primary');
        expect(result.properties.text?.token).toBe('--color-primary-foreground');
    });

    it('handles empty string', () => {
        const result = parseTailwindClasses('');
        expect(result.properties.background).toBeNull();
        expect(result.properties.text).toBeNull();
        expect(result.properties.border).toBeNull();
        expect(result.properties.ring).toBeNull();
        expect(result.additionalClasses).toBe('');
    });

    it('parses token with opacity modifier', () => {
        const result = parseTailwindClasses('ring-[var(--color-primary)]/50');
        expect(result.properties.ring?.token).toBe('--color-primary');
    });

    it('puts dark: prefixed classes into additionalClasses', () => {
        const result = parseTailwindClasses(
            'bg-[var(--color-stone-100)] dark:bg-[var(--color-stone-800)]',
        );
        expect(result.properties.background?.token).toBe('--color-stone-100');
        expect(result.additionalClasses).toContain('dark:bg-[var(--color-stone-800)]');
    });

    it('parses literal values with dashes like text-stone-700', () => {
        const result = parseTailwindClasses('text-stone-700');
        expect(result.properties.text?.literal).toBe('stone-700');
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/utils/parseTailwindClasses.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement parser**

Create `packages/storybook-addon/src/panels/utils/parseTailwindClasses.ts`:

```ts
/** A parsed property — either a design token reference or a literal value. */
export interface ParsedProperty {
    /** The token name (e.g., "--color-primary") if this is a var() reference, null for literals. */
    token: string | null;
    /** The literal value (e.g., "white") if not a token reference, null for tokens. */
    literal: string | null;
    /** The original raw class(es) that produced this property. */
    raw: string;
}

/** The four property types the property grid can display. */
export interface ParsedProperties {
    background: ParsedProperty | null;
    text: ParsedProperty | null;
    border: ParsedProperty | null;
    ring: ParsedProperty | null;
}

export interface ParseResult {
    properties: ParsedProperties;
    /** Classes that don't map to a known property type. */
    additionalClasses: string;
}

/** Regex for token-based arbitrary value: bg-[var(--token-name)] with optional opacity modifier (/50) */
const TOKEN_RE = /^(\w+)-\[var\((--[\w-]+)\)\](?:\/(\d+))?$/;

/** Map of Tailwind utility prefix to property type. */
const PREFIX_TO_PROPERTY: Record<string, keyof ParsedProperties> = {
    bg: 'background',
    text: 'text',
    border: 'border',
    ring: 'ring',
};

/** Literal color/value patterns: text-white, bg-black, text-stone-700, etc. */
const LITERAL_RE = /^(bg|text|border|ring)-([\w-]+)$/;

/** Compound border/ring patterns: border-2, ring-2 (width modifiers that pair with the token class). */
const WIDTH_MODIFIER_RE = /^(border|ring)-(\d+)$/;

/**
 * Parse a Tailwind class string into structured property data.
 *
 * Extracts background, text, border, and ring properties from token-based
 * classes like `bg-[var(--color-primary)]`. Everything else goes into
 * additionalClasses.
 */
export function parseTailwindClasses(classString: string): ParseResult {
    const properties: ParsedProperties = {
        background: null,
        text: null,
        border: null,
        ring: null,
    };
    const additional: string[] = [];

    if (!classString.trim()) {
        return { properties, additionalClasses: '' };
    }

    const classes = classString.trim().split(/\s+/);
    const widthModifiers: Record<string, string> = {};

    for (const cls of classes) {
        // Check for token reference: bg-[var(--color-primary)]
        const tokenMatch = TOKEN_RE.exec(cls);
        if (tokenMatch) {
            const [, prefix, tokenName] = tokenMatch;
            const propType = PREFIX_TO_PROPERTY[prefix];
            if (propType) {
                properties[propType] = { token: tokenName, literal: null, raw: cls };
                continue;
            }
        }

        // Check for width modifier: border-2, ring-2
        const widthMatch = WIDTH_MODIFIER_RE.exec(cls);
        if (widthMatch) {
            const [, prefix] = widthMatch;
            widthModifiers[prefix] = cls;
            continue;
        }

        // Check for literal value: text-white, bg-black
        const literalMatch = LITERAL_RE.exec(cls);
        if (literalMatch) {
            const [, prefix, value] = literalMatch;
            const propType = PREFIX_TO_PROPERTY[prefix];
            if (propType && !properties[propType]) {
                properties[propType] = { token: null, literal: value, raw: cls };
                continue;
            }
        }

        additional.push(cls);
    }

    // Merge width modifiers into their corresponding property's raw field
    for (const [prefix, widthCls] of Object.entries(widthModifiers)) {
        const propType = PREFIX_TO_PROPERTY[prefix];
        if (propType && properties[propType]) {
            properties[propType]!.raw = `${widthCls} ${properties[propType]!.raw}`;
        } else {
            additional.push(widthCls);
        }
    }

    return { properties, additionalClasses: additional.join(' ') };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/utils/parseTailwindClasses.test.ts`
Expected: All 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/storybook-addon/src/panels/utils/parseTailwindClasses.ts packages/storybook-addon/src/panels/utils/parseTailwindClasses.test.ts
git commit -m "feat: add Tailwind class parser with token extraction"
```

---

### Task 6: Parser — state prefix handling and compound classes

**Files:**
- Modify: `packages/storybook-addon/src/panels/utils/parseTailwindClasses.ts`
- Modify: `packages/storybook-addon/src/panels/utils/parseTailwindClasses.test.ts`

- [ ] **Step 1: Write failing tests for state prefix stripping**

Append to the test file:

```ts
describe('parseTailwindClasses — state prefix handling', () => {
    it('strips hover: prefix before parsing', () => {
        const result = parseTailwindClasses('hover:bg-[var(--color-primary-hover)]', 'hover');
        expect(result.properties.background?.token).toBe('--color-primary-hover');
        expect(result.properties.background?.raw).toBe('hover:bg-[var(--color-primary-hover)]');
    });

    it('strips focus-visible: prefix (not focus:)', () => {
        const result = parseTailwindClasses(
            'focus-visible:ring-[var(--color-primary)]',
            'focus',
        );
        expect(result.properties.ring?.token).toBe('--color-primary');
    });

    it('strips active: prefix', () => {
        const result = parseTailwindClasses('active:bg-[var(--color-primary-active)]', 'active');
        expect(result.properties.background?.token).toBe('--color-primary-active');
    });

    it('strips disabled: prefix', () => {
        const result = parseTailwindClasses('disabled:bg-[var(--color-muted)]', 'disabled');
        expect(result.properties.background?.token).toBe('--color-muted');
    });

    it('does not strip prefix for base state', () => {
        const result = parseTailwindClasses('bg-[var(--color-primary)]', 'base');
        expect(result.properties.background?.token).toBe('--color-primary');
    });

    it('does not strip prefix for outline state (outline has no prefix)', () => {
        const result = parseTailwindClasses('bg-[var(--color-primary)]', 'outline');
        expect(result.properties.background?.token).toBe('--color-primary');
    });

    it('handles compound border with hover prefix', () => {
        const result = parseTailwindClasses(
            'hover:border-2 hover:border-[var(--color-primary)]',
            'hover',
        );
        expect(result.properties.border?.token).toBe('--color-primary');
        expect(result.properties.border?.raw).toContain('border-2');
        expect(result.properties.border?.raw).toContain('border-[var(--color-primary)]');
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/utils/parseTailwindClasses.test.ts`
Expected: FAIL — parseTailwindClasses does not accept a second argument.

- [ ] **Step 3: Add state prefix support to parser**

Update the `parseTailwindClasses` function signature and add prefix stripping:

```ts
/** Map of variant state to the Tailwind prefix that must be stripped. */
const STATE_PREFIXES: Record<string, string> = {
    base: '',
    hover: 'hover:',
    active: 'active:',
    focus: 'focus-visible:',
    disabled: 'disabled:',
    outline: '',
};

export function parseTailwindClasses(classString: string, stateKey?: string): ParseResult {
    // ... existing setup ...

    const prefix = stateKey ? (STATE_PREFIXES[stateKey] ?? '') : '';

    const classes = classString.trim().split(/\s+/);

    for (const cls of classes) {
        // Strip state prefix if present
        let stripped = cls;
        let hadPrefix = false;
        if (prefix && cls.startsWith(prefix)) {
            stripped = cls.slice(prefix.length);
            hadPrefix = true;
        }

        // Classes with dark: prefix or other sub-state prefixes within a state field
        // (e.g., hover: classes inside the outline state) go to additionalClasses.
        // This is a known limitation — the property grid only edits the primary
        // state properties, not nested sub-states.
        if (stripped.includes(':')) {
            additional.push(cls);
            continue;
        }

        // Check for token reference on the stripped class
        const tokenMatch = TOKEN_RE.exec(stripped);
        if (tokenMatch) {
            const [, utilPrefix, tokenName] = tokenMatch;
            const propType = PREFIX_TO_PROPERTY[utilPrefix];
            if (propType) {
                properties[propType] = { token: tokenName, literal: null, raw: cls };
                continue;
            }
        }

        // Check for width modifier on the stripped class
        const widthMatch = WIDTH_MODIFIER_RE.exec(stripped);
        if (widthMatch) {
            const [, widthPrefix] = widthMatch;
            widthModifiers[widthPrefix] = cls;
            continue;
        }

        // Check for literal on the stripped class
        const literalMatch = LITERAL_RE.exec(stripped);
        if (literalMatch) {
            const [, litPrefix, value] = literalMatch;
            const propType = PREFIX_TO_PROPERTY[litPrefix];
            if (propType && !properties[propType]) {
                properties[propType] = { token: null, literal: value, raw: cls };
                continue;
            }
        }

        additional.push(cls);
    }

    // ... rest of function unchanged (merge width modifiers) ...
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/utils/parseTailwindClasses.test.ts`
Expected: All 15 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/storybook-addon/src/panels/utils/parseTailwindClasses.ts packages/storybook-addon/src/panels/utils/parseTailwindClasses.test.ts
git commit -m "feat: add state prefix handling to Tailwind class parser"
```

---

### Task 7: Class string writer (buildClassString)

**Files:**
- Modify: `packages/storybook-addon/src/panels/utils/parseTailwindClasses.ts`
- Modify: `packages/storybook-addon/src/panels/utils/parseTailwindClasses.test.ts`

- [ ] **Step 1: Write failing tests for buildClassString**

Append to the test file:

```ts
describe('buildClassString', () => {
    it('builds a class string from properties', () => {
        const props: ParsedProperties = {
            background: { token: '--color-primary', literal: null, raw: 'bg-[var(--color-primary)]' },
            text: { token: '--color-foreground', literal: null, raw: 'text-[var(--color-foreground)]' },
            border: null,
            ring: null,
        };
        const result = buildClassString(props, '');
        expect(result).toBe('bg-[var(--color-primary)] text-[var(--color-foreground)]');
    });

    it('includes additional classes', () => {
        const props: ParsedProperties = {
            background: { token: '--color-primary', literal: null, raw: 'bg-[var(--color-primary)]' },
            text: null,
            border: null,
            ring: null,
        };
        const result = buildClassString(props, 'rounded-lg shadow-md');
        expect(result).toBe('bg-[var(--color-primary)] rounded-lg shadow-md');
    });

    it('returns only additional classes when no properties set', () => {
        const props: ParsedProperties = {
            background: null,
            text: null,
            border: null,
            ring: null,
        };
        const result = buildClassString(props, 'rounded-lg');
        expect(result).toBe('rounded-lg');
    });

    it('returns empty string when nothing set', () => {
        const props: ParsedProperties = {
            background: null,
            text: null,
            border: null,
            ring: null,
        };
        expect(buildClassString(props, '')).toBe('');
    });

    it('roundtrips through parse and build', () => {
        const original = 'bg-[var(--color-primary)] text-[var(--color-foreground)] rounded-lg shadow-md';
        const parsed = parseTailwindClasses(original);
        const rebuilt = buildClassString(parsed.properties, parsed.additionalClasses);
        expect(rebuilt).toBe(original);
    });

    it('adds state prefix when stateKey is provided', () => {
        const props: ParsedProperties = {
            background: { token: '--color-primary-hover', literal: null, raw: 'bg-[var(--color-primary-hover)]' },
            text: null,
            border: null,
            ring: null,
        };
        const result = buildClassString(props, '', 'hover');
        expect(result).toBe('hover:bg-[var(--color-primary-hover)]');
    });

    it('adds focus-visible: prefix for focus state', () => {
        const props: ParsedProperties = {
            background: null,
            text: null,
            border: null,
            ring: { token: '--color-primary', literal: null, raw: 'ring-[var(--color-primary)]' },
        };
        const result = buildClassString(props, '', 'focus');
        expect(result).toBe('focus-visible:ring-[var(--color-primary)]');
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/utils/parseTailwindClasses.test.ts`
Expected: FAIL — `buildClassString` not exported.

- [ ] **Step 3: Implement buildClassString**

Add to `parseTailwindClasses.ts`:

```ts
/** Property type to Tailwind utility prefix. */
const PROPERTY_TO_PREFIX: Record<keyof ParsedProperties, string> = {
    background: 'bg',
    text: 'text',
    border: 'border',
    ring: 'ring',
};

/**
 * Build a Tailwind class string from structured property data.
 * Inverse of parseTailwindClasses — used to write back after edits.
 */
export function buildClassString(
    properties: ParsedProperties,
    additionalClasses: string,
    stateKey?: string,
): string {
    const parts: string[] = [];
    const statePrefix = stateKey ? (STATE_PREFIXES[stateKey] ?? '') : '';

    for (const [propType, prop] of Object.entries(properties) as Array<
        [keyof ParsedProperties, ParsedProperty | null]
    >) {
        if (!prop) continue;

        if (prop.token) {
            const utilPrefix = PROPERTY_TO_PREFIX[propType];
            parts.push(`${statePrefix}${utilPrefix}-[var(${prop.token})]`);
        } else if (prop.literal) {
            const utilPrefix = PROPERTY_TO_PREFIX[propType];
            parts.push(`${statePrefix}${utilPrefix}-${prop.literal}`);
        }
    }

    if (additionalClasses.trim()) {
        parts.push(additionalClasses.trim());
    }

    return parts.join(' ');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/utils/parseTailwindClasses.test.ts`
Expected: All 22 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/storybook-addon/src/panels/utils/parseTailwindClasses.ts packages/storybook-addon/src/panels/utils/parseTailwindClasses.test.ts
git commit -m "feat: add buildClassString writer for Tailwind class roundtripping"
```

---

### Parser Known Limitations

These are documented trade-offs, not bugs:

1. **`dark:` prefixed classes** — Classes like `dark:bg-[var(--color-stone-800)]` within a state field are placed in `additionalClasses`. The property grid only shows/edits the primary state properties. Dark mode variants are preserved through the additional classes textarea but are not visually editable in the grid.

2. **Outline state mixed prefixes** — The `outline` field in variant definitions often contains `hover:` prefixed classes (e.g., `hover:bg-[var(--color-primary)]`). These are placed in `additionalClasses` because the parser treats any class containing `:` (after state prefix stripping) as an unrecognized pattern. This means the outline state grid shows only the non-hover properties.

3. **Opacity modifiers** — Classes like `ring-[var(--color-primary)]/50` are parsed for their token correctly, but the `buildClassString` writer does NOT preserve the `/50` opacity modifier. Roundtripping through parse→edit→build may lose opacity. When implementing, consider storing the opacity in `ParsedProperty` and restoring it in the writer.

These limitations affect the visual grid's completeness but do NOT cause data loss — unrecognized classes always land in the additional classes textarea where they can be manually edited.

---

## Chunk 3: Shared UI — HintText and HelpToggle

### Task 8: Create HintText component

**Files:**
- Create: `packages/storybook-addon/src/panels/shared/HintText.tsx`

- [ ] **Step 1: Implement HintText**

Create `packages/storybook-addon/src/panels/shared/HintText.tsx`:

```tsx
import * as React from 'react';
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'style-addon-hints-dismissed';

function getDismissedHints(): Set<string> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
    } catch {
        return new Set();
    }
}

function dismissHint(hintId: string): void {
    const dismissed = getDismissedHints();
    dismissed.add(hintId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed]));
}

/** Reset all dismissed hints — called by HelpToggle. */
export function resetDismissedHints(): void {
    localStorage.removeItem(STORAGE_KEY);
}

export interface HintTextProps {
    /** Unique ID for this hint (used for localStorage persistence). */
    hintId: string;
    /** The hint message to display. */
    children: React.ReactNode;
    /** External override — when true, show all hints regardless of dismissal. */
    forceShow?: boolean;
}

/** A dismissable hint text shown on first use. */
export function HintText({ hintId, children, forceShow }: HintTextProps) {
    const [visible, setVisible] = useState(() => {
        if (forceShow) return true;
        return !getDismissedHints().has(hintId);
    });

    // React to forceShow changes
    React.useEffect(() => {
        if (forceShow) setVisible(true);
    }, [forceShow]);

    const handleDismiss = useCallback(() => {
        dismissHint(hintId);
        setVisible(false);
    }, [hintId]);

    if (!visible) return null;

    return (
        <div
            className="flex items-center justify-between gap-2 rounded px-2 py-1 text-[11px] text-[var(--color-muted-foreground)] bg-[var(--color-muted)]/30"
        >
            <span>{children}</span>
            <button
                onClick={handleDismiss}
                aria-label={`Dismiss hint: ${hintId}`}
                className="shrink-0 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] text-sm leading-none"
            >
                x
            </button>
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/storybook-addon/src/panels/shared/HintText.tsx
git commit -m "feat: add HintText dismissable hint component"
```

---

### Task 9: Create HelpToggle component

**Files:**
- Create: `packages/storybook-addon/src/panels/shared/HelpToggle.tsx`

- [ ] **Step 1: Implement HelpToggle**

Create `packages/storybook-addon/src/panels/shared/HelpToggle.tsx`:

```tsx
import * as React from 'react';
import { resetDismissedHints } from './HintText.tsx';

export interface HelpToggleProps {
    /** Called after hints are reset — parent should re-render to show hints. */
    onReset: () => void;
}

/** "?" button that re-enables all dismissed hints + "Learn more" link. */
export function HelpToggle({ onReset }: HelpToggleProps) {
    function handleClick() {
        resetDismissedHints();
        onReset();
    }

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={handleClick}
                title="Show hints and help text"
                aria-label="Show hints"
                className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/50 transition-colors"
            >
                ?
            </button>
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/storybook-addon/src/panels/shared/HelpToggle.tsx
git commit -m "feat: add HelpToggle button to re-enable hints"
```

---

## Chunk 4: Variant Creator — List View Redesign

### Task 10: Create VariantCard component

**Files:**
- Create: `packages/storybook-addon/src/panels/VariantCreator/VariantCard.tsx`

Depends on: parseTailwindClasses (Task 5-7), AddonProvider (Task 3)

- [ ] **Step 1: Implement VariantCard**

Create `packages/storybook-addon/src/panels/VariantCreator/VariantCard.tsx`:

```tsx
import * as React from 'react';
import { Card } from '@perimeterchurch/style/components';
import { Badge } from '@perimeterchurch/style/components';
import { Button } from '@perimeterchurch/style/components';
import type { VariantDefinition } from '../../server/readVariants.ts';
import { parseTailwindClasses } from '../utils/parseTailwindClasses.ts';

export interface VariantCardProps {
    name: string;
    definition: VariantDefinition;
    tokens: Array<{ name: string; value: string }>;
    onEdit: () => void;
    onClone: () => void;
    onDelete?: () => void;
    readOnly?: boolean;
}

/** Resolve a token name to its CSS value from the token list. */
function resolveTokenValue(
    tokenName: string | null,
    tokens: Array<{ name: string; value: string }>,
): string | null {
    if (!tokenName) return null;
    const token = tokens.find((t) => t.name === tokenName);
    return token?.value ?? null;
}

/** Small colored circle representing a token value. */
function Swatch({ color, label }: { color: string; label: string }) {
    return (
        <span
            title={label}
            className="inline-block w-4 h-4 rounded-full border border-[var(--color-border)]"
            style={{ backgroundColor: color }}
        />
    );
}

export function VariantCard({
    name,
    definition,
    tokens,
    onEdit,
    onClone,
    onDelete,
    readOnly,
}: VariantCardProps) {
    const parsed = parseTailwindClasses(definition.base ?? '');
    const isCustom = !!definition._meta;

    // Build swatches from parsed base properties
    const swatches: Array<{ color: string; label: string }> = [];
    if (parsed.properties.background?.token) {
        const color = resolveTokenValue(parsed.properties.background.token, tokens);
        if (color) swatches.push({ color, label: `bg: ${parsed.properties.background.token}` });
    }
    if (parsed.properties.text?.token) {
        const color = resolveTokenValue(parsed.properties.text.token, tokens);
        if (color) swatches.push({ color, label: `text: ${parsed.properties.text.token}` });
    }
    if (parsed.properties.border?.token) {
        const color = resolveTokenValue(parsed.properties.border.token, tokens);
        if (color) swatches.push({ color, label: `border: ${parsed.properties.border.token}` });
    }

    return (
        <Card className="mb-2">
            <Card.Body className="p-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium text-sm truncate">{name}</span>
                        {isCustom && (
                            <Badge variant="secondary" size="sm">
                                Custom
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {swatches.map((s) => (
                            <Swatch key={s.label} color={s.color} label={s.label} />
                        ))}
                    </div>
                </div>
                {!readOnly && (
                    <div className="flex gap-1 mt-2">
                        <Button variant="secondary" size="xs" onClick={onEdit}>
                            Edit
                        </Button>
                        <Button variant="secondary" size="xs" onClick={onClone}>
                            Clone
                        </Button>
                        {onDelete && (
                            <Button variant="error" size="xs" onClick={onDelete}>
                                Delete
                            </Button>
                        )}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}
```

Note: The exact import paths for components may need adjustment. Read the actual component export structure before implementing. The components may be exported from a barrel: `import { Card, Badge, Button } from '@perimeterchurch/style/components'`.

- [ ] **Step 2: Commit**

```bash
git add packages/storybook-addon/src/panels/VariantCreator/VariantCard.tsx
git commit -m "feat: add VariantCard component with swatch strip"
```

---

### Task 11: Create NewVariantFlow component

**Files:**
- Create: `packages/storybook-addon/src/panels/VariantCreator/NewVariantFlow.tsx`

- [ ] **Step 1: Implement NewVariantFlow**

Create `packages/storybook-addon/src/panels/VariantCreator/NewVariantFlow.tsx`:

```tsx
import * as React from 'react';
import { useState } from 'react';
import { Button } from '@perimeterchurch/style/components';
import { Select } from '@perimeterchurch/style/components';
import { Input } from '@perimeterchurch/style/components';
import type { VariantDefinition, SizeDefinition } from '../../server/readVariants.ts';

export interface NewVariantFlowProps {
    type: 'variant' | 'size';
    existingNames: string[];
    existingDefinitions: Record<string, VariantDefinition | SizeDefinition>;
    onConfirm: (
        name: string,
        sourceVariant: string | null,
        definition: VariantDefinition | SizeDefinition,
    ) => void;
    onCancel: () => void;
}

export function NewVariantFlow({
    type,
    existingNames,
    existingDefinitions,
    onConfirm,
    onCancel,
}: NewVariantFlowProps) {
    const [name, setName] = useState('');
    const [source, setSource] = useState(existingNames[0] ?? '');

    const sourceOptions = [
        { value: '__blank__', label: 'Blank (empty)' },
        ...existingNames.map((n) => ({ value: n, label: n })),
    ];

    function handleCreate() {
        if (!name.trim()) return;

        let definition: VariantDefinition | SizeDefinition;
        if (source === '__blank__') {
            definition =
                type === 'variant'
                    ? { base: '', _meta: { clonedFrom: undefined, createdAt: new Date().toISOString() } }
                    : { padding: '', fontSize: '' };
        } else {
            const sourceDef = existingDefinitions[source];
            definition = {
                ...sourceDef,
                _meta: { clonedFrom: source, createdAt: new Date().toISOString() },
            };
        }

        onConfirm(name.trim(), source === '__blank__' ? null : source, definition);
    }

    return (
        <div className="p-3 flex flex-col gap-3 border-b border-[var(--color-border)]">
            <div className="text-sm font-semibold">
                New {type === 'variant' ? 'Variant' : 'Size'}
            </div>
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`New ${type} name...`}
                aria-label={`New ${type} name`}
                size="sm"
            />
            <Select
                options={sourceOptions}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                aria-label="Base variant"
                size="sm"
            />
            <div className="flex gap-2">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCreate}
                    disabled={!name.trim()}
                >
                    Create
                </Button>
                <Button variant="secondary" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/storybook-addon/src/panels/VariantCreator/NewVariantFlow.tsx
git commit -m "feat: add NewVariantFlow with source picker and blank option"
```

---

### Task 12: Rewrite VariantList with card grid

**Files:**
- Modify: `packages/storybook-addon/src/panels/VariantCreator/VariantList.tsx`

- [ ] **Step 1: Read the current VariantList.tsx**

Read `packages/storybook-addon/src/panels/VariantCreator/VariantList.tsx` to understand the current API.

- [ ] **Step 2: Rewrite VariantList with VariantCard**

Replace the contents of `VariantList.tsx` to use VariantCard and design system components. Keep the same external props interface so VariantCreator.tsx doesn't need changes yet.

The new VariantList should:
- Import VariantCard instead of using inline EntryRow
- Use `Card` for section containers
- Use `Badge` for variant counts in section headers
- Pass token data through for swatch rendering
- Add `tokens` to the props interface

- [ ] **Step 3: Run existing tests**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/VariantCreator/VariantCreator.test.tsx`

Update any tests that break due to the UI restructuring. The tests should still verify:
- Variants and sizes are listed
- Edit/Clone/Delete buttons are present
- Delete only shows for variants with `_meta`
- Read-only mode hides action buttons

- [ ] **Step 4: Commit**

```bash
git add packages/storybook-addon/src/panels/VariantCreator/VariantList.tsx packages/storybook-addon/src/panels/VariantCreator/VariantCreator.test.tsx
git commit -m "feat: rewrite VariantList with Card grid and swatch strip"
```

---

### Task 13: Add "New Variant" flow to VariantCreator

**Files:**
- Modify: `packages/storybook-addon/src/panels/VariantCreator/VariantCreator.tsx`

- [ ] **Step 1: Read current VariantCreator.tsx**

- [ ] **Step 2: Add `mode: 'new'` to EditState and integrate NewVariantFlow**

Update VariantCreator.tsx to:
1. Add `| { mode: 'new'; type: 'variant' | 'size' }` to the EditState union
2. Add "New Variant" and "New Size" buttons to the toolbar (above the list)
3. When `mode === 'new'`, render `NewVariantFlow`
4. On confirm from NewVariantFlow, transition to edit mode with the scaffolded definition
5. Import and use `Button` from the design system for toolbar buttons
6. Import `HintText` and add the variant list hint
7. Import `HelpToggle` and add it to the toolbar
8. Import `EmptyState` from `@perimeterchurch/style/components` — when a component has no custom variants, show EmptyState with "No custom variants yet" and a prominent "New Variant" CTA button

- [ ] **Step 3: Manual test in Storybook**

Run: `cd /Users/parkerb/dev/perimeter/claude/style && pnpm dev`

Navigate to any component story (e.g., Components/Primitives/Button). Open the Variant Creator panel. Verify:
- "New Variant" and "New Size" buttons appear in the toolbar
- Clicking "New Variant" shows the source picker
- Selecting "Blank" and creating opens the editor with empty fields
- Selecting an existing variant and creating opens the editor pre-filled
- Cancel returns to the list

- [ ] **Step 4: Commit**

```bash
git add packages/storybook-addon/src/panels/VariantCreator/VariantCreator.tsx
git commit -m "feat: add New Variant creation flow with source picker"
```

---

## Chunk 5: Variant Editor — Property Grid

### Task 14: Create PropertyCell component

**Files:**
- Create: `packages/storybook-addon/src/panels/VariantCreator/PropertyCell.tsx`

- [ ] **Step 1: Implement PropertyCell**

Create `packages/storybook-addon/src/panels/VariantCreator/PropertyCell.tsx`:

```tsx
import * as React from 'react';
import { useState } from 'react';
import { Select } from '@perimeterchurch/style/components';
import type { SelectOption } from '@perimeterchurch/style/components';

export interface PropertyCellProps {
    /** Property type label (Background, Text, Border, Ring). */
    label: string;
    /** Current token name (e.g., "--color-primary") or null if unset. */
    currentToken: string | null;
    /** Current literal value (e.g., "white") if not a token, or null. */
    currentLiteral: string | null;
    /** Resolved CSS color value for swatch display, or null. */
    resolvedColor: string | null;
    /** Available tokens for the picker dropdown. */
    tokenOptions: SelectOption[];
    /** Called when user selects a token. */
    onSelect: (tokenName: string) => void;
    /** Called when user clears the property. */
    onClear: () => void;
}

export function PropertyCell({
    label,
    currentToken,
    currentLiteral,
    resolvedColor,
    tokenOptions,
    onSelect,
    onClear,
}: PropertyCellProps) {
    const [editing, setEditing] = useState(false);
    const displayValue = currentToken ?? currentLiteral ?? null;
    const hasValue = displayValue !== null;

    function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        if (!value) return;
        onSelect(value);
        setEditing(false);
    }

    return (
        <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[var(--color-muted-foreground)]">
                {label}
            </span>

            {editing ? (
                <Select
                    options={[{ value: '', label: 'Select token...' }, ...tokenOptions]}
                    value=""
                    onChange={handleSelect}
                    onBlur={() => setEditing(false)}
                    size="sm"
                    aria-label={`${label} token`}
                />
            ) : (
                <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-muted)]/30 text-left text-xs min-h-[32px] transition-colors"
                >
                    {hasValue ? (
                        <>
                            {resolvedColor && (
                                <span
                                    className="inline-block w-3 h-3 rounded-full border border-[var(--color-border)] shrink-0"
                                    style={{ backgroundColor: resolvedColor }}
                                />
                            )}
                            <span className="truncate font-mono text-[11px]">{displayValue}</span>
                        </>
                    ) : (
                        <span className="text-[var(--color-muted-foreground)]">
                            Click to assign
                        </span>
                    )}
                </button>
            )}

            {hasValue && !editing && (
                <button
                    onClick={onClear}
                    aria-label={`Clear ${label}`}
                    className="self-start text-[10px] text-[var(--color-muted-foreground)] hover:text-[var(--color-destructive)] transition-colors"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/storybook-addon/src/panels/VariantCreator/PropertyCell.tsx
git commit -m "feat: add PropertyCell with swatch display and inline token picker"
```

---

### Task 15: Create PropertyGrid component

**Files:**
- Create: `packages/storybook-addon/src/panels/VariantCreator/PropertyGrid.tsx`

- [ ] **Step 1: Implement PropertyGrid**

Create `packages/storybook-addon/src/panels/VariantCreator/PropertyGrid.tsx`:

```tsx
import * as React from 'react';
import { useCallback } from 'react';
import { Card } from '@perimeterchurch/style/components';
import { Textarea } from '@perimeterchurch/style/components';
import { PropertyCell } from './PropertyCell.tsx';
import { HintText } from '../shared/HintText.tsx';
import {
    parseTailwindClasses,
    buildClassString,
} from '../utils/parseTailwindClasses.ts';
import type { ParsedProperties, ParsedProperty } from '../utils/parseTailwindClasses.ts';
import type { SelectOption } from '@perimeterchurch/style/components';

const STATE_HINTS: Record<string, string> = {
    base: 'Default appearance — always applied',
    hover: 'Applied when the user hovers over the component',
    active: 'Applied when the component is being clicked/pressed',
    focus: 'Applied when the component receives keyboard focus',
    disabled: 'Applied when the component is disabled',
    outline: 'Alternative outline style — uses border instead of filled background',
};

const PROPERTY_TYPES = ['background', 'text', 'border', 'ring'] as const;

const PROPERTY_LABELS: Record<string, string> = {
    background: 'Background',
    text: 'Text',
    border: 'Border',
    ring: 'Ring',
};

export interface PropertyGridProps {
    stateKey: string;
    /** The full class string for this state. */
    classString: string;
    /** All available tokens as SelectOption[]. */
    tokenOptions: SelectOption[];
    /** Token name -> resolved CSS value map for swatches. */
    tokenValues: Record<string, string>;
    /** Called with the updated class string for this state. */
    onChange: (classString: string) => void;
    /** Whether to force-show hints. */
    showHints?: boolean;
}

export function PropertyGrid({
    stateKey,
    classString,
    tokenOptions,
    tokenValues,
    onChange,
    showHints,
}: PropertyGridProps) {
    const parsed = parseTailwindClasses(classString, stateKey);
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    const updateProperty = useCallback(
        (propType: keyof ParsedProperties, tokenName: string) => {
            const newProps = { ...parsed.properties };
            newProps[propType] = { token: tokenName, literal: null, raw: '' };
            onChange(buildClassString(newProps, parsed.additionalClasses, stateKey));
        },
        [parsed, stateKey, onChange],
    );

    const clearProperty = useCallback(
        (propType: keyof ParsedProperties) => {
            const newProps = { ...parsed.properties };
            newProps[propType] = null;
            onChange(buildClassString(newProps, parsed.additionalClasses, stateKey));
        },
        [parsed, stateKey, onChange],
    );

    const updateAdditional = useCallback(
        (additional: string) => {
            onChange(buildClassString(parsed.properties, additional, stateKey));
        },
        [parsed.properties, stateKey, onChange],
    );

    function resolveColor(prop: ParsedProperty | null): string | null {
        if (!prop) return null;
        if (prop.token) return tokenValues[prop.token] ?? null;
        return null;
    }

    return (
        <Card className="mb-3">
            <Card.Body className="p-3">
                <div className="text-sm font-semibold capitalize mb-1">{stateKey}</div>
                <HintText hintId={`state-${stateKey}`} forceShow={showHints}>
                    {STATE_HINTS[stateKey]}
                </HintText>

                <div className="grid grid-cols-2 gap-2 mt-2">
                    {PROPERTY_TYPES.map((propType) => (
                        <PropertyCell
                            key={propType}
                            label={PROPERTY_LABELS[propType]}
                            currentToken={parsed.properties[propType]?.token ?? null}
                            currentLiteral={parsed.properties[propType]?.literal ?? null}
                            resolvedColor={resolveColor(parsed.properties[propType])}
                            tokenOptions={tokenOptions}
                            onSelect={(tokenName) => updateProperty(propType, tokenName)}
                            onClear={() => clearProperty(propType)}
                        />
                    ))}
                </div>

                {/* Advanced: additional classes */}
                <button
                    onClick={() => setShowAdvanced((p) => !p)}
                    className="mt-2 text-[11px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                    {showAdvanced ? 'Hide' : 'Show'} additional classes
                </button>
                {showAdvanced && (
                    <div className="mt-1">
                        <HintText hintId="additional-classes" forceShow={showHints}>
                            Add Tailwind classes the property grid doesn't cover, like rounded-lg or
                            shadow-md
                        </HintText>
                        <Textarea
                            value={parsed.additionalClasses}
                            onChange={(e) => updateAdditional(e.target.value)}
                            placeholder="e.g. rounded-lg shadow-md transition-colors"
                            rows={2}
                            aria-label={`${stateKey} additional classes`}
                            className="mt-1 font-mono text-xs"
                        />
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/storybook-addon/src/panels/VariantCreator/PropertyGrid.tsx
git commit -m "feat: add PropertyGrid with visual property cells and advanced mode"
```

---

### Task 16: Rewrite VariantEditor with PropertyGrid

**Files:**
- Modify: `packages/storybook-addon/src/panels/VariantCreator/VariantEditor.tsx`

- [ ] **Step 1: Read the current VariantEditor.tsx**

Read `packages/storybook-addon/src/panels/VariantCreator/VariantEditor.tsx` to understand the full current API.

- [ ] **Step 2: Rewrite VariantEditor**

Replace the current implementation. The new VariantEditor should:
1. Use `Input` for the variant name field
2. Show `Badge` with "Based on: {source}" when `_meta.clonedFrom` exists
3. Use `PropertyGrid` for each variant state instead of the old PropertyPicker + CssEditor pattern
4. Use `Button` for Save/Cancel
5. For size editing, use `Input` components for each field (padding, fontSize, iconSize, radius)
6. Keep the same external props interface (`VariantEditorProps`)
7. Add `HintText` contextual hints

Key changes from current implementation:
- Remove direct imports of `PropertyPicker` and `CssEditor` — replaced by `PropertyGrid`
- Build `tokenOptions` as `SelectOption[]` from the `tokens` prop
- Build `tokenValues` as `Record<string, string>` from the `tokens` prop
- The `draft` state now holds the full class strings per state key (same as before)
- `PropertyGrid.onChange` replaces `appendToField` — it now does full replacement

- [ ] **Step 3: Run existing tests and update**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/VariantCreator/VariantCreator.test.tsx`

Update tests for the new UI structure. The PropertyPicker-specific tests may need significant changes since PropertyPicker is no longer the primary editing surface.

- [ ] **Step 4: Manual test in Storybook**

Run: `cd /Users/parkerb/dev/perimeter/claude/style && pnpm dev`

Navigate to a component story, open Variant Creator, click Edit on a variant. Verify:
- Property grid shows current token values extracted from the variant definition
- Clicking a property cell opens the token picker
- Selecting a token updates the cell and the underlying class string
- Clearing a property removes it
- Additional classes section shows non-property classes
- Save persists the changes
- Cancel returns to list without saving

- [ ] **Step 5: Commit**

```bash
git add packages/storybook-addon/src/panels/VariantCreator/VariantEditor.tsx packages/storybook-addon/src/panels/VariantCreator/VariantCreator.test.tsx
git commit -m "feat: rewrite VariantEditor with visual PropertyGrid"
```

---

## Chunk 6: Token Editor Improvements

### Task 17: Replace CategoryTabs with Tabs composite

**Files:**
- Modify: `packages/storybook-addon/src/panels/TokenEditor/CategoryTabs.tsx`

- [ ] **Step 1: Read the current CategoryTabs.tsx and Tabs API**

Read both files to understand the mapping.

- [ ] **Step 2: Rewrite CategoryTabs to use Tabs composite**

Replace the inline-styled tab buttons with the `Tabs` component. **Important:** Tabs is a composite component — import from `@perimeterchurch/style/composite`, NOT from `@perimeterchurch/style/components` (which is where all other components in this plan come from). The simple API takes a `tabs` array and `activeTab`/`onChange` — which is exactly what `CategoryTabs` already receives.

Map `TokenCategory[]` to `Tab[]`:
- `id` = category name
- `label` = category name
- `badge` = `<Badge size="sm">{count}</Badge>`

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/panels/TokenEditor/CategoryTabs.tsx
git commit -m "refactor: replace custom CategoryTabs with Tabs composite"
```

---

### Task 18: Replace TokenSearch with SearchInput

**Files:**
- Modify: `packages/storybook-addon/src/panels/TokenEditor/TokenSearch.tsx`

- [ ] **Step 1: Rewrite TokenSearch to use SearchInput**

Replace the inline-styled input with `SearchInput` from `@perimeterchurch/style/components`. The API is compatible: `value`, `onChange`, `placeholder`. Set `debounce={0}` for instant filtering (the default is 300ms which adds lag for local filtering).

- [ ] **Step 2: Update tests**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/TokenEditor/TokenEditor.test.tsx`

Update any failing tests — the SearchInput component has slightly different internal structure (renders its own clear button with a different aria-label pattern).

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/panels/TokenEditor/TokenSearch.tsx packages/storybook-addon/src/panels/TokenEditor/TokenEditor.test.tsx
git commit -m "refactor: replace custom TokenSearch with SearchInput component"
```

---

### Task 19: Replace TokenGroup with Card-based groups

**Files:**
- Modify: `packages/storybook-addon/src/panels/TokenEditor/TokenGroup.tsx`

- [ ] **Step 1: Rewrite TokenGroup with Card**

Replace the inline-styled collapsible group with a `Card` component. The group header becomes a clickable card header with:
- Group name as text
- `Badge` showing token count
- Disclosure arrow for collapse/expand

- [ ] **Step 2: Commit**

```bash
git add packages/storybook-addon/src/panels/TokenEditor/TokenGroup.tsx
git commit -m "refactor: replace custom TokenGroup with Card-based collapsible"
```

---

### Task 20: Update token editors with Input component

**Files:**
- Modify: `packages/storybook-addon/src/panels/TokenEditor/editors/ColorEditor.tsx`
- Modify: `packages/storybook-addon/src/panels/TokenEditor/editors/SpacingEditor.tsx`
- Modify: `packages/storybook-addon/src/panels/TokenEditor/editors/ShadowEditor.tsx`
- Modify: `packages/storybook-addon/src/panels/TokenEditor/editors/TextEditor.tsx`

- [ ] **Step 1: Read all four editor files**

- [ ] **Step 2: Update editors to use Input component**

For each editor:
- Replace raw `<input type="text">` with `Input` component (size="sm")
- Keep specialized inputs that don't have design system equivalents (color picker `<input type="color">`, range slider `<input type="range">`)
- Keep the visual preview elements (swatch, shadow box, spacing preview)

- [ ] **Step 3: Run tests**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/TokenEditor/TokenEditor.test.tsx`

Update any failing tests.

- [ ] **Step 4: Commit**

```bash
git add packages/storybook-addon/src/panels/TokenEditor/editors/
git commit -m "refactor: use Input component in token editors"
```

---

### Task 21: Add per-token reset and dirty indicators to TokenEditor

**Files:**
- Modify: `packages/storybook-addon/src/panels/TokenEditor/TokenEditor.tsx`
- Modify: `packages/storybook-addon/src/panels/TokenEditor/TokenGroup.tsx`

- [ ] **Step 1: Read current TokenEditor.tsx**

- [ ] **Step 2: Add per-token reset**

In `TokenEditor.tsx`:
1. Create a `handleTokenReset` callback that removes a single token from the `dirty` state and emits `TOKEN_CHANGED` with the original value
2. Pass `dirty` state and `onTokenReset` down to `TokenGroup`

In `TokenGroup.tsx`:
1. Accept `dirtyTokens: Set<string>` and `onTokenReset: (name: string) => void` props
2. For each token that is in `dirtyTokens`, show a `Badge` with "modified" and a small reset button

- [ ] **Step 3: Add search category context**

In `TokenEditor.tsx`, when in search mode, include the category name as a `Badge` next to each search result. Build a `tokenToCategory` lookup map from the categorized data.

- [ ] **Step 4: Add toolbar improvements**

Replace toolbar `<button>` elements with `Button` components. Add `HelpToggle` to the toolbar. Add `HintText` for the panel header hint.

- [ ] **Step 5: Run tests and update**

Run: `cd /Users/parkerb/dev/perimeter/claude/style/packages/storybook-addon && pnpm vitest run src/panels/TokenEditor/TokenEditor.test.tsx`

- [ ] **Step 6: Commit**

```bash
git add packages/storybook-addon/src/panels/TokenEditor/TokenEditor.tsx packages/storybook-addon/src/panels/TokenEditor/TokenGroup.tsx packages/storybook-addon/src/panels/TokenEditor/TokenEditor.test.tsx
git commit -m "feat: add per-token reset, dirty indicators, and design system buttons"
```

---

## Chunk 7: Integration and Final Testing

### Task 22: Run full test suite

- [ ] **Step 1: Run all tests**

Run: `cd /Users/parkerb/dev/perimeter/claude/style && pnpm test`
Expected: All tests pass.

- [ ] **Step 2: Fix any failures**

Address any test failures from the component swaps. Common issues:
- Changed aria-labels
- Different DOM structure for custom components vs raw HTML
- Missing CSS class-based selectors in tests

- [ ] **Step 3: Run quality checks**

Run: `cd /Users/parkerb/dev/perimeter/claude/style && pnpm quality`
Expected: typecheck + lint + format + test all pass.

- [ ] **Step 4: Fix any issues and commit**

```bash
git add packages/storybook-addon/
git commit -m "fix: resolve test and quality check failures"
```

---

### Task 23: Manual integration test in Storybook

- [ ] **Step 1: Start Storybook**

Run: `cd /Users/parkerb/dev/perimeter/claude/style && pnpm dev`

- [ ] **Step 2: Test Token Editor panel**

Open any story. Switch to Token Editor panel. Verify:
- Tabs render using design system Tabs component
- Search uses SearchInput with proper styling
- Token groups use Card-based collapsible sections
- Editing a token shows "modified" badge
- Per-token reset button works
- Bulk Save/Reset use design system Button components
- Save as Theme dialog uses Input + Button
- Light/dark theme switching works (if Storybook has theme toggle)
- Hints appear on first use, dismiss properly, "?" re-enables them

- [ ] **Step 3: Test Variant Creator panel**

Navigate to a component story (e.g., Button). Switch to Variant Creator panel. Verify:
- Variant cards show with swatch strip
- Custom variants show "Custom" badge
- "New Variant" button opens source picker
- "Blank" option creates empty variant
- Selecting existing variant pre-fills the editor
- Property grid shows current token values
- Clicking a property cell opens token picker
- Selecting a token updates the cell
- Clearing a property works
- Additional classes section works
- Save persists to .variants.ts file
- Clone still works
- Delete still works (with confirmation)
- Hints appear appropriately

- [ ] **Step 4: Test CSS isolation**

Verify Storybook's own UI is not broken:
- Sidebar renders correctly
- Search bar works
- Toolbar renders correctly
- Story canvas renders correctly
- No visual artifacts or style leaks

- [ ] **Step 5: Commit any fixes**

```bash
git add packages/storybook-addon/
git commit -m "fix: integration test fixes"
```

---

### Task 24: Update documentation

**Files:**
- Modify: `docs/architecture/storybook-addon.md`

- [ ] **Step 1: Update addon architecture docs**

Update the Storybook addon architecture doc to reflect:
- New component dependencies
- CSS injection approach
- New variant creation flow (New Variant from default)
- Property grid editing model
- Hint system

- [ ] **Step 2: Commit**

```bash
git add docs/architecture/storybook-addon.md
git commit -m "docs: update storybook addon architecture for UX redesign"
```
