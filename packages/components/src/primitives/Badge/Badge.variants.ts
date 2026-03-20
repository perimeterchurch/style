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
        base: 'bg-[var(--color-success)]/10 text-[var(--color-success)] dark:bg-[var(--color-success)]/10 dark:text-[var(--color-success)]',
        outline:
            'border border-[var(--color-success)] text-[var(--color-success)] bg-transparent dark:border-[var(--color-success)] dark:text-[var(--color-success)]',
    },
    warning: {
        base: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] dark:bg-[var(--color-warning)]/10 dark:text-[var(--color-warning)]',
        outline:
            'border border-[var(--color-warning)] text-[var(--color-warning)] bg-transparent dark:border-[var(--color-warning)] dark:text-[var(--color-warning)]',
    },
    error: {
        base: 'bg-[var(--color-error)]/10 text-[var(--color-error)] dark:bg-[var(--color-error)]/10 dark:text-[var(--color-error)]',
        outline:
            'border border-[var(--color-error)] text-[var(--color-error)] bg-transparent dark:border-[var(--color-error)] dark:text-[var(--color-error)]',
    },
    info: {
        base: 'bg-[var(--color-info)]/10 text-[var(--color-info)] dark:bg-[var(--color-info)]/10 dark:text-[var(--color-info)]',
        outline:
            'border border-[var(--color-info)] text-[var(--color-info)] bg-transparent dark:border-[var(--color-info)] dark:text-[var(--color-info)]',
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
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]',
    info: 'bg-[var(--color-info)]',
    ghost: 'bg-[var(--color-stone-400)] dark:bg-[var(--color-stone-500)]',
};

export const badgeSizes: Record<string, SizeDefinition> = {
    sm: { padding: 'px-2 py-0.5', fontSize: 'text-xs' },
    md: { padding: 'px-2.5 py-1', fontSize: 'text-xs' },
};

export type BadgeVariant = keyof typeof badgeVariants;
export type BadgeSize = keyof typeof badgeSizes;
