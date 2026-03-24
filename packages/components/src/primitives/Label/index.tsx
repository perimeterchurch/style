/**
 * Label Component
 * Form label with proper association and required indicator
 */

import * as React from 'react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { labelVariantClass, type LabelVariant } from './Label.variants';

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
        { className, children, required = false, disabled = false, variant = 'default', ...props },
        ref,
    ) => {
        return (
            <label
                ref={ref}
                className={cn(
                    'label',
                    labelVariantClass[variant],
                    required && 'label-required',
                    disabled && 'opacity-70 cursor-not-allowed',
                    className,
                )}
                {...props}
            >
                {children}
                {required && <span className="sr-only">(required)</span>}
            </label>
        );
    },
);

Label.displayName = 'Label';

export { labelVariantClass, type LabelVariant };
