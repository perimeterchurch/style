import React, { useState } from 'react';

export interface PropertyPickerProps {
    stateKey: string;
    propertyType: 'background' | 'text' | 'border' | 'ring' | 'other';
    value: string;
    tokens: Array<{ name: string; value: string }>;
    onChange: (value: string) => void;
    onSaveAsToken?: (tokenName: string, tokenValue: string) => void;
}

// ---------------------------------------------------------------------------
// Tailwind syntax generation
// ---------------------------------------------------------------------------

/** Map of propertyType to the Tailwind utility prefix. */
const UTILITY_PREFIX: Record<PropertyPickerProps['propertyType'], string> = {
    background: 'bg',
    text: 'text',
    border: 'border',
    ring: 'ring',
    other: '',
};

/** Map of stateKey to the Tailwind state modifier prefix (empty for base). */
const STATE_PREFIX: Record<string, string> = {
    base: '',
    hover: 'hover:',
    active: 'active:',
    focus: 'focus-visible:',
    disabled: 'disabled:',
    outline: '',
};

/**
 * Generate a Tailwind arbitrary value class from a token, stateKey, and propertyType.
 *
 * Examples:
 *   base + background + --color-primary       → bg-[var(--color-primary)]
 *   hover + background + --color-primary      → hover:bg-[var(--color-primary)]
 *   focus + ring + --color-primary            → focus-visible:ring-[var(--color-primary)]
 *   active + text + --color-primary           → active:text-[var(--color-primary)]
 */
export function buildTailwindClass(
    stateKey: string,
    propertyType: PropertyPickerProps['propertyType'],
    tokenName: string,
): string {
    const statePrefix = STATE_PREFIX[stateKey] ?? '';
    const utilityPrefix = UTILITY_PREFIX[propertyType];

    if (!utilityPrefix) {
        // 'other' type — just return the var reference with state prefix
        return `${statePrefix}[var(${tokenName})]`;
    }

    return `${statePrefix}${utilityPrefix}-[var(${tokenName})]`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type PickerMode = 'token' | 'custom';

export function PropertyPicker({
    stateKey,
    propertyType,
    value,
    tokens,
    onChange,
    onSaveAsToken,
}: PropertyPickerProps) {
    const [mode, setMode] = useState<PickerMode>('token');
    const [customValue, setCustomValue] = useState('');
    const [saveAsToken, setSaveAsToken] = useState(false);
    const [newTokenName, setNewTokenName] = useState('');

    const label = `${stateKey} ${propertyType}`;

    function handleTokenSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const tokenName = e.target.value;
        if (tokenName === '__custom__') {
            setMode('custom');
            return;
        }
        if (!tokenName) return;
        const cls = buildTailwindClass(stateKey, propertyType, tokenName);
        onChange(cls);
    }

    function handleCustomApply() {
        if (!customValue.trim()) return;
        onChange(customValue.trim());

        if (saveAsToken && newTokenName.trim() && onSaveAsToken) {
            onSaveAsToken(newTokenName.trim(), customValue.trim());
        }
    }

    return (
        <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>
                {label}
            </div>

            {mode === 'token' ? (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <select
                        aria-label={label}
                        value=""
                        onChange={handleTokenSelect}
                        style={{
                            flex: 1,
                            padding: '4px 8px',
                            fontSize: 12,
                            border: '1px solid #d1d5db',
                            borderRadius: 4,
                        }}
                    >
                        <option value="">Select token...</option>
                        {tokens.map((t) => (
                            <option key={t.name} value={t.name}>
                                {t.name}
                            </option>
                        ))}
                        <option value="__custom__">Custom...</option>
                    </select>
                    {value && (
                        <span
                            style={{
                                fontSize: 11,
                                fontFamily: 'monospace',
                                color: '#374151',
                                maxWidth: 200,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {value}
                        </span>
                    )}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {(propertyType === 'background' ||
                            propertyType === 'text' ||
                            propertyType === 'border' ||
                            propertyType === 'ring') && (
                            <input
                                type="color"
                                aria-label={`${label} color picker`}
                                value={customValue.startsWith('#') ? customValue : '#000000'}
                                onChange={(e) => setCustomValue(e.target.value)}
                                style={{ width: 32, height: 28, border: '1px solid #d1d5db', borderRadius: 4 }}
                            />
                        )}
                        <input
                            type="text"
                            aria-label={`${label} custom value`}
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                            placeholder="Custom value..."
                            style={{
                                flex: 1,
                                padding: '4px 8px',
                                fontSize: 12,
                                border: '1px solid #d1d5db',
                                borderRadius: 4,
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <input
                                type="checkbox"
                                checked={saveAsToken}
                                onChange={(e) => setSaveAsToken(e.target.checked)}
                            />
                            Save as token
                        </label>
                        {saveAsToken && (
                            <input
                                type="text"
                                aria-label="New token name"
                                value={newTokenName}
                                onChange={(e) => setNewTokenName(e.target.value)}
                                placeholder="--color-my-token"
                                style={{
                                    flex: 1,
                                    padding: '2px 6px',
                                    fontSize: 11,
                                    border: '1px solid #d1d5db',
                                    borderRadius: 4,
                                }}
                            />
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: 4 }}>
                        <button
                            onClick={handleCustomApply}
                            style={{
                                padding: '4px 12px',
                                fontSize: 11,
                                borderRadius: 4,
                                border: '1px solid #3b82f6',
                                backgroundColor: '#3b82f6',
                                color: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            Apply
                        </button>
                        <button
                            onClick={() => setMode('token')}
                            style={{
                                padding: '4px 12px',
                                fontSize: 11,
                                borderRadius: 4,
                                border: '1px solid #d1d5db',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            Back to tokens
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
