import * as React from 'react';
import { Badge } from 'storybook/internal/components';
import { useAddonTheme } from '../useAddonTheme.ts';

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
    const theme = useAddonTheme();

    return (
        <div
            role="tablist"
            style={{
                display: 'flex',
                gap: 2,
                padding: '4px 8px',
                borderBottom: `1px solid ${theme.appBorderColor}`,
                backgroundColor: theme.background.content,
            }}
        >
            {categories.map((cat) => {
                const isActive = cat.name === activeTab;
                return (
                    <button
                        key={cat.name}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onTabChange(cat.name)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            fontSize: 12,
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? theme.color.secondary : theme.barTextColor,
                            background: isActive ? theme.background.hoverable : 'transparent',
                            border: 'none',
                            borderBottom: isActive
                                ? `2px solid ${theme.color.secondary}`
                                : '2px solid transparent',
                            borderRadius: '4px 4px 0 0',
                            cursor: 'pointer',
                            transition: 'color 0.15s, background 0.15s',
                        }}
                    >
                        {cat.name}
                        <Badge compact status={isActive ? 'active' : 'neutral'}>
                            {cat.count}
                        </Badge>
                    </button>
                );
            })}
        </div>
    );
}
