# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Shared design system for Perimeter Church. Published as `@perimeterchurch/style` to GitHub Packages. Internal Turborepo monorepo that publishes as a single package with multiple entry points.

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start Storybook with live editing |
| `pnpm build` | Build all packages to `dist/` |
| `pnpm test` | Run all tests via Turborepo |
| `pnpm lint` | ESLint across all packages |
| `pnpm format` | Prettier format all files |
| `pnpm format:check` | Prettier check (CI) |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm quality` | All checks (typecheck + lint + format:check + test) |
| `pnpm storybook:build` | Static Storybook build for GitHub Pages |

## Architecture

### Internal Monorepo → Single Published Package

| Internal Package | Published Entry Point | Contents |
| --- | --- | --- |
| `packages/tokens/` | `@perimeterchurch/style` | Design tokens, CSS variables, Tailwind preset |
| `packages/components/` | `@perimeterchurch/style/components` | Primitive UI components |
| `packages/components/` | `@perimeterchurch/style/composite` | Complex components (headless UI) |
| `packages/motion/` | `@perimeterchurch/style/motion` | Framer Motion animation wrappers |
| `packages/icons/` | `@perimeterchurch/style/icons` | Icon system (lucide-react + custom) |
| — | `@perimeterchurch/style/css` | Base CSS (tokens + resets) |
| — | `@perimeterchurch/style/tailwind` | Tailwind v4 preset CSS |

### Component Architecture

- **Dual API**: Simple props-driven + compound escape hatch (Button, Card, Input, Select, ComboSelect, Tabs)
- **Variant files**: Each component has a `.variants.ts` with `VariantDefinition` records — the single source of truth for styling
- **Token-driven**: Components use CSS custom properties via `bg-[var(--color-primary)]` for runtime overrideability
- **Two-layer tokens**: Build-time `@theme` block for Tailwind utilities + runtime `:root` CSS variables

### Peer Dependencies by Entry Point

| Entry Point | Required Peer Deps |
| --- | --- |
| `@perimeterchurch/style/components` | `react@^19` |
| `@perimeterchurch/style/composite` | `react@^19`, `@headlessui/react@^2` |
| `@perimeterchurch/style/motion` | `react@^19`, `framer-motion@^11` |
| `@perimeterchurch/style/icons` | `react@^19`, `lucide-react@^0.400` |

## Critical Rules

- **Always use `pnpm`** — never npm or npx
- **Always create a branch** — never commit directly to `dev` or `main`
- **Never push to origin** — pushing is a manual task performed by the developer
- **Conventional commits:** `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`
- **Use `--body-file` for PR bodies** — avoids ANSI escape code injection
- **Read docs before code** — check `docs/` for architecture and guides before modifying

## Context Loading

| Working on... | Load first |
| --- | --- |
| Monorepo structure or build | `docs/architecture/overview.md` |
| Design tokens or CSS variables | `docs/architecture/tokens.md` |
| Themes (light/dark/named) | `docs/architecture/theming.md` |
| Component architecture | `docs/architecture/components.md` |
| Icon system | `docs/architecture/icons.md` |
| Creating a new component | `docs/guides/adding-a-component.md` |
| Adding a variant | `docs/guides/adding-a-variant.md` |
| Creating a new theme | `docs/guides/adding-a-theme.md` |
| Adding an icon | `docs/guides/adding-an-icon.md` |
| Component implementation patterns | `docs/guides/component-patterns.md` |
| Writing or fixing tests | `docs/guides/testing.md` |
| CI/CD or publishing | `docs/guides/publishing.md` |
| Using this package in another project | `docs/guides/consuming.md` |
| Token names and values | `docs/reference/design-tokens.md` |
| Component props and APIs | `docs/reference/component-catalog.md` |
| Variant file structure | `docs/reference/variant-api.md` |
| Unknown area | `docs/README.md` |

## Worktrees

Use `.worktrees/` (project-local, hidden) for isolated development branches. This directory is gitignored.
