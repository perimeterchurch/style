/**
 * Avatar Component
 * User profile image with fallback initials
 */

import * as React from 'react';
import {
    forwardRef,
    useState,
    type ComponentPropsWithoutRef,
    type ElementRef,
    type ReactNode,
} from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { avatarSizeClasses, type AvatarSize } from './Avatar.variants';

type AvatarElement = ElementRef<'div'>;

export interface AvatarProps
    extends Omit<ComponentPropsWithoutRef<'div'>, 'children'>, BaseComponentProps {
    /** Image source URL */
    src?: string;
    /** Alt text for image */
    alt?: string;
    /** Fallback initials, text, or icon element */
    fallback?: ReactNode;
    /** Avatar size */
    size?: AvatarSize;
}

export const Avatar = forwardRef<AvatarElement, AvatarProps>(
    ({ src, alt = '', fallback = '?', size = 'md', className, ...props }, ref) => {
        const [imageError, setImageError] = useState(false);
        const showImage = src && !imageError;

        return (
            <div
                ref={ref}
                className={cn(
                    'relative inline-flex items-center justify-center',
                    'rounded-full overflow-hidden',
                    'bg-[var(--color-stone-200)] text-[var(--color-stone-600)]',
                    'dark:bg-[var(--color-stone-700)] dark:text-[var(--color-stone-300)]',
                    'font-medium select-none shrink-0',
                    'transition-all duration-200',
                    avatarSizeClasses[size],
                    className,
                )}
                {...props}
            >
                {showImage ? (
                    <img
                        src={src}
                        alt={alt}
                        onError={() => setImageError(true)}
                        className="h-full w-full object-cover"
                    />
                ) : typeof fallback === 'string' ? (
                    <span className="uppercase">{fallback}</span>
                ) : (
                    fallback
                )}
            </div>
        );
    },
);

Avatar.displayName = 'Avatar';

export { avatarSizeClasses, type AvatarSize };
