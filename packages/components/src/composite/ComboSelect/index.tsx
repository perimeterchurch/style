/**
 * ComboSelect Component
 * Searchable combobox with single and multi-select support.
 * Compound API: ComboSelect.Root, ComboSelect.Input, ComboSelect.Options, ComboSelect.Option
 */

import * as React from 'react';
import { useState, useMemo, createContext, useContext, forwardRef, type ReactNode } from 'react';
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/react';
import { cn } from '../../utils/cn';
import {
    comboSelectInputClass,
    comboSelectOptionClass,
    comboSelectPopoverClass,
} from './ComboSelect.variants';

// --- Inline SVGs (replacing lucide-react) ---

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

function LoaderIcon({ className }: { className?: string }) {
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
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}

// --- Types ---

export interface ComboSelectOption<T extends string | number = string> {
    value: T;
    label: string;
    icon?: ReactNode;
}

interface ComboSelectBaseProps<T extends string | number = string> {
    options: ComboSelectOption<T>[];
    placeholder?: string;
    placeholderIcon?: ReactNode;
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    showAllOption?: boolean;
    allOptionLabel?: string;
    emptyText?: string;
    className?: string;
}

interface ComboSelectSingleProps<
    T extends string | number = string,
> extends ComboSelectBaseProps<T> {
    multiple?: false;
    value: T | '';
    onChange: (value: T | '') => void;
}

interface ComboSelectMultipleProps<
    T extends string | number = string,
> extends ComboSelectBaseProps<T> {
    multiple: true;
    value: T[];
    onChange: (value: T[]) => void;
}

export type ComboSelectProps<T extends string | number = string> =
    | ComboSelectSingleProps<T>
    | ComboSelectMultipleProps<T>;

// --- Simple (props-only) API ---

function ComboSelectSimple<T extends string | number = string>(props: ComboSelectProps<T>) {
    const {
        options,
        placeholder = 'Select...',
        placeholderIcon,
        fullWidth = false,
        loading = false,
        disabled = false,
        showAllOption = false,
        allOptionLabel = 'All',
        emptyText = 'No results found',
        className,
    } = props;

    const isMultiple = props.multiple === true;
    const [query, setQuery] = useState('');

    const allOptions: ComboSelectOption<T | ''>[] = useMemo(
        () => [
            ...(!isMultiple && showAllOption
                ? [{ value: '' as T | '', label: allOptionLabel }]
                : []),
            ...options,
        ],
        [options, showAllOption, allOptionLabel, isMultiple],
    );

    const filtered = useMemo(() => {
        if (!query) return allOptions;
        const lower = query.toLowerCase();
        return allOptions.filter((o) => o.label.toLowerCase().includes(lower));
    }, [allOptions, query]);

    const effectivePlaceholder = useMemo(() => {
        if (isMultiple) {
            const count = (props as ComboSelectMultipleProps<T>).value.length;
            return count === 0 ? placeholder : `${placeholder} (${count})`;
        }
        const selected = allOptions.find(
            (o) => o.value === (props as ComboSelectSingleProps<T>).value,
        );
        return selected?.label || placeholder;
    }, [isMultiple, props, allOptions, placeholder]);

    const innerContent = (
        <div className={cn('relative min-w-0', fullWidth && 'w-full')}>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                {loading ? (
                    <LoaderIcon className="h-3.5 w-3.5 animate-spin text-[var(--color-primary)]" />
                ) : placeholderIcon ? (
                    <span className="flex items-center text-[var(--color-text-muted)]">
                        {placeholderIcon}
                    </span>
                ) : null}
            </div>

            <ComboboxInput
                className={cn(
                    comboSelectInputClass,
                    placeholderIcon || loading ? 'pl-8' : 'pl-3',
                    'pr-8',
                    loading && 'opacity-70',
                    className,
                )}
                placeholder={effectivePlaceholder}
                displayValue={() => query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') e.currentTarget.blur();
                }}
            />

            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDownIcon className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            </ComboboxButton>

            <ComboboxOptions transition className={comboSelectPopoverClass}>
                {filtered.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-[var(--color-text-muted)]">
                        {emptyText}
                    </div>
                ) : (
                    filtered.map((option) => (
                        <ComboboxOption
                            key={String(option.value)}
                            value={option.value}
                            className={comboSelectOptionClass}
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
                        </ComboboxOption>
                    ))
                )}
            </ComboboxOptions>
        </div>
    );

    if (isMultiple) {
        return (
            <Combobox
                value={(props as ComboSelectMultipleProps<T>).value}
                onChange={(val) => {
                    (props as ComboSelectMultipleProps<T>).onChange(val);
                    setQuery('');
                }}
                multiple
                immediate
                disabled={disabled || loading}
            >
                {innerContent}
            </Combobox>
        );
    }

    const singleValue = (props as ComboSelectSingleProps<T>).value;
    const singleOnChange = (props as ComboSelectSingleProps<T>).onChange;

    return (
        <Combobox
            value={singleValue as string}
            onChange={(val: string | null) => {
                singleOnChange((val ?? '') as T | '');
                setQuery('');
            }}
            immediate
            disabled={disabled || loading}
        >
            {innerContent}
        </Combobox>
    );
}

