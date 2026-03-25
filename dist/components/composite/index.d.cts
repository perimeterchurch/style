import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { ReactNode } from 'react';
import { MenuItemsProps } from '@headlessui/react';

interface ComboSelectOption<T extends string | number = string> {
    value: T;
    label: string;
    icon?: ReactNode;
}
interface ComboSelectBaseProps<T extends string | number = string> {
    options: ComboSelectOption<T>[];
    placeholder?: string;
    placeholderIcon?: ReactNode;
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    showAllOption?: boolean;
    allOptionLabel?: string;
    emptyText?: string;
    className?: string;
}
interface ComboSelectSingleProps<T extends string | number = string> extends ComboSelectBaseProps<T> {
    multiple?: false;
    value: T | '';
    onChange: (value: T | '') => void;
}
interface ComboSelectMultipleProps<T extends string | number = string> extends ComboSelectBaseProps<T> {
    multiple: true;
    value: T[];
    onChange: (value: T[]) => void;
}
type ComboSelectProps<T extends string | number = string> = ComboSelectSingleProps<T> | ComboSelectMultipleProps<T>;
declare function ComboSelectSimple<T extends string | number = string>(props: ComboSelectProps<T>): react_jsx_runtime.JSX.Element;
declare namespace ComboSelectSimple {
    var displayName: string;
}
interface ComboSelectRootProps<T extends string | number = string> {
    value: T | T[] | '';
    onChange: (value: T | T[] | '') => void;
    multiple?: boolean;
    disabled?: boolean;
    loading?: boolean;
    placeholderIcon?: ReactNode;
    children: ReactNode;
    className?: string;
}
declare function ComboSelectRoot<T extends string | number = string>({ value, onChange, multiple, disabled, loading, placeholderIcon, children, className, }: ComboSelectRootProps<T>): react_jsx_runtime.JSX.Element;
declare namespace ComboSelectRoot {
    var displayName: string;
}
interface ComboSelectInputProps {
    placeholder?: string;
    className?: string;
}
declare function ComboSelectInput({ placeholder, className }: ComboSelectInputProps): react_jsx_runtime.JSX.Element;
declare namespace ComboSelectInput {
    var displayName: string;
}
interface ComboSelectOptionsProps {
    children: ReactNode;
    emptyText?: string;
    className?: string;
}
declare function ComboSelectOptionsWrapper({ children, className }: ComboSelectOptionsProps): react_jsx_runtime.JSX.Element;
declare namespace ComboSelectOptionsWrapper {
    var displayName: string;
}
interface ComboSelectOptionItemProps<T extends string | number = string> {
    value: T;
    children: ReactNode;
    className?: string;
}
declare function ComboSelectOptionItem<T extends string | number = string>({ value, children, className, }: ComboSelectOptionItemProps<T>): react_jsx_runtime.JSX.Element;
declare namespace ComboSelectOptionItem {
    var displayName: string;
}
declare const ComboSelect: typeof ComboSelectSimple & {
    Root: typeof ComboSelectRoot;
    Input: typeof ComboSelectInput;
    Options: typeof ComboSelectOptionsWrapper;
    Option: typeof ComboSelectOptionItem;
};

/**
 * Base props for all components
 */
interface BaseComponentProps {
    /** Test identifier */
    'data-testid'?: string;
}

interface DropdownProps extends BaseComponentProps {
    /** Trigger button content */
    trigger: ReactNode;
    /** Menu items */
    children: ReactNode;
    /** Menu alignment */
    align?: 'left' | 'right';
    /** Anchor placement override (Headless UI anchor prop) */
    anchor?: MenuItemsProps['anchor'];
    /** Additional class names */
    className?: string;
}
interface DropdownItemProps extends BaseComponentProps {
    /** Item content */
    children: ReactNode;
    /** Click handler */
    onClick?: () => void;
    /** Disabled state */
    disabled?: boolean;
    /** Destructive/danger styling */
    destructive?: boolean;
    /** Additional class names */
    className?: string;
}
declare const DropdownItem: react.ForwardRefExoticComponent<DropdownItemProps & react.RefAttributes<HTMLButtonElement>>;
declare function DropdownDivider(): react_jsx_runtime.JSX.Element;
declare namespace DropdownDivider {
    var displayName: string;
}
interface DropdownComponent extends React.ForwardRefExoticComponent<DropdownProps & React.RefAttributes<HTMLDivElement>> {
    Item: typeof DropdownItem;
    Divider: typeof DropdownDivider;
}
declare const Dropdown: DropdownComponent;

