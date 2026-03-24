# shadcn Registry Rewrite — Perimeter Church Design System

## Summary

Wipe the current style project and rebuild from scratch as a shadcn-compatible registry. The project becomes a Next.js app that serves registry JSON (components, themes, utilities) and hosts a theme editor with live iframe preview. Components are shadcn's full set customized with Perimeter's warm stone palette. Consumers install components as source code via the shadcn CLI, not as an npm package dependency.

## Goals

1. Set up a shadcn registry from the official template
2. Define Perimeter's warm stone palette as the base style using OKLCH tokens
3. Install and customize the full shadcn component set
4. Create light, dark, and project-specific themes as registry items
5. Build a minimal but functional editor page (`/editor`) with iframe-based live preview and token controls
6. Rewrite CLAUDE.md for the new architecture

## Non-Goals

- Full-featured theme editor (Spec 2)
- Consumer migration (perimeter-api, widgets, metrics)
- Storybook (replaced by the editor + registry preview)
- AI theme generation
- Community theme sharing
- Authentication or database

---

## Section 1: Project Setup

### Git Strategy

1. Create branch `feat/registry-rewrite`
2. Remove all existing files except `.git/` and `.github/`
3. Scaffold from shadcn registry template
4. Build out incrementally with frequent commits

### Clean Slate

**Delete everything except:**
- `.git/` — preserve full history
- `.github/` — keep CI/CD structure (workflows will be updated)

### New Project Structure

```
style/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with font + theme
│   ├── page.tsx                  # Landing page / registry docs
│   └── editor/
│       └── page.tsx              # Theme editor with iframe preview
├── components/
│   └── ui/                       # App-specific UI (NOT registry components)
├── registry/
│   ├── new-york/                 # Registry source files (SINGLE SOURCE OF TRUTH)
│   │   ├── ui/                   # Component source for registry + local dev
│   │   ├── hooks/                # Shared hooks
│   │   └── lib/                  # Utilities (cn, etc.)
│   └── themes/                   # Theme definition source files
│       ├── light.json            # Base light theme
│       ├── dark.json             # Dark theme overrides
│       ├── perimeter-api.json    # Project-specific theme
│       └── metrics.json          # Project-specific theme
├── app/
│   └── preview/                  # iframe preview pages for editor
│       ├── showcase/page.tsx     # Component showcase
│       ├── forms/page.tsx        # Form layout preview
│       └── dashboard/page.tsx    # Dashboard mockup preview
├── styles/
│   └── globals.css               # Perimeter tokens + Tailwind
├── lib/
│   └── utils.ts                  # cn() utility
├── public/
│   └── r/                        # Built registry JSON (shadcn build output)
├── registry.json                 # Root registry manifest
├── components.json               # shadcn CLI config
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── CLAUDE.md
└── .gitignore
```

### Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 15+ | App framework + static JSON serving |
| React | 19 | UI |
| Tailwind CSS | v4 | Styling (CSS-first config) |
| shadcn CLI | latest | `shadcn build` for registry JSON generation |
| `@tailwindcss/browser` | v4 | In-browser Tailwind compilation for editor preview |
| Zustand | 5 | Editor state management |
| OKLCH | — | Color format (shadcn v4 standard) |

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "shadcn build && next build",
    "registry:build": "shadcn build",
    "lint": "next lint",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "echo 'No automated tests yet'",
    "quality": "pnpm typecheck && pnpm lint && pnpm format:check"
  }
}
```

---

## Section 2: Design Tokens

### Token Convention

Follow shadcn's exact naming convention with OKLCH color format. Background/foreground pairs. This ensures all shadcn components work out of the box with no modifications.

### globals.css

```css
@import "tailwindcss";

@theme inline {
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.5);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-destructive-foreground: var(--destructive-foreground, oklch(0.985 0 0));
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
}

:root {
  --radius: 0.625rem;
  --background: oklch(0.985 0.002 75);
  --foreground: oklch(0.147 0.012 50);
  --card: oklch(0.985 0.002 75);
  --card-foreground: oklch(0.147 0.012 50);
  --popover: oklch(0.985 0.002 75);
  --popover-foreground: oklch(0.147 0.012 50);
  --primary: oklch(0.488 0.145 283);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0.003 75);
  --secondary-foreground: oklch(0.41 0.01 50);
  --muted: oklch(0.96 0.003 75);
  --muted-foreground: oklch(0.553 0.01 50);
  --accent: oklch(0.96 0.003 75);
  --accent-foreground: oklch(0.41 0.01 50);
  --destructive: oklch(0.577 0.245 27);
  --border: oklch(0.87 0.006 75);
  --input: oklch(0.87 0.006 75);
  --ring: oklch(0.488 0.145 283);
  --success: oklch(0.59 0.16 145);
  --success-foreground: oklch(0.985 0 0);
  --warning: oklch(0.78 0.15 80);
  --warning-foreground: oklch(0.985 0 0);
  --info: oklch(0.62 0.17 230);
  --info-foreground: oklch(0.985 0 0);
  --chart-1: oklch(0.488 0.145 283);
  --chart-2: oklch(0.59 0.16 145);
  --chart-3: oklch(0.78 0.15 80);
  --chart-4: oklch(0.577 0.245 27);
  --chart-5: oklch(0.62 0.17 230);
}

