import * as React from 'react';
import { useAddonTheme } from '../../useAddonTheme.ts';

export interface TokenEditorProps {
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
}

/** Normalize any 3-char hex shorthand to 6-char. Passes through non-hex strings unchanged. */
function normalizeHex(raw: string): string {
    const trimmed = raw.trim();
    if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
        const [, r, g, b] = trimmed;
        return `#${r}${r}${g}${g}${b}${b}`;
    }
    return trimmed;
}

export function ColorEditor({ name, value, onChange }: TokenEditorProps) {
    const theme = useAddonTheme();
    const hexValue = normalizeHex(value);
    const isValidHex = /^#[0-9a-fA-F]{6}$/.test(hexValue);

    const inputStyle: React.CSSProperties = {
        padding: '4px 8px',
        fontSize: 12,
        border: `1px solid ${theme.input.border}`,
        borderRadius: theme.input.borderRadius,
        backgroundColor: theme.input.background,
        color: theme.input.color,
        fontFamily: 'monospace',
        width: 100,
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
                type="color"
                value={isValidHex ? hexValue : '#000000'}
                onChange={(e) => onChange(name, e.target.value)}
                aria-label={`${name} color picker`}
                style={{ width: 32, height: 32, border: 'none', cursor: 'pointer' }}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                aria-label={`${name} hex value`}
                style={inputStyle}
            />
            <div
                data-testid={`${name}-swatch`}
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    backgroundColor: value,
                    border: `1px solid ${theme.appBorderColor}`,
                }}
            />
        </div>
    );
}
