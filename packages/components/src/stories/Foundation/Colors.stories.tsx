import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
    title: 'Foundation/Colors',
};

export default meta;
type Story = StoryObj;

interface SwatchProps {
    name: string;
    variable: string;
    hex: string;
}

function Swatch({ name, variable, hex }: SwatchProps) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem',
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: hex,
                    border: '1px solid var(--color-border)',
                    flexShrink: 0,
                }}
            />
            <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {variable}
                </div>
                <div
                    style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    {hex}
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '2rem' }}>
            <h3
                style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '0.5rem',
                }}
            >
                {title}
            </h3>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '0.5rem',
                }}
            >
                {children}
            </div>
        </div>
    );
}

export const SemanticColors: Story = {
    render: () => (
        <div>
            <Section title="Primary">
                <Swatch name="Primary" variable="--color-primary" hex="#5b5bd6" />
                <Swatch name="Primary Hover" variable="--color-primary-hover" hex="#4e4eca" />
                <Swatch name="Primary Active" variable="--color-primary-active" hex="#4242b8" />
                <Swatch
                    name="Primary Foreground"
                    variable="--color-primary-foreground"
                    hex="#ffffff"
                />
            </Section>
            <Section title="Success">
                <Swatch name="Success" variable="--color-success" hex="#46a758" />
                <Swatch name="Success Hover" variable="--color-success-hover" hex="#3d9b4f" />
                <Swatch name="Success Active" variable="--color-success-active" hex="#348746" />
                <Swatch
                    name="Success Foreground"
                    variable="--color-success-foreground"
                    hex="#ffffff"
                />
            </Section>
            <Section title="Warning">
                <Swatch name="Warning" variable="--color-warning" hex="#f5a623" />
                <Swatch name="Warning Hover" variable="--color-warning-hover" hex="#e09918" />
                <Swatch name="Warning Active" variable="--color-warning-active" hex="#c88a14" />
                <Swatch
                    name="Warning Foreground"
                    variable="--color-warning-foreground"
                    hex="#ffffff"
                />
            </Section>
            <Section title="Error">
                <Swatch name="Error" variable="--color-error" hex="#e54666" />
                <Swatch name="Error Hover" variable="--color-error-hover" hex="#d93d5c" />
                <Swatch name="Error Active" variable="--color-error-active" hex="#c63652" />
                <Swatch name="Error Foreground" variable="--color-error-foreground" hex="#ffffff" />
            </Section>
            <Section title="Info">
                <Swatch name="Info" variable="--color-info" hex="#0ea5e9" />
                <Swatch name="Info Hover" variable="--color-info-hover" hex="#0284c7" />
                <Swatch name="Info Active" variable="--color-info-active" hex="#0369a1" />
                <Swatch name="Info Foreground" variable="--color-info-foreground" hex="#ffffff" />
            </Section>
        </div>
    ),
};

export const SurfaceColors: Story = {
    render: () => (
        <Section title="Surface Colors">
            <Swatch name="Background" variable="--color-background" hex="#ffffff" />
            <Swatch name="Foreground" variable="--color-foreground" hex="#1c1917" />
            <Swatch name="Card" variable="--color-card" hex="#ffffff" />
            <Swatch name="Card Foreground" variable="--color-card-foreground" hex="#1c1917" />
            <Swatch name="Muted" variable="--color-muted" hex="#f5f5f4" />
            <Swatch name="Muted Foreground" variable="--color-muted-foreground" hex="#78716c" />
            <Swatch name="Accent" variable="--color-accent" hex="#f5f5f4" />
            <Swatch name="Accent Foreground" variable="--color-accent-foreground" hex="#1c1917" />
            <Swatch name="Popover" variable="--color-popover" hex="#ffffff" />
            <Swatch name="Popover Foreground" variable="--color-popover-foreground" hex="#1c1917" />
            <Swatch name="Border" variable="--color-border" hex="#d6d3d1" />
            <Swatch name="Input" variable="--color-input" hex="#d6d3d1" />
            <Swatch name="Ring" variable="--color-ring" hex="#5b5bd6" />
        </Section>
    ),
};

export const BaseScale: Story = {
    render: () => (
        <Section title="Base Scale (Warm Stone)">
            <Swatch name="Background" variable="--color-bg" hex="#fafaf9" />
            <Swatch name="Background Subtle" variable="--color-bg-subtle" hex="#f5f5f4" />
            <Swatch name="Background Muted" variable="--color-bg-muted" hex="#e7e5e4" />
            <Swatch name="Text" variable="--color-text" hex="#1c1917" />
            <Swatch name="Text Secondary" variable="--color-text-secondary" hex="#57534e" />
            <Swatch name="Text Muted" variable="--color-text-muted" hex="#a8a29e" />
            <Swatch name="Border Subtle" variable="--color-border-subtle" hex="#e7e5e4" />
        </Section>
    ),
};

export const LightVsDark: Story = {
    name: 'Light vs Dark Comparison',
    render: () => {
        const tokens = [
            {
                name: 'Background',
                variable: '--color-background',
                light: '#ffffff',
                dark: '#0c0a09',
            },
            {
                name: 'Foreground',
                variable: '--color-foreground',
                light: '#1c1917',
                dark: '#fafaf9',
            },
            { name: 'Card', variable: '--color-card', light: '#ffffff', dark: '#1c1917' },
            { name: 'Muted', variable: '--color-muted', light: '#f5f5f4', dark: '#292524' },
            { name: 'Border', variable: '--color-border', light: '#d6d3d1', dark: '#44403c' },
            { name: 'Text', variable: '--color-text', light: '#1c1917', dark: '#fafaf9' },
            {
                name: 'Text Muted',
                variable: '--color-text-muted',
                light: '#a8a29e',
                dark: '#78716c',
            },
        ];
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Light Theme</h3>
                    {tokens.map((t) => (
                        <Swatch
                            key={`light-${t.name}`}
                            name={t.name}
                            variable={t.variable}
                            hex={t.light}
                        />
                    ))}
                </div>
                <div
                    style={{
                        backgroundColor: '#0c0a09',
                        padding: '1rem',
                        borderRadius: 12,
                        color: '#fafaf9',
                    }}
                >
                    <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Dark Theme</h3>
                    {tokens.map((t) => (
                        <Swatch
                            key={`dark-${t.name}`}
                            name={t.name}
                            variable={t.variable}
                            hex={t.dark}
                        />
                    ))}
                </div>
            </div>
        );
    },
};
