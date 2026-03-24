/**
 * DateRangePicker Component
 * From/to date input pair with calendar icons. Props-only API.
 * Uses inline SVG instead of lucide-react Calendar.
 */

import * as React from 'react';
import { cn } from '../../utils/cn';
import {
    dateRangeWrapperClass,
    dateRangeInputClass,
    dateRangeSeparatorClass,
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
        <div className={cn(dateRangeWrapperClass, className)}>
            <div className="relative">
                <CalendarIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                <input
                    type="date"
                    value={from}
                    onChange={(e) => onFromChange(e.target.value)}
                    max={to || undefined}
                    className={cn(dateRangeInputClass, 'pl-8 w-[150px]')}
                    aria-label="From date"
                />
            </div>
            <span className={dateRangeSeparatorClass}>to</span>
            <div className="relative">
                <CalendarIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                <input
                    type="date"
                    value={to}
                    onChange={(e) => onToChange(e.target.value)}
                    min={from || undefined}
                    className={cn(dateRangeInputClass, 'pl-8 w-[150px]')}
                    aria-label="To date"
                />
            </div>
        </div>
    );
}
