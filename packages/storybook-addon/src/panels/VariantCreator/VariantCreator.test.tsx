import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { buildTailwindClass, PropertyPicker } from './PropertyPicker.tsx';
import { VariantList } from './VariantList.tsx';
import { CssEditor } from './CssEditor.tsx';
import type { VariantDefinition, SizeDefinition } from '../../server/readVariants.ts';

// ---------------------------------------------------------------------------
// buildTailwindClass — pure function TDD
// ---------------------------------------------------------------------------

describe('buildTailwindClass', () => {
    it('generates base + background correctly', () => {
        expect(buildTailwindClass('base', 'background', '--color-primary')).toBe(
            'bg-[var(--color-primary)]',
        );
    });

    it('generates hover + background correctly', () => {
        expect(buildTailwindClass('hover', 'background', '--color-primary')).toBe(
            'hover:bg-[var(--color-primary)]',
        );
    });

    it('generates focus + ring correctly', () => {
        expect(buildTailwindClass('focus', 'ring', '--color-primary')).toBe(
            'focus-visible:ring-[var(--color-primary)]',
        );
    });

    it('generates active + background correctly', () => {
        expect(buildTailwindClass('active', 'background', '--color-primary')).toBe(
            'active:bg-[var(--color-primary)]',
        );
    });

    it('generates base + text correctly', () => {
        expect(buildTailwindClass('base', 'text', '--color-on-primary')).toBe(
            'text-[var(--color-on-primary)]',
        );
    });

    it('generates base + border correctly', () => {
        expect(buildTailwindClass('base', 'border', '--color-outline')).toBe(
            'border-[var(--color-outline)]',
        );
    });

    it('generates hover + text correctly', () => {
        expect(buildTailwindClass('hover', 'text', '--color-on-primary')).toBe(
            'hover:text-[var(--color-on-primary)]',
        );
    });

    it('generates disabled + background correctly', () => {
        expect(buildTailwindClass('disabled', 'background', '--color-disabled')).toBe(
            'disabled:bg-[var(--color-disabled)]',
        );
    });

    it('handles outline stateKey with border propertyType', () => {
        expect(buildTailwindClass('outline', 'border', '--color-outline')).toBe(
            'border-[var(--color-outline)]',
        );
    });
});

// ---------------------------------------------------------------------------
// PropertyPicker — renders token dropdown
// ---------------------------------------------------------------------------

describe('PropertyPicker', () => {
    const tokens = [
        { name: '--color-primary', value: '#3b82f6' },
        { name: '--color-secondary', value: '#64748b' },
    ];

    it('renders a select element with token options', () => {
        render(
            <PropertyPicker
                stateKey="base"
                propertyType="background"
                value=""
                tokens={tokens}
                onChange={() => {}}
            />,
        );

        const select = screen.getByRole('combobox', { name: /base background/i });
        expect(select).toBeInTheDocument();

        // Options include placeholder + tokens + custom
        const options = select.querySelectorAll('option');
        expect(options.length).toBe(4); // placeholder + 2 tokens + custom
    });

    it('calls onChange with correct Tailwind class when token is selected', () => {
        const onChange = vi.fn();
        render(
            <PropertyPicker
                stateKey="hover"
                propertyType="background"
                value=""
                tokens={tokens}
                onChange={onChange}
            />,
        );

        const select = screen.getByRole('combobox', { name: /hover background/i });
        fireEvent.change(select, { target: { value: '--color-primary' } });

        expect(onChange).toHaveBeenCalledWith('hover:bg-[var(--color-primary)]');
    });
});

// ---------------------------------------------------------------------------
// VariantList — renders variant and size names
// ---------------------------------------------------------------------------

describe('VariantList', () => {
    const variants: Record<string, VariantDefinition> = {
        primary: {
            base: 'bg-blue-600 text-white',
            hover: 'hover:bg-blue-700',
        },
        secondary: {
            base: 'bg-gray-200 text-gray-800',
            _meta: { clonedFrom: 'primary', createdAt: '2025-01-01' },
        },
    };

    const sizes: Record<string, SizeDefinition> = {
        sm: { padding: '4px 8px', fontSize: '12px' },
        md: { padding: '8px 16px', fontSize: '14px' },
    };

    it('renders variant names', () => {
        render(
            <VariantList
                variants={variants}
                sizes={sizes}
                onEdit={() => {}}
                onClone={() => {}}
                onDelete={() => {}}
            />,
        );

        expect(screen.getByText('primary')).toBeInTheDocument();
        expect(screen.getByText('secondary')).toBeInTheDocument();
    });

    it('renders size names under Sizes heading', () => {
        render(
            <VariantList
                variants={variants}
                sizes={sizes}
                onEdit={() => {}}
                onClone={() => {}}
                onDelete={() => {}}
            />,
        );

        expect(screen.getByText('Sizes')).toBeInTheDocument();
        expect(screen.getByText('sm')).toBeInTheDocument();
        expect(screen.getByText('md')).toBeInTheDocument();
    });

    it('shows Delete button only for variants with _meta', () => {
        render(
            <VariantList
                variants={variants}
                sizes={sizes}
                onEdit={() => {}}
                onClone={() => {}}
                onDelete={() => {}}
            />,
        );

        const deleteButtons = screen.getAllByText('Delete');
        // Only "secondary" has _meta, so only 1 delete button
        expect(deleteButtons.length).toBe(1);
    });

    it('hides edit/clone/delete in read-only mode', () => {
        render(
            <VariantList
                variants={variants}
                sizes={sizes}
                onEdit={() => {}}
                onClone={() => {}}
                onDelete={() => {}}
                readOnly
            />,
        );

        expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        expect(screen.queryByText('Clone')).not.toBeInTheDocument();
        expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// CssEditor — renders textarea
// ---------------------------------------------------------------------------

describe('CssEditor', () => {
    it('renders a textarea with the given value', () => {
        render(<CssEditor value="rounded-lg shadow-md" onChange={() => {}} label="base classes" />);

        const textarea = screen.getByLabelText('base classes');
        expect(textarea).toBeInTheDocument();
        expect(textarea).toHaveValue('rounded-lg shadow-md');
        expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('calls onChange when text is entered', () => {
        const onChange = vi.fn();
        render(<CssEditor value="" onChange={onChange} label="test" />);

        fireEvent.change(screen.getByLabelText('test'), {
            target: { value: 'px-4 py-2' },
        });
        expect(onChange).toHaveBeenCalledWith('px-4 py-2');
    });

    it('renders without label when label prop is omitted', () => {
        render(<CssEditor value="test-value" onChange={() => {}} />);
        const textarea = screen.getByLabelText('CSS classes');
        expect(textarea).toHaveValue('test-value');
    });
});
