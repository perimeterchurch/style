import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../../primitives/Skeleton';
import { LoadingSpinner } from '../../primitives/LoadingSpinner';
import { IndeterminateProgress } from '../../primitives/IndeterminateProgress';
import { Card } from '../../primitives/Card';

const meta: Meta = {
    title: 'Patterns/LoadingStates',
};

export default meta;
type Story = StoryObj;

export const SkeletonCard: Story = {
    render: () => (
        <Card>
            <Card.Body>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <Skeleton variant="circle" width={48} height={48} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Skeleton variant="line" width="60%" height={16} />
                        <Skeleton variant="line" width="80%" height={12} />
                        <Skeleton variant="line" width="40%" height={12} />
                    </div>
                </div>
            </Card.Body>
        </Card>
    ),
};

export const SkeletonList: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Skeleton variant="circle" width={40} height={40} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        <Skeleton variant="line" width="70%" height={14} />
                        <Skeleton variant="line" width="50%" height={10} />
                    </div>
                </div>
            ))}
        </div>
    ),
};

export const SkeletonGrid: Story = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                    <Skeleton variant="card" width="100%" height={120} />
                    <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Skeleton variant="line" width="80%" height={14} />
                        <Skeleton variant="line" width="60%" height={10} />
                    </div>
                </div>
            ))}
        </div>
    ),
};

export const SpinnerStates: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Centered Spinner</p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, border: '1px solid var(--color-border)', borderRadius: 8 }}>
                    <LoadingSpinner size="lg" />
                </div>
            </div>
            <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Progress Bar</p>
                <div style={{ position: 'relative', height: 4, borderRadius: 4, overflow: 'hidden' }}>
                    <IndeterminateProgress visible />
                </div>
            </div>
        </div>
    ),
};
