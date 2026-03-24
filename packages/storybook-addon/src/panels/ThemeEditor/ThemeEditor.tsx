import * as React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { CategorizedTokens, TokenRecord } from '../../server/readTokens.ts';
import type { ThemeInfo } from '../../server/listThemes.ts';
import { EVENTS } from '../../constants.ts';
import { useAddonTheme } from '../useAddonTheme.ts';
import { CategoryTabs, type TokenCategory } from '../TokenEditor/CategoryTabs.tsx';
import { TokenSearch } from '../TokenEditor/TokenSearch.tsx';
import { TokenGroup } from '../TokenEditor/TokenGroup.tsx';
import { TextEditor } from '../editors/index.ts';
import { ThemeSelector } from './ThemeSelector.tsx';
import { ComponentTokens } from './ComponentTokens.tsx';

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

const COMPONENT_TABS = [
    { prefix: 'btn', label: 'Button' },
    { prefix: 'card', label: 'Card' },
    { prefix: 'badge', label: 'Badge' },
    { prefix: 'fc', label: 'Form Controls' },
    { prefix: 'checkbox', label: 'Checkbox' },
    { prefix: 'switch', label: 'Switch' },
    { prefix: 'avatar', label: 'Avatar' },
    { prefix: 'tabs', label: 'Tabs' },
    { prefix: 'label', label: 'Label' },
];

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

