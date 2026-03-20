/**
 * EmptyState Component
 * Display component for empty states with optional action
 */

import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ElementRef,
    type ReactNode,
} from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { emptyStateVariants, type EmptyStateVariant } from './EmptyState.variants';

type EmptyStateElement = ElementRef<'div'>;

export interface EmptyStateProps
    extends ComponentPropsWithoutRef<'div'>,
        BaseComponentProps {
    /** Icon or illustration */
    icon?: ReactNode;
    /** Title text */
    title: string;
    /** Description text */
    description?: string;
    /** Optional action button */
    action?: ReactNode;
    /** Visual variant */
    variant?: EmptyStateVariant;
}

export const EmptyState = forwardRef<EmptyStateElement, EmptyStateProps>(
    (
        {
            icon,
            title,
            description,
            action,
            variant = 'default',
            className,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <div
                ref={ref}
                className={cn(emptyStateVariants[variant].base, className)}
                {...props}
            >
                {icon && (
                    <div
                        className="mb-4 text-stone-400 dark:text-stone-500"
                        aria-hidden="true"
                    >
                        {icon}
                    </div>
                )}
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 max-w-sm">
                        {description}
                    </p>
                )}
                {action && <div className="mt-2">{action}</div>}
                {children}
            </div>
        );
    },
);

EmptyState.displayName = 'EmptyState';

export { emptyStateVariants, type EmptyStateVariant };
