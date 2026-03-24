import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './index';
import { spinnerSizeClass } from './LoadingSpinner.variants';

describe('LoadingSpinner', () => {
    it('renders with default props', () => {
        render(<LoadingSpinner />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('applies base spinner class', () => {
        render(<LoadingSpinner />);
        expect(screen.getByRole('status')).toHaveClass('spinner');
    });

    it('renders all sizes with correct CSS classes', () => {
        for (const [size, cssClass] of Object.entries(spinnerSizeClass)) {
            const { unmount } = render(
                <LoadingSpinner size={size as keyof typeof spinnerSizeClass} />,
            );
            expect(screen.getByRole('status')).toHaveClass('spinner', cssClass);
            unmount();
        }
    });

    it('has correct aria-label default', () => {
        render(<LoadingSpinner />);
        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
    });

    it('supports custom label', () => {
        render(<LoadingSpinner label="Fetching data" />);
        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Fetching data');
        expect(screen.getByText('Fetching data')).toBeInTheDocument();
    });

    it('supports custom aria-label over label prop', () => {
        render(<LoadingSpinner label="Loading" aria-label="Custom label" />);
        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Custom label');
    });

    it('renders SVG with aria-hidden', () => {
        render(<LoadingSpinner />);
        const svg = screen.getByRole('status').querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('has screen reader text', () => {
        render(<LoadingSpinner />);
        expect(screen.getByText('Loading')).toHaveClass('sr-only');
    });
});
