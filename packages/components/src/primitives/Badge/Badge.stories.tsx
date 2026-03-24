import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './index';
import { badgeVariantClass, badgeSizeClass } from './Badge.variants';

const meta: Meta<typeof Badge> = {
    title: 'Components/Primitives/Badge',
    component: Badge,
    argTypes: {
        variant: {
            control: 'select',
            options: Object.keys(badgeVariantClass),
        },
        size: {
            control: 'select',
            options: Object.keys(badgeSizeClass),
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
            {Object.keys(badgeVariantClass).map((variant) => (
                <Badge key={variant} variant={variant as keyof typeof badgeVariantClass}>
                    {variant}
                </Badge>
            ))}
        </div>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {Object.keys(badgeSizeClass).map((size) => (
                <Badge key={size} size={size as keyof typeof badgeSizeClass}>
                    {size}
                </Badge>
            ))}
        </div>
    ),
};

export const WithDot: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(badgeVariantClass).map((variant) => (
                <Badge key={variant} variant={variant as keyof typeof badgeVariantClass} dot>
                    {variant}
                </Badge>
            ))}
        </div>
    ),
};

export const Outline: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(badgeVariantClass).map((variant) => (
                <Badge key={variant} variant={variant as keyof typeof badgeVariantClass} outline>
                    {variant}
                </Badge>
            ))}
        </div>
    ),
};
