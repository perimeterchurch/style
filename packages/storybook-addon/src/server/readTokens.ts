/**
 * Parses design tokens from a dual-block CSS file:
 *   - @theme { } block (Tailwind build-time values)
 *   - :root, .storybook-root { } block (runtime overrides)
 *
 * :root values take precedence when a token appears in both blocks.
 */

export type TokenRecord = Record<string, string>;

export interface CategorizedTokens {
    Colors: Record<string, Record<string, string>>;
    Typography: Record<string, Record<string, string>>;
    Spacing: Record<string, string>;
    Shadows: Record<string, string>;
    Radii: Record<string, string>;
    Transitions: Record<string, string>;
    Other: Record<string, string>;
}

/** Extract the content between the outermost braces of a CSS block. */
function extractBlockContent(css: string, blockStart: number): string {
    let depth = 0;
    let start = -1;
    for (let i = blockStart; i < css.length; i++) {
        if (css[i] === '{') {
            if (depth === 0) start = i + 1;
            depth++;
        } else if (css[i] === '}') {
            depth--;
            if (depth === 0) {
                return css.slice(start, i);
            }
        }
    }
    return '';
}

/** Parse CSS custom property declarations from a block's content. */
function parseDeclarations(content: string): TokenRecord {
    const tokens: TokenRecord = {};
    const lines = content.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('--')) continue;
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx === -1) continue;
        const name = trimmed.slice(0, colonIdx).trim();
        let value = trimmed.slice(colonIdx + 1).trim();
        // Remove trailing semicolon
        if (value.endsWith(';')) {
            value = value.slice(0, -1).trim();
        }
        tokens[name] = value;
    }
    return tokens;
}

/** Parse tokens from both @theme and :root blocks. :root values take precedence. */
export function parseTokensFromCss(css: string): TokenRecord {
    if (!css.trim()) return {};

    const tokens: TokenRecord = {};

    // Parse @theme block
    const themeIdx = css.indexOf('@theme');
    if (themeIdx !== -1) {
        const themeContent = extractBlockContent(css, themeIdx);
        Object.assign(tokens, parseDeclarations(themeContent));
    }

    // Parse :root block — values here override @theme
    const rootIdx = css.indexOf(':root');
    if (rootIdx !== -1) {
        const rootContent = extractBlockContent(css, rootIdx);
        Object.assign(tokens, parseDeclarations(rootContent));
    }

    return tokens;
}

/** Color sub-group mapping based on token prefix patterns. */
function colorSubGroup(name: string): string {
    if (name.startsWith('--color-primary')) return 'Primary';
    if (name.startsWith('--color-success')) return 'Success';
    if (name.startsWith('--color-warning')) return 'Warning';
    if (name.startsWith('--color-error') || name.startsWith('--color-destructive')) return 'Error';
    if (name.startsWith('--color-info')) return 'Info';
    if (name.startsWith('--color-stone')) return 'Stone Scale';
    // surface-level colors
    return 'Surface';
}

/** Categorize a flat token record into grouped categories with sub-groups. */
export function categorizeTokens(tokens: TokenRecord): CategorizedTokens {
    const result: CategorizedTokens = {
        Colors: {},
        Typography: {},
        Spacing: {},
        Shadows: {},
        Radii: {},
        Transitions: {},
        Other: {},
    };

    for (const [name, value] of Object.entries(tokens)) {
        if (name.startsWith('--color-')) {
            const group = colorSubGroup(name);
            if (!result.Colors[group]) result.Colors[group] = {};
            result.Colors[group][name] = value;
        } else if (name.startsWith('--font-size-')) {
            if (!result.Typography['Font Size']) result.Typography['Font Size'] = {};
            result.Typography['Font Size'][name] = value;
        } else if (name.startsWith('--font-weight-')) {
            if (!result.Typography['Font Weight']) result.Typography['Font Weight'] = {};
            result.Typography['Font Weight'][name] = value;
        } else if (name.startsWith('--font-')) {
            if (!result.Typography['Font Family']) result.Typography['Font Family'] = {};
            result.Typography['Font Family'][name] = value;
        } else if (name.startsWith('--line-height-')) {
            if (!result.Typography['Line Height']) result.Typography['Line Height'] = {};
            result.Typography['Line Height'][name] = value;
        } else if (name.startsWith('--spacing-')) {
            result.Spacing[name] = value;
        } else if (name.startsWith('--shadow-')) {
            result.Shadows[name] = value;
        } else if (name.startsWith('--radius-')) {
            result.Radii[name] = value;
        } else if (name.startsWith('--transition-')) {
            result.Transitions[name] = value;
        } else {
            result.Other[name] = value;
        }
    }

    return result;
}
