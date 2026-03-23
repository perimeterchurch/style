import * as React from 'react';
import { Badge } from 'storybook/internal/components';
import { useAddonTheme } from '../useAddonTheme.ts';
import { ColorEditor, SpacingEditor, ShadowEditor, TextEditor } from './editors/index.ts';

export interface TokenGroupProps {
    name: string;
    tokens: Array<{ name: string; value: string }>;
    editorType: string;
    onTokenChange: (name: string, value: string) => void;
    isCollapsed: boolean;
    onToggle: () => void;
    dirtyTokens?: Set<string>;
    onTokenReset?: (name: string) => void;
}

function editorForType(type: string) {
    switch (type) {
        case 'color':
            return ColorEditor;
        case 'spacing':
            return SpacingEditor;
        case 'shadow':
            return ShadowEditor;
        default:
            return TextEditor;
    }
}

export function TokenGroup({
    name,
    tokens,
    editorType,
    onTokenChange,
    isCollapsed,
    onToggle,
    dirtyTokens,
    onTokenReset,
}: TokenGroupProps) {
    const theme = useAddonTheme();
    const Editor = editorForType(editorType);

    const cardStyle: React.CSSProperties = {
        marginBottom: 8,
        border: `1px solid ${theme.appBorderColor}`,
        borderRadius: theme.appBorderRadius,
        backgroundColor: theme.background.content,
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '8px 12px',
        fontSize: 13,
        fontWeight: 600,
        color: theme.color.defaultText,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
    };

    const resetButtonStyle: React.CSSProperties = {
        padding: '2px 6px',
        fontSize: 11,
        color: theme.color.mediumdark,
        background: 'none',
        border: `1px solid ${theme.appBorderColor}`,
        borderRadius: theme.appBorderRadius,
        cursor: 'pointer',
        lineHeight: 1.2,
    };

    return (
        <div style={cardStyle}>
            <button
                onClick={onToggle}
                aria-expanded={!isCollapsed}
                style={headerStyle}
            >
                <span
                    style={{
                        transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0)',
                        transition: 'transform 0.15s',
                        display: 'inline-block',
                    }}
                >
                    &#9662;
                </span>
                {name}
                <span style={{ marginLeft: 'auto' }}>
                    <Badge compact status="neutral">
                        {tokens.length}
                    </Badge>
                </span>
            </button>
            {!isCollapsed && (
                <div style={{ padding: '4px 12px 8px' }}>
                    {tokens.map((token) => {
                        const isDirty = dirtyTokens?.has(token.name) ?? false;
                        return (
                            <div
                                key={token.name}
                                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                                <div style={{ flex: 1 }}>
                                    <Editor
                                        name={token.name}
                                        value={token.value}
                                        onChange={onTokenChange}
                                    />
                                </div>
                                {isDirty && (
                                    <>
                                        <Badge
                                            compact
                                            status="warning"
                                        >
                                            modified
                                        </Badge>
                                        <button
                                            onClick={() => onTokenReset?.(token.name)}
                                            aria-label={`Reset ${token.name}`}
                                            style={resetButtonStyle}
                                        >
                                            Reset
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
