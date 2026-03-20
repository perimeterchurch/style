import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconSelect } from './index';

const options = [
    { value: 'red', label: 'Red', icon: <span data-testid="icon-red">R</span> },
    { value: 'blue', label: 'Blue', icon: <span data-testid="icon-blue">B</span> },
    { value: 'green', label: 'Green' },
];

describe('IconSelect', () => {
    it('renders with default props', () => {
        render(<IconSelect value="red" onChange={() => {}} options={options} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('displays selected option label', () => {
        render(<IconSelect value="red" onChange={() => {}} options={options} />);
        expect(screen.getByText('Red')).toBeInTheDocument();
    });

    it('displays selected option icon', () => {
        render(<IconSelect value="red" onChange={() => {}} options={options} />);
        expect(screen.getByTestId('icon-red')).toBeInTheDocument();
    });

    it('shows placeholder when no value matches', () => {
        render(
            <IconSelect
                value={'none' as string}
                onChange={() => {}}
                options={options}
                placeholder="Choose color"
            />,
        );
        expect(screen.getByText('Choose color')).toBeInTheDocument();
    });

    it('shows options on click', async () => {
        const user = userEvent.setup();
        render(<IconSelect value="red" onChange={() => {}} options={options} />);
        await user.click(screen.getByRole('button'));
        expect(screen.getByRole('option', { name: /Blue/ })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /Green/ })).toBeInTheDocument();
    });

    it('calls onChange when option is selected', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<IconSelect value="red" onChange={handleChange} options={options} />);
        await user.click(screen.getByRole('button'));
        await user.click(screen.getByRole('option', { name: /Blue/ }));
        expect(handleChange).toHaveBeenCalledWith('blue');
    });

    it('applies fullWidth class', () => {
        const { container } = render(
            <IconSelect value="red" onChange={() => {}} options={options} fullWidth />,
        );
        const wrapper = container.firstElementChild?.firstElementChild;
        expect(wrapper?.className).toContain('w-full');
    });

    it('renders options without icons', async () => {
        const user = userEvent.setup();
        render(<IconSelect value="green" onChange={() => {}} options={options} />);
        await user.click(screen.getByRole('button'));
        expect(screen.getByRole('option', { name: /Green/ })).toBeInTheDocument();
    });
});
