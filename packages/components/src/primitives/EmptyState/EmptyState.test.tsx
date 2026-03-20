import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './index';

describe('EmptyState', () => {
    it('renders with required title', () => {
        render(<EmptyState title="No results" />);
        expect(screen.getByText('No results')).toBeInTheDocument();
    });

    it('renders description', () => {
        render(<EmptyState title="Empty" description="Nothing to show" />);
        expect(screen.getByText('Nothing to show')).toBeInTheDocument();
    });

    it('renders icon with aria-hidden', () => {
        render(<EmptyState title="No data" icon={<span data-testid="icon">icon</span>} />);
        const icon = screen.getByTestId('icon');
        expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders action slot', () => {
        render(<EmptyState title="Empty" action={<button>Create New</button>} />);
        expect(screen.getByRole('button', { name: 'Create New' })).toBeInTheDocument();
    });

    it('renders children', () => {
        render(
            <EmptyState title="Empty">
                <span data-testid="child">Extra content</span>
            </EmptyState>,
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('merges custom className', () => {
        render(<EmptyState title="Empty" className="my-class" data-testid="empty" />);
        expect(screen.getByTestId('empty').className).toContain('my-class');
    });
});
