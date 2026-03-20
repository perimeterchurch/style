import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';
import { buttonVariants, buttonSizes } from './Button.variants';

const meta: Meta<typeof Button> = {
    title: 'Components/Primitives/Button',
    component: Button,
    argTypes: {
        variant: {
            control: 'select',
            options: Object.keys(buttonVariants),
        },
        size: {
            control: 'select',
            options: Object.keys(buttonSizes),
        },
        outline: { control: 'boolean' },
        fullWidth: { control: 'boolean' },
        disabled: { control: 'boolean' },
        isLoading: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: 'Button',
        variant: 'primary',
        size: 'md',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(buttonVariants).map((variant) => (
                <Button key={variant} variant={variant as keyof typeof buttonVariants}>
                    {variant}
                </Button>
            ))}
        </div>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {Object.keys(buttonSizes).map((size) => (
                <Button key={size} size={size as keyof typeof buttonSizes}>
                    {size}
                </Button>
            ))}
        </div>
    ),
};

export const Outline: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(buttonVariants).map((variant) => (
                <Button key={variant} variant={variant as keyof typeof buttonVariants} outline>
                    {variant}
                </Button>
            ))}
        </div>
    ),
};

export const Loading: Story = {
    args: { children: 'Loading...', isLoading: true },
};

export const Disabled: Story = {
    args: { children: 'Disabled', disabled: true },
};

export const Playground: Story = {
    args: {
        children: 'Playground',
        variant: 'primary',
        size: 'md',
        outline: false,
        fullWidth: false,
        disabled: false,
        isLoading: false,
    },
};
