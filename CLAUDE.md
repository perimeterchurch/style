# CLAUDE.md

shadcn-compatible component registry and showcase site for Perimeter Church. 55 components with interactive playgrounds, 5 page templates, token reference, and theme switching. Next.js static export deployed on Vercel.

## Commands

| Command                | Description                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| `pnpm dev`             | Start Next.js dev server (webpack — Turbopack not supported)     |
| `pnpm build`           | Generate themes + collect demos + build registry + Next.js build |
| `pnpm registry:build`  | Build registry JSON only (shadcn build)                          |
| `pnpm generate:themes` | Inject theme CSS into globals.css from `registry/themes/*.json`  |
| `pnpm collect:demos`   | Collect demo manifests and generate import map                   |
| `pnpm lint`            | Run ESLint                                                       |
| `pnpm format`          | Format with Prettier                                             |
| `pnpm format:check`    | Check formatting                                                 |
| `pnpm typecheck`       | TypeScript type checking                                         |
| `pnpm test`            | Run tests (none yet)                                             |
| `pnpm quality`         | Run all checks (typecheck + lint + format:check)                 |

## Architecture

- **Registry**: 55 shadcn components in `registry/ui/perimeter/`, built to `public/r/` via `shadcn build`
- **Showcase**: Component pages with interactive prop playgrounds, Shiki-highlighted code, and theme switching
- **Consumers**: Install via `pnpm dlx shadcn@latest add @perimeter/button`
- **Tokens**: Warm stone palette in OKLCH format, light + dark + project-specific themes in `registry/themes/`
- **Theme System**: JSON theme files → build-time CSS injection into globals.css → CSS variable inheritance

### Key Directories

| Directory                          | Purpose                                                        |
| ---------------------------------- | -------------------------------------------------------------- |
| `registry/ui/perimeter/`           | Component source (SINGLE SOURCE OF TRUTH)                      |
| `registry/ui/perimeter/*.demo.tsx` | Component demos with controls, examples, and meta              |
| `registry/themes/`                 | Theme definitions (default, perimeter-api, metrics)            |
| `src/app/`                         | Next.js routes (components, templates, tokens, docs)           |
| `src/templates/`                   | Full-page template compositions (dashboard, settings, etc.)    |
| `src/components/site/`             | Site chrome (top nav, sidebar, search, playground, code block) |
| `src/components/ui/`               | shadcn components for app use (NOT the registry source)        |
| `src/lib/demo-types.ts`            | Shared types (ManifestEntry, ControlsConfig, PlaygroundProps)  |
| `src/lib/highlight.ts`             | Server-side Shiki highlighting (vitesse themes)                |
| `src/lib/highlight-client.ts`      | Client-side Shiki highlighting for live code updates           |
| `scripts/`                         | Build and generation scripts                                   |
| `public/r/`                        | Built registry JSON (generated, gitignored)                    |

### Theme System

Theme files in `registry/themes/` are compiled to CSS at build time by `scripts/generate-theme-css.ts`, which injects tokens directly into `src/app/globals.css` between `@generated-themes-start` / `@generated-themes-end` markers. All components respond to theme changes via CSS variable inheritance.

- `default.json` — base warm stone palette (emitted as `:root` / `.dark`)
- Project themes (perimeter-api, metrics) — overrides only (emitted as `[data-theme="slug"]`)
- Runtime switching via `data-theme` attribute + `.dark` class on `<html>`

### Build Pipeline

```
pnpm build
  → pnpm registry:build     (shadcn build → public/r/)
  → pnpm generate:themes    (inject CSS vars into globals.css)
  → pnpm collect:demos      (generate manifest + import map)
  → next build              (static export, deployed on Vercel)
```

### Dev Server

`pnpm dev` uses `--webpack` because Turbopack hangs when tracing 55 dynamic demo imports. The webpack dev server compiles pages lazily on navigation.

## Context Loading (MANDATORY)

**Always read the relevant doc BEFORE searching the codebase or writing code.**

| Working on...       | Read first                                                   |
| ------------------- | ------------------------------------------------------------ |
| Unknown area        | `docs/README.md` (full index)                                |
| Registry components | `registry/ui/perimeter/`                                     |
| Demo files          | `registry/ui/perimeter/*.demo.tsx`, `src/lib/demo-types.ts`  |
| Templates           | `src/templates/`, `src/app/templates/`                       |
| Theme tokens        | `registry/themes/default.json`, `src/app/globals.css`        |
| Theme generation    | `scripts/generate-theme-css.ts`, `registry/themes/`          |
| Registry build      | `scripts/generate-registry.ts`, `registry.json`              |
| Site navigation     | `src/components/site/`                                       |
| Site layout         | `src/app/layout.tsx`, `src/components/site/`                 |
| Code blocks         | `src/components/site/code-block.tsx`, `src/lib/highlight.ts` |

