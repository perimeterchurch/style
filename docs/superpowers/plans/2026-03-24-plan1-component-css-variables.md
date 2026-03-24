# Plan 1: Component CSS Variables & Variant Refactor

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce component-scoped CSS variables and refactor all 23 component variant files from Tailwind class strings to CSS class-based styling, following DaisyUI's architecture.

**Architecture:** Create `components.css` with base CSS classes for every component (`.btn`, `.card`, `.input`, etc.) that define and consume CSS custom properties. Variant files become lightweight prop→class mappings. Components compose CSS classes via `cn()` instead of building Tailwind strings. Themes override component variables via `[data-theme] .component` selectors.

**Tech Stack:** CSS custom properties, `color-mix()`, Tailwind CSS v4, `@layer style-components`

**Spec:** `docs/superpowers/specs/2026-03-24-theme-system-redesign.md` (Sections 1 & 4)

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `packages/tokens/src/components.css` | Base CSS classes for all components with CSS variable definitions, variant classes, size classes, state selectors, dark mode overrides |

### Modified Files

| File | Changes |
|------|---------|
| `packages/tokens/src/base.css` | Add `@import './components.css'`, remove `@import 'tailwindcss'` |
| `packages/components/src/utils/types.ts` | Remove `VariantDefinition`, `SizeDefinition`, `resolveVariant()` |
| All 16 primitive `.variants.ts` files | Rewrite to prop→class mappings |
| All 7 composite `.variants.ts` files | Rewrite to prop→class mappings |
| All 23 component `index.tsx` files | Use CSS class composition instead of Tailwind strings |
| All component `.test.tsx` files | Update class name assertions |
| `packages/tokens/package.json` | Update build script to copy `components.css` |

---

## Chunk 1: Foundation — components.css and base.css changes

### Task 1: Create components.css with Button base classes

This is the template task — Button is the most complex component and establishes the CSS pattern all others follow.

**Files:**
- Create: `packages/tokens/src/components.css`
- Modify: `packages/tokens/src/base.css`

- [ ] **Step 1: Create components.css with Button CSS**

Create `packages/tokens/src/components.css`. Start with the Button component — it has the most complete variant/size/state coverage and serves as the pattern for all others.

