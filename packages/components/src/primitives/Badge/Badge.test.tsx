import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './index';
import { badgeVariantClass, badgeSizeClass } from './Badge.variants';

describe('Badge', () => {
    it('renders with default props', () => {
        render(<Badge>Status</Badge>);
        expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('applies base badge class', () => {
        render(<Badge data-testid="badge">Status</Badge>);
        expect(screen.getByTestId('badge')).toHaveClass('badge');
    });

    it('renders all variants with correct CSS classes', () => {
        for (const [variant, cssClass] of Object.entries(badgeVariantClass)) {
            const { unmount } = render(
                <Badge variant={variant as keyof typeof badgeVariantClass}>{variant}</Badge>,
            );
            if (cssClass) {
                expect(screen.getByText(variant)).toHaveClass('badge', cssClass);
            } else {
                expect(screen.getByText(variant)).toHaveClass('badge');
            }
            unmount();
        }
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(badgeSizeClass)) {
            const { unmount } = render(
                <Badge size={size as keyof typeof badgeSizeClass}>{size}</Badge>,
            );
            expect(screen.getByText(size)).toBeInTheDocument();
            unmount();
        }
    });

    it('applies dot class', () => {
        render(
            <Badge dot data-testid="badge">
                Active
            </Badge>,
        );
        expect(screen.getByTestId('badge')).toHaveClass('badge-dot');
    });

    it('applies outline class', () => {
        render(
            <Badge outline data-testid="badge">
                Outlined
            </Badge>,
        );
        expect(screen.getByTestId('badge')).toHaveClass('badge-outline');
    });

    it('merges custom className', () => {
        render(
            <Badge className="custom-class" data-testid="badge">
                Custom
            </Badge>,
        );
        expect(screen.getByTestId('badge').className).toContain('custom-class');
    });
});
