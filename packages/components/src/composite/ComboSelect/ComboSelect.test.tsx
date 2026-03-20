import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboSelect } from './index';

const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
];

describe('ComboSelect', () => {
    it('renders with default props', () => {
        render(<ComboSelect options={options} value="" onChange={() => {}} />);
        const input = screen.getByRole('combobox');
        expect(input).toBeInTheDocument();
    });

    it('renders placeholder text', () => {
        render(
            <ComboSelect
                options={options}
                value=""
                onChange={() => {}}
                placeholder="Pick a fruit"
            />,
        );
        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('placeholder', 'Pick a fruit');
    });

    it('shows selected label as placeholder in single mode', () => {
        render(
            <ComboSelect
                options={options}
                value="banana"
                onChange={() => {}}
                placeholder="Pick a fruit"
            />,
        );
        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('placeholder', 'Banana');
    });

    it('filters options by query', async () => {
        const user = userEvent.setup();
        render(<ComboSelect options={options} value="" onChange={() => {}} />);
        const input = screen.getByRole('combobox');
        await user.click(input);
        await user.type(input, 'ban');
        const optionElements = screen.getAllByRole('option');
        expect(optionElements).toHaveLength(1);
        expect(optionElements[0]).toHaveTextContent('Banana');
    });

    it('shows empty text when no results', async () => {
        const user = userEvent.setup();
        render(
            <ComboSelect options={options} value="" onChange={() => {}} emptyText="Nothing here" />,
        );
        const input = screen.getByRole('combobox');
        await user.click(input);
        await user.type(input, 'zzz');
        expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    it('calls onChange when option is selected', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<ComboSelect options={options} value="" onChange={handleChange} />);
        const input = screen.getByRole('combobox');
        await user.click(input);
        const option = screen.getByRole('option', { name: 'Apple' });
        await user.click(option);
        expect(handleChange).toHaveBeenCalledWith('apple');
    });

    it('is disabled when disabled prop is true', () => {
        render(<ComboSelect options={options} value="" onChange={() => {}} disabled />);
        const input = screen.getByRole('combobox');
        expect(input).toBeDisabled();
    });

    it('shows loading state', () => {
        render(<ComboSelect options={options} value="" onChange={() => {}} loading />);
        const input = screen.getByRole('combobox');
        expect(input).toBeDisabled();
    });

    it('shows "All" option when showAllOption is true', async () => {
        const user = userEvent.setup();
        render(
            <ComboSelect
                options={options}
                value=""
                onChange={() => {}}
                showAllOption
                allOptionLabel="All Fruits"
            />,
        );
        const input = screen.getByRole('combobox');
        await user.click(input);
        expect(screen.getByRole('option', { name: 'All Fruits' })).toBeInTheDocument();
    });

    it('shows count in placeholder for multi-select', () => {
        render(
            <ComboSelect
                options={options}
                value={['apple', 'banana']}
                onChange={() => {}}
                multiple
                placeholder="Fruits"
            />,
        );
        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('placeholder', 'Fruits (2)');
    });
});

describe('ComboSelect Compound API', () => {
    it('renders compound parts', async () => {
        const user = userEvent.setup();
        render(
            <ComboSelect.Root value="" onChange={() => {}}>
                <ComboSelect.Input placeholder="Search..." />
                <ComboSelect.Options>
                    <ComboSelect.Option value="a">Option A</ComboSelect.Option>
                </ComboSelect.Options>
            </ComboSelect.Root>,
        );
        const input = screen.getByRole('combobox');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'Search...');
        await user.click(input);
        expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument();
    });
});
