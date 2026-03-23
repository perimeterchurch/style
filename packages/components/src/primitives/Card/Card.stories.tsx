import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './index';

const meta: Meta<typeof Card> = {
    title: 'Components/Primitives/Card',
    component: Card,
    argTypes: {
        hoverable: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    render: () => (
        <Card>
            <Card.Header>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Card Title</h3>
            </Card.Header>
            <Card.Body>
                <p>Card content goes here.</p>
            </Card.Body>
            <Card.Footer>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Footer</p>
            </Card.Footer>
        </Card>
    ),
};

export const Hoverable: Story = {
    render: () => (
        <Card hoverable>
            <Card.Body>
                <p>Hover over this card</p>
            </Card.Body>
        </Card>
    ),
};

export const Compound: Story = {
    name: 'Compound API',
    render: () => (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Card>
                <Card.Header>
                    <h3>With Header</h3>
                </Card.Header>
                <Card.Body>Content</Card.Body>
            </Card>
            <Card>
                <Card.Body>Body Only</Card.Body>
            </Card>
            <Card>
                <Card.Body>With Footer</Card.Body>
                <Card.Footer>Action area</Card.Footer>
            </Card>
        </div>
    ),
};
