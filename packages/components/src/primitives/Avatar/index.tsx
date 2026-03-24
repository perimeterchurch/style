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
import { avatarSizeClass, type AvatarSize } from './Avatar.variants';

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
        const showFallback = !showImage;

        return (
            <div
                ref={ref}
                role={showFallback ? 'img' : undefined}
                aria-label={showFallback ? (alt || 'Avatar') : undefined}
                className={cn('avatar', avatarSizeClass[size], className)}
                {...props}
            >
                {showImage ? (
                    <img src={src} alt={alt} onError={() => setImageError(true)} />
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

export { avatarSizeClass, type AvatarSize };
