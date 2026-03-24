# Plan 2: Theme Server Endpoints & Theme Editor UI

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add server endpoints for theme discovery and reading, then redesign the Token Editor into a Theme Editor with theme selection, component-scoped token tabs, and inherited/overridden distinction.

**Architecture:** Two new middleware endpoints (`list-themes`, `read-theme`) scan and parse theme CSS files. The Theme Editor panel replaces the Token Editor with a theme selector dropdown, tabbed interface (Global Tokens + per-component tabs), and visual distinction between inherited and overridden tokens. A new `THEME_CHANGED` channel event syncs the preview iframe.

**Tech Stack:** Storybook 10 internal components, Vite middleware, CSS parsing

**Spec:** `docs/superpowers/specs/2026-03-24-theme-system-redesign.md` (Sections 2 & 3)

**Depends on:** Plan 1 (components.css must exist so the editor knows what component variables are available)

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `packages/storybook-addon/src/server/listThemes.ts` | Scan themes directory, parse theme names from CSS selectors |
| `packages/storybook-addon/src/server/listThemes.test.ts` | Tests |
| `packages/storybook-addon/src/server/readTheme.ts` | Parse a single theme file's CSS variable overrides |
| `packages/storybook-addon/src/server/readTheme.test.ts` | Tests |
| `packages/storybook-addon/src/panels/ThemeEditor/ThemeEditor.tsx` | Main Theme Editor panel |
| `packages/storybook-addon/src/panels/ThemeEditor/ThemeSelector.tsx` | Theme dropdown + New Theme button |
| `packages/storybook-addon/src/panels/ThemeEditor/ComponentTokens.tsx` | Component-specific token tab content |
| `packages/storybook-addon/src/panels/ThemeEditor/index.ts` | Barrel export |

### Modified Files

| File | Changes |
|------|---------|
| `packages/storybook-addon/src/server/middleware.ts` | Add `list-themes` and `read-theme` routes, remove variant CRUD routes |
| `packages/storybook-addon/src/constants.ts` | Add `THEME_CHANGED` event, add `THEME_EDITOR_PANEL_ID` |
| `packages/storybook-addon/src/manager.ts` | Register "Theme Editor" instead of "Token Editor" |
| `packages/storybook-addon/src/preview.ts` | Add `THEME_CHANGED` listener |

### Deleted Files

| File | Reason |
|------|--------|
| `packages/storybook-addon/src/panels/TokenEditor/` (entire directory) | Replaced by ThemeEditor |

---

## Chunk 1: Server Endpoints

### Task 1: Implement listThemes (TDD)

**Files:**
- Create: `packages/storybook-addon/src/server/listThemes.ts`
- Create: `packages/storybook-addon/src/server/listThemes.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { parseThemeNameFromCss } from './listThemes.ts';

describe('parseThemeNameFromCss', () => {
    it('extracts theme name from data-theme selector', () => {
        const css = "[data-theme='dark'] { --color-bg: #000; }";
        expect(parseThemeNameFromCss(css)).toBe('dark');
    });

    it('handles double quotes', () => {
        const css = '[data-theme="easter-2026"] { --color-primary: #c41e3a; }';
        expect(parseThemeNameFromCss(css)).toBe('easter-2026');
    });

    it('returns null for CSS without data-theme selector', () => {
        expect(parseThemeNameFromCss(':root { --color-bg: #fff; }')).toBeNull();
    });

    it('returns null for empty CSS', () => {
        expect(parseThemeNameFromCss('')).toBeNull();
    });
});
```

- [ ] **Step 2: Run tests — verify fail**

Run: `cd packages/storybook-addon && pnpm vitest run src/server/listThemes.test.ts`

- [ ] **Step 3: Implement listThemes**

```ts
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface ThemeInfo {
    name: string;
    slug: string;
    filename: string;
}

const THEME_SELECTOR_RE = /\[data-theme=['"]([\w-]+)['"]\]/;

export function parseThemeNameFromCss(css: string): string | null {
    const match = THEME_SELECTOR_RE.exec(css);
    return match ? match[1] : null;
}

export async function listThemes(themesDir: string): Promise<ThemeInfo[]> {
    const files = await readdir(themesDir);
    const themes: ThemeInfo[] = [];

    for (const file of files) {
        if (!file.endsWith('.css')) continue;
        const content = await readFile(join(themesDir, file), 'utf-8');
        const name = parseThemeNameFromCss(content);
        if (name) {
            themes.push({ name, slug: name, filename: file });
        }
    }

    return themes.sort((a, b) => a.name.localeCompare(b.name));
}
```

