# Adding a Variant

How to add a new visual variant to an existing component.

## Step 1: Open the Variants File

Variants are defined in `packages/components/src/primitives/<Name>/<Name>.variants.ts` (or `composite/` for composite components).

## Step 2: Add the Variant Entry

Add a new key to the component's variants record. Use token-based CSS variables for all colors.

Example — adding a `dark` variant to Button:

```ts
// In packages/components/src/primitives/Button/Button.variants.ts

export const buttonVariants: Record<string, VariantDefinition> = {
    // ... existing variants ...
    dark: {
        base: 'bg-stone-900 text-white',
        hover: 'hover:bg-stone-800',
        active: 'active:bg-stone-700',
        focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/50 focus-visible:ring-offset-2',
        outline: 'border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white',
    },
};
```

### VariantDefinition Fields

| Field | Required | Description |
| --- | --- | --- |
| `base` | Yes | Always-applied classes |
| `hover` | No | `hover:` prefixed classes |
| `active` | No | `active:` prefixed classes |
| `focus` | No | `focus-visible:` prefixed classes |
| `disabled` | No | `disabled:` prefixed classes |
| `outline` | No | Alternate border-based appearance |
| `_meta` | No | Metadata (clonedFrom, createdAt) |

### Rules

- Use `var()` references for semantic colors: `bg-[var(--color-primary)]`
- Use `hover:` prefix on hover classes, `active:` on active, etc.
- The `outline` field replaces `base` when `resolveVariant(def, { outline: true })` is called
- If a component uses `dark:` prefixed Tailwind classes, include those in the appropriate field

## Step 3: Update the Type (if Needed)

If the variants record is typed as `Record<string, VariantDefinition>`, no type change is needed — the new key is automatically valid.

If there is an explicit union type, update it:

```ts
export type ButtonVariant = keyof typeof buttonVariants;
// This auto-updates since it derives from the record
```

## Step 4: Verify

```bash
# Tests — existing "renders all variants" test will automatically pick up the new variant
cd packages/components && pnpm test

# Types
pnpm typecheck

# Visual check in Storybook — AllVariants story auto-iterates
pnpm dev
```

No test changes needed — the standard "renders all variants without crashing" test uses `Object.keys(variants)` and automatically covers new entries.

## Step 5: Add a Size (if Applicable)

To add a new size, follow the same pattern with the sizes record:

```ts
export const buttonSizes: Record<string, SizeDefinition> = {
    // ... existing sizes ...
    '2xl': { padding: 'px-8 py-4', fontSize: 'text-2xl', iconSize: 24, radius: 'rounded-2xl' },
};
```

### SizeDefinition Fields

| Field | Required | Description |
| --- | --- | --- |
| `padding` | Yes | Padding classes (e.g., `px-4 py-2`) |
| `fontSize` | Yes | Font size class (e.g., `text-base`) |
| `iconSize` | No | Icon size in pixels |
| `radius` | No | Border radius class |
