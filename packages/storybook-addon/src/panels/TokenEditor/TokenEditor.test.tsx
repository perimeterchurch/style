import * as React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

/**
 * The Storybook Badge component requires a full theme context with typography
 * scales that aren't available in jsdom. Provide lightweight replacements so
 * CategoryTabs (which imports Badge) renders predictably in tests.
 */
vi.mock('storybook/internal/components', () => ({
    Badge: ({ children, ...props }: any) => (
        <span data-testid="badge" {...props}>
            {children}
        </span>
    ),
    Button: ({ children, onClick, disabled, ...props }: any) => (
        <button onClick={onClick} disabled={disabled} {...props}>
            {children}
        </button>
    ),
    Form: {
        Input: (props: any) => <input {...props} />,
    },
}));

import { CategoryTabs, type TokenCategory } from './CategoryTabs.tsx';
import { TokenSearch } from './TokenSearch.tsx';
import { TokenEditor } from './TokenEditor.tsx';
import { ColorEditor } from './editors/ColorEditor.tsx';
import { SpacingEditor } from './editors/SpacingEditor.tsx';
import { ShadowEditor } from './editors/ShadowEditor.tsx';
import { TextEditor } from './editors/TextEditor.tsx';
import { EVENTS } from '../../constants.ts';

// ---------------------------------------------------------------------------
// CategoryTabs
// ---------------------------------------------------------------------------

describe('CategoryTabs', () => {
    const categories: TokenCategory[] = [
        { name: 'Colors', count: 12 },
        { name: 'Spacing', count: 5 },
        { name: 'Shadows', count: 3 },
    ];

    it('renders all tab names with counts', () => {
        render(<CategoryTabs categories={categories} activeTab="Colors" onTabChange={() => {}} />);

        expect(screen.getByRole('tab', { name: /Colors/ })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Spacing/ })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Shadows/ })).toBeInTheDocument();

        // Verify counts appear in badges
        expect(screen.getByText('12')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('marks the active tab as selected', () => {
        render(<CategoryTabs categories={categories} activeTab="Spacing" onTabChange={() => {}} />);

        expect(screen.getByRole('tab', { name: /Spacing/ })).toHaveAttribute(
            'aria-selected',
            'true',
        );
        expect(screen.getByRole('tab', { name: /Colors/ })).toHaveAttribute(
            'aria-selected',
            'false',
        );
    });

    it('calls onTabChange when a tab is clicked', () => {
        const onTabChange = vi.fn();
        render(
            <CategoryTabs categories={categories} activeTab="Colors" onTabChange={onTabChange} />,
        );

        fireEvent.click(screen.getByRole('tab', { name: /Shadows/ }));
        expect(onTabChange).toHaveBeenCalledWith('Shadows');
    });
});

// ---------------------------------------------------------------------------
// TokenSearch
// ---------------------------------------------------------------------------

