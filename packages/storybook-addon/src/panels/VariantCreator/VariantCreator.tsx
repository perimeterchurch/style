import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useStorybookState } from 'storybook/manager-api';
import type {
    VariantDefinition,
    SizeDefinition,
    ParsedVariantsFile,
} from '../../server/readVariants.ts';
import { VariantList } from './VariantList.tsx';
import { VariantEditor } from './VariantEditor.tsx';

export interface VariantCreatorProps {
    active: boolean;
    apiBase?: string;
}

type EditState =
    | { mode: 'list' }
    | {
          mode: 'edit';
          name: string;
          type: 'variant' | 'size';
          definition: VariantDefinition | SizeDefinition;
      }
    | {
          mode: 'clone';
          name: string;
          type: 'variant' | 'size';
          definition: VariantDefinition | SizeDefinition;
      };

/**
 * Extract the component story title from Storybook state.
 * Only returns a value for stories under Components/ that have at least 3 segments.
 */
function extractComponentTitle(storyTitle: string | undefined): string | null {
    if (!storyTitle) return null;
    const parts = storyTitle.split('/');
    if (parts.length < 3 || parts[0] !== 'Components') return null;
    return parts.slice(0, 3).join('/');
}

export function VariantCreator({ active, apiBase = '' }: VariantCreatorProps) {
    const state = useStorybookState();
    const [data, setData] = useState<ParsedVariantsFile | null>(null);
    const [tokens, setTokens] = useState<Array<{ name: string; value: string }>>([]);
    const [editState, setEditState] = useState<EditState>({ mode: 'list' });
    const [error, setError] = useState<string | null>(null);
    const [readOnly, setReadOnly] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Resolve the current component title from the active story
    const storyEntry = state.storyId ? state.index?.[state.storyId] : undefined;
    const storyTitle =
        storyEntry && 'title' in storyEntry ? (storyEntry as { title: string }).title : undefined;
    const componentTitle = extractComponentTitle(storyTitle);

    // Fetch variants when the component changes
    useEffect(() => {
        if (!active || !componentTitle) {
            setData(null);
            return;
        }

        let cancelled = false;

        fetch(
            `${apiBase}/api/style-addon/read-variants?component=${encodeURIComponent(componentTitle)}`,
        )
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((json: ParsedVariantsFile) => {
                if (!cancelled) {
                    setData(json);
                    setError(null);
                    setEditState({ mode: 'list' });
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setData(null);
                    setError(String(err));
                }
            });

        return () => {
            cancelled = true;
        };
    }, [active, componentTitle, apiBase]);

    // Fetch tokens for the property picker
    useEffect(() => {
        if (!active) return;

        let cancelled = false;
        fetch(`${apiBase}/api/style-addon/read-tokens`)
            .then((r) => {
                if (!r.ok) throw new Error('Middleware not available');
                return r.json();
            })
            .then((json: { tokens: Record<string, string> }) => {
                if (!cancelled) {
                    const list = Object.entries(json.tokens).map(([name, value]) => ({
                        name,
                        value,
                    }));
                    setTokens(list);
                    setReadOnly(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setReadOnly(true);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [active, apiBase]);

    const handleEdit = useCallback(
        (name: string, type: 'variant' | 'size') => {
            if (!data) return;
            const definition = type === 'variant' ? data.variants[name] : data.sizes[name];
            if (definition) {
                setEditState({ mode: 'edit', name, type, definition });
            }
        },
        [data],
    );

    const handleClone = useCallback(
        (name: string, type: 'variant' | 'size') => {
            if (!data) return;
            const definition = type === 'variant' ? data.variants[name] : data.sizes[name];
            if (definition) {
                const cloned = {
                    ...definition,
                    _meta: { clonedFrom: name, createdAt: new Date().toISOString() },
                };
                setEditState({ mode: 'clone', name: `${name}Custom`, type, definition: cloned });
            }
        },
        [data],
    );

    const handleDelete = useCallback(
        async (name: string) => {
            if (deleteConfirm !== name) {
                setDeleteConfirm(name);
                return;
            }
            setDeleteConfirm(null);

            if (!componentTitle) return;

            try {
                const res = await fetch(
                    `${apiBase}/api/style-addon/delete-variant?component=${encodeURIComponent(componentTitle)}&variant=${encodeURIComponent(name)}`,
                    { method: 'DELETE' },
                );
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
                }

                // Refresh
                setData((prev) => {
                    if (!prev) return prev;
                    const { [name]: _, ...rest } = prev.variants;
                    void _;
                    return { ...prev, variants: rest };
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            }
        },
        [componentTitle, apiBase, deleteConfirm],
    );

    const handleSave = useCallback(
        async (variantName: string, definition: VariantDefinition | SizeDefinition) => {
            if (!componentTitle) return;
            setError(null);

            const isNew = editState.mode === 'clone';
            const suffix =
                editState.mode !== 'list' && editState.type === 'size' ? 'Sizes' : 'Variants';

            try {
                const res = await fetch(`${apiBase}/api/style-addon/write-variant`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        component: componentTitle,
                        suffix,
                        name: variantName,
                        definition,
                        mode: isNew ? 'add' : 'update',
                    }),
                });
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
                }

                // Refresh the variant list
                const refreshRes = await fetch(
                    `${apiBase}/api/style-addon/read-variants?component=${encodeURIComponent(componentTitle)}`,
                );
                if (refreshRes.ok) {
                    const json = (await refreshRes.json()) as ParsedVariantsFile;
                    setData(json);
                }

                setEditState({ mode: 'list' });
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            }
        },
        [componentTitle, apiBase, editState],
    );

    const handleCancel = useCallback(() => {
        setEditState({ mode: 'list' });
        setDeleteConfirm(null);
    }, []);

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    if (!active) return null;

    if (!componentTitle) {
        return (
            <div style={{ padding: 16, color: '#6b7280', fontSize: 13 }}>
                No variants available for this view
            </div>
        );
    }

    if (error && !data) {
        return (
            <div style={{ padding: 16, color: '#991b1b', fontSize: 13 }}>
                Error loading variants: {error}
            </div>
        );
    }

    if (!data) {
        return <div style={{ padding: 16, fontSize: 13 }}>Loading variants...</div>;
    }

    return (
        <div
            style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
            {/* Read-only banner */}
            {readOnly && (
                <div
                    role="status"
                    style={{
                        padding: '8px 12px',
                        backgroundColor: '#fefce8',
                        color: '#854d0e',
                        borderBottom: '1px solid #fde68a',
                        fontSize: 12,
                    }}
                >
                    Read-only — run pnpm dev locally to edit
                </div>
            )}

            {/* Error banner */}
            {error && (
                <div
                    role="alert"
                    style={{
                        padding: '8px 12px',
                        backgroundColor: '#fef2f2',
                        color: '#991b1b',
                        borderBottom: '1px solid #fca5a5',
                        fontSize: 13,
                    }}
                >
                    {error}
                </div>
            )}

            {/* Delete confirmation */}
            {deleteConfirm && (
                <div
                    style={{
                        padding: '8px 12px',
                        backgroundColor: '#fef2f2',
                        borderBottom: '1px solid #fca5a5',
                        display: 'flex',
                        gap: 8,
                        alignItems: 'center',
                        fontSize: 12,
                    }}
                >
                    <span>Delete "{deleteConfirm}"?</span>
                    <button
                        onClick={() => handleDelete(deleteConfirm)}
                        style={{
                            padding: '2px 8px',
                            fontSize: 11,
                            borderRadius: 4,
                            border: '1px solid #dc2626',
                            backgroundColor: '#dc2626',
                            color: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{
                            padding: '2px 8px',
                            fontSize: 11,
                            borderRadius: 4,
                            border: '1px solid #d1d5db',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                {editState.mode === 'list' ? (
                    <VariantList
                        variants={data.variants}
                        sizes={data.sizes}
                        onEdit={handleEdit}
                        onClone={handleClone}
                        onDelete={(name) => handleDelete(name)}
                        readOnly={readOnly}
                    />
                ) : (
                    <VariantEditor
                        variant={editState.definition}
                        variantName={editState.name}
                        editType={editState.type}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        tokens={tokens}
                    />
                )}
            </div>
        </div>
    );
}
