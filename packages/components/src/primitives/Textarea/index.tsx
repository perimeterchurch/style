/**
 * Textarea Component
 * Multi-line text input with error states and accessibility features
 */

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps, WidthProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import {
    textareaBaseClasses,
    textareaTextSizes,
    getTextareaBorderClasses,
    type TextareaSize,
} from './Textarea.variants';

type TextareaElement = ElementRef<'textarea'>;

export interface TextareaProps
    extends ComponentPropsWithoutRef<'textarea'>,
        BaseComponentProps,
        WidthProps {
    /** Input size */
    size?: TextareaSize;
    /** Show error state */
    error?: boolean;
}

export const Textarea = forwardRef<TextareaElement, TextareaProps>(
    (
        {
            className,
            size = 'md',
            error = false,
            fullWidth = false,
            disabled,
            onKeyDown,
            ...props
        },
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
                    textareaBaseClasses,
                    'min-h-[80px] px-3 py-2',
                    'placeholder:text-stone-400 dark:placeholder:text-stone-500',
                    'resize-y',
                    textareaTextSizes[size],
                    getTextareaBorderClasses(error),
                    fullWidth ? 'w-full' : 'w-auto',
                    className,
                )}
                {...props}
            />
        );
    },
);

Textarea.displayName = 'Textarea';

export { textareaBaseClasses, textareaTextSizes, getTextareaBorderClasses, type TextareaSize };
