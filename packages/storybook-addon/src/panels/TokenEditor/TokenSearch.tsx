import * as React from 'react';
import { useAddonTheme } from '../useAddonTheme.ts';

export interface TokenSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function TokenSearch({ value, onChange }: TokenSearchProps) {
    const theme = useAddonTheme();

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px' }}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search tokens..."
                aria-label="Search tokens"
                style={{
                    flex: 1,
                    padding: '6px 8px',
                    border: `1px solid ${theme.input.border}`,
                    borderRadius: theme.input.borderRadius,
                    fontSize: 13,
                    fontFamily: 'monospace',
                    backgroundColor: theme.input.background,
                    color: theme.input.color,
                }}
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                    style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: 16,
                        color: theme.barTextColor,
                        padding: '4px 6px',
                    }}
                >
                    x
                </button>
            )}
        </div>
    );
}
