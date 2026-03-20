import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../primitives/Button';
import { Input } from '../../primitives/Input';
import { Label } from '../../primitives/Label';
import { Textarea } from '../../primitives/Textarea';
import { Select } from '../../primitives/Select';
import { Checkbox } from '../../primitives/Checkbox';

const meta: Meta = {
    title: 'Patterns/FormLayout',
};

export default meta;
type Story = StoryObj;

export const SimpleForm: Story = {
    render: () => (
        <form
            style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '1rem' }}
            onSubmit={(e) => e.preventDefault()}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Label htmlFor="name" required>
                    Full Name
                </Label>
                <Input id="name" placeholder="Enter your name" fullWidth />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Label htmlFor="email" required>
                    Email
                </Label>
                <Input id="email" type="email" placeholder="you@example.com" fullWidth />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Write your message..." fullWidth />
            </div>
            <Button variant="primary" type="submit" fullWidth>
                Submit
            </Button>
        </form>
    ),
};

export const CompoundInputForm: Story = {
    name: 'With Error States',
    render: () => (
        <form
            style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '1rem' }}
            onSubmit={(e) => e.preventDefault()}
        >
            <Input.Root error="This field is required" fullWidth>
                <Label htmlFor="username" required>
                    Username
                </Label>
                <Input.Field id="username" placeholder="Choose a username" />
                <Input.Error />
            </Input.Root>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Label htmlFor="role">Role</Label>
                <Select
                    id="role"
                    fullWidth
                    options={[
                        { value: '', label: 'Select a role...' },
                        { value: 'admin', label: 'Admin' },
                        { value: 'editor', label: 'Editor' },
                        { value: 'viewer', label: 'Viewer' },
                    ]}
                />
            </div>
            <Checkbox label="I agree to the terms and conditions" />
            <Button variant="primary" type="submit" fullWidth>
                Create Account
            </Button>
        </form>
    ),
};