describe('TokenSearch', () => {
    it('renders with placeholder', () => {
        render(<TokenSearch value="" onChange={() => {}} />);
        expect(screen.getByPlaceholderText('Search tokens...')).toBeInTheDocument();
    });

    it('calls onChange when typing', () => {
        const onChange = vi.fn();
        render(<TokenSearch value="" onChange={onChange} />);

        // The rewritten TokenSearch uses aria-label="Search tokens" (no ellipsis)
        fireEvent.change(screen.getByLabelText('Search tokens'), {
            target: { value: '--color' },
        });
        // onChange is called directly — no debounce in the new implementation
        expect(onChange).toHaveBeenCalledWith('--color');
    });

    it('shows clear button when value is non-empty', () => {
        const onChange = vi.fn();
        render(<TokenSearch value="test" onChange={onChange} />);

        const clearBtn = screen.getByLabelText('Clear search');
        expect(clearBtn).toBeInTheDocument();

        fireEvent.click(clearBtn);
        expect(onChange).toHaveBeenCalledWith('');
    });

    it('hides clear button when value is empty', () => {
        render(<TokenSearch value="" onChange={() => {}} />);
        expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// Editors — correct input types
// ---------------------------------------------------------------------------

describe('ColorEditor', () => {
    let onChange: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        onChange = vi.fn();
    });

    it('renders a color picker and hex text input', () => {
        render(<ColorEditor name="--color-primary" value="#3b82f6" onChange={onChange} />);

        const colorInput = screen.getByLabelText('--color-primary color picker');
        expect(colorInput).toHaveAttribute('type', 'color');

        const textInput = screen.getByLabelText('--color-primary hex value');
        expect(textInput).toBeInTheDocument();
        expect(textInput).toHaveValue('#3b82f6');
    });

    it('renders a color swatch', () => {
        render(<ColorEditor name="--color-primary" value="#3b82f6" onChange={onChange} />);
        expect(screen.getByTestId('--color-primary-swatch')).toBeInTheDocument();
    });
});

describe('SpacingEditor', () => {
    it('renders a range slider and text input', () => {
        const onChange = vi.fn();
        render(<SpacingEditor name="--spacing-md" value="1rem" onChange={onChange} />);

        const range = screen.getByLabelText('--spacing-md range');
        expect(range).toHaveAttribute('type', 'range');

        const text = screen.getByLabelText('--spacing-md value');
        expect(text).toBeInTheDocument();
        expect(text).toHaveValue('1rem');
    });
});

describe('ShadowEditor', () => {
    it('renders a text input and shadow preview', () => {
        const onChange = vi.fn();
        const shadow = '0 1px 3px rgba(0,0,0,0.12)';
        render(<ShadowEditor name="--shadow-sm" value={shadow} onChange={onChange} />);

        const input = screen.getByLabelText('--shadow-sm shadow value');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue(shadow);

        expect(screen.getByTestId('--shadow-sm-preview')).toBeInTheDocument();
    });
});

describe('TextEditor', () => {
    it('renders a text input with the current value', () => {
        const onChange = vi.fn();
        render(<TextEditor name="--font-family" value="Inter, sans-serif" onChange={onChange} />);

        const input = screen.getByLabelText('--font-family value');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('Inter, sans-serif');
    });
});

// ---------------------------------------------------------------------------
// SpacingEditor — range behaviour
// ---------------------------------------------------------------------------

describe('SpacingEditor range behaviour', () => {
    it('uses max=8 for rem values', () => {
        render(<SpacingEditor name="--spacing-lg" value="2rem" onChange={vi.fn()} />);
        const range = screen.getByLabelText('--spacing-lg range');
        expect(range).toHaveAttribute('max', '8');
    });

    it('hides range slider for unparseable values', () => {
        render(<SpacingEditor name="--spacing-custom" value="auto" onChange={vi.fn()} />);
        expect(screen.queryByLabelText('--spacing-custom range')).not.toBeInTheDocument();
        // Text input should still be present
        expect(screen.getByLabelText('--spacing-custom value')).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// TokenEditor — main component
// ---------------------------------------------------------------------------

const MOCK_TOKEN_DATA = {
    tokens: {
        '--color-primary': '#3b82f6',
        '--color-surface': '#ffffff',
        '--spacing-sm': '0.5rem',
        '--shadow-sm': '0 1px 3px rgba(0,0,0,0.12)',
        '--font-family': 'Inter, sans-serif',
    },
    categorized: {
        Colors: {
            Primary: { '--color-primary': '#3b82f6' },
            Surface: { '--color-surface': '#ffffff' },
        },
        Typography: {},
        Spacing: { '--spacing-sm': '0.5rem' },
        Shadows: { '--shadow-sm': '0 1px 3px rgba(0,0,0,0.12)' },
        Radii: {},
        Transitions: {},
        Other: { '--font-family': 'Inter, sans-serif' },
    },
};

function mockFetchSuccess() {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(MOCK_TOKEN_DATA),
    } as Response);
}

function mockFetchFailure(message: string) {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error(message));
}

describe('TokenEditor', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows "Loading tokens..." initially', () => {
        // Never-resolving fetch to freeze in loading state
        vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}));

        render(<TokenEditor channel={{ emit: vi.fn() }} />);
        expect(screen.getByText('Loading tokens...')).toBeInTheDocument();
    });

    it('renders token groups after successful fetch', async () => {
        mockFetchSuccess();

        render(<TokenEditor channel={{ emit: vi.fn() }} />);

        await waitFor(() => {
            expect(screen.queryByText('Loading tokens...')).not.toBeInTheDocument();
        });

        // Category tabs should be visible
        expect(screen.getByRole('tab', { name: /Colors/ })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Spacing/ })).toBeInTheDocument();
    });

    it('shows error message on fetch failure', async () => {
        mockFetchFailure('Failed to fetch');

        render(<TokenEditor channel={{ emit: vi.fn() }} />);

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
        });
    });

    it('shows read-only state when middleware unavailable', async () => {
        // When the fetch fails with a network-like error, the component sets
        // readOnly=true but stays in the loading/error branch (data is null).
        // The user sees the error text without the "Error:" prefix because
        // readOnly suppresses the error display — but data never loaded, so
        // the early-return branch renders the error string.
        mockFetchFailure('Failed to fetch');

        render(<TokenEditor channel={{ emit: vi.fn() }} />);

        await waitFor(() => {
            // The error path renders "Error: <message>" when data is null
            expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
        });

        // No toolbar buttons should be present (Save/Reset) since we never
        // got past the loading state
        expect(screen.queryByText('Save')).not.toBeInTheDocument();
        expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    });

    it('tracks dirty state when a token is edited', async () => {
        mockFetchSuccess();
        const channel = { emit: vi.fn() };

        render(<TokenEditor channel={channel} />);

        await waitFor(() => {
            expect(screen.queryByText('Loading tokens...')).not.toBeInTheDocument();
        });

        // The default active tab is Colors, which renders color inputs.
        // Edit the first color token's hex value input.
        const hexInput = screen.getByLabelText('--color-primary hex value');
        fireEvent.change(hexInput, { target: { value: '#ff0000' } });

        expect(channel.emit).toHaveBeenCalledWith(EVENTS.TOKEN_CHANGED, {
            name: '--color-primary',
            value: '#ff0000',
        });

        // Modified badge should appear
        expect(screen.getByText('1 modified')).toBeInTheDocument();
    });

    it('per-token reset reverts a single token', async () => {
        mockFetchSuccess();
        const channel = { emit: vi.fn() };

        render(<TokenEditor channel={channel} />);

        await waitFor(() => {
            expect(screen.queryByText('Loading tokens...')).not.toBeInTheDocument();
        });

        // Edit --color-primary
        const hexInput = screen.getByLabelText('--color-primary hex value');
        fireEvent.change(hexInput, { target: { value: '#ff0000' } });

        // Should see modified badge and reset button
        expect(screen.getByText('1 modified')).toBeInTheDocument();
        const resetBtn = screen.getByLabelText('Reset --color-primary');
        expect(resetBtn).toBeInTheDocument();

        // Click per-token reset
        fireEvent.click(resetBtn);

        // Channel should emit the original value
        expect(channel.emit).toHaveBeenCalledWith(EVENTS.TOKEN_CHANGED, {
            name: '--color-primary',
            value: '#3b82f6',
        });

        // Modified badge should be gone
        expect(screen.queryByText('1 modified')).not.toBeInTheDocument();
    });
});
