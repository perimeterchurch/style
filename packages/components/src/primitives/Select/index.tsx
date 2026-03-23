/**
 * Select Component
 * Native select dropdown with custom styling.
 * Supports both simple API and compound API (Select.Root, Select.Field).
 */

import * as React from 'react';
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
    selectBaseClasses,
    selectSizeClasses,
    selectTextSizes,
    getSelectBorderClasses,
    type SelectSize,
} from './Select.variants';

type SelectElement = ElementRef<'select'>;

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps
    extends Omit<ComponentPropsWithoutRef<'select'>, 'size'>, BaseComponentProps, WidthProps {
    /** Predefined options (alternative to children) */
    options?: SelectOption[];
    /** Input size */
    size?: SelectSize;
    /** Show error state */
    error?: boolean;
}

/** Inline chevron-down SVG (replaces lucide-react ChevronDown) */
function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

// --- Simple API ---

const SimpleSelect = forwardRef<SelectElement, SelectProps>(
    (
        {
            className,
            options,
            size = 'md',
            error = false,
            fullWidth = false,
            disabled,
            children,
            onKeyDown,
            ...props
        },
        ref,
    ) => {
        return (
            <div className={cn('relative', fullWidth ? 'w-full' : 'w-auto')}>
                <select
                    ref={ref}
                    disabled={disabled}
                    aria-invalid={error}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') e.currentTarget.blur();
                        onKeyDown?.(e);
                    }}
                    className={cn(
                        selectBaseClasses,
                        'cursor-pointer',
                        selectSizeClasses[size],
                        selectTextSizes[size],
                        getSelectBorderClasses(error),
                        fullWidth ? 'w-full' : 'w-auto',
                        'appearance-none',
                        'pr-9',
                        className,
                    )}
                    {...props}
                >
                    {options
                        ? options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                  {opt.label}
                              </option>
                          ))
                        : children}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-stone-400)]" />
            </div>
        );
    },
);

SimpleSelect.displayName = 'Select';

// --- Compound API ---

interface SelectContextValue {
    size: SelectSize;
    error: boolean;
    fullWidth: boolean;
    disabled: boolean;
}

const SelectContext = createContext<SelectContextValue>({
    size: 'md',
    error: false,
    fullWidth: false,
    disabled: false,
});

export interface SelectRootProps extends BaseComponentProps, WidthProps {
    /** Input size */
    size?: SelectSize;
    /** Show error state */
    error?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Children */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
}

const SelectRoot = forwardRef<HTMLDivElement, SelectRootProps>(
    (
        {
            size = 'md',
            error = false,
            fullWidth = false,
            disabled = false,
            className,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <SelectContext.Provider value={{ size, error, fullWidth, disabled }}>
                <div
                    ref={ref}
                    className={cn('flex flex-col gap-1', fullWidth && 'w-full', className)}
                    {...props}
                >
                    {children}
                </div>
            </SelectContext.Provider>
        );
    },
);

SelectRoot.displayName = 'Select.Root';

const SelectField = forwardRef<
    SelectElement,
    Omit<ComponentPropsWithoutRef<'select'>, 'size'> &
        BaseComponentProps & { options?: SelectOption[] }
>(({ className, options, children, onKeyDown, disabled: disabledProp, ...props }, ref) => {
    const ctx = useContext(SelectContext);
    const isDisabled = disabledProp ?? ctx.disabled;

    return (
        <div className={cn('relative', ctx.fullWidth ? 'w-full' : 'w-auto')}>
            <select
                ref={ref}
                disabled={isDisabled}
                aria-invalid={ctx.error}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') e.currentTarget.blur();
                    onKeyDown?.(e);
                }}
                className={cn(
                    selectBaseClasses,
                    'cursor-pointer',
                    selectSizeClasses[ctx.size],
                    selectTextSizes[ctx.size],
                    getSelectBorderClasses(ctx.error),
                    ctx.fullWidth ? 'w-full' : 'w-auto',
                    'appearance-none',
                    'pr-9',
                    className,
                )}
                {...props}
            >
                {options
                    ? options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                              {opt.label}
                          </option>
                      ))
                    : children}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-stone-400)]" />
        </div>
    );
});

SelectField.displayName = 'Select.Field';

// Attach compound parts
export const Select = Object.assign(SimpleSelect, {
    Root: SelectRoot,
    Field: SelectField,
});

export {
    selectBaseClasses,
    selectSizeClasses,
    selectTextSizes,
    getSelectBorderClasses,
    type SelectSize,
};
