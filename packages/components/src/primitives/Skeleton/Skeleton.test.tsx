import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './index';

describe('Skeleton', () => {
    it('renders with default props', () => {
        render(<Skeleton data-testid="skeleton" />);
        const el = screen.getByTestId('skeleton');
        expect(el).toBeInTheDocument();
        expect(el).toHaveAttribute('aria-busy', 'true');
    });

    it('applies base skeleton class', () => {
        render(<Skeleton data-testid="skeleton" />);
        expect(screen.getByTestId('skeleton')).toHaveClass('skeleton');
    });

    it('renders all variants with correct CSS classes', () => {
        for (const variant of ['line', 'circle', 'card'] as const) {
            const { unmount } = render(<Skeleton variant={variant} data-testid="skeleton" />);
            expect(screen.getByTestId('skeleton')).toHaveClass('skeleton', `skeleton-${variant}`);
            unmount();
        }
    });

    it('applies width and height as numbers', () => {
        render(<Skeleton width={100} height={40} data-testid="skeleton" />);
        const el = screen.getByTestId('skeleton');
        expect(el.style.width).toBe('100px');
        expect(el.style.height).toBe('40px');
    });

    it('applies width and height as strings', () => {
        render(<Skeleton width="50%" height="2rem" data-testid="skeleton" />);
        const el = screen.getByTestId('skeleton');
        expect(el.style.width).toBe('50%');
        expect(el.style.height).toBe('2rem');
    });

    it('applies custom rounded override', () => {
        render(<Skeleton rounded="rounded-none" data-testid="skeleton" />);
        expect(screen.getByTestId('skeleton').className).toContain('rounded-none');
    });

    it('has correct accessibility attributes', () => {
        render(<Skeleton data-testid="skeleton" />);
        const el = screen.getByTestId('skeleton');
        expect(el).toHaveAttribute('aria-live', 'polite');
        expect(el).toHaveAttribute('aria-busy', 'true');
    });
});
