/**
 * Skeleton Component
 * Flexible loading placeholder with shimmer effect
 */

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { skeletonVariants, type SkeletonVariant } from './Skeleton.variants';

type SkeletonElement = ElementRef<'div'>;

export interface SkeletonProps extends ComponentPropsWithoutRef<'div'>, BaseComponentProps {
    /** Shape variant */
    variant?: SkeletonVariant;
    /** Width (string or number in px) */
    width?: string | number;
    /** Height (string or number in px) */
    height?: string | number;
    /** Custom border radius */
    rounded?: string;
}

export const Skeleton = forwardRef<SkeletonElement, SkeletonProps>(
    ({ variant = 'line', width, height, rounded, className, style, ...props }, ref) => {
        return (
            <div
                ref={ref}
                aria-live="polite"
                aria-busy="true"
                className={cn(
                    'animate-shimmer',
                    rounded ?? skeletonVariants[variant].base,
                    className,
                )}
                style={{
                    width: typeof width === 'number' ? `${width}px` : width,
                    height: typeof height === 'number' ? `${height}px` : height,
                    ...style,
                }}
                {...props}
            />
        );
    },
);

Skeleton.displayName = 'Skeleton';

export { skeletonVariants, type SkeletonVariant };