/** Build sub-groups for display within a category. */
function buildSubGroups(
    group: Record<string, string> | Record<string, Record<string, string>>,
): Array<{ name: string; tokens: Array<{ name: string; value: string }> }> {
    const first = Object.values(group)[0];
    if (first === undefined) return [];
    if (typeof first === 'string') {
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
    return Object.entries(group).map(([subName, tokens]) => ({
        name: subName,
        tokens: Object.entries(tokens as Record<string, string>).map(([name, value]) => ({
            name,
            value,
        })),
    }));
}

type TopLevelTab = 'global' | 'component';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface ThemeEditorPanelProps {
    channel?: { emit: (event: string, ...args: unknown[]) => void };
    apiBase?: string;
}

export function ThemeEditor({ channel, apiBase = '' }: ThemeEditorPanelProps) {
    const theme = useAddonTheme();

    // Theme state
    const [themes, setThemes] = useState<ThemeInfo[]>([]);
    const [activeTheme, setActiveTheme] = useState('light');
    const [baseTokens, setBaseTokens] = useState<Record<string, string>>({});
    const [themeOverrides, setThemeOverrides] = useState<Record<string, string>>({});
    const [dirty, setDirty] = useState<Record<string, string>>({});

    // UI state
    const [data, setData] = useState<FetchedTokenData | null>(null);
    const [topTab, setTopTab] = useState<TopLevelTab>('global');
    const [activeCategory, setActiveCategory] = useState('');
    const [activeComponent, setActiveComponent] = useState(COMPONENT_TABS[0].prefix);
    const [search, setSearch] = useState('');
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [showNewThemeDialog, setShowNewThemeDialog] = useState(false);
    const [newThemeName, setNewThemeName] = useState('');

    // Fetch base tokens on mount
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
                setBaseTokens(json.tokens);
                setReadOnly(false);
                const cats = buildCategories(json.categorized);
                if (cats.length > 0 && !activeCategory) {
                    setActiveCategory(cats[0].name);
                }
            })
            .catch((err) => {
                if (cancelled) return;
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

    // Fetch theme list on mount
    useEffect(() => {
        let cancelled = false;
        fetch(`${apiBase}/api/style-addon/list-themes`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((json: { themes: ThemeInfo[] }) => {
                if (!cancelled) setThemes(json.themes);
            })
            .catch(() => {
                // Silently fail — themes are optional
            });
        return () => {
            cancelled = true;
        };
    }, [apiBase]);

    // Handle theme switch
    const handleThemeChange = useCallback(
        (slug: string) => {
            setActiveTheme(slug);
            setDirty({});
            channel?.emit(EVENTS.THEME_CHANGED, { theme: slug });
            channel?.emit(EVENTS.TOKENS_RESET);

            if (slug === 'light') {
                setThemeOverrides({});
                return;
            }

            fetch(`${apiBase}/api/style-addon/read-theme?theme=${encodeURIComponent(slug)}`)
                .then((r) => {
                    if (!r.ok) throw new Error(`HTTP ${r.status}`);
                    return r.json();
                })
                .then((json: { name: string; tokens: Record<string, string> }) => {
                    setThemeOverrides(json.tokens);
                    // Apply overrides to live preview
                    for (const [name, value] of Object.entries(json.tokens)) {
                        channel?.emit(EVENTS.TOKEN_CHANGED, { name, value });
                    }
                })
                .catch((err) => {
                    setError(err instanceof Error ? err.message : String(err));
                });
        },
        [apiBase, channel],
    );

    const handleTokenChange = useCallback(
        (name: string, value: string) => {
            setDirty((prev) => ({ ...prev, [name]: value }));
            channel?.emit(EVENTS.TOKEN_CHANGED, { name, value });
        },
        [channel],
    );

    const handleTokenReset = useCallback(
        (name: string) => {
            setDirty((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
            // Emit the base value to restore preview
            const baseValue = baseTokens[name];
            if (baseValue) {
                channel?.emit(EVENTS.TOKEN_CHANGED, { name, value: baseValue });
            }
        },
        [baseTokens, channel],
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
            if (activeTheme === 'light') {
                // Save to base tokens
                const res = await fetch(`${apiBase}/api/style-addon/write-tokens`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ updates: dirty }),
                });
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
                }
                setBaseTokens((prev) => ({ ...prev, ...dirty }));
                setData((prev) => {
                    if (!prev) return prev;
                    return { ...prev, tokens: { ...prev.tokens, ...dirty } };
                });
            } else {
                // Save as theme overrides
                const allOverrides = { ...themeOverrides, ...dirty };
                const res = await fetch(`${apiBase}/api/style-addon/write-theme`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: activeTheme, tokens: allOverrides }),
                });
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
                }
                setThemeOverrides(allOverrides);
            }
            setDirty({});
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setSaving(false);
        }
    }, [dirty, activeTheme, themeOverrides, apiBase]);

    const handleNewTheme = useCallback(async () => {
        if (!newThemeName.trim()) return;
        setSaving(true);
        setError(null);
        try {
            const tokens = { ...baseTokens, ...dirty };
            const res = await fetch(`${apiBase}/api/style-addon/write-theme`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newThemeName.trim(), tokens }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
            }
            // Refresh theme list and switch to new theme
            const slug = newThemeName.trim();
            const listRes = await fetch(`${apiBase}/api/style-addon/list-themes`);
            if (listRes.ok) {
                const listJson = (await listRes.json()) as { themes: ThemeInfo[] };
                setThemes(listJson.themes);
            }
            setActiveTheme(slug);
            setThemeOverrides(tokens);
            setDirty({});
            setShowNewThemeDialog(false);
            setNewThemeName('');
            channel?.emit(EVENTS.THEME_CHANGED, { theme: slug });
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setSaving(false);
        }
    }, [newThemeName, baseTokens, dirty, apiBase, channel]);

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

    function applyDirty(tokens: Array<{ name: string; value: string }>) {
        return tokens.map((t) =>
            dirty[t.name] !== undefined ? { ...t, value: dirty[t.name] } : t,
        );
    }

    const isSearching = search.trim().length > 0;
    const searchLower = search.toLowerCase();

    let searchResults: Array<{ name: string; value: string }> = [];
    if (isSearching) {
        const allTokens = Object.entries(data.tokens).map(([name, value]) => ({ name, value }));
        searchResults = applyDirty(
            allTokens.filter((t) => t.name.toLowerCase().includes(searchLower)),
        );
    }

    const activeCatData = data.categorized[activeCategory as keyof CategorizedTokens];
    const subGroups = activeCatData ? buildSubGroups(activeCatData as Record<string, string>) : [];
    const editorType = CATEGORY_EDITOR_MAP[activeCategory] ?? 'text';

    const activeComponentTab = COMPONENT_TABS.find((t) => t.prefix === activeComponent);

    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Theme Selector */}
            <ThemeSelector
                themes={themes}
                activeTheme={activeTheme}
                onThemeChange={handleThemeChange}
                onNewTheme={() => setShowNewThemeDialog(true)}
            />

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

            {/* Toolbar */}
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
                    <button
                        onClick={handleSave}
                        disabled={!hasDirtyTokens || saving}
                        style={{
                            padding: '4px 12px',
                            fontSize: 12,
                            borderRadius: 4,
                            border: `1px solid ${theme.barSelectedColor}`,
                            backgroundColor: theme.barSelectedColor,
                            color: theme.color.lightest,
                            cursor: 'pointer',
                        }}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={!hasDirtyTokens}
                        style={{
                            padding: '4px 12px',
                            fontSize: 12,
                            borderRadius: 4,
                            border: `1px solid ${theme.appBorderColor}`,
                            backgroundColor: theme.barBg,
                            color: theme.color.defaultText,
                            cursor: 'pointer',
                        }}
                    >
                        Reset
                    </button>
                    {hasDirtyTokens && (
                        <span
                            style={{
                                marginLeft: 'auto',
                                fontSize: 12,
                                color: theme.color.warning,
                            }}
                        >
                            {Object.keys(dirty).length} modified
                        </span>
                    )}
                </div>
            )}

            {/* New Theme dialog */}
            {showNewThemeDialog && (
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
                    <input
                        type="text"
                        value={newThemeName}
                        onChange={(e) => setNewThemeName(e.target.value)}
                        placeholder="Theme name (e.g. easter-2025)"
                        aria-label="Theme name"
                        style={{ flex: 1 }}
                    />
                    <button
                        onClick={handleNewTheme}
                        disabled={!newThemeName.trim() || saving}
                        style={{
                            padding: '4px 12px',
                            fontSize: 12,
                            borderRadius: 4,
                            border: `1px solid ${theme.barSelectedColor}`,
                            backgroundColor: theme.barSelectedColor,
                            color: theme.color.lightest,
                            cursor: 'pointer',
                        }}
                    >
                        {saving ? 'Creating...' : 'Create'}
                    </button>
                    <button
                        onClick={() => {
                            setShowNewThemeDialog(false);
                            setNewThemeName('');
                        }}
                        style={{
                            padding: '4px 12px',
                            fontSize: 12,
                            borderRadius: 4,
                            border: `1px solid ${theme.appBorderColor}`,
                            backgroundColor: theme.barBg,
                            color: theme.color.defaultText,
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Search */}
            <TokenSearch value={search} onChange={setSearch} />

            {/* Top-level tabs: Global Tokens | Components */}
            {!isSearching && (
                <div
                    role="tablist"
                    aria-label="Editor sections"
                    style={{
                        display: 'flex',
                        gap: 0,
                        borderBottom: `1px solid ${theme.appBorderColor}`,
                        padding: '0 8px',
                    }}
                >
                    <button
                        role="tab"
                        aria-selected={topTab === 'global'}
                        onClick={() => setTopTab('global')}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderBottom:
                                topTab === 'global'
                                    ? `2px solid ${theme.barSelectedColor}`
                                    : '2px solid transparent',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: topTab === 'global' ? 600 : 400,
                            color:
                                topTab === 'global' ? theme.barSelectedColor : theme.barTextColor,
                        }}
                    >
                        Global Tokens
                    </button>
                    <button
                        role="tab"
                        aria-selected={topTab === 'component'}
                        onClick={() => setTopTab('component')}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderBottom:
                                topTab === 'component'
                                    ? `2px solid ${theme.barSelectedColor}`
                                    : '2px solid transparent',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: topTab === 'component' ? 600 : 400,
                            color:
                                topTab === 'component'
                                    ? theme.barSelectedColor
                                    : theme.barTextColor,
                        }}
                    >
                        Components
                    </button>
                </div>
            )}

            {/* Category sub-tabs (Global Tokens mode) */}
            {!isSearching && topTab === 'global' && categories.length > 0 && (
                <CategoryTabs
                    categories={categories}
                    activeTab={activeCategory}
                    onTabChange={setActiveCategory}
                />
            )}

            {/* Component sub-tabs */}
            {!isSearching && topTab === 'component' && (
                <div
                    role="tablist"
                    aria-label="Component tabs"
                    style={{
                        display: 'flex',
                        gap: 2,
                        borderBottom: `1px solid ${theme.appBorderColor}`,
                        padding: '0 8px',
                        overflowX: 'auto',
                    }}
                >
                    {COMPONENT_TABS.map((ct) => (
                        <button
                            key={ct.prefix}
                            role="tab"
                            aria-selected={activeComponent === ct.prefix}
                            onClick={() => setActiveComponent(ct.prefix)}
                            style={{
                                padding: '6px 12px',
                                border: 'none',
                                borderBottom:
                                    activeComponent === ct.prefix
                                        ? `2px solid ${theme.barSelectedColor}`
                                        : '2px solid transparent',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                fontSize: 12,
                                fontWeight: activeComponent === ct.prefix ? 600 : 400,
                                color:
                                    activeComponent === ct.prefix
                                        ? theme.barSelectedColor
                                        : theme.barTextColor,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {ct.label}
                        </button>
                    ))}
                </div>
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
                        searchResults.map((token) => (
                            <TextEditor
                                key={token.name}
                                name={token.name}
                                value={token.value}
                                onChange={handleTokenChange}
                            />
                        ))
                    )
                ) : topTab === 'global' ? (
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
                ) : activeComponentTab ? (
                    <ComponentTokens
                        prefix={activeComponentTab.prefix}
                        label={activeComponentTab.label}
                        baseTokens={baseTokens}
                        themeOverrides={themeOverrides}
                        dirty={dirty}
                        onTokenChange={handleTokenChange}
                        onTokenReset={handleTokenReset}
                    />
                ) : null}
            </div>
        </div>
    );
}
