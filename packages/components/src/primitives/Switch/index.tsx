/**
 * Switch Component
 * Toggle switch with custom styling and accessibility features
 */

import * as React from 'react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { switchSizeClasses, switchLabelSizeClasses, type SwitchSize } from './Switch.variants';

type SwitchElement = ElementRef<'input'>;

export interface SwitchProps
    extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'>, BaseComponentProps {
    /** Associated label text */
    label?: string;
    /** Switch size */
    size?: SwitchSize;
}

export const Switch = forwardRef<SwitchElement, SwitchProps>(
    ({ className, label, size = 'md', disabled, id, ...props }, ref) => {
        const switchId =
            id || (label ? `switch-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
        const sizeConfig = switchSizeClasses[size];

        const switchInput = (
            <input
                ref={ref}
                type="checkbox"
                role="switch"
                id={switchId}
                disabled={disabled}
                className={cn(
                    'relative shrink-0 appearance-none rounded-full',
                    'transition-colors duration-200 cursor-pointer',
                    'active:scale-95',
                    sizeConfig.track,
                    'bg-[var(--color-stone-300)] checked:bg-[var(--color-primary)]',
                    'dark:bg-[var(--color-stone-600)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'before:content-[""] before:absolute before:top-[2px] before:left-[2px]',
                    'before:rounded-full before:bg-[var(--color-background)]',
                    'before:transition-transform before:duration-200',
                    'before:shadow-sm',
                    sizeConfig.knob,
                    sizeConfig.translate,
                    !label && className,
                )}
                {...props}
            />
        );

        if (label) {
            return (
                <div className={cn('inline-flex items-center gap-2', className)}>
                    {switchInput}
                    <label
                        htmlFor={switchId}
                        className={cn(
                            'cursor-pointer select-none',
                            'text-[var(--color-stone-700)] dark:text-[var(--color-stone-300)]',
                            switchLabelSizeClasses[size],
                            disabled && 'cursor-not-allowed opacity-50',
                        )}
                    >
                        {label}
                    </label>
                </div>
            );
        }

        return switchInput;
    },
);

Switch.displayName = 'Switch';

export { switchSizeClasses, switchLabelSizeClasses, type SwitchSize };
