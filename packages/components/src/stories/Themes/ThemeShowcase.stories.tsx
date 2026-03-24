import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../primitives/Button';
import { Badge } from '../../primitives/Badge';
import { Card } from '../../primitives/Card';
import { Input } from '../../primitives/Input';
import { Select } from '../../primitives/Select';
import { Textarea } from '../../primitives/Textarea';
import { Checkbox } from '../../primitives/Checkbox';
import { Switch } from '../../primitives/Switch';
import { Avatar } from '../../primitives/Avatar';
import { Tabs } from '../../composite/Tabs';
import { buttonVariantClass } from '../../primitives/Button/Button.variants';
import { badgeVariantClass } from '../../primitives/Badge/Badge.variants';

const BUTTON_VARIANTS = Object.keys(buttonVariantClass) as Array<keyof typeof buttonVariantClass>;
const BADGE_VARIANTS = Object.keys(badgeVariantClass) as Array<keyof typeof badgeVariantClass>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '2rem' }}>
            <h2
                style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                    color: 'var(--color-text)',
                }}
            >
                {title}
            </h2>
            {children}
        </div>
    );
}

function ThemeShowcasePage() {
    const [activeTab, setActiveTab] = useState('tab1');

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h1
                style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginBottom: '1.5rem',
                    color: 'var(--color-text)',
                }}
            >
                Theme Showcase
            </h1>

            <Section title="Buttons">
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {BUTTON_VARIANTS.map((v) => (
                        <Button key={v} variant={v}>
                            {v}
                        </Button>
                    ))}
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginTop: '0.5rem',
                    }}
                >
                    {BUTTON_VARIANTS.map((v) => (
                        <Button key={v} variant={v} outline>
                            {v}
                        </Button>
                    ))}
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginTop: '0.5rem',
                    }}
                >
                    <Button disabled>Disabled</Button>
                    <Button isLoading>Loading</Button>
                    <Button size="sm">Small</Button>
                    <Button size="lg">Large</Button>
                </div>
            </Section>

            <Section title="Badges">
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {BADGE_VARIANTS.map((v) => (
                        <Badge key={v} variant={v}>
                            {v}
                        </Badge>
                    ))}
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginTop: '0.5rem',
                    }}
                >
                    {BADGE_VARIANTS.map((v) => (
                        <Badge key={v} variant={v} outline>
                            {v}
                        </Badge>
                    ))}
                </div>
            </Section>

            <Section title="Card">
                <Card>
                    <Card.Header>
                        <h3 style={{ fontWeight: 600 }}>Card Title</h3>
                    </Card.Header>
                    <Card.Body>
                        <p>
                            This is a sample card body with some representative content to show how
                            cards look in the current theme.
                        </p>
                    </Card.Body>
                    <Card.Footer>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button size="sm">Action</Button>
                            <Button size="sm" variant="secondary">
                                Cancel
                            </Button>
                        </div>
                    </Card.Footer>
                </Card>
            </Section>

            <Section title="Form Controls">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        maxWidth: 400,
                    }}
                >
                    <Input placeholder="Text input" />
                    <Input placeholder="Error state" error="This field is required" />
                    <Select
                        options={[
                            { value: '', label: 'Select an option...' },
                            { value: '1', label: 'Option 1' },
                            { value: '2', label: 'Option 2' },
                        ]}
                    />
                    <Textarea placeholder="Textarea content..." rows={3} />
                </div>
            </Section>

            <Section title="Checkbox">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Checkbox label="Default checkbox" />
                    <Checkbox label="Checked checkbox" defaultChecked />
                    <Checkbox label="Disabled checkbox" disabled />
                </div>
            </Section>

            <Section title="Switch">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Switch label="Default switch" />
                    <Switch label="Active switch" defaultChecked />
                    <Switch label="Disabled switch" disabled />
                </div>
            </Section>

            <Section title="Avatar">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Avatar fallback="AB" size="sm" />
                    <Avatar fallback="CD" size="md" />
                    <Avatar fallback="EF" size="lg" />
                </div>
            </Section>

            <Section title="Tabs">
                <Tabs
                    tabs={[
                        { id: 'tab1', label: 'Overview' },
                        { id: 'tab2', label: 'Details' },
                        { id: 'tab3', label: 'Settings', disabled: true },
                    ]}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />
                <div style={{ padding: '1rem 0', color: 'var(--color-text)' }}>
                    {activeTab === 'tab1' && <p>Overview tab content</p>}
                    {activeTab === 'tab2' && <p>Details tab content</p>}
                </div>
            </Section>
        </div>
    );
}

const meta: Meta = {
    title: 'Themes/Showcase',
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => <ThemeShowcasePage />,
};
