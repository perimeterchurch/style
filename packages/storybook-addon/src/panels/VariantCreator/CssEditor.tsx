import React from 'react';

export interface CssEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

/** Freeform textarea for entering Tailwind classes. */
export function CssEditor({ value, onChange, label }: CssEditorProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {label && (
                <label
                    htmlFor={`css-editor-${label}`}
                    style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}
                >
                    {label}
                </label>
            )}
            <textarea
                id={label ? `css-editor-${label}` : undefined}
                aria-label={label ?? 'CSS classes'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g. rounded-lg shadow-md transition-colors"
                rows={3}
                style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
                    fontSize: 12,
                    padding: '6px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: 4,
                    resize: 'vertical',
                    lineHeight: 1.5,
                }}
            />
        </div>
    );
}
