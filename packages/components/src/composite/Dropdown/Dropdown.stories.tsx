import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './index';
import { Button } from '../../primitives/Button';

const meta: Meta = {
    title: 'Components/Composite/Dropdown',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => (
        <Dropdown trigger={<Button variant="secondary">Open Menu</Button>}>
            <Dropdown.Item onClick={() => {}}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={() => {}}>Duplicate</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => {}} destructive>
                Delete
            </Dropdown.Item>
        </Dropdown>
    ),
};

export const WithDisabledItem: Story = {
    render: () => (
        <Dropdown trigger={<Button variant="secondary">Actions</Button>}>
            <Dropdown.Item onClick={() => {}}>View</Dropdown.Item>
            <Dropdown.Item onClick={() => {}}>Edit</Dropdown.Item>
            <Dropdown.Item disabled>Archive (unavailable)</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => {}} destructive>
                Delete
            </Dropdown.Item>
        </Dropdown>
    ),
};

export const LeftAligned: Story = {
    render: () => (
        <Dropdown trigger={<Button variant="secondary">Left Aligned</Button>} align="left">
            <Dropdown.Item onClick={() => {}}>Option A</Dropdown.Item>
            <Dropdown.Item onClick={() => {}}>Option B</Dropdown.Item>
            <Dropdown.Item onClick={() => {}}>Option C</Dropdown.Item>
        </Dropdown>
    ),
};
