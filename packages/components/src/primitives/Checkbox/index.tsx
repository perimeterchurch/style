/**
 * Checkbox Component
 * Checkbox input with custom styling and accessibility features
 */

import * as React from 'react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { checkboxSizeClass, type CheckboxSize } from './Checkbox.variants';

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
                    'checkbox',
                    checkboxSizeClass[size],
                    error && 'checkbox-error',
                    !label && className,
                )}
                {...props}
            />
        );

        if (label) {
            return (
                <div className={cn('checkbox-box', className)}>
                    {checkbox}
                    <label
                        htmlFor={checkboxId}
                        className={cn(
                            'cursor-pointer select-none',
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

export { checkboxSizeClass, type CheckboxSize };
