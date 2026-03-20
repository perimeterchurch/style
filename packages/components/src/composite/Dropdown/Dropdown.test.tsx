import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './index';

describe('Dropdown', () => {
    it('renders trigger', () => {
        render(
            <Dropdown trigger={<button>Open</button>}>
                <Dropdown.Item>Item 1</Dropdown.Item>
            </Dropdown>,
        );
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('shows menu items on click', async () => {
        const user = userEvent.setup();
        render(
            <Dropdown trigger={<button>Open</button>}>
                <Dropdown.Item>Edit</Dropdown.Item>
                <Dropdown.Item>Delete</Dropdown.Item>
            </Dropdown>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('calls onClick when item is clicked', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(
            <Dropdown trigger={<button>Open</button>}>
                <Dropdown.Item onClick={handleClick}>Edit</Dropdown.Item>
            </Dropdown>,
        );
        await user.click(screen.getByText('Open'));
        await user.click(screen.getByText('Edit'));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    it('renders divider with separator role', async () => {
        const user = userEvent.setup();
        render(
            <Dropdown trigger={<button>Open</button>}>
                <Dropdown.Item>Item 1</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>Item 2</Dropdown.Item>
            </Dropdown>,
        );
        await user.click(screen.getByText('Open'));
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('renders disabled item', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(
            <Dropdown trigger={<button>Open</button>}>
                <Dropdown.Item disabled onClick={handleClick}>
                    Disabled
                </Dropdown.Item>
            </Dropdown>,
        );
        await user.click(screen.getByText('Open'));
        // Disabled items are rendered but the MenuItem handles disabling
        expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('supports destructive styling', async () => {
        const user = userEvent.setup();
        render(
            <Dropdown trigger={<button>Open</button>}>
                <Dropdown.Item destructive>Delete</Dropdown.Item>
            </Dropdown>,
        );
        await user.click(screen.getByText('Open'));
        const button = screen.getByText('Delete');
        expect(button.className).toContain('error');
    });
});
