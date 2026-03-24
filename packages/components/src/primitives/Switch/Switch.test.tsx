import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './index';
import { switchSizeClass } from './Switch.variants';

describe('Switch', () => {
    it('renders with default props', () => {
        render(<Switch data-testid="switch" />);
        expect(screen.getByTestId('switch')).toBeInTheDocument();
        expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders all sizes without crashing', () => {
        for (const size of Object.keys(switchSizeClass)) {
            const { unmount } = render(
                <Switch size={size as keyof typeof switchSizeClass} data-testid="sw" />,
            );
            expect(screen.getByTestId('sw')).toBeInTheDocument();
            unmount();
        }
    });

    it('renders with label', () => {
        render(<Switch label="Enable notifications" />);
        expect(screen.getByText('Enable notifications')).toBeInTheDocument();
        expect(screen.getByLabelText('Enable notifications')).toBeInTheDocument();
    });

    it('has role="switch"', () => {
        render(<Switch />);
        expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('disables the switch', () => {
        render(<Switch disabled data-testid="switch" />);
        expect(screen.getByTestId('switch')).toBeDisabled();
    });

    it('toggles on click', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<Switch onChange={handleChange} data-testid="switch" />);
        await user.click(screen.getByTestId('switch'));
        expect(handleChange).toHaveBeenCalled();
    });

    it('associates label with input via htmlFor', () => {
        render(<Switch label="Dark Mode" />);
        const label = screen.getByText('Dark Mode');
        const input = screen.getByLabelText('Dark Mode');
        expect(label).toHaveAttribute('for', input.id);
    });
});
