import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ComboSelect, type ComboSelectOption } from './index';

const meta: Meta = {
    title: 'Components/Composite/ComboSelect',
};

export default meta;
type Story = StoryObj;

const fruitOptions: ComboSelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'grape', label: 'Grape' },
    { value: 'mango', label: 'Mango' },
    { value: 'orange', label: 'Orange' },
    { value: 'peach', label: 'Peach' },
    { value: 'strawberry', label: 'Strawberry' },
];

function SingleSelectDemo() {
    const [value, setValue] = useState<string>('');
    return (
        <div style={{ maxWidth: 300 }}>
            <ComboSelect
                options={fruitOptions}
                value={value}
                onChange={setValue}
                placeholder="Select a fruit..."
                showAllOption
            />
            <p
                style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.5rem',
                }}
            >
                Selected: {value || '(none)'}
            </p>
        </div>
    );
}

export const Default: Story = {
    render: () => <SingleSelectDemo />,
};

function MultiSelectDemo() {
    const [value, setValue] = useState<string[]>([]);
    return (
        <div style={{ maxWidth: 300 }}>
            <ComboSelect<string>
                options={fruitOptions}
                value={value}
                onChange={(v) => setValue(v)}
                multiple
                placeholder="Select fruits..."
            />
            <p
                style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.5rem',
                }}
            >
                Selected: {value.length > 0 ? value.join(', ') : '(none)'}
            </p>
        </div>
    );
}

export const MultiSelect: Story = {
    render: () => <MultiSelectDemo />,
};

export const Loading: Story = {
    render: () => (
        <div style={{ maxWidth: 300 }}>
            <ComboSelect
                options={[]}
                value=""
                onChange={() => {}}
                placeholder="Loading..."
                loading
            />
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div style={{ maxWidth: 300 }}>
            <ComboSelect options={fruitOptions} value="apple" onChange={() => {}} disabled />
        </div>
    ),
};
