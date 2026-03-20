/**
 * IndeterminateProgress Component
 * A thin animated progress bar for loading states.
 * Uses CSS animation instead of framer-motion for zero dependencies.
 * Parent element must have `position: relative` for correct positioning.
 */

import { forwardRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { progressVariants, type ProgressVariant } from './IndeterminateProgress.variants';

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
            className={cn(progressVariants[variant].base, className)}
            {...props}
        >
            <div
                className="h-full w-1/3 bg-[var(--color-primary)] animate-indeterminate"
                style={{
                    animation: 'indeterminate-slide 1.5s ease-in-out infinite',
                }}
            />
            <style>{`
                @keyframes indeterminate-slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(400%); }
                }
            `}</style>
        </div>
    );
});

IndeterminateProgress.displayName = 'IndeterminateProgress';

export { progressVariants, type ProgressVariant };
