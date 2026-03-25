export function exportAsCSS(
  light: Record<string, string>,
  dark: Record<string, string>,
): string {
  const lightBlock = Object.entries(light)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n");
  const darkBlock = Object.entries(dark)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n");
  return `:root {\n${lightBlock}\n}\n\n.dark {\n${darkBlock}\n}`;
}

export function exportAsRegistryTheme(
  name: string,
  light: Record<string, string>,
  dark: Record<string, string>,
) {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:theme",
    cssVars: { light, dark },
  };
}
