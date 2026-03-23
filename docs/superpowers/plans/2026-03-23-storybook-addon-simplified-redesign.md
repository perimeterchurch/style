# Storybook Addon Simplified Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the Storybook addon to a polished Token Editor using Storybook's built-in components, integrate official addons for theme switching and token docs, and remove the Variant Creator panel.

**Architecture:** One custom panel (Token Editor) built entirely with `storybook/internal/components`. Official addons handle theme switching (`@storybook/addon-themes`) and token documentation (`storybook-design-token`). Server middleware stays intact. No CSS injection, no external component imports.

**Tech Stack:** React 19, Vitest, @testing-library/react, Storybook 10 (internal components), @storybook/addon-themes, storybook-design-token

**Spec:** `docs/superpowers/specs/2026-03-23-storybook-addon-simplified-redesign.md`

---

## File Structure

All addon paths relative to `packages/storybook-addon/src/` unless noted.

### Files to Delete

| File | Reason |
|------|--------|
| `panels/VariantCreator/` (entire directory) | Panel removed |
| `panels/utils/parseTailwindClasses.ts` | Only used by property grid |
| `panels/utils/parseTailwindClasses.test.ts` | Tests for deleted code |
| `panels/shared/AddonProvider.tsx` | CSS injection wrapper removed |
| `panels/shared/AddonProvider.test.tsx` | Tests for deleted code |
| `addon-components.css` | CSS bundle for manager removed |

### Files to Modify

| File | Changes |
|------|---------|
| `manager.ts` | Remove Variant Creator registration, AddonProvider, CSS import |
| `package.json` | Remove `@perimeterchurch/style` dep |
| `tsconfig.json` | Remove `paths` aliases |
| `vitest.config.ts` | Remove resolve aliases |
| `constants.ts` | Add comment that variant panel UI is removed |
| `panels/shared/HintText.tsx` | Replace CSS var colors with theme-compatible values |
| `panels/shared/HelpToggle.tsx` | Use Storybook's `IconButton` |
| `panels/TokenEditor/TokenEditor.tsx` | Rewrite with Storybook components, per-token reset, hints |
| `panels/TokenEditor/CategoryTabs.tsx` | Rewrite with Storybook `TabsState` |
| `panels/TokenEditor/TokenSearch.tsx` | Rewrite with Storybook `Form.Input` |
| `panels/TokenEditor/TokenGroup.tsx` | Rewrite with Storybook components, dirty indicators |
| `panels/TokenEditor/editors/ColorEditor.tsx` | Swap text input for `Form.Input` |
| `panels/TokenEditor/editors/SpacingEditor.tsx` | Swap text input for `Form.Input` |
| `panels/TokenEditor/editors/ShadowEditor.tsx` | Swap text input for `Form.Input` |
| `panels/TokenEditor/editors/TextEditor.tsx` | Swap text input for `Form.Input` |
| `panels/TokenEditor/TokenEditor.test.tsx` | Update for new UI |

### Files to Modify Outside Addon

| File | Changes |
|------|---------|
| Root `package.json` | Add `@storybook/addon-themes`, `storybook-design-token` as devDeps |
| `.storybook/main.ts` | Register new addons |
| `.storybook/preview.ts` | Replace manual theme decorator with `withThemeByDataAttribute` |
| `packages/tokens/src/tokens.css` | Add `@tokens`/`@presenter` annotations |

---

## Chunk 1: Cleanup — Remove Variant Creator and Complexity

### Task 1: Delete Variant Creator files and related code

**Files:**
- Delete: `packages/storybook-addon/src/panels/VariantCreator/` (entire directory)
- Delete: `packages/storybook-addon/src/panels/utils/` (entire directory)
- Delete: `packages/storybook-addon/src/panels/shared/AddonProvider.tsx`
- Delete: `packages/storybook-addon/src/panels/shared/AddonProvider.test.tsx`
- Delete: `packages/storybook-addon/src/addon-components.css`