.dark {
  --background: oklch(0.147 0.012 50);
  --foreground: oklch(0.985 0.002 75);
  --card: oklch(0.195 0.012 50);
  --card-foreground: oklch(0.985 0.002 75);
  --popover: oklch(0.195 0.012 50);
  --popover-foreground: oklch(0.985 0.002 75);
  --primary: oklch(0.55 0.145 283);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.27 0.01 50);
  --secondary-foreground: oklch(0.87 0.006 75);
  --muted: oklch(0.27 0.01 50);
  --muted-foreground: oklch(0.7 0.006 75);
  --accent: oklch(0.27 0.01 50);
  --accent-foreground: oklch(0.87 0.006 75);
  --destructive: oklch(0.65 0.235 27);
  --border: oklch(0.35 0.01 50);
  --input: oklch(0.35 0.01 50);
  --ring: oklch(0.55 0.145 283);
  --success: oklch(0.65 0.16 145);
  --success-foreground: oklch(0.985 0 0);
  --warning: oklch(0.82 0.15 80);
  --warning-foreground: oklch(0.147 0.012 50);
  --info: oklch(0.68 0.17 230);
  --info-foreground: oklch(0.985 0 0);
  --chart-1: oklch(0.55 0.145 283);
  --chart-2: oklch(0.65 0.16 145);
  --chart-3: oklch(0.82 0.15 80);
  --chart-4: oklch(0.65 0.235 27);
  --chart-5: oklch(0.68 0.17 230);
}
```

### Extended Tokens

shadcn's default set does not include `--success`, `--warning`, `--info`. These are Perimeter extensions. Components that use them (success/warning/info Button variants, Badge variants, etc.) will be defined in our customized registry components.

---

## Section 3: Registry Configuration

### registry.json

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "perimeter",
  "homepage": "https://style.perimeter.church",
  "items": []
}
```

**Important:** Every component, theme, hook, and utility must be explicitly listed as an entry in the `items` array with `name`, `type`, `files`, `dependencies`, and `registryDependencies`. The `shadcn build` command reads this manifest — it does NOT auto-discover files. With ~50+ components, a helper script (`scripts/generate-registry.ts`) should be created to scan `registry/new-york/ui/` and generate the items array, rather than maintaining it manually.

Theme items from `registry/themes/` must also be listed in the `items` array. The JSON files in `registry/themes/` are source definitions referenced by those entries.

### components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "styles/globals.css",
    "baseColor": "stone"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "hooks": "@/hooks",
    "ui": "@/components/ui"
  },
  "iconLibrary": "lucide"
}
```

### Component Installation

Install the full shadcn component set directly into the registry source directory:

```bash
pnpm dlx shadcn@latest add --all --path registry/new-york/ui
```

**Single source of truth:** `registry/new-york/ui/` holds the component source files. The app imports from there directly via path aliases (configured in `tsconfig.json`). The `components/ui/` directory is reserved for app-specific UI that is NOT part of the registry (e.g., editor-specific layout components). This avoids maintaining duplicate copies of every component.

### Theme Registry Items

Each theme is a `registry:theme` item in `registry/themes/`:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "perimeter-api",
  "type": "registry:theme",
  "cssVars": {
    "light": {
      "primary": "oklch(0.45 0.12 250)",
      "primary-foreground": "oklch(0.985 0 0)"
    },
    "dark": {
      "primary": "oklch(0.55 0.12 250)",
      "primary-foreground": "oklch(0.985 0 0)"
    }
  }
}
```

Consumers install themes: `npx shadcn add @perimeter/perimeter-api-theme`

### Consumer Usage

In a consuming project's `components.json`:

```json
{
  "registries": {
    "@perimeter": "https://style.perimeter.church/r/{name}.json"
  }
}
```

Then:
```bash
pnpm dlx shadcn@latest add @perimeter/button
pnpm dlx shadcn@latest add @perimeter/card
pnpm dlx shadcn@latest add @perimeter/perimeter-api-theme
```

---

## Section 4: Editor Foundation

### Route

`/editor` — a client-side page (`'use client'`)

### Layout

Split-pane: control sidebar (left, ~320px) + iframe preview (right, fills remaining space).

### Control Sidebar

Built with the project's own shadcn components (Button, Input, Slider, Label, Select, Tabs, etc.). Sections:

