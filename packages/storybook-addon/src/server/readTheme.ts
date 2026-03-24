import { readFile } from 'node:fs/promises';

const DECLARATION_RE = /\s*(--[\w-]+)\s*:\s*(.+?)\s*;/g;

export function parseThemeTokens(css: string): Record<string, string> {
    const tokens: Record<string, string> = {};
    let match;
    while ((match = DECLARATION_RE.exec(css)) !== null) {
        tokens[match[1]] = match[2];
    }
    DECLARATION_RE.lastIndex = 0;
    return tokens;
}

export async function readThemeFile(filePath: string): Promise<Record<string, string>> {
    const css = await readFile(filePath, 'utf-8');
    return parseThemeTokens(css);
}