## Critical Rules

### Project-Specific

- **`registry/ui/perimeter/` is the single source of truth for components** — never edit built output in `public/r/`
- **Always run `pnpm registry:build` after modifying registry items** — the built JSON in `public/r/` must stay in sync
- **Demo files must use `() => (...)` syntax for render functions** — the source extraction utility (`src/lib/extract-source.ts`) relies on balanced parenthesis counting
- **No `.env` needed** — this is a static site with no secrets, deployed on Vercel. Theme list is discovered at build time via `readdirSync` in `src/app/layout.tsx`
- **Update CHANGELOG.md for user-facing changes** — when modifying components, themes, templates, or the showcase site, add an entry under the `[Unreleased]` section in `CHANGELOG.md`
- **Generated files are gitignored** — `src/lib/demo-manifest.json`, `src/lib/demo-imports.ts`, and `registry.json` are build outputs. Run `pnpm collect:demos` and `pnpm registry:build` to regenerate

### Cross-Project

- **Always use `pnpm`** — never npm or npx. Use `pnpm dlx` instead of `npx`
- **Always create a branch** — never commit directly to `dev` or `main`
- **Never push to origin** — pushing is a manual task performed by the developer
- **Run `pnpm quality` before merging** — the branch must pass all checks before it's eligible for merge
- **Always fix formatting in files you touched** — run `pnpm prettier --write` on affected files. Flag pre-existing issues in untouched files without fixing them
- **Conventional commits:** `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`
- **Use `--body-file` for PR bodies** — `gh pr create --body` and `gh pr edit --body` inject ANSI escape codes. Write the body file using the Write tool, then pass it with `--body-file`
- **Read docs before code** — always read the relevant `docs/` file before searching or modifying an area of the codebase
- **Update docs when changing code** — if you changed behavior that a doc describes, the doc must be updated in the same commit
- **Always verify, never assume** — when uncertain about external API behavior, library usage, or domain logic, research first using web search, Context7 MCP, or project docs
- **Never add eslint-disable comments** — fix the underlying code instead of suppressing warnings
- **Never use `any` in production code** — use proper types, generics, or `unknown` instead. Test files are exempt

## Code Philosophy

Code should be self-documenting. How you split logic into functions and shape the data they pass around determines how well a codebase holds up over time.

### Keep It Simple (YAGNI)

Write the simplest code that solves the current problem. Do not build for hypothetical future requirements.

- **No premature abstractions** — three similar lines of code is better than a utility function used once. Extract only when a pattern repeats and the abstraction is obvious
- **No speculative generality** — don't add config options, feature flags, or extension points "in case we need them later"
- **Prefer deletion over deprecation** — if something is unused, remove it. Don't leave commented-out code or backwards-compatibility shims
- **Complexity is a cost** — every abstraction, indirection, and configuration option is maintenance burden

### Semantic Functions

The building blocks of the codebase. A semantic function should be **minimal, pure, and self-describing**:

- **All inputs in, all outputs out** — take everything needed as parameters, return results directly. No hidden state or side effects (unless the side effect is the explicit goal)
- **Safe to reuse without reading internals** — callers should trust the name and signature, not the implementation
- **No comments needed** — the code itself is the documentation. If you need a comment, the function name or structure isn't clear enough
- **Composable** — semantic functions can wrap other semantic functions to describe complex flows. Even if a wrapper is only used once, it indexes the logic for future readers
- **Naturally unit-testable** — if it's hard to test, it's probably doing too much

Examples: `quadraticFormula()`, `retryWithExponentialBackoff<T>(action: () => T, betweenRetries: () => void)`

### Pragmatic Functions

Wrappers around semantic functions and unique logic — the complex processes of the codebase:

- **Used in few places** — if a pragmatic function is used widely, break its logic into semantic functions
- **Expected to change** — their insides and behavior will evolve over time
- **Doc comments for the unexpected** — don't restate the name. Note surprising behavior ("fails early on balance less than 10") or combat misconceptions. Take existing doc comments with a grain of salt — they may be stale
- **Integration-tested** — test through the flows they orchestrate, not by mocking internals

Examples: `provisionNewWorkspaceForGithubRepo(repo, user)`, `handleUserSignupWebhook()`

### Models

**Make wrong states impossible.** Every optional field is a question the rest of the codebase must answer every time it touches that data.

