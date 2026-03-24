import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useChannel } from 'storybook/manager-api';
import { EVENTS } from '../constants.ts';
import { useAddonTheme } from '../panels/useAddonTheme.ts';

interface ThemeOption {
    name: string;
    slug: string;
}

const STORAGE_KEY = 'perimeterchurch-style-addon-theme';

function loadPersistedTheme(): string {
    try {
        return localStorage.getItem(STORAGE_KEY) ?? 'light';
    } catch {
        return 'light';
    }
}

function persistTheme(slug: string): void {
    try {
        localStorage.setItem(STORAGE_KEY, slug);
    } catch {
        // Storage unavailable — ignore
    }
}

export function ThemeSwitcher() {
    const sbTheme = useAddonTheme();
    const [themes, setThemes] = useState<ThemeOption[]>([]);
    const [active, setActive] = useState(loadPersistedTheme);

    const emit = useChannel({});

    useEffect(() => {
        let cancelled = false;
        fetch('/api/style-addon/list-themes')
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((json: { themes: ThemeOption[] }) => {
                if (!cancelled) setThemes(json.themes);
            })
            .catch(() => {
                // Theme list unavailable — toolbar stays with light/dark only
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // Emit initial theme on mount so preview gets the persisted selection
    useEffect(() => {
        emit(EVENTS.THEME_CHANGED, { theme: active });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const slug = e.target.value;
            setActive(slug);
            persistTheme(slug);
            emit(EVENTS.THEME_CHANGED, { theme: slug });
        },
        [emit],
    );

    const allOptions: ThemeOption[] = [
        { name: 'Light', slug: 'light' },
        { name: 'Dark', slug: 'dark' },
        ...themes.filter((t) => t.slug !== 'light' && t.slug !== 'dark'),
    ];

    return (
        <select
            value={active}
            onChange={handleChange}
            aria-label="Theme switcher"
            title="Switch theme"
            style={{
                appearance: 'none',
                padding: '4px 24px 4px 8px',
                fontSize: 12,
                fontWeight: 500,
                border: `1px solid ${sbTheme.appBorderColor}`,
                borderRadius: 4,
                backgroundColor: sbTheme.barBg,
                color: sbTheme.barTextColor,
                cursor: 'pointer',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 6px center',
            }}
        >
            {allOptions.map((t) => (
                <option key={t.slug} value={t.slug}>
                    {t.name}
                </option>
            ))}
        </select>
    );
}
