# Storybook Addon UX Redesign

## Summary

Redesign the Token Editor and Variant Creator Storybook addon panels to be intuitive, visually rich, and built with the design system's own components. The current implementation uses raw HTML elements with inline styles and an append-only class editing model. The new design introduces a visual property grid for variants, first-class "New Variant" creation from defaults, and replaces all raw elements with `@perimeterchurch/style` components.

## Goals

1. Make variant creation/editing intuitive — think in terms of "background is primary" not `bg-[var(--color-primary)]`
2. Add "New Variant from default" as a first-class action (distinct from Clone)
3. Use custom design system components (`Button`, `Input`, `Select`, `Tabs`, `Card`, `Badge`, `SearchInput`, `Textarea`, `Checkbox`) inside the addon panels
4. Improve token editor with per-token reset and better dirty-state indicators

## Non-Goals

- Changing the server middleware or API endpoints (read/write-tokens, read/write-variants)
- Changing the variant definition data model (`VariantDefinition`, `SizeDefinition`) — we reuse `_meta.clonedFrom` for "based on" provenance in both Clone and New Variant flows
- Changing the Storybook channel API or preview.ts live-preview behavior
- Adding new token categories or editor types

## Dependency Changes

The storybook-addon package currently has no dependency on the components or tokens packages. The following workspace dependencies must be added to `packages/storybook-addon/package.json`:

```json
{
  "dependencies": {
    "@perimeterchurch/style": "workspace:*"
  }
}
```

This provides access to all primitives and the token CSS.

**Note:** `@headlessui/react` is NOT required. The `Tabs` composite component is a custom implementation that does not use headlessui. Only `ComboSelect`, `Dropdown`, `IconSelect`, and `MultiIconSelect` require headlessui, and none are used in this redesign.

**Decision: Use `Select` (primitive) for token pickers, `Tabs` (composite) for category navigation.** `ComboSelect` is not used — the token dropdown with `Select` is sufficient.

---

## Section 1: Variant Creator — List View Redesign

### Current State

Flat list of variant names with Edit/Clone/Delete buttons. No visual indication of what each variant looks like. No way to create a new variant from scratch — only clone.

### New Design

The list view becomes a **variant card grid**. Each variant gets a `Card` component showing:

- **Variant name** as the card title
- **Badge** indicator for custom variants (those with `_meta`)
- **Color swatch strip** — 3-4 small colored circles showing the base background, text, and border token colors extracted from the variant definition, providing instant visual identity
- **Action buttons** using `Button` components: Edit, Clone, Delete

#### Top-Level Toolbar

Above the grid:

- **"New Variant" button** — opens a creation flow where you pick a source variant to base it on (defaults to `primary` / first variant). Includes a "Blank" option that initializes with `base: ""` and all other states empty — the property grid handles this gracefully by showing all cells as "None" / "Click to assign a token". This is the primary creation action.
- **"New Size" button** — same pattern for sizes
- Section headers ("Variants" / "Sizes") use design system typography

#### Clone vs New Variant

- **Clone** stays on each card — quick duplicate of that specific variant
- **New Variant** is a top-level action — presents a dropdown/select to pick which variant to base it on

### Components Used

- `Card` — variant cards
- `Button` — all actions (New Variant, New Size, Edit, Clone, Delete)
- `Badge` — custom variant indicator, variant count
- `Select` — source variant picker in "New Variant" flow

---

## Section 2: Variant Editor — Visual Property Grid

### Current State

Six state sections (base, hover, active, focus, disabled, outline), each with four PropertyPickers that only append classes plus a raw textarea. No way to see current values, remove individual properties, or understand the variant without reading raw CSS.

### New Design

The editor becomes a **structured form** organized as a property grid.

#### Header Area

- Variant name field using `Input` component
- "Based on: primary" label using `Badge` (when created from another variant)

#### Property Grid

Each state (base, hover, active, focus, disabled, outline) is a collapsible section using `Card` with a grid of **property cells**. Each cell represents one property type (background, text, border, ring):

