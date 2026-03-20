import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from './index';

const meta: Meta<typeof DateRangePicker> = {
    title: 'Components/Composite/DateRangePicker',
    component: DateRangePicker,
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

function DateRangePickerDemo() {
    const [from, setFrom] = useState('2026-01-01');
    const [to, setTo] = useState('2026-03-20');
    return <DateRangePicker from={from} to={to} onFromChange={setFrom} onToChange={setTo} />;
}

export const Default: Story = {
    render: () => <DateRangePickerDemo />,
};

function EmptyDemo() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    return <DateRangePicker from={from} to={to} onFromChange={setFrom} onToChange={setTo} />;
}

export const Empty: Story = {
    render: () => <EmptyDemo />,
};
