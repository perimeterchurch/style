import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './index';
import { badgeVariants, badgeSizes } from './Badge.variants';

describe('Badge', () => {
    it('renders with default props', () => {
        render(<Badge>Status</Badge>);
        expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders all variants without crashing', () => {
        for (const variant of Object.keys(badgeVariants)) {
            const { unmount } = render(
                <Badge variant={variant as keyof typeof badgeVariants}>{variant}</Badge>,
            );
            expect(screen.getByText(variant)).toBeInTheDocument();
            unmount();
        }
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(badgeSizes)) {
            const { unmount } = render(
                <Badge size={size as keyof typeof badgeSizes}>{size}</Badge>,
            );
            expect(screen.getByText(size)).toBeInTheDocument();
            unmount();
        }
    });

    it('renders dot indicator', () => {
        render(<Badge dot data-testid="badge">Active</Badge>);
        const badge = screen.getByTestId('badge');
        const dot = badge.querySelector('[aria-hidden="true"]');
        expect(dot).toBeInTheDocument();
    });

    it('applies outline variant classes', () => {
        render(<Badge outline data-testid="badge">Outlined</Badge>);
        expect(screen.getByTestId('badge').className).toContain('border');
    });

    it('merges custom className', () => {
        render(<Badge className="custom-class" data-testid="badge">Custom</Badge>);
        expect(screen.getByTestId('badge').className).toContain('custom-class');
    });
});
