/**
 * Textarea Component
 * Multi-line text input with error states and accessibility features
 */

import * as React from 'react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps, WidthProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import { textareaSizeClass, type TextareaSize } from './Textarea.variants';

type TextareaElement = ElementRef<'textarea'>;

export interface TextareaProps
    extends ComponentPropsWithoutRef<'textarea'>, BaseComponentProps, WidthProps {
    /** Input size */
    size?: TextareaSize;
    /** Show error state */
    error?: boolean;
}

export const Textarea = forwardRef<TextareaElement, TextareaProps>(
    (
        { className, size = 'md', error = false, fullWidth = false, disabled, onKeyDown, ...props },
        ref,
    ) => {
        return (
            <textarea
                ref={ref}
                disabled={disabled}
                aria-invalid={error}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') e.currentTarget.blur();
                    onKeyDown?.(e);
                }}
                className={cn(
                    'form-control',
                    'textarea',
                    textareaSizeClass[size],
                    error && 'form-control-error',
                    fullWidth ? 'w-full' : 'w-auto',
                    className,
                )}
                {...props}
            />
        );
    },
);

Textarea.displayName = 'Textarea';

export { textareaSizeClass, type TextareaSize };
