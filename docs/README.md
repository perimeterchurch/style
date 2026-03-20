# @perimeterchurch/style Documentation

This directory is the primary context source for Claude Code when working in this repository. Every doc is written as executable instructions — step-by-step procedures with exact file paths, templates, and commands.

## Architecture

| Document | When to read |
| --- | --- |
| [architecture/overview.md](architecture/overview.md) | Monorepo structure, build pipeline, entry points |
| [architecture/tokens.md](architecture/tokens.md) | Design tokens, CSS variables, two-layer system |
| [architecture/theming.md](architecture/theming.md) | Light/dark themes, named themes, data-theme scoping |
| [architecture/components.md](architecture/components.md) | Dual API pattern, variant files, component structure |
| [architecture/icons.md](architecture/icons.md) | Icon registry, lucide-react wrapping, custom SVGs |

## Guides

| Document | When to read |
| --- | --- |
| [guides/adding-a-component.md](guides/adding-a-component.md) | Creating a new component from scratch |
| [guides/adding-a-variant.md](guides/adding-a-variant.md) | Adding a variant to an existing component |
| [guides/adding-a-theme.md](guides/adding-a-theme.md) | Creating a new named theme |
| [guides/adding-an-icon.md](guides/adding-an-icon.md) | Registering a lucide icon or custom SVG |
| [guides/component-patterns.md](guides/component-patterns.md) | Simple vs compound API, Object.assign, React context |
| [guides/testing.md](guides/testing.md) | Vitest setup, test templates, running tests |
| [guides/publishing.md](guides/publishing.md) | CI/CD pipeline, version bumps, GITHUB_TOKEN |
| [guides/consuming.md](guides/consuming.md) | Installing, importing, Tailwind preset, theme overrides |

## Reference

| Document | When to read |
| --- | --- |
| [reference/design-tokens.md](reference/design-tokens.md) | Every CSS variable name, default value, category |
| [reference/component-catalog.md](reference/component-catalog.md) | Every component: props, variants, sizes, entry point |
| [reference/variant-api.md](reference/variant-api.md) | VariantDefinition, SizeDefinition, resolveVariant |
