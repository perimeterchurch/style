/**
 * Tabs Component
 * Accessible tab navigation with keyboard support.
 * Compound API: Tabs.Root, Tabs.List, Tabs.Tab, Tabs.Panels, Tabs.Panel
 */

import { createContext, useContext, forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import {
    tabsListClasses,
    tabButtonBaseClasses,
    tabButtonActiveClasses,
    tabButtonInactiveClasses,
    tabButtonHoverClasses,
    tabButtonDisabledClasses,
    tabIndicatorClasses,
} from './Tabs.variants';

// --- Types ---

export interface Tab {
    id: string;
    label: string;
    disabled?: boolean;
    badge?: ReactNode;
}

export interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
    className?: string;
}

// --- Simple (props-only) API ---

function TabsSimple({ tabs, activeTab, onChange, className }: TabsProps) {
    return (
        <div className={cn(tabsListClasses, className)} role="tablist">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-disabled={tab.disabled}
                        tabIndex={isActive ? 0 : -1}
                        disabled={tab.disabled}
                        onClick={() => {
                            if (!tab.disabled) onChange(tab.id);
                        }}
                        onKeyDown={(e) => {
                            const enabledTabs = tabs.filter((t) => !t.disabled);
                            const currentIndex = enabledTabs.findIndex((t) => t.id === tab.id);
                            let nextIndex = -1;

                            if (e.key === 'ArrowRight') {
                                nextIndex = (currentIndex + 1) % enabledTabs.length;
                            } else if (e.key === 'ArrowLeft') {
                                nextIndex =
                                    (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
                            }

                            if (nextIndex >= 0 && enabledTabs[nextIndex]) {
                                e.preventDefault();
                                onChange(enabledTabs[nextIndex]!.id);
                                const tabList = e.currentTarget.parentElement;
                                const buttons = tabList?.querySelectorAll<HTMLButtonElement>(
                                    '[role="tab"]:not([disabled])',
                                );
                                buttons?.[nextIndex]?.focus();
                            }
                        }}
                        className={cn(
                            tabButtonBaseClasses,
                            isActive ? tabButtonActiveClasses : tabButtonInactiveClasses,
                            !tab.disabled && !isActive && tabButtonHoverClasses,
                            tab.disabled && tabButtonDisabledClasses,
                        )}
                    >
                        <span className="flex items-center gap-2">
                            {tab.label}
                            {tab.badge}
                        </span>
                        {isActive && <span className={tabIndicatorClasses} />}
                    </button>
                );
            })}
        </div>
    );
}

TabsSimple.displayName = 'Tabs';

// --- Compound API ---

interface TabsContextValue {
    activeTab: string;
    onChange: (tabId: string) => void;
}

const TabsContext = createContext<TabsContextValue>({
    activeTab: '',
    onChange: () => {},
});

function useTabsContext() {
    return useContext(TabsContext);
}

export interface TabsRootProps {
    activeTab: string;
    onChange: (tabId: string) => void;
    children: ReactNode;
    className?: string;
}

const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(
    ({ activeTab, onChange, children, className }, ref) => {
        return (
            <TabsContext.Provider value={{ activeTab, onChange }}>
                <div ref={ref} className={className}>
                    {children}
                </div>
            </TabsContext.Provider>
        );
    },
);

TabsRoot.displayName = 'Tabs.Root';

export interface TabsListProps {
    children: ReactNode;
    className?: string;
}

function TabsList({ children, className }: TabsListProps) {
    return (
        <div className={cn(tabsListClasses, className)} role="tablist">
            {children}
        </div>
    );
}

TabsList.displayName = 'Tabs.List';

export interface TabsTabProps {
    id: string;
    disabled?: boolean;
    children: ReactNode;
    className?: string;
}

function TabsTab({ id, disabled = false, children, className }: TabsTabProps) {
    const { activeTab, onChange } = useTabsContext();
    const isActive = id === activeTab;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={disabled}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            onClick={() => {
                if (!disabled) onChange(id);
            }}
            className={cn(
                tabButtonBaseClasses,
                isActive ? tabButtonActiveClasses : tabButtonInactiveClasses,
                !disabled && !isActive && tabButtonHoverClasses,
                disabled && tabButtonDisabledClasses,
                className,
            )}
        >
            <span className="flex items-center gap-2">{children}</span>
            {isActive && <span className={tabIndicatorClasses} />}
        </button>
    );
}

TabsTab.displayName = 'Tabs.Tab';

export interface TabsPanelsProps {
    children: ReactNode;
    className?: string;
}

function TabsPanels({ children, className }: TabsPanelsProps) {
    return <div className={className}>{children}</div>;
}

TabsPanels.displayName = 'Tabs.Panels';

export interface TabsPanelProps {
    id: string;
    children: ReactNode;
    className?: string;
}

function TabsPanel({ id, children, className }: TabsPanelProps) {
    const { activeTab } = useTabsContext();
    if (id !== activeTab) return null;

    return (
        <div role="tabpanel" aria-labelledby={id} className={className}>
            {children}
        </div>
    );
}

TabsPanel.displayName = 'Tabs.Panel';

// --- Assemble ---

export const Tabs = Object.assign(TabsSimple, {
    Root: TabsRoot,
    List: TabsList,
    Tab: TabsTab,
    Panels: TabsPanels,
    Panel: TabsPanel,
});
