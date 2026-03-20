/**
 * Label Component
 * Form label with proper association and required indicator
 */

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { labelVariants, type LabelVariant } from './Label.variants';

type LabelElement = ElementRef<'label'>;

export interface LabelProps extends ComponentPropsWithoutRef<'label'>, BaseComponentProps {
    /** Show required indicator */
    required?: boolean;
    /** Disabled state (visual only) */
    disabled?: boolean;
    /** Visual variant */
    variant?: LabelVariant;
}

export const Label = forwardRef<LabelElement, LabelProps>(
    (
        {
            className,
            children,
            required = false,
            disabled = false,
            variant = 'default',
            ...props
        },
        ref,
    ) => {
        return (
            <label
                ref={ref}
                className={cn(
                    labelVariants[variant].base,
                    'cursor-pointer',
                    'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    disabled && 'opacity-70 cursor-not-allowed',
                    className,
                )}
                {...props}
            >
                {children}
                {required && (
                    <>
                        <span className="text-[var(--color-error)] ml-1" aria-hidden="true">
                            *
                        </span>
                        <span className="sr-only">(required)</span>
                    </>
                )}
            </label>
        );
    },
);

Label.displayName = 'Label';

export { labelVariants, type LabelVariant };
