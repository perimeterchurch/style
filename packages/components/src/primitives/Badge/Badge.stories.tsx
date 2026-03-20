import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './index';
import { badgeVariants, badgeSizes } from './Badge.variants';

const meta: Meta<typeof Badge> = {
    title: 'Components/Primitives/Badge',
    component: Badge,
    argTypes: {
        variant: {
            control: 'select',
            options: Object.keys(badgeVariants),
        },
        size: {
            control: 'select',
            options: Object.keys(badgeSizes),
        },
        dot: { control: 'boolean' },
        outline: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    args: {
        children: 'Badge',
        variant: 'secondary',
        size: 'md',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(badgeVariants).map((variant) => (
                <Badge key={variant} variant={variant as keyof typeof badgeVariants}>
                    {variant}
                </Badge>
            ))}
        </div>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {Object.keys(badgeSizes).map((size) => (
                <Badge key={size} size={size as keyof typeof badgeSizes}>
                    {size}
                </Badge>
            ))}
        </div>
    ),
};

export const WithDot: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(badgeVariants).map((variant) => (
                <Badge key={variant} variant={variant as keyof typeof badgeVariants} dot>
                    {variant}
                </Badge>
            ))}
        </div>
    ),
};

export const Outline: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(badgeVariants).map((variant) => (
                <Badge key={variant} variant={variant as keyof typeof badgeVariants} outline>
                    {variant}
                </Badge>
            ))}
        </div>
    ),
};
