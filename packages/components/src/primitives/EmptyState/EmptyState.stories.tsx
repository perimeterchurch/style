import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './index';

const meta: Meta<typeof EmptyState> = {
    title: 'Components/Primitives/EmptyState',
    component: EmptyState,
    argTypes: {
        title: { control: 'text' },
        description: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
    args: {
        title: 'No items found',
        description: 'Try adjusting your search or filters.',
    },
};

export const WithIcon: Story = {
    args: {
        title: 'Empty inbox',
        description: 'New messages will appear here.',
        icon: (
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
        ),
    },
};

export const WithAction: Story = {
    args: {
        title: 'No events scheduled',
        description: 'Create an event to get started.',
        action: (
            <button
                style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 8,
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Create Event
            </button>
        ),
    },
};
