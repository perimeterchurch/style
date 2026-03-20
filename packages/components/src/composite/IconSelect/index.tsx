/**
 * IconSelect Component
 * Custom select dropdown using Headless UI Listbox with icon support.
 * Icons are provided via ReactNode props (no lucide-react dependency).
 */

import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import {
    iconSelectButtonClasses,
    iconSelectPopoverClasses,
    iconSelectOptionClasses,
} from './IconSelect.variants';

// --- Inline SVGs ---

function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

// --- Types ---

export interface IconSelectOption<T extends string | number = string> {
    value: T;
    label: string;
    icon?: ReactNode;
}

export interface IconSelectProps<T extends string | number = string> {
    value: T;
    onChange: (value: T) => void;
    options: IconSelectOption<T>[];
    placeholder?: string;
    fullWidth?: boolean;
    className?: string;
}

export function IconSelect<T extends string | number = string>({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    fullWidth = false,
    className,
}: IconSelectProps<T>) {
    const selected = options.find((o) => o.value === value);

    return (
        <Listbox value={value} onChange={onChange}>
            <div className={cn('relative', fullWidth && 'w-full', className)}>
                <ListboxButton
                    className={cn(
                        iconSelectButtonClasses,
                        fullWidth ? 'w-full' : 'w-auto',
                    )}
                >
                    {selected ? (
                        <>
                            {selected.icon && (
                                <span className="flex shrink-0 items-center">
                                    {selected.icon}
                                </span>
                            )}
                            <span className="flex-1 truncate text-left text-[var(--color-foreground)]">
                                {selected.label}
                            </span>
                        </>
                    ) : (
                        <span className="flex-1 truncate text-left text-[var(--color-text-muted)]">
                            {placeholder}
                        </span>
                    )}
                    <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
                </ListboxButton>

                <ListboxOptions transition className={iconSelectPopoverClasses}>
                    {options.map((option) => (
                        <ListboxOption
                            key={String(option.value)}
                            value={option.value}
                            className={iconSelectOptionClasses}
                        >
                            {({ selected: isSelected }) => (
                                <>
                                    {option.icon && (
                                        <span className="flex shrink-0 items-center">
                                            {option.icon}
                                        </span>
                                    )}
                                    <span
                                        className={cn(
                                            'flex-1 truncate',
                                            isSelected && 'font-medium',
                                        )}
                                    >
                                        {option.label}
                                    </span>
                                    {isSelected && (
                                        <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
                                    )}
                                </>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}
