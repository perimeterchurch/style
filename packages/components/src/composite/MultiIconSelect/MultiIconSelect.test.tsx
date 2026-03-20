import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiIconSelect } from './index';

const options = [
    { value: 'a', label: 'Alpha', icon: <span data-testid="icon-a">A</span> },
    { value: 'b', label: 'Beta' },
    { value: 'c', label: 'Gamma' },
];

describe('MultiIconSelect', () => {
    it('renders with default props', () => {
        render(<MultiIconSelect value={[]} onChange={() => {}} options={options} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows placeholder when nothing selected', () => {
        render(
            <MultiIconSelect
                value={[]}
                onChange={() => {}}
                options={options}
                placeholder="Pick items"
            />,
        );
        expect(screen.getByText('Pick items')).toBeInTheDocument();
    });

    it('shows count in label when items selected', () => {
        render(
            <MultiIconSelect
                value={['a', 'b']}
                onChange={() => {}}
                options={options}
                placeholder="Pick items"
            />,
        );
        expect(screen.getByText('Pick items (2)')).toBeInTheDocument();
    });

    it('shows options on click', async () => {
        const user = userEvent.setup();
        render(<MultiIconSelect value={[]} onChange={() => {}} options={options} />);
        await user.click(screen.getByRole('button'));
        expect(screen.getByRole('option', { name: /Alpha/ })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /Beta/ })).toBeInTheDocument();
    });

    it('renders placeholderIcon', () => {
        render(
            <MultiIconSelect
                value={[]}
                onChange={() => {}}
                options={options}
                placeholderIcon={<span data-testid="ph-icon">I</span>}
            />,
        );
        expect(screen.getByTestId('ph-icon')).toBeInTheDocument();
    });

    it('applies fullWidth class', () => {
        const { container } = render(
            <MultiIconSelect value={[]} onChange={() => {}} options={options} fullWidth />,
        );
        const wrapper = container.firstElementChild?.firstElementChild;
        expect(wrapper?.className).toContain('w-full');
    });

    it('renders presets when provided', async () => {
        const user = userEvent.setup();
        render(
            <MultiIconSelect
                value={[]}
                onChange={() => {}}
                options={options}
                presets={[{ label: 'All Active', values: ['a', 'b'] }]}
            />,
        );
        await user.click(screen.getByRole('button'));
        expect(screen.getByText('All Active')).toBeInTheDocument();
    });

    it('calls onChange when preset is clicked', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(
            <MultiIconSelect
                value={[]}
                onChange={handleChange}
                options={options}
                presets={[{ label: 'All Active', values: ['a', 'b'] }]}
            />,
        );
        await user.click(screen.getByRole('button'));
        await user.click(screen.getByText('All Active'));
        expect(handleChange).toHaveBeenCalledWith(['a', 'b']);
    });
});
