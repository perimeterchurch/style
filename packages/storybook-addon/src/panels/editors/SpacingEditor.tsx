import * as React from 'react';
import { useAddonTheme } from '../useAddonTheme.ts';
import { editorRowStyle, editorLabelStyle, editorInputStyle } from './shared.ts';
import type { TokenEditorProps } from './shared.ts';

/** Parse a CSS value into its numeric portion and unit. Returns null if unparseable. */
function parseValue(value: string): { num: number; unit: string } | null {
    const match = value.match(/^([\d.]+)\s*(\S+)$/);
    if (!match) return null;
    const num = parseFloat(match[1]);
    if (Number.isNaN(num)) return null;
    return { num, unit: match[2] };
}

/** Determine the max range value based on unit. */
function maxForUnit(unit: string): number {
    if (unit === 'rem') return 8;
    return 6;
}

export function SpacingEditor({ name, value, onChange }: TokenEditorProps) {
    const theme = useAddonTheme();
    const parsed = parseValue(value);

    return (
        <div style={editorRowStyle()}>
            <label style={editorLabelStyle(theme)}>{name}</label>
            {parsed !== null && (
                <input
                    type="range"
                    min="0"
                    max={maxForUnit(parsed.unit)}
                    step="0.125"
                    value={parsed.num}
                    onChange={(e) => onChange(name, `${e.target.value}${parsed.unit}`)}
                    aria-label={`${name} range`}
                    style={{ width: 120 }}
                />
            )}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                aria-label={`${name} value`}
                style={{ ...editorInputStyle(theme), fontFamily: 'monospace', width: 80 }}
            />
            <div
                data-testid={`${name}-preview`}
                style={{
                    width: value,
                    height: value,
                    backgroundColor: theme.color.mediumdark,
                    borderRadius: 2,
                    minWidth: 4,
                    minHeight: 4,
                }}
            />
        </div>
    );
}
