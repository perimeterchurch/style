import type { VariantDefinition } from '../../utils/types';

export const labelVariants: Record<string, VariantDefinition> = {
    default: {
        base: 'text-sm font-medium leading-none text-[var(--color-stone-900)] dark:text-[var(--color-stone-100)]',
    },
};

export type LabelVariant = keyof typeof labelVariants;