interface IconSelectOption<T extends string | number = string> {
    value: T;
    label: string;
    icon?: ReactNode;
}
interface IconSelectProps<T extends string | number = string> {
    value: T;
    onChange: (value: T) => void;
    options: IconSelectOption<T>[];
    placeholder?: string;
    fullWidth?: boolean;
    className?: string;
}
declare function IconSelect<T extends string | number = string>({ value, onChange, options, placeholder, fullWidth, className, }: IconSelectProps<T>): react_jsx_runtime.JSX.Element;

interface MultiIconSelectPreset<T extends string | number = string> {
    label: string;
    icon?: ReactNode;
    values: T[];
}
interface MultiIconSelectProps<T extends string | number = string> {
    value: T[];
    onChange: (value: T[]) => void;
    options: IconSelectOption<T>[];
    placeholder?: string;
    placeholderIcon?: ReactNode;
    presets?: MultiIconSelectPreset<T>[];
    fullWidth?: boolean;
    className?: string;
}
declare function MultiIconSelect<T extends string | number = string>({ value, onChange, options, placeholder, placeholderIcon, presets, fullWidth, className, }: MultiIconSelectProps<T>): react_jsx_runtime.JSX.Element;

interface Tab {
    id: string;
    label: string;
    disabled?: boolean;
    badge?: ReactNode;
}
interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
    className?: string;
}
declare function TabsSimple({ tabs, activeTab, onChange, className }: TabsProps): react_jsx_runtime.JSX.Element;
declare namespace TabsSimple {
    var displayName: string;
}
interface TabsRootProps {
    activeTab: string;
    onChange: (tabId: string) => void;
    children: ReactNode;
    className?: string;
}
declare function TabsRoot({ activeTab, onChange, children, className }: TabsRootProps): react_jsx_runtime.JSX.Element;
declare namespace TabsRoot {
    var displayName: string;
}
interface TabsListProps {
    children: ReactNode;
    className?: string;
}
declare function TabsList({ children, className }: TabsListProps): react_jsx_runtime.JSX.Element;
declare namespace TabsList {
    var displayName: string;
}
interface TabsTabProps {
    id: string;
    disabled?: boolean;
    children: ReactNode;
    className?: string;
}
declare function TabsTab({ id, disabled, children, className }: TabsTabProps): react_jsx_runtime.JSX.Element;
declare namespace TabsTab {
    var displayName: string;
}
interface TabsPanelsProps {
    children: ReactNode;
    className?: string;
}
declare function TabsPanels({ children, className }: TabsPanelsProps): react_jsx_runtime.JSX.Element;
declare namespace TabsPanels {
    var displayName: string;
}
interface TabsPanelProps {
    id: string;
    children: ReactNode;
    className?: string;
}
declare function TabsPanel({ id, children, className }: TabsPanelProps): react_jsx_runtime.JSX.Element | null;
declare namespace TabsPanel {
    var displayName: string;
}
declare const Tabs: typeof TabsSimple & {
    Root: typeof TabsRoot;
    List: typeof TabsList;
    Tab: typeof TabsTab;
    Panels: typeof TabsPanels;
    Panel: typeof TabsPanel;
};

/**
 * Pagination Component
 * Page navigation with ellipsis truncation. Props-only API.
 * Uses inline SVGs instead of lucide-react.
 */
interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
    maxButtons?: number;
    className?: string;
}
declare function Pagination({ page, totalPages, onChange, maxButtons, className, }: PaginationProps): react_jsx_runtime.JSX.Element | null;

/**
 * DateRangePicker Component
 * From/to date input pair with calendar icons. Props-only API.
 * Uses inline SVG instead of lucide-react Calendar.
 */
interface DateRangePickerProps {
    from: string;
    to: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
    className?: string;
}
declare function DateRangePicker({ from, to, onFromChange, onToChange, className, }: DateRangePickerProps): react_jsx_runtime.JSX.Element;

export { ComboSelect, type ComboSelectOption, type ComboSelectProps, DateRangePicker, type DateRangePickerProps, Dropdown, DropdownDivider, DropdownItem, type DropdownItemProps, type DropdownProps, IconSelect, type IconSelectOption, type IconSelectProps, MultiIconSelect, type MultiIconSelectPreset, type MultiIconSelectProps, Pagination, type PaginationProps, type Tab, Tabs, type TabsListProps, type TabsPanelProps, type TabsPanelsProps, type TabsProps, type TabsRootProps, type TabsTabProps };
