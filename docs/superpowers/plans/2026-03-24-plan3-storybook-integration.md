# Plan 3: Storybook Theme Switcher & Story Reorganization

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `@storybook/addon-themes` with a custom dynamic theme switcher toolbar that discovers themes at runtime, reorganize Foundation stories into a Themes section, and simplify the Storybook preview configuration.

**Architecture:** The addon's `manager.ts` registers a toolbar button that fetches the theme list from `list-themes` and renders a dropdown. Theme selection emits `THEME_CHANGED` events to the preview iframe. Foundation stories are replaced with ThemeShowcase and ThemeComparison stories.

**Tech Stack:** Storybook 10 manager API, custom toolbar addon, React

**Spec:** `docs/superpowers/specs/2026-03-24-theme-system-redesign.md` (Sections 5 & 6)

**Depends on:** Plan 2 (list-themes endpoint and THEME_CHANGED event must exist)

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `packages/storybook-addon/src/toolbar/ThemeSwitcher.tsx` | Toolbar dropdown component for theme selection |
| `packages/components/src/stories/Themes/ThemeShowcase.stories.tsx` | Grid of all components in current theme |
| `packages/components/src/stories/Themes/ThemeComparison.stories.tsx` | Side-by-side component rendering across themes |

### Modified Files

| File | Changes |
|------|---------|
| `packages/storybook-addon/src/manager.ts` | Register toolbar button alongside Theme Editor panel |
| `.storybook/preview.ts` | Remove `@storybook/addon-themes` decorator, simplify |
| `.storybook/main.ts` | Remove `@storybook/addon-themes` from addons |
| `package.json` (root) | Remove `@storybook/addon-themes` dependency |

### Deleted Files

| File | Reason |
|------|--------|
| `packages/components/src/stories/Foundation/Colors.stories.tsx` | Replaced by Themes section |
| `packages/components/src/stories/Foundation/Typography.stories.tsx` | Token visualization moves to Theme Editor |
| `packages/components/src/stories/Foundation/Spacing.stories.tsx` | Token visualization moves to Theme Editor |
| `packages/components/src/stories/Foundation/Shadows.stories.tsx` | Token visualization moves to Theme Editor |
| `packages/components/src/stories/Foundation/Radii.stories.tsx` | Token visualization moves to Theme Editor |
| `packages/components/src/stories/Foundation/Themes.stories.tsx` | Replaced by ThemeComparison |

---

## Chunk 1: Custom Theme Switcher Toolbar

### Task 1: Create ThemeSwitcher toolbar component

**Files:**
- Create: `packages/storybook-addon/src/toolbar/ThemeSwitcher.tsx`

- [ ] **Step 1: Implement ThemeSwitcher**

A Storybook toolbar addon that:
1. Fetches `list-themes` on mount
2. Renders a dropdown button in the toolbar
3. Emits `THEME_CHANGED` via channel when selection changes
4. Persists selection in `localStorage` under `style-addon-active-theme`
5. Shows current theme name in the toolbar button

Uses Storybook's `useChannel()` hook and `IconButton`/`WithTooltip`/`TooltipLinkList` for the dropdown menu. This follows Storybook's standard toolbar addon pattern.

