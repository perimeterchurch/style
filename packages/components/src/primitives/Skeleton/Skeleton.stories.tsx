import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './index';
import { skeletonVariantClass } from './Skeleton.variants';

const meta: Meta<typeof Skeleton> = {
    title: 'Components/Primitives/Skeleton',
    component: Skeleton,
    argTypes: {
        variant: {
            control: 'select',
            options: Object.keys(skeletonVariantClass),
        },
    },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
    args: {
        variant: 'line',
        width: 200,
        height: 16,
    },
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'center' }}>
                <Skeleton variant="line" width={200} height={16} />
                <p
                    style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)',
                        marginTop: '0.5rem',
                    }}
                >
                    line
                </p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <Skeleton variant="circle" width={48} height={48} />
                <p
                    style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)',
                        marginTop: '0.5rem',
                    }}
                >
                    circle
                </p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <Skeleton variant="card" width={200} height={100} />
                <p
                    style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)',
                        marginTop: '0.5rem',
                    }}
                >
                    card
                </p>
            </div>
        </div>
    ),
};
