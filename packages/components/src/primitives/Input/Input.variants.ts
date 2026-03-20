import type { SizeDefinition } from '../../utils/types';

/**
 * Input-specific copy of shared input classes (isolation per spec)
 */

export const inputBaseClasses = [
    'flex rounded-lg border bg-white',
    'transition-all duration-200',
    'dark:bg-[var(--color-stone-900)] dark:text-[var(--color-stone-100)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ');

export const inputSizeClasses: Record<string, string> = {
    xs: 'h-7 px-2 py-1',
    sm: 'h-8 px-2.5 py-1.5',
    md: 'h-10 px-3 py-2',
    lg: 'h-12 px-4 py-2.5',
    xl: 'h-14 px-5 py-3',
};

export const inputTextSizes: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
};

export const inputSizes: Record<string, SizeDefinition> = {
    xs: { padding: 'px-2 py-1', fontSize: 'text-xs' },
    sm: { padding: 'px-2.5 py-1.5', fontSize: 'text-sm' },
    md: { padding: 'px-3 py-2', fontSize: 'text-base' },
    lg: { padding: 'px-4 py-2.5', fontSize: 'text-lg' },
    xl: { padding: 'px-5 py-3', fontSize: 'text-xl' },
};

export function getInputBorderClasses(hasError: boolean): string {
    return hasError
        ? 'border-[var(--color-error)] focus-visible:ring-[var(--color-error)]/50'
        : 'border-[var(--color-stone-300)] dark:border-[var(--color-stone-600)]';
}

export type InputSize = keyof typeof inputSizes;
