/**
 * MultiIconSelect Component
 * Multi-select dropdown using Headless UI Listbox with checkmark indicators.
 * Icons are provided via ReactNode props (no lucide-react dependency).
 */

import * as React from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import type { IconSelectOption } from '../IconSelect';
import {
    multiIconSelectButtonClasses,
    multiIconSelectPopoverClasses,
    multiIconSelectOptionClasses,
    multiIconSelectPresetClasses,
} from './MultiIconSelect.variants';

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

export interface MultiIconSelectPreset<T extends string | number = string> {
    label: string;
    icon?: ReactNode;
    values: T[];
}

export interface MultiIconSelectProps<T extends string | number = string> {
    value: T[];
    onChange: (value: T[]) => void;
    options: IconSelectOption<T>[];
    placeholder?: string;
    placeholderIcon?: ReactNode;
    presets?: MultiIconSelectPreset<T>[];
    fullWidth?: boolean;
    className?: string;
}

export function MultiIconSelect<T extends string | number = string>({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    placeholderIcon,
    presets,
    fullWidth = false,
    className,
}: MultiIconSelectProps<T>) {
    return (
        <Listbox value={value} onChange={onChange} multiple>
            <div className={cn('relative', fullWidth && 'w-full', className)}>
                <ListboxButton
                    className={cn(multiIconSelectButtonClasses, fullWidth ? 'w-full' : 'w-auto')}
                >
                    {placeholderIcon && (
                        <span className="flex shrink-0 items-center text-[var(--color-text-muted)]">
                            {placeholderIcon}
                        </span>
                    )}
                    <span
                        className={cn(
                            'flex-1 truncate text-left',
                            value.length === 0
                                ? 'text-[var(--color-text-muted)]'
                                : 'text-[var(--color-foreground)]',
                        )}
                    >
                        {value.length === 0 ? placeholder : `${placeholder} (${value.length})`}
                    </span>
                    <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
                </ListboxButton>

                <ListboxOptions
                    transition
                    anchor="bottom start"
                    className={multiIconSelectPopoverClasses}
                >
                    {presets?.map((preset) => {
                        const presetSet = new Set(preset.values.map(String));
                        const valueSet = new Set(value.map(String));
                        const isActive =
                            presetSet.size > 0 &&
                            presetSet.size === valueSet.size &&
                            [...presetSet].every((v) => valueSet.has(v));
                        return (
                            <button
                                key={`preset-${preset.label}`}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onChange(isActive ? [] : [...preset.values]);
                                }}
                                className={multiIconSelectPresetClasses}
                            >
                                {preset.icon && (
                                    <span className="flex shrink-0 items-center">
                                        {preset.icon}
                                    </span>
                                )}
                                <span
                                    className={cn(
                                        'flex-1 truncate text-left',
                                        isActive && 'font-medium',
                                    )}
                                >
                                    {preset.label}
                                </span>
                                {isActive && (
                                    <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
                                )}
                            </button>
                        );
                    })}
                    {presets && presets.length > 0 && (
                        <div className="my-1 border-t border-[var(--color-border)]" />
                    )}
                    {options.map((option) => (
                        <ListboxOption
                            key={String(option.value)}
                            value={option.value}
                            className={multiIconSelectOptionClasses}
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
