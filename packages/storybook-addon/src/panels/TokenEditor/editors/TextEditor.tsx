import * as React from 'react';
import type { TokenEditorProps } from './ColorEditor.tsx';

export function TextEditor({ name, value, onChange }: TokenEditorProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
            <label style={{ flex: '0 0 220px', fontFamily: 'monospace', fontSize: 12 }}>
                {name}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                aria-label={`${name} value`}
                style={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    padding: '4px 6px',
                    flex: 1,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                }}
            />
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#888', minWidth: 60 }}>
                {value}
            </span>
        </div>
    );
}
