/**
 * EmptyState Component
 * Display component for empty states with optional action
 */

import * as React from 'react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { emptyStateVariantClass, type EmptyStateVariant } from './EmptyState.variants';

type EmptyStateElement = ElementRef<'div'>;

export interface EmptyStateProps extends ComponentPropsWithoutRef<'div'>, BaseComponentProps {
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
        { icon, title, description, action, variant = 'default', className, children, ...props },
        ref,
    ) => {
        return (
            <div
                ref={ref}
                className={cn('empty-state', emptyStateVariantClass[variant], className)}
                {...props}
            >
                {icon && (
                    <div className="empty-state-icon" aria-hidden="true">
                        {icon}
                    </div>
                )}
                <h3 className="empty-state-title">{title}</h3>
                {description && <p className="empty-state-description">{description}</p>}
                {action && <div className="empty-state-action">{action}</div>}
                {children}
            </div>
        );
    },
);

EmptyState.displayName = 'EmptyState';

export { emptyStateVariantClass, type EmptyStateVariant };
