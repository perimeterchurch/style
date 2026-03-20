import type { VariantDefinition } from '../../utils/types';

export const searchInputVariants: Record<string, VariantDefinition> = {
    default: {
        base: [
            'h-10 w-full rounded-lg border pl-9 pr-9 text-sm',
            'bg-[var(--color-background)]',
            'border-[var(--color-input)]',
            'text-[var(--color-foreground)]',
            'placeholder:text-[var(--color-text-muted)]',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2',
            'focus-visible:border-[var(--color-primary)]',
        ].join(' '),
    },
};

export type SearchInputVariant = keyof typeof searchInputVariants;
