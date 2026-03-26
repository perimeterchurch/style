# Roadmap

## Completed

- [x] Fix build script — `scripts/generate-registry.ts` must exist for `pnpm registry:build`
- [x] Enable static export — uncomment `output: 'export'` in `next.config.ts`
- [x] Update registry URL — replace placeholder on landing page with real deployment URL
- [x] Registry base item — `registry:base` metaitem so consumers can install full Perimeter style in one command
- [x] Per-project integration docs — specific setup steps for perimeter-api, metrics, perimeter-widgets
- [x] Versioning strategy — how consuming projects handle registry updates without breaking

## In Progress

- [ ] **Component showcase site** — pivot from theme editor to full component showcase with interactive playgrounds, template gallery, and token reference. See `docs/superpowers/specs/2026-03-26-component-showcase-design.md`

## High Priority

- [ ] Deploy to GitHub Pages — CI/CD pipeline working end-to-end (workflows updated, needs first push to main)
- [ ] Custom domain — CNAME for `style.perimeter.church`

## Consumer Migration

- [ ] Migrate perimeter-api from local tokens to the registry
- [ ] Migrate perimeter-widgets from shared tokens to the registry
- [ ] Migrate metrics from perimeter-widgets dependency to the registry
- [ ] Standardize all projects on `data-theme` or `.dark` class for dark mode