- [ ] **Step 4: Run tests — verify pass**
- [ ] **Step 5: Commit**

```bash
git add packages/storybook-addon/src/server/listThemes.ts packages/storybook-addon/src/server/listThemes.test.ts
git commit -m "feat: add listThemes endpoint for theme discovery"
```

---

### Task 2: Implement readTheme (TDD)

**Files:**
- Create: `packages/storybook-addon/src/server/readTheme.ts`
- Create: `packages/storybook-addon/src/server/readTheme.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { parseThemeTokens } from './readTheme.ts';

describe('parseThemeTokens', () => {
    it('extracts token overrides from theme CSS', () => {
        const css = `[data-theme='dark'] {
    --color-background: #1c1917;
    --color-foreground: #fafaf9;
    --btn-radius: 9999px;
}`;
        const tokens = parseThemeTokens(css);
        expect(tokens).toEqual({
            '--color-background': '#1c1917',
            '--color-foreground': '#fafaf9',
            '--btn-radius': '9999px',
        });
    });

    it('returns empty object for CSS without declarations', () => {
        expect(parseThemeTokens("[data-theme='empty'] {}")).toEqual({});
    });

    it('handles var() references as values', () => {
        const css = "[data-theme='x'] { --btn-shadow: var(--shadow-md); }";
        expect(parseThemeTokens(css)).toEqual({ '--btn-shadow': 'var(--shadow-md)' });
    });

    it('handles color-mix() as values', () => {
        const css = "[data-theme='x'] { --btn-border: color-mix(in oklab, var(--btn-bg), #000 8%); }";
        const tokens = parseThemeTokens(css);
        expect(tokens['--btn-border']).toBe('color-mix(in oklab, var(--btn-bg), #000 8%)');
    });
});
```

- [ ] **Step 2: Run tests — verify fail**
- [ ] **Step 3: Implement readTheme**

```ts
import { readFile } from 'node:fs/promises';

const DECLARATION_RE = /^\s*(--[\w-]+)\s*:\s*(.+?)\s*;$/gm;

export function parseThemeTokens(css: string): Record<string, string> {
    const tokens: Record<string, string> = {};
    let match: RegExpExecArray | null;
    while ((match = DECLARATION_RE.exec(css)) !== null) {
        tokens[match[1]] = match[2];
    }
    DECLARATION_RE.lastIndex = 0;
    return tokens;
}

export async function readThemeFile(filePath: string): Promise<Record<string, string>> {
    const css = await readFile(filePath, 'utf-8');
    return parseThemeTokens(css);
}
```

- [ ] **Step 4: Run tests — verify pass**
- [ ] **Step 5: Commit**

```bash
git add packages/storybook-addon/src/server/readTheme.ts packages/storybook-addon/src/server/readTheme.test.ts
git commit -m "feat: add readTheme endpoint for parsing theme token overrides"
```

---

### Task 3: Wire endpoints into middleware and remove variant routes

**Files:**
- Modify: `packages/storybook-addon/src/server/middleware.ts`

- [ ] **Step 1: Read current middleware**

- [ ] **Step 2: Add list-themes and read-theme routes**

Add to the switch statement:

```ts
case 'list-themes': {
    const themes = await listThemes(themesDir);
    sendJson(res, 200, { themes });
    break;
}
case 'read-theme': {
    const themeName = route.params.theme;
    if (!themeName) {
        sendJson(res, 400, { error: 'Missing theme query parameter' });
        break;
    }
    // Find the theme file
    const themes = await listThemes(themesDir);
    const theme = themes.find(t => t.slug === themeName);
    if (!theme) {
        sendJson(res, 404, { error: `Theme "${themeName}" not found` });
        break;
    }
    const tokens = await readThemeFile(join(themesDir, theme.filename));
    sendJson(res, 200, { tokens });
    break;
}
```

Add to `ALLOWED_METHODS`:
```ts
'list-themes': 'GET',
'read-theme': 'GET',
```

- [ ] **Step 3: Remove variant CRUD routes**

