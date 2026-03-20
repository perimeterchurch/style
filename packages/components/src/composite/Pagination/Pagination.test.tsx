import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './index';

describe('Pagination', () => {
    it('renders nothing when totalPages <= 1', () => {
        const { container } = render(
            <Pagination page={1} totalPages={1} onChange={() => {}} />,
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders pagination nav', () => {
        render(
            <Pagination page={1} totalPages={5} onChange={() => {}} />,
        );
        expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    });

    it('renders page buttons', () => {
        render(
            <Pagination page={1} totalPages={5} onChange={() => {}} />,
        );
        for (let i = 1; i <= 5; i++) {
            expect(screen.getByRole('button', { name: `Page ${i}` })).toBeInTheDocument();
        }
    });

    it('marks current page with aria-current', () => {
        render(
            <Pagination page={3} totalPages={5} onChange={() => {}} />,
        );
        const current = screen.getByRole('button', { name: 'Page 3' });
        expect(current).toHaveAttribute('aria-current', 'page');
    });

    it('disables previous button on first page', () => {
        render(
            <Pagination page={1} totalPages={5} onChange={() => {}} />,
        );
        expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    });

    it('disables next button on last page', () => {
        render(
            <Pagination page={5} totalPages={5} onChange={() => {}} />,
        );
        expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    });

    it('calls onChange when page button is clicked', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(
            <Pagination page={1} totalPages={5} onChange={handleChange} />,
        );
        await user.click(screen.getByRole('button', { name: 'Page 3' }));
        expect(handleChange).toHaveBeenCalledWith(3);
    });

    it('calls onChange with page-1 on previous', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(
            <Pagination page={3} totalPages={5} onChange={handleChange} />,
        );
        await user.click(screen.getByRole('button', { name: 'Previous page' }));
        expect(handleChange).toHaveBeenCalledWith(2);
    });

    it('calls onChange with page+1 on next', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(
            <Pagination page={3} totalPages={5} onChange={handleChange} />,
        );
        await user.click(screen.getByRole('button', { name: 'Next page' }));
        expect(handleChange).toHaveBeenCalledWith(4);
    });

    it('shows ellipsis for many pages', () => {
        render(
            <Pagination page={5} totalPages={20} onChange={() => {}} />,
        );
        const ellipses = screen.getAllByText('...');
        expect(ellipses.length).toBeGreaterThanOrEqual(1);
    });
});
