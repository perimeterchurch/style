/**
 * DateRangePicker Component
 * From/to date input pair with calendar icons. Props-only API.
 * Uses inline SVG instead of lucide-react Calendar.
 */

import * as React from 'react';
import { cn } from '../../utils/cn';
import {
    dateRangePickerWrapperClasses,
    dateRangePickerInputClasses,
    dateRangePickerSeparatorClasses,
    dateRangePickerIconClasses,
} from './DateRangePicker.variants';

// --- Inline SVG ---

function CalendarIcon({ className }: { className?: string }) {
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
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
    );
}

// --- Types ---

export interface DateRangePickerProps {
    from: string;
    to: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
    className?: string;
}

// --- Component ---

export function DateRangePicker({
    from,
    to,
    onFromChange,
    onToChange,
    className,
}: DateRangePickerProps) {
    return (
        <div className={cn(dateRangePickerWrapperClasses, className)}>
            <div className="relative">
                <CalendarIcon className={dateRangePickerIconClasses} />
                <input
                    type="date"
                    value={from}
                    onChange={(e) => onFromChange(e.target.value)}
                    max={to || undefined}
                    className={cn(dateRangePickerInputClasses, 'pl-8 w-[150px]')}
                    aria-label="From date"
                />
            </div>
            <span className={dateRangePickerSeparatorClasses}>to</span>
            <div className="relative">
                <CalendarIcon className={dateRangePickerIconClasses} />
                <input
                    type="date"
                    value={to}
                    onChange={(e) => onToChange(e.target.value)}
                    min={from || undefined}
                    className={cn(dateRangePickerInputClasses, 'pl-8 w-[150px]')}
                    aria-label="To date"
                />
            </div>
        </div>
    );
}
