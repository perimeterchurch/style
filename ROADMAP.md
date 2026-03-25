# Roadmap

## Critical Blockers

- [x] Fix build script — `scripts/generate-registry.ts` must exist for `pnpm registry:build`
- [x] Enable static export — uncomment `output: 'export'` in `next.config.ts`
- [x] Update registry URL — replace placeholder on landing page with real deployment URL

## High Priority

- [x] Registry base item — `registry:base` metaitem so consumers can install full Perimeter style in one command
- [x] File download export — editor exports as `.css` and `.json` file downloads, not just clipboard
- [x] Per-project integration docs — specific setup steps for perimeter-api, metrics, perimeter-widgets
- [x] Versioning strategy — how consuming projects handle registry updates without breaking
- [ ] Deploy to GitHub Pages — CI/CD pipeline working end-to-end (workflows updated, needs first push to main)

## Medium Priority

- [ ] Showcase all 55 components — current preview only shows ~10
- [ ] Error boundaries in editor — handle store failures, localStorage unavailable
- [ ] Token input validation — validate OKLCH format, reject invalid values
- [ ] Theme persistence to registry — save themes from editor directly to `registry/themes/` and rebuild
- [ ] Undo/redo toast suppression — rapid undo/redo shouldn't spam toasts

## Low Priority (Polish)

- [ ] OKLCH precision — replace approximate oklch↔hex conversion with `culori` library
- [ ] Custom domain — CNAME for `style.perimeter.church`
- [ ] Token search/filter — 45+ tokens, scrolling is the only navigation
- [ ] Contrast checker — WCAG ratio display for fg/bg color pairs
- [ ] Per-component token editing — button radius, card shadow, etc.
- [ ] Preset library — built-in theme presets to start from
- [ ] Better color picker — native HTML color input is limited, consider a proper OKLCH picker

## Editor Tier 2 Features

- [ ] Token search and filtering with keyboard shortcuts
- [ ] WCAG contrast ratio checker for foreground/background pairs
- [ ] Per-component token editing (button radius, card shadow, input border)
- [ ] Theme diff — compare two themes side by side
- [ ] Import theme — paste CSS or JSON to import token values
- [ ] Bulk operations — copy light tokens to dark with lightness adjustment

## Editor Tier 3 Features

- [ ] Interactive component props in preview — change button text, toggle states
- [ ] Export to multiple formats — SCSS, Tailwind config, CSS-in-JS, Style Dictionary
- [ ] Shareable theme URLs — encode theme in URL for sharing
- [ ] Theme gallery — browse community/preset themes
- [ ] Animation preview — see transitions and motion with current tokens

## Consumer Migration

- [ ] Migrate perimeter-api from local tokens to the registry
- [ ] Migrate perimeter-widgets from shared tokens to the registry
- [ ] Migrate metrics from perimeter-widgets dependency to the registry
- [ ] Standardize all projects on `data-theme` or `.dark` class for dark mode
