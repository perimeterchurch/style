import * as React from 'react';
import { useAddonTheme } from '../useAddonTheme.ts';

export interface TokenSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function TokenSearch({ value, onChange }: TokenSearchProps) {
    const theme = useAddonTheme();

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '6px 28px 6px 8px',
        fontSize: 12,
        border: `1px solid ${theme.input.border}`,
        borderRadius: theme.input.borderRadius,
        backgroundColor: theme.input.background,
        color: theme.input.color,
        outline: 'none',
        boxSizing: 'border-box',
    };

    const clearButtonStyle: React.CSSProperties = {
        position: 'absolute',
        right: 4,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: theme.color.mediumdark,
        fontSize: 14,
        padding: '2px 4px',
        lineHeight: 1,
    };

    return (
        <div style={{ padding: '8px', position: 'relative' }}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search tokens..."
                aria-label="Search tokens"
                style={inputStyle}
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                    style={clearButtonStyle}
                >
                    &#x2715;
                </button>
            )}
        </div>
    );
}
