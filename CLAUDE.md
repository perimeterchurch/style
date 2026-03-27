# CLAUDE.md

## Table of Contents

- [Commands](#commands)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [Critical Rules](#critical-rules)
- [Code Philosophy](#code-philosophy)
- [TypeScript Standards](#typescript-standards)
- [File Naming and Organization](#file-naming-and-organization)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Project Configuration](#project-configuration)

## Commands

| Command                | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `pnpm dev`             | Start Next.js dev server with Turbopack                     |
| `pnpm build`           | Generate themes + build registry + Next.js production build |
| `pnpm registry:build`  | Build registry JSON only (shadcn build)                     |
| `pnpm generate:themes` | Generate theme CSS from `registry/themes/*.json`            |
| `pnpm lint`            | Run ESLint                                                  |
| `pnpm format`          | Format with Prettier                                        |
| `pnpm format:check`    | Check formatting                                            |
| `pnpm collect:demos`   | Collect demo manifests and generate import map              |
| `pnpm typecheck`       | TypeScript type checking                                    |
| `pnpm test`            | Run tests (none yet)                                        |
| `pnpm quality`         | Run all checks (typecheck + lint + format:check)            |

## Architecture

shadcn-compatible component registry and showcase site for Perimeter Church. Next.js app that serves registry JSON and hosts an interactive component showcase with playgrounds, templates, and token reference.

- **Registry**: 55 shadcn components in `registry/ui/perimeter/`, built to `public/r/` via `shadcn build`
- **Showcase**: Component pages with interactive prop playgrounds, code examples, and theme switching
- **Consumers**: Install via `pnpm dlx shadcn@latest add @perimeter/button`
- **Tokens**: Warm stone palette in OKLCH format, light + dark + project-specific themes in `registry/themes/`
- **Theme System**: JSON theme files → build-time CSS generation → CSS variable inheritance (no Zustand)

### Key Directories

| Directory                          | Purpose                                                     |
| ---------------------------------- | ----------------------------------------------------------- |
| `registry/ui/perimeter/`           | Component source (SINGLE SOURCE OF TRUTH)                   |
| `registry/ui/perimeter/*.demo.tsx` | Component demos with controls, examples, and meta           |
| `registry/themes/`                 | Theme definitions (default, perimeter-api, metrics)         |
| `src/app/`                         | Next.js routes (components, templates, tokens, docs)        |
| `src/templates/`                   | Full-page template compositions (dashboard, settings, etc.) |
| `src/components/site/`             | Site chrome (top nav, sidebar, search, playground controls) |
| `src/components/ui/`               | shadcn components for app use (NOT the registry source)     |
| `src/lib/`                         | Utilities (demo-types, highlight, theme-context, utils)     |
| `src/lib/demo-types.ts`            | Shared types (ManifestEntry, ControlsConfig, PlaygroundProps) |
| `scripts/`                         | Build and generation scripts                                |
| `public/r/`                        | Built registry JSON (generated, gitignored)                 |

### Theme System Architecture

Theme files in `registry/themes/` are compiled to CSS at build time by `scripts/generate-theme-css.ts`, which injects tokens directly into `src/app/globals.css` between `@generated-themes-start` / `@generated-themes-end` markers. All components respond to theme changes via CSS variable inheritance.

- `default.json` — base warm stone palette (emitted as `:root` / `.dark`)
- Project themes (perimeter-api, metrics) — overrides only (emitted as `[data-theme="slug"]`)
- Runtime switching via `data-theme` attribute + `.dark` class on `<html>`

### Context Loading

| Working on...       | Read first                                                  |
| ------------------- | ----------------------------------------------------------- |
| Registry components | `registry/ui/perimeter/`                                    |
| Demo files          | `registry/ui/perimeter/*.demo.tsx`, `src/lib/demo-types.ts` |
| Templates           | `src/templates/`, `src/app/templates/`                      |
| Theme tokens        | `registry/themes/default.json`, `src/app/globals.css`       |
| Theme generation    | `scripts/generate-theme-css.ts`, `registry/themes/`         |
| Registry build      | `scripts/generate-registry.ts`, `registry.json`             |
| Site navigation     | `src/components/site/`                                      |
| Site components     | `src/components/site/`, `src/app/layout.tsx`                |

## Documentation

Documentation lives alongside the code it describes:

- **Architecture docs** explain _why_ systems are designed the way they are
- **Guide docs** explain _how_ to accomplish specific tasks
- **Reference docs** are lookup tables for APIs, tokens, and config

Rules for documentation:

- Do not create documentation files unless explicitly requested
- Keep docs close to the code they describe
- Update docs when changing the systems they document
- Prefer self-documenting code over comments

## Critical Rules

- **Always use `pnpm`** — never npm or npx. Use `pnpm dlx` instead of `npx`
- **Always create a branch** — never commit directly to `dev` or `main`
- **Never push to origin** — pushing is a manual task performed by the developer
- **Conventional commits:** `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`
- **Use `--body-file` for PR bodies** — `gh pr create --body` and `gh pr edit --body` inject ANSI escape codes. Write the body file using the Write tool, then pass it with `--body-file`
- **`registry/ui/perimeter/` is the single source of truth for components** — never edit built output in `public/r/`
- **Always run `pnpm registry:build` after modifying registry items** — the built JSON in `public/r/` must stay in sync
- **Never add eslint-disable comments** — fix the underlying code instead of suppressing warnings. eslint-disable comments hide problems and rot over time
- **Never use `any` in production code** — use proper types, generics, or `unknown` instead. Test and story files are exempt from this rule

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

### Import Ordering

Imports should be grouped in this order, with a blank line between groups:

1. React / framework imports
2. External library imports
3. Internal absolute imports (`@/...`)
4. Relative imports
5. Type-only imports (`import type`)

## File Naming and Organization

This project uses Next.js App Router conventions:

- **Route files**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- **Components**: PascalCase for component files (`Button.tsx`), kebab-case for directories
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: colocate with the module that owns them, or in a `types.ts` file for shared types
- **Constants**: SCREAMING_SNAKE_CASE for true constants, camelCase for derived values
- **Registry components**: live in `registry/ui/perimeter/` with kebab-case filenames matching the shadcn convention

### Barrel Exports

- Use `index.ts` barrel files sparingly — only for public API boundaries
- Never re-export everything; be explicit about what is public

## Error Handling

- Use early returns to handle error cases before the happy path
- Throw errors with descriptive messages that include relevant context
- Prefer custom error types for domain-specific failures
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
- Describe blocks should mirror the module's public API
- Each test should test one behavior and have a descriptive name
- Prefer testing behavior over implementation details
- Use factories or builders for test data, not raw object literals

## Git Workflow

- **Branch naming**: `feat/short-description`, `fix/short-description`, `chore/short-description`
- **Conventional commits**: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`
- **Never push to origin** — pushing is a manual task performed by the developer
- **Never commit directly to `dev` or `main`**
- **Use `--body-file`** for PR bodies to avoid ANSI escape code injection

## Project Configuration

### Path Aliases

| Alias         | Maps To        |
| ------------- | -------------- |
| `@/*`         | `./src/*`      |
| `@registry/*` | `./registry/*` |

### Key Config Files

| File                 | Purpose                       |
| -------------------- | ----------------------------- |
| `components.json`    | shadcn registry configuration |
| `next.config.ts`     | Next.js configuration         |
| `tsconfig.json`      | TypeScript configuration      |
| `postcss.config.mjs` | PostCSS with Tailwind CSS v4  |
| `eslint.config.mjs`  | ESLint flat config            |
