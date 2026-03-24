import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './index';
import { inputSizeClass } from './Input.variants';

describe('Input', () => {
    it('renders with default props', () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(inputSizeClass)) {
            const { unmount } = render(
                <Input size={size as keyof typeof inputSizeClass} placeholder={size} />,
            );
            expect(screen.getByPlaceholderText(size)).toBeInTheDocument();
            unmount();
        }
    });

    it('shows error state via aria-invalid', () => {
        render(<Input error="Required" data-testid="input" />);
        expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('applies fullWidth class', () => {
        render(<Input fullWidth data-testid="input" />);
        expect(screen.getByTestId('input').className).toContain('w-full');
    });

    it('disables the input', () => {
        render(<Input disabled data-testid="input" />);
        expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('blurs on Escape key', async () => {
        const user = userEvent.setup();
        render(<Input data-testid="input" />);
        const input = screen.getByTestId('input');
        await user.click(input);
        await user.keyboard('{Escape}');
        expect(input).not.toHaveFocus();
    });

    it('fires custom onKeyDown', async () => {
        const user = userEvent.setup();
        const handleKeyDown = vi.fn();
        render(<Input onKeyDown={handleKeyDown} data-testid="input" />);
        await user.click(screen.getByTestId('input'));
        await user.keyboard('a');
        expect(handleKeyDown).toHaveBeenCalled();
    });
});

describe('Input Compound API', () => {
    it('renders Root, Field, and Error', () => {
        render(
            <Input.Root error="Required field">
                <Input.Field placeholder="Email" />
                <Input.Error />
            </Input.Root>,
        );
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Required field');
    });

    it('Field inherits context error state', () => {
        render(
            <Input.Root error="Bad input">
                <Input.Field data-testid="field" />
            </Input.Root>,
        );
        expect(screen.getByTestId('field')).toHaveAttribute('aria-invalid', 'true');
    });

    it('Error shows custom children over context', () => {
        render(
            <Input.Root error="Context error">
                <Input.Error>Custom message</Input.Error>
            </Input.Root>,
        );
        expect(screen.getByRole('alert')).toHaveTextContent('Custom message');
    });

    it('Error is hidden when no error', () => {
        render(
            <Input.Root>
                <Input.Field />
                <Input.Error />
            </Input.Root>,
        );
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});
