/**
 * Validates and updates design tokens in dual-block CSS files.
 * Updates tokens in both @theme and :root blocks where they exist.
 */

/** Valid token name: starts with --, all lowercase, hyphens and digits allowed. */
const TOKEN_NAME_RE = /^--[a-z][a-z0-9-]*$/;

/** Validate that a token name follows CSS custom property conventions. */
export function validateTokenName(name: string): boolean {
    return TOKEN_NAME_RE.test(name.trim());
}

/** Replace a token's value within a CSS block string, returning the updated block. */
function replaceTokenInBlock(block: string, name: string, value: string): string {
    const lines = block.split('\n');
    const updated = lines.map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith(name + ':')) {
            const indent = line.match(/^(\s*)/)?.[1] ?? '';
            return `${indent}${name}: ${value};`;
        }
        return line;
    });
    return updated.join('\n');
}

/** Find the start and end indices of a CSS block's content (between { and }). */
function findBlockBounds(
    css: string,
    blockStart: number,
): { contentStart: number; contentEnd: number; blockEnd: number } | null {
    let depth = 0;
    let contentStart = -1;
    for (let i = blockStart; i < css.length; i++) {
        if (css[i] === '{') {
            if (depth === 0) contentStart = i + 1;
            depth++;
        } else if (css[i] === '}') {
            depth--;
            if (depth === 0) {
                return { contentStart, contentEnd: i, blockEnd: i + 1 };
            }
        }
    }
    return null;
}

/**
 * Update token values in a dual-block CSS string.
 * Tokens are updated in every block where they appear (@theme and/or :root).
 * Throws if any token name is invalid.
 */
export function updateTokensInCss(css: string, updates: Record<string, string>): string {
    // Validate all names first
    for (const name of Object.keys(updates)) {
        if (!validateTokenName(name)) {
            throw new Error(`Invalid token name: "${name}"`);
        }
    }

    let result = css;

    // Process each block: @theme and :root
    const blockMarkers = ['@theme', ':root'];

    for (const marker of blockMarkers) {
        const idx = result.indexOf(marker);
        if (idx === -1) continue;

        const bounds = findBlockBounds(result, idx);
        if (!bounds) continue;

        let blockContent = result.slice(bounds.contentStart, bounds.contentEnd);

        for (const [name, value] of Object.entries(updates)) {
            if (blockContent.includes(name + ':')) {
                blockContent = replaceTokenInBlock(blockContent, name, value);
            }
        }

        result = result.slice(0, bounds.contentStart) + blockContent + result.slice(bounds.contentEnd);
    }

    return result;
}
