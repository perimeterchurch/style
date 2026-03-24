/**
 * Dropdown/Menu Component
 * Dropdown menu using Headless UI with keyboard navigation and positioning.
 * Props-only API with Dropdown.Item and Dropdown.Divider subcomponents.
 */

import * as React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, type MenuItemsProps } from '@headlessui/react';
import { forwardRef, type ReactNode } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import {
    dropdownMenuClass,
    dropdownItemClass,
    dropdownItemDestructiveClass,
} from './Dropdown.variants';

export interface DropdownProps extends BaseComponentProps {
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

export interface DropdownItemProps extends BaseComponentProps {
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

const DropdownBase = forwardRef<HTMLDivElement, DropdownProps>(
    ({ trigger, children, align = 'right', anchor: anchorProp, className }, ref) => {
        const resolvedAnchor = anchorProp ?? (align === 'right' ? 'bottom end' : 'bottom start');
        return (
            <Menu as="div" className={cn('relative inline-block text-left', className)} ref={ref}>
                <MenuButton as="div">{trigger}</MenuButton>

                <MenuItems transition anchor={resolvedAnchor} className={dropdownMenuClass}>
                    <div className="py-1">{children}</div>
                </MenuItems>
            </Menu>
        );
    },
);

DropdownBase.displayName = 'Dropdown';

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
    ({ children, onClick, disabled = false, destructive = false, className }, ref) => {
        return (
            <MenuItem disabled={disabled}>
                <button
                    ref={ref}
                    onClick={onClick}
                    className={cn(
                        dropdownItemClass,
                        destructive && dropdownItemDestructiveClass,
                        disabled && 'cursor-not-allowed',
                        !disabled && 'cursor-pointer',
                        className,
                    )}
                >
                    {children}
                </button>
            </MenuItem>
        );
    },
);

DropdownItem.displayName = 'Dropdown.Item';

export function DropdownDivider() {
    return <div className="my-1 h-px bg-[var(--color-border)]" role="separator" />;
}

DropdownDivider.displayName = 'Dropdown.Divider';

interface DropdownComponent extends React.ForwardRefExoticComponent<
    DropdownProps & React.RefAttributes<HTMLDivElement>
> {
    Item: typeof DropdownItem;
    Divider: typeof DropdownDivider;
}

export const Dropdown = Object.assign(DropdownBase, {
    Item: DropdownItem,
    Divider: DropdownDivider,
}) as DropdownComponent;