- **Property label** (e.g., "Background")
- **Current value display** — color swatch circle + token name (e.g., `--color-primary`) or "None"
- **Click to edit** — inline picker using `Select`, filtered to relevant tokens
- **Clear button** (x) — removes that property from the state

The grid parses existing Tailwind classes to extract current values:
- `bg-[var(--color-primary)] text-[var(--color-primary-foreground)]` displays as: Background = `--color-primary`, Text = `--color-primary-foreground`

#### Advanced Section (collapsed by default)

- `Textarea` for each state's full class string
- Label: "Additional classes" — for extras the property grid doesn't cover (e.g., `rounded-lg`, `shadow-md`, `transition-colors`)

#### Footer

- Save / Cancel using `Button` components

#### Key Behavior Change

The editor **reads and displays current state** rather than starting blank. Editing a property **replaces** the old class for that property type rather than appending a duplicate.

### Components Used

- `Input` — variant name
- `Card` — state sections
- `Select` — token picker per property
- `Badge` — "Based on" indicator
- `Textarea` — advanced additional classes
- `Button` — Save, Cancel

---

## Section 3: Custom Components in Addon Panels

### Challenge

The Storybook manager iframe doesn't have Tailwind CSS or design tokens loaded. Components depend on both.

### Solution: Pre-Built CSS Bundle for Manager

The manager iframe has its own bundler pipeline separate from the preview. We cannot rely on Tailwind v4's Vite plugin to process utilities at build time in the manager context. Instead:

1. **Add a dedicated build step** in the storybook-addon package that produces a single `addon-components.css` bundle. This uses Tailwind CLI (or a Vite build) to scan the addon panel source files and the component source files, generating only the utilities actually used by the addon UI. The output is a self-contained CSS file with tokens + utilities.

2. **Import the bundle in `manager.ts`** — Storybook's manager bundler (esbuild) supports CSS imports. The CSS is injected into the manager document head automatically.

3. **Alternatively, use a `<style>` tag injection** in `AddonProvider.tsx` that inlines the pre-built CSS string (imported as a raw string via `?inline` or `?raw` Vite query). This avoids relying on the manager bundler's CSS handling.

The key insight: the set of Tailwind utilities used by the addon panels is **finite and known at build time** — we only use the specific classes that our components generate. This makes a pre-built bundle feasible and small.

#### Component Swap Map

| Current | Replaced With |
|---------|--------------|
| Inline-styled `<button>` | `Button` (primary/secondary/ghost variants) |
| Raw `<input type="text">` | `Input` |
| Raw `<textarea>` | `Textarea` |
| Raw `<select>` | `Select` |
| Custom `CategoryTabs` | `Tabs` composite |
| Section wrappers | `Card` |
| Count indicators | `Badge` |
| Search input | `SearchInput` |
| Raw `<input type="checkbox">` | `Checkbox` |

#### Theme Compatibility

- Set `data-theme` on addon wrapper to match Storybook's light/dark mode
- Components automatically follow the theme via CSS custom properties

#### CSS Scoping

Wrap each panel in a container div with a scoping class `.style-addon-root` to isolate the injected CSS:

