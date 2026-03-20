# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Shared design system for Perimeter Church. Published as `@perimeterchurch/style` to GitHub Packages. Internal Turborepo monorepo that publishes as a single package with multiple entry points.

## Commands

| Command                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `pnpm dev`             | Start Storybook with live editing                   |
| `pnpm build`           | Build all packages to `dist/`                       |
| `pnpm test`            | Run all tests via Turborepo                         |
| `pnpm lint`            | ESLint across all packages                          |
| `pnpm format`          | Prettier format all files                           |
| `pnpm format:check`    | Prettier check (CI)                                 |
| `pnpm typecheck`       | TypeScript type checking                            |
| `pnpm quality`         | All checks (typecheck + lint + format:check + test) |
| `pnpm storybook:build` | Static Storybook build for GitHub Pages             |

## Architecture

### Internal Monorepo → Single Published Package

| Internal Package       | Published Entry Point               | Contents                                      |
| ---------------------- | ----------------------------------- | --------------------------------------------- |
| `packages/tokens/`     | `@perimeterchurch/style`            | Design tokens, CSS variables, Tailwind preset |
| `packages/components/` | `@perimeterchurch/style/components` | Primitive UI components                       |
| `packages/components/` | `@perimeterchurch/style/composite`  | Complex components (headless UI)              |
| `packages/motion/`     | `@perimeterchurch/style/motion`     | Framer Motion animation wrappers              |
| `packages/icons/`      | `@perimeterchurch/style/icons`      | Icon system (lucide-react + custom)           |
| —                      | `@perimeterchurch/style/css`        | Base CSS (tokens + resets)                    |
| —                      | `@perimeterchurch/style/tailwind`   | Tailwind v4 preset CSS                        |

### Component Architecture

- **Dual API**: Simple props-driven + compound escape hatch (Button, Card, Input, Select, ComboSelect, Tabs)
- **Variant files**: Each component has a `.variants.ts` with `VariantDefinition` records — the single source of truth for styling
- **Token-driven**: Components use CSS custom properties via `bg-[var(--color-primary)]` for runtime overrideability
- **Two-layer tokens**: Build-time `@theme` block for Tailwind utilities + runtime `:root` CSS variables

### Peer Dependencies by Entry Point

| Entry Point                         | Required Peer Deps                  |
| ----------------------------------- | ----------------------------------- |
| `@perimeterchurch/style/components` | `react@^19`                         |
| `@perimeterchurch/style/composite`  | `react@^19`, `@headlessui/react@^2` |
| `@perimeterchurch/style/motion`     | `react@^19`, `framer-motion@^11`    |
| `@perimeterchurch/style/icons`      | `react@^19`, `lucide-react@^0.400`  |

## Critical Rules

- **Always use `pnpm`** — never npm or npx
- **Always create a branch** — never commit directly to `dev` or `main`
- **Never push to origin** — pushing is a manual task performed by the developer
- **Conventional commits:** `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`
- **Use `--body-file` for PR bodies** — avoids ANSI escape code injection
- **Read docs before code** — check `docs/` for architecture and guides before modifying

## Context Loading

| Working on...                         | Load first                            |
| ------------------------------------- | ------------------------------------- |
| Monorepo structure or build           | `docs/architecture/overview.md`       |
| Design tokens or CSS variables        | `docs/architecture/tokens.md`         |
| Themes (light/dark/named)             | `docs/architecture/theming.md`        |
| Component architecture                | `docs/architecture/components.md`     |
| Icon system                           | `docs/architecture/icons.md`          |
| Creating a new component              | `docs/guides/adding-a-component.md`   |
| Adding a variant                      | `docs/guides/adding-a-variant.md`     |
| Creating a new theme                  | `docs/guides/adding-a-theme.md`       |
| Adding an icon                        | `docs/guides/adding-an-icon.md`       |
| Component implementation patterns     | `docs/guides/component-patterns.md`   |
| Writing or fixing tests               | `docs/guides/testing.md`              |
| CI/CD or publishing                   | `docs/guides/publishing.md`           |
| Using this package in another project | `docs/guides/consuming.md`            |
| Token names and values                | `docs/reference/design-tokens.md`     |
| Component props and APIs              | `docs/reference/component-catalog.md` |
| Variant file structure                | `docs/reference/variant-api.md`       |
| Unknown area                          | `docs/README.md`                      |

## Code Philosophy

