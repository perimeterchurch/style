import * as React from 'react';

export interface TokenCategory {
    name: string;
    count: number;
}

export interface CategoryTabsProps {
    categories: TokenCategory[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function CategoryTabs({ categories, activeTab, onTabChange }: CategoryTabsProps) {
    return (
        <div
            role="tablist"
            style={{
                display: 'flex',
                gap: 2,
                borderBottom: '1px solid #e5e7eb',
                padding: '0 8px',
                overflowX: 'auto',
            }}
        >
            {categories.map((cat) => (
                <button
                    key={cat.name}
                    role="tab"
                    aria-selected={activeTab === cat.name}
                    onClick={() => onTabChange(cat.name)}
                    style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderBottom:
                            activeTab === cat.name ? '2px solid #3b82f6' : '2px solid transparent',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: activeTab === cat.name ? 600 : 400,
                        color: activeTab === cat.name ? '#1d4ed8' : '#6b7280',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {cat.name} ({cat.count})
                </button>
            ))}
        </div>
    );
}
