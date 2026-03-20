import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { getIconNames } from './registry';

const meta: Meta<typeof Icon> = {
    title: 'Icons/Icon',
    component: Icon,
    argTypes: {
        name: {
            control: 'select',
            options: getIconNames(),
        },
        size: { control: 'number' },
    },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
    args: {
        name: 'search',
        size: 24,
    },
};

export const AllIcons: Story = {
    render: () => {
        const names = getIconNames();
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                {names.map((name) => (
                    <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                        <Icon name={name} size={20} />
                        <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textAlign: 'center', wordBreak: 'break-all' }}>{name}</span>
                    </div>
                ))}
            </div>
        );
    },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {[12, 16, 20, 24, 32, 48].map((size) => (
                <div key={size} style={{ textAlign: 'center' }}>
                    <Icon name="star" size={size} />
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{size}px</p>
                </div>
            ))}
        </div>
    ),
};
