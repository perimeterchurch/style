import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './index';
import { buttonVariantClass, buttonSizeClass } from './Button.variants';

describe('Button', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: 'Click me' });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('type', 'button');
    });

    it('applies base btn class', () => {
        render(<Button>Base</Button>);
        expect(screen.getByRole('button')).toHaveClass('btn');
    });

    it('renders all variants with correct CSS classes', () => {
        for (const [variant, cssClass] of Object.entries(buttonVariantClass)) {
            const { unmount } = render(
                <Button variant={variant as keyof typeof buttonVariantClass}>{variant}</Button>,
            );
            expect(screen.getByRole('button')).toHaveClass('btn', cssClass);
            unmount();
        }
    });

    it('renders all sizes with correct CSS classes', () => {
        for (const [size, cssClass] of Object.entries(buttonSizeClass)) {
            const { unmount } = render(
                <Button size={size as keyof typeof buttonSizeClass}>{size}</Button>,
            );
            expect(screen.getByRole('button')).toHaveClass('btn', cssClass);
            unmount();
        }
    });

    it('applies outline class', () => {
        render(<Button outline>Outlined</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-outline');
    });

    it('disables the button when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables the button when isLoading is true', () => {
        render(<Button isLoading>Loading</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('renders loading spinner when isLoading', () => {
        render(<Button isLoading>Loading</Button>);
        const svg = screen.getByRole('button').querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('fires onClick when clicked', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click</Button>);
        await user.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    it('does not fire onClick when disabled', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(
            <Button disabled onClick={handleClick}>
                Click
            </Button>,
        );
        await user.click(screen.getByRole('button'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies fullWidth class', () => {
        render(<Button fullWidth>Full</Button>);
        expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('applies aria-label', () => {
        render(<Button aria-label="Close dialog">X</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('applies default variant and size classes', () => {
        render(<Button>Default</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn', 'btn-primary', 'btn-md');
    });
});

describe('Button Compound API', () => {
    it('renders with compound parts', () => {
        render(
            <Button.Root>
                <Button.Icon>
                    <span>icon</span>
                </Button.Icon>
                <Button.Label>Label</Button.Label>
            </Button.Root>,
        );
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Label');
    });

    it('compound Icon has aria-hidden', () => {
        render(
            <Button.Root>
                <Button.Icon>
                    <span data-testid="icon">i</span>
                </Button.Icon>
                <Button.Label>Text</Button.Label>
            </Button.Root>,
        );
        const iconWrapper = screen.getByTestId('icon').parentElement;
        expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
    });

    it('compound Root applies CSS classes', () => {
        render(
            <Button.Root variant="success" size="lg" outline>
                <Button.Label>Action</Button.Label>
            </Button.Root>,
        );
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn', 'btn-success', 'btn-lg', 'btn-outline');
    });
});
