import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../../primitives/Card';
import { Badge } from '../../primitives/Badge';
import { Button } from '../../primitives/Button';

const meta: Meta = {
    title: 'Patterns/CardGrid',
};

export default meta;
type Story = StoryObj;

const sampleCards = [
    {
        title: 'Sunday Worship',
        badge: 'Upcoming',
        description: 'Join us for worship this Sunday at 9:00 AM and 11:00 AM.',
    },
    {
        title: 'Youth Group',
        badge: 'Weekly',
        description: 'Wednesday evenings from 6:30 PM to 8:00 PM for grades 6-12.',
    },
    {
        title: 'Small Groups',
        badge: 'Ongoing',
        description: 'Connect with others in a small group near you throughout the week.',
    },
    {
        title: 'Volunteer Training',
        badge: 'New',
        description: 'Learn how to serve in our various ministry areas.',
    },
    {
        title: 'Prayer Meeting',
        badge: 'Weekly',
        description: 'Tuesday mornings at 7:00 AM in the chapel.',
    },
    {
        title: 'Community Outreach',
        badge: 'Monthly',
        description: 'Serve our local community the first Saturday of each month.',
    },
];

export const ResponsiveGrid: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
            }}
        >
            {sampleCards.map((card) => (
                <Card key={card.title} hoverable>
                    <Card.Header>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{card.title}</h3>
                            <Badge variant="primary" size="sm">
                                {card.badge}
                            </Badge>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            {card.description}
                        </p>
                    </Card.Body>
                    <Card.Footer>
                        <Button variant="primary" size="sm">
                            Learn More
                        </Button>
                    </Card.Footer>
                </Card>
            ))}
        </div>
    ),
};

export const TwoColumnGrid: Story = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {sampleCards.slice(0, 4).map((card) => (
                <Card key={card.title}>
                    <Card.Body>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            {card.title}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            {card.description}
                        </p>
                    </Card.Body>
                </Card>
            ))}
        </div>
    ),
};
