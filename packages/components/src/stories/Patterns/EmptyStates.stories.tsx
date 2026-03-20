import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '../../primitives/EmptyState';
import { Button } from '../../primitives/Button';

const meta: Meta = {
    title: 'Patterns/EmptyStates',
};

export default meta;
type Story = StoryObj;

function InboxIcon() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
    );
}

export const NoResults: Story = {
    render: () => (
        <EmptyState
            icon={<SearchIcon />}
            title="No results found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={<Button variant="primary">Clear Filters</Button>}
        />
    ),
};

export const EmptyInbox: Story = {
    render: () => (
        <EmptyState
            icon={<InboxIcon />}
            title="Your inbox is empty"
            description="When you receive new messages, they will appear here."
        />
    ),
};

export const NoEvents: Story = {
    render: () => (
        <EmptyState
            icon={<CalendarIcon />}
            title="No upcoming events"
            description="There are no events scheduled. Create one to get started."
            action={
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="primary">Create Event</Button>
                    <Button variant="secondary">Import Calendar</Button>
                </div>
            }
        />
    ),
};
