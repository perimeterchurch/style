/**
 * FilterChip Component
 * Pill-shaped chip with optional remove button for filter displays
 */

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import type { BaseComponentProps } from '../../utils/types';
import { cn } from '../../utils/cn';
import {
    chipVariants,
    chipSizes,
    chipRemoveSizes,
    type ChipVariant,
    type ChipSize,
} from './FilterChip.variants';

type FilterChipElement = ElementRef<'span'>;

export interface FilterChipProps
    extends Omit<ComponentPropsWithoutRef<'span'>, 'children'>,
        BaseComponentProps {
    /** Chip label text */
    label: string;
    /** Callback when remove button is clicked */
    onRemove?: () => void;
    /** Visual variant */
    variant?: ChipVariant;
    /** Chip size */
    size?: ChipSize;
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

export const FilterChip = forwardRef<FilterChipElement, FilterChipProps>(
    ({ label, onRemove, variant = 'primary', size = 'md', className, ...props }, ref) => {
        const variantDef = chipVariants[variant];
        const sizeDef = chipSizes[size];

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center rounded-full font-medium',
                    'transition-all duration-200',
                    'hover:shadow-sm',
                    variantDef.base,
                    sizeDef.padding,
                    sizeDef.fontSize,
                    className,
                )}
                {...props}
            >
                {label}
                {onRemove && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className={cn(
                            'inline-flex items-center justify-center shrink-0',
                            'rounded-full opacity-60 hover:opacity-100 hover:scale-110',
                            'transition-all duration-150',
                            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current',
                        )}
                        aria-label={`Remove ${label}`}
                    >
                        <XIcon className={chipRemoveSizes[size]} />
                    </button>
                )}
            </span>
        );
    },
);

FilterChip.displayName = 'FilterChip';

export { chipVariants, chipSizes, chipRemoveSizes, type ChipVariant, type ChipSize };
