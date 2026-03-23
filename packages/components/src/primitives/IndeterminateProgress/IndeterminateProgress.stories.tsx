import type { Meta, StoryObj } from '@storybook/react-vite';
import { IndeterminateProgress } from './index';

const meta: Meta<typeof IndeterminateProgress> = {
    title: 'Components/Primitives/IndeterminateProgress',
    component: IndeterminateProgress,
    argTypes: {
        visible: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof IndeterminateProgress>;

export const Default: Story = {
    args: {
        visible: true,
    },
    decorators: [
        (Story) => (
            <div style={{ position: 'relative', height: 4, borderRadius: 4, overflow: 'hidden' }}>
                <Story />
            </div>
        ),
    ],
};

export const InCard: Story = {
    render: () => (
        <div
            style={{
                position: 'relative',
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                overflow: 'hidden',
            }}
        >
            <IndeterminateProgress visible />
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-secondary)' }}>Loading content...</p>
            </div>
        </div>
    ),
};
