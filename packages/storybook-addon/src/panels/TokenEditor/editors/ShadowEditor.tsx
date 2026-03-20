import * as React from 'react';
import { useAddonTheme } from '../../useAddonTheme.ts';
import type { TokenEditorProps } from './ColorEditor.tsx';

export function ShadowEditor({ name, value, onChange }: TokenEditorProps) {
    const theme = useAddonTheme();

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
                aria-label={`${name} shadow value`}
                style={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    padding: '4px 6px',
                    flex: 1,
                    border: `1px solid ${theme.input.border}`,
                    borderRadius: theme.input.borderRadius,
                    backgroundColor: theme.input.background,
                    color: theme.input.color,
                }}
            />
            <div
                data-testid={`${name}-preview`}
                style={{
                    width: 48,
                    height: 32,
                    backgroundColor: theme.background.content,
                    borderRadius: 4,
                    boxShadow: value,
                }}
            />
        </div>
    );
}
