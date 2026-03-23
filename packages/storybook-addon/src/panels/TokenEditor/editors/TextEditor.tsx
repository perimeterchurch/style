import * as React from 'react';
import { useAddonTheme } from '../../useAddonTheme.ts';
import type { TokenEditorProps } from './ColorEditor.tsx';

export function TextEditor({ name, value, onChange }: TokenEditorProps) {
    const theme = useAddonTheme();

    const inputStyle: React.CSSProperties = {
        padding: '4px 8px',
        fontSize: 12,
        border: `1px solid ${theme.input.border}`,
        borderRadius: theme.input.borderRadius,
        backgroundColor: theme.input.background,
        color: theme.input.color,
        fontFamily: 'monospace',
        flex: 1,
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
                type="text"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                aria-label={`${name} value`}
                style={inputStyle}
            />
            <span
                style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: theme.color.mediumdark,
                    minWidth: 60,
                }}
            >
                {value}
            </span>
        </div>
    );
}