```css
/* ==========================================================================
   Component Base Styles
   CSS custom properties for themeable component styling.
   Each component defines --{comp}-{property} variables with sensible defaults
   derived from global tokens. Themes override these via [data-theme] selectors.
   ========================================================================== */

@layer style-components {

    /* ======================================================================
       Button
       ====================================================================== */
    .btn {
        --btn-bg: var(--btn-color, var(--color-muted));
        --btn-fg: var(--color-foreground);
        --btn-border: color-mix(in oklab, var(--btn-bg), #000 8%);
        --btn-radius: var(--radius-md);
        --btn-padding-x: var(--spacing-md);
        --btn-padding-y: var(--spacing-sm);
        --btn-font-size: var(--font-size-sm);
        --btn-shadow: var(--shadow-xs);
        --btn-hover-bg: color-mix(in oklab, var(--btn-color, var(--color-muted)), #000 10%);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background-color: var(--btn-bg);
        color: var(--btn-fg);
        border: 1px solid var(--btn-border);
        border-radius: var(--btn-radius);
        padding: var(--btn-padding-y) var(--btn-padding-x);
        font-size: var(--btn-font-size);
        font-weight: 500;
        line-height: 1.5;
        box-shadow: var(--btn-shadow);
        cursor: pointer;
        transition: background-color 150ms, border-color 150ms, box-shadow 150ms, color 150ms;
    }
    .btn:hover {
        --btn-bg: var(--btn-hover-bg);
    }
    .btn:active {
        transform: scale(0.98);
    }
    .btn:focus-visible {
        outline: none;
        box-shadow: var(--btn-shadow), 0 0 0 2px var(--color-background), 0 0 0 4px color-mix(in oklab, var(--btn-color, var(--color-primary)), transparent 50%);
    }
    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }

    /* Button color variants */
    .btn-primary {
        --btn-color: var(--color-primary);
        --btn-fg: var(--color-primary-foreground);
        --btn-hover-bg: var(--color-primary-hover);
    }
    .btn-secondary {
        --btn-color: var(--color-stone-200);
        --btn-fg: var(--color-stone-700);
        --btn-hover-bg: var(--color-stone-300);
    }
    .btn-success {
        --btn-color: var(--color-success);
        --btn-fg: var(--color-success-foreground);
        --btn-hover-bg: var(--color-success-hover);
    }
    .btn-warning {
        --btn-color: var(--color-warning);
        --btn-fg: var(--color-warning-foreground);
        --btn-hover-bg: var(--color-warning-hover);
    }
    .btn-error {
        --btn-color: var(--color-error);
        --btn-fg: var(--color-error-foreground);
        --btn-hover-bg: var(--color-error-hover);
    }
    .btn-info {
        --btn-color: var(--color-info);
        --btn-fg: var(--color-info-foreground);
        --btn-hover-bg: var(--color-info-hover);
    }
    .btn-ghost {
        --btn-bg: transparent;
        --btn-border: transparent;
        --btn-shadow: none;
        --btn-fg: var(--color-foreground);
        --btn-hover-bg: var(--color-muted);
    }

    /* Button outline mode */
    .btn-outline {
        --btn-bg: transparent;
        --btn-fg: var(--btn-color, var(--color-foreground));
        --btn-border: var(--btn-color, var(--color-border));
        --btn-shadow: none;
    }
    .btn-outline:hover {
        --btn-bg: var(--btn-color, var(--color-muted));
        --btn-fg: var(--color-primary-foreground);
    }

    /* Button sizes */
    .btn-xs { --btn-padding-x: var(--spacing-xs); --btn-padding-y: 0.25rem; --btn-font-size: var(--font-size-xs); --btn-radius: var(--radius-sm); }
    .btn-sm { --btn-padding-x: var(--spacing-sm); --btn-padding-y: 0.375rem; --btn-font-size: var(--font-size-sm); --btn-radius: var(--radius-md); }
    .btn-md { --btn-padding-x: var(--spacing-md); --btn-padding-y: var(--spacing-sm); --btn-font-size: var(--font-size-base); --btn-radius: var(--radius-lg); }
    .btn-lg { --btn-padding-x: var(--spacing-lg); --btn-padding-y: 0.625rem; --btn-font-size: var(--font-size-lg); --btn-radius: var(--radius-xl); }
    .btn-xl { --btn-padding-x: var(--spacing-xl); --btn-padding-y: 0.75rem; --btn-font-size: var(--font-size-xl); --btn-radius: 1rem; }

    /* Button full width */
    .btn-full { width: 100%; }

    /* Button dark mode */
    [data-theme='dark'] .btn-secondary {
        --btn-color: var(--color-stone-700);
        --btn-fg: var(--color-stone-200);
        --btn-hover-bg: var(--color-stone-600);
    }
    [data-theme='dark'] .btn-ghost {
        --btn-hover-bg: var(--color-stone-800);
    }

}
```

- [ ] **Step 2: Update base.css**

Read `packages/tokens/src/base.css`. Make two changes:
1. Remove `@import 'tailwindcss';` (consumers bring their own)
2. Add `@import './components.css';` after `@import './tokens.css';`

Result:
```css
@import './tokens.css';
@import './components.css';
@import './themes/dark.css';
/* ... rest unchanged */
```

- [ ] **Step 3: Update tokens package build script**

Read `packages/tokens/package.json`. The build script is `tsup && cp -r src/*.css dist/ && cp -r src/themes dist/`. The glob `src/*.css` already catches `components.css`. Verify this is the case — no change needed if the glob works.

- [ ] **Step 4: Commit**

