import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterChip } from './index';
import { chipVariants, chipSizes } from './FilterChip.variants';

describe('FilterChip', () => {
    it('renders with default props', () => {
        render(<FilterChip label="Active" />);
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders all variants without crashing', () => {
        for (const variant of Object.keys(chipVariants)) {
            const { unmount } = render(
                <FilterChip label={variant} variant={variant as keyof typeof chipVariants} />,
            );
            expect(screen.getByText(variant)).toBeInTheDocument();
            unmount();
        }
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(chipSizes)) {
            const { unmount } = render(
                <FilterChip label={size} size={size as keyof typeof chipSizes} />,
            );
            expect(screen.getByText(size)).toBeInTheDocument();
            unmount();
        }
    });

    it('renders remove button when onRemove is provided', () => {
        render(<FilterChip label="Filter" onRemove={() => {}} />);
        expect(screen.getByRole('button', { name: 'Remove Filter' })).toBeInTheDocument();
    });

    it('does not render remove button without onRemove', () => {
        render(<FilterChip label="Filter" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls onRemove when remove button is clicked', async () => {
        const user = userEvent.setup();
        const handleRemove = vi.fn();
        render(<FilterChip label="Filter" onRemove={handleRemove} />);
        await user.click(screen.getByRole('button', { name: 'Remove Filter' }));
        expect(handleRemove).toHaveBeenCalledOnce();
    });

    it('has accessible remove button label', () => {
        render(<FilterChip label="Status: Active" onRemove={() => {}} />);
        expect(screen.getByRole('button', { name: 'Remove Status: Active' })).toBeInTheDocument();
    });
});
