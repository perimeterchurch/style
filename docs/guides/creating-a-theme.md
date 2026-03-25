# Creating a Theme

## Via the Theme Editor

1. Open `/editor` in the browser
2. Adjust token values using the color pickers and sliders
3. Toggle Light/Dark to edit both modes
4. Click **Save** in the theme selector — enter a name
5. Click **Download .json** to export as a registry theme file
6. Place the downloaded file in `registry/themes/`
7. Run `pnpm tsx scripts/generate-registry.ts && pnpm registry:build`

## Via JSON

Create a file in `registry/themes/[name].json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "my-theme",
  "type": "registry:theme",
  "cssVars": {
    "light": {
      "primary": "oklch(0.45 0.12 250)",
      "primary-foreground": "oklch(0.985 0 0)",
      "ring": "oklch(0.45 0.12 250)"
    },
    "dark": {
      "primary": "oklch(0.55 0.12 250)",
      "primary-foreground": "oklch(0.985 0 0)",
      "ring": "oklch(0.55 0.12 250)"
    }
  }
}
```

Only include tokens you want to override. Unspecified tokens inherit from the base palette.

Then regenerate:

```bash
pnpm tsx scripts/generate-registry.ts
pnpm registry:build
```

## Token Reference

See [Token Architecture](../architecture/tokens.md) for the full list of available tokens, naming conventions, and OKLCH format details.
