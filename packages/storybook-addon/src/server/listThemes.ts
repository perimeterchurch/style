import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface ThemeInfo {
    name: string;
    slug: string;
    filename: string;
}

const THEME_SELECTOR_RE = /\[data-theme=['"]([\w-]+)['"]\]/;

export function parseThemeNameFromCss(css: string): string | null {
    const match = THEME_SELECTOR_RE.exec(css);
    return match ? match[1] : null;
}

export async function listThemes(themesDir: string): Promise<ThemeInfo[]> {
    const files = await readdir(themesDir);
    const themes: ThemeInfo[] = [];
    for (const file of files) {
        if (!file.endsWith('.css')) continue;
        const content = await readFile(join(themesDir, file), 'utf-8');
        const name = parseThemeNameFromCss(content);
        if (name) themes.push({ name, slug: name, filename: file });
    }
    return themes.sort((a, b) => a.name.localeCompare(b.name));
}
