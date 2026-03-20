import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './index';

const meta: Meta<typeof SearchInput> = {
    title: 'Components/Primitives/SearchInput',
    component: SearchInput,
    argTypes: {
        placeholder: { control: 'text' },
        debounce: { control: 'number' },
    },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

function SearchInputDemo({
    placeholder = 'Search...',
    debounce = 300,
}: {
    placeholder?: string;
    debounce?: number;
}) {
    const [value, setValue] = useState('');
    return (
        <div style={{ maxWidth: 400 }}>
            <SearchInput
                value={value}
                onChange={setValue}
                placeholder={placeholder}
                debounce={debounce}
            />
            <p
                style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.5rem',
                }}
            >
                Value: &quot;{value}&quot;
            </p>
        </div>
    );
}

export const Default: Story = {
    render: () => <SearchInputDemo />,
};

export const CustomPlaceholder: Story = {
    render: () => <SearchInputDemo placeholder="Search members..." />,
};

export const NoDebouce: Story = {
    render: () => <SearchInputDemo debounce={0} />,
};
