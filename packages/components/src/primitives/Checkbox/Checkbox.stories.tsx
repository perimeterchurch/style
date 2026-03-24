import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './index';
import { checkboxSizeClass } from './Checkbox.variants';

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Primitives/Checkbox',
    component: Checkbox,
    argTypes: {
        size: {
            control: 'select',
            options: Object.keys(checkboxSizeClass),
        },
        label: { control: 'text' },
        disabled: { control: 'boolean' },
        error: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {
        label: 'Accept terms and conditions',
        size: 'md',
    },
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.keys(checkboxSizeClass).map((size) => (
                <Checkbox
                    key={size}
                    size={size as keyof typeof checkboxSizeClass}
                    label={`Size: ${size}`}
                />
            ))}
        </div>
    ),
};

export const WithError: Story = {
    args: {
        label: 'This field is required',
        error: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled checkbox',
        disabled: true,
    },
};

export const WithoutLabel: Story = {
    args: {
        size: 'md',
    },
};
