import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
    title: 'Foundation/Shadows',
};

export default meta;
type Story = StoryObj;

const shadows = [
    { name: 'xs', variable: '--shadow-xs', value: '0 1px 2px 0 rgb(28 25 23 / 0.04)' },
    {
        name: 'sm',
        variable: '--shadow-sm',
        value: '0 1px 3px 0 rgb(28 25 23 / 0.08), 0 1px 2px -1px rgb(28 25 23 / 0.08)',
    },
    {
        name: 'md',
        variable: '--shadow-md',
        value: '0 4px 6px -1px rgb(28 25 23 / 0.08), 0 2px 4px -2px rgb(28 25 23 / 0.06)',
    },
    {
        name: 'lg',
        variable: '--shadow-lg',
        value: '0 10px 15px -3px rgb(28 25 23 / 0.08), 0 4px 6px -4px rgb(28 25 23 / 0.06)',
    },
    {
        name: 'xl',
        variable: '--shadow-xl',
        value: '0 20px 25px -5px rgb(28 25 23 / 0.08), 0 8px 10px -6px rgb(28 25 23 / 0.06)',
    },
    { name: '2xl', variable: '--shadow-2xl', value: '0 25px 50px -12px rgb(28 25 23 / 0.2)' },
];

export const AllShadows: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '2rem',
                padding: '2rem',
            }}
        >
            {shadows.map((shadow) => (
                <div key={shadow.name} style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            width: '100%',
                            height: 100,
                            borderRadius: 12,
                            backgroundColor: 'var(--color-card)',
                            boxShadow: shadow.value,
                            marginBottom: '0.75rem',
                        }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{shadow.name}</div>
                    <div
                        style={{
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--color-text-muted)',
                        }}
                    >
                        {shadow.variable}
                    </div>
                </div>
            ))}
        </div>
    ),
};
