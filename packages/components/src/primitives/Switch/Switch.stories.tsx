import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './index';
import { switchSizeClass } from './Switch.variants';

const meta: Meta<typeof Switch> = {
    title: 'Components/Primitives/Switch',
    component: Switch,
    argTypes: {
        size: {
            control: 'select',
            options: Object.keys(switchSizeClass),
        },
        label: { control: 'text' },
        disabled: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
    args: {
        label: 'Enable notifications',
        size: 'md',
    },
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.keys(switchSizeClass).map((size) => (
                <Switch
                    key={size}
                    size={size as keyof typeof switchSizeClass}
                    label={`Size: ${size}`}
                />
            ))}
        </div>
    ),
};

export const Disabled: Story = {
    args: {
        label: 'Disabled switch',
        disabled: true,
    },
};

export const WithoutLabel: Story = {
    args: {
        size: 'md',
    },
};
