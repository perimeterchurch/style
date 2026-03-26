import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

interface ThemeFile {
  name: string;
  cssVars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

function cssBlock(selector: string, vars: Record<string, string>): string {
  const entries = Object.entries(vars)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
  return `${selector} {\n${entries}\n}`;
}

async function generateThemeCSS() {
  const themesDir = join(process.cwd(), "registry", "themes");
  const outputDir = join(process.cwd(), "src", "styles");
  const outputPath = join(outputDir, "themes.css");

  const files = await readdir(themesDir);
  const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();

  const blocks: string[] = [
    "/* Auto-generated from registry/themes/ — do not edit manually */",
    "",
  ];

  const defaultFile = jsonFiles.find((f) => f === "default.json");
  if (!defaultFile) {
    throw new Error("registry/themes/default.json is required");
  }

  const defaultTheme: ThemeFile = JSON.parse(
    await readFile(join(themesDir, defaultFile), "utf-8"),
  );
  blocks.push(cssBlock(":root", defaultTheme.cssVars.light));
  blocks.push("");
  blocks.push(cssBlock(".dark", defaultTheme.cssVars.dark));

  for (const file of jsonFiles) {
    if (file === "default.json") continue;

    const theme: ThemeFile = JSON.parse(
      await readFile(join(themesDir, file), "utf-8"),
    );
    const slug = file.replace(".json", "").replace(/-theme$/, "");

    blocks.push("");
    blocks.push(cssBlock(`[data-theme="${slug}"]`, theme.cssVars.light));
    blocks.push("");
    blocks.push(cssBlock(`[data-theme="${slug}"].dark`, theme.cssVars.dark));
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, blocks.join("\n") + "\n");
  console.log(`Generated ${outputPath} from ${jsonFiles.length} theme(s)`);
}

generateThemeCSS().catch((err) => {
  console.error("Failed to generate theme CSS:", err);
  process.exit(1);
});
