import type { VariantDefinition, SizeDefinition } from '../../utils/types';

export const buttonVariants: Record<string, VariantDefinition> = {
    primary: {
        base: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
        hover: 'hover:bg-[var(--color-primary-hover)]',
        active: 'active:bg-[var(--color-primary-active)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2',
        outline:
            'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]',
    },
    secondary: {
        base: 'bg-[var(--color-stone-100)] text-[var(--color-stone-700)] dark:bg-[var(--color-stone-800)] dark:text-[var(--color-stone-300)]',
        hover: 'hover:bg-[var(--color-stone-200)] dark:hover:bg-[var(--color-stone-700)]',
        active: 'active:bg-[var(--color-stone-300)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2',
        outline:
            'border-2 border-[var(--color-stone-300)] text-[var(--color-stone-700)] hover:bg-[var(--color-stone-100)] dark:border-[var(--color-stone-600)] dark:text-[var(--color-stone-300)] dark:hover:bg-[var(--color-stone-800)]',
    },
    success: {
        base: 'bg-[var(--color-success)] text-[var(--color-success-foreground)]',
        hover: 'hover:bg-[var(--color-success-hover)]',
        active: 'active:bg-[var(--color-success-active)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-success)]/50 focus-visible:ring-offset-2',
        outline:
            'border-2 border-[var(--color-success)] text-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-[var(--color-success-foreground)]',
    },
    warning: {
        base: 'bg-[var(--color-warning)] text-[var(--color-warning-foreground)]',
        hover: 'hover:bg-[var(--color-warning-hover)]',
        active: 'active:bg-[var(--color-warning-active)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warning)]/50 focus-visible:ring-offset-2',
        outline:
            'border-2 border-[var(--color-warning)] text-[var(--color-warning)] hover:bg-[var(--color-warning)] hover:text-[var(--color-warning-foreground)]',
    },
    error: {
        base: 'bg-[var(--color-error)] text-[var(--color-error-foreground)]',
        hover: 'hover:bg-[var(--color-error-hover)]',
        active: 'active:bg-[var(--color-error-active)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-error)]/50 focus-visible:ring-offset-2',
        outline:
            'border-2 border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-[var(--color-error-foreground)]',
    },
    info: {
        base: 'bg-[var(--color-info)] text-[var(--color-info-foreground)]',
        hover: 'hover:bg-[var(--color-info-hover)]',
        active: 'active:bg-[var(--color-info-active)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)]/50 focus-visible:ring-offset-2',
        outline:
            'border-2 border-[var(--color-info)] text-[var(--color-info)] hover:bg-[var(--color-info)] hover:text-[var(--color-info-foreground)]',
    },
    ghost: {
        base: 'bg-transparent text-[var(--color-stone-700)] dark:text-[var(--color-stone-300)]',
        hover: 'hover:bg-[var(--color-stone-100)] dark:hover:bg-[var(--color-stone-800)]',
        active: 'active:bg-[var(--color-stone-200)] dark:active:bg-[var(--color-stone-700)]',
        focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2',
        outline:
            'border-2 border-[var(--color-stone-200)] text-[var(--color-stone-700)] hover:bg-[var(--color-stone-100)] dark:border-[var(--color-stone-700)] dark:text-[var(--color-stone-300)] dark:hover:bg-[var(--color-stone-800)]',
    },
};

export const buttonSizes: Record<string, SizeDefinition> = {
    xs: { padding: 'px-2 py-1', fontSize: 'text-xs', iconSize: 12, radius: 'rounded' },
    sm: { padding: 'px-3 py-1.5', fontSize: 'text-sm', iconSize: 14, radius: 'rounded-md' },
    md: { padding: 'px-4 py-2', fontSize: 'text-base', iconSize: 16, radius: 'rounded-lg' },
    lg: { padding: 'px-5 py-2.5', fontSize: 'text-lg', iconSize: 18, radius: 'rounded-xl' },
    xl: { padding: 'px-6 py-3', fontSize: 'text-xl', iconSize: 20, radius: 'rounded-2xl' },
};

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;
