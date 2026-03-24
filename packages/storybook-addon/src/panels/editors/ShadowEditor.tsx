import * as React from 'react';
import { useAddonTheme } from '../useAddonTheme.ts';
import { editorRowStyle, editorLabelStyle, editorInputStyle } from './shared.ts';
import type { TokenEditorProps } from './shared.ts';

export function ShadowEditor({ name, value, onChange }: TokenEditorProps) {
    const theme = useAddonTheme();

    return (
        <div style={editorRowStyle()}>
            <label style={editorLabelStyle(theme)}>{name}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                aria-label={`${name} shadow value`}
                style={{ ...editorInputStyle(theme), fontFamily: 'monospace', flex: 1 }}
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