```bash
git add packages/tokens/src/components.css packages/tokens/src/base.css
git commit -m "feat: create components.css with Button base classes and CSS variables"
```

---

### Task 2: Add Card, Badge, and Label to components.css

**Files:**
- Modify: `packages/tokens/src/components.css`

- [ ] **Step 1: Read current variant files**

Read these files to understand exact styling:
- `packages/components/src/primitives/Card/Card.variants.ts`
- `packages/components/src/primitives/Badge/Badge.variants.ts`
- `packages/components/src/primitives/Label/Label.variants.ts`

- [ ] **Step 2: Add Card CSS**

Card has one variant (default), no sizes. Needs: bg, fg, border, radius, shadow, hover shadow/translate.

```css
    /* Card */
    .card {
        --card-bg: var(--color-card);
        --card-fg: var(--color-card-foreground);
        --card-border: var(--color-border);
        --card-radius: var(--radius-xl);
        --card-shadow: var(--shadow-sm);
        --card-padding: var(--spacing-lg);

        background-color: var(--card-bg);
        color: var(--card-fg);
        border: 1px solid var(--card-border);
        border-radius: var(--card-radius);
        box-shadow: var(--card-shadow);
        overflow: hidden;
        transition: box-shadow 200ms, transform 200ms;
    }
    .card-hoverable:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
    }
    .card-header, .card-body, .card-footer {
        padding: var(--card-padding);
    }
    .card-header { border-bottom: 1px solid var(--card-border); }
    .card-footer { border-top: 1px solid var(--card-border); }
```

- [ ] **Step 3: Add Badge CSS**

Badge has 7 color variants + outline mode + 2 sizes + dot indicator.

```css
    /* Badge */
    .badge {
        --badge-bg: color-mix(in oklab, var(--badge-color, var(--color-muted)), transparent 90%);
        --badge-fg: var(--badge-color, var(--color-foreground));
        --badge-border: transparent;
        --badge-radius: 9999px;
        --badge-padding-x: 0.625rem;
        --badge-padding-y: 0.25rem;
        --badge-font-size: var(--font-size-xs);
        --badge-dot-size: 0.5rem;
        --badge-dot-color: var(--badge-color, var(--color-muted-foreground));

        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        background-color: var(--badge-bg);
        color: var(--badge-fg);
        border: 1px solid var(--badge-border);
        border-radius: var(--badge-radius);
        padding: var(--badge-padding-y) var(--badge-padding-x);
        font-size: var(--badge-font-size);
        font-weight: 500;
        line-height: 1;
        white-space: nowrap;
    }
    .badge-primary { --badge-color: var(--color-primary); }
    .badge-secondary { --badge-color: var(--color-stone-500); --badge-bg: var(--color-stone-100); --badge-fg: var(--color-stone-700); }
    .badge-success { --badge-color: var(--color-success); }
    .badge-warning { --badge-color: var(--color-warning); }
    .badge-error { --badge-color: var(--color-error); }
    .badge-info { --badge-color: var(--color-info); }
    .badge-ghost { --badge-bg: transparent; --badge-border: var(--color-border); --badge-fg: var(--color-foreground); }

    .badge-outline { --badge-bg: transparent; --badge-border: var(--badge-color, var(--color-border)); }
    .badge-sm { --badge-padding-x: 0.5rem; --badge-padding-y: 0.125rem; }

    .badge-dot::before {
        content: '';
        display: inline-block;
        width: var(--badge-dot-size);
        height: var(--badge-dot-size);
        border-radius: 9999px;
        background-color: var(--badge-dot-color);
    }

    [data-theme='dark'] .badge-secondary { --badge-bg: var(--color-stone-800); --badge-fg: var(--color-stone-200); }
    [data-theme='dark'] .badge-ghost { --badge-border: var(--color-stone-700); }
```

- [ ] **Step 4: Add Label CSS**

