import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../primitives/Button';
import { Badge } from '../../primitives/Badge';
import { Card } from '../../primitives/Card';
import { Input } from '../../primitives/Input';
import { Select } from '../../primitives/Select';
import { Checkbox } from '../../primitives/Checkbox';
import { Switch } from '../../primitives/Switch';
import { Avatar } from '../../primitives/Avatar';

function ComponentSet() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="primary" size="sm">
                    Primary
                </Button>
                <Button variant="secondary" size="sm">
                    Secondary
                </Button>
                <Button variant="success" size="sm">
                    Success
                </Button>
                <Button variant="error" size="sm">
                    Error
                </Button>
                <Button variant="primary" size="sm" outline>
                    Outline
                </Button>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
            </div>

            {/* Card */}
            <Card>
                <Card.Header>
                    <h3 style={{ fontWeight: 600, fontSize: '0.875rem' }}>Card Title</h3>
                </Card.Header>
                <Card.Body>
                    <p style={{ fontSize: '0.875rem' }}>Sample card content.</p>
                </Card.Body>
            </Card>

            {/* Form Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Input placeholder="Text input" size="sm" />
                <Select
                    size="sm"
                    options={[
                        { value: '', label: 'Select...' },
                        { value: '1', label: 'Option 1' },
                    ]}
                />
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Checkbox label="Check" defaultChecked />
                <Switch label="Toggle" defaultChecked />
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Avatar fallback="AB" size="sm" />
                <Avatar fallback="CD" size="sm" />
            </div>
        </div>
    );
}

function ThemeComparisonPage() {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                maxWidth: 1200,
                margin: '0 auto',
            }}
        >
            <div>
                <h2
                    style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: 'var(--color-text)',
                    }}
                >
                    Light
                </h2>
                <div
                    style={{
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg)',
                    }}
                >
                    <ComponentSet />
                </div>
            </div>

            <div data-theme="dark">
                <h2
                    style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: 'var(--color-text)',
                    }}
                >
                    Dark
                </h2>
                <div
                    style={{
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg)',
                    }}
                >
                    <ComponentSet />
                </div>
            </div>
        </div>
    );
}

const meta: Meta = {
    title: 'Themes/Comparison',
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj;

export const LightVsDark: Story = {
    render: () => <ThemeComparisonPage />,
};
