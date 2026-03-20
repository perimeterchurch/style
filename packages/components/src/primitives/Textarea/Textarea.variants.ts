import type { SizeDefinition } from '../../utils/types';

/**
 * Textarea-specific copy of shared input classes (isolation per spec)
 */

export const textareaBaseClasses = [
    'flex rounded-lg border bg-white',
    'transition-all duration-200',
    'dark:bg-stone-900 dark:text-stone-100',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ');

export const textareaTextSizes: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
};

export const textareaSizes: Record<string, SizeDefinition> = {
    xs: { padding: 'px-2 py-1', fontSize: 'text-xs' },
    sm: { padding: 'px-2.5 py-1.5', fontSize: 'text-sm' },
    md: { padding: 'px-3 py-2', fontSize: 'text-base' },
    lg: { padding: 'px-4 py-2.5', fontSize: 'text-lg' },
    xl: { padding: 'px-5 py-3', fontSize: 'text-xl' },
};

export function getTextareaBorderClasses(hasError: boolean): string {
    return hasError
        ? 'border-[var(--color-error)] focus-visible:ring-[var(--color-error)]/50'
        : 'border-stone-300 dark:border-stone-600';
}

export type TextareaSize = keyof typeof textareaSizes;
