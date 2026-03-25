/**
 * Generate registry.json from component source files.
 *
 * Scans registry/new-york/ui/ for all .tsx files, extracts npm dependencies
 * and inter-component registryDependencies from import statements, and
 * writes the complete registry.json manifest.
 *
 * Run: pnpm tsx scripts/generate-registry.ts
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const UI_DIR = join(ROOT, "registry/new-york/ui");
const THEMES_DIR = join(ROOT, "registry/themes");
const BASE_FILE = join(ROOT, "registry/base.json");
const OUTPUT = join(ROOT, "registry.json");

interface RegistryItem {
  name: string;
  type: string;
  description?: string;
  files: Array<{ path: string; type: string }>;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  cssVars?: Record<string, Record<string, string>>;
}

/** Extract npm package dependencies from import statements */
function extractDependencies(source: string): string[] {
  const deps = new Set<string>();
  const importRe = /from\s+["']([^./][^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = importRe.exec(source)) !== null) {
    const pkg = match[1];
    // Skip internal imports and Next.js/React built-ins
    if (pkg.startsWith("@/") || pkg === "react" || pkg === "react-dom" || pkg.startsWith("next/")) continue;
    // Get the package name (handle scoped packages)
    if (pkg.startsWith("@")) {
      const parts = pkg.split("/");
      deps.add(`${parts[0]}/${parts[1]}`);
    } else {
      deps.add(pkg.split("/")[0]);
    }
  }
  return [...deps].sort();
}

/** Extract registryDependencies — other UI components imported from the registry */
function extractRegistryDeps(source: string): string[] {
  const deps = new Set<string>();
  // Match imports from @/registry/new-york/ui/... or @/components/ui/...
  const re = /from\s+["']@\/(?:registry\/new-york\/ui|components\/ui)\/([\w-]+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    deps.add(match[1]);
  }
  // Also check for @/lib/utils import → registryDependency on "utils"
  if (/from\s+["']@\/lib\/utils["']/.test(source)) {
    deps.add("utils");
  }
  return [...deps].sort();
}

async function generateRegistry() {
  const items: RegistryItem[] = [];

  // 1. Add utils lib
  items.push({
    name: "utils",
    type: "registry:lib",
    files: [{ path: "src/lib/utils.ts", type: "registry:lib" }],
    dependencies: ["clsx", "tailwind-merge"],
  });

  // 2. Add hooks (check if hooks directory exists)
  try {
    const hooksDir = join(ROOT, "src/hooks");
    const hookFiles = await readdir(hooksDir);
    for (const file of hookFiles) {
      if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
      const name = file.replace(/\.tsx?$/, "");
      items.push({
        name,
        type: "registry:hook",
        files: [{ path: `src/hooks/${file}`, type: "registry:hook" }],
      });
    }
  } catch {
    // No hooks directory — skip
  }

  // 3. Add base item (registry:base)
  try {
    const baseContent = await readFile(BASE_FILE, "utf-8");
    const base = JSON.parse(baseContent) as {
      name: string;
      type: string;
      description?: string;
      dependencies?: string[];
      registryDependencies?: string[];
      cssVars?: Record<string, Record<string, string>>;
    };
    const baseItem: RegistryItem = {
      name: base.name,
      type: base.type,
      files: [],
    };
    if (base.description) baseItem.description = base.description;
    if (base.dependencies) baseItem.dependencies = base.dependencies;
    if (base.registryDependencies) baseItem.registryDependencies = base.registryDependencies;
    if (base.cssVars) baseItem.cssVars = base.cssVars;
    items.push(baseItem);
  } catch {
    // No base.json — skip
  }

  // 4. Scan UI components
  const uiFiles = await readdir(UI_DIR);
  for (const file of uiFiles) {
    if (!file.endsWith(".tsx")) continue;
    if (file === "index.tsx") continue;

    const name = file.replace(/\.tsx$/, "");
    const source = await readFile(join(UI_DIR, file), "utf-8");
    const dependencies = extractDependencies(source);
    const registryDependencies = extractRegistryDeps(source);

    const item: RegistryItem = {
      name,
      type: "registry:ui",
      files: [{ path: `registry/new-york/ui/${file}`, type: "registry:ui" }],
    };

    if (dependencies.length > 0) item.dependencies = dependencies;
    if (registryDependencies.length > 0) item.registryDependencies = registryDependencies;

    items.push(item);
  }

  // 5. Scan theme files
  try {
    const themeFiles = await readdir(THEMES_DIR);
    for (const file of themeFiles) {
      if (!file.endsWith(".json")) continue;
      const content = await readFile(join(THEMES_DIR, file), "utf-8");
      const theme = JSON.parse(content) as { name: string; type: string; cssVars?: Record<string, Record<string, string>> };
      items.push({
        name: theme.name,
        type: theme.type || "registry:theme",
        files: [{ path: `registry/themes/${file}`, type: "registry:theme" }],
        cssVars: theme.cssVars,
      });
    }
  } catch {
    // No themes directory — skip
  }

  // 6. Write registry.json
  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "perimeter",
    homepage: "https://perimeter.church",
    items,
  };

  await writeFile(OUTPUT, JSON.stringify(registry, null, 2) + "\n", "utf-8");
  console.log(`Generated registry.json with ${items.length} items`);
}

generateRegistry().catch((err) => {
  console.error("Failed to generate registry:", err);
  process.exit(1);
});
