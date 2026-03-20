/**
 * LoadingSpinner Component
 * Animated circular spinner for loading states
 */

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { spinnerSizeClasses, type SpinnerSize } from './LoadingSpinner.variants';

type SpinnerElement = ElementRef<'div'>;

export interface LoadingSpinnerProps extends ComponentPropsWithoutRef<'div'>, BaseComponentProps {
    /** Spinner size */
    size?: SpinnerSize;
    /** Optional label for screen readers */
    label?: string;
}

/**
 * Inline SVG spinner icon (replaces lucide-react Loader2)
 */
function SpinnerIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}

export const LoadingSpinner = forwardRef<SpinnerElement, LoadingSpinnerProps>(
    ({ size = 'md', label = 'Loading', className, 'aria-label': ariaLabel, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="status"
                aria-label={ariaLabel ?? label}
                className={cn('inline-block', className)}
                {...props}
            >
                <SpinnerIcon
                    className={cn(
                        'animate-spin text-[var(--color-primary)]',
                        spinnerSizeClasses[size],
                    )}
                />
                <span className="sr-only">{label}</span>
            </div>
        );
    },
);

LoadingSpinner.displayName = 'LoadingSpinner';

export { spinnerSizeClasses, type SpinnerSize };
