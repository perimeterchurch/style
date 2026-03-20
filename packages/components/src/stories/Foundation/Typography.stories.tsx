import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
    title: 'Foundation/Typography',
};

export default meta;
type Story = StoryObj;

const fontSizes = [
    { name: 'xs', value: '0.75rem', variable: '--font-size-xs' },
    { name: 'sm', value: '0.875rem', variable: '--font-size-sm' },
    { name: 'base', value: '1rem', variable: '--font-size-base' },
    { name: 'lg', value: '1.125rem', variable: '--font-size-lg' },
    { name: 'xl', value: '1.25rem', variable: '--font-size-xl' },
    { name: '2xl', value: '1.5rem', variable: '--font-size-2xl' },
    { name: '3xl', value: '1.875rem', variable: '--font-size-3xl' },
    { name: '4xl', value: '2.25rem', variable: '--font-size-4xl' },
];

const fontWeights = [
    { name: 'Normal', value: 400, variable: '--font-weight-normal' },
    { name: 'Medium', value: 500, variable: '--font-weight-medium' },
    { name: 'Semibold', value: 600, variable: '--font-weight-semibold' },
    { name: 'Bold', value: 700, variable: '--font-weight-bold' },
];

const lineHeights = [
    { name: 'Tight', value: 1.25, variable: '--line-height-tight' },
    { name: 'Normal', value: 1.5, variable: '--line-height-normal' },
    { name: 'Relaxed', value: 1.75, variable: '--line-height-relaxed' },
];

export const FontSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {fontSizes.map((size) => (
                <div key={size.name} style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem' }}>
                    <div style={{ width: 80, textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                        <div style={{ fontWeight: 600 }}>{size.name}</div>
                        <div>{size.value}</div>
                    </div>
                    <div style={{ fontSize: size.value }}>
                        The quick brown fox jumps over the lazy dog
                    </div>
                </div>
            ))}
        </div>
    ),
};

export const FontWeights: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {fontWeights.map((weight) => (
                <div key={weight.name} style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem' }}>
                    <div style={{ width: 100, textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                        <div style={{ fontWeight: 600 }}>{weight.name}</div>
                        <div>{weight.value}</div>
                    </div>
                    <div style={{ fontWeight: weight.value, fontSize: '1.25rem' }}>
                        The quick brown fox jumps over the lazy dog
                    </div>
                </div>
            ))}
        </div>
    ),
};

export const LineHeights: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {lineHeights.map((lh) => (
                <div key={lh.name} style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ width: 100, textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-muted)', flexShrink: 0, paddingTop: '0.25rem' }}>
                        <div style={{ fontWeight: 600 }}>{lh.name}</div>
                        <div>{lh.value}</div>
                    </div>
                    <div style={{ lineHeight: lh.value, maxWidth: 400, padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: 8 }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                    </div>
                </div>
            ))}
        </div>
    ),
};

export const FontFamilies: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Sans (--font-sans)
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem' }}>
                    The quick brown fox jumps over the lazy dog 0123456789
                </div>
            </div>
            <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Mono (--font-mono)
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem' }}>
                    The quick brown fox jumps over the lazy dog 0123456789
                </div>
            </div>
        </div>
    ),
};
