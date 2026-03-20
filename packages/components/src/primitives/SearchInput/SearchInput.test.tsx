import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './index';

describe('SearchInput', () => {
    it('renders with default props', () => {
        render(<SearchInput value="" onChange={() => {}} />);
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
        render(<SearchInput value="" onChange={() => {}} placeholder="Find items..." />);
        expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
    });

    it('has accessible label matching placeholder', () => {
        render(<SearchInput value="" onChange={() => {}} placeholder="Search users" />);
        expect(screen.getByLabelText('Search users')).toBeInTheDocument();
    });

    it('shows clear button when value is present', () => {
        render(<SearchInput value="test" onChange={() => {}} />);
        expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
    });

    it('hides clear button when value is empty', () => {
        render(<SearchInput value="" onChange={() => {}} />);
        expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    });

    it('calls onChange immediately on clear', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<SearchInput value="test" onChange={handleChange} />);
        await user.click(screen.getByRole('button', { name: 'Clear search' }));
        expect(handleChange).toHaveBeenCalledWith('');
    });

    it('debounces onChange on typing', async () => {
        const handleChange = vi.fn();
        render(<SearchInput value="" onChange={handleChange} debounce={50} />);

        const input = screen.getByPlaceholderText('Search...');
        // Simulate a direct change to avoid fake timer issues
        await userEvent.type(input, 'hi');

        // Wait for debounce
        await vi.waitFor(
            () => {
                expect(handleChange).toHaveBeenCalled();
            },
            { timeout: 2000 },
        );
    });

    it('renders search icon', () => {
        render(<SearchInput value="" onChange={() => {}} data-testid="search" />);
        const svg = screen.getByTestId('search').querySelector('svg[aria-hidden="true"]');
        expect(svg).toBeInTheDocument();
    });
});
