import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './index';
import { checkboxSizeClass } from './Checkbox.variants';

describe('Checkbox', () => {
    it('renders with default props', () => {
        render(<Checkbox data-testid="checkbox" />);
        expect(screen.getByTestId('checkbox')).toBeInTheDocument();
        expect(screen.getByTestId('checkbox')).toHaveAttribute('type', 'checkbox');
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(checkboxSizeClass)) {
            const { unmount } = render(
                <Checkbox size={size as keyof typeof checkboxSizeClass} data-testid="cb" />,
            );
            expect(screen.getByTestId('cb')).toBeInTheDocument();
            unmount();
        }
    });

    it('renders with label', () => {
        render(<Checkbox label="Accept terms" />);
        expect(screen.getByText('Accept terms')).toBeInTheDocument();
        expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
    });

    it('shows error state', () => {
        render(<Checkbox error data-testid="checkbox" />);
        expect(screen.getByTestId('checkbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('disables the checkbox', () => {
        render(<Checkbox disabled data-testid="checkbox" />);
        expect(screen.getByTestId('checkbox')).toBeDisabled();
    });

    it('toggles checked state', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<Checkbox onChange={handleChange} data-testid="checkbox" />);
        await user.click(screen.getByTestId('checkbox'));
        expect(handleChange).toHaveBeenCalled();
    });

    it('associates label with checkbox via htmlFor', () => {
        render(<Checkbox label="My Checkbox" />);
        const label = screen.getByText('My Checkbox');
        const checkbox = screen.getByLabelText('My Checkbox');
        expect(label).toHaveAttribute('for', checkbox.id);
    });
});
