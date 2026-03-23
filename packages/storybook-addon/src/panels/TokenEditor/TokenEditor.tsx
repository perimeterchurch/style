import * as React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { CategorizedTokens, TokenRecord } from '../../server/readTokens.ts';
import { EVENTS } from '../../constants.ts';
import { useAddonTheme } from '../useAddonTheme.ts';
import { CategoryTabs, type TokenCategory } from './CategoryTabs.tsx';
import { TokenSearch } from './TokenSearch.tsx';
import { TokenGroup } from './TokenGroup.tsx';
import { ColorEditor, SpacingEditor, ShadowEditor, TextEditor } from './editors/index.ts';
import { Button, Badge, Form } from 'storybook/internal/components';
import { HintText } from '../shared/HintText.tsx';
import { HelpToggle } from '../shared/HelpToggle.tsx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FetchedTokenData {
    tokens: TokenRecord;
    categorized: CategorizedTokens;
}

/** Maps top-level category names to the editor type used for their tokens. */
const CATEGORY_EDITOR_MAP: Record<string, string> = {
    Colors: 'color',
    Spacing: 'spacing',
    Shadows: 'shadow',
    Typography: 'text',
    Radii: 'text',
    Transitions: 'text',
    Other: 'text',
};

/** Resolve editor component from a category editor type string. */
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Flatten a CategorizedTokens structure into {name, value}[] for a category. */
function flattenCategory(
    cat: Record<string, string> | Record<string, Record<string, string>>,
): Array<{ name: string; value: string }> {
    const result: Array<{ name: string; value: string }> = [];
    for (const [key, val] of Object.entries(cat)) {
        if (typeof val === 'string') {
            result.push({ name: key, value: val });
        } else {
            // Sub-grouped (e.g. Colors -> Primary -> tokens)
            for (const [innerKey, innerVal] of Object.entries(val)) {
                result.push({ name: innerKey, value: innerVal as string });
            }
        }
    }
    return result;
}

/** Build the list of TokenCategory for tabs. */
function buildCategories(categorized: CategorizedTokens): TokenCategory[] {
    return Object.entries(categorized)
        .map(([name, group]) => ({
            name,
            count: flattenCategory(group as Record<string, string>).length,
        }))
        .filter((c) => c.count > 0);
}

/** Build sub-groups for display within a category (Colors has Primary, Surface, etc.). */
function buildSubGroups(
    group: Record<string, string> | Record<string, Record<string, string>>,
): Array<{ name: string; tokens: Array<{ name: string; value: string }> }> {
    const first = Object.values(group)[0];
    if (first === undefined) return [];
    if (typeof first === 'string') {
        // Flat category like Spacing
        return [
            {
                name: 'All',
                tokens: Object.entries(group).map(([name, value]) => ({
                    name,
                    value: value as string,
                })),
            },
        ];
    }
    // Sub-grouped
    return Object.entries(group).map(([subName, tokens]) => ({
        name: subName,
        tokens: Object.entries(tokens as Record<string, string>).map(([name, value]) => ({
            name,
            value,
        })),
    }));
}

