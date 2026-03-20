/**
 * Modifies variant entries in .variants.ts files.
 * Uses brace-counting to safely locate and manipulate entries
 * without breaking strings that contain special characters like colons.
 */

import type { VariantDefinition, SizeDefinition } from './readVariants.ts';

type VariantOrSize = VariantDefinition | SizeDefinition;

/** Detect the export name for a given suffix (Variants or Sizes). */
function findExportName(content: string, suffix: string): string | null {
    const re = new RegExp(`export const (\\w+${suffix})\\s*:`);
    const match = content.match(re);
    return match ? match[1] : null;
}

/** Serialize a variant/size definition to a formatted object literal string. */
function serializeDefinition(def: VariantOrSize, indent: string): string {
    const lines: string[] = ['{'];
    const entries = Object.entries(def);
    for (const [key, value] of entries) {
        if (typeof value === 'object' && value !== null) {
            // Nested object (e.g. _meta)
            const inner = Object.entries(value as Record<string, unknown>)
                .map(([k, v]) => `${k}: '${v}'`)
                .join(', ');
            lines.push(`${indent}        ${key}: { ${inner} },`);
        } else if (typeof value === 'number') {
            lines.push(`${indent}        ${key}: ${value},`);
        } else {
            lines.push(`${indent}        ${key}: '${value}',`);
        }
    }
    lines.push(`${indent}    }`);
    return lines.join('\n');
}

/**
 * Find the start and end positions of a named entry within a record object.
 * Uses brace counting to handle nested objects correctly.
 * Returns [entryStart, entryEnd] where entryEnd is after the trailing comma.
 */
function findEntryBounds(
    content: string,
    recordStart: number,
    recordEnd: number,
    entryName: string,
): [number, number] | null {
    // Look for `entryName: {` or `entryName:{` within the record
    const region = content.slice(recordStart, recordEnd);

    // Find the entry key — match `name:` accounting for possible whitespace
    const entryPattern = new RegExp(`(\\n[ \\t]*)(${entryName}\\s*:\\s*)`, 'g');
    const match = entryPattern.exec(region);
    if (!match) return null;

    const entryStartInRegion = match.index;
    const entryStart = recordStart + entryStartInRegion;

    // Find the opening brace of this entry's value
    const afterKey = recordStart + entryPattern.lastIndex;
    const braceIdx = content.indexOf('{', afterKey);
    if (braceIdx === -1 || braceIdx >= recordEnd) return null;

    // Brace-count to find matching close
    let depth = 0;
    let entryEnd = braceIdx;
    for (let i = braceIdx; i < recordEnd; i++) {
        const ch = content[i];
        if (ch === "'" || ch === '"' || ch === '`') {
            const quote = ch;
            i++;
            while (i < content.length && content[i] !== quote) {
                if (content[i] === '\\') i++;
                i++;
            }
            continue;
        }
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) {
                entryEnd = i + 1;
                break;
            }
        }
    }

    // Include trailing comma and whitespace
    let finalEnd = entryEnd;
    if (finalEnd < content.length && content[finalEnd] === ',') {
        finalEnd++;
    }

    return [entryStart, finalEnd];
}

/**
 * Find the outermost record object bounds for a given export.
 * Returns [contentAfterBrace, closingBrace] positions.
 */
function findRecordBounds(
    content: string,
    suffix: string,
): { name: string; openBrace: number; closeBrace: number } | null {
    const exportName = findExportName(content, suffix);
    if (!exportName) return null;

    const marker = `export const ${exportName}`;
    const idx = content.indexOf(marker);
    if (idx === -1) return null;

    const eqIdx = content.indexOf('=', idx + marker.length);
    if (eqIdx === -1) return null;

    const braceStart = content.indexOf('{', eqIdx);
    if (braceStart === -1) return null;

    let depth = 0;
    for (let i = braceStart; i < content.length; i++) {
        const ch = content[i];
        if (ch === "'" || ch === '"' || ch === '`') {
            const quote = ch;
            i++;
            while (i < content.length && content[i] !== quote) {
                if (content[i] === '\\') i++;
                i++;
            }
            continue;
        }
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) {
                return { name: exportName, openBrace: braceStart, closeBrace: i };
            }
        }
    }
    return null;
}

/** Update an existing entry in the file. */
export function updateVariantInFile(
    content: string,
    suffix: string,
    name: string,
    definition: VariantOrSize,
): string {
    const bounds = findRecordBounds(content, suffix);
    if (!bounds) throw new Error(`Cannot find ${suffix} record in file`);

    const entryBounds = findEntryBounds(content, bounds.openBrace, bounds.closeBrace, name);
    if (!entryBounds) throw new Error(`Entry "${name}" not found in ${suffix} record`);

    const [entryStart, entryEnd] = entryBounds;

    // Detect indentation from the original entry
    const beforeEntry = content.slice(0, entryStart);
    const lastNewline = beforeEntry.lastIndexOf('\n');
    const indent =
        lastNewline >= 0
            ? (content.slice(lastNewline + 1, entryStart).match(/^(\s*)/)?.[1] ?? '    ')
            : '    ';

    const serialized = `\n${indent}${name}: ${serializeDefinition(definition, indent)},`;
    return content.slice(0, entryStart) + serialized + content.slice(entryEnd);
}

/** Add a new entry before the closing brace of the record. */
export function addVariantToFile(
    content: string,
    suffix: string,
    name: string,
    definition: VariantOrSize,
): string {
    const bounds = findRecordBounds(content, suffix);
    if (!bounds) throw new Error(`Cannot find ${suffix} record in file`);

    const indent = '    ';
    const serialized = `${indent}${name}: ${serializeDefinition(definition, indent)},\n`;

    // Insert before the closing brace
    return content.slice(0, bounds.closeBrace) + serialized + content.slice(bounds.closeBrace);
}

/** Remove an entry from the file using brace counting. */
export function removeVariantFromFile(content: string, suffix: string, name: string): string {
    const bounds = findRecordBounds(content, suffix);
    if (!bounds) throw new Error(`Cannot find ${suffix} record in file`);

    const entryBounds = findEntryBounds(content, bounds.openBrace, bounds.closeBrace, name);
    if (!entryBounds) throw new Error(`Entry "${name}" not found in ${suffix} record`);

    const [entryStart, entryEnd] = entryBounds;

    // Also consume the trailing newline if present
    let removeEnd = entryEnd;
    if (removeEnd < content.length && content[removeEnd] === '\n') {
        removeEnd++;
    }

    return content.slice(0, entryStart) + content.slice(removeEnd);
}