- **Name precisely** — if you can't tell whether a field belongs by looking at the model name, the model is trying to be too many things
- **Compose, don't merge** — `UserAndWorkspace { user: User, workspace: Workspace }` keeps both models intact instead of flattening workspace fields into User
- **Use brand types** — values with identical shapes can represent different concepts. `DocumentId(UUID)` instead of bare `UUID` makes swapping two IDs a compile error instead of a silent bug
- **Split when fields stop cohering** — when optional fields accumulate and the name no longer describes the data, split into the distinct things being coupled together

## TypeScript Standards

### Strict Configuration

- `strict: true` is enabled in tsconfig.json — do not weaken it
- All function parameters and return types should be inferable or explicitly typed
- Prefer `unknown` over `any` when the type is genuinely not known

### Type Safety Rules

- Use discriminated unions for state that can be in multiple forms
- Prefer `interface` for object shapes that will be extended, `type` for unions and computed types
- Use `as const` for literal tuples and objects that should not widen
- Avoid type assertions (`as`) — narrow with type guards instead
- Generic constraints should be as tight as possible
- Never use TypeScript `enum` — use `as const` objects with derived union types instead

### Import Ordering and Path Aliases

**Always use path aliases over relative imports** when crossing directories. Relative imports are only acceptable within the same directory or its immediate children.

Imports should be ordered from furthest to closest, with a blank line between each group:

```typescript
// 1. Node built-ins
import { readdirSync } from "node:fs";

// 2. External dependencies
import { createHighlighter } from "shiki";

// 3. Path aliases (internal code)
import { highlight } from "@/lib/highlight";
import { Button } from "@registry/ui/perimeter/button";

// 4. Relative imports (same directory)
import { PlaygroundControls } from "./playground-controls";

// 5. Type-only imports
import type { ControlsConfig } from "@/lib/demo-types";
```

## File Naming and Organization

This project uses Next.js App Router conventions:

- **Route files**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- **Components**: PascalCase for component files (`Button.tsx`), kebab-case for directories
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: colocate with the module that owns them, or in a shared `types.ts`
- **Registry components**: kebab-case in `registry/ui/perimeter/` matching shadcn convention
- **Demo files**: co-located with component: `button.demo.tsx` beside `button.tsx`
- **Barrel exports**: use sparingly — only for public API boundaries

## Error Handling

- Use early returns to handle error cases before the happy path
- Throw errors with descriptive messages that include relevant context
- Never swallow errors silently — log them at minimum
- In React components, use error boundaries for runtime errors

## Logging

- Use `console.error` for errors that need attention
- Use `console.warn` for degraded behavior that still works
- Avoid `console.log` in production code — use it only during development
- Never log sensitive data (tokens, passwords, PII)

## Testing

- Test files live next to the code they test: `Button.test.tsx` beside `Button.tsx`
- Name test files with `.test.ts` or `.test.tsx` suffix
- Each test should test one behavior and have a descriptive name
- Prefer testing behavior over implementation details
- Use factories or builders for test data, not raw object literals

## Git Workflow

### Branch Naming

Use conventional prefixes: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/` with kebab-case descriptions.

### Commit Discipline

- **Atomic commits** — each commit represents one logical change that compiles and passes tests
- **Conventional commit format:** `type: subject` — e.g., `feat: add sermon search endpoint`
- **Write commit bodies for non-obvious changes** — the subject says what, the body says why

### Branch Protection

- **Always create a branch** — never commit directly to `dev` or `main`
- **Never push to origin** — pushing is a manual task performed by the developer
- **Run `pnpm quality` before merging** — the branch must pass all checks

### Worktrees

Use `.worktrees/` (project-local, hidden) for isolated development branches. This directory is gitignored.

```bash
git worktree add .worktrees/<branch-name> -b <branch-name>
cd .worktrees/<branch-name> && pnpm install
```

Note: Turbopack does not work in worktrees (resolves parent directory). The `--webpack` flag in `pnpm dev` handles this.

## Project Configuration

### Path Aliases

| Alias         | Maps To        | Used For                                  |
| ------------- | -------------- | ----------------------------------------- |
| `@/*`         | `./src/*`      | App code (components, lib, hooks)         |
| `@registry/*` | `./registry/*` | Registry components and demo file imports |

### Key Config Files

| File                 | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `components.json`    | shadcn registry configuration                  |
| `next.config.ts`     | Next.js configuration                          |
| `tsconfig.json`      | TypeScript configuration                       |
| `postcss.config.mjs` | PostCSS with Tailwind CSS v4                   |
| `eslint.config.mjs`  | ESLint flat config                             |
| `.prettierignore`    | Excludes generated/build files from formatting |
