import * as React from 'react';
import { useAddonTheme } from '../useAddonTheme.ts';

export interface ComponentTokensProps {
    prefix: string;
    label: string;
    baseTokens: Record<string, string>;
    themeOverrides: Record<string, string>;
    dirty: Record<string, string>;
    onTokenChange: (name: string, value: string) => void;
    onTokenReset: (name: string) => void;
}

/** Filter token keys matching `--{prefix}-*`. */
function filterByPrefix(tokens: Record<string, string>, prefix: string): string[] {
    const pattern = `--${prefix}-`;
    return Object.keys(tokens).filter((k) => k.startsWith(pattern));
}

export function ComponentTokens({
    prefix,
    label,
    baseTokens,
    themeOverrides,
    dirty,
    onTokenChange,
    onTokenReset,
}: ComponentTokensProps) {
    const theme = useAddonTheme();
    const tokenKeys = filterByPrefix(baseTokens, prefix);

    if (tokenKeys.length === 0) {
        return (
            <div style={{ padding: 16, color: theme.color.mediumdark, textAlign: 'center' }}>
                No tokens found for {label} (--{prefix}-*)
            </div>
        );
    }

    return (
        <div style={{ padding: '4px 0' }}>
            {tokenKeys.map((name) => {
                const isOverridden = name in themeOverrides || name in dirty;
                const currentValue = dirty[name] ?? themeOverrides[name] ?? baseTokens[name];

                return (
                    <div
                        key={name}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '4px 0',
                        }}
                    >
                        {/* Override indicator */}
                        <span
                            title={isOverridden ? 'Overridden in theme' : 'Inherited from base'}
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                flexShrink: 0,
                                backgroundColor: isOverridden
                                    ? theme.barSelectedColor
                                    : 'transparent',
                                border: `2px solid ${isOverridden ? theme.barSelectedColor : theme.color.mediumdark}`,
                            }}
                        />

                        {/* Token name */}
                        <label
                            style={{
                                flex: '0 0 220px',
                                fontFamily: 'monospace',
                                fontSize: 12,
                                color: isOverridden
                                    ? theme.color.defaultText
                                    : theme.color.mediumdark,
                            }}
                        >
                            {name}
                        </label>

                        {/* Value input */}
                        <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => onTokenChange(name, e.target.value)}
                            aria-label={`${name} value`}
                            style={{
                                fontFamily: 'monospace',
                                fontSize: 12,
                                padding: '4px 6px',
                                flex: 1,
                                border: `1px solid ${theme.input.border}`,
                                borderRadius: theme.input.borderRadius,
                                backgroundColor: theme.input.background,
                                color: isOverridden ? theme.input.color : theme.color.mediumdark,
                            }}
                        />

                        {/* Reset button for overridden tokens */}
                        {isOverridden && (
                            <button
                                onClick={() => onTokenReset(name)}
                                aria-label={`Reset ${name}`}
                                title="Reset to base value"
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    color: theme.color.mediumdark,
                                    padding: '2px 6px',
                                }}
                            >
                                x
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
