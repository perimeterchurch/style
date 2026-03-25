# shadcn Registry Rewrite — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wipe the current style project and rebuild as a shadcn-compatible component registry with Perimeter's warm stone palette, full component set, themes, and a minimal theme editor with live iframe preview.

**Architecture:** Next.js 15 app serving shadcn registry JSON at `public/r/`. Components live in `registry/new-york/ui/` as the single source of truth. A `/editor` route provides a split-pane theme editor with iframe-based live preview using `@tailwindcss/browser` for in-browser Tailwind compilation and postMessage for instant token updates.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, shadcn CLI 3.0, Zustand, @tailwindcss/browser, OKLCH colors

**Spec:** `docs/superpowers/specs/2026-03-24-shadcn-registry-rewrite.md`

---

## File Structure

Everything is new — this is a fresh start.

### Core Files

| File | Responsibility |
|------|---------------|
| `package.json` | Dependencies, scripts |
| `next.config.ts` | Next.js config |
| `tsconfig.json` | TypeScript with `@/*` path alias |
| `postcss.config.mjs` | PostCSS with Tailwind |
| `components.json` | shadcn CLI config |
| `registry.json` | Registry manifest with all items |
| `.gitignore` | Standard Next.js + public/r/ |
| `CLAUDE.md` | Project guidelines |

### Tokens & Styles

| File | Responsibility |
|------|---------------|
| `app/globals.css` | Perimeter warm stone palette + Tailwind imports + @theme inline |

### App Pages

| File | Responsibility |
|------|---------------|
| `app/layout.tsx` | Root layout with fonts + dark mode class |
| `app/page.tsx` | Landing/docs page |
| `app/editor/page.tsx` | Theme editor (split-pane: controls + iframe) |
| `app/preview/showcase/page.tsx` | Component showcase for iframe preview |
| `app/preview/forms/page.tsx` | Form layout preview |
| `app/preview/dashboard/page.tsx` | Dashboard mockup preview |
| `app/preview/layout.tsx` | Minimal layout for preview pages (no nav) |

### Editor-Specific

| File | Responsibility |
|------|---------------|
| `lib/editor-store.ts` | Zustand store for token editing state |
| `lib/default-tokens.ts` | Default light/dark token values |
| `components/editor/token-controls.tsx` | Color pickers, sliders, token editing UI |
| `components/editor/preview-frame.tsx` | iframe wrapper with postMessage communication |

### Registry

| File | Responsibility |
|------|---------------|
| `registry/new-york/ui/*.tsx` | All shadcn components (installed via CLI) |
| `registry/new-york/lib/utils.ts` | cn() utility for registry |
| `registry/themes/*.json` | Theme definitions (light, dark, perimeter-api, metrics) |
| `scripts/generate-registry.ts` | Script to populate registry.json items from component files |

### Utilities

| File | Responsibility |
|------|---------------|
| `lib/utils.ts` | cn() utility for app |

---

## Chunk 1: Project Scaffold — Clean Slate + Next.js + Tailwind

### Task 1: Create branch and wipe working tree

