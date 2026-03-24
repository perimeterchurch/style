/**
 * Switch Component
 * Toggle switch with custom styling and accessibility features
 */

import * as React from 'react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { switchSizeClass, type SwitchSize } from './Switch.variants';

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

        const switchInput = (
            <input
                ref={ref}
                type="checkbox"
                role="switch"
                id={switchId}
                disabled={disabled}
                className={cn('switch', switchSizeClass[size], !label && className)}
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

export { switchSizeClass, type SwitchSize };