```css
    /* Label */
    .label {
        --label-fg: var(--color-stone-900);
        --label-font-size: var(--font-size-sm);

        display: block;
        font-size: var(--label-font-size);
        font-weight: 500;
        line-height: 1;
        color: var(--label-fg);
    }
    .label-required::after {
        content: ' *';
        color: var(--color-error);
    }
    [data-theme='dark'] .label { --label-fg: var(--color-stone-100); }
```

- [ ] **Step 5: Commit**

```bash
git add packages/tokens/src/components.css
git commit -m "feat: add Card, Badge, and Label CSS to components.css"
```

---

### Task 3: Add Input, Select, and Textarea to components.css

These three share nearly identical styling. Define a shared pattern.

**Files:**
- Modify: `packages/tokens/src/components.css`

- [ ] **Step 1: Read current variant files**

Read:
- `packages/components/src/primitives/Input/Input.variants.ts`
- `packages/components/src/primitives/Select/Select.variants.ts`
- `packages/components/src/primitives/Textarea/Textarea.variants.ts`

- [ ] **Step 2: Add shared form control CSS + Input/Select/Textarea variants**

These share the same border, focus, error, and dark mode patterns. Use a shared `.form-control` base, then component-specific overrides.

```css
    /* Shared form control base */
    .form-control {
        --fc-bg: var(--color-background);
        --fc-fg: var(--color-foreground);
        --fc-border: var(--color-stone-300);
        --fc-radius: var(--radius-lg);
        --fc-padding-x: var(--spacing-sm);
        --fc-padding-y: var(--spacing-sm);
        --fc-font-size: var(--font-size-base);
        --fc-ring-color: var(--color-primary);
        --fc-placeholder: var(--color-text-muted);

        display: flex;
        width: 100%;
        background-color: var(--fc-bg);
        color: var(--fc-fg);
        border: 1px solid var(--fc-border);
        border-radius: var(--fc-radius);
        padding: var(--fc-padding-y) var(--fc-padding-x);
        font-size: var(--fc-font-size);
        transition: border-color 200ms, box-shadow 200ms;
    }
    .form-control::placeholder { color: var(--fc-placeholder); }
    .form-control:focus-visible {
        outline: none;
        border-color: var(--fc-ring-color);
        box-shadow: 0 0 0 2px color-mix(in oklab, var(--fc-ring-color), transparent 50%);
    }
    .form-control:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .form-control-error { --fc-border: var(--color-error); --fc-ring-color: var(--color-error); }

    [data-theme='dark'] .form-control {
        --fc-bg: var(--color-stone-900);
        --fc-fg: var(--color-stone-100);
        --fc-border: var(--color-stone-600);
    }

    /* Form control sizes */
    .fc-xs { --fc-padding-x: 0.5rem; --fc-padding-y: 0.25rem; --fc-font-size: var(--font-size-xs); height: 1.75rem; }
    .fc-sm { --fc-padding-x: 0.625rem; --fc-padding-y: 0.375rem; --fc-font-size: var(--font-size-sm); height: 2rem; }
    .fc-md { --fc-padding-x: var(--spacing-sm); --fc-padding-y: var(--spacing-sm); --fc-font-size: var(--font-size-base); height: 2.5rem; }
    .fc-lg { --fc-padding-x: var(--spacing-md); --fc-padding-y: 0.625rem; --fc-font-size: var(--font-size-lg); height: 3rem; }
    .fc-xl { --fc-padding-x: var(--spacing-lg); --fc-padding-y: 0.75rem; --fc-font-size: var(--font-size-xl); height: 3.5rem; }

    /* Input */
    .input { /* inherits from .form-control — no additional defaults */ }
    .input-full { width: 100%; }

    /* Select */
    .select {
        appearance: none;
        padding-right: 2.5rem; /* space for chevron */
        background-image: url("data:image/svg+xml,..."); /* chevron SVG */
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        background-size: 1rem;
    }

    /* Textarea */
    .textarea {
        min-height: 5rem;
        resize: vertical;
        height: auto; /* override form-control fixed height */
    }
```