```tsx
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useChannel } from 'storybook/manager-api';
import { IconButton, WithTooltip, TooltipLinkList } from 'storybook/internal/components';
import { EVENTS } from '../constants.ts';

interface ThemeInfo {
    name: string;
    slug: string;
}

const STORAGE_KEY = 'style-addon-active-theme';

function getStoredTheme(): string {
    try { return localStorage.getItem(STORAGE_KEY) || 'light'; } catch { return 'light'; }
}

export function ThemeSwitcher() {
    const [themes, setThemes] = useState<ThemeInfo[]>([]);
    const [active, setActive] = useState(getStoredTheme);
    const emit = useChannel({});

    useEffect(() => {
        fetch('/api/style-addon/list-themes')
            .then(r => r.json())
            .then(({ themes }: { themes: ThemeInfo[] }) => {
                setThemes([{ name: 'Light', slug: 'light' }, ...themes]);
            })
            .catch(() => {});
    }, []);

    const handleSelect = useCallback((slug: string) => {
        setActive(slug);
        localStorage.setItem(STORAGE_KEY, slug);
        emit(EVENTS.THEME_CHANGED, { theme: slug });
    }, [emit]);

    // Emit stored theme on mount so preview syncs
    useEffect(() => {
        emit(EVENTS.THEME_CHANGED, { theme: active });
    }, []);

    const links = themes.map(t => ({
        id: t.slug,
        title: t.name.charAt(0).toUpperCase() + t.name.slice(1),
        active: active === t.slug,
        onClick: () => handleSelect(t.slug),
    }));

    const activeLabel = themes.find(t => t.slug === active)?.name || 'Light';

    return (
        <WithTooltip
            placement="top"
            trigger="click"
            tooltip={<TooltipLinkList links={links} />}
        >
            <IconButton
                title="Switch theme"
                aria-label="Switch theme"
            >
                <span style={{ fontSize: 12 }}>
                    Theme: {activeLabel}
                </span>
            </IconButton>
        </WithTooltip>
    );
}
```

Note: The exact Storybook toolbar API may differ. Read the Storybook 10 docs or look at how `@storybook/addon-themes` registers its toolbar button. The `addons.add()` call with `type: types.TOOL` is the standard pattern.

- [ ] **Step 2: Commit**

```bash
git add packages/storybook-addon/src/toolbar/ThemeSwitcher.tsx
git commit -m "feat: create ThemeSwitcher toolbar dropdown"
```

---

### Task 2: Register toolbar in manager.ts

**Files:**
- Modify: `packages/storybook-addon/src/manager.ts`

- [ ] **Step 1: Read current manager.ts**

- [ ] **Step 2: Add toolbar registration**

Add a `types.TOOL` registration for the ThemeSwitcher:

```ts
import { ThemeSwitcher } from './toolbar/ThemeSwitcher.tsx';

// Inside addons.register():
addons.add(`${ADDON_ID}/theme-switcher`, {
    type: types.TOOL,
    title: 'Theme',
    render: () => React.createElement(ThemeSwitcher),
});
```

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/manager.ts
git commit -m "feat: register ThemeSwitcher toolbar in Storybook manager"
```

---

### Task 3: Remove @storybook/addon-themes and simplify preview

**Files:**
- Modify: `.storybook/main.ts`
- Modify: `.storybook/preview.ts`
- Modify: `package.json` (root)

- [ ] **Step 1: Remove from main.ts addons**

Read `.storybook/main.ts`. Remove `'@storybook/addon-themes'` from the `addons` array.

- [ ] **Step 2: Simplify preview.ts**

Read `.storybook/preview.ts`. Remove `withThemeByDataAttribute` import and decorator. The custom addon now handles theme switching.

New preview.ts:
```ts
import type { Preview } from '@storybook/react-vite';
import React from 'react';
import '../packages/tokens/src/base.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story) =>
            React.createElement(
                'div',
                { className: 'storybook-root', style: { padding: '1rem' } },
                React.createElement(Story),
            ),
    ],
};

