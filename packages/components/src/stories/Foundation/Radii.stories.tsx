import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
    title: 'Foundation/Radii',
};

export default meta;
type Story = StoryObj;

const radii = [
    { name: 'none', value: '0', variable: '--radius-none' },
    { name: 'sm', value: '0.375rem', variable: '--radius-sm' },
    { name: 'md', value: '0.5rem', variable: '--radius-md' },
    { name: 'lg', value: '0.75rem', variable: '--radius-lg' },
    { name: 'xl', value: '1rem', variable: '--radius-xl' },
    { name: '2xl', value: '1.5rem', variable: '--radius-2xl' },
    { name: 'full', value: '9999px', variable: '--radius-full' },
];

export const AllRadii: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '2rem',
                padding: '1rem',
            }}
        >
            {radii.map((radius) => (
                <div key={radius.name} style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: radius.value,
                            backgroundColor: 'var(--color-primary)',
                            opacity: 0.8,
                            margin: '0 auto 0.75rem',
                        }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{radius.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {radius.value}
                    </div>
                    <div
                        style={{
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        {radius.variable}
                    </div>
                </div>
            ))}
        </div>
    ),
};