Note: The select chevron SVG data URI should be extracted from the current Select component source. Read it during implementation.

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/src/components.css
git commit -m "feat: add Input, Select, Textarea CSS with shared form-control base"
```

---

### Task 4: Add Checkbox, Switch, and Avatar to components.css

**Files:**
- Modify: `packages/tokens/src/components.css`

- [ ] **Step 1: Read current variant files**

Read:
- `packages/components/src/primitives/Checkbox/Checkbox.variants.ts`
- `packages/components/src/primitives/Switch/Switch.variants.ts`
- `packages/components/src/primitives/Avatar/Avatar.variants.ts`

- [ ] **Step 2: Add Checkbox CSS**

Multi-slot: checkbox box + label. Sizes control dimensions.

```css
    /* Checkbox */
    .checkbox {
        --checkbox-size: 1rem;
        --checkbox-radius: var(--radius-sm);
        --checkbox-border: var(--color-stone-300);
        --checkbox-bg: var(--color-background);
        --checkbox-check-color: var(--color-primary-foreground);
        --checkbox-checked-bg: var(--color-primary);

        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .checkbox-box {
        width: var(--checkbox-size);
        height: var(--checkbox-size);
        border: 1px solid var(--checkbox-border);
        border-radius: var(--checkbox-radius);
        background-color: var(--checkbox-bg);
        transition: background-color 150ms, border-color 150ms;
        cursor: pointer;
    }
    .checkbox-box:checked, .checkbox-box[data-checked] {
        background-color: var(--checkbox-checked-bg);
        border-color: var(--checkbox-checked-bg);
    }
    .checkbox-xs { --checkbox-size: 0.75rem; }
    .checkbox-sm { --checkbox-size: 0.875rem; }
    .checkbox-md { --checkbox-size: 1rem; }
    .checkbox-lg { --checkbox-size: 1.25rem; }
    .checkbox-xl { --checkbox-size: 1.5rem; }
```

- [ ] **Step 3: Add Switch CSS**

Multi-slot: track + knob. Sizes control all three slot dimensions.

```css
    /* Switch */
    .switch {
        --switch-track-w: 2.75rem;
        --switch-track-h: 1.5rem;
        --switch-knob-size: 1.25rem;
        --switch-translate: 1.25rem;
        --switch-track-bg: var(--color-stone-200);
        --switch-track-checked-bg: var(--color-primary);
        --switch-knob-bg: white;
    }
    .switch-track {
        position: relative;
        width: var(--switch-track-w);
        height: var(--switch-track-h);
        background-color: var(--switch-track-bg);
        border-radius: 9999px;
        cursor: pointer;
        transition: background-color 200ms;
    }
    .switch-track:checked, .switch-track[data-checked] {
        background-color: var(--switch-track-checked-bg);
    }
    .switch-track::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0.125rem;
        transform: translateY(-50%);
        width: var(--switch-knob-size);
        height: var(--switch-knob-size);
        background-color: var(--switch-knob-bg);
        border-radius: 9999px;
        transition: transform 200ms;
    }
    .switch-track:checked::before {
        transform: translateY(-50%) translateX(var(--switch-translate));
    }
    .switch-xs { --switch-track-w: 1.75rem; --switch-track-h: 1rem; --switch-knob-size: 0.75rem; --switch-translate: 0.75rem; }
    .switch-sm { --switch-track-w: 2.25rem; --switch-track-h: 1.25rem; --switch-knob-size: 1rem; --switch-translate: 1rem; }
    .switch-md { /* defaults */ }
    .switch-lg { --switch-track-w: 3.25rem; --switch-track-h: 1.75rem; --switch-knob-size: 1.5rem; --switch-translate: 1.5rem; }
    .switch-xl { --switch-track-w: 3.75rem; --switch-track-h: 2rem; --switch-knob-size: 1.75rem; --switch-translate: 1.75rem; }

    [data-theme='dark'] .switch { --switch-track-bg: var(--color-stone-700); }
