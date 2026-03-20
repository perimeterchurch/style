import type { VariantDefinition } from '../../utils/types';

export const cardVariants: Record<string, VariantDefinition> = {
    default: {
        base: 'rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)] shadow-sm transition-all duration-200',
    },
};

export type CardVariant = keyof typeof cardVariants;
