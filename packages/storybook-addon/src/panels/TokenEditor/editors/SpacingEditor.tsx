import * as React from 'react';
import type { TokenEditorProps } from './ColorEditor.tsx';

/** Extract numeric rem value from a string like "1.5rem". Returns 0 if unparseable. */
function parseRem(value: string): number {
    const match = value.match(/^([\d.]+)\s*rem$/);
    return match ? parseFloat(match[1]) : 0;
}

export function SpacingEditor({ name, value, onChange }: TokenEditorProps) {
    const numericValue = parseRem(value);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
            <label style={{ flex: '0 0 220px', fontFamily: 'monospace', fontSize: 12 }}>
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
                style={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    padding: '4px 6px',
                    width: 80,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                }}
            />
            <div
                data-testid={`${name}-preview`}
                style={{
                    width: value,
                    height: value,
                    backgroundColor: '#6b7280',
                    borderRadius: 2,
                    minWidth: 4,
                    minHeight: 4,
                }}
            />
        </div>
    );
}
