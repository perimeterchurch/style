/**
 * Checkbox Component
 * Checkbox input with custom styling and accessibility features
 */

import * as React from 'react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import {
    checkboxSizeClasses,
    checkboxLabelSizeClasses,
    type CheckboxSize,
} from './Checkbox.variants';

type CheckboxElement = ElementRef<'input'>;

export interface CheckboxProps
    extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'>, BaseComponentProps {
    /** Show error state */
    error?: boolean;
    /** Associated label text */
    label?: string;
    /** Checkbox size */
    size?: CheckboxSize;
}

/** Base64-encoded checkmark SVG for checked state */
const CHECKMARK_SVG =
    "checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDNMNC41IDguNUwyIDYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')]";

export const Checkbox = forwardRef<CheckboxElement, CheckboxProps>(
    ({ className, error = false, label, size = 'md', disabled, id, ...props }, ref) => {
        const checkboxId =
            id || (label ? `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

        const checkbox = (
            <input
                ref={ref}
                type="checkbox"
                id={checkboxId}
                disabled={disabled}
                aria-invalid={error}
                className={cn(
                    'rounded border-2 shrink-0',
                    'transition-all duration-200',
                    'active:scale-95',
                    checkboxSizeClasses[size],
                    error
                        ? 'border-[var(--color-error)]'
                        : 'border-[var(--color-stone-300)] dark:border-[var(--color-stone-600)]',
                    'checked:bg-[var(--color-primary)] checked:border-[var(--color-primary)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'appearance-none cursor-pointer',
                    CHECKMARK_SVG,
                    'checked:bg-center checked:bg-no-repeat',
                    !label && className,
                )}
                {...props}
            />
        );

        if (label) {
            return (
                <div className={cn('inline-flex items-center gap-2', className)}>
                    {checkbox}
                    <label
                        htmlFor={checkboxId}
                        className={cn(
                            'cursor-pointer select-none',
                            'text-[var(--color-stone-700)] dark:text-[var(--color-stone-300)]',
                            checkboxLabelSizeClasses[size],
                            disabled && 'cursor-not-allowed opacity-50',
                        )}
                    >
                        {label}
                    </label>
                </div>
            );
        }

        return checkbox;
    },
);

Checkbox.displayName = 'Checkbox';

export { checkboxSizeClasses, checkboxLabelSizeClasses, type CheckboxSize };
