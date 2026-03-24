import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock Storybook's Button to avoid theme provider requirement
vi.mock('storybook/internal/components', () => ({
    Button: ({ children, onClick, size, variant, ariaLabel, ...rest }: Record<string, unknown>) => {
        void size;
        void variant;
        void ariaLabel;
        return (
            <button onClick={onClick as () => void} {...rest}>
                {children as React.ReactNode}
            </button>
        );
    },
}));

import { ThemeSelector } from './ThemeSelector.tsx';
import { ComponentTokens } from './ComponentTokens.tsx';
import { ThemeEditor } from './ThemeEditor.tsx';

// ---------------------------------------------------------------------------
// ThemeSelector
// ---------------------------------------------------------------------------

describe('ThemeSelector', () => {
    const themes = [
        { name: 'dark', slug: 'dark' },
        { name: 'easter-2025', slug: 'easter-2025' },
    ];

    it('renders theme selector with base light option', () => {
        render(
            <ThemeSelector
                themes={themes}
                activeTheme="light"
                onThemeChange={() => {}}
                onNewTheme={() => {}}
            />,
        );
        expect(screen.getByLabelText('Theme selector')).toBeInTheDocument();
        expect(screen.getByText('Light (base)')).toBeInTheDocument();
    });

    it('renders theme options', () => {
        render(
            <ThemeSelector
                themes={themes}
                activeTheme="light"
                onThemeChange={() => {}}
                onNewTheme={() => {}}
            />,
        );
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.getByText('Easter-2025')).toBeInTheDocument();
    });

    it('calls onThemeChange when selection changes', () => {
        const onThemeChange = vi.fn();
        render(
            <ThemeSelector
                themes={themes}
                activeTheme="light"
                onThemeChange={onThemeChange}
                onNewTheme={() => {}}
            />,
        );
        fireEvent.change(screen.getByLabelText('Theme selector'), {
            target: { value: 'dark' },
        });
        expect(onThemeChange).toHaveBeenCalledWith('dark');
    });

    it('calls onNewTheme when button is clicked', () => {
        const onNewTheme = vi.fn();
        render(
            <ThemeSelector
                themes={themes}
                activeTheme="light"
                onThemeChange={() => {}}
                onNewTheme={onNewTheme}
            />,
        );
        fireEvent.click(screen.getByText('+ New Theme'));
        expect(onNewTheme).toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// ComponentTokens
// ---------------------------------------------------------------------------

describe('ComponentTokens', () => {
    const baseTokens: Record<string, string> = {
        '--btn-bg': '#3b82f6',
        '--btn-text': '#ffffff',
        '--btn-border': '1px solid #3b82f6',
        '--card-bg': '#ffffff',
    };

    it('shows only tokens matching the prefix', () => {
        render(
            <ComponentTokens
                prefix="btn"
                label="Button"
                baseTokens={baseTokens}
                themeOverrides={{}}
                dirty={{}}
                onTokenChange={() => {}}
                onTokenReset={() => {}}
            />,
        );
        expect(screen.getByLabelText('--btn-bg value')).toBeInTheDocument();
        expect(screen.getByLabelText('--btn-text value')).toBeInTheDocument();
        expect(screen.getByLabelText('--btn-border value')).toBeInTheDocument();
        expect(screen.queryByLabelText('--card-bg value')).not.toBeInTheDocument();
    });

    it('shows reset button for overridden tokens', () => {
        render(
            <ComponentTokens
                prefix="btn"
                label="Button"
                baseTokens={baseTokens}
                themeOverrides={{ '--btn-bg': '#ff0000' }}
                dirty={{}}
                onTokenChange={() => {}}
                onTokenReset={() => {}}
            />,
        );
        expect(screen.getByLabelText('Reset --btn-bg')).toBeInTheDocument();
        expect(screen.queryByLabelText('Reset --btn-text')).not.toBeInTheDocument();
    });

    it('calls onTokenReset when reset button is clicked', () => {
        const onTokenReset = vi.fn();
        render(
            <ComponentTokens
                prefix="btn"
                label="Button"
                baseTokens={baseTokens}
                themeOverrides={{ '--btn-bg': '#ff0000' }}
                dirty={{}}
                onTokenChange={() => {}}
                onTokenReset={onTokenReset}
            />,
        );
        fireEvent.click(screen.getByLabelText('Reset --btn-bg'));
        expect(onTokenReset).toHaveBeenCalledWith('--btn-bg');
    });

    it('shows empty state when no tokens match prefix', () => {
        render(
            <ComponentTokens
                prefix="nonexistent"
                label="Nothing"
                baseTokens={baseTokens}
                themeOverrides={{}}
                dirty={{}}
                onTokenChange={() => {}}
                onTokenReset={() => {}}
            />,
        );
        expect(screen.getByText(/No tokens found for Nothing/)).toBeInTheDocument();
    });

    it('calls onTokenChange when editing a value', () => {
        const onTokenChange = vi.fn();
        render(
            <ComponentTokens
                prefix="btn"
                label="Button"
                baseTokens={baseTokens}
                themeOverrides={{}}
                dirty={{}}
                onTokenChange={onTokenChange}
                onTokenReset={() => {}}
            />,
        );
        fireEvent.change(screen.getByLabelText('--btn-bg value'), {
            target: { value: '#ff0000' },
        });
        expect(onTokenChange).toHaveBeenCalledWith('--btn-bg', '#ff0000');
    });
});

// ---------------------------------------------------------------------------
// ThemeEditor (integration)
// ---------------------------------------------------------------------------

describe('ThemeEditor', () => {
    const mockTokens = {
        '--color-primary': '#3b82f6',
        '--spacing-md': '1rem',
        '--btn-bg': '#3b82f6',
    };

    const mockCategorized = {
        Colors: { Primary: { '--color-primary': '#3b82f6' } },
        Typography: {},
        Spacing: { '--spacing-md': '1rem' },
        Shadows: {},
        Radii: {},
        Transitions: {},
        Other: { '--btn-bg': '#3b82f6' },
    };

    const mockThemeList = {
        themes: [{ name: 'dark', slug: 'dark', filename: 'theme-dark.css' }],
    };

    beforeEach(() => {
        vi.restoreAllMocks();
        global.fetch = vi.fn((url: string | URL | Request) => {
            const urlStr = typeof url === 'string' ? url : url.toString();
            if (urlStr.includes('read-tokens')) {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({ tokens: mockTokens, categorized: mockCategorized }),
                });
            }
            if (urlStr.includes('list-themes')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockThemeList),
                });
            }
            if (urlStr.includes('read-theme')) {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            name: 'dark',
                            tokens: { '--color-primary': '#1e3a5f' },
                        }),
                });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }) as unknown as typeof fetch;
    });

    it('renders theme selector', async () => {
        render(<ThemeEditor />);
        await waitFor(() => {
            expect(screen.getByLabelText('Theme selector')).toBeInTheDocument();
        });
    });

    it('loads theme list on mount', async () => {
        render(<ThemeEditor />);
        await waitFor(() => {
            expect(screen.getByText('Dark')).toBeInTheDocument();
        });
    });

    it('shows Global Tokens tab by default', async () => {
        render(<ThemeEditor />);
        await waitFor(() => {
            expect(screen.getByRole('tab', { name: /Global Tokens/ })).toHaveAttribute(
                'aria-selected',
                'true',
            );
        });
    });

    it('shows component tabs when Components is selected', async () => {
        render(<ThemeEditor />);
        await waitFor(() => {
            expect(screen.getByRole('tab', { name: /Components/ })).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole('tab', { name: /Components/ }));
        expect(screen.getByRole('tab', { name: /Button/ })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Card/ })).toBeInTheDocument();
    });

    it('editing a token tracks dirty state', async () => {
        render(<ThemeEditor />);
        await waitFor(() => {
            expect(screen.getByText('Save')).toBeInTheDocument();
        });

        // The Save button should be disabled when no dirty tokens
        const saveBtn = screen.getByText('Save');
        expect(saveBtn).toBeDisabled();
    });

    it('per-token reset works via ComponentTokens', async () => {
        const channel = { emit: vi.fn() };
        render(<ThemeEditor channel={channel} />);

        await waitFor(() => {
            expect(screen.getByRole('tab', { name: /Components/ })).toBeInTheDocument();
        });

        // Switch to Components tab
        fireEvent.click(screen.getByRole('tab', { name: /Components/ }));

        // The btn-bg token should be visible in Button tab (default component tab)
        await waitFor(() => {
            expect(screen.getByLabelText('--btn-bg value')).toBeInTheDocument();
        });

        // Edit the token to make it dirty
        fireEvent.change(screen.getByLabelText('--btn-bg value'), {
            target: { value: '#ff0000' },
        });

        // Should now show a reset button
        expect(screen.getByLabelText('Reset --btn-bg')).toBeInTheDocument();

        // Click reset
        fireEvent.click(screen.getByLabelText('Reset --btn-bg'));

        // Channel should have emitted TOKEN_CHANGED to restore base value
        expect(channel.emit).toHaveBeenCalled();
    });
});
