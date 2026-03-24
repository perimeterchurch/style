import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './index';
import { inputSizeClass } from './Input.variants';

const meta: Meta<typeof Input> = {
    title: 'Components/Primitives/Input',
    component: Input,
    argTypes: {
        size: {
            control: 'select',
            options: Object.keys(inputSizeClass),
        },
        fullWidth: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
        size: 'md',
    },
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 300 }}>
            {Object.keys(inputSizeClass).map((size) => (
                <Input
                    key={size}
                    size={size as keyof typeof inputSizeClass}
                    placeholder={`Size: ${size}`}
                />
            ))}
        </div>
    ),
};

export const WithError: Story = {
    args: {
        placeholder: 'Invalid input',
        error: 'This field is required',
    },
};

export const CompoundAPI: Story = {
    name: 'Compound API',
    render: () => (
        <Input.Root error="Email is required" fullWidth>
            <Input.Field placeholder="Enter email..." />
            <Input.Error />
        </Input.Root>
    ),
};

export const Disabled: Story = {
    args: {
        placeholder: 'Disabled input',
        disabled: true,
    },
};