**Files:**
- Delete: everything except `.git/` and `.github/`

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b feat/registry-rewrite
```

- [ ] **Step 2: Remove all existing files**

```bash
# Remove everything except .git and .github
find . -maxdepth 1 ! -name '.git' ! -name '.github' ! -name '.' -exec rm -rf {} +
```

- [ ] **Step 3: Verify clean state**

```bash
ls -la
# Should only show .git/ and .github/
```

- [ ] **Step 4: Commit the wipe**

```bash
git add -A
git commit -m "chore: wipe working tree for shadcn registry rewrite"
```

---

### Task 2: Scaffold Next.js project

- [ ] **Step 1: Create Next.js app**

```bash
pnpm dlx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack --yes
```

Note: If the command fails because the directory is not empty (due to .git/.github), create in a temp directory and move files:

```bash
pnpm dlx create-next-app@latest /tmp/style-temp --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack --yes
cp -r /tmp/style-temp/* .
cp /tmp/style-temp/.gitignore .
cp /tmp/style-temp/.eslintrc* . 2>/dev/null || true
rm -rf /tmp/style-temp
```

- [ ] **Step 2: Install additional dependencies**

```bash
pnpm add zustand @tailwindcss/browser
pnpm add -D shadcn prettier
```

- [ ] **Step 3: Verify it runs**

```bash
pnpm dev
# Should start at http://localhost:3000 with the default Next.js page
```

Kill the dev server after verifying.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 project with Tailwind v4"
```

---

### Task 3: Configure shadcn CLI and install all components

- [ ] **Step 1: Initialize shadcn**

```bash
pnpm dlx shadcn@latest init --style new-york --base-color stone --css-variables --yes
```

This creates `components.json` and sets up the project for shadcn.

- [ ] **Step 2: Install all shadcn components**

```bash
pnpm dlx shadcn@latest add --all --yes
```

This installs ~55 components into `components/ui/`.

- [ ] **Step 3: Move components to registry source directory**

```bash
mkdir -p registry/new-york/ui
mkdir -p registry/new-york/lib
cp components/ui/* registry/new-york/ui/
cp lib/utils.ts registry/new-york/lib/utils.ts
```

- [ ] **Step 4: Verify component count**

```bash
ls registry/new-york/ui/ | wc -l
# Should be ~55+ files
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: install full shadcn component set and set up registry structure"
```

---

### Task 4: Apply Perimeter warm stone tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css with Perimeter tokens**

Read the current `app/globals.css` (generated by shadcn init). Replace it with the full token set from the spec (Section 2). This includes:
- `@import "tailwindcss"`
- `@theme inline { ... }` with all Tailwind bridge mappings
- `:root { ... }` with warm stone light palette
- `.dark { ... }` with dark palette
- Extended tokens: `--success`, `--warning`, `--info` and their foregrounds

Use the exact CSS from the spec.

- [ ] **Step 2: Verify styles apply**

```bash
pnpm dev
# Open http://localhost:3000, inspect :root CSS variables
# Should see oklch values for --primary, --background, etc.
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: apply Perimeter warm stone palette with OKLCH tokens"
```

---

### Task 5: Write CLAUDE.md and update package.json scripts

**Files:**
- Create: `CLAUDE.md`
- Modify: `package.json`

- [ ] **Step 1: Create CLAUDE.md**

Write the CLAUDE.md from the spec (Section 5).

- [ ] **Step 2: Update package.json scripts**

Add/update scripts:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "pnpm registry:build && next build",
    "start": "next start",
    "lint": "next lint",
    "registry:build": "shadcn build",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "echo 'No automated tests yet'",
    "quality": "pnpm typecheck && pnpm lint && pnpm format:check"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md package.json
git commit -m "chore: add CLAUDE.md and configure build scripts"
```

---

## Chunk 2: Registry Build Pipeline

### Task 6: Create registry.json manifest with all components

**Files:**
- Create: `scripts/generate-registry.ts`
- Create/Modify: `registry.json`

- [ ] **Step 1: Create the registry generation script**

Create `scripts/generate-registry.ts` — a Node.js script that:
1. Scans `registry/new-york/ui/` for all `.tsx` files
2. For each file, reads the imports to detect `registryDependencies` (other `@/registry/new-york/ui/` imports) and `dependencies` (npm packages like `@radix-ui/*`)
3. Generates a `registry.json` with all items listed

The script should handle the standard shadcn component patterns:
- Files importing from `@radix-ui/*` → add as `dependencies`
- Files importing other ui components → add as `registryDependencies`
- All UI components get `type: "registry:ui"`

- [ ] **Step 2: Run the script**

```bash
pnpm tsx scripts/generate-registry.ts
```

Verify `registry.json` has items for all ~55 components.

- [ ] **Step 3: Add theme items to registry.json**

Create theme JSON files in `registry/themes/`:
- `registry/themes/perimeter-api.json`
- `registry/themes/metrics.json`

Add them as items in `registry.json` with `type: "registry:theme"`.

- [ ] **Step 4: Test registry build**

```bash
pnpm registry:build
ls public/r/
# Should contain registry.json + one .json per component + theme .json files
```

- [ ] **Step 5: Verify a built component JSON**

```bash
cat public/r/button.json | head -20
# Should have $schema, name, type, files with content
```

- [ ] **Step 6: Commit**

```bash
git add scripts/ registry.json registry/themes/ public/r/
git commit -m "feat: build registry pipeline with all components and themes"
```

---

### Task 7: Create landing page

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update layout.tsx**

Set up the root layout with:
- Geist font (or your preferred font)
- Dark mode support via class (standard shadcn pattern)
- Import globals.css

- [ ] **Step 2: Create landing page**

Replace the default Next.js page with a simple registry landing page that shows:
- Project name: "Perimeter Church Design System"
- Brief description
- Link to `/editor` (Theme Editor)
- A sample of components rendered with the warm stone palette (buttons, cards, etc.)

Use components from `registry/new-york/ui/` to build the page.

- [ ] **Step 3: Verify**

```bash
pnpm dev
# Open http://localhost:3000, should show the landing page with styled components
```

- [ ] **Step 4: Commit**

```bash
git add app/
git commit -m "feat: add registry landing page with component showcase"
```

---

## Chunk 3: Editor Foundation

### Task 8: Create Zustand store and default tokens

**Files:**
- Create: `lib/default-tokens.ts`
- Create: `lib/editor-store.ts`

- [ ] **Step 1: Create default-tokens.ts**

Export the default light and dark token maps as plain objects:

```ts
export const DEFAULT_LIGHT_TOKENS: Record<string, string> = {
  'background': 'oklch(0.985 0.002 75)',
  'foreground': 'oklch(0.147 0.012 50)',
  'primary': 'oklch(0.488 0.145 283)',
  'primary-foreground': 'oklch(0.985 0 0)',
  // ... all tokens from globals.css :root block
};

export const DEFAULT_DARK_TOKENS: Record<string, string> = {
  'background': 'oklch(0.147 0.012 50)',
  'foreground': 'oklch(0.985 0.002 75)',
  // ... all tokens from globals.css .dark block
};

export const TOKEN_GROUPS = [
  { label: 'Primary', tokens: ['primary', 'primary-foreground'] },
  { label: 'Secondary', tokens: ['secondary', 'secondary-foreground'] },
  { label: 'Success', tokens: ['success', 'success-foreground'] },
  { label: 'Warning', tokens: ['warning', 'warning-foreground'] },
  { label: 'Destructive', tokens: ['destructive'] },
  { label: 'Info', tokens: ['info', 'info-foreground'] },
  { label: 'Background', tokens: ['background', 'foreground'] },
  { label: 'Muted', tokens: ['muted', 'muted-foreground'] },
  { label: 'Accent', tokens: ['accent', 'accent-foreground'] },
  { label: 'Card', tokens: ['card', 'card-foreground'] },
  { label: 'Border & Input', tokens: ['border', 'input', 'ring'] },
] as const;
```

- [ ] **Step 2: Create editor-store.ts**

Zustand store with localStorage persistence:

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_LIGHT_TOKENS, DEFAULT_DARK_TOKENS } from './default-tokens';

interface EditorState {
  lightTokens: Record<string, string>;
  darkTokens: Record<string, string>;
  activeMode: 'light' | 'dark';
  setToken: (name: string, value: string) => void;
  setActiveMode: (mode: 'light' | 'dark') => void;
  resetToDefaults: () => void;
  getActiveTokens: () => Record<string, string>;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      lightTokens: { ...DEFAULT_LIGHT_TOKENS },
      darkTokens: { ...DEFAULT_DARK_TOKENS },
      activeMode: 'light',
      setToken: (name, value) => {
        const mode = get().activeMode;
        if (mode === 'light') {
          set((s) => ({ lightTokens: { ...s.lightTokens, [name]: value } }));
        } else {
          set((s) => ({ darkTokens: { ...s.darkTokens, [name]: value } }));
        }
      },
      setActiveMode: (mode) => set({ activeMode: mode }),
      resetToDefaults: () => set({
        lightTokens: { ...DEFAULT_LIGHT_TOKENS },
        darkTokens: { ...DEFAULT_DARK_TOKENS },
      }),
      getActiveTokens: () => {
        const state = get();
        return state.activeMode === 'light' ? state.lightTokens : state.darkTokens;
      },
    }),
    { name: 'perimeter-editor' },
  ),
);
```

- [ ] **Step 3: Commit**

```bash
git add lib/default-tokens.ts lib/editor-store.ts
git commit -m "feat: add Zustand editor store with default tokens"
```

---

### Task 9: Create preview pages

**Files:**
- Create: `app/preview/layout.tsx`
- Create: `app/preview/showcase/page.tsx`

- [ ] **Step 1: Create preview layout**

A minimal layout for preview pages — no navigation, just the content. Includes the `@tailwindcss/browser` script and the postMessage listener.

```tsx
// app/preview/layout.tsx
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body>
        <style type="text/tailwindcss">{`
          @theme inline {
            --color-background: var(--background);
            --color-foreground: var(--foreground);
            --color-primary: var(--primary);
            --color-primary-foreground: var(--primary-foreground);
            /* ... all bridge mappings from globals.css */
          }
        `}</style>
        <div id="preview-root" className="p-6">
          {children}
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('message', (e) => {
            if (e.data.type === 'UPDATE_TOKENS') {
              const { tokens, mode } = e.data;
              for (const [name, value] of Object.entries(tokens)) {
                document.documentElement.style.setProperty('--' + name, value);
              }
              document.documentElement.classList.toggle('dark', mode === 'dark');
            }
          });
        `}} />
      </body>
    </html>
  );
}
```

Note: The preview layout is a SEPARATE root layout (not nested under the main layout) because the iframe needs its own `<html>` document. Next.js supports this with route groups or by having `app/preview/layout.tsx` define its own `<html>`.

- [ ] **Step 2: Create showcase preview page**

Import components from the registry and render a curated grid:

```tsx
// app/preview/showcase/page.tsx
import { Button } from '@/registry/new-york/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/registry/new-york/ui/card';
import { Input } from '@/registry/new-york/ui/input';
import { Badge } from '@/registry/new-york/ui/badge';
// ... more imports

