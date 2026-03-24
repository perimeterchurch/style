import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './index';
import { selectSizeClass } from './Select.variants';

const sampleOptions = [
    { value: '', label: 'Select an option...' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
];

const meta: Meta<typeof Select> = {
    title: 'Components/Primitives/Select',
    component: Select,
    argTypes: {
        size: {
            control: 'select',
            options: Object.keys(selectSizeClass),
        },
        fullWidth: { control: 'boolean' },
        disabled: { control: 'boolean' },
        error: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
    args: {
        options: sampleOptions,
        size: 'md',
    },
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 300 }}>
            {Object.keys(selectSizeClass).map((size) => (
                <Select
                    key={size}
                    size={size as keyof typeof selectSizeClass}
                    options={[{ value: '', label: `Size: ${size}` }, ...sampleOptions.slice(1)]}
                />
            ))}
        </div>
    ),
};

export const WithError: Story = {
    args: {
        options: sampleOptions,
        error: true,
    },
};

export const Disabled: Story = {
    args: {
        options: sampleOptions,
        disabled: true,
    },
};