Code should be self documenting. How you split logic into functions and shape the data they pass around determines how well a codebase holds up over time.

### Semantic Functions

Semantic functions are the building blocks of any codebase, a good semantic function should be as minimal as possible in order to prioritize correctness in it. A semantic function should take in all required inputs to complete its goal and return all necessary outputs directly. Semantic functions can wrap other semantic functions to describe desired flows and usage; as the building blocks of the codebase, if there are complex flows used everywhere that are well defined, use a semantic function to codify them.

Side effects are generally undesirable in semantic functions unless they are the explicit goal because semantic functions should be safe to re-use without understanding their internals for what they say they do. If logic is complicated and it's not clear what it does in a large flow, a good pattern is to break that flow up into a series of self describing semantic functions that take in what they need, return the data necessary for the next step, and don't do anything else. Examples of good semantic functions range from quadratic_formula() to retry_with_exponential_backoff_and_run_y_in_between<Y: func, X: Func>(x: X, y: Y). Even if these functions are never used again, future humans and agents going over the code will appreciate the indexing of information.

Semantic functions should not need any comments around them, the code itself should be a self describing definition of what it does. Semantic functions should ideally be extremely unit testable because a good semantic function is a well defined one.

### Pragmatic Functions

Pragmatic functions should be used as wrappers around a series of semantic functions and unique logic. They are the complex processes of your codebase. When making production systems it's natural for the logic to get messy, pragmatic functions are the organization for these. These should generally not be used in more than a few places, if they are, consider breaking down the explicit logic and moving it into semantic functions. For example provision_new_workspace_for_github_repo(repo, user) or handle_user_signup_webhook(). Testing pragmatic functions falls into the realm of integration testing, and is often done within the context of testing whole app functionality. Pragmatic functions are expected to change completely over time, from their insides to what they do. To help with that, it's good to have doc comments above them. Avoid restating the function name or obvious traits about it, instead note unexpected things like "fails early on balance less than 10", or combatting other misconceptions coming from the function name. As a reader of doc comments take them with a grain of salt, coders working inside the function may have forgotten to update them, and it's good to fact check them when you think they might be incorrect.

### Models

The shape of your data should make wrong states impossible. If a model allows a combination of fields that should never exist together in practice, the model isn't doing its job. Every optional field is a question the rest of the codebase has to answer every time it touches that data, and every loosely typed field is an invitation for callers to pass something that looks right but isn't. When models enforce correctness, bugs surface at the point of construction rather than deep inside some unrelated flow where the assumptions finally collapse. A model's name should be precise enough that you can look at any field and know whether it belongs — if the name doesn't tell you, the model is trying to be too many things. When two concepts are often needed together but are independent, compose them rather than merging them — e.g. UserAndWorkspace { user: User, workspace: Workspace } keeps both models intact instead of flattening workspace fields into the user. Good names like UnverifiedEmail, PendingInvite, and BillingAddress tell you exactly what fields belong. If you see a phone_number field on BillingAddress, you know something went wrong.

Values with identical shapes can represent completely different domain concepts: { id: "123" } might be a DocumentReference in one place and a MessagePointer in another, and if your functions just accept { id: String }, the code will accept either one without complaint. Brand types solve this by wrapping a primitive in a distinct type so the compiler treats them as separate: DocumentId(UUID) instead of a bare UUID. With branding in place, accidentally swapping two IDs becomes a syntax error instead of a silent bug that surfaces three layers deep.

### Where Things Break

Breaks commonly happen when a semantic function morphs into a pragmatic function for ease, and then other places in the codebase that rely on it end up doing things they didn't intend. To solve this, be explicit when creating a function by naming it instead of by what it does, but by where it's used. The nature of their names should make it clear to other programmers in their names that their behavior is not tightly defined and should not be relied on for the internals to do an exact task, and make debugging regressions from them easier.

Models break the same way but slower. They start focused, then someone adds "just one more" optional field because it's easier than creating a new model, and then someone else does the same, and eventually the model is a loose bag of half-related data where every consumer has to guess which fields are actually set and why. The name stops describing what the data is, the fields stop cohering around a single concept, and every new feature that touches the model has to navigate states it was never designed to represent. When a model's fields no longer cohere around its name, that's the signal to split it into the distinct things it's been coupling together.

## Worktrees

Use `.worktrees/` (project-local, hidden) for isolated development branches. This directory is gitignored.
