import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, type Tab } from './index';

const meta: Meta = {
    title: 'Components/Composite/Tabs',
};

export default meta;
type Story = StoryObj;

const basicTabs: Tab[] = [
    { id: 'tab1', label: 'Overview' },
    { id: 'tab2', label: 'Details' },
    { id: 'tab3', label: 'Settings' },
];

function TabsDemo() {
    const [activeTab, setActiveTab] = useState('tab1');
    return <Tabs tabs={basicTabs} activeTab={activeTab} onChange={setActiveTab} />;
}

export const Default: Story = {
    render: () => <TabsDemo />,
};

function TabsWithDisabledDemo() {
    const tabsWithDisabled: Tab[] = [
        { id: 'tab1', label: 'Active Tab' },
        { id: 'tab2', label: 'Another Tab' },
        { id: 'tab3', label: 'Disabled Tab', disabled: true },
    ];
    const [activeTab, setActiveTab] = useState('tab1');
    return <Tabs tabs={tabsWithDisabled} activeTab={activeTab} onChange={setActiveTab} />;
}

export const WithDisabled: Story = {
    render: () => <TabsWithDisabledDemo />,
};

function CompoundTabsDemo() {
    const [activeTab, setActiveTab] = useState('first');
    return (
        <Tabs.Root activeTab={activeTab} onChange={setActiveTab}>
            <Tabs.List>
                <Tabs.Tab id="first">First</Tabs.Tab>
                <Tabs.Tab id="second">Second</Tabs.Tab>
                <Tabs.Tab id="third">Third</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
                <Tabs.Panel id="first">
                    <div style={{ padding: '1rem' }}>Content for the first tab.</div>
                </Tabs.Panel>
                <Tabs.Panel id="second">
                    <div style={{ padding: '1rem' }}>Content for the second tab.</div>
                </Tabs.Panel>
                <Tabs.Panel id="third">
                    <div style={{ padding: '1rem' }}>Content for the third tab.</div>
                </Tabs.Panel>
            </Tabs.Panels>
        </Tabs.Root>
    );
}

export const CompoundAPI: Story = {
    name: 'Compound API',
    render: () => <CompoundTabsDemo />,
};