- [ ] **Step 1: Delete all Variant Creator files**

```bash
rm -rf packages/storybook-addon/src/panels/VariantCreator/
rm -rf packages/storybook-addon/src/panels/utils/
rm packages/storybook-addon/src/panels/shared/AddonProvider.tsx
rm packages/storybook-addon/src/panels/shared/AddonProvider.test.tsx
rm packages/storybook-addon/src/addon-components.css
```

- [ ] **Step 2: Commit**

```bash
git add -u packages/storybook-addon/src/
git commit -m "chore: remove Variant Creator panel and related files"
```

---

### Task 2: Clean up manager.ts

**Files:**
- Modify: `packages/storybook-addon/src/manager.ts`

- [ ] **Step 1: Rewrite manager.ts**

Replace the entire file with:

```ts
import * as React from 'react';
import { addons, types } from 'storybook/manager-api';
import { ADDON_ID, TOKEN_EDITOR_PANEL_ID } from './constants.ts';
import { TokenEditor } from './panels/TokenEditor/index.ts';

addons.register(ADDON_ID, (api) => {
    const channel = api.getChannel();

    addons.add(TOKEN_EDITOR_PANEL_ID, {
        type: types.PANEL,
        title: 'Token Editor',
        render: ({ active }) => {
            if (!active) return null;
            return React.createElement(TokenEditor, { channel });
        },
    });
});
```

- [ ] **Step 2: Add comment to constants.ts**

Read `packages/storybook-addon/src/constants.ts`. Add a comment on the VARIANT_CREATOR_PANEL_ID line:

```ts
/** @deprecated Panel UI removed — kept for middleware path resolution */
export const VARIANT_CREATOR_PANEL_ID = `${ADDON_ID}/variant-creator`;
```

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/manager.ts packages/storybook-addon/src/constants.ts
git commit -m "refactor: remove Variant Creator from manager registration"
```

---

### Task 3: Clean up package.json, tsconfig.json, vitest.config.ts

**Files:**
- Modify: `packages/storybook-addon/package.json`
- Modify: `packages/storybook-addon/tsconfig.json`
- Modify: `packages/storybook-addon/vitest.config.ts`

- [ ] **Step 1: Remove @perimeterchurch/style dependency from package.json**

In `packages/storybook-addon/package.json`, remove this line from `dependencies`:
```
"@perimeterchurch/style": "workspace:*",
```

- [ ] **Step 2: Remove paths from tsconfig.json**

Replace `packages/storybook-addon/tsconfig.json` with:

```json
{
    "extends": "../../tsconfig.json",
    "compilerOptions": {
        "outDir": "dist",
        "allowImportingTsExtensions": true,
        "noUnusedLocals": false,
        "noUnusedParameters": false
    },
    "include": ["src"]
}
```

- [ ] **Step 3: Remove resolve aliases from vitest.config.ts**

Replace `packages/storybook-addon/vitest.config.ts` with:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./test-setup.ts'],
        globals: true,
    },
});
```

- [ ] **Step 4: Run pnpm install to update lockfile**

Run: `pnpm install`

- [ ] **Step 5: Run tests to verify nothing broke**

Run: `cd packages/storybook-addon && pnpm vitest run`
Expected: Server tests pass (86 tests). TokenEditor tests may fail due to design system component imports still present — that's OK, we fix those in Chunk 2.

- [ ] **Step 6: Commit**

```bash
git add packages/storybook-addon/package.json packages/storybook-addon/tsconfig.json packages/storybook-addon/vitest.config.ts pnpm-lock.yaml
git commit -m "chore: remove design system dependency and path aliases from addon"
```

---

## Chunk 2: Token Editor Rewrite with Storybook Components

### Task 4: Rewrite HintText and HelpToggle with Storybook-compatible styles

