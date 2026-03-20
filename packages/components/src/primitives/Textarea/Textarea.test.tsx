import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './index';
import { textareaTextSizes } from './Textarea.variants';

describe('Textarea', () => {
    it('renders with default props', () => {
        render(<Textarea placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(textareaTextSizes)) {
            const { unmount } = render(
                <Textarea size={size as keyof typeof textareaTextSizes} placeholder={size} />,
            );
            expect(screen.getByPlaceholderText(size)).toBeInTheDocument();
            unmount();
        }
    });

    it('shows error state via aria-invalid', () => {
        render(<Textarea error data-testid="textarea" />);
        expect(screen.getByTestId('textarea')).toHaveAttribute('aria-invalid', 'true');
    });

    it('applies fullWidth class', () => {
        render(<Textarea fullWidth data-testid="textarea" />);
        expect(screen.getByTestId('textarea').className).toContain('w-full');
    });

    it('disables the textarea', () => {
        render(<Textarea disabled data-testid="textarea" />);
        expect(screen.getByTestId('textarea')).toBeDisabled();
    });

    it('blurs on Escape key', async () => {
        const user = userEvent.setup();
        render(<Textarea data-testid="textarea" />);
        const el = screen.getByTestId('textarea');
        await user.click(el);
        await user.keyboard('{Escape}');
        expect(el).not.toHaveFocus();
    });

    it('is resizable', () => {
        render(<Textarea data-testid="textarea" />);
        expect(screen.getByTestId('textarea').className).toContain('resize-y');
    });
});
