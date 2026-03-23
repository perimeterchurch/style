/**
 * Generates named theme CSS blocks and manages theme imports in the base CSS file.
 */

/** Generate a CSS block for a named theme using data-theme selector. */
export function generateThemeCss(name: string, tokens: Record<string, string>): string {
    const declarations = Object.entries(tokens)
        .map(([prop, value]) => `    ${prop}: ${value};`)
        .join('\n');

    return `[data-theme='${name}'] {\n${declarations}\n}\n`;
}

/** Slugify a theme name for use in filenames (lowercase, hyphens, no spaces). */
export function slugifyThemeName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Add a theme import line to a base CSS file.
 * Inserts after the last @import statement. Skips if already present.
 */
export function generateBaseImport(baseCss: string, name: string): string {
    const slug = slugifyThemeName(name);
    const importLine = `@import './themes/theme-${slug}.css';`;

    // Don't duplicate
    if (baseCss.includes(`theme-${slug}.css`)) {
        return baseCss;
    }

    const lines = baseCss.split('\n');

    // Find last @import line index
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('@import')) {
            lastImportIdx = i;
        }
    }

    if (lastImportIdx === -1) {
        // No imports at all — prepend
        return importLine + '\n' + baseCss;
    }

    // Insert after the last import
    lines.splice(lastImportIdx + 1, 0, importLine);
    return lines.join('\n');
}
