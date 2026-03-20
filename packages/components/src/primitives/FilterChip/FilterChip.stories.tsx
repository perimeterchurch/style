import type { Meta, StoryObj } from '@storybook/react';
import { FilterChip } from './index';
import { chipVariants, chipSizes } from './FilterChip.variants';

const meta: Meta<typeof FilterChip> = {
    title: 'Components/Primitives/FilterChip',
    component: FilterChip,
    argTypes: {
        variant: {
            control: 'select',
            options: Object.keys(chipVariants),
        },
        size: {
            control: 'select',
            options: Object.keys(chipSizes),
        },
        label: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof FilterChip>;

export const Default: Story = {
    args: {
        label: 'Filter',
        variant: 'primary',
        size: 'md',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(chipVariants).map((variant) => (
                <FilterChip
                    key={variant}
                    label={variant}
                    variant={variant as keyof typeof chipVariants}
                />
            ))}
        </div>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {Object.keys(chipSizes).map((size) => (
                <FilterChip
                    key={size}
                    label={size}
                    size={size as keyof typeof chipSizes}
                />
            ))}
        </div>
    ),
};

export const WithRemove: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(chipVariants).map((variant) => (
                <FilterChip
                    key={variant}
                    label={variant}
                    variant={variant as keyof typeof chipVariants}
                    onRemove={() => {}}
                />
            ))}
        </div>
    ),
};
