import * as React from 'react';
import { Button } from 'storybook/internal/components';
import { useAddonTheme } from '../useAddonTheme.ts';

export interface ThemeSelectorProps {
    themes: Array<{ name: string; slug: string }>;
    activeTheme: string;
    onThemeChange: (slug: string) => void;
    onNewTheme: () => void;
}

export function ThemeSelector({
    themes,
    activeTheme,
    onThemeChange,
    onNewTheme,
}: ThemeSelectorProps) {
    const theme = useAddonTheme();
    return (
        <div
            style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                padding: '8px',
                borderBottom: `1px solid ${theme.appBorderColor}`,
            }}
        >
            <label
                style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: theme.color.defaultText,
                }}
            >
                Theme:
            </label>
            <select
                value={activeTheme}
                onChange={(e) => onThemeChange(e.target.value)}
                aria-label="Theme selector"
                style={{
                    flex: 1,
                    padding: '4px 8px',
                    fontSize: 12,
                    border: `1px solid ${theme.input.border}`,
                    borderRadius: theme.input.borderRadius,
                    backgroundColor: theme.input.background,
                    color: theme.input.color,
                }}
            >
                <option value="light">Light (base)</option>
                {themes.map((t) => (
                    <option key={t.slug} value={t.slug}>
                        {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                    </option>
                ))}
            </select>
            <Button size="small" variant="outline" onClick={onNewTheme}>
                + New Theme
            </Button>
        </div>
    );
}
