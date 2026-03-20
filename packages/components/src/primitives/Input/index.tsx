/**
 * Input Component
 * Text input field with error states, sizes, and accessibility features.
 * Supports both simple API and compound API (Input.Root, Input.Field, Input.Error).
 */

import {
    forwardRef,
    createContext,
    useContext,
    type ComponentPropsWithoutRef,
    type ElementRef,
    type ReactNode,
} from 'react';
import type { BaseComponentProps, WidthProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import {
    inputBaseClasses,
    inputSizeClasses,
    inputTextSizes,
    getInputBorderClasses,
    type InputSize,
} from './Input.variants';

type InputElement = ElementRef<'input'>;

export interface InputProps
    extends Omit<ComponentPropsWithoutRef<'input'>, 'size'>, BaseComponentProps, WidthProps {
    /** Input size */
    size?: InputSize;
    /** Error message (truthy value triggers error state) */
    error?: string;
}

// --- Simple API ---

const SimpleInput = forwardRef<InputElement, InputProps>(
    ({ className, size = 'md', error, fullWidth = false, disabled, onKeyDown, ...props }, ref) => {
        const hasError = Boolean(error);

        return (
            <input
                ref={ref}
                disabled={disabled}
                aria-invalid={hasError}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') e.currentTarget.blur();
                    onKeyDown?.(e);
                }}
                className={cn(
                    inputBaseClasses,
                    'placeholder:text-[var(--color-stone-400)] dark:placeholder:text-[var(--color-stone-500)]',
                    inputSizeClasses[size],
                    inputTextSizes[size],
                    getInputBorderClasses(hasError),
                    fullWidth ? 'w-full' : 'w-auto',
                    className,
                )}
                {...props}
            />
        );
    },
);

SimpleInput.displayName = 'Input';

// --- Compound API ---

interface InputContextValue {
    size: InputSize;
    error?: string;
    fullWidth: boolean;
    disabled: boolean;
}

const InputContext = createContext<InputContextValue>({
    size: 'md',
    error: undefined,
    fullWidth: false,
    disabled: false,
});

export interface InputRootProps extends BaseComponentProps, WidthProps {
    /** Input size */
    size?: InputSize;
    /** Error message */
    error?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Children */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
}

const InputRoot = forwardRef<HTMLDivElement, InputRootProps>(
    (
        { size = 'md', error, fullWidth = false, disabled = false, className, children, ...props },
        ref,
    ) => {
        return (
            <InputContext.Provider value={{ size, error, fullWidth, disabled }}>
                <div
                    ref={ref}
                    className={cn('flex flex-col gap-1', fullWidth && 'w-full', className)}
                    {...props}
                >
                    {children}
                </div>
            </InputContext.Provider>
        );
    },
);

InputRoot.displayName = 'Input.Root';

const InputField = forwardRef<
    InputElement,
    Omit<ComponentPropsWithoutRef<'input'>, 'size'> & BaseComponentProps
>(({ className, onKeyDown, disabled: disabledProp, ...props }, ref) => {
    const ctx = useContext(InputContext);
    const hasError = Boolean(ctx.error);
    const isDisabled = disabledProp ?? ctx.disabled;

    return (
        <input
            ref={ref}
            disabled={isDisabled}
            aria-invalid={hasError}
            onKeyDown={(e) => {
                if (e.key === 'Escape') e.currentTarget.blur();
                onKeyDown?.(e);
            }}
            className={cn(
                inputBaseClasses,
                'placeholder:text-[var(--color-stone-400)] dark:placeholder:text-[var(--color-stone-500)]',
                inputSizeClasses[ctx.size],
                inputTextSizes[ctx.size],
                getInputBorderClasses(hasError),
                ctx.fullWidth ? 'w-full' : 'w-auto',
                className,
            )}
            {...props}
        />
    );
});

InputField.displayName = 'Input.Field';

function InputError({ className, children }: { className?: string; children?: ReactNode }) {
    const ctx = useContext(InputContext);
    const message = children ?? ctx.error;
    if (!message) return null;

    return (
        <p className={cn('text-sm text-[var(--color-error)]', className)} role="alert">
            {message}
        </p>
    );
}

InputError.displayName = 'Input.Error';

// Attach compound parts
export const Input = Object.assign(SimpleInput, {
    Root: InputRoot,
    Field: InputField,
    Error: InputError,
});

export {
    inputBaseClasses,
    inputSizeClasses,
    inputTextSizes,
    getInputBorderClasses,
    type InputSize,
};
