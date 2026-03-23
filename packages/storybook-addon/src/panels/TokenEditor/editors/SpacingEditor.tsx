import * as React from 'react';
import { useAddonTheme } from '../../useAddonTheme.ts';
import type { TokenEditorProps } from './ColorEditor.tsx';

/** Extract numeric rem value from a string like "1.5rem". Returns 0 if unparseable. */
function parseRem(value: string): number {
    const match = value.match(/^([\d.]+)\s*rem$/);
    return match ? parseFloat(match[1]) : 0;
}

export function SpacingEditor({ name, value, onChange }: TokenEditorProps) {
    const theme = useAddonTheme();
    const numericValue = parseRem(value);

    const inputStyle: React.CSSProperties = {
        padding: '4px 8px',
        fontSize: 12,
        border: `1px solid ${theme.input.border}`,
        borderRadius: theme.input.borderRadius,
        backgroundColor: theme.input.background,
        color: theme.input.color,
        fontFamily: 'monospace',
        width: 80,
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
            <label
                style={{
                    flex: '0 0 220px',
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: theme.color.defaultText,
                }}
            >
                {name}
            </label>
            <input
                type="range"
                min="0"
                max="6"
                step="0.125"
                value={numericValue}
                onChange={(e) => onChange(name, `${e.target.value}rem`)}
                aria-label={`${name} range`}
                style={{ width: 120 }}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                aria-label={`${name} value`}
                style={inputStyle}
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
