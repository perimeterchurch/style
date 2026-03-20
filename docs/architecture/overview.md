# Architecture Overview

## Monorepo Structure

This is a Turborepo workspace with four internal packages that are collected into a single published npm package (`@perimeterchurch/style`).

```
style/
├── packages/
│   ├── tokens/          # Design tokens, CSS variables, Tailwind preset
│   ├── components/      # Primitive + composite UI components
│   ├── motion/          # Framer Motion animation wrappers
│   └── icons/           # Icon system (lucide-react + custom)
├── scripts/
│   └── collect-dist.js  # Collects per-package dist/ into root dist/
├── dist/                # Published package output (gitignored)
├── .storybook/          # Storybook configuration
├── .github/workflows/   # CI/CD (publish.yml, pages.yml)
├── package.json         # Root — published package with entry points
├── turbo.json           # Turborepo task graph
└── pnpm-workspace.yaml  # Workspace: packages/*
```

## How Internal Packages Become One Published Package

Each internal package builds independently via tsup into its own `packages/<name>/dist/` directory. Then the root `pnpm build` command:

1. Runs `turbo build` — builds all four packages in dependency order
2. Runs `node scripts/collect-dist.js` — copies each package's `dist/` into root `dist/`

The collect script maps:

| Source                      | Destination        |
| --------------------------- | ------------------ |
| `packages/tokens/dist/`     | `dist/tokens/`     |
| `packages/components/dist/` | `dist/components/` |
| `packages/motion/dist/`     | `dist/motion/`     |
| `packages/icons/dist/`      | `dist/icons/`      |

The root `package.json` declares `"files": ["dist"]` so only the collected output is published.

## Entry Points

The root `package.json` `exports` field maps published entry points to collected dist files:

| Import path                         | Maps to                              | Contents                               |
| ----------------------------------- | ------------------------------------ | -------------------------------------- |
| `@perimeterchurch/style`            | `dist/tokens/index.js`               | Token utilities, TOKEN_VERSION         |
| `@perimeterchurch/style/components` | `dist/components/index.js`           | All primitive components + utilities   |
| `@perimeterchurch/style/composite`  | `dist/components/composite/index.js` | Complex components (Headless UI)       |
| `@perimeterchurch/style/motion`     | `dist/motion/index.js`               | Framer Motion wrappers                 |
| `@perimeterchurch/style/icons`      | `dist/icons/index.js`                | Icon component + registry              |
| `@perimeterchurch/style/css`        | `dist/tokens/base.css`               | Base CSS (tokens + resets + dark mode) |
| `@perimeterchurch/style/tailwind`   | `dist/tokens/preset.css`             | Tailwind v4 preset (tokens only)       |

## Build Pipeline Per Package

Each package uses `tsup` with ESM + CJS dual output and `.d.ts` generation.

### tokens

```
tsup src/index.ts → dist/index.js, dist/index.cjs, dist/index.d.ts
cp src/*.css dist/        # base.css, preset.css, tokens.css
cp -r src/themes dist/    # themes/light.css, themes/dark.css
```

### components

Two tsup entries:

- `src/index.ts` → `dist/index.js` (primitives + utils)
- `src/composite/index.ts` → `dist/composite/index.js` (composite components)

External: `react`, `react-dom`, `@headlessui/react`

### motion

Single entry: `src/index.ts` → `dist/index.js`

External: `react`, `react-dom`, `framer-motion`

### icons

Single entry: `src/index.ts` → `dist/index.js`

External: `react`, `react-dom`, `lucide-react`

## Turborepo Task Graph

Defined in `turbo.json`:

| Task        | Dependencies           | Outputs   | Cache           |
| ----------- | ---------------------- | --------- | --------------- |
| `build`     | `^build` (topological) | `dist/**` | Yes             |
| `test`      | `^build`               | —         | Yes             |
| `lint`      | —                      | —         | Yes             |
| `typecheck` | —                      | —         | Yes             |
| `dev`       | —                      | —         | No (persistent) |

## Root Commands

| Command                | What it does                                       |
| ---------------------- | -------------------------------------------------- |
| `pnpm dev`             | Start Storybook on port 6006                       |
| `pnpm build`           | `turbo build` + `collect-dist.js`                  |
| `pnpm test`            | Run all tests via Turborepo                        |
| `pnpm lint`            | ESLint across all packages                         |
| `pnpm typecheck`       | TypeScript checking across all packages            |
| `pnpm format`          | Prettier format all files                          |
| `pnpm format:check`    | Prettier check (CI mode)                           |
| `pnpm quality`         | All checks: typecheck + lint + format:check + test |
| `pnpm storybook:build` | Static Storybook build                             |
