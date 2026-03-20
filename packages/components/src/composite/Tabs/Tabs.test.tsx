import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './index';

const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'settings', label: 'Settings', disabled: true },
];

describe('Tabs (props API)', () => {
    it('renders all tabs', () => {
        render(
            <Tabs tabs={tabs} activeTab="overview" onChange={() => {}} />,
        );
        expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('marks active tab with aria-selected', () => {
        render(
            <Tabs tabs={tabs} activeTab="overview" onChange={() => {}} />,
        );
        const activeTab = screen.getByRole('tab', { name: 'Overview' });
        expect(activeTab).toHaveAttribute('aria-selected', 'true');
    });

    it('marks inactive tabs with aria-selected=false', () => {
        render(
            <Tabs tabs={tabs} activeTab="overview" onChange={() => {}} />,
        );
        const inactive = screen.getByRole('tab', { name: 'Details' });
        expect(inactive).toHaveAttribute('aria-selected', 'false');
    });

    it('calls onChange when tab is clicked', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(
            <Tabs tabs={tabs} activeTab="overview" onChange={handleChange} />,
        );
        await user.click(screen.getByRole('tab', { name: 'Details' }));
        expect(handleChange).toHaveBeenCalledWith('details');
    });

    it('does not call onChange for disabled tab', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(
            <Tabs tabs={tabs} activeTab="overview" onChange={handleChange} />,
        );
        await user.click(screen.getByRole('tab', { name: 'Settings' }));
        expect(handleChange).not.toHaveBeenCalled();
    });

    it('renders badge content', () => {
        const tabsWithBadge = [
            { id: 'a', label: 'Tab A', badge: <span data-testid="badge">5</span> },
        ];
        render(
            <Tabs tabs={tabsWithBadge} activeTab="a" onChange={() => {}} />,
        );
        expect(screen.getByTestId('badge')).toBeInTheDocument();
    });

    it('supports keyboard navigation (ArrowRight)', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(
            <Tabs tabs={tabs} activeTab="overview" onChange={handleChange} />,
        );
        const firstTab = screen.getByRole('tab', { name: 'Overview' });
        firstTab.focus();
        await user.keyboard('{ArrowRight}');
        expect(handleChange).toHaveBeenCalledWith('details');
    });

    it('renders tablist role', () => {
        render(
            <Tabs tabs={tabs} activeTab="overview" onChange={() => {}} />,
        );
        expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('shows active indicator on active tab', () => {
        render(
            <Tabs tabs={tabs} activeTab="overview" onChange={() => {}} />,
        );
        const activeTab = screen.getByRole('tab', { name: 'Overview' });
        // The indicator is a child span
        const indicator = activeTab.querySelector('span:last-child');
        expect(indicator).not.toBeNull();
    });
});

describe('Tabs Compound API', () => {
    it('renders compound parts', () => {
        render(
            <Tabs.Root activeTab="a" onChange={() => {}}>
                <Tabs.List>
                    <Tabs.Tab id="a">Tab A</Tabs.Tab>
                    <Tabs.Tab id="b">Tab B</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel id="a">Content A</Tabs.Panel>
                    <Tabs.Panel id="b">Content B</Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>,
        );
        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getByRole('tabpanel')).toBeInTheDocument();
        expect(screen.getByText('Content A')).toBeInTheDocument();
    });

    it('hides inactive panels', () => {
        render(
            <Tabs.Root activeTab="a" onChange={() => {}}>
                <Tabs.List>
                    <Tabs.Tab id="a">Tab A</Tabs.Tab>
                    <Tabs.Tab id="b">Tab B</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panels>
                    <Tabs.Panel id="a">Content A</Tabs.Panel>
                    <Tabs.Panel id="b">Content B</Tabs.Panel>
                </Tabs.Panels>
            </Tabs.Root>,
        );
        expect(screen.queryByText('Content B')).not.toBeInTheDocument();
    });

    it('compound tab calls onChange', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(
            <Tabs.Root activeTab="a" onChange={handleChange}>
                <Tabs.List>
                    <Tabs.Tab id="a">Tab A</Tabs.Tab>
                    <Tabs.Tab id="b">Tab B</Tabs.Tab>
                </Tabs.List>
            </Tabs.Root>,
        );
        await user.click(screen.getByRole('tab', { name: 'Tab B' }));
        expect(handleChange).toHaveBeenCalledWith('b');
    });
});
