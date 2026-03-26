# Component Showcase Site — Design Spec

## Overview

Pivot the style project from a theme editor to a component showcase site. The site displays all 55 registry components with interactive playgrounds, static examples, copyable code, and theme switching. Actual theme customization happens through code — the site is for browsing, reference, and inspiration.

**Primary audience:** Internal devs (perimeter-api, metrics, perimeter-widgets teams), with enough polish for external consumers.

## Site Architecture & Routes

```
/                                    → Landing page (hero, quick-start, featured components)
/docs/getting-started                → Installation, theming, usage guide
/components                          → Hub page: all 55 components in category grid
/components/[category]               → Category hub (e.g., /components/actions)
/components/[category]/[slug]        → Component page (playground + examples + code)
/templates                           → Template gallery: full-page compositions
/templates/[slug]                    → Individual template (live preview + code)
/tokens                              → Token reference (grid/table + usage context)
```

## Navigation

### Top Nav

Persistent across all pages:

- Logo + version
- Section links: Components, Templates, Tokens, Getting Started
- Cmd+K search bar (fuzzy match components, templates, tokens)
- Theme switcher dropdown (reads from `registry/themes/`)
- Light/dark mode toggle

### Sidebar

Persistent on `/components/*` and `/docs/*` routes. Collapsible categories with component links. Active item highlighted. Clicking a category heading navigates to the category hub page.

### Cmd+K Search

Built with the existing `cmdk` dependency (already installed for the Command registry component). Search index built at build time from demo file `meta` exports. Results grouped by type: Components, Templates, Tokens.

## Registry Restructure

Move components from `registry/new-york/ui/` to `registry/ui/perimeter/`:

```
registry/
  ui/
    perimeter/
      button.tsx            ← component source (moved)
      button.demo.tsx       ← demo file (new)
      card.tsx
      card.demo.tsx
      ...all 55 components
  themes/
    default.json            ← base warm stone palette, light + dark (new)
    perimeter-api.json      ← project overrides (existing)
    metrics.json            ← project overrides (existing)
```

Update `components.json` and `scripts/generate-registry.ts` to point at the new path. `shadcn build` must ignore `*.demo.tsx` files.

`registry/base.json` (the `registry:base` meta-item for one-command install) is kept and updated to reference the new path. Its `cssVars` should be derived from `registry/themes/default.json` at build time to stay in sync.

## Demo File Format

Each component gets a co-located `*.demo.tsx` file that drives its showcase page:

```typescript
// registry/ui/perimeter/button.demo.tsx

import { Button } from "./button"

export const meta = {
  name: "Button",
  description: "Displays a button or a component that looks like a button.",
  category: "actions",
  install: "pnpm dlx shadcn@latest add @perimeter/button",
}

export const controls = {
  variant: {
    type: "enum",
    options: ["default", "secondary", "outline", "ghost", "link", "destructive"],
    default: "default",
  },
  size: {
    type: "enum",
    options: ["sm", "default", "lg", "icon"],
    default: "default",
  },
  children: {
    type: "string",
    default: "Click me",
  },
  disabled: {
    type: "boolean",
    default: false,
  },
} satisfies ControlsConfig

export function Playground(props: PlaygroundProps<typeof controls>) {
  return <Button {...props}>{props.children}</Button>
}

export const examples = [
  {
    name: "All Variants",
    render: () => (
      <div className="flex gap-2 flex-wrap">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    ),
  },
  {
    name: "With Icons",
    render: () => (
      <div className="flex gap-2">
        <Button><Mail className="mr-2 h-4 w-4" /> Login with Email</Button>
        <Button variant="outline"><ChevronLeft className="mr-2 h-4 w-4" /> Back</Button>
      </div>
    ),
  },
  {
    name: "Loading",
    render: () => (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
      </Button>
    ),
  },
]
```

### What each export provides