Remove the `read-variants`, `write-variant`, and `delete-variant` cases from the switch statement. Remove their entries from `ALLOWED_METHODS`. Remove imports for variant-related server modules. Keep the server files themselves (they're still tested and may be useful later).

- [ ] **Step 4: Run server tests**

Run: `cd packages/storybook-addon && pnpm vitest run src/server/`

Update middleware tests if they test the removed routes — change those tests to verify 404 or remove them.

- [ ] **Step 5: Commit**

```bash
git add packages/storybook-addon/src/server/middleware.ts packages/storybook-addon/src/server/middleware.test.ts
git commit -m "feat: add list-themes and read-theme routes, remove variant CRUD routes"
```

---

## Chunk 2: Theme Editor Panel

### Task 4: Add THEME_CHANGED event and update constants

**Files:**
- Modify: `packages/storybook-addon/src/constants.ts`
- Modify: `packages/storybook-addon/src/preview.ts`

- [ ] **Step 1: Update constants.ts**

Add `THEME_CHANGED` event and rename panel ID:

```ts
export const ADDON_ID = 'perimeterchurch/style-addon';
export const THEME_EDITOR_PANEL_ID = `${ADDON_ID}/theme-editor`;

export const EVENTS = {
    TOKEN_CHANGED: `${ADDON_ID}/token-changed`,
    TOKENS_RESET: `${ADDON_ID}/tokens-reset`,
    THEME_CHANGED: `${ADDON_ID}/theme-changed`,
} as const;
```

- [ ] **Step 2: Update preview.ts**

Read `packages/storybook-addon/src/preview.ts`. Add a listener for `THEME_CHANGED` that sets `data-theme` on `.storybook-root`:

```ts
channel.on(EVENTS.THEME_CHANGED, ({ theme }: { theme: string }) => {
    const root = document.querySelector('.storybook-root');
    if (root) {
        if (theme === 'light' || !theme) {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }
    }
});
```

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/constants.ts packages/storybook-addon/src/preview.ts
git commit -m "feat: add THEME_CHANGED event and preview listener"
```

---

### Task 5: Create ThemeSelector component

**Files:**
- Create: `packages/storybook-addon/src/panels/ThemeEditor/ThemeSelector.tsx`

- [ ] **Step 1: Implement ThemeSelector**

A dropdown that lists all available themes + a "New Theme" button. Uses Storybook's built-in `Button` and styled `<select>`.

Props:
```ts
interface ThemeSelectorProps {
    themes: Array<{ name: string; slug: string }>;
    activeTheme: string; // 'light' for base, or theme slug
    onThemeChange: (slug: string) => void;
    onNewTheme: () => void;
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/storybook-addon/src/panels/ThemeEditor/ThemeSelector.tsx
git commit -m "feat: add ThemeSelector dropdown component"
```

---

### Task 6: Create ComponentTokens tab component

**Files:**
- Create: `packages/storybook-addon/src/panels/ThemeEditor/ComponentTokens.tsx`

- [ ] **Step 1: Implement ComponentTokens**

Displays component-scoped CSS variables for a specific component (e.g., all `--btn-*` variables). Shows inherited vs overridden state.

Props:
```ts
interface ComponentTokensProps {
    prefix: string; // e.g., 'btn', 'card', 'input'
    label: string; // e.g., 'Button', 'Card', 'Input'
    baseTokens: Record<string, string>; // all tokens from base theme
    themeOverrides: Record<string, string>; // tokens overridden in current theme
    dirtyTokens: Record<string, string>; // unsaved edits
    onTokenChange: (name: string, value: string) => void;
    onTokenReset: (name: string) => void;
    isBaseTheme: boolean; // true when editing light/base
}
```

Filters tokens by prefix (`--{prefix}-*`). Uses existing editor components (ColorEditor, TextEditor, etc.) for value editing. Shows solid dot for overridden, hollow dot for inherited.

- [ ] **Step 2: Commit**

```bash
git add packages/storybook-addon/src/panels/ThemeEditor/ComponentTokens.tsx
git commit -m "feat: add ComponentTokens tab for per-component token editing"
```

---

### Task 7: Create ThemeEditor main panel

**Files:**
- Create: `packages/storybook-addon/src/panels/ThemeEditor/ThemeEditor.tsx`
- Create: `packages/storybook-addon/src/panels/ThemeEditor/index.ts`

- [ ] **Step 1: Read the current TokenEditor implementation**

Read `packages/storybook-addon/src/panels/TokenEditor/TokenEditor.tsx` — most of the logic (fetch, dirty state, save, reset, search, category tabs) carries forward. The key additions are: theme selector, component tabs, inherited/overridden display, and per-theme save.

- [ ] **Step 2: Implement ThemeEditor.tsx**

The Theme Editor combines:
- ThemeSelector at the top
- Tab bar: "Global Tokens" + one tab per component prefix
- "Global Tokens" tab: reuses the existing category-based token display
- Component tabs: uses ComponentTokens
- Save behavior switches between `write-tokens` (base) and `write-theme` (custom themes)
- Live preview emits `THEME_CHANGED` when switching themes, `TOKEN_CHANGED` for edits

Key state:
```ts
const [themes, setThemes] = useState<ThemeInfo[]>([]);
const [activeTheme, setActiveTheme] = useState('light');
const [baseTokens, setBaseTokens] = useState<Record<string, string>>({});
const [themeOverrides, setThemeOverrides] = useState<Record<string, string>>({});
const [dirty, setDirty] = useState<Record<string, string>>({});
```

When activeTheme changes:
- If 'light': fetch `read-tokens`, set baseTokens, clear overrides
- If other: fetch `read-tokens` for base AND `read-theme?theme={slug}` for overrides

Component tab definitions (derived from `components.css` prefixes):
```ts
const COMPONENT_TABS = [
    { prefix: 'btn', label: 'Button' },
    { prefix: 'card', label: 'Card' },
    { prefix: 'badge', label: 'Badge' },
    { prefix: 'fc', label: 'Form Controls' },
    { prefix: 'checkbox', label: 'Checkbox' },
    { prefix: 'switch', label: 'Switch' },
    { prefix: 'avatar', label: 'Avatar' },
    { prefix: 'tabs', label: 'Tabs' },
    { prefix: 'label', label: 'Label' },
];
```

- [ ] **Step 3: Create index.ts barrel**

```ts
export { ThemeEditor } from './ThemeEditor.tsx';
```

- [ ] **Step 4: Commit**

```bash
git add packages/storybook-addon/src/panels/ThemeEditor/
git commit -m "feat: create ThemeEditor panel with theme selection and component tabs"
```

---

### Task 8: Wire ThemeEditor into manager and delete TokenEditor

**Files:**
- Modify: `packages/storybook-addon/src/manager.ts`
- Delete: `packages/storybook-addon/src/panels/TokenEditor/` (entire directory)

- [ ] **Step 1: Update manager.ts**

```ts
import { ADDON_ID, THEME_EDITOR_PANEL_ID } from './constants.ts';
import { ThemeEditor } from './panels/ThemeEditor/index.ts';

addons.register(ADDON_ID, (api) => {
    const channel = api.getChannel();

    addons.add(THEME_EDITOR_PANEL_ID, {
        type: types.PANEL,
        title: 'Theme Editor',
        render: ({ active }) => {
            if (!active) return null;
            return React.createElement(ThemeEditor, { channel });
        },
    });
});
```

- [ ] **Step 2: Delete TokenEditor directory**

```bash
rm -rf packages/storybook-addon/src/panels/TokenEditor/
```

- [ ] **Step 3: Run tests**

Run: `cd packages/storybook-addon && pnpm vitest run`

The TokenEditor tests will be deleted. Server tests + new theme endpoint tests should pass.

- [ ] **Step 4: Commit**

```bash
git add packages/storybook-addon/src/manager.ts
git add -u packages/storybook-addon/src/panels/TokenEditor/
git commit -m "feat: replace Token Editor with Theme Editor panel"
```

---

### Task 9: Add ThemeEditor tests

**Files:**
- Create: `packages/storybook-addon/src/panels/ThemeEditor/ThemeEditor.test.tsx`

- [ ] **Step 1: Write tests**

Test the main Theme Editor component:
1. Shows theme selector dropdown
2. Loads theme list on mount
3. Shows "Global Tokens" tab by default
4. Shows component tabs (Button, Card, etc.)
5. Switching themes fetches theme overrides
6. Editing a token marks it as dirty
7. Per-token reset works
8. Save calls correct endpoint based on active theme

Mock `global.fetch` for API calls.

- [ ] **Step 2: Run tests**

Run: `cd packages/storybook-addon && pnpm vitest run`

- [ ] **Step 3: Commit**

```bash
git add packages/storybook-addon/src/panels/ThemeEditor/ThemeEditor.test.tsx
git commit -m "test: add ThemeEditor panel tests"
```
