import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
    title: 'Foundation/Spacing',
};

export default meta;
type Story = StoryObj;

const spacingTokens = [
    { name: 'xs', value: '0.5rem', px: '8px' },
    { name: 'sm', value: '0.75rem', px: '12px' },
    { name: 'md', value: '1rem', px: '16px' },
    { name: 'lg', value: '1.5rem', px: '24px' },
    { name: 'xl', value: '2rem', px: '32px' },
    { name: '2xl', value: '3rem', px: '48px' },
    { name: '3xl', value: '4rem', px: '64px' },
];

export const AllSpacing: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {spacingTokens.map((token) => (
                <div key={token.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 80, textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{token.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {token.value} / {token.px}
                        </div>
                    </div>
                    <div
                        style={{
                            width: token.value,
                            height: 32,
                            backgroundColor: 'var(--color-primary)',
                            borderRadius: 4,
                            opacity: 0.8,
                        }}
                    />
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                        --spacing-{token.name}
                    </div>
                </div>
            ))}
        </div>
    ),
};