export default preview;
```

- [ ] **Step 3: Uninstall addon-themes**

Run: `pnpm remove -Dw @storybook/addon-themes`

- [ ] **Step 4: Manual test**

Run: `pnpm dev`
Verify:
- Toolbar shows "Theme: Light" button
- Clicking opens dropdown with available themes
- Selecting a theme updates the preview
- Selection persists across page refresh

- [ ] **Step 5: Commit**

```bash
git add .storybook/main.ts .storybook/preview.ts package.json pnpm-lock.yaml
git commit -m "refactor: replace @storybook/addon-themes with custom theme switcher"
```

---

## Chunk 2: Story Reorganization

### Task 4: Create ThemeShowcase story

**Files:**
- Create: `packages/components/src/stories/Themes/ThemeShowcase.stories.tsx`

- [ ] **Step 1: Implement ThemeShowcase**

A story that renders a grid of all major components to showcase the current theme. The story itself doesn't set `data-theme` — the toolbar switcher handles that.

Include: Button (all variants), Card, Badge (all variants), Input, Select, Textarea, Checkbox, Switch, Avatar, Tabs, and a sample form layout.

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Button } from '../../primitives/Button';
import { Card } from '../../primitives/Card';
import { Badge } from '../../primitives/Badge';
import { Input } from '../../primitives/Input';
// ... other imports

const meta: Meta = {
    title: 'Themes/Showcase',
};
export default meta;

export const AllComponents: StoryObj = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section>
                <h2>Buttons</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="warning">Warning</Button>
                    <Button variant="error">Error</Button>
                    <Button variant="info">Info</Button>
                    <Button variant="ghost">Ghost</Button>
                </div>
                {/* Outline variants */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <Button variant="primary" outline>Primary Outline</Button>
                    {/* ... */}
                </div>
            </section>
            {/* More sections for Card, Badge, Form Controls, etc. */}
        </div>
    ),
};
```

- [ ] **Step 2: Commit**

```bash
git add packages/components/src/stories/Themes/ThemeShowcase.stories.tsx
git commit -m "feat: add ThemeShowcase story for theme preview"
```

---

### Task 5: Create ThemeComparison story

**Files:**
- Create: `packages/components/src/stories/Themes/ThemeComparison.stories.tsx`

- [ ] **Step 1: Implement ThemeComparison**

Renders the same component set side-by-side in different themes using `data-theme` attribute on wrapper divs. This lets you see light vs dark (or any themes) simultaneously.

```tsx
export const LightVsDark: StoryObj = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="storybook-root" style={{ padding: '1rem' }}>
                <h3>Light</h3>
                <ComponentSet />
            </div>
            <div className="storybook-root" data-theme="dark" style={{ padding: '1rem' }}>
                <h3>Dark</h3>
                <ComponentSet />
            </div>
        </div>
    ),
};
```

- [ ] **Step 2: Commit**

```bash
git add packages/components/src/stories/Themes/ThemeComparison.stories.tsx
git commit -m "feat: add ThemeComparison story for side-by-side theme preview"
```

---

### Task 6: Delete Foundation stories

**Files:**
- Delete: `packages/components/src/stories/Foundation/` (entire directory)

- [ ] **Step 1: Delete the directory**

```bash
rm -rf packages/components/src/stories/Foundation/
```

- [ ] **Step 2: Verify Storybook still builds**

Run: `pnpm dev`
Verify: No broken story references, Themes section appears in sidebar.

- [ ] **Step 3: Commit**

```bash
git add -u packages/components/src/stories/Foundation/
git commit -m "chore: remove Foundation stories (replaced by Themes section)"
```

---

## Chunk 3: Final Verification

### Task 7: Full test suite and quality

- [ ] **Step 1: Run all tests**

Run: `pnpm test`
Expected: All tests pass across all packages.

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: No errors.

- [ ] **Step 3: Run quality**

Run: `pnpm quality`
Expected: All checks pass.

- [ ] **Step 4: Manual integration test**

Run: `pnpm dev` and verify:
- Theme switcher toolbar shows all available themes
- Switching themes updates component rendering
- Theme Editor panel allows editing base and custom themes
- Creating a new theme adds it to both the switcher and editor
- Inherited vs overridden tokens display correctly
- Component tabs show the right variables
- ThemeShowcase story renders all components
- ThemeComparison shows side-by-side themes
- No CSS leaks or visual artifacts

- [ ] **Step 5: Update documentation**

Update `docs/architecture/storybook-addon.md` to reflect:
- Theme Editor replaces Token Editor
- Custom theme switcher replaces @storybook/addon-themes
- Theme stories replace Foundation stories

- [ ] **Step 6: Commit**

```bash
git add docs/ packages/
git commit -m "docs: update architecture docs for theme system redesign"
```