ComboSelectSimple.displayName = 'ComboSelect';

// --- Compound API ---

interface ComboSelectContextValue {
    query: string;
    setQuery: (q: string) => void;
    loading: boolean;
    placeholderIcon?: ReactNode;
}

const ComboSelectContext = createContext<ComboSelectContextValue>({
    query: '',
    setQuery: () => {},
    loading: false,
});

function useComboSelectContext() {
    return useContext(ComboSelectContext);
}

export interface ComboSelectRootProps {
    value: string | number | (string | number)[] | '';
    onChange: (value: string | number | (string | number)[] | '') => void;
    multiple?: boolean;
    disabled?: boolean;
    loading?: boolean;
    placeholderIcon?: ReactNode;
    children: ReactNode;
    className?: string;
}

const ComboSelectRoot = forwardRef<HTMLDivElement, ComboSelectRootProps>(
    (
        {
            value,
            onChange,
            multiple = false,
            disabled = false,
            loading = false,
            placeholderIcon,
            children,
            className,
        },
        ref,
    ) => {
        const [query, setQuery] = useState('');

        return (
            <ComboSelectContext.Provider value={{ query, setQuery, loading, placeholderIcon }}>
                <Combobox
                    value={value as string}
                    onChange={(val: string | string[] | null) => {
                        onChange((val ?? '') as string | number | (string | number)[] | '');
                        setQuery('');
                    }}
                    multiple={multiple as false}
                    immediate
                    disabled={disabled || loading}
                >
                    <div ref={ref} className={cn('relative min-w-0', className)}>
                        {children}
                    </div>
                </Combobox>
            </ComboSelectContext.Provider>
        );
    },
);

ComboSelectRoot.displayName = 'ComboSelect.Root';

export interface ComboSelectInputProps {
    placeholder?: string;
    className?: string;
}

function ComboSelectInput({ placeholder = 'Select...', className }: ComboSelectInputProps) {
    const { setQuery, loading, placeholderIcon } = useComboSelectContext();

    return (
        <>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                {loading ? (
                    <LoaderIcon className="h-3.5 w-3.5 animate-spin text-[var(--color-primary)]" />
                ) : placeholderIcon ? (
                    <span className="flex items-center text-[var(--color-text-muted)]">
                        {placeholderIcon}
                    </span>
                ) : null}
            </div>
            <ComboboxInput
                className={cn(
                    comboSelectInputClass,
                    placeholderIcon || loading ? 'pl-8' : 'pl-3',
                    'pr-8',
                    loading && 'opacity-70',
                    className,
                )}
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') e.currentTarget.blur();
                }}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDownIcon className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            </ComboboxButton>
        </>
    );
}

ComboSelectInput.displayName = 'ComboSelect.Input';

export interface ComboSelectOptionsProps {
    children: ReactNode;
    emptyText?: string;
    className?: string;
}

function ComboSelectOptionsWrapper({ children, className }: ComboSelectOptionsProps) {
    return (
        <ComboboxOptions transition className={cn(comboSelectPopoverClass, className)}>
            {children}
        </ComboboxOptions>
    );
}

ComboSelectOptionsWrapper.displayName = 'ComboSelect.Options';

export interface ComboSelectOptionItemProps<T extends string | number = string> {
    value: T;
    children: ReactNode;
    className?: string;
}

function ComboSelectOptionItem<T extends string | number = string>({
    value,
    children,
    className,
}: ComboSelectOptionItemProps<T>) {
    return (
        <ComboboxOption value={value} className={cn(comboSelectOptionClass, className)}>
            {children}
        </ComboboxOption>
    );
}

ComboSelectOptionItem.displayName = 'ComboSelect.Option';

// --- Assemble ---

export const ComboSelect = Object.assign(ComboSelectSimple, {
    Root: ComboSelectRoot,
    Input: ComboSelectInput,
    Options: ComboSelectOptionsWrapper,
    Option: ComboSelectOptionItem,
});

export type { ComboSelectSingleProps, ComboSelectMultipleProps };
