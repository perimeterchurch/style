import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './index';

const meta: Meta<typeof Label> = {
    title: 'Components/Primitives/Label',
    component: Label,
    argTypes: {
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
    args: {
        children: 'Form Label',
    },
};

export const Required: Story = {
    args: {
        children: 'Required Field',
        required: true,
    },
};

export const Disabled: Story = {
    args: {
        children: 'Disabled Label',
        disabled: true,
    },
};