export default function ShowcasePage() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-3">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>
      {/* More sections: Cards, Inputs, Badges, Tabs, etc. */}
    </div>
  );
}
```

- [ ] **Step 3: Verify preview loads**

```bash
pnpm dev
# Open http://localhost:3000/preview/showcase
# Should show components with warm stone palette
```

- [ ] **Step 4: Commit**

```bash
git add app/preview/
git commit -m "feat: add preview pages with component showcase for editor iframe"
```

---

### Task 10: Create editor page with token controls and iframe preview

**Files:**
- Create: `components/editor/preview-frame.tsx`
- Create: `components/editor/token-controls.tsx`
- Create: `app/editor/page.tsx`

- [ ] **Step 1: Create preview-frame component**

A React component that renders an iframe pointing to `/preview/showcase` and sends postMessage updates when tokens change.

```tsx
// components/editor/preview-frame.tsx
'use client';

import { useRef, useEffect } from 'react';
import { useEditorStore } from '@/lib/editor-store';

export function PreviewFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { lightTokens, darkTokens, activeMode } = useEditorStore();
  const tokens = activeMode === 'light' ? lightTokens : darkTokens;

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage({
      type: 'UPDATE_TOKENS',
      tokens,
      mode: activeMode,
    }, window.location.origin);
  }, [tokens, activeMode]);

  return (
    <iframe
      ref={iframeRef}
      src="/preview/showcase"
      className="w-full h-full border-0"
      title="Component Preview"
    />
  );
}
```

- [ ] **Step 2: Create token-controls component**

A sidebar with color pickers and sliders for editing tokens. Uses shadcn Input, Label, and Button components.

For each token group (Primary, Secondary, etc.), render a color input + text input pair. The color input provides a visual picker, the text input shows the oklch value.

Use the `TOKEN_GROUPS` from `default-tokens.ts` to organize the controls.

- [ ] **Step 3: Create editor page**

```tsx
// app/editor/page.tsx
'use client';