- The pre-built CSS bundle nests all rules under `.style-addon-root` (using Tailwind's `important` selector or a CSS nesting wrapper), preventing token resets, preflight styles, or utility classes from leaking into Storybook's own sidebar/toolbar/search
- `@layer` declarations are used to ensure addon styles don't compete with Storybook's specificity: `@layer style-addon { ... }`
- Tailwind's preflight/reset is **excluded** from the bundle — only utilities and component styles are included. This prevents normalizing `button`, `input`, etc. in ways that break Storybook's manager UI

---

## Section 4: Token Editor Improvements

### Component Upgrades

Same swap map as Section 3:
- `CategoryTabs` -> `Tabs`
- `TokenSearch` -> `SearchInput`
- Toolbar buttons -> `Button`
- Token group headers -> `Card` with collapsible behavior
- Theme name dialog -> `Input` + `Button` in a `Card`

### Functional Improvements

- **Dirty token indicators** — modified tokens get a `Badge` showing "modified" and a subtle highlight on the card
- **Per-token reset** — small reset button on each modified token to revert individual changes (currently only bulk reset exists)
- **Search context** — when searching, show the category each result belongs to as a `Badge` next to the token name

---

## Section 5: Tailwind Class Parsing

The property grid requires parsing existing Tailwind classes into structured data and writing them back.

### Parser: `parseTailwindClasses(classString)`

Input: A state's class string
Output: Structured property map + additional classes

```
"bg-[var(--color-primary)] text-white rounded-lg shadow-md"
  -> {
       background: { token: "--color-primary", raw: "bg-[var(--color-primary)]" },
       text: { literal: "white", raw: "text-white" },
       border: null,
       ring: null,
     }
  -> additionalClasses: "rounded-lg shadow-md"
```

Pattern matching:
- `bg-[var(--token)]` -> background property
- `text-[var(--token)]` -> text property
- `border-[var(--token)]` or `border-{n} border-[var(--token)]` -> border property
- `ring-[var(--token)]` or `ring-{n} ring-[var(--token)]` -> ring property
- Everything else -> additional classes bucket

### Writer: `buildClassString(properties, additionalClasses)`

Reassembles the full class string from structured data. Replacing a property replaces just that property's class(es) and preserves everything else.

### State Prefix Handling

For non-base states, the parser strips the state prefix before matching. The writer adds it back. The property grid shows clean values without prefixes.

**Important prefix mapping** (must match existing `PropertyPicker.tsx` behavior):

| State | Prefix | Notes |
|-------|--------|-------|
| base | (none) | |
| hover | `hover:` | |
| active | `active:` | |
| focus | `focus-visible:` | NOT `focus:` — the existing system uses `focus-visible:` |
| disabled | `disabled:` | |
| outline | (none) | Outline has no state prefix — it is a completely separate set of base-level classes. The parser must not confuse outline classes with base classes. Disambiguation happens at the data model level: the variant definition stores `base` and `outline` as separate keys. |

### Edge Cases

- **Literal values** (`text-white`, `bg-black`) — parsed as literals, displayed without swatch
- **Compound classes** (`border-2 border-[var(--color-primary)]`) — grouped as single property entry
- **Unrecognized patterns** — preserved in additional classes, never lost
- **`focus-visible:` prefix** — must be parsed as a single prefix token, not split on the colon

### Characteristics

Pure semantic function: well-defined inputs/outputs, no side effects, highly unit-testable.

---

## File Impact

### New Files

| File | Purpose |
|------|---------|
| `src/panels/utils/parseTailwindClasses.ts` | Tailwind class parser + writer |
| `src/panels/utils/parseTailwindClasses.test.ts` | Unit tests for parser |
| `src/panels/VariantCreator/VariantCard.tsx` | Card display for a single variant |
| `src/panels/VariantCreator/NewVariantFlow.tsx` | Source variant picker + creation flow |
| `src/panels/VariantCreator/PropertyCell.tsx` | Single property cell in the grid |
| `src/panels/VariantCreator/PropertyGrid.tsx` | Grid of property cells for a state |
| `src/panels/shared/AddonProvider.tsx` | CSS injection + theme wrapper for custom components |
| `src/panels/shared/HintText.tsx` | Dismissable hint text component with localStorage persistence |
| `src/panels/shared/HelpToggle.tsx` | "?" toolbar button to re-enable hints |

### Modified Files

| File | Changes |
|------|---------|
| `packages/storybook-addon/package.json` | Add workspace dep on `@perimeterchurch/style`, add `@headlessui/react` |

### Panel Modified Files

| File | Changes |
|------|---------|
| `src/manager.ts` | Import AddonProvider, wrap panels |
| `src/panels/VariantCreator/VariantCreator.tsx` | New list view with cards, "New Variant" action |
| `src/panels/VariantCreator/VariantList.tsx` | Rewrite with Card grid, custom components |
| `src/panels/VariantCreator/VariantEditor.tsx` | Rewrite with property grid, custom components |
| `src/panels/VariantCreator/PropertyPicker.tsx` | Refactor to work as inline cell picker |
| `src/panels/VariantCreator/CssEditor.tsx` | Swap to Textarea component, "Additional classes" label |
| `src/panels/TokenEditor/TokenEditor.tsx` | Custom components, per-token reset, dirty indicators |
| `src/panels/TokenEditor/CategoryTabs.tsx` | Replace with Tabs composite |
| `src/panels/TokenEditor/TokenSearch.tsx` | Replace with SearchInput |
| `src/panels/TokenEditor/TokenGroup.tsx` | Card-based collapsible groups |
| `src/panels/TokenEditor/editors/*.tsx` | Swap raw inputs for custom components |

### Deleted Files

None — all existing files are modified in place or supplemented.

---

## Section 6: Hints, Help Text, and Contextual Guidance

### Problem

The current addon provides no guidance about what anything does. A user seeing the variant editor for the first time has no idea what "base", "hover", "outline" states mean in practice, what tokens are available, or what the expected workflow is. The addon assumes expertise.

### Contextual Hints

Each major section gets inline hint text that explains what it does, visible on first use and dismissable:

#### Variant List View

- **Panel header hint:** "Variants control how a component looks across different visual styles (primary, secondary, destructive). Sizes control padding, font size, and icon dimensions."
- **New Variant button tooltip:** "Create a new variant starting from an existing one as a base. Your new variant will be saved to the component's .variants.ts file."

#### Variant Editor — Property Grid

- **State section hints** (shown as muted helper text below each state header):
  - **base:** "Default appearance — always applied"
  - **hover:** "Applied when the user hovers over the component"
  - **active:** "Applied when the component is being clicked/pressed"
  - **focus:** "Applied when the component receives keyboard focus"
  - **disabled:** "Applied when the component is disabled"
  - **outline:** "Alternative outline style — uses border instead of filled background"
- **Property cell hint** (shown when a cell is empty): "Click to assign a token"
- **Additional classes hint:** "Add Tailwind classes the property grid doesn't cover, like rounded-lg or shadow-md"

#### Token Editor

- **Panel header hint:** "Design tokens are the shared values (colors, spacing, shadows) used across all components. Changes here update the live preview instantly."
- **Save button tooltip:** "Writes changes to tokens.css — Vite HMR will reload automatically"
- **Save as Theme tooltip:** "Creates a new theme CSS file with all current token values"
- **Per-token modified indicator tooltip:** "This token has unsaved changes. Click the reset icon to revert."

### Implementation

- Hints use a small `HintText` inline component — muted text at `fontSize: 11`, using `theme.color.mediumdark` (or the design system equivalent once components are swapped)
- **First-use hints** are stored in `localStorage` under `style-addon-hints-dismissed`. Once dismissed, they stay hidden. A small "?" icon in the panel toolbar re-enables them.
- **Tooltips** on buttons use the `title` attribute for simplicity (native browser tooltips). If the design system adds a Tooltip component later, these can be upgraded.
- **Empty states** — when a component has no custom variants yet, show an `EmptyState` component (already in the design system) with a message like "No custom variants yet" and a prominent "New Variant" CTA

### Help Icon

A small "?" button in the top-right of each panel toolbar that:
- Toggles all contextual hints back on
- Links to the relevant docs page (`docs/architecture/storybook-addon.md`) — displayed as "Learn more" text

---

## Testing Strategy

- **Unit tests** for `parseTailwindClasses` — the most logic-dense new code, covering all edge cases (literals, compounds, focus-visible prefix, outline disambiguation, empty strings)
- **Unit tests** for `AddonProvider` — verify CSS injection occurs, `data-theme` is set correctly, scoping class is applied
- **Update existing `TokenEditor.test.tsx`** and `VariantCreator.test.tsx` for new UI structure
- **Manual testing** in Storybook dev mode for:
  - CSS injection doesn't break Storybook's own sidebar, toolbar, or search
  - Custom components render correctly in manager iframe
  - Light/dark theme switching works
  - New Variant from default flow end-to-end
  - New Variant "Blank" option produces valid empty variant
  - Property grid correctly reads/writes existing variant definitions
  - Token editor per-token reset
  - Hint dismissal persists across page reloads
  - Help toggle re-enables dismissed hints
