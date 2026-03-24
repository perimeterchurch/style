/**
 * IndeterminateProgress Component
 * A thin animated progress bar for loading states.
 * Uses CSS animation instead of framer-motion for zero dependencies.
 * Parent element must have `position: relative` for correct positioning.
 */

import * as React from 'react';
import { forwardRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { progressVariantClass, type ProgressVariant } from './IndeterminateProgress.variants';

type IndeterminateProgressElement = ElementRef<'div'>;

export interface IndeterminateProgressProps extends BaseComponentProps {
    /** Whether the progress bar is visible */
    visible: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Visual variant */
    variant?: ProgressVariant;
}

export const IndeterminateProgress = forwardRef<
    IndeterminateProgressElement,
    IndeterminateProgressProps
>(({ visible, variant = 'default', className, ...props }, ref) => {
    if (!visible) return null;

    return (
        <div
            ref={ref}
            role="progressbar"
            aria-label="Loading"
            className={cn('indeterminate-progress', progressVariantClass[variant], className)}
            {...props}
        >
            <div className="indeterminate-progress-bar" />
        </div>
    );
});

IndeterminateProgress.displayName = 'IndeterminateProgress';

export { progressVariantClass, type ProgressVariant };
