/**
 * Parses variant files (.variants.ts) to extract variant and size records.
 * Uses brace-counting + new Function() evaluation for object literal parsing.
 *
 * Dev-only evaluation of local .variants.ts object literals.
 * Acceptable because: files are trusted local source, addon only runs in pnpm dev, not in production.
 * NOT safe for untrusted input — do not use this pattern in production code.
 */

import path from 'node:path';

export interface VariantDefinition {
    base: string;
    hover?: string;
    active?: string;
    focus?: string;
    disabled?: string;
    outline?: string;
    _meta?: { clonedFrom?: string; createdAt?: string };
}

export interface SizeDefinition {
    padding: string;
    fontSize: string;
    iconSize?: number;
    radius?: string;
}

export interface ParsedVariantsFile {
    variants: Record<string, VariantDefinition>;
    sizes: Record<string, SizeDefinition>;
}

const VALID_IDENTIFIER_RE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

/** Validate that a variant name is a valid JS identifier. */
export function validateVariantName(name: string): boolean {
    if (!name) return false;
    return VALID_IDENTIFIER_RE.test(name);
}

/**
 * Extract the object literal string for an exported const record using brace counting.
 * Returns the string between the outermost { and }, inclusive.
 */
function extractRecordObject(content: string, exportName: string): string | null {
    const marker = `export const ${exportName}`;
    const idx = content.indexOf(marker);
    if (idx === -1) return null;

    // Find the first { after the marker, skipping the type annotation
    const searchStart = idx + marker.length;
    // Skip past the `= {` — we need the `=` first
    const eqIdx = content.indexOf('=', searchStart);
    if (eqIdx === -1) return null;

    const braceStart = content.indexOf('{', eqIdx);
    if (braceStart === -1) return null;

    // Brace-count to find matching close
    let depth = 0;
    for (let i = braceStart; i < content.length; i++) {
        const ch = content[i];
        // Skip string literals to avoid counting braces inside strings
        if (ch === "'" || ch === '"' || ch === '`') {
            const quote = ch;
            i++;
            while (i < content.length && content[i] !== quote) {
                if (content[i] === '\\') i++; // skip escaped char
                i++;
            }
            continue;
        }
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) {
                return content.slice(braceStart, i + 1);
            }
        }
    }
    return null;
}

/** Safely evaluate an object literal string to a JS object. */
function evaluateObjectLiteral(objStr: string): Record<string, unknown> {
    try {
        return new Function('return (' + objStr + ')')() as Record<string, unknown>;
    } catch {
        return {};
    }
}

/** Detect the export name for variants (e.g. buttonVariants, cardVariants). */
function findExportName(content: string, suffix: string): string | null {
    const re = new RegExp(`export const (\\w+${suffix})\\s*:`);
    const match = content.match(re);
    return match ? match[1] : null;
}

/** Parse a variants file and extract variant and size records. */
export function parseVariantsFile(content: string): ParsedVariantsFile {
    const variantsName = findExportName(content, 'Variants');
    const sizesName = findExportName(content, 'Sizes');

    let variants: Record<string, VariantDefinition> = {};
    let sizes: Record<string, SizeDefinition> = {};

    if (variantsName) {
        const objStr = extractRecordObject(content, variantsName);
        if (objStr) {
            variants = evaluateObjectLiteral(objStr) as Record<string, VariantDefinition>;
        }
    }

    if (sizesName) {
        const objStr = extractRecordObject(content, sizesName);
        if (objStr) {
            sizes = evaluateObjectLiteral(objStr) as Record<string, SizeDefinition>;
        }
    }

    return { variants, sizes };
}

/**
 * Map a Storybook story title to a variants file path.
 * e.g. "Components/Primitives/Button" -> "src/primitives/Button/Button.variants.ts"
 */
export function resolveVariantsPath(storyTitle: string): string | null {
    const parts = storyTitle.split('/');
    // Expected: ["Components", "Primitives"|"Composite", "ComponentName"]
    if (parts.length < 3 || parts[0] !== 'Components') {
        return null;
    }

    const category = parts[1].toLowerCase(); // "primitives" or "composite"
    const componentName = parts[2]; // "Button"

    return path.join(
        'packages',
        'components',
        'src',
        category,
        componentName,
        `${componentName}.variants.ts`,
    );
}
