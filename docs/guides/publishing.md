# Publishing

## CI/CD Pipeline

Two GitHub Actions workflows handle publishing:

### 1. Publish Workflow (`.github/workflows/publish.yml`)

**Trigger**: Push to `main` branch.

Steps:

1. Checkout with full git history (`fetch-depth: 0`)
2. Install pnpm and Node 20
3. `pnpm install --frozen-lockfile`
4. `pnpm quality` — runs typecheck, lint, format:check, and test
5. **Determine version bump** — scans commits since last tag:
    - `BREAKING CHANGE` in any commit → `major`
    - `feat` prefix in any commit → `minor`
    - Otherwise → `patch`
6. `npm version <bump> --no-git-tag-version` — bumps `package.json`
7. `pnpm build` — builds all packages + collects dist
8. `npm publish` — publishes to GitHub Packages (`https://npm.pkg.github.com`)
9. Commits the version bump, tags, and pushes to `main`

### 2. Storybook Deploy (`.github/workflows/pages.yml`)

**Trigger**: After Publish workflow completes successfully.

Steps:

1. Checkout, install pnpm + Node 20
2. `pnpm storybook:build` — static build to `storybook-static/`
3. Upload and deploy to GitHub Pages

## Version Strategy

Versions follow semver and are auto-bumped by CI based on conventional commits:

| Commit prefix                       | Version bump  |
| ----------------------------------- | ------------- |
| `BREAKING CHANGE` (in body)         | Major (x.0.0) |
| `feat:`                             | Minor (0.x.0) |
| `fix:`, `refactor:`, `chore:`, etc. | Patch (0.0.x) |

## Manual Version Override

To force a specific version before CI runs:

1. Edit `version` in root `package.json`
2. Commit with `chore: release v<version>`
3. Push to `main`

The CI will still run `npm version` but the starting point will be your manual value.

## GITHUB_TOKEN Setup

The publish workflow uses `${{ secrets.GITHUB_TOKEN }}` which is automatically provided by GitHub Actions. No manual secret configuration is needed.

Required repository permissions (set in workflow):

- `contents: write` — to push version commits and tags
- `packages: write` — to publish to GitHub Packages

## Package Registry

Published to GitHub Packages at `https://npm.pkg.github.com` under the `@perimeterchurch` scope.

Consumers need a `.npmrc` file:

```
@perimeterchurch:registry=https://npm.pkg.github.com
```

## Pre-Publish Checklist

Before merging to `main`:

1. `pnpm quality` passes (typecheck + lint + format:check + test)
2. `pnpm build` succeeds
3. All new components have tests, stories, and barrel exports
4. Commit messages follow conventional commit format
5. PR reviewed and approved

## Never Push Manually

The CI pipeline handles all publishing. Never run `npm publish` locally. Never push directly to `main` — always use pull requests.
