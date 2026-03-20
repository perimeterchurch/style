/**
 * Badge Component
 * Status indicators, labels, and tags with variant colors
 */

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import {
    badgeVariants,
    badgeDotColors,
    badgeSizes,
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
        const variantDef = badgeVariants[variant];
        const sizeDef = badgeSizes[size];

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-full font-medium',
                    'transition-colors duration-200',
                    outline && variantDef.outline ? variantDef.outline : variantDef.base,
                    sizeDef.padding,
                    sizeDef.fontSize,
                    className,
                )}
                {...props}
            >
                {dot && (
                    <span
                        className={cn(
                            'h-1.5 w-1.5 rounded-full shrink-0',
                            badgeDotColors[variant],
                        )}
                        aria-hidden="true"
                    />
                )}
                {children}
            </span>
        );
    },
);

Badge.displayName = 'Badge';

export { badgeVariants, badgeDotColors, badgeSizes, type BadgeVariant, type BadgeSize };
