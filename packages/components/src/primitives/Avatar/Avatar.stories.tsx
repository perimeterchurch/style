import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './index';
import { avatarSizeClass } from './Avatar.variants';

const meta: Meta<typeof Avatar> = {
    title: 'Components/Primitives/Avatar',
    component: Avatar,
    argTypes: {
        size: {
            control: 'select',
            options: Object.keys(avatarSizeClass),
        },
        src: { control: 'text' },
        alt: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
    args: {
        fallback: 'PB',
        size: 'md',
    },
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {Object.keys(avatarSizeClass).map((size) => (
                <div key={size} style={{ textAlign: 'center' }}>
                    <Avatar size={size as keyof typeof avatarSizeClass} fallback="PC" />
                    <p
                        style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            marginTop: '0.25rem',
                        }}
                    >
                        {size}
                    </p>
                </div>
            ))}
        </div>
    ),
};

export const WithImage: Story = {
    args: {
        src: 'https://api.dicebear.com/9.x/initials/svg?seed=PC',
        alt: 'Perimeter Church',
        size: 'lg',
    },
};

export const FallbackInitials: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Avatar fallback="AB" />
            <Avatar fallback="CD" />
            <Avatar fallback="?" />
        </div>
    ),
};