**Files:**
- Modify: `packages/storybook-addon/src/panels/shared/HintText.tsx`
- Modify: `packages/storybook-addon/src/panels/shared/HelpToggle.tsx`

- [ ] **Step 1: Rewrite HintText.tsx**

The current file uses `var(--color-muted-foreground, #6b7280)` in inline styles. Since token CSS is not loaded in the manager iframe, simplify to use the `useAddonTheme()` hook (which accesses Storybook's theme) for colors:

Read `packages/storybook-addon/src/panels/shared/HintText.tsx` and `packages/storybook-addon/src/panels/useAddonTheme.ts` first.

Replace the inline styles to use `useAddonTheme()` for colors:
- `color` → `theme.color.mediumdark`
- `backgroundColor` → `theme.background.app`
- Replace the dismiss `<button>` with an import of `IconButton` from `storybook/internal/components`

- [ ] **Step 2: Rewrite HelpToggle.tsx**

Replace the raw `<button>` with `IconButton` from `storybook/internal/components`:

```tsx
import * as React from 'react';
import { IconButton } from 'storybook/internal/components';
import { resetDismissedHints } from './HintText.tsx';

export interface HelpToggleProps {
    onReset: () => void;
}

export function HelpToggle({ onReset }: HelpToggleProps) {
    function handleClick() {
        resetDismissedHints();
        onReset();
    }

    return (
        <IconButton
            onClick={handleClick}
            title="Show hints and help text"
            aria-label="Show hints"
        >
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>?</span>
        </IconButton>
    );
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/panels/shared/
git commit -m "refactor: update HintText and HelpToggle for Storybook manager context"
```

---

### Task 5: Rewrite CategoryTabs with Storybook TabsState

**Files:**
- Modify: `packages/storybook-addon/src/panels/TokenEditor/CategoryTabs.tsx`

- [ ] **Step 1: Read the current file**

Read `packages/storybook-addon/src/panels/TokenEditor/CategoryTabs.tsx`.

- [ ] **Step 2: Rewrite with Storybook components**

The Storybook `TabsState` component manages tab state internally. However, since `TokenEditor` controls the active tab externally, we should use the lower-level `TabBar` + `TabButton` for a controlled tabs pattern. Read the Storybook type definitions to understand the exact API:

```bash
grep -A5 "TabBar\|TabButton" node_modules/storybook/dist/components/index.d.ts
```

Rewrite `CategoryTabs.tsx` to use Storybook tab components. Keep the same `CategoryTabsProps` interface (`categories`, `activeTab`, `onTabChange`). Use `Badge` from Storybook for the count.

If `TabBar`/`TabButton` prove complex to use with controlled state, fall back to styled `<button>` elements using the `useAddonTheme()` hook — the goal is clean, theme-aware UI, not necessarily importing every Storybook component.

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/panels/TokenEditor/CategoryTabs.tsx
git commit -m "refactor: rewrite CategoryTabs with Storybook components"
```

---

### Task 6: Rewrite TokenSearch with Storybook Form.Input

**Files:**
- Modify: `packages/storybook-addon/src/panels/TokenEditor/TokenSearch.tsx`

- [ ] **Step 1: Read current file and Storybook Form API**

Read `packages/storybook-addon/src/panels/TokenEditor/TokenSearch.tsx`.

Check Storybook's Form type:
```bash
grep -A10 "Form" node_modules/storybook/dist/components/index.d.ts | head -20
```

- [ ] **Step 2: Rewrite with Storybook Form.Input**

Replace the raw `<input>` with Storybook's form input. Keep the same `TokenSearchProps` interface. Use `useAddonTheme()` for styling the clear button. Keep the clear button as a small styled `<button>` or use `IconButton`.

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/panels/TokenEditor/TokenSearch.tsx
git commit -m "refactor: rewrite TokenSearch with Storybook Form components"
```

---

### Task 7: Rewrite TokenGroup with Storybook components and dirty indicators

**Files:**
- Modify: `packages/storybook-addon/src/panels/TokenEditor/TokenGroup.tsx`

- [ ] **Step 1: Read current file**

Read `packages/storybook-addon/src/panels/TokenEditor/TokenGroup.tsx`.

- [ ] **Step 2: Rewrite with Storybook components**

Replace the current inline-styled collapsible group:
- Use `Button` from `storybook/internal/components` for the toggle header (variant that looks like a subtle toggle)
- Use `Badge` for the token count
- Add new props: `dirtyTokens?: Set<string>` and `onTokenReset?: (name: string) => void`
- When a token name is in `dirtyTokens`, show a `Badge` with text "modified" next to it and a small `IconButton` for reset
- Keep using `useAddonTheme()` for remaining inline styles

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/panels/TokenEditor/TokenGroup.tsx
git commit -m "refactor: rewrite TokenGroup with Storybook components and dirty indicators"
```

---

### Task 8: Update token editors with Storybook Form.Input

**Files:**
- Modify: `packages/storybook-addon/src/panels/TokenEditor/editors/ColorEditor.tsx`
- Modify: `packages/storybook-addon/src/panels/TokenEditor/editors/SpacingEditor.tsx`
- Modify: `packages/storybook-addon/src/panels/TokenEditor/editors/ShadowEditor.tsx`
- Modify: `packages/storybook-addon/src/panels/TokenEditor/editors/TextEditor.tsx`

- [ ] **Step 1: Read all four editor files**

- [ ] **Step 2: Update each editor**

For each editor:
- Replace raw `<input type="text">` with Storybook's form input component
- Keep specialized inputs (`<input type="color">`, `<input type="range">`) — no Storybook equivalent
- Keep visual preview elements (swatch, shadow box, spacing preview) with `useAddonTheme()` for inline styles
- Remove any imports from `@perimeterchurch/style/components` (leftover from previous attempt)

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/panels/TokenEditor/editors/
git commit -m "refactor: use Storybook form inputs in token editors"
```

---

### Task 9: Rewrite TokenEditor with per-token reset, hints, and Storybook buttons

**Files:**
- Modify: `packages/storybook-addon/src/panels/TokenEditor/TokenEditor.tsx`

- [ ] **Step 1: Read the current file**

Read `packages/storybook-addon/src/panels/TokenEditor/TokenEditor.tsx`.

- [ ] **Step 2: Rewrite with Storybook components and new features**

1. Import `Button`, `Badge`, `IconButton` from `storybook/internal/components`
2. Import `HintText` and `HelpToggle` from shared
3. **Replace toolbar buttons**: Use Storybook `Button` for Save, Save as Theme, Reset. Add `title` tooltip attributes:
   - Save: `title="Writes changes to tokens.css — Vite HMR will reload automatically"`
   - Save as Theme: `title="Creates a new theme CSS file with all current token values"`
   - Reset: `title="Revert all unsaved changes"`
4. **Add per-token reset**: Create `handleTokenReset` callback that removes one token from `dirty` state and emits `TOKEN_CHANGED` with original value. Pass `dirtyTokens={new Set(Object.keys(dirty))}` and `onTokenReset={handleTokenReset}` to `TokenGroup`.
5. **Add dirty count badge**: Show `Badge` with count of modified tokens in toolbar
6. **Add HintText**: At top of panel, hint text: "Design tokens are the shared values (colors, spacing, shadows) used across all components. Changes here update the live preview instantly."
7. **Add HelpToggle**: In toolbar, `HelpToggle` component with state to force-show hints
8. **Theme name dialog**: Replace raw `<input>` and `<button>` with Storybook form input and Button
9. Remove any leftover imports from `@perimeterchurch/style/components`

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/panels/TokenEditor/TokenEditor.tsx
git commit -m "feat: add per-token reset, hints, and Storybook UI to Token Editor"
```

---

### Task 10: Update tests

**Files:**
- Modify: `packages/storybook-addon/src/panels/TokenEditor/TokenEditor.test.tsx`

- [ ] **Step 1: Read current tests**

Read `packages/storybook-addon/src/panels/TokenEditor/TokenEditor.test.tsx`.

- [ ] **Step 2: Update tests for new UI structure**

The tests need updating because:
- `CategoryTabs` now uses Storybook tab components (different DOM structure/aria attributes)
- `TokenSearch` now uses Storybook form input (different aria labels)
- Editors now use Storybook form inputs

Read each rewritten component to understand the new DOM structure, then update test selectors accordingly. Key things to verify:
- Tab rendering and click behavior still works
- Search with clear button still works
- Each editor renders correct input types
- Color swatch still renders

- [ ] **Step 3: Run tests**

Run: `cd packages/storybook-addon && pnpm vitest run`
Expected: All tests pass (server tests unchanged + updated TokenEditor tests).

- [ ] **Step 4: Run typecheck**

Run: `cd packages/storybook-addon && pnpm exec tsc --noEmit`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add packages/storybook-addon/src/panels/TokenEditor/TokenEditor.test.tsx
git commit -m "test: update TokenEditor tests for Storybook component UI"
```

---

## Chunk 3: Official Addon Integration

### Task 11: Add @storybook/addon-themes

**Files:**
- Modify: Root `package.json`
- Modify: `.storybook/main.ts`
- Modify: `.storybook/preview.ts`

- [ ] **Step 1: Install addon-themes**

Run: `pnpm add -Dw @storybook/addon-themes`

If there's a peer dependency conflict with `storybook@10.3.2`, pin the version:
`pnpm add -Dw @storybook/addon-themes@10.3.2`

- [ ] **Step 2: Register in .storybook/main.ts**

Read `.storybook/main.ts`. Add `'@storybook/addon-themes'` to the addons array:

```ts
addons: [
    '@storybook/addon-themes',
    getAbsolutePath('../packages/storybook-addon/src/preset.ts'),
],
```

- [ ] **Step 3: Replace manual theme decorator in .storybook/preview.ts**

Read `.storybook/preview.ts`. Replace the entire file. The existing manual implementation (`globalTypes.theme`, `initialGlobals.theme`, custom decorator) is replaced by `withThemeByDataAttribute`:

```ts
import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
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
        withThemeByDataAttribute({
            themes: {
                light: '',
                dark: 'dark',
            },
            defaultTheme: 'light',
            attributeName: 'data-theme',
            parentSelector: '.storybook-root',
        }),
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

Note: The `storybook-root` wrapper div is still needed for the CSS token scoping. `withThemeByDataAttribute` with `parentSelector: '.storybook-root'` sets `data-theme` on that wrapper.

- [ ] **Step 4: Manual test**

Run: `pnpm dev`
Verify: Storybook loads, toolbar has a theme dropdown, switching between light/dark works.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml .storybook/main.ts .storybook/preview.ts
git commit -m "feat: integrate @storybook/addon-themes for light/dark switching"
```

---

### Task 12: Add storybook-design-token

**Files:**
- Modify: Root `package.json`
- Modify: `.storybook/main.ts`
- Modify: `packages/tokens/src/tokens.css`

- [ ] **Step 1: Install storybook-design-token**

Run: `pnpm add -Dw storybook-design-token`

- [ ] **Step 2: Register in .storybook/main.ts**

Add `'storybook-design-token'` to the addons array (before or after addon-themes):

```ts
addons: [
    '@storybook/addon-themes',
    'storybook-design-token',
    getAbsolutePath('../packages/storybook-addon/src/preset.ts'),
],
```

- [ ] **Step 3: Add token annotations to tokens.css**

Read `packages/tokens/src/tokens.css`. Add `@tokens` and `@presenter` comment annotations above each token group. The annotations go INSIDE the `@theme` block, as comments above the relevant custom properties.

Example pattern (apply to all groups in the file):

```css
@theme {
    /**
     * @tokens Primary Colors
     * @presenter Color
     */
    --color-primary: #5b5bd6;
    --color-primary-hover: #4e4eca;
    --color-primary-active: #4242b8;
    --color-primary-foreground: #ffffff;

    /**
     * @tokens Success Colors
     * @presenter Color
     */
    --color-success: #46a758;
    /* ... */

    /**
     * @tokens Spacing
     * @presenter Spacing
     */
    --spacing-1: 0.25rem;
    /* ... */

    /**
     * @tokens Shadows
     * @presenter Shadow
     */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    /* ... */

    /**
     * @tokens Typography - Font Size
     * @presenter FontSize
     */
    --font-size-xs: 0.75rem;
    /* ... */

    /**
     * @tokens Border Radius
     * @presenter BorderRadius
     */
    --radius-sm: 0.125rem;
    /* ... */
}
```

Token group names and presenters to use:
- Colors → `@presenter Color`
- Spacing → `@presenter Spacing`
- Shadows → `@presenter Shadow`
- Font sizes → `@presenter FontSize`
- Font weights → `@presenter FontWeight`
- Font families → `@presenter FontFamily`
- Line heights → `@presenter LineHeight`
- Border radii → `@presenter BorderRadius`
- Transitions → no specific presenter, use `@presenter Animation` or omit

- [ ] **Step 4: Manual test**

Run: `pnpm dev`
Verify: Storybook loads, a "Design Tokens" doc page or tab appears showing the annotated tokens with visual presenters.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml .storybook/main.ts packages/tokens/src/tokens.css
git commit -m "feat: integrate storybook-design-token for token documentation"
```

---

## Chunk 4: Final Verification

### Task 13: Run full test suite and quality checks

- [ ] **Step 1: Run addon tests**

Run: `cd packages/storybook-addon && pnpm vitest run`
Expected: All tests pass.

- [ ] **Step 2: Run typecheck**

Run: `cd packages/storybook-addon && pnpm exec tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Run full project quality**

Run: `pnpm quality`
Expected: typecheck + lint + format + test all pass across all packages.

- [ ] **Step 4: Fix any issues**

Address failures. Common issues:
- Lint errors from unused imports in modified files
- Format issues — run `pnpm format` to fix
- Type errors from missing/changed imports

- [ ] **Step 5: Commit fixes if needed**

```bash
git add packages/storybook-addon/
git commit -m "fix: resolve quality check issues"
```

---

### Task 14: Manual integration test

- [ ] **Step 1: Start Storybook**

Run: `pnpm dev`

- [ ] **Step 2: Test Token Editor**

- Open Token Editor panel
- Browse tokens by category (tabs work)
- Search for a token (search works, clear works)
- Edit a token value (live preview updates)
- Verify "modified" badge appears on dirty tokens
- Click per-token reset — token reverts, badge disappears
- Click Save — writes to tokens.css
- Click Save as Theme — creates theme file
- Click Reset — reverts all changes
- Verify hints appear on first load
- Dismiss a hint, refresh — hint stays dismissed
- Click "?" — hints reappear

- [ ] **Step 3: Test addon-themes**

- Toolbar has theme dropdown
- Switch to dark mode — stories render with dark theme
- Switch back to light — stories render with light theme

- [ ] **Step 4: Test storybook-design-token**

- Token documentation page/tab is visible
- Color tokens show color swatches
- Spacing tokens show spacing previews
- Other token groups display with appropriate presenters

- [ ] **Step 5: Test Storybook UI integrity**

- Sidebar renders correctly
- Search works
- Stories render in canvas
- No CSS leaks or visual artifacts

- [ ] **Step 6: Commit any final fixes**

```bash
git add packages/storybook-addon/
git commit -m "fix: integration test fixes"
```
