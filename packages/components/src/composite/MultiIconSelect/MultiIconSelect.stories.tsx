import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MultiIconSelect } from './index';
import type { IconSelectOption } from '../IconSelect';

const meta: Meta = {
    title: 'Components/Composite/MultiIconSelect',
};

export default meta;
type Story = StoryObj;

const dayOptions: IconSelectOption[] = [
    { value: 'mon', label: 'Monday' },
    { value: 'tue', label: 'Tuesday' },
    { value: 'wed', label: 'Wednesday' },
    { value: 'thu', label: 'Thursday' },
    { value: 'fri', label: 'Friday' },
    { value: 'sat', label: 'Saturday' },
    { value: 'sun', label: 'Sunday' },
];

function MultiIconSelectDemo() {
    const [value, setValue] = useState<string[]>([]);
    return (
        <div style={{ maxWidth: 300 }}>
            <MultiIconSelect
                options={dayOptions}
                value={value}
                onChange={setValue}
                placeholder="Select days..."
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                Selected: {value.length > 0 ? value.join(', ') : '(none)'}
            </p>
        </div>
    );
}

export const Default: Story = {
    render: () => <MultiIconSelectDemo />,
};

function WithPresetsDemo() {
    const [value, setValue] = useState<string[]>([]);
    return (
        <div style={{ maxWidth: 300 }}>
            <MultiIconSelect
                options={dayOptions}
                value={value}
                onChange={setValue}
                placeholder="Select days..."
                presets={[
                    { label: 'Weekdays', values: ['mon', 'tue', 'wed', 'thu', 'fri'] },
                    { label: 'Weekend', values: ['sat', 'sun'] },
                    { label: 'All', values: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
                ]}
            />
        </div>
    );
}

export const WithPresets: Story = {
    render: () => <WithPresetsDemo />,
};
