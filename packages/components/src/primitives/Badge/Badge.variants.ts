import type { VariantDefinition, SizeDefinition } from '../../utils/types';

export const badgeVariants: Record<string, VariantDefinition> = {
    primary: {
        base: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
        outline: 'border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent',
    },
    secondary: {
        base: 'bg-[var(--color-stone-100)] text-[var(--color-stone-700)] dark:bg-[var(--color-stone-800)] dark:text-[var(--color-stone-300)]',
        outline:
            'border border-[var(--color-stone-300)] text-[var(--color-stone-700)] bg-transparent dark:border-[var(--color-stone-600)] dark:text-[var(--color-stone-300)]',
    },
    success: {
        base: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        outline:
            'border border-emerald-300 text-emerald-700 bg-transparent dark:border-emerald-600 dark:text-emerald-400',
    },
    warning: {
        base: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        outline:
            'border border-amber-300 text-amber-700 bg-transparent dark:border-amber-600 dark:text-amber-400',
    },
    error: {
        base: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
        outline:
            'border border-rose-300 text-rose-700 bg-transparent dark:border-rose-600 dark:text-rose-400',
    },
    info: {
        base: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
        outline:
            'border border-sky-300 text-sky-700 bg-transparent dark:border-sky-600 dark:text-sky-400',
    },
    ghost: {
        base: 'bg-transparent text-[var(--color-stone-600)] dark:text-[var(--color-stone-400)]',
        outline:
            'border border-[var(--color-stone-200)] text-[var(--color-stone-600)] bg-transparent dark:border-[var(--color-stone-700)] dark:text-[var(--color-stone-400)]',
    },
};

export const badgeDotColors: Record<string, string> = {
    primary: 'bg-[var(--color-primary)]',
    secondary: 'bg-[var(--color-stone-400)] dark:bg-[var(--color-stone-500)]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-sky-500',
    ghost: 'bg-[var(--color-stone-400)] dark:bg-[var(--color-stone-500)]',
};

export const badgeSizes: Record<string, SizeDefinition> = {
    sm: { padding: 'px-2 py-0.5', fontSize: 'text-xs' },
    md: { padding: 'px-2.5 py-1', fontSize: 'text-xs' },
};

export type BadgeVariant = keyof typeof badgeVariants;
export type BadgeSize = keyof typeof badgeSizes;
