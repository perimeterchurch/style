import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../primitives/Button';
import { Card } from '../../primitives/Card';
import { Badge } from '../../primitives/Badge';
import { Input } from '../../primitives/Input';

const meta: Meta = {
    title: 'Foundation/Themes',
};

export default meta;
type Story = StoryObj;

function ThemePreview({ label, themeAttr }: { label: string; themeAttr?: string }) {
    return (
        <div
            data-theme={themeAttr}
            className="storybook-root"
            style={{
                padding: '1.5rem',
                borderRadius: 12,
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                border: '1px solid var(--color-border)',
            }}
        >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>{label}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="error">Error</Button>
                    <Button variant="primary" outline>
                        Outline
                    </Button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                </div>

                <Card>
                    <Card.Body>
                        <p style={{ marginBottom: '0.75rem', fontWeight: 500 }}>Sample Card</p>
                        <Input placeholder="Type something..." size="md" />
                    </Card.Body>
                </Card>

                <div
                    style={{
                        padding: '1rem',
                        backgroundColor: 'var(--color-muted)',
                        borderRadius: 8,
                    }}
                >
                    <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.875rem' }}>
                        Muted background area with muted foreground text
                    </p>
                </div>
            </div>
        </div>
    );
}

export const SideBySide: Story = {
    name: 'Light vs Dark',
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <ThemePreview label="Light Theme" />
            <ThemePreview label="Dark Theme" themeAttr="dark" />
        </div>
    ),
};
