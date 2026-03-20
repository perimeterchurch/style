/**
 * Pagination Component
 * Page navigation with ellipsis truncation. Props-only API.
 * Uses inline SVGs instead of lucide-react.
 */

import { useMemo } from 'react';
import { cn } from '../../utils/cn';
import {
    paginationNavClasses,
    paginationButtonBaseClasses,
    paginationButtonDefaultClasses,
    paginationButtonActiveClasses,
    paginationButtonDisabledClasses,
    paginationEllipsisClasses,
} from './Pagination.variants';

// --- Inline SVGs ---

function ChevronLeftIcon({ className }: { className?: string }) {
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
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function ChevronRightIcon({ className }: { className?: string }) {
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
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}

// --- Types ---

export interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
    maxButtons?: number;
    className?: string;
}

// --- Helpers ---

function getPageNumbers(
    current: number,
    total: number,
    max: number,
): (number | 'ellipsis')[] {
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | 'ellipsis')[] = [];
    const sideCount = Math.floor((max - 3) / 2);
    pages.push(1);
    const leftBound = Math.max(2, current - sideCount);
    const rightBound = Math.min(total - 1, current + sideCount);
    if (leftBound > 2) pages.push('ellipsis');
    for (let i = leftBound; i <= rightBound; i++) pages.push(i);
    if (rightBound < total - 1) pages.push('ellipsis');
    if (total > 1) pages.push(total);
    return pages;
}

// --- Component ---

export function Pagination({
    page,
    totalPages,
    onChange,
    maxButtons = 7,
    className,
}: PaginationProps) {
    const pages = useMemo(
        () => getPageNumbers(page, totalPages, maxButtons),
        [page, totalPages, maxButtons],
    );

    if (totalPages <= 1) return null;

    return (
        <nav
            aria-label="Pagination"
            className={cn(paginationNavClasses, className)}
        >
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
                className={cn(
                    paginationButtonBaseClasses,
                    paginationButtonDefaultClasses,
                    paginationButtonDisabledClasses,
                )}
            >
                <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {pages.map((p, i) =>
                p === 'ellipsis' ? (
                    <span key={`ellipsis-${i}`} className={paginationEllipsisClasses}>
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onChange(p)}
                        aria-label={`Page ${p}`}
                        aria-current={p === page ? 'page' : undefined}
                        className={cn(
                            paginationButtonBaseClasses,
                            p === page
                                ? paginationButtonActiveClasses
                                : paginationButtonDefaultClasses,
                        )}
                    >
                        {p}
                    </button>
                ),
            )}
            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
                className={cn(
                    paginationButtonBaseClasses,
                    paginationButtonDefaultClasses,
                    paginationButtonDisabledClasses,
                )}
            >
                <ChevronRightIcon className="h-4 w-4" />
            </button>
        </nav>
    );
}