import { PreviewFrame } from '@/components/editor/preview-frame';
import { TokenControls } from '@/components/editor/token-controls';

export default function EditorPage() {
  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r overflow-y-auto p-4">
        <TokenControls />
      </aside>
      <main className="flex-1">
        <PreviewFrame />
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Verify editor works**

```bash
pnpm dev
# Open http://localhost:3000/editor
# Left panel shows token controls
# Right panel shows component preview in iframe
# Changing a color should update the preview
```

- [ ] **Step 5: Commit**

```bash
git add components/editor/ app/editor/
git commit -m "feat: add theme editor page with token controls and live iframe preview"
```

---

### Task 11: Add export functionality and preview tabs

**Files:**
- Modify: `components/editor/token-controls.tsx`
- Create: `lib/export-theme.ts`
- Create: `app/preview/forms/page.tsx`
- Create: `app/preview/dashboard/page.tsx`

- [ ] **Step 1: Create export-theme utility**

```ts
// lib/export-theme.ts
export function exportAsCSS(light: Record<string, string>, dark: Record<string, string>): string {
  const lightBlock = Object.entries(light)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n');
  const darkBlock = Object.entries(dark)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n');

  return `:root {\n${lightBlock}\n}\n\n.dark {\n${darkBlock}\n}`;
}

export function exportAsRegistryTheme(
  name: string,
  light: Record<string, string>,
  dark: Record<string, string>,
): object {
  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name,
    type: 'registry:theme',
    cssVars: { light, dark },
  };
}
```

- [ ] **Step 2: Add export buttons to token controls**

Add "Export CSS" and "Copy Theme JSON" buttons that use the export utilities and copy to clipboard.

- [ ] **Step 3: Create forms preview page**

A preview page showing a login form, registration form, and settings form using shadcn components.

- [ ] **Step 4: Create dashboard preview page**

A preview page showing a dashboard layout with cards, a table, and sidebar navigation.

- [ ] **Step 5: Add preview tab switching to the editor**

Add tabs above the iframe in the editor that switch between showcase, forms, and dashboard previews by changing the iframe src.

- [ ] **Step 6: Commit**

```bash
git add lib/export-theme.ts components/editor/ app/preview/ app/editor/
git commit -m "feat: add export functionality and preview tab switching"
```

---

## Chunk 4: Final Verification

### Task 12: Quality checks and verification

- [ ] **Step 1: Run typecheck**

```bash
pnpm typecheck
```

Fix any TypeScript errors.

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Fix any lint errors.

- [ ] **Step 3: Run format**

```bash
pnpm format
```

- [ ] **Step 4: Run registry build**

```bash
pnpm registry:build
```

Verify `public/r/` contains all component JSON files.

- [ ] **Step 5: Run full quality**

```bash
pnpm quality
```

- [ ] **Step 6: Manual verification**

```bash
pnpm dev
```

Verify:
- Landing page loads at `/` with styled components
- Editor loads at `/editor` with split-pane layout
- Changing a color in the editor updates the preview iframe instantly
- Light/dark toggle works
- Export CSS copies valid token blocks
- Preview tabs (showcase, forms, dashboard) switch correctly
- `public/r/button.json` contains valid registry JSON with embedded source

- [ ] **Step 7: Commit any fixes**

```bash
git add .
git commit -m "fix: resolve quality issues"
```

---

### Task 13: Update .github workflows (if needed)

- [ ] **Step 1: Read existing .github/workflows/**

Check what CI/CD workflows exist. They likely reference the old package structure.

- [ ] **Step 2: Update for new build**

The key change: the build command is now `pnpm registry:build && next build` instead of the old turbo-based build. Update any `pnpm build` or `pnpm quality` references.

If there's a publish workflow, it needs to be updated — this project no longer publishes to npm/GitHub Packages. It deploys as a static site (Vercel/Netlify/GitHub Pages).

- [ ] **Step 3: Commit**

```bash
git add .github/
git commit -m "chore: update CI/CD workflows for registry architecture"
```
