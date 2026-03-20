import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import { registerIcon, getIconNames } from './registry';

describe('Icon', () => {
    it('renders a known lucide icon', () => {
        render(<Icon name="search" data-testid="icon" />);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('returns null for unknown icon', () => {
        const { container } = render(<Icon name="nonexistent-icon-xyz" />);
        expect(container.firstChild).toBeNull();
    });

    it('applies size prop', () => {
        render(<Icon name="search" size={24} data-testid="icon" />);
        const icon = screen.getByTestId('icon');
        expect(icon).toHaveAttribute('width', '24');
        expect(icon).toHaveAttribute('height', '24');
    });

    it('supports custom registered icons', () => {
        const CustomSvg = (props: React.SVGProps<SVGSVGElement>) => (
            <svg data-testid="custom" {...props}>
                <circle cx="12" cy="12" r="10" />
            </svg>
        );
        registerIcon('my-custom', CustomSvg);
        render(<Icon name="my-custom" />);
        expect(screen.getByTestId('custom')).toBeInTheDocument();
    });

    it('lists all registered icon names', () => {
        const names = getIconNames();
        expect(names).toContain('search');
        expect(names).toContain('check');
        expect(names.length).toBeGreaterThan(30);
    });
});
