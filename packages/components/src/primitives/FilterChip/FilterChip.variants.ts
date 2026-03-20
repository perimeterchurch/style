import type { VariantDefinition, SizeDefinition } from '../../utils/types';

export const chipVariants: Record<string, VariantDefinition> = {
    primary: {
        base: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:text-[var(--color-primary)]',
    },
    secondary: {
        base: 'bg-[var(--color-stone-100)] text-[var(--color-stone-700)] dark:bg-[var(--color-stone-800)] dark:text-[var(--color-stone-300)]',
    },
    success: {
        base: 'bg-[var(--color-success)]/10 text-[var(--color-success)] dark:bg-[var(--color-success)]/10 dark:text-[var(--color-success)]',
    },
    warning: {
        base: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] dark:bg-[var(--color-warning)]/10 dark:text-[var(--color-warning)]',
    },
    error: {
        base: 'bg-[var(--color-error)]/10 text-[var(--color-error)] dark:bg-[var(--color-error)]/10 dark:text-[var(--color-error)]',
    },
    info: {
        base: 'bg-[var(--color-info)]/10 text-[var(--color-info)] dark:bg-[var(--color-info)]/10 dark:text-[var(--color-info)]',
    },
    ghost: {
        base: 'bg-transparent text-[var(--color-stone-600)] dark:text-[var(--color-stone-400)] border border-[var(--color-stone-200)] dark:border-[var(--color-stone-700)]',
    },
};

export const chipSizes: Record<string, SizeDefinition> = {
    xs: { padding: 'px-1.5 py-0.5 gap-1', fontSize: 'text-xs' },
    sm: { padding: 'px-2 py-0.5 gap-1', fontSize: 'text-xs' },
    md: { padding: 'px-2.5 py-1 gap-1.5', fontSize: 'text-sm' },
    lg: { padding: 'px-3 py-1.5 gap-1.5', fontSize: 'text-sm' },
    xl: { padding: 'px-3.5 py-2 gap-2', fontSize: 'text-base' },
};

export const chipRemoveSizes: Record<string, string> = {
    xs: 'h-3 w-3',
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
    xl: 'h-4.5 w-4.5',
};

export type ChipVariant = keyof typeof chipVariants;
export type ChipSize = keyof typeof chipSizes;
