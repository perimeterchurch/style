import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './index';
import { buttonVariants, buttonSizes } from './Button.variants';

describe('Button', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: 'Click me' });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('type', 'button');
    });

    it('renders all variants without crashing', () => {
        for (const variant of Object.keys(buttonVariants)) {
            const { unmount } = render(
                <Button variant={variant as keyof typeof buttonVariants}>{variant}</Button>,
            );
            expect(screen.getByRole('button')).toBeInTheDocument();
            unmount();
        }
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(buttonSizes)) {
            const { unmount } = render(
                <Button size={size as keyof typeof buttonSizes}>{size}</Button>,
            );
            expect(screen.getByRole('button')).toBeInTheDocument();
            unmount();
        }
    });

    it('applies outline variant classes', () => {
        render(<Button outline>Outlined</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('border');
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
        expect(screen.getByRole('button').className).toContain('w-full');
    });

    it('applies aria-label', () => {
        render(<Button aria-label="Close dialog">X</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
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
});