**Colors section:** Color pickers for each semantic token pair:
- primary / primary-foreground
- secondary / secondary-foreground
- success / success-foreground
- warning / warning-foreground
- destructive (error)
- info / info-foreground
- background / foreground
- muted / muted-foreground
- accent / accent-foreground
- border, input, ring

**Layout section:**
- Radius slider (0 — 1.5rem)

**Actions:**
- Light/Dark toggle (switches which mode you're editing)
- Export CSS button (copies `:root` + `.dark` blocks)
- Copy Theme JSON button (copies shadcn `registry:theme` format)

### State Management

Zustand store with localStorage persistence:

```ts
interface EditorState {
  lightTokens: Record<string, string>;
  darkTokens: Record<string, string>;
  activeMode: 'light' | 'dark';
  setToken: (name: string, value: string) => void;
  resetToDefaults: () => void;
}
```

### Preview iframe

A same-origin page served by Next.js (e.g., `/preview/showcase`) that:

1. Includes `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4">` (or a local copy of `@tailwindcss/browser`)
2. Has a `<style type="text/tailwindcss">` block with `@theme inline { ... }` mappings
3. Has `:root { ... }` CSS variables
4. Renders a curated grid of components: Buttons (all variants), Card, Badge, Input, Select, Textarea, Checkbox, Switch, Tabs, Avatar, Alert, Dialog trigger
5. Listens for `postMessage` events from the host:

```ts
window.addEventListener('message', (e) => {
  if (e.data.type === 'UPDATE_TOKENS') {
    const { tokens, mode } = e.data;
    // Update :root or .dark CSS variables
    for (const [name, value] of Object.entries(tokens)) {
      document.documentElement.style.setProperty(`--${name}`, value);
    }
    // Toggle dark class
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }
});
```

The host app sends token updates via:
```ts
iframeRef.current?.contentWindow?.postMessage({
  type: 'UPDATE_TOKENS',
  tokens: currentTokens,
  mode: activeMode,
}, window.location.origin);
```

### Preview Tabs

Multiple preview pages accessible via tabs above the iframe:
- **Showcase** — Grid of all components with various states
- **Forms** — Login form, registration form, settings page
- **Dashboard** — Cards, charts placeholder, table, sidebar

These are separate pages/routes that the iframe navigates between.

---

## Section 5: Cleanup and New CLAUDE.md

### Files to Delete

Everything in the current working tree except `.git/` and `.github/`.

### New CLAUDE.md

```markdown
# CLAUDE.md

## Overview

shadcn-compatible component registry for Perimeter Church. Serves customized
shadcn/ui components, design tokens (warm stone palette), and themes as
registry JSON. Includes a theme editor with live iframe preview.

## Architecture

- **Next.js 15+** app with App Router
- **shadcn registry** — components defined in `registry/`, built to `public/r/` via `shadcn build`
- **Theme editor** at `/editor` — iframe preview + token controls
- **Consumers** install via `npx shadcn add @perimeter/button`

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Build registry JSON + Next.js production build |
| `pnpm registry:build` | Build registry JSON only |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier format |
| `pnpm typecheck` | TypeScript check |
| `pnpm quality` | All checks |

## Critical Rules

- **Always use `pnpm`** — use `pnpm dlx` instead of `npx` for one-off commands
- **Always create a branch** — never commit directly to `dev` or `main`
- **Never push to origin** — pushing is manual
- **Conventional commits** — `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
```

---

## File Impact Summary

### New Files (everything — fresh start)

| Area | Key Files |
|------|-----------|
| Next.js app | `app/layout.tsx`, `app/page.tsx`, `app/editor/page.tsx` |
| Tokens | `styles/globals.css` |
| Registry | `registry.json`, `components.json`, `registry/new-york/ui/*`, `registry/themes/*` |
| Preview | `app/preview/showcase/page.tsx`, `app/preview/forms/page.tsx`, `app/preview/dashboard/page.tsx` |
| Editor | `app/editor/page.tsx`, Zustand store, postMessage integration |
| Config | `package.json`, `next.config.ts`, `tsconfig.json`, `.gitignore`, `CLAUDE.md` |

### Deleted Files

Everything in the current working tree except `.git/` and `.github/`.

---

## Testing Strategy

- **TypeScript** — `pnpm typecheck` catches type errors
- **Lint** — ESLint for code quality
- **Registry build** — `pnpm registry:build` must succeed (validates registry.json schema)
- **Manual testing:**
  - `pnpm dev` — app loads, editor route works
  - Editor: changing a color updates the iframe preview instantly
  - Editor: light/dark toggle switches mode
  - Editor: export CSS produces valid token blocks
  - Registry: `public/r/button.json` returns valid JSON
  - Consumer test: `npx shadcn add` from the registry works in a test project
