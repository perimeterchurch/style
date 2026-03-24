import * as React from 'react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import type { InteractiveProps, WidthProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import {
    buttonVariantClass,
    buttonSizeClass,
    buttonIconSize,
    type ButtonVariant,
    type ButtonSize,
} from './Button.variants';

type ButtonElement = ElementRef<'button'>;

export interface ButtonProps
    extends Omit<ComponentPropsWithoutRef<'button'>, 'disabled'>, InteractiveProps, WidthProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: 'button' | 'submit' | 'reset';
    outline?: boolean;
}

// Loading spinner SVG (no lucide-react dependency)
function LoadingSpinner() {
    return (
        <svg
            className="animate-spin h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}

// Shared helper to build button className
function getButtonClassName(
    variant: ButtonVariant,
    size: ButtonSize,
    outline: boolean,
    fullWidth: boolean,
    className?: string,
) {
    return cn(
        'btn',
        buttonVariantClass[variant],
        buttonSizeClass[size],
        outline && 'btn-outline',
        fullWidth && 'w-full',
        className,
    );
}

// --- Shared render function ---

function renderButton(
    {
        variant = 'primary',
        size = 'md',
        type = 'button',
        fullWidth = false,
        outline = false,
        disabled = false,
        isLoading = false,
        className,
        children,
        'aria-label': ariaLabel,
        ...props
    }: ButtonProps,
    ref: React.ForwardedRef<ButtonElement>,
) {
    const isDisabled = disabled || isLoading;

    return (
        <button
            ref={ref}
            type={type}
            disabled={isDisabled}
            aria-label={ariaLabel}
            aria-busy={isLoading}
            className={getButtonClassName(variant, size, outline, fullWidth, className)}
            {...props}
        >
            {isLoading && <LoadingSpinner />}
            {children}
        </button>
    );
}

// --- Simple API ---

const SimpleButton = forwardRef<ButtonElement, ButtonProps>(renderButton);

SimpleButton.displayName = 'Button';

// --- Compound API ---

const ButtonRoot = forwardRef<ButtonElement, ButtonProps>(renderButton);

ButtonRoot.displayName = 'Button.Root';

function ButtonIcon({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <span className={cn('inline-flex shrink-0', className)} aria-hidden="true">
            {children}
        </span>
    );
}

ButtonIcon.displayName = 'Button.Icon';

function ButtonLabel({ children, className }: { children: ReactNode; className?: string }) {
    return <span className={className}>{children}</span>;
}

ButtonLabel.displayName = 'Button.Label';

// Attach compound parts
export const Button = Object.assign(SimpleButton, {
    Root: ButtonRoot,
    Icon: ButtonIcon,
    Label: ButtonLabel,
});

export { buttonVariantClass, buttonSizeClass, buttonIconSize, type ButtonVariant, type ButtonSize };
