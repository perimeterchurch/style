import type { CSSProperties } from 'react';
import type { StorybookTheme } from 'storybook/theming';

export interface TokenEditorProps {
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
}

export function editorRowStyle(): CSSProperties {
    return { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' };
}

export function editorLabelStyle(theme: StorybookTheme): CSSProperties {
    return {
        flex: '0 0 220px',
        fontFamily: 'monospace',
        fontSize: 12,
        color: theme.color.defaultText,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    };
}

export function editorInputStyle(theme: StorybookTheme): CSSProperties {
    return {
        padding: '4px 8px',
        fontSize: 12,
        border: `1px solid ${theme.input.border}`,
        borderRadius: theme.input.borderRadius,
        backgroundColor: theme.input.background,
        color: theme.input.color,
    };
}
