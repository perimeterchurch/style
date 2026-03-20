import { ColorEditor, SpacingEditor, ShadowEditor, TextEditor } from './editors';

export interface TokenGroupProps {
    name: string;
    tokens: Array<{ name: string; value: string }>;
    editorType: string;
    onTokenChange: (name: string, value: string) => void;
    isCollapsed: boolean;
    onToggle: () => void;
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
}: TokenGroupProps) {
    const Editor = editorForType(editorType);

    return (
        <div style={{ marginBottom: 8 }}>
            <button
                onClick={onToggle}
                aria-expanded={!isCollapsed}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '6px 8px',
                    border: 'none',
                    backgroundColor: '#f3f4f6',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: 'left',
                }}
            >
                <span
                    style={{
                        transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0)',
                        transition: 'transform 0.15s',
                    }}
                >
                    ▾
                </span>
                {name}
                <span style={{ color: '#888', fontWeight: 400, fontSize: 11, marginLeft: 'auto' }}>
                    {tokens.length}
                </span>
            </button>
            {!isCollapsed && (
                <div style={{ padding: '4px 0 4px 12px' }}>
                    {tokens.map((token) => (
                        <Editor
                            key={token.name}
                            name={token.name}
                            value={token.value}
                            onChange={onTokenChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
