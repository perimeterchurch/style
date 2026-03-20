import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './index';
import { spinnerSizeClasses } from './LoadingSpinner.variants';

describe('LoadingSpinner', () => {
    it('renders with default props', () => {
        render(<LoadingSpinner />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(spinnerSizeClasses)) {
            const { unmount } = render(
                <LoadingSpinner size={size as keyof typeof spinnerSizeClasses} />,
            );
            expect(screen.getByRole('status')).toBeInTheDocument();
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
