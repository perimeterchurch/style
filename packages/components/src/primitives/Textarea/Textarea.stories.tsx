import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './index';
import { textareaTextSizes } from './Textarea.variants';

const meta: Meta<typeof Textarea> = {
    title: 'Components/Primitives/Textarea',
    component: Textarea,
    argTypes: {
        size: {
            control: 'select',
            options: Object.keys(textareaTextSizes),
        },
        fullWidth: { control: 'boolean' },
        disabled: { control: 'boolean' },
        error: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
    args: {
        placeholder: 'Enter your message...',
        size: 'md',
    },
};

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
            {Object.keys(textareaTextSizes).map((size) => (
                <Textarea
                    key={size}
                    size={size as keyof typeof textareaTextSizes}
                    placeholder={`Size: ${size}`}
                />
            ))}
        </div>
    ),
};

export const WithError: Story = {
    args: {
        placeholder: 'This field has an error',
        error: true,
    },
};

export const Disabled: Story = {
    args: {
        placeholder: 'Disabled textarea',
        disabled: true,
    },
};
