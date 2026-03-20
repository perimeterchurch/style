import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, type Tab } from '../../composite/Tabs';
import { Badge } from '../../primitives/Badge';

const meta: Meta = {
    title: 'Patterns/Navigation',
};

export default meta;
type Story = StoryObj;

const sampleTabs: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members', badge: <Badge variant="primary" size="sm">24</Badge> as React.ReactNode },
    { id: 'events', label: 'Events' },
    { id: 'settings', label: 'Settings' },
];

const tabContent: Record<string, string> = {
    overview: 'This is the overview panel. It shows a summary of all key metrics and recent activity.',
    members: 'The members panel displays a list of all group members with their contact information.',
    events: 'Upcoming events are listed here along with registration links and details.',
    settings: 'Manage group settings, notifications, and permissions from this panel.',
};

function TabsWithContent() {
    const [activeTab, setActiveTab] = useState('overview');
    return (
        <div>
            <Tabs tabs={sampleTabs} activeTab={activeTab} onChange={setActiveTab} />
            <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                <p>{tabContent[activeTab]}</p>
            </div>
        </div>
    );
}

export const TabsWithPanels: Story = {
    render: () => <TabsWithContent />,
};

function CompoundTabsDemo() {
    const [activeTab, setActiveTab] = useState('tab1');
    return (
        <Tabs.Root activeTab={activeTab} onChange={setActiveTab}>
            <Tabs.List>
                <Tabs.Tab id="tab1">Dashboard</Tabs.Tab>
                <Tabs.Tab id="tab2">Analytics</Tabs.Tab>
                <Tabs.Tab id="tab3">Reports</Tabs.Tab>
                <Tabs.Tab id="tab4" disabled>Archived</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
                <Tabs.Panel id="tab1">
                    <div style={{ padding: '1.5rem' }}>Dashboard content with key performance indicators.</div>
                </Tabs.Panel>
                <Tabs.Panel id="tab2">
                    <div style={{ padding: '1.5rem' }}>Analytics charts and data visualizations.</div>
                </Tabs.Panel>
                <Tabs.Panel id="tab3">
                    <div style={{ padding: '1.5rem' }}>Generated reports and export options.</div>
                </Tabs.Panel>
            </Tabs.Panels>
        </Tabs.Root>
    );
}

export const CompoundTabs: Story = {
    render: () => <CompoundTabsDemo />,
};