/** Build a lookup from token name to category name. */
function buildTokenToCategoryMap(categorized: CategorizedTokens): Map<string, string> {
    const map = new Map<string, string>();
    for (const [catName, group] of Object.entries(categorized)) {
        const tokens = flattenCategory(group as Record<string, string>);
        for (const token of tokens) {
            map.set(token.name, catName);
        }
    }
    return map;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface TokenEditorPanelProps {
    /** Storybook channel for emitting events. */
    channel?: { emit: (event: string, ...args: unknown[]) => void };
    /** Override the API base URL (useful for testing). */
    apiBase?: string;
}

export function TokenEditor({ channel, apiBase = '' }: TokenEditorPanelProps) {
    const theme = useAddonTheme();
    const [data, setData] = useState<FetchedTokenData | null>(null);
    const [dirty, setDirty] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState('');
    const activeTabRef = useRef(activeTab);
    activeTabRef.current = activeTab;
    const [search, setSearch] = useState('');
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [showThemeDialog, setShowThemeDialog] = useState(false);
    const [themeName, setThemeName] = useState('');
    const [readOnly, setReadOnly] = useState(false);
    const [showHints, setShowHints] = useState(false);

    // Fetch tokens on mount — detect read-only mode if middleware is unavailable
    useEffect(() => {
        let cancelled = false;
        fetch(`${apiBase}/api/style-addon/read-tokens`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((json: FetchedTokenData) => {
                if (cancelled) return;
                setData(json);
                setReadOnly(false);
                const cats = buildCategories(json.categorized);
                if (cats.length > 0 && !activeTabRef.current) {
                    setActiveTab(cats[0].name);
                }
            })
            .catch((err) => {
                if (cancelled) return;
                // Network error means middleware is not available (production build)
                const message = String(err);
                if (
                    message.includes('fetch') ||
                    message.includes('network') ||
                    message.includes('Failed')
                ) {
                    setReadOnly(true);
                }
                setError(message);
            });
        return () => {
            cancelled = true;
        };
    }, [apiBase]);

    const handleTokenChange = useCallback(
        (name: string, value: string) => {
            setDirty((prev) => ({ ...prev, [name]: value }));
            channel?.emit(EVENTS.TOKEN_CHANGED, { name, value });
        },
        [channel],
    );

    const handleTokenReset = useCallback(
        (name: string) => {
            if (!data) return;
            const originalValue = data.tokens[name];
            if (originalValue === undefined) return;
            setDirty((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
            channel?.emit(EVENTS.TOKEN_CHANGED, { name, value: originalValue });
        },
        [channel, data],
    );

    const handleReset = useCallback(() => {
        setDirty({});
        channel?.emit(EVENTS.TOKENS_RESET);
    }, [channel]);

    const handleSave = useCallback(async () => {
        if (Object.keys(dirty).length === 0) return;
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`${apiBase}/api/style-addon/write-tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates: dirty }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
            }
            // Merge dirty into the original data and clear dirty state
            setData((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    tokens: { ...prev.tokens, ...dirty },
                };
            });
            setDirty({});
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setSaving(false);
        }
    }, [dirty, apiBase]);

    const handleSaveAsTheme = useCallback(async () => {
        if (!themeName.trim()) return;
        setSaving(true);
        setError(null);
        try {
            const allTokens = data ? { ...data.tokens, ...dirty } : dirty;
            const res = await fetch(`${apiBase}/api/style-addon/write-theme`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: themeName.trim(), tokens: allTokens }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
            }
            setShowThemeDialog(false);
            setThemeName('');
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setSaving(false);
        }
    }, [themeName, data, dirty, apiBase]);

    const toggleGroup = useCallback((groupName: string) => {
        setCollapsed((prev) => {
            const next = new Set(prev);
            if (next.has(groupName)) {
                next.delete(groupName);
            } else {
                next.add(groupName);
            }
            return next;
        });
    }, []);

    // ---------------------------------------------------------------------------
    // Derived state
    // ---------------------------------------------------------------------------

    if (!data) {
        return (
            <div style={{ padding: 16, color: theme.color.defaultText }}>
                {error ? `Error: ${error}` : 'Loading tokens...'}
            </div>
        );
    }

    const categories = buildCategories(data.categorized);
    const hasDirtyTokens = Object.keys(dirty).length > 0;
    const dirtyTokenSet = new Set(Object.keys(dirty));

    /** Merge dirty values into a token list. */
    function applyDirty(tokens: Array<{ name: string; value: string }>) {
        return tokens.map((t) =>
            dirty[t.name] !== undefined ? { ...t, value: dirty[t.name] } : t,
        );
    }

    // Search mode: flat list across all categories
    const isSearching = search.trim().length > 0;
    const searchLower = search.toLowerCase();

    let searchResults: Array<{ name: string; value: string }> = [];
    if (isSearching) {
        const allTokens = Object.entries(data.tokens).map(([name, value]) => ({ name, value }));
        searchResults = applyDirty(
            allTokens.filter((t) => t.name.toLowerCase().includes(searchLower)),
        );
    }

    // Token-to-category lookup for search results
    const tokenToCategory = isSearching ? buildTokenToCategoryMap(data.categorized) : null;

    // Active category data
    const activeCatData = data.categorized[activeTab as keyof CategorizedTokens];
    const subGroups = activeCatData ? buildSubGroups(activeCatData as Record<string, string>) : [];
    const editorType = CATEGORY_EDITOR_MAP[activeTab] ?? 'text';

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
                        backgroundColor: theme.color.warning + '22',
                        color: theme.color.warning,
                        borderBottom: `1px solid ${theme.color.warning}44`,
                        fontSize: 12,
                    }}
                >
                    Read-only — run pnpm dev locally to edit
                </div>
            )}

            {/* Error banner */}
            {error && !readOnly && (
                <div
                    role="alert"
                    style={{
                        padding: '8px 12px',
                        backgroundColor: theme.color.negative + '22',
                        color: theme.color.negative,
                        borderBottom: `1px solid ${theme.color.negative}44`,
                        fontSize: 13,
                    }}
                >
                    {error}
                </div>
            )}

            {/* Hint text */}
            <div style={{ padding: '8px 8px 0' }}>
                <HintText hintId="token-editor-intro" forceShow={showHints}>
                    Design tokens are the shared values (colors, spacing, shadows) used across all
                    components. Changes here update the live preview instantly.
                </HintText>
            </div>

            {/* Toolbar — hidden in read-only mode */}
            {!readOnly && (
                <div
                    style={{
                        display: 'flex',
                        gap: 4,
                        padding: '8px',
                        borderBottom: `1px solid ${theme.appBorderColor}`,
                        alignItems: 'center',
                    }}
                >
                    <Button
                        size="small"
                        variant="solid"
                        onClick={handleSave}
                        disabled={!hasDirtyTokens || saving}
                        tooltip="Writes changes to tokens.css — Vite HMR will reload automatically"
                        ariaLabel={false}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                        size="small"
                        variant="outline"
                        onClick={() => setShowThemeDialog(true)}
                        tooltip="Creates a new theme CSS file with all current token values"
                        ariaLabel={false}
                    >
                        Save as Theme
                    </Button>
                    <Button
                        size="small"
                        variant="ghost"
                        onClick={handleReset}
                        disabled={!hasDirtyTokens}
                        tooltip="Revert all unsaved changes"
                        ariaLabel={false}
                    >
                        Reset
                    </Button>
                    {hasDirtyTokens && (
                        <span style={{ marginLeft: 'auto' }}>
                            <Badge compact status="warning">
                                {Object.keys(dirty).length} modified
                            </Badge>
                        </span>
                    )}
                    <HelpToggle onReset={() => setShowHints(true)} />
                </div>
            )}

            {/* Theme dialog */}
            {showThemeDialog && (
                <div
                    style={{
                        padding: 12,
                        borderBottom: `1px solid ${theme.appBorderColor}`,
                        backgroundColor: theme.background.app,
                        display: 'flex',
                        gap: 8,
                        alignItems: 'center',
                    }}
                >
                    <Form.Input
                        value={themeName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setThemeName(e.target.value)
                        }
                        placeholder="Theme name (e.g. easter-2025)"
                        aria-label="Theme name"
                        style={{ flex: 1 }}
                    />
                    <Button
                        size="small"
                        variant="solid"
                        onClick={handleSaveAsTheme}
                        disabled={!themeName.trim() || saving}
                        ariaLabel={false}
                    >
                        {saving ? 'Creating...' : 'Create'}
                    </Button>
                    <Button
                        size="small"
                        variant="outline"
                        onClick={() => {
                            setShowThemeDialog(false);
                            setThemeName('');
                        }}
                        ariaLabel={false}
                    >
                        Cancel
                    </Button>
                </div>
            )}

            {/* Search */}
            <TokenSearch value={search} onChange={setSearch} />

            {/* Category tabs (hidden during search) */}
            {!isSearching && categories.length > 0 && (
                <CategoryTabs
                    categories={categories}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            )}

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
                {isSearching ? (
                    searchResults.length === 0 ? (
                        <div
                            style={{
                                padding: 16,
                                color: theme.color.mediumdark,
                                textAlign: 'center',
                            }}
                        >
                            No tokens matching &quot;{search}&quot;
                        </div>
                    ) : (
                        searchResults.map((token) => {
                            const catName = tokenToCategory?.get(token.name) ?? 'Other';
                            const searchEditorType = CATEGORY_EDITOR_MAP[catName] ?? 'text';
                            const Editor = editorForType(searchEditorType);
                            return (
                                <div
                                    key={token.name}
                                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <Editor
                                            name={token.name}
                                            value={token.value}
                                            onChange={handleTokenChange}
                                        />
                                    </div>
                                    {tokenToCategory && (
                                        <Badge compact status="neutral">
                                            {catName}
                                        </Badge>
                                    )}
                                </div>
                            );
                        })
                    )
                ) : (
                    subGroups.map((group) => (
                        <TokenGroup
                            key={group.name}
                            name={group.name}
                            tokens={applyDirty(group.tokens)}
                            editorType={editorType}
                            onTokenChange={handleTokenChange}
                            isCollapsed={collapsed.has(group.name)}
                            onToggle={() => toggleGroup(group.name)}
                            dirtyTokens={dirtyTokenSet}
                            onTokenReset={handleTokenReset}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
