import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';

import { CategoryTabs, type TokenCategory } from './CategoryTabs';
import { TokenSearch } from './TokenSearch';
import { ColorEditor } from './editors/ColorEditor';
import { SpacingEditor } from './editors/SpacingEditor';
import { ShadowEditor } from './editors/ShadowEditor';
import { TextEditor } from './editors/TextEditor';

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
        render(
            <CategoryTabs categories={categories} activeTab="Colors" onTabChange={() => {}} />,
        );

        expect(screen.getByRole('tab', { name: /Colors \(12\)/ })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Spacing \(5\)/ })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /Shadows \(3\)/ })).toBeInTheDocument();
    });

    it('marks the active tab as selected', () => {
        render(
            <CategoryTabs categories={categories} activeTab="Spacing" onTabChange={() => {}} />,
        );

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

        fireEvent.change(screen.getByLabelText('Search tokens'), {
            target: { value: '--color' },
        });
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
        expect(textInput).toHaveAttribute('type', 'text');
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
        expect(text).toHaveAttribute('type', 'text');
        expect(text).toHaveValue('1rem');
    });
});

describe('ShadowEditor', () => {
    it('renders a text input and shadow preview', () => {
        const onChange = vi.fn();
        const shadow = '0 1px 3px rgba(0,0,0,0.12)';
        render(<ShadowEditor name="--shadow-sm" value={shadow} onChange={onChange} />);

        const input = screen.getByLabelText('--shadow-sm shadow value');
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveValue(shadow);

        expect(screen.getByTestId('--shadow-sm-preview')).toBeInTheDocument();
    });
});

describe('TextEditor', () => {
    it('renders a text input with the current value', () => {
        const onChange = vi.fn();
        render(<TextEditor name="--font-family" value="Inter, sans-serif" onChange={onChange} />);

        const input = screen.getByLabelText('--font-family value');
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveValue('Inter, sans-serif');
    });
});
