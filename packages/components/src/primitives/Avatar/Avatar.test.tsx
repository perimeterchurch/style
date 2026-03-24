import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from './index';
import { avatarSizeClass } from './Avatar.variants';

describe('Avatar', () => {
    it('renders with default props', () => {
        render(<Avatar data-testid="avatar" />);
        expect(screen.getByTestId('avatar')).toBeInTheDocument();
        expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(avatarSizeClass)) {
            const { unmount } = render(
                <Avatar size={size as keyof typeof avatarSizeClass} data-testid="avatar" />,
            );
            expect(screen.getByTestId('avatar')).toBeInTheDocument();
            unmount();
        }
    });

    it('renders image when src is provided', () => {
        render(<Avatar src="/avatar.jpg" alt="John Doe" data-testid="avatar" />);
        const img = screen.getByAltText('John Doe');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/avatar.jpg');
    });

    it('shows fallback on image error', () => {
        render(<Avatar src="/broken.jpg" fallback="JD" data-testid="avatar" />);
        const img = screen.getByAltText('');
        fireEvent.error(img);
        expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders string fallback in uppercase', () => {
        render(<Avatar fallback="ab" data-testid="avatar" />);
        const span = screen.getByText('ab');
        expect(span.className).toContain('uppercase');
    });

    it('renders ReactNode fallback', () => {
        render(<Avatar fallback={<span data-testid="custom">icon</span>} />);
        expect(screen.getByTestId('custom')).toBeInTheDocument();
    });

    it('merges custom className', () => {
        render(<Avatar className="ring-2" data-testid="avatar" />);
        expect(screen.getByTestId('avatar').className).toContain('ring-2');
    });
});
