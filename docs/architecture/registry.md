# Registry Architecture

## Overview

The project is a shadcn-compatible component registry. It serves customized shadcn/ui components as JSON that the shadcn CLI can install into consuming projects. Components are source code, not compiled packages — consumers get `.tsx` files they own and can modify.

## How It Works

```
registry/new-york/ui/*.tsx    ←  Component source files (single source of truth)
        ↓
scripts/generate-registry.ts  ←  Scans source, generates registry.json with items
        ↓
registry.json                 ←  Manifest listing all components, deps, files
        ↓
shadcn build                  ←  Reads manifest, embeds source into JSON
        ↓
public/r/*.json               ←  One JSON file per component (served as static files)
        ↓
Consumer: pnpm dlx shadcn add @perimeter/button
        ↓
CLI fetches JSON, rewrites imports, writes .tsx to consumer's project
```

## Registry Manifest

`registry.json` at the project root defines every item:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "perimeter",
  "homepage": "https://style.perimeter.church",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "files": [
        { "path": "registry/new-york/ui/button.tsx", "type": "registry:ui" }
      ],
      "dependencies": ["@radix-ui/react-slot", "class-variance-authority"],
      "registryDependencies": ["utils"]
    }
  ]
}
```

Items are NOT auto-discovered. Run `pnpm tsx scripts/generate-registry.ts` to regenerate the manifest from source files.

## Item Types

| Type             | Purpose               | Location                   |
| ---------------- | --------------------- | -------------------------- |
| `registry:ui`    | UI components         | `registry/new-york/ui/`    |
| `registry:lib`   | Utilities (cn, etc.)  | `registry/new-york/lib/`   |
| `registry:hook`  | React hooks           | `registry/new-york/hooks/` |
| `registry:theme` | Theme token overrides | `registry/themes/`         |

## Build Pipeline

```bash
pnpm registry:build          # Runs: generate-registry.ts → shadcn build
pnpm build                   # Runs: registry:build → next build
```

Output lands in `public/r/` (gitignored). Each component gets a JSON file containing the full source code as an embedded string.

## Consumer Setup

In the consuming project's `components.json`:

```json
{
  "registries": {
    "@perimeter": "https://style.perimeter.church/r/{name}.json"
  }
}
```

Install components:

```bash
pnpm dlx shadcn@latest add @perimeter/button
pnpm dlx shadcn@latest add @perimeter/card
```

The CLI fetches the JSON, rewrites import paths to match the consumer's aliases, and installs npm dependencies automatically.

## Component Source

Components live in `registry/new-york/ui/` — this is the single source of truth. The `src/components/ui/` directory contains copies for the app's own use (editor, landing page). When customizing a component, edit the registry source and re-run `pnpm registry:build`.

## Theme Items

Themes are `registry:theme` items defined in `registry/themes/*.json`. They contain CSS variable overrides for light and dark modes:

```json
{
  "name": "perimeter-api-theme",
  "type": "registry:theme",
  "cssVars": {
    "light": { "primary": "oklch(0.45 0.12 250)" },
    "dark": { "primary": "oklch(0.55 0.12 250)" }
  }
}
```

Consumers install: `pnpm dlx shadcn@latest add @perimeter/perimeter-api-theme`
