import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingSpinner } from './index';
import { spinnerSizeClass } from './LoadingSpinner.variants';

const meta: Meta<typeof LoadingSpinner> = {
    title: 'Components/Primitives/LoadingSpinner',
    component: LoadingSpinner,
    argTypes: {
        size: {
            control: 'select',
            options: Object.keys(spinnerSizeClass),
        },
    },
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {
    args: {
        size: 'md',
    },
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {Object.keys(spinnerSizeClass).map((size) => (
                <div key={size} style={{ textAlign: 'center' }}>
                    <LoadingSpinner size={size as keyof typeof spinnerSizeClass} />
                    <p
                        style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            marginTop: '0.5rem',
                        }}
                    >
                        {size}
                    </p>
                </div>
            ))}
        </div>
    ),
};
