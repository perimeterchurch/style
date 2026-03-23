/**
 * Parses variant files (.variants.ts) to extract variant and size records.
 * Uses brace-counting + a safe key-value parser for object literal parsing.
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

/**
 * Parse a JS object literal string into a plain object without eval.
 * Handles string values (single/double quoted), numeric values, and one level
 * of nested objects (for _meta). Only supports the shapes used in variant files.
 */
function parseObjectLiteral(objStr: string): Record<string, unknown> {
    try {
        return parseObjectContents(stripOuterBraces(objStr));
    } catch {
        return {};
    }
}

/** Remove the outermost { } from an object literal string. */
function stripOuterBraces(s: string): string {
    const trimmed = s.trim();
    if (trimmed[0] === '{' && trimmed[trimmed.length - 1] === '}') {
        return trimmed.slice(1, -1);
    }
    return trimmed;
}

/**
 * Split an object body into key-value entries, respecting quoted strings
 * and nested braces so commas inside them are not treated as separators.
 */
function splitEntries(body: string): string[] {
    const entries: string[] = [];
    let current = '';
    let depth = 0;
    let inQuote: string | null = null;

    for (let i = 0; i < body.length; i++) {
        const ch = body[i];

        if (inQuote) {
            current += ch;
            if (ch === '\\' && i + 1 < body.length) {
                current += body[++i];
                continue;
            }
            if (ch === inQuote) inQuote = null;
            continue;
        }

        if (ch === "'" || ch === '"') {
            inQuote = ch;
            current += ch;
            continue;
        }

        if (ch === '{') {
            depth++;
            current += ch;
            continue;
        }
        if (ch === '}') {
            depth--;
            current += ch;
            continue;
        }

        if (ch === ',' && depth === 0) {
            entries.push(current);
            current = '';
            continue;
        }

        current += ch;
    }
    if (current.trim()) entries.push(current);
    return entries;
}

/** Parse the inner contents of an object literal (without outer braces). */
function parseObjectContents(body: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const entries = splitEntries(body);

    for (const entry of entries) {
        const trimmed = entry.trim();
        if (!trimmed) continue;

        // Match key: value — key may be unquoted identifier or quoted string
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx === -1) continue;

        const key = trimmed.slice(0, colonIdx).trim();
        const rawValue = trimmed.slice(colonIdx + 1).trim();

        if (!key) continue;

        // Nested object
        if (rawValue.startsWith('{')) {
            result[key] = parseObjectContents(stripOuterBraces(rawValue));
            continue;
        }

        // Quoted string (single or double)
        if (
            (rawValue.startsWith("'") && rawValue.endsWith("'")) ||
            (rawValue.startsWith('"') && rawValue.endsWith('"'))
        ) {
            result[key] = rawValue.slice(1, -1);
            continue;
        }

        // Numeric value
        const num = Number(rawValue);
        if (!Number.isNaN(num) && rawValue !== '') {
            result[key] = num;
            continue;
        }

        // Fallback: treat as raw string
        result[key] = rawValue;
    }

    return result;
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
            variants = parseObjectLiteral(objStr) as Record<string, VariantDefinition>;
        }
    }

    if (sizesName) {
        const objStr = extractRecordObject(content, sizesName);
        if (objStr) {
            sizes = parseObjectLiteral(objStr) as Record<string, SizeDefinition>;
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