```

- [ ] **Step 4: Add Avatar CSS**

```css
    /* Avatar */
    .avatar {
        --avatar-size: 2.5rem;
        --avatar-font-size: var(--font-size-base);
        --avatar-bg: var(--color-stone-200);
        --avatar-fg: var(--color-stone-600);
        --avatar-radius: 9999px;

        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--avatar-size);
        height: var(--avatar-size);
        border-radius: var(--avatar-radius);
        background-color: var(--avatar-bg);
        color: var(--avatar-fg);
        font-size: var(--avatar-font-size);
        font-weight: 500;
        overflow: hidden;
    }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-xs { --avatar-size: 1.5rem; --avatar-font-size: var(--font-size-xs); }
    .avatar-sm { --avatar-size: 2rem; --avatar-font-size: var(--font-size-sm); }
    .avatar-md { /* defaults */ }
    .avatar-lg { --avatar-size: 3rem; --avatar-font-size: var(--font-size-lg); }
    .avatar-xl { --avatar-size: 4rem; --avatar-font-size: var(--font-size-xl); }
```

- [ ] **Step 5: Commit**

```bash
git add packages/tokens/src/components.css
git commit -m "feat: add Checkbox, Switch, Avatar CSS to components.css"
```

---

### Task 5: Add remaining primitives to components.css

**Files:**
- Modify: `packages/tokens/src/components.css`

Add CSS for: Skeleton, LoadingSpinner, FilterChip, EmptyState, IndeterminateProgress, SearchInput.

- [ ] **Step 1: Read all remaining variant files**

- [ ] **Step 2: Add CSS for each component**

These are simpler components. Read each variant file and translate to CSS variables following the established pattern. Key points:

- **Skeleton:** Only needs radius variants (line, circle, card) + shimmer animation reference
- **LoadingSpinner:** Only needs size classes for dimensions
- **FilterChip:** Similar to Badge but with dismiss button. Shares color variants.
- **EmptyState:** Mostly layout (flex column, centered). Minimal theming.
- **IndeterminateProgress:** Position/height only. Minimal theming.
- **SearchInput:** Similar to Input but with icon padding slots. Uses form-control base.

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/src/components.css
git commit -m "feat: add Skeleton, Spinner, FilterChip, EmptyState, Progress, SearchInput CSS"
```

---

### Task 6: Add composite component CSS to components.css

**Files:**
- Modify: `packages/tokens/src/components.css`

Add CSS for: Tabs, Pagination, Dropdown, ComboSelect, DateRangePicker, IconSelect, MultiIconSelect.

- [ ] **Step 1: Read all composite variant files**

- [ ] **Step 2: Add CSS for each composite**

These composites use raw class strings (not VariantDefinition). Translate each string into CSS classes:

- **Tabs:** `.tabs-list`, `.tab`, `.tab-active`, `.tab-inactive`, `.tab-disabled`, `.tab-indicator`
- **Pagination:** `.pagination`, `.pagination-btn`, `.pagination-btn-active`, `.pagination-btn-disabled`
- **Dropdown:** `.dropdown-menu`, `.dropdown-item`, `.dropdown-item-destructive`
- **ComboSelect:** `.comboselect-input`, `.comboselect-option`, `.comboselect-popover`
- **DateRangePicker:** `.date-range-wrapper`, `.date-range-input`
- **IconSelect/MultiIconSelect:** `.icon-select-btn`, `.icon-select-popover`, `.icon-select-option`

