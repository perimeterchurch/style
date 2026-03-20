import type { TokenEditorProps } from './ColorEditor';

export function ShadowEditor({ name, value, onChange }: TokenEditorProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
            <label style={{ flex: '0 0 220px', fontFamily: 'monospace', fontSize: 12 }}>
                {name}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                aria-label={`${name} shadow value`}
                style={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    padding: '4px 6px',
                    flex: 1,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                }}
            />
            <div
                data-testid={`${name}-preview`}
                style={{
                    width: 48,
                    height: 32,
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    boxShadow: value,
                }}
            />
        </div>
    );
}
