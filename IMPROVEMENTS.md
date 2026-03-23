# Improvements & Feature Roadmap

Comprehensive audit of the style design system — issues, improvements, and feature opportunities.

## High-Impact Features

### Missing Components

| # | Component | Description | Notes |
|---|-----------|-------------|-------|
| 1 | **Modal/Dialog** | Confirmations, forms, content overlays | HeadlessUI already a dependency |
| 2 | **Toast/Notification** | Auto-dismiss alerts for success/error/info feedback | Needs portal rendering |
| 3 | **Tooltip** | Hover/focus triggered popovers for help text | |
| 4 | **Data Table** | Sortable, filterable tables | Critical for dashboards (react-attend-dash) |
| 5 | **Popover** | Click-triggered content panels | HeadlessUI has Popover primitive |
| 6 | **Breadcrumb** | Navigation hierarchy | |
| 7 | **Accordion** | Collapsible content sections | HeadlessUI Disclosure or custom |
| 8 | **Alert/Banner** | Persistent notification component (different from Toast) | |
| 9 | **Progress Bar** | Determinate progress with percentage | Only IndeterminateProgress exists |
| 10 | **Stepper** | Multi-step forms/wizards | |

### Component Enhancements

| # | Enhancement | Component | Description |
|---|------------|-----------|-------------|
| 11 | Prefix/suffix slots | Input | Icon/text before/after input (e.g., $ prefix, .com suffix) |
| 12 | Auto-resize | Textarea | Grow with content |
| 13 | Indeterminate state | Checkbox | For "select all" patterns |
| 14 | Dismiss button | Badge | Closable tags |
| 15 | Presence indicator | Avatar | Online/offline dot overlay |
| 16 | Text variant | Skeleton | Lines of text placeholders, not just rectangles |

---

## Medium-Impact Improvements

### Testing & Quality

| # | Improvement | Description |
|---|------------|-------------|
| 17 | Accessibility testing | Add `jest-axe` to component tests for automated WCAG checks |
| 18 | Storybook interaction tests | `@storybook/addon-interactions` with play functions for composite components |
| 19 | Test coverage reporting | Configure vitest coverage with thresholds |
| 20 | Visual regression testing | Playwright screenshot comparisons in CI |

### Developer Experience

| # | Improvement | Description |
|---|------------|-------------|
| 21 | Component scaffolding script | `pnpm new-component <name> <primitive\|composite>` generates index.tsx, .variants.ts, .stories.tsx, .test.tsx |
| 22 | Storybook MDX documentation | Component usage guidelines, do's/don'ts, composition patterns |
| 23 | Token contrast checker | WCAG ratio display in Token Editor for fg/bg color pairs |
| 24 | Token Editor undo/redo | History stack for experimentation |
| 25 | Icon search/discovery | Browsable icon gallery in Storybook with copy-to-clipboard |

### Accessibility

| # | Improvement | Description |
|---|------------|-------------|
| 26 | Reduced motion support | `prefers-reduced-motion` media query in all motion components |
| 27 | Focus trap utility | For modals/dialogs (HeadlessUI handles but needs documentation) |
| 28 | Skip-to-content link | Pattern documentation for consuming projects |

### Cross-Project Integration

| # | Improvement | Description |
|---|------------|-------------|
| 29 | Consuming project examples | Working example of integrating into Next.js — Tailwind config, token import, component usage |
| 30 | TypeScript setup guide | How to get types working in consuming projects |

---

## Lower-Impact Polish

### Build & Publishing

| # | Improvement | Description |
|---|------------|-------------|
| 31 | Automated changelog | Generate from conventional commits |
| 32 | Bundle size tracking | size-limit or bundlemon in CI |
| 33 | Storybook static deployment | Auto-deploy to GitHub Pages (workflow exists but may not be connected) |
| 34 | Beta/pre-release publishing | Canary releases for testing |

### Code Quality

| # | Improvement | Description |
|---|------------|-------------|
| 35 | Consistent error prop types | Standardize to `error?: string` across all form components |
| 36 | Inline SVG consolidation | Move Button spinner, Checkbox checkmark to icon registry |
| 37 | JSDoc standardization | Consistent doc comments on all exported components |

### Token System

| # | Improvement | Description |
|---|------------|-------------|
| 38 | Token validation CLI | Script that checks naming conventions, finds orphaned tokens |
| 39 | JS token export | Export token values as typed JavaScript object for non-CSS contexts (React Native, etc.) |
| 40 | Token deprecation system | Warn when deprecated tokens are used |

### Motion

| # | Improvement | Description |
|---|------------|-------------|
| 41 | Scroll-triggered animations | IntersectionObserver-based entrance animations |
| 42 | Page transitions | Route transition templates for Next.js |
| 43 | Gesture animations | Swipe, drag, pinch utilities |