For HeadlessUI-backed composites (ComboSelect, Dropdown, IconSelect, MultiIconSelect), preserve `data-[focus]`, `data-[closed]` state selectors.

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/src/components.css
git commit -m "feat: add composite component CSS to components.css"
```

---

## Chunk 2: Variant File Refactor

### Task 7: Refactor Button variant file and component

The template task for the variant refactor. Establishes the pattern.

**Files:**
- Modify: `packages/components/src/primitives/Button/Button.variants.ts`
- Modify: `packages/components/src/primitives/Button/index.tsx`
- Modify: `packages/components/src/primitives/Button/Button.test.tsx`

- [ ] **Step 1: Read current files**

Read all three files to understand the current implementation.

- [ ] **Step 2: Rewrite Button.variants.ts**

Replace the `VariantDefinition` records with simple class-name mappings:

```ts
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const buttonVariantClass: Record<ButtonVariant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
    info: 'btn-info',
    ghost: 'btn-ghost',
};

export const buttonSizeClass: Record<ButtonSize, string> = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
};

export const buttonIconSize: Record<ButtonSize, number> = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
};
```

- [ ] **Step 3: Rewrite Button index.tsx**

Replace the Tailwind class composition with CSS class composition:

```tsx
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { buttonVariantClass, buttonSizeClass, buttonIconSize } from './Button.variants';
import type { ButtonVariant, ButtonSize } from './Button.variants';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    outline?: boolean;
    fullWidth?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', outline, fullWidth, disabled, isLoading, className, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'btn',
                    buttonVariantClass[variant],
                    buttonSizeClass[size],
                    outline && 'btn-outline',
                    fullWidth && 'btn-full',
                    className,
                )}
                disabled={disabled || isLoading}
                aria-disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <LoadingSpinner />}
                {children}
            </button>
        );
    },
);
```

Note: Read the current file to preserve the LoadingSpinner inline SVG, the compound API (`Button.Root`, `Button.Icon`, `Button.Label`), and any other features. Adapt them to use CSS classes instead of Tailwind strings.

- [ ] **Step 4: Update Button tests**

Change assertions from `toHaveClass('bg-[var(--color-primary)]')` to `toHaveClass('btn-primary')`. Update all class-based assertions.

- [ ] **Step 5: Run tests**

Run: `cd packages/components && pnpm vitest run src/primitives/Button/`
Expected: All Button tests pass.

- [ ] **Step 6: Commit**

```bash
git add packages/components/src/primitives/Button/
git commit -m "refactor: migrate Button to CSS variable styling"
```

---

### Task 8: Refactor Card, Badge, Label components

Follow the Button pattern. For each component:
1. Read the current variant file and component
2. Rewrite variant file to class-name mappings
3. Rewrite component to use `cn('card', ...)` / `cn('badge', ...)` / `cn('label', ...)`
4. Update tests

**Files:**
- Modify: `packages/components/src/primitives/Card/` (3 files)
- Modify: `packages/components/src/primitives/Badge/` (3 files)
- Modify: `packages/components/src/primitives/Label/` (3 files)

- [ ] **Step 1-4: Refactor each component following Task 7 pattern**
- [ ] **Step 5: Run tests:** `cd packages/components && pnpm vitest run src/primitives/Card/ src/primitives/Badge/ src/primitives/Label/`
- [ ] **Step 6: Commit**

```bash
git add packages/components/src/primitives/Card/ packages/components/src/primitives/Badge/ packages/components/src/primitives/Label/
git commit -m "refactor: migrate Card, Badge, Label to CSS variable styling"
```

---

### Task 9: Refactor Input, Select, Textarea components

These share the `form-control` base class. Each component becomes `cn('form-control', 'input', sizeClass, ...)`.

**Files:**
- Modify: `packages/components/src/primitives/Input/` (3 files)
- Modify: `packages/components/src/primitives/Select/` (3 files)
- Modify: `packages/components/src/primitives/Textarea/` (3 files)

- [ ] **Step 1-4: Refactor each following the pattern**

Key: These currently have compound APIs (Input.Root, Input.Field, Input.Error). Preserve those. The Root wrapper gets the `form-control` base class. The Field (the actual input element) inherits styling via CSS.

- [ ] **Step 5: Run tests**
- [ ] **Step 6: Commit**

```bash
git add packages/components/src/primitives/Input/ packages/components/src/primitives/Select/ packages/components/src/primitives/Textarea/
git commit -m "refactor: migrate Input, Select, Textarea to CSS variable styling"
```

---

### Task 10: Refactor Checkbox, Switch, Avatar components

Multi-slot components. Switch needs special care with track/knob/translate.

**Files:**
- Modify: `packages/components/src/primitives/Checkbox/` (3 files)
- Modify: `packages/components/src/primitives/Switch/` (3 files)
- Modify: `packages/components/src/primitives/Avatar/` (3 files)

- [ ] **Step 1-4: Refactor each following the pattern**
- [ ] **Step 5: Run tests**
- [ ] **Step 6: Commit**

```bash
git add packages/components/src/primitives/Checkbox/ packages/components/src/primitives/Switch/ packages/components/src/primitives/Avatar/
git commit -m "refactor: migrate Checkbox, Switch, Avatar to CSS variable styling"
```

---

### Task 11: Refactor remaining primitives

Skeleton, LoadingSpinner, FilterChip, EmptyState, IndeterminateProgress, SearchInput.

**Files:**
- Modify: 6 component directories (3 files each)

- [ ] **Step 1-4: Refactor each following the pattern**
- [ ] **Step 5: Run tests**
- [ ] **Step 6: Commit**

```bash
git add packages/components/src/primitives/Skeleton/ packages/components/src/primitives/LoadingSpinner/ packages/components/src/primitives/FilterChip/ packages/components/src/primitives/EmptyState/ packages/components/src/primitives/IndeterminateProgress/ packages/components/src/primitives/SearchInput/
git commit -m "refactor: migrate remaining primitives to CSS variable styling"
```

---

### Task 12: Refactor composite components

Tabs, Pagination, Dropdown, ComboSelect, DateRangePicker, IconSelect, MultiIconSelect.

**Files:**
- Modify: 7 composite directories

- [ ] **Step 1-4: Refactor each**

Composite variants are raw class strings. Replace with CSS class references. Preserve HeadlessUI integration (Combobox, Menu, Popover components).

- [ ] **Step 5: Run tests**
- [ ] **Step 6: Commit**

```bash
git add packages/components/src/composite/
git commit -m "refactor: migrate composite components to CSS variable styling"
```

---

## Chunk 3: Cleanup and Verification

### Task 13: Remove deprecated types and utilities

**Files:**
- Modify: `packages/components/src/utils/types.ts`

- [ ] **Step 1: Read current types.ts**

- [ ] **Step 2: Remove VariantDefinition, SizeDefinition, resolveVariant()**

Keep: `BaseComponentProps`, `InteractiveProps`, `WidthProps`, `BaseVariant`, `BaseSize`, and any other types still used by components.

Delete: `VariantDefinition`, `SizeDefinition`, `resolveVariant()`.

Verify no component still imports them:
```bash
grep -r "VariantDefinition\|SizeDefinition\|resolveVariant" packages/components/src/ --include="*.ts" --include="*.tsx"
```

- [ ] **Step 3: Commit**

```bash
git add packages/components/src/utils/types.ts
git commit -m "refactor: remove VariantDefinition, SizeDefinition, and resolveVariant"
```

---

### Task 14: Full test suite and quality check

- [ ] **Step 1: Run all component tests**

Run: `cd packages/components && pnpm vitest run`
Expected: All tests pass.

- [ ] **Step 2: Run typecheck**

Run: `cd packages/components && pnpm exec tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Run full quality**

Run: `pnpm quality`
Expected: All checks pass.

- [ ] **Step 4: Fix any issues and commit**

```bash
git add packages/
git commit -m "fix: resolve quality issues from CSS variable migration"
```
