export interface TokenSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function TokenSearch({ value, onChange }: TokenSearchProps) {
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
                    border: '1px solid #d1d5db',
                    borderRadius: 4,
                    fontSize: 13,
                    fontFamily: 'monospace',
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
                        color: '#6b7280',
                        padding: '4px 6px',
                    }}
                >
                    x
                </button>
            )}
        </div>
    );
}
