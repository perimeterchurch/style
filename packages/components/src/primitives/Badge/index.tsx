/**
 * Badge Component
 * Status indicators, labels, and tags with variant colors
 */

import * as React from 'react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import {
    badgeVariantClass,
    badgeSizeClass,
    type BadgeVariant,
    type BadgeSize,
} from './Badge.variants';

type BadgeElement = ElementRef<'span'>;

export interface BadgeProps extends ComponentPropsWithoutRef<'span'>, BaseComponentProps {
    /** Visual variant */
    variant?: BadgeVariant;
    /** Badge size */
    size?: BadgeSize;
    /** Show a colored dot before the label */
    dot?: boolean;
    /** Outline style instead of filled */
    outline?: boolean;
}

export const Badge = forwardRef<BadgeElement, BadgeProps>(
    (
        {
            variant = 'secondary',
            size = 'md',
            dot = false,
            outline = false,
            className,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <span
                ref={ref}
                className={cn(
                    'badge',
                    badgeVariantClass[variant],
                    badgeSizeClass[size],
                    outline && 'badge-outline',
                    dot && 'badge-dot',
                    className,
                )}
                {...props}
            >
                {children}
            </span>
        );
    },
);

Badge.displayName = 'Badge';

export { badgeVariantClass, badgeSizeClass, type BadgeVariant, type BadgeSize };