- **`meta`** — drives sidebar, hub pages, breadcrumbs, search index, and install command
- **`controls`** — declarative prop description. The site renders the right input type: segmented buttons for enums, toggles for booleans, text inputs for strings, number inputs for numerics
- **`Playground`** — live component receiving current control values as props
- **`examples`** — static scenarios rendered below the playground, each with auto-extracted source code for "Copy code". Source code is captured at build time by reading the raw file and extracting each example's `render` function body as a string, stored alongside the compiled component.

### Type infrastructure

`src/lib/demo-types.ts` defines `ControlsConfig` and `PlaygroundProps<T>`. These live in app source (not the registry directory) so they are excluded from `shadcn build` automatically:

- `ControlsConfig` — maps prop names to control descriptors (`{ type: "enum" | "boolean" | "string" | "number", ... }`)
- `PlaygroundProps<T>` — infers prop types from a controls config so the Playground component is type-safe

Demo files import as `import type { ControlsConfig, PlaygroundProps } from "@/lib/demo-types"`.

## Component Categories

Categories are discovered at build time from `meta.category` across all demo files.

| Category | Components |
|----------|-----------|
| Actions (7) | button, button-group, toggle, toggle-group, dropdown-menu, context-menu, menubar |
| Forms (14) | input, input-group, input-otp, textarea, select, native-select, checkbox, radio-group, switch, slider, combobox, calendar, field, label |
| Data Display (9) | card, table, badge, avatar, chart, carousel, progress, skeleton, empty |
| Feedback (9) | alert, alert-dialog, dialog, drawer, sheet, sonner, tooltip, hover-card, popover |
| Navigation (6) | breadcrumb, command, navigation-menu, pagination, tabs, sidebar |
| Layout (7) | accordion, collapsible, resizable, scroll-area, separator, aspect-ratio, direction |
| Misc (3) | kbd, spinner, item |

## Component Page Layout

Each component page (`/components/[category]/[slug]`) renders:

1. **Breadcrumb** — Category → Component name
2. **Title + description** — from `meta`
3. **Interactive playground** — Preview | Code tabs
   - Preview: live component with current control values
   - Code: auto-generated usage snippet reflecting current controls
   - Controls panel below: Storybook-style inputs derived from `controls` export
4. **Static examples** — each named scenario with live render + copyable source code
5. **Installation** — shadcn CLI command from `meta.install`

## Category Hub Pages

`/components/[category]` shows all components in that category as a card grid. Each card:

- Component name
- One-line description
- Small live preview with default props
- Click through to full component page

`/components` (no category) shows all categories with their component counts, linking to category hubs.

## Templates Section

### Structure

```
src/templates/
  dashboard.tsx
  settings.tsx
  login.tsx
  data-table.tsx
  marketing-landing.tsx
```

### Template file format

```typescript
export const meta = {
  name: "Dashboard",
  description: "Admin dashboard with sidebar navigation, stats cards, and charts.",
  components: ["sidebar", "card", "chart", "tabs", "avatar", "dropdown-menu"],
}

export default function DashboardTemplate() {
  return (/* full-page composition */)
}
```

### Template gallery page

`/templates` shows cards with name, description, list of components used, and a scaled-down live render of the template as the card preview (rendered inline at reduced scale via CSS `transform: scale()`, not screenshots).

### Individual template page

- Full-width live preview (respects current theme + light/dark)
- Toggle between preview and source code
- List of components used, each linking to its component page
- Bulk install command for all required components

### Initial templates

| Template | Components Used |
|----------|----------------|
| Dashboard | sidebar, card, chart, tabs, avatar, dropdown-menu, breadcrumb |
| Settings Page | tabs, card, input, select, switch, label, button, separator |
| Login / Auth | card, input, label, button, checkbox, separator |
| Data Table | table, input, dropdown-menu, badge, pagination, button |
| Marketing Landing | card, button, badge, navigation-menu, accordion |

App-specific templates added later as consuming projects migrate.

## Theme System

### Build time

