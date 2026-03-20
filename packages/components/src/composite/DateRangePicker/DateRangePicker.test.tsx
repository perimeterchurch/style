import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangePicker } from './index';

describe('DateRangePicker', () => {
    it('renders two date inputs', () => {
        render(
            <DateRangePicker
                from="2024-01-01"
                to="2024-01-31"
                onFromChange={() => {}}
                onToChange={() => {}}
            />,
        );
        expect(screen.getByLabelText('From date')).toBeInTheDocument();
        expect(screen.getByLabelText('To date')).toBeInTheDocument();
    });

    it('renders "to" separator text', () => {
        render(
            <DateRangePicker
                from="2024-01-01"
                to="2024-01-31"
                onFromChange={() => {}}
                onToChange={() => {}}
            />,
        );
        expect(screen.getByText('to')).toBeInTheDocument();
    });

    it('sets from input value', () => {
        render(
            <DateRangePicker
                from="2024-06-15"
                to="2024-06-30"
                onFromChange={() => {}}
                onToChange={() => {}}
            />,
        );
        expect(screen.getByLabelText('From date')).toHaveValue('2024-06-15');
    });

    it('sets to input value', () => {
        render(
            <DateRangePicker
                from="2024-06-15"
                to="2024-06-30"
                onFromChange={() => {}}
                onToChange={() => {}}
            />,
        );
        expect(screen.getByLabelText('To date')).toHaveValue('2024-06-30');
    });

    it('calls onFromChange when from date changes', async () => {
        const user = userEvent.setup();
        const handleFromChange = vi.fn();
        render(
            <DateRangePicker
                from="2024-01-01"
                to="2024-01-31"
                onFromChange={handleFromChange}
                onToChange={() => {}}
            />,
        );
        const fromInput = screen.getByLabelText('From date');
        await user.clear(fromInput);
        await user.type(fromInput, '2024-02-01');
        expect(handleFromChange).toHaveBeenCalled();
    });

    it('calls onToChange when to date changes', async () => {
        const user = userEvent.setup();
        const handleToChange = vi.fn();
        render(
            <DateRangePicker
                from="2024-01-01"
                to="2024-01-31"
                onFromChange={() => {}}
                onToChange={handleToChange}
            />,
        );
        const toInput = screen.getByLabelText('To date');
        await user.clear(toInput);
        await user.type(toInput, '2024-02-28');
        expect(handleToChange).toHaveBeenCalled();
    });

    it('sets max attribute on from input', () => {
        render(
            <DateRangePicker
                from="2024-01-01"
                to="2024-01-31"
                onFromChange={() => {}}
                onToChange={() => {}}
            />,
        );
        expect(screen.getByLabelText('From date')).toHaveAttribute('max', '2024-01-31');
    });

    it('sets min attribute on to input', () => {
        render(
            <DateRangePicker
                from="2024-01-01"
                to="2024-01-31"
                onFromChange={() => {}}
                onToChange={() => {}}
            />,
        );
        expect(screen.getByLabelText('To date')).toHaveAttribute('min', '2024-01-01');
    });

    it('renders calendar icons', () => {
        const { container } = render(
            <DateRangePicker
                from="2024-01-01"
                to="2024-01-31"
                onFromChange={() => {}}
                onToChange={() => {}}
            />,
        );
        const svgs = container.querySelectorAll('svg');
        expect(svgs).toHaveLength(2);
    });
});
