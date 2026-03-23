import * as React from 'react';
import { useAddonTheme } from '../../useAddonTheme.ts';
import { editorRowStyle, editorLabelStyle, editorInputStyle } from './shared.ts';
import type { TokenEditorProps } from './shared.ts';

export function TextEditor({ name, value, onChange }: TokenEditorProps) {
    const theme = useAddonTheme();

    return (
        <div style={editorRowStyle()}>
            <label style={editorLabelStyle(theme)}>{name}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                aria-label={`${name} value`}
                style={{ ...editorInputStyle(theme), fontFamily: 'monospace', flex: 1 }}
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