`scripts/generate-theme-css.ts` scans `registry/themes/*.json` and generates `src/styles/themes.css`. This script runs as part of `pnpm build` (before Next.js build) and `pnpm dev` (watched). It outputs a single CSS file:

```css
/* From default.json */
:root { --primary: oklch(0.55 0.08 45); /* ... all tokens */ }
.dark { --primary: oklch(0.85 0.06 45); /* ... */ }

/* From perimeter-api.json — overrides only */
[data-theme="perimeter-api"] { --primary: oklch(0.50 0.10 220); /* ... */ }
[data-theme="perimeter-api"].dark { /* ... */ }

/* From metrics.json — overrides only */
[data-theme="metrics"] { /* ... */ }
[data-theme="metrics"].dark { /* ... */ }
```

### Runtime

- Lightweight React context provider (no Zustand, no persistence) with two values: `theme` (string) and `mode` ("light" | "dark")
- Theme switching sets `data-theme` attribute on `<html>`
- Light/dark toggles the `dark` class on `<html>`
- All components respond instantly via CSS variable inheritance

### Theme files

- `default.json` — full warm stone palette with all light and dark tokens. This is the base. Values moved from `src/lib/default-tokens.ts` and `src/app/globals.css`
- `perimeter-api.json` — overrides only, inherits everything else from default
- `metrics.json` — overrides only
- New themes: add a JSON file to `registry/themes/`, rebuild, it appears in the switcher

### What globals.css becomes

Stripped to Tailwind imports and base resets only. No token values — those come from the generated theme CSS.

## Token Reference Page

`/tokens` with a Grid | Table view toggle:

### Grid view (default)

- Tokens grouped by category (Primary, Secondary, Background, Muted, etc.)
- Each token: color swatch, CSS variable name, OKLCH value, click to copy
- Light and dark swatches side-by-side per token
- "Used by" section per group listing which components reference those tokens, with links. This mapping is manually maintained in a `src/lib/token-usage.ts` file — static analysis of component CSS usage is fragile and not worth automating

### Table view

- Sortable, filterable table
- Columns: Token Name, CSS Variable, Light Value, Dark Value, Preview swatch
- Filter by category or search by name
- Click any row to copy CSS variable

### Both views

- Respect current theme from top nav switcher
- Usage context links to component pages
- Non-color tokens (border-radius, sidebar width) get their own section with visual previews

## Site UI Components

The showcase site needs its own UI components (sidebar, nav, search palette, code blocks, etc.). These live in `src/components/ui/` — the existing app-local shadcn directory. They import from `@/components/ui/` (the path alias), not from the registry directory.

Registry components (`registry/ui/perimeter/`) are used in demo Playground and example renders. Site chrome uses `src/components/ui/`. These are separate concerns — the registry is what consumers install, `src/components/ui/` is what the site uses to present them.

## What Gets Deleted

- `src/lib/editor-store.ts`
- `src/lib/theme-manager-store.ts`
- `src/lib/export-theme.ts`
- `src/lib/default-tokens.ts`
- `src/components/editor/` (entire directory)
- `src/components/preview/` (entire directory)
- `src/app/editor/` (route removed)
- `zustand` dependency from `package.json`
- `storybook-static/` directory
- `registry/new-york/` (after moving components to `registry/ui/perimeter/`)

## What Gets Kept

- `registry/ui/perimeter/` — all 55 component source files (moved from `registry/new-york/ui/`)
- `registry/base.json` — meta-item for one-command install (updated for new path)
- `registry/themes/` — theme JSON files
- `src/app/globals.css` — Tailwind imports and base resets (token values removed)
- `src/components/ui/` — app-local shadcn components for site chrome
- `components.json` — updated to new registry path
- `scripts/generate-registry.ts` — updated for new path
- All existing dependencies except `zustand`

## New Dependencies

None anticipated. The site uses:
- Next.js (existing) for routing and SSR/SSG
- `cmdk` (existing) for search
- Tailwind CSS v4 (existing) for styling
- The registry components themselves for previews
