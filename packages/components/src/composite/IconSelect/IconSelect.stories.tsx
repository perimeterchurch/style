import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconSelect, type IconSelectOption } from './index';

const meta: Meta = {
    title: 'Components/Composite/IconSelect',
};

export default meta;
type Story = StoryObj;

const statusOptions: IconSelectOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'archived', label: 'Archived' },
];

function IconSelectDemo() {
    const [value, setValue] = useState('active');
    return (
        <div style={{ maxWidth: 250 }}>
            <IconSelect
                options={statusOptions}
                value={value}
                onChange={setValue}
                placeholder="Select status..."
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                Selected: {value}
            </p>
        </div>
    );
}

export const Default: Story = {
    render: () => <IconSelectDemo />,
};

export const FullWidth: Story = {
    render: () => {
        function FullWidthDemo() {
            const [value, setValue] = useState('active');
            return (
                <div style={{ maxWidth: 400 }}>
                    <IconSelect
                        options={statusOptions}
                        value={value}
                        onChange={setValue}
                        fullWidth
                    />
                </div>
            );
        }
        return <FullWidthDemo />;
    },
};
