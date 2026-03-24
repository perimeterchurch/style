/**
 * SearchInput Component
 * Search input with debounce, search icon, and clear button
 */

import * as React from 'react';
import { useState, useEffect, useRef, useCallback, forwardRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';

type SearchInputElement = ElementRef<'div'>;

export interface SearchInputProps extends BaseComponentProps {
    /** Current search value */
    value: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Debounce delay in ms */
    debounce?: number;
    /** Additional CSS classes */
    className?: string;
}

/** Inline Search SVG (replaces lucide-react Search) */
function SearchIcon({ className }: { className?: string }) {
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

/** Inline X SVG (replaces lucide-react X) */
function XIcon({ className }: { className?: string }) {
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

export const SearchInput = forwardRef<SearchInputElement, SearchInputProps>(
    ({ value, onChange, placeholder = 'Search...', debounce = 300, className, ...props }, ref) => {
        const [localValue, setLocalValue] = useState(value);
        const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

        useEffect(() => {
            setLocalValue(value);
        }, [value]);

        const debouncedOnChange = useCallback(
            (val: string) => {
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => onChange(val), debounce);
            },
            [onChange, debounce],
        );

        useEffect(
            () => () => {
                if (timerRef.current) clearTimeout(timerRef.current);
            },
            [],
        );

        const handleChange = (val: string) => {
            setLocalValue(val);
            debouncedOnChange(val);
        };

        const handleClear = () => {
            setLocalValue('');
            if (timerRef.current) clearTimeout(timerRef.current);
            onChange('');
        };

        return (
            <div ref={ref} className={cn('search-input', className)} {...props}>
                <div className="search-input-icon">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    value={localValue}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            handleClear();
                            e.currentTarget.blur();
                        }
                    }}
                    placeholder={placeholder}
                    aria-label={placeholder}
                />
                {localValue && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="search-input-clear"
                        aria-label="Clear search"
                    >
                        <XIcon />
                    </button>
                )}
            </div>
        );
    },
);

SearchInput.displayName = 'SearchInput';

export type { SearchInputVariant } from './SearchInput.variants';
